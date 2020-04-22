import React, {Component} from 'react'
import './chat_room.css'
import $ from 'jquery';
import Websocket from 'react-websocket';
import Home from './home.png'
import Button from '@material-ui/core/Button';
import * as FilePond from 'filepond';
import {FilePicker} from 'react-file-picker'
import sha256 from 'crypto-js/sha256';
import hmacSHA512 from 'crypto-js/hmac-sha512';
import Base64 from 'crypto-js/enc-base64';
import ProgressBar from "react-bootstrap/ProgressBar";
import {Progress} from 'antd';
import CircularProgress from '@material-ui/core/CircularProgress';
import ReactDOM from 'react-dom'

import {CircularProgressbar} from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import PublishIcon from '@material-ui/icons/Publish';
import PlayCircleFilledWhiteIcon from '@material-ui/icons/PlayCircleFilledWhite';
import HomeIcon from '@material-ui/icons/Home';

var percant = 0;

class chat_room extends Component {


    componentDidMount() {


        if (window.localStorage.getItem('token') == null) {

            alert("Login first !");

            window.location.replace("/login/");

        }
        $('.homebtn').click(function () {
window.location.replace('/homepage/');
        });
        var id_gp = window.localStorage.getItem('id_gp');
        //id_gp = "test";
        //This will open the connection*
        var ws = new WebSocket("ws://127.0.0.1:8000/stream/groups/" + id_gp + "/?token=" + localStorage.getItem('token') + "");
        ws.onopen = function () {
            console.log("Ping");
        };


        const {id} = this.props.match.params
        $(document).ready(function () {


            $('#videopicks').change(function () {
                $('#videopickbtn').fadeOut();
                $('#progress').fadeIn();
            });

            // if (localStorage.getItem('token') == null) {
            //     alert("Login please !");
            //     window.location.replace("/login/");
            // }

            var id = window.localStorage.getItem('id_gp');
            var settings = {
                "url": "http://127.0.0.1:8000/groups/" + id + '/',
                "method": "GET",
                "timeout": 0,
                "headers": {
                    //'X-CSRFToken': csrftoken,
                    //  "Authorization": "token " + token,
                    "accept": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Headers": "*",
                    "Content-Type": "application/json"
                }
            };

            $.ajax(settings).done(function (response) {

                console.log("111111");
                console.log(response);
                for (var i = 0; i < response.members.length; i++) {
                    var hoverout = 'onMouseOut="this.style.color=';
                    var hoverrout = hoverout + "'white'";
                    var htmlcode = '';
                    var hover = 'onMouseOver="this.style.color=';
                    var hoverr = hover + "'red'";

                    htmlcode += '<p class="mygroups" id=' + '"c' + i + '"' + hoverr + '"' + hoverrout + '"' + '>' + response.members[i] + ' - </p>';
                    $(".textarea_member").append(htmlcode);

                    console.log("2")
                    //$(".textarea_member").append(response.members[i] + "\n")

                }
                $(".textarea_bio").append(response.describtion + "\n")
                $(".name").append(response.title);
            });
        });


        //Log the messages that are returned from the server

    }


    onChange(e) {
        function callbackRead(reader, file, evt, callbackProgress, callbackFinal) {
            callbackProgress(evt.target.result);
            if (reader.offset + reader.size >= file.size) {
                callbackFinal();
            }
        }


        function loading(file, callbackProgress, callbackFinal) {
            var chunkSize = 1024 * 1024; // bytes
            var offset = 0;
            var size = chunkSize;
            var partial;
            var index = 0;

            if (file.size === 0) {
                callbackFinal();
            }
            while (offset < file.size) {

                partial = file.slice(offset, offset + size);
                var reader = new FileReader;
                reader.size = chunkSize;
                reader.offset = offset;
                reader.index = index;
                reader.onload = function (evt) {

                    callbackRead(this, file, evt, callbackProgress, callbackFinal);
                };
                reader.readAsArrayBuffer(partial);
                offset += chunkSize;
                index += 1;
            }
        }

        var CryptoJS = require("crypto-js");
        var file = e.target.files[0];
        var SHA256 = CryptoJS.algo.SHA256.create();
        var counter = 0;
        var self = this;

        loading(file, function (data) {

            var wordBuffer = CryptoJS.lib.WordArray.create(data);
            SHA256.update(wordBuffer);
            counter += data.byteLength;
            percant = ((counter / file.size) * 100).toFixed(0);
            console.log("pp : " + percant);
            console.log(((counter / file.size) * 100).toFixed(0) + '%');


        }, function (data) {

            console.log('100%');
            var encrypted = SHA256.finalize().toString();
            console.log('encrypted: ' + encrypted);
            document.getElementById('progress').style.display = 'none';
            document.getElementById('blaybtndiv').style.display = 'block';

        });
        console.log("aa");

    }


    render() {


        return (

            <div>


                < form className="back">


                    <header class="header_s">
                        <div className="div_center">

                            <HomeIcon className='homebtn' style={{
                                cursor:'pointer',
                                fontSize:'50px',
                                marginTop:'15px',
                                marginLeft:'10px'
                            }}/>

                            <div className="name"/>
                        </div>
                    </header>
                    <div className="formback_movie">
                        <div id='blaybtndiv'>
                            <Button startIcon={<PlayCircleFilledWhiteIcon/>} style={{
                                backgroundColor: 'red',

                            }} size='large' id='playbtnid' variant="contained" color="secondary">
                                <p>Play</p>
                            </Button>
                        </div>

                        <div className='moviebtns'>

                            <div className="upload-btn-wrapper">
                                <Button startIcon={<PublishIcon/>} style={{
                                    backgroundColor: 'rgba(255,0,0)',
                                }} size='large' id='videopickbtn' className="btn" variant="contained" color="secondary">
                                    <p>Select a video</p>
                                </Button>

                                <input type="file" id='videopicks' className='videopicsk' name="file"
                                       onChange={(e) => this.onChange(e)}/>
                                <br/><br/><br/><br/>
                                <div id='progress'>
                                    <CircularProgress disableShrink color="secondary"/>
                                </div>

                            </div>

                        </div>


                    </div>
                    <div className="back_coulom">

                        <div className="formback_info" style={{width: '350px', height: '395px'}}>

                            <div className="textarea_member" style={{overflowY: 'scroll'}}/>
                            <div className="textarea_bio"/>
                        </div>
                        <div className="formback_text" style={{width: '350px', height: '395px',}}>


                        </div>


                    </div>


                </form>
            </div>
        )
    }
}

export default chat_room;

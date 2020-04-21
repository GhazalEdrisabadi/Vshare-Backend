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


class chat_room extends Component {

    componentDidMount() {
        if (window.localStorage.getItem('token') == null) {

            alert("Login first !");

            window.location.replace("/login/");

        }
        var id_gp = window.localStorage.getItem('id_gp');
        //id_gp = "test";
        //This will open the connection*
        var ws = new WebSocket("ws://127.0.0.1:8000/stream/groups/" + id_gp + "/?token=" + localStorage.getItem('token') + "");
        ws.onopen = function () {
            console.log("Ping");
        };


        const {id} = this.props.match.params
        $(document).ready(function () {


            $('.videopicsk').change(function () {
                console.log($('.videopicsk').files);
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

        var lastOffset = 0;

        function callbackRead(reader, file, evt, callbackProgress, callbackFinal) {
            if (lastOffset === reader.offset) {
                // in order chunk
                lastOffset = reader.offset + reader.size;
                callbackProgress(evt.target.result);
                if (reader.offset + reader.size >= file.size) {
                    callbackFinal();
                }
            } else {
                // not in order chunk
                setTimeout(function () {
                    callbackRead(reader, file, evt, callbackProgress, callbackFinal);
                }, 10);
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
        loading(file,
            function (data) {
                var wordBuffer = CryptoJS.lib.WordArray.create(data);
                SHA256.update(wordBuffer);
                counter += data.byteLength;
                console.log(((counter / file.size) * 100).toFixed(0) + '%');
            }, function (data) {
                console.log('100%');
                var encrypted = SHA256.finalize().toString();
                console.log('encrypted: ' + encrypted);
            });
        /*
                let files = e.target.files;
                let reader = new FileReader();
                reader.readAsDataURL(files[0]);
                reader.onload = (e) => {

                    console.log(e.target.result);
                }
            */
    }


    render() {


        return (

            <div>


                < form className="back">
                    <header class="header_s">
                        <div className="div_center">


                            <div className="div_icon"><a href='../homepage'><img src={Home} className="icon"/></a></div>
                            <div className="name"/>
                        </div>
                    </header>
                    <div className="formback_movie">


                        <div className="upload-btn-wrapper">
                            <Button style={{
                                backgroundColor: 'red',
                            }} size='large' className="btn" variant="contained" color="secondary">
                                <p>Upload a file</p>
                            </Button>

                            <input type="file" className='videopicsk' name="file" onChange={(e) => this.onChange(e)}/>
                        </div>


                    </div>
                    <div className="back_coulom">

                        <div className="formback_info" style={{width: '115%', height: '410px'}}>
                            <legend className="title_gp">info of group</legend>
                            <div className="textarea_member" style={{overflowY: 'scroll'}}/>
                            <div className="textarea_bio"/>
                        </div>
                        <div className="formback_text" style={{width: '115%', height: '410px',}}>


                        </div>


                    </div>


                </form>
            </div>
        )
    }
}

export default chat_room;

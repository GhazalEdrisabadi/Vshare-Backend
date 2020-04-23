import React, { Component } from 'react'
import './chat_room.css'
import $ from 'jquery';
import Websocket from 'react-websocket';
import Home from './home.png'
import Button from '@material-ui/core/Button';

import ReactPlayer from 'react-player'
import sha256 from 'crypto-js/sha256';
import hmacSHA512 from 'crypto-js/hmac-sha512';
import Base64 from 'crypto-js/enc-base64';


import CircularProgress from '@material-ui/core/CircularProgress';



import PublishIcon from '@material-ui/icons/Publish';
import PlayCircleFilledWhiteIcon from '@material-ui/icons/PlayCircleFilledWhite';
import HomeIcon from '@material-ui/icons/Home';
var percant = 0;
var id_gp = window.localStorage.getItem('id_gp')
const url="ws://127.0.0.1:8000/stream/groups/" + id_gp + "/?token=" + localStorage.getItem('token') + ""
var encrypted
 var ws = new WebSocket(url);
class chat_room extends Component {

    componentDidMount() {
        console.log(localStorage.getItem('token'))

        //  id_gp = "test";
        //This will open the connection*

       ws.onopen = function () {
            console.log("Ping");
        };
       ws.onmessage = evt => {
            const messagee = JSON.parse(evt.data)
            this.setState({server_pm: messagee})
            console.log(messagee)
            console.log(+ messagee.message)
        };

        const {id} = this.props.match.params
        $(document).ready(function () {
            var localresponse;

            if (window.localStorage.getItem('token') == null) {

                alert("Login first !");

                window.location.replace("/login/");

            }
            $('.homebtn').click(function () {
                window.location.replace('/homepage/');
            });

            //id_gp = "test";
            //This will open the connection*

            // setTimeout(function () {
            //     if (localresponse.created_by == window.localStorage.getItem('username')) {
            //         document.getElementById('moviebtnd').style.display = 'block';
            //         document.getElementById('movietxt').style.display = 'none';
            //
            //         //$('#videopickbtn').fadeIn('fast');
            //         //    $('#movietxt').fadeOut('fast');
            //
            //     } else {
            //         document.getElementById('moviebtnd').style.display = 'none';
            //         document.getElementById('movietxt').style.display = 'block';
            //         //   $('#videopickbtn').fadeOut('fast');
            //         // $('#movietxt').fadeIn('fast');
            //     }
            // }, 1000);


            $('#videopicks').change(function () {
                if (localresponse.created_by == window.localStorage.getItem('username')) {
                    $('#videopickbtn').fadeOut();
                    $('#progress').fadeIn();
                } else {

                }
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
                localresponse = response;
                console.log("111111");
                console.log(response);
                /*  for (var i = 0; i < response.members.length; i++) {
                      var hoverout = 'onMouseOut="this.style.color=';
                      var hoverrout = hoverout + "'white'";
                      var htmlcode = '';
                      var hover = 'onMouseOver="this.style.color=';
                      var hoverr = hover + "'red'";

                      htmlcode += '<p class="mygroups" id=' + '"c' + i + '"' + hoverr + '"' + hoverrout + '"' + '>' + response.members[i] + ' - </p>';
                      $(".textarea_member").append(htmlcode);

                      console.log("2")
                      //$(".textarea_member").append(response.members[i] + "\n")

                  }*/
                //  $(".textarea_bio").append(response.describtion + "\n")
                $(".name").append(response.title);
            });
        });


        //Log the messages that are returned from the server


    }


    constructor(props) {
        super(props)
        this.state = {
            marhale: 0,
            file_select: null,
            file_show_when_click: null,
            server_pm: "",
            hash_:""
        }
        this.onChange = this.onChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    //handleChange(event) {
    //    this.setState({
    //        file_select: URL.createObjectURL(event.target.files[0])
    //    })
    //}
    handleSubmit(e) {

        this.setState({
            file_show_when_click: this.state.file_select
        })
        console.log("onchange")
        document.getElementById('movie').style.display = 'block';
    }


    onChange(e) {
        this.setState({
            file_select: URL.createObjectURL(e.target.files[0])
        })

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

        function Send_data() {
                           const message_send = {room:id_gp, hash:encrypted }
                           const command_={"command":"send"}
   // ws.send(JSON.stringify(message_send))
      ws.send(JSON.stringify(command_))
console.log(JSON.stringify(command_))
        }

        loading(file, function (data) {

            var wordBuffer = CryptoJS.lib.WordArray.create(data);
            SHA256.update(wordBuffer);
            counter += data.byteLength;
            percant = ((counter / file.size) * 100).toFixed(0);
            console.log("pp : " + percant);
            console.log(((counter / file.size) * 100).toFixed(0) + '%');


        }, function (data) {

            console.log('100%');
             encrypted = SHA256.finalize().toString();
            console.log('encrypted: ' + encrypted);

            // eslint-disable-next-line no-undef
            Send_data();
            document.getElementById('progress').style.display = 'none';
            document.getElementById('blaybtndiv').style.display = 'block';

        });

        console.log("aa");
    }

    Send_data(){

        }
    render() {


        return (

            <div>


                < form className="back">


                    <header class="header_s">
                        <div className="div_center">

                            <HomeIcon className='homebtn' style={{
                                cursor: 'pointer',
                                fontSize: '50px',
                                marginTop: '15px',
                                marginLeft: '10px'
                            }}/>


                            <div className="name"/>
                        </div>
                    </header>
                    <div className="formback_movie">


                        <ReactPlayer id="movie" className="video" url={this.state.file_show_when_click} playing/>


                        <div id='blaybtndiv'>
                            <Button onClick={this.handleSubmit} startIcon={<PlayCircleFilledWhiteIcon/>} style={{
                                backgroundColor: 'red',

                            }} size='large' id='playbtnid' variant="contained" color="secondary">
                                <p>Play</p>
                            </Button>
                        </div>
                        <p id='movietxt'>Wait for admin to select the movie</p>
                        <div id='moviebtnd' className='moviebtns'>

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

import React, {Component} from 'react'

import './chat_room.css'

import $ from 'jquery';

import Websocket from 'react-websocket';

import Home from './home.png'

import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import RedoIcon from '@material-ui/icons/Redo';


import './video-react.css';

import {Player, ControlBar, PlayToggle, Shortcut} from 'video-react';

import sha256 from 'crypto-js/sha256';

import hmacSHA512 from 'crypto-js/hmac-sha512';

import Base64 from 'crypto-js/enc-base64';


import CircularProgress from '@material-ui/core/CircularProgress';

import PublishIcon from '@material-ui/icons/Publish';

import PlayCircleFilledWhiteIcon from '@material-ui/icons/PlayCircleFilledWhite';

import HomeIcon from '@material-ui/icons/Home';
import {Dropdown} from 'react-bootstrap';

import IconButton from "@material-ui/core/IconButton";

import AccountCircleOutlinedIcon from "@material-ui/icons/AccountCircleOutlined";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import {TextField} from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';
import CloseIcon from '@material-ui/icons/Close';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import Forward10Icon from '@material-ui/icons/Forward10';
import EjectIcon from '@material-ui/icons/Eject';
import StopIcon from '@material-ui/icons/Stop';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import Select from 'react-select';

var Able_chat = 0;
var Able_controll = 0;
var Able_select = 0;
var adminisinstatezero = 1;
var logoutclicked = 0;
var azavalbude = 0;
var percant = 0;
var uploaded = 0;
var muted = 0;

var id_gp = window.localStorage.getItem('id_gp')
const url = "ws://127.0.0.1:8000/stream/groups/" + id_gp + "/?token=" + localStorage.getItem('token') + ""
const url1 = "ws://127.0.0.1:8000/chat/groups/" + id_gp + "/?token=" + localStorage.getItem('token') + ""
var ws1 = new WebSocket(url1)
var encrypted

var rejoined = 0;
var played = 0;
var messagee1;


var ws = new WebSocket(url);

var adminhash;

var localresponse;

var play_or_no;

var clienthashok = 0;

var iscontroller = 0;
var isselector = 0;
var isadmin = window.localStorage.getItem('isadmin');
var filmplayed = 0;
var comeinstate1 = 0;
var Play_pause_space = 0;
var usercolors = {};
var chatsize;

var create_by = null

const options = [

    {value: '1', label: 'Able to select video'},
    {value: '2', label: 'Able to controll the playback'},
]
var op = []
var per = []
var per_add = []
var member_edit

class chat_room extends Component {


    componentWillUnmount() {
        document.removeEventListener("keyup", this.escFunction, false);
    }

    componentDidMount() {

        var sizeeeeee = $(".formback_movie").width();
    
        $(window).resize(function () {
            chatsize = $(".back_coulom").width();
            if (document.getElementById("mySidenav").style.width == "0px") {
                var sizeeeeee = $(".formback_movie").width();
                $(".video-react-video").css("width", sizeeeeee.toString());
                $(".video-react-video").css("margin-left", '0px');
            } else {
                sizeeeeee = $(".formback_movie").width();
                $(".video-react-video").css("width", sizeeeeee.toString() + '50px');
                $(".video-react-video").css("margin-left", '210px');
            }
        });
        $('.openonlinemember').click(function () {
            var sizeeeeee = $(".formback_movie").width();
            if ($(".sidenav").width() < 20) {
                document.getElementById("mySidenav").style.width = "300px";
                if ($(window).width() < 800) {
                    chatsize = $(".back_coulom").width();
                    $(".back_coulom").css("width", "0px");
                    $(".openchat").css("transform", "scaleX(1)");
                    sizeeeeee += chatsize;
                    $(".video-react-video").css("width", sizeeeeee.toString() + 'px');
                    $(".video-react-video").css("margin-right", '0px');
                }
                $(".openonlinemember").css("transform", "scaleX(1)");
            
                $(".video-react-video").css("width", sizeeeeee.toString() + 'px');
                $(".video-react-video").css("margin-left", '200px');


            } else {
                document.getElementById("mySidenav").style.width = "0px";
                $(".openonlinemember").css("transform", "scaleX(-1)");
              
                $(".video-react-video").css("width", sizeeeeee.toString() + 'px');
                $(".video-react-video").css("margin-left", '200px');
            }
            sizeeeeee = $(".formback_movie").width();
        });

        $('.openchat').click(function () {

    
            if ($(".back_coulom").width() > 0)
                chatsize = $(".back_coulom").width();

            if ($(".back_coulom").width() == 0) {
                $(".back_coulom").css("width", "400px");

                if ($(window).width() < 800) {
                    document.getElementById("mySidenav").style.width = "0px";
                    $(".openonlinemember").css("transform", "scaleX(-1)");
                    sizeeeeee += 300;
                    $(".video-react-video").css("width", sizeeeeee.toString() + 'px');
                    $(".video-react-video").css("margin-left", '4%');
                }

                $(".openchat").css("transform", "scaleX(-1)");

                $(".video-react-video").css("width", sizeeeeee.toString() + 'px');
                $(".video-react-video").css("margin-right", '300px');

            } else {

                $(".back_coulom").css("width", "0px");

                $(".openchat").css("transform", "scaleX(1)");

              
                $(".video-react-video").css("width", sizeeeeee.toString() + 'px');
                $(".video-react-video").css("margin-right", '300px');

            }
            sizeeeeee = $(".formback_movie").width();
           

        });

   
        document.addEventListener("keyup", this.handlereq_forward_backward, false);

     

        ws.onopen = function () {

            

        };
        ws1.onopen = function () {
         

        }


        ws1.onmessage = evt => {
            messagee1 = JSON.parse(evt.data);
            


            if (messagee1.command == "chat_client") {

                var aval = 'style=';
                var dovom = aval + '"color:';
                var sevom = dovom + usercolors[messagee1.user];
                
                var charom = sevom + '"';
                var d = 'document.getElementById("mymutemodal")';

                var dd = d + '.style.display="block"';

                var a = 'window.localStorage.setItem("muteuser","' + messagee1.user + '")';

                if (messagee1.user == window.localStorage.getItem('username')) {

                    $(".pm").append("<div id='pmeman'" + charom + ">" + "me: &nbsp;</div><div  id='pmemantxt'>" + messagee1.message + "</div>");

                } else {
                    $(".pm").append("<div onclick='" + dd + "," + a + "' id='pmeoon'" + charom + ">" + messagee1.user + ": &nbsp; </div><div  id='pmemantxt'>" + messagee1.message + "</div>");
                }

                var element = document.getElementById("pmid");
                element.scrollTop = element.scrollHeight;


            }
            if (messagee1.message == 'isoffline' || messagee1.message == 'isonline') {
              

                setTimeout(function () {
                    $('.onlinemembers').html('');
                    var settings = {
                        "url": "http://127.0.0.1:8000/group/online_users/?group=" + id,
                        "method": "GET",
                        "timeout": 0,
                        "headers": {
               
                            "accept": "application/json",
                            "Access-Control-Allow-Origin": "*",
                            "Access-Control-Allow-Headers": "*",
                            "Content-Type": "application/json"
                        }
                    };

                    $.ajax(settings).done(function (response) {
                      
                        for (var onlinememberscounter = 0; onlinememberscounter < response.length; onlinememberscounter++) {
 
                            var randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);


                            var letters = 'BCDEF'.split('');
                            var color = '#';
                            for (var i = 0; i < 6; i++) {
                                color += letters[Math.floor(Math.random() * letters.length)];
                            }


                            var color2 = "hsl(" + Math.random() * 360 + ", 100%, 75%)";
                            if (usercolors[response[onlinememberscounter].online_user] == null)
                                usercolors[response[onlinememberscounter].online_user] = color2;
                            var aval = 'style=';
                            var dovom = aval + '"color:';
                            var sevom = dovom + usercolors[response[onlinememberscounter].online_user];
                           
                            var charom = sevom + '"';
                            $('.onlinemembers').append('<p id="members"' + charom + '>' + response[onlinememberscounter].online_user + '</p>');
                        }
                       
                    });

                }, 250);


            }

            if (messagee1.message == 'you must be in the group and have permission to send messages!') {
                var x = document.getElementById("snackbar-mute-warning");
                x.className = "show";
                setTimeout(function () {
                    x.className = x.className.replace("show", "");
                }, 3000);

            }


        }

        ws.onmessage = evt => {



            const messagee = JSON.parse(evt.data);

            this.setState({server_pm: messagee});

            if (logoutclicked == 0 && ("group was reset!" == messagee.message || "Nothing to reset in this state!" == messagee.message)) {
                window.location.reload();
            }

            if (messagee.status == 2 && play_or_no == true) {
                if (isselector == 0 && iscontroller == 0) {
                    document.getElementById("controllbuttons2").style.zIndex = "1";
                }
                this.setState({

                    file_show_when_click: this.state.file_select

                })
                document.getElementById("formback_movie_id").style.background = "black";
                document.getElementById('movie').style.display = 'block';
                filmplayed = 1;
                document.getElementById('movietxt').style.display = 'none';
                if (iscontroller == 1) {
                    document.getElementById("controllbuttons2").style.zIndex = "-1";
                    document.getElementById('controllbuttons').style.pointerEvents = 'auto';
                } else if (isadmin == 0) {
                    document.getElementById("controllbuttons2").style.zIndex = "1";
                    document.getElementById('controllbuttons').style.pointerEvents = 'none';
                    document.getElementById('videopicks').style.pointerEvents = 'none';
                    document.getElementById('movie').style.pointerEvents = 'none';

                }


               

            }

            if ("this is current time for new users" == messagee.message && clienthashok == 1) {

                this.changeCurrentTime(messagee.time);
                const {player} = this.player.getState();
            
                if (player.currentTime > 1)
                    this.play();
                $('#moviebtnd').fadeOut();
            }
            if (clienthashok == 0 && messagee.status == 1 && uploaded == 0) {

                adminhash = messagee.hash;
                $('#movietxt').fadeOut('slow');
           
                document.getElementById('reselect').style.pointerEvents = 'none';
                $('#moviebtnd').fadeIn('slow');
                if (iscontroller == 0)
                    document.getElementById('controllbuttons').style.pointerEvents = 'none';
                document.getElementById('videopickbtn').style.pointerEvents = 'auto';
                document.getElementById('videopicks').style.pointerEvents = 'auto';
                $('#movietxt').text('Admin or selector has selected the video , select it too by clicking on ▲ ');
                $('#movietxt').fadeIn();


            }


            
            if (messagee.status == 0 && isadmin == 0) {
                azavalbude = 1;
            }

            if (messagee.status == 2 && isadmin == 0 && filmplayed == 0) {

                setTimeout(function () {
                    rejoined = 1;
                    $('#movietxt').text('Admin has played the video , select your video too by clicking on ▲ ');
                    $('#moviebtnd').fadeIn('slow');
                    document.getElementById('videopickbtn').style.pointerEvents = 'auto';
                    document.getElementById('videopicks').style.pointerEvents = 'auto';
                    if (comeinstate1 == 0 && azavalbude == 0)
                        adminhash = messagee.hash;
                 
                }, 600);
            
            }


            if (messagee.status == 1 && isadmin == 0 && azavalbude == 0 && clienthashok == 0 && uploaded == 0) {

                setTimeout(function () {
                    adminhash = messagee.hash;
                  rejoined = 1;
                    $('#movietxt').text('Admin or selector has selected the video , select it too by clicking on ▲ ');
                    $('#moviebtnd').fadeIn('slow');
                    adminhash = messagee.hash;
                    comeinstate1 = 1;
                }, 600);


            }


            if (filmplayed == 1 && messagee.status == 2 && messagee.message == "new user's hash is ok." && isadmin == 1) {

                this.player.pause();
                const {player} = this.player.getState();
               
                const message_send_play = {"command": "send_current_time", "currentTime": player.currentTime};
                ws.send(JSON.stringify(message_send_play));

            }


            if (filmplayed == 1 && messagee.status == 2 && messagee.message == "video paused by admin or controller") {
                var time = messagee.time
                this.player.seek(time)
                this.player.pause();
                $('#play_btnid').fadeIn('fast');
                $('#pause_btnid').fadeOut('fast');

            }
            if (filmplayed == 1 && messagee.status == 2 && (messagee.message == "video played by admin or controller" || messagee.message == "video played by admin or controller again")) {
                var time = messagee.time
                this.player.seek(time)
                this.player.play();
                $('#play_btnid').fadeOut('fast');
                $('#pause_btnid').fadeIn('fast');
            }


            if (messagee.msg_type == "send permission") {
                if (messagee.username == window.localStorage.getItem('username')) {
                    if (messagee.permission1 == "controller" || messagee.permission2 == "controller") {
                        iscontroller = 1;

                        document.getElementById("controllbuttons2").style.zIndex = "-1";
                        document.getElementById('controllbuttons').style.pointerEvents = 'auto';
                        document.getElementById('movie').style.pointerEvents = 'auto';
                    }
                    if (messagee.permission1 == "selector" || messagee.permission2 == "selector") {
                        isselector = 1;
                        document.getElementById('reselect').style.pointerEvents = 'auto';
                        if (iscontroller == 0)
                            document.getElementById("controllbuttons2").style.zIndex = "100";
                        if (filmplayed == 0)
                            window.location.reload();
                    }
                    if (messagee.permission1 != "controller" && messagee.permission2 != "controller") {
                        iscontroller = 0;

                        document.getElementById("controllbuttons2").style.zIndex = "1";
                        document.getElementById('controllbuttons').style.pointerEvents = 'none';
                        document.getElementById('movie').style.pointerEvents = 'none';
                    }
                    if (messagee.permission1 != "selector" && messagee.permission2 != "selector") {
                        isselector = 0;
                        document.getElementById('reselect').style.pointerEvents = 'none';
                        if (iscontroller == 1)
                            document.getElementById("controllbuttons2").style.zIndex = "-1";
                        if (filmplayed == 0)
                            window.location.reload();
                    }
                }
            
            }


            if (messagee.msg_type == "send admin info") {
                if (messagee.username.substr(messagee.username.length - 3) == 'nnn') {
                    $('.name').html(messagee.username.substring(0, messagee.username.length - 3));
                } else {
                    window.localStorage.setItem('isadmin', '');
                    if (messagee.username == window.localStorage.getItem('username')) {
                        isadmin = 1;
                        iscontroller = 1;
                        isselector = 1;
                        document.getElementById("controllbuttons2").style.zIndex = "-1";
                        document.getElementById('controllbuttons').style.pointerEvents = 'auto';
                        document.getElementById('movie').style.pointerEvents = 'auto';
                        document.getElementById('reselect').style.pointerEvents = 'auto';
                        document.getElementById("controllbuttons2").style.zIndex = "100";
                        if (filmplayed == 0)
                            window.location.reload();
                        else
                            this.play();
                    } else
                        isadmin = 0;
                    if (adminhash == null && filmplayed == 0)
                        window.location.reload();

                }
            }

        }

        const {id} = this.props.match.params

        $(document).ready(function () {
            $('#fullscreenid').prependTo($('.controllbuttons2'));
            if ($(window).width() < 800) {
                $(".back_coulom").css("width", "0px");
                $(".openchat").css("transform", "scaleX(1)");
                document.getElementById("mySidenav").style.width = "0px";
                $(".openonlinemember").css("transform", "scaleX(-1)");
            }

           

            if (isadmin == 1 || isselector == 1) {
                $('#videopicks').fadeIn('fast');
            } else {
                if (iscontroller == 0)
                    document.getElementById('controllbuttons').style.pointerEvents = 'none';

            }
            $("#playbtnid").click(function () {
                filmplayed = 1;
            });

      
            var settings = {

                "url": "http://127.0.0.1:8000/group/" + id_gp + "/permissions/?member=" + window.localStorage.getItem('username') + "",

                "method": "GET",

                "timeout": 0,

                "headers": {

                    "accept": "application/json",

                    "Access-Control-Allow-Origin": "*",

                    "Access-Control-Allow-Headers": "*",

                    "Content-Type": "application/json"

                }

            };


            $.ajax(settings).done(function (response_) {
                if (response_.choose_video_permission == true)
                    isselector = 1;
                if (response_.playback_permission == true)
                    iscontroller = 1;
            });

            $(document).on("keypress", "input", function (e) {

                if (e.which == 13) {

                    var massage = $(".formback_text_input").val();
                    if (massage != '') {
                        const message_send_chat = {"command": "chat_client", "message_client": massage}

                        ws1.send(JSON.stringify(message_send_chat));
                        $('.formback_text_input').val('');
                    }

                    e.preventDefault();
                }
            });


            if (window.localStorage.getItem('token') == null) {


                alert("Login first !");


                window.location.replace("/login/");


            }
            window.onclick = function (event) {

                if (event.target == document.getElementById("mymutemodal")) {
                    $('.mutemodal').fadeOut("slow");
                }

                if (event.target == document.getElementById("myModal")) {
                    $('.modal-').fadeOut("slow");
                }
            }
            $('.logout').click(function () {
                window.localStorage.setItem('id_gp', '');
               
                logoutclicked = 1;


                if (isadmin == 1) {

                    const message_reselect = {"command": "reset"}
                    ws.send(JSON.stringify(message_reselect));
                }
                setTimeout(function () {
                    window.location.replace('/homepage/');
                }, 300);

            });
            $('.submitedit_popup').click(function () {


                var title = $('#edittitle_popup').val();
                var des = $('#editdes_popup').val();
                var new_admin = $('#admin-select').val();
                var form = new FormData();

                if (title != "")
                    form.append("title", title);
                if (des != '')
                    form.append("describtion", des);
                if (new_admin != 'yetoopdaramghelghelie') {
                    form.append("created_by", new_admin)
                 
                }
  
                var settings = {
                    "url": "http://127.0.0.1:8000/groups/" + id_gp + "/",
                    "method": "PUT",
                    "timeout": 0,
                    "headers": {
                        "Authorization": "Token " + localStorage.getItem('token')
                    },
                    success: function () {
                        var message_newadmin;
                        if (title != "") {
                            message_newadmin = {"command": "new_admin", "user": title + 'nnn'};
                            ws.send(JSON.stringify(message_newadmin));
                        }
                        if (new_admin != 'yetoopdaramghelghelie') {
                            message_newadmin = {"command": "new_admin", "user": new_admin};


                            ws.send(JSON.stringify(message_newadmin));

                            var settings = {

                                "url": "http://127.0.0.1:8000/group/" + id_gp + "/permissions/?member=" + new_admin + "",
                                "method": "PUT",
                                "timeout": 0,
                                success: function () {

                                    var x = document.getElementById("snackbar-succes-edit");
                                    x.className = "show";
                                    setTimeout(function () {
                                        x.className = x.className.replace("show", "");
                                    }, 3000);
                                    document.getElementById('myModal_popup').style.display = 'none'
                                    document.getElementById('myModal').style.display = 'none';
                                },
                                "headers": {
                                    "accept": "application/json",
                                    "Access-Control-Allow-Origin": "*",
                                    "Access-Control-Allow-Headers": "*",
                                    "Content-Type": "application/json"
                                },
                                "data": JSON.stringify({
                                        "chat_permission": 1,
                                        "choose_video_permission": 1,
                                        "playback_permission": 1,
                                        "group": id_gp,
                                        "member": new_admin,
                                    }
                                ),

                            };

                            $.ajax(settings).done(function (response2) {
                          
                            });
                        } else {
                            document.getElementById('myModal_popup').style.display = 'none'
                            document.getElementById('myModal').style.display = 'none';
                        }
                    },
                    error: function (event) {
                        if (event.status == 400)
                            alert("group with this groupid already exists.");
                        else
                            alert("something went wrong");
                    },
                    "processData": false,
                    "mimeType": "multipart/form-data",
                    "contentType": false,
                    "data": form
                };

                $.ajax(settings).done(function (response) {
                  
                });

            })
            $('.edit_group').click(function () {
              
            });
            $('#reselect').click(function () {
                const message_reselect = {"command": "reset"}
                ws.send(JSON.stringify(message_reselect));

              

            });


            $("#movie").dblclick(function (e) {

                $(".openonlinemember").css("transform", "scaleX(-1)");
                $(".openchat").css("transform", "scaleX(1)");
                setTimeout(function () {
                    $('.video-react-video').css({
                        "width": "100%",
                        "height": "100%",
                        "top": "0",
                        "left": "0",
                        "margin": "0px"
                    });

                }, 1000);

            });


            if (filmplayed == 1)
                $('#controll_div').fadeIn();

            $("#formback_movie_id").mouseleave(function () {
                $('#controll_div').fadeOut();
            });


            $('.username').text(window.localStorage.getItem('username'));


            document.getElementById('moviebtnd').style.display = 'none';

            document.getElementById('movietxt').style.display = 'none';

            setTimeout(function () {
                if (isadmin == 1 || isselector == 1) {

                    document.getElementById('moviebtnd').style.display = 'block';


                    document.getElementById('movietxt').style.display = 'block';
                   
                    if (adminhash == null)
                        $('#movietxt').text('Click ▲ to select your video ');
                    if (iscontroller == 0)
                        document.getElementById('controllbuttons').style.pointerEvents = 'none';
                    document.getElementById('reselect').style.pointerEvents = 'auto';
                    document.getElementById('videopickbtn').style.pointerEvents = 'auto';
                    document.getElementById('videopicks').style.pointerEvents = 'auto';



                } else {

                    document.getElementById('reselect').style.pointerEvents = 'none';

                    if (rejoined == 0)
                        document.getElementById('moviebtnd').style.display = 'none';

                    document.getElementById('movietxt').style.display = 'block';

                }

            }, 1000);

            $("#formback_movie_id").mouseenter(function () {

                if (filmplayed == 1) {
                    $('#controllbuttons').fadeIn();
                    $('#nameofthefilm').fadeIn();
                    $('.fullscreendiv').fadeIn();

                }
            });
            $("#formback_movie_id").mouseleave(function () {
                if (filmplayed == 1) {
                    $('#controllbuttons').fadeOut();
                    $('#nameofthefilm').fadeOut();
                    $('.fullscreendiv').fadeIn();

                }
            });


           

            var id = window.localStorage.getItem('id_gp');


            var settings = {
                "url": "http://127.0.0.1:8000/group/online_users/?group=" + id,
                "method": "GET",
                "timeout": 0,
                "headers": {
               
                    "accept": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Headers": "*",
                    "Content-Type": "application/json"
                }
            };

            $.ajax(settings).done(function (response) {
           
                for (var onlinememberscounter = 0; onlinememberscounter < response.length; onlinememberscounter++)
        
                    $('.onlinemembers').append('<p id="members">' + response[onlinememberscounter].online_user + '</p>');
       
            });


            $('#videopicks').change(function () {

                if (isadmin == 1 || isselector == 1) {

                  
                    document.getElementById('videopickbtn').style.pointerEvents = 'none';
                    document.getElementById('videopicks').style.pointerEvents = 'none';

                    document.getElementById('reselect').style.pointerEvents = 'auto';

                    $('#firstprogress').fadeIn();
                    $('#movietxt').fadeOut();

                }

            });


         
            var settings = {
                "url": "http://127.0.0.1:8000/group/online_users/?group=" + id,
                "method": "GET",
                "timeout": 0,
                "headers": {
                   
                    "accept": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Headers": "*",
                    "Content-Type": "application/json"
                }
            };

            $.ajax(settings).done(function (response) {
                $('.onlinemembers').html('');
         
                for (var onlinememberscounter = 0; onlinememberscounter < response.length; onlinememberscounter++)
                 
                    $('.onlinemembers').append('<p id="members">' + response[onlinememberscounter].online_user + '</p>');
             
            });
            var settings = {

                "url": "http://127.0.0.1:8000/groups/" + id + '/',

                "method": "GET",

                "timeout": 0,

                "headers": {


                    "accept": "application/json",

                    "Access-Control-Allow-Origin": "*",

                    "Access-Control-Allow-Headers": "*",

                    "Content-Type": "application/json"

                }

            };


            $.ajax(settings).done(function (response) {

                localresponse = response;
                if (response.created_by == window.localStorage.getItem('username'))
                    isadmin = 1;
              
                $(".name").append(response.title);

                
            });


        

            $(".name").click(function () {

                $(".infobody").html('');
                document.getElementById('myModal').style.display = 'block';
                var settings = {

                    "url": "http://127.0.0.1:8000/groups/" + id + '/',

                    "method": "GET",

                    "timeout": 0,

                    "headers": {

                     

                        "accept": "application/json",

                        "Access-Control-Allow-Origin": "*",

                        "Access-Control-Allow-Headers": "*",

                        "Content-Type": "application/json"

                    }

                };


                $.ajax(settings).done(function (response) {

                    localresponse = response;

                
                    $(".photogp").html(response.title.toUpperCase()[0]);


                    $(".namegp").html(response.title);

                    $(".idgp").html('@ ' + response.groupid);

                    $(".desbody").html(response.describtion);
                    $(".inputedit-title").val(response.title)
                    $(".inputedit-des").val(response.describtion)
                    create_by = response.created_by
                
                    if (window.localStorage.getItem('username') != create_by) {

                        document.getElementById('dropdown-basic').style.display = 'none'
                    } else {
                        document.getElementById('dropdown-basic').style.display = 'block'
                       
                    }
                    var htmlcode33 = '<option value="yetoopdaramghelghelie">' + "Select new admin " + '</option>'
                    var htmlcode22 = ''
                    for (var counter1 = 0; counter1 < response.members.length; counter1++, htmlcode = '') {
                        var obj = {}
                        if (response.members[counter1] != create_by)
                            htmlcode33 += '<option class="option-" value="' + response.members[counter1] + '">' + response.members[counter1] + '</option>';
                        htmlcode22 += '<option class="option-" value="' + response.members[counter1] + '">' + response.members[counter1] + '</option>';

                        obj["value"] = response.members[counter1]
                        obj["label"] = response.members[counter1]

                        op.push(obj)
                        var htmlcode = '';
                        var controller = null
                        var selector = null

                        var settings = {

                            "url": "http://127.0.0.1:8000/group/" + id_gp + "/permissions/?member=" + response.members[counter1] + "",

                            "method": "GET",

                            "timeout": 0,

                            "headers": {

                  
                                "accept": "application/json",

                                "Access-Control-Allow-Origin": "*",

                                "Access-Control-Allow-Headers": "*",

                                "Content-Type": "application/json"

                            }

                        };


                        $.ajax(settings).done(function (response_) {


                            
                            if (response_.member == window.localStorage.getItem('username')) {
                                iscontroller = response_.playback_permission;
                                isselector = response_.choose_video_permission;
                            }
                            controller = response_.playback_permission
                            selector = response_.choose_video_permission
                            var chat = response_.chat_permission
                            
                            var r = "window.open('/profile/" + response_.member + "')";
                            var a = "window.localStorage.setItem('user','" + response_.member + "')"; //id of the group
                            var hoverout = 'onMouseOut="this.style.color=';
                            var hoverrout = hoverout + "'white'";
                            var hover = 'onmouseenter="this.style.color=';
                            var hoverr = hover + "'red'";
                            var hoverout1 = 'onMouseOut="this.style.backgroundColor=';
                            var hoverrout1 = hoverout1 + "'rgb(35, 35, 35)'";
                            var hover1 = 'onmouseenter="this.style.backgroundColor=';
                            var hoverr1 = hover1 + "'rgb(365, 365,365,0.1)'";
                            htmlcode = ''
                            htmlcode += '<div class="divMem"' + hoverr1 + '"' + hoverrout1 + '"' + '>'
                            htmlcode += '<p ' + hoverr + '"' + hoverrout + '"' + ' style="font-size: 21px" class="mygroups"  onclick="' + a + "," + r + "," + r + '" id=' + '"c' + counter1 + '">' + "&nbsp" + response_.member + '</p>';
                            ;

                            if (response_.member == create_by && controller && selector) {
                                htmlcode += '<p  style="font-size: 15px" class="permissiontitle"  >admin</p>';
                            } else {

                                if (controller && selector) {
                                    if (chat)
                                        htmlcode += '<p  style="font-size: 15px" class="permissiontitle"  >selector &nbsp controller</p>';
                                    else {
                                        htmlcode += '<p  style="font-size: 15px" class="permissiontitle"  >selector &nbsp controller</p>';
                                        htmlcode += '<p  style="font-size: 15px" class="mutetitle"  >mute</p>';
                                    }
                                }
                                if (controller && !selector) {
                                    if (chat)
                                        htmlcode += '<p  style="font-size: 15px" class="permissiontitle"  > controller</p>';
                                    else {
                                        htmlcode += '<p  style="font-size: 15px" class="permissiontitle"  > controller</p>';
                                        htmlcode += '<p  style="font-size: 15px" class="mutetitle"  >mute</p>';
                                    }

                                }
                                if (!controller && selector) {
                                    if (chat)
                                        htmlcode += '<p  style="font-size: 15px" class="permissiontitle"  >selector </p>';
                                    else {
                                        htmlcode += '<p  style="font-size: 15px" class="permissiontitle"  >selector </p>';
                                        htmlcode += '<p  style="font-size: 15px" class="mutetitle"  >mute</p>';
                                    }

                                }
                                if (!controller && !selector) {
                                    if (!chat)
                                        htmlcode += '<p  style="font-size: 15px" class="mutetitle"  >mute</p>';
                                }

                            }

                            htmlcode += '</div>';

                            $(".infobody").append(htmlcode);

                        })

                    }
                    $('#exams').html(htmlcode22);
                    $('#admin-select').html(htmlcode33);
                


                });
            })

            
            $(".btnno").click(function () {
                document.getElementById('myModalPer').style.display = 'none';
            })
            $(".btncancel").click(function () {
                document.getElementById('myModalAdd').style.display = 'none';
            })
            $(".cancelicon").click(function () {
                document.getElementById('myModal_popup').style.display = 'none';
            })


            $(".btnyes").click(function () {
                Able_controll = 0;
                Able_select = 0;
                var message_send_permission = {};

                for (var count_per = 0; count_per < per.length; count_per++) {
                    if (per[count_per].value == 1) {

                        Able_select = 1
                    }
                    if (per[count_per].value == 2) {

                        Able_controll = 1
                    }
                }
                var username_edite = $('#exams').val();

                var settings = {
                    "url": "http://127.0.0.1:8000/group/" + id_gp + "/permissions/?member=" + username_edite + "",
                    "method": "PUT",
                    "timeout": 0,
                    error: function (event) {
                        var x = document.getElementById("snackbar-");
                        x.className = "show";
                        setTimeout(function () {
                            x.className = x.className.replace("show", "");
                        }, 3000);

                    },
                    success: function () {
                        if (Able_controll == 1 && Able_select == 1)
                            message_send_permission = {
                                "command": "user_permission",
                                "user": username_edite,
                                "per1": "controller",
                                "per2": "selector"
                            };
                        if (Able_controll == 1 && Able_select == 0)
                            message_send_permission = {
                                "command": "user_permission",
                                "user": username_edite,
                                "per1": "controller",
                                "per2": ""
                            }
                        if (Able_controll == 0 && Able_select == 1)
                            message_send_permission = {
                                "command": "user_permission",
                                "user": username_edite,
                                "per1": "",
                                "per2": "selector"
                            }
                        if (Able_controll == 0 && Able_select == 0)
                            message_send_permission = {
                                "command": "user_permission",
                                "user": username_edite,
                                "per1": "",
                                "per2": ""
                            }

                        ws.send(JSON.stringify(message_send_permission));

                        var x = document.getElementById("snackbar");
                        x.className = "show";
                        setTimeout(function () {
                            x.className = x.className.replace("show", "");
                        }, 3000);
                        var settings = {

                            "url": "http://127.0.0.1:8000/groups/" + id + '/',

                            "method": "GET",

                            "timeout": 0,

                            "headers": {

                             
                                "accept": "application/json",

                                "Access-Control-Allow-Origin": "*",

                                "Access-Control-Allow-Headers": "*",

                                "Content-Type": "application/json"

                            }

                        };


                        $.ajax(settings).done(function (response) {

                            localresponse = response;

                           
                            create_by = response.created_by


                            for (var counter1 = 0; counter1 < response.members.length; counter1++, htmlcode = '') {

                                var htmlcode = '';
                                var controller = null
                                var selector = null

                            }
                            document.getElementById('myModal').style.display = 'none';
                        })
                        document.getElementById('myModalPer').style.display = 'none';

                    },
                    "headers": {

                        "accept": "application/json",
                        "Access-Control-Allow-Origin": "*",
                        "Access-Control-Allow-Headers": "*",
                        "Content-Type": "application/json"
                    },
                    "data": JSON.stringify({

                            "choose_video_permission": Able_select,
                            "playback_permission": Able_controll,
                            "group": id_gp,
                            "member": username_edite,
                        }
                    ),
                };

                $.ajax(settings).done(function (response) {
                 

                });

            })
            $(".btnadd").click(function () {
       
                Able_controll = 0;
                Able_select = 0;
                for (var count_per_add = 0; count_per_add < per_add.length; count_per_add++) {
                    if (per_add[count_per_add].value == 1) {
                        Able_select = 1
                    }
                    if (per_add[count_per_add].value == 2) {
                        Able_controll = 1
                    }
                }
            
                var member_add = $(".inp-add").val();


                var settings = {
                    "url": "http://127.0.0.1:8000/user/" + member_add + "",
                    "method": "GET",
                    "timeout": 0,
                    error: function (event) {


                        var x = document.getElementById("snackbar-not");
                        x.className = "show";
                        setTimeout(function () {
                            x.className = x.className.replace("show", "");
                        }, 3000);

                    },
                    success: function () {
                        var settings = {
                            "url": "http://127.0.0.1:8000/group/add_member/",
                            "method": "POST",
                            error: function () {

                                var x = document.getElementById("snackbar-already");
                                x.className = "show";
                                setTimeout(function () {
                                    x.className = x.className.replace("show", "");
                                }, 3000);
                                ;


                            },
                            success: function () {

                                var settings = {
                                    "url": "http://127.0.0.1:8000/group/permissions/",
                                    "method": "POST",
                                    error: function () {

                                        alert("nooooooo")


                                    },
                                    success: function () {
                                        var x = document.getElementById("snackbar-succes");
                                        x.className = "show";
                                        setTimeout(function () {
                                            x.className = x.className.replace("show", "");
                                        }, 3000);
                                        var settings = {

                                            "url": "http://127.0.0.1:8000/groups/" + id + '/',

                                            "method": "GET",

                                            "timeout": 0,

                                            "headers": {

                                                "accept": "application/json",

                                                "Access-Control-Allow-Origin": "*",

                                                "Access-Control-Allow-Headers": "*",

                                                "Content-Type": "application/json"

                                            }

                                        };


                                        $.ajax(settings).done(function (response) {

                                            localresponse = response;

                                           
                                            create_by = response.created_by


                                            document.getElementById('myModal').style.display = 'none';
                                        })

                                        document.getElementById('myModalAdd').style.display = 'none';
                                        ;
                                    },
                                    "timeout": 0,
                                    "headers": {

                                        "accept": "application/json",
                                        "Access-Control-Allow-Origin": "*",
                                        "Access-Control-Allow-Headers": "*",
                                        "Content-Type": "application/json"
                                    },
                                    "data": JSON.stringify({
                                            "group": id_gp,
                                            "member": member_add,
                                            "chat_permission": 1,
                                            "playback_permission": Able_controll,
                                            "choose_video_permission": Able_select
                                        }
                                    ),
                                };

                                $.ajax(settings).done(function (response) {

                                  
                                });
                                ;
                            },
                            "timeout": 0,
                            "headers": {

                                "accept": "application/json",
                                "Access-Control-Allow-Origin": "*",
                                "Access-Control-Allow-Headers": "*",
                                "Content-Type": "application/json"
                            },
                            "data": JSON.stringify({
                                    "the_group": id_gp,
                                    "the_member": member_add
                                }
                            ),
                        };

                        $.ajax(settings).done(function (response) {

                          
                        });


                    },
                    "headers": {

                        "accept": "application/json",
                        "Access-Control-Allow-Origin": "*",
                        "Access-Control-Allow-Headers": "*",
                        "Content-Type": "application/json"
                    },

                };

                $.ajax(settings).done(function (response) {
             

                });

            });


            $(".send_btn").click(function () {
                var massage = $(".formback_text_input").val();
                if (massage != '') {
                    const message_send_chat = {"command": "chat_client", "message_client": massage}

                    ws1.send(JSON.stringify(message_send_chat));
                    $('.formback_text_input').val('');
                }


            });


            var settings = {

                "url": "  http://127.0.0.1:8000/group/messages/?target=" + id,
                "method": "GET",
                "timeout": 0,
                "headers": {
            
                    "accept": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Headers": "*",
                    "Content-Type": "application/json"
                }
            };

            $.ajax(settings).done(function (response) {
             
                for (var counterchathistory = response.results.length - 1; counterchathistory >= 0; counterchathistory--) {

                    var aval = 'style=';
                    var dovom = aval + '"color:';
                    var sevom = dovom + usercolors[response.results[counterchathistory].message_sender];
                    var charom = sevom + '"';


                    var d = 'document.getElementById("mymutemodal")';

                    var dd = d + '.style.display="block"';


                    var a = 'window.localStorage.setItem("muteuser","' + response.results[counterchathistory].message_sender + '")';
                    if (response.results[counterchathistory].message_sender == window.localStorage.getItem('username')) {
                        $(".pm").append("<div  style='float:left' id='pmeman'" + charom + "> me: &nbsp;</div><div  id='pmemantxt'>" + response.results[counterchathistory].message_text + "</div>");

                    } else {
                        $(".pm").append("<abbr title='Click to mute' > <div onclick='" + dd + "," + a + "' id='pmeoon'" + charom + ">" + response.results[counterchathistory].message_sender + ": &nbsp;</div></abbr><div  id='pmemantxt'> " + response.results[counterchathistory].message_text + "</div>");
                    }

                }
                var element = document.getElementById("pmid");
                element.scrollTop = element.scrollHeight;

            })
          

            $('.mutemodal').mouseenter(function () {
                if (isadmin == 1) {
                    var settings = {

                        "url": "http://127.0.0.1:8000/group/" + id_gp + "/permissions/?member=" + window.localStorage.getItem('muteuser') + "",

                        "method": "GET",

                        "timeout": 0,

                        "headers": {

                           

                            "accept": "application/json",

                            "Access-Control-Allow-Origin": "*",

                            "Access-Control-Allow-Headers": "*",

                            "Content-Type": "application/json"

                        }

                    };

                    $.ajax(settings).done(function (response0) {
                 
                        if (response0.chat_permission == true) {
                            muted = 0;
                            var obj = $('.deleteTEXT').text("Are you sure  you want to mute \n   " + window.localStorage.getItem('muteuser') + "  ? ");
                            obj.html(obj.html().replace(/\n/g, '<br/>'));
                        } else {
                            muted = 1;
                            var obj = $('.deleteTEXT').text("Are you sure  you want to unmute \n   " + window.localStorage.getItem('muteuser') + "  ? ");
                            obj.html(obj.html().replace(/\n/g, '<br/>'));
                        }
                    });
                   
                } else
                    $('.mutemodal').fadeOut('fast');
            });

            $('.dltyes2').click(function () {
                var chatpermission;
                var selectpermission;
                var controllpermission;
                var settings = {

                    "url": "http://127.0.0.1:8000/group/" + id_gp + "/permissions/?member=" + window.localStorage.getItem('muteuser') + "",

                    "method": "GET",

                    "timeout": 0,

                    "headers": {

                  
                        "accept": "application/json",

                        "Access-Control-Allow-Origin": "*",

                        "Access-Control-Allow-Headers": "*",

                        "Content-Type": "application/json"

                    }

                };

                $.ajax(settings).done(function (response1) {
                    chatpermission = response1.chat_permission;
                    selectpermission = response1.choose_video_permission;
                    controllpermission = response1.playback_permission;
                });


                if (muted == 0) {
                    var settings = {
                        "url": "http://127.0.0.1:8000/group/" + id_gp + "/permissions/?member=" + window.localStorage.getItem('muteuser') + "",
                        "method": "PUT",
                        "timeout": 0,
                        success: function () {
                            $('.mutemodal').fadeOut("slow");
                            var x = document.getElementById("snackbar-mute");
                            x.innerHTML = "Successfully mute";
                            x.className = "show";
                            setTimeout(function () {
                                x.className = x.className.replace("show", "");
                            }, 3000);
                        },
                        "headers": {
                            "accept": "application/json",
                            "Access-Control-Allow-Origin": "*",
                            "Access-Control-Allow-Headers": "*",
                            "Content-Type": "application/json"
                        },
                        "data": JSON.stringify({
                                "chat_permission": 0,
                                "choose_video_permission": selectpermission,
                                "playback_permission": controllpermission,
                                "group": id_gp,
                                "member": window.localStorage.getItem('muteuser'),
                            }
                        ),
                    };

                    $.ajax(settings).done(function (response2) {
                  
                    });

                } else {
                    var settings = {
                        "url": "http://127.0.0.1:8000/group/" + id_gp + "/permissions/?member=" + window.localStorage.getItem('muteuser') + "",
                        "method": "PUT",
                        "timeout": 0,
                        success: function () {
                            $('.mutemodal').fadeOut("slow");
                            var x = document.getElementById("snackbar-mute");
                            x.innerHTML = "Successfully unmute";
                            x.className = "show";
                            setTimeout(function () {
                                x.className = x.className.replace("show", "");
                            }, 3000);
                        },

                        "headers": {
                            "accept": "application/json",
                            "Access-Control-Allow-Origin": "*",
                            "Access-Control-Allow-Headers": "*",
                            "Content-Type": "application/json"
                        },
                        "data": JSON.stringify({
                                "chat_permission": 1,
                                "choose_video_permission": selectpermission,
                                "playback_permission": controllpermission,
                                "group": id_gp,
                                "member": window.localStorage.getItem('muteuser'),
                            }
                        ),
                    };

                    $.ajax(settings).done(function (response3) {
                     

                    });
                }

            });


            $('.dltno2').click(function () {
                $('.mutemodal').fadeOut("slow");
            });
        })

    }


    constructor(props) {

        super(props)

        this.state = {

            marhale: 0,

            file_select: null,

            file_show_when_click: null,

            server_pm: "",

            hash_: "",
            selectedOption: null,
            selectedOption_Add: null,
            selectedOption_id: null,
            opt: [],

        }

        this.onChange = this.onChange.bind(this);

        this.handleSubmit = this.handleSubmit.bind(this);


        this.play = this.play.bind(this);

        this.pause = this.pause.bind(this);
        this.fullscreen = this.fullscreen.bind(this);
        this.handlereq_forward_backward = this.handlereq_forward_backward.bind(this);

        this.changeCurrentTime = this.changeCurrentTime.bind(this);

        this.newShortcuts = [


            

            {


                keyCode: 32, 


                handle: (player, actions) => {


                    const current_time = player.currentTime;


                    


                    if (Play_pause_space == 0) {

                       
                        played = 0;
                    


                       

                        const message_send_play = {"command": "pause_video", "currentTime": current_time}

                       

                        ws.send(JSON.stringify(message_send_play))

                        
                        $('#play_btnid').fadeIn('fast');
                        $('#pause_btnid').fadeOut('fast');

                        

                        Play_pause_space = 1;


                        return

                    }

                    if (Play_pause_space == 1) {
                        played = 1;
                      
                        Play_pause_space = 0;

                        

                        const message_send_play = {"command": "play_video", "currentTime": current_time}

                  

                        ws.send(JSON.stringify(message_send_play))

                      

                        $('#play_btnid').fadeOut('fast');
                        $('#pause_btnid').fadeIn('fast');

                    

                        return

                    }

                }

            },

            {

                keyCode: 75,


                handle: (player, actions) => {


                }

            },

            {

                keyCode: 74, 

               

                handle: (player, actions) => {




                }

            },
            {

                keyCode: 76, 

               

                handle: (player, actions) => {




                }

            },
            {

                keyCode: 36, 

               

                handle: (player, actions) => {



                }

            },
            {

                keyCode: 74, 

               

                handle: (player, actions) => {




                }

            },
            {

                keyCode: 70, 

                

                handle: (player, actions) => {




                }

            },
            {

                keyCode: 49, 

               

                handle: (player, actions) => {


                    const duration = player.duration;
                   

                    const message_send_play = {"command": "play_video", "currentTime": duration * 0.1}

                   
                    ws.send(JSON.stringify(message_send_play))

                   

                }

            },
            {

                keyCode: 57, 

                handle: (player, actions) => {


                    const duration = player.duration;
                   

                    const message_send_play = {"command": "play_video", "currentTime": duration * 0.9}

                   
                    ws.send(JSON.stringify(message_send_play))

                   

                }

            },
            {

                keyCode: 50, 

                handle: (player, actions) => {


                    const duration = player.duration;
                    
                    const message_send_play = {"command": "play_video", "currentTime": duration * 0.2}

                    
                    ws.send(JSON.stringify(message_send_play))

                   
                }

            },
            {

                keyCode: 51,

                handle: (player, actions) => {


                    const duration = player.duration;
                   
                    const message_send_play = {"command": "play_video", "currentTime": duration * 0.3}

                    ws.send(JSON.stringify(message_send_play))

                    
                }

            },
            {

                keyCode: 52,

                handle: (player, actions) => {


                    const duration = player.duration;
                   
                    const message_send_play = {"command": "play_video", "currentTime": duration * 0.4}

                   
                    ws.send(JSON.stringify(message_send_play))

                }


            },
            {

                keyCode: 53, 

                handle: (player, actions) => {


                    const duration = player.duration;
                   
                    const message_send_play = {"command": "play_video", "currentTime": duration * 0.5}

                    
                    ws.send(JSON.stringify(message_send_play))

                    
                }

            },
            {

                keyCode: 54, 

                handle: (player, actions) => {


                    const duration = player.duration;
                    
                    const message_send_play = {"command": "play_video", "currentTime": duration * 0.6}

                    ws.send(JSON.stringify(message_send_play))

                  
                }

            },
            {

                keyCode: 55, 

                handle: (player, actions) => {


                    const duration = player.duration;
                   
                    const message_send_play = {"command": "play_video", "currentTime": duration * 0.7}

                    ws.send(JSON.stringify(message_send_play))

                   
                }

            },
            {

                keyCode: 56, 

                handle: (player, actions) => {


                    const duration = player.duration;
                   
                    const message_send_play = {"command": "play_video", "currentTime": duration * 0.8}

                    
                    ws.send(JSON.stringify(message_send_play))

                }

            },
        ];


    }

    handleSubmit(e) {


        const message_send_play = {"command": "play_video", "currentTime": "0"}


        ws.send(JSON.stringify(message_send_play))

        
        play_or_no = true


    }


    onChange(e) {

        document.getElementById('blaybtndiv').style.display = 'none';
        adminisinstatezero = 0;
        document.getElementById('firstprogress').style.display = 'block';
        $('#movietxt').fadeOut();

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

            var chunkSize = 1024 * 1024;

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
            var message_send
            if (adminhash == null) {
                
                adminhash = encrypted;
                message_send = {"command": "set_video_hash", "vhash": encrypted};
                clienthashok = 1;
            } else {
                
                message_send = {"command": "send_client_hash", "vhash": encrypted};

            }
            if (isselector == 1)
                play_or_no = true;

            
            ws.send(JSON.stringify(message_send))

           
        }


        function Send_data2() {
            $('#moviebtnd').fadeOut('slow');
            const message_send = {"command": "send_client_hash", "vhash": encrypted}

            play_or_no = true


            ws.send(JSON.stringify(message_send))

            
        }


        loading(file, function (data) {


            var wordBuffer = CryptoJS.lib.WordArray.create(data);

            SHA256.update(wordBuffer);

            counter += data.byteLength;

            percant = ((counter / file.size) * 100).toFixed(0);

        }, function (data) {


            
            encrypted = SHA256.finalize().toString();


            if (percant == 100) {
               
                $('#nameofthefilm').text(file.name.split('.')[0]);
                $('#nameofthefilm').fadeIn();
                $('.fullscreendiv').fadeIn();

               

                uploaded = 1;
                if (isadmin == 1 || isselector == 1) {


                    Send_data();

                    document.getElementById('blaybtndiv').style.display = 'block';
                    if (iscontroller == 1 || isadmin == 1)
                        $('#movietxt').text('Click ► to play your video');
                    else {
                        $('#movietxt').text('wait for admin or controller to play video');
                        document.getElementById('controllbuttons').style.pointerEvents = 'none';
                    }
                    $('#movietxt').fadeIn();
                    if (isadmin == 1 || iscontroller == 1)
                        document.getElementById('controllbuttons').style.pointerEvents = 'auto';


                    document.getElementById('firstprogress').style.display = 'none';

                }
                if (adminhash != null) {

                    if (encrypted == adminhash) {

                        clienthashok = 1;
                        filmplayed = 1;
                        document.getElementById('firstprogress').style.display = 'none';
                        if (iscontroller == 0)
                            $('#movietxt').text('wait for admin or controller to play video');
                        else {
                            $('#movietxt').text('Wait for admin to play the video or Click ► to play your video');
                            document.getElementById("controllbuttons2").style.zIndex = "-1";
                            document.getElementById('controllbuttons').style.pointerEvents = 'auto';
                        }
                        $('#moviebtnd').fadeOut();


                        $('#movietxt').fadeIn();
                        if (iscontroller == 0)
                            document.getElementById('controllbuttons').style.pointerEvents = 'none';
                        document.getElementById('videopicks').style.pointerEvents = 'none';
                      
                        if (isselector == 0)
                            Send_data2();


                    } else {

                        document.getElementById('firstprogress').style.display = 'none';

                        $('#movietxt').text('Your video is not same with admin\'s video , please chose another one');

                        $('#movietxt').fadeIn();
                        document.getElementById('videopickbtn').style.pointerEvents = 'auto';
                        document.getElementById('videopicks').style.pointerEvents = 'auto';
                    }

                }
            } else {

                document.getElementById('firstprogress').style.display = 'none';
                $('#movietxt').text('Something went wrong in selecting movie , Please reselect the video ');
                $('#movietxt').fadeIn();
                if (iscontroller == 0)
                    document.getElementById('controllbuttons').style.pointerEvents = 'none';
                document.getElementById('videopickbtn').style.pointerEvents = 'auto';
                document.getElementById('videopicks').style.pointerEvents = 'auto';


            }


        });


    }


    Send_data() {


    }

    play() {

        const {player} = this.player.getState();

        
        const message_send_play = {"command": "play_video", "currentTime": player.currentTime}

        
        ws.send(JSON.stringify(message_send_play))

        play_or_no = true;
        played = 1;
        $('#play_btnid').fadeOut('fast');
        $('#pause_btnid').fadeIn('fast');

    }


    fullscreen() {

        this.player.toggleFullscreen();
        $(".formback_movie").css("width", '100%');
        document.getElementById("mySidenav").style.width = "0px";
        $(".back_coulom").css("width", "0px");
        $(".openonlinemember").css("transform", "scaleX(-1)");
        $(".openchat").css("transform", "scaleX(1)");
        setTimeout(function () {
            $('.video-react-video').css({
                "width": "100%",
                "height": "100%",
                "top": "0",
                "left": "0",
                "margin": "0px"
            });

        }, 1000);


    }


    pause() {

        const {player} = this.player.getState();

        const message_send_play = {"command": "pause_video", "currentTime": player.currentTime}

       
        ws.send(JSON.stringify(message_send_play))

        played = 0;
        
        $('#play_btnid').fadeIn('fast');
        $('#pause_btnid').fadeOut('fast');


    }

    changeCurrentTime(seconds) {

        return () => {

            const {player} = this.player.getState();

           var message_send_play;
            if (played == 1)
                message_send_play = {"command": "play_video", "currentTime": player.currentTime + seconds}
            else
                message_send_play = {"command": "pause_video", "currentTime": player.currentTime + seconds}
            ws.send(JSON.stringify(message_send_play))

        };

    }

    click_edit_permission() {
        document.getElementById('myModalPer').style.display = 'block';
    }

    click_edit() {
        document.getElementById('myModal_popup').style.display = 'block';
    }

    click_edit_Add() {
        document.getElementById('myModalAdd').style.display = 'block';
    }

    handlereq_forward_backward(event) {
        
        if (event.keyCode == 39 || event.keyCode == 37) {
           
            const {player} = this.player.getState();

            
            var message_send_play2;
            if (played == 1)
                message_send_play2 = {"command": "play_video", "currentTime": player.currentTime}
            else
                message_send_play2 = {"command": "pause_video", "currentTime": player.currentTime}
            

            ws.send(JSON.stringify(message_send_play2))
  }
    }

    handleChanges = selectedOption => {
        this.setState(
            {selectedOption},
            () => per = this.state.selectedOption
        );

    };
    handleChanges_Add = selectedOption_Add => {
        this.setState(
            {selectedOption_Add},
            () => per_add = this.state.selectedOption_Add
        );
        
    }
    handleChanges_id = selectedOption_id => {
        this.setState(
            {selectedOption_id},
            () => member_edit = this.state.selectedOption_id
        );
        
    }

    render() {


        return (


            <form className="back">


                <header class="header_s">

                    <div className='leftheader'>

                        <div className='userprofile'>

                            <IconButton style={{

                                color: 'white'


                            }}

                                        className="profilepic">

                                <AccountCircleOutlinedIcon fontSize="large"/>

                            </IconButton>


                            <p className='username'>Username</p>

                        </div>


                    </div>

                    <div className='logout'>

                        <p className='logout_text2'>Exit group</p>

                        <IconButton style={{
                            color: 'white'

                        }}

                                    className="div_leave">

                            <ExitToAppIcon fontSize="large"/>

                        </IconButton>

                    </div>

                </header>


                <div id="mySidenav" className="sidenav">
                    <div className="name"/>

                    <p className='titleofonlines'>Online</p>
                    <p className="khat">_______________________</p>
                    <div className="onlinemembers"></div>
                </div>


                <abbr title="Online Members">
                    <IconButton style={{
                        transform: 'scaleX(1)',
                        color: 'white',
                        zIndex: '1'
                    }}

                                className="openonlinemember">

                        <FirstPageIcon fontSize="large"/>

                    </IconButton>
                </abbr>

                <div id="mymutemodal" className="mutemodal">

                    <div className="mute-modal-content">

                        <h3 className='deleteTEXT'>Are you sure you want to mute this user ? </h3>


                        <div className='dltbtns'>


                            <Button style={{backgroundColor: "Red"}} size='large'

                                    className="dltno2" variant="contained" color="secondary">

                                <p>No&nbsp;</p>

                            </Button>


                            <Button style={{

                                backgroundColor: 'gray',

                                marginRight: "4px"


                            }} size='large' className="dltyes2" variant="contained" color="secondary">

                                <p>Yes</p>

                            </Button>


                        </div>

                        

                    </div>

                </div>


                <div id="myModal" class="modal-">


                    <div class="modal-content-">

                        <div className='headModal'>

                            <Avatar style={{
                                backgroundColor: 'rgba(0,0,0,0.5)',
                                width: '100px',
                                height: '100px',
                                fontSize: '50px'
                            }} className='photogp'>&nbsp;</Avatar>


                            <div className='infogp'>

                                <div className='namegp'/>

                                <div className='idgp'/>

                            </div>

                            <div class="drop">
                                <Dropdown>
                                    <Dropdown.Toggle variant="success" id="dropdown-basic" style={{
                                        backgroundColor: 'transparent',
                                        borderColor: 'transparent',
                                        fontSize: '30px',
                                        cursor: 'pointer'
                                    }}>
                                        ⋮
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu style={{
                                        backgroundColor: 'rgba(0,0,0,0.9)',
                                        color: 'black',
                                        marginLeft: '-65px'
                                    }}>
                                        <div style={{color: 'white', textAlign: 'left', marginLeft: '15px'}}
                                             className="edit_group" onClick={this.click_edit}>Edit group
                                        </div>
                                        <div style={{color: 'white', textAlign: 'left', marginLeft: '15px'}}
                                             className="edit_group" onClick={this.click_edit_permission}>Edit
                                            permission
                                        </div>
                                        <div style={{color: 'white', textAlign: 'left', marginLeft: '15px'}}
                                             className="edit_group" onClick={this.click_edit_Add}>Add member
                                        </div>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>
                        </div>

                        <div className='destitle'>Description:</div>

                        <div className='desbody'/>

                        <hr/>

                        <div className='infobody'/>

                    </div>


                </div>
                <div id="myModalPer" class="modalPer">
                    <div class="modal-content-Per">
                        <p className='delPer'>Edit permission of user</p>

                        <select id="exams" name="exams" required className='dropbtn-'>

                        </select>

                        <Select className='select' isMulti placeholder="select your permission"
                                value={this.state.selectedOption}
                                onChange={this.handleChanges}
                                options={options}
                        />


                        <br/>
                        <div className='btndl'>

                            <Button style={{backgroundColor: "Red"}} size='large'
                                    className="btnno" variant="contained" color="secondary">
                                <p>Cancel&nbsp;</p>
                            </Button>

                            <Button style={{
                                backgroundColor: 'gray',
                                marginRight: "4px"

                            }} size='large' className="btnyes" variant="contained" color="secondary">
                                <p>Apply</p>
                            </Button>

                        </div>
                    </div>
                </div>
                <div id="snackbar">Successfully permission edit</div>
                <div id="snackbar-mute-warning">You don't have permission to send message</div>
                <div id="snackbar-">Enter id field</div>
                <div id="myModalAdd" class="modaladd">
                    <div class="modal-content-add">
                        <p className='delPer'>Add your member</p>

                        <input class='inp-add' placeholder=" enter your user's id"></input>
                        <Select className='select-' isMulti placeholder="select your permission"
                                value={this.state.selectedOption_Add}
                                onChange={this.handleChanges_Add}
                                options={options}
                        />


                        <br/>
                        <div className='btndl'>

                            <Button style={{backgroundColor: "Red"}} size='large'
                                    className="btncancel" variant="contained" color="secondary">
                                <p>Cancel&nbsp;</p>
                            </Button>

                            <Button style={{
                                backgroundColor: 'gray',
                                marginRight: "4px"

                            }} size='large' className="btnadd" variant="contained" color="secondary">
                                <p>Add</p>
                            </Button>

                        </div>
                    </div>
                </div>
                <div id="snackbar-succes">Successfully add to group</div>
                <div id="snackbar-not">User not found</div>
                <div id="snackbar-already">User is already a member of this group</div>
                <div id="snackbar-mute">Successfully mute</div>
                <div id="myModal_popup" class="modal_popup">
                    <div class="modal-content">
                        <IconButton style={{color: 'white', marginRight: '130%', marginTop: '4%'}}
                                    className="cancelicon">
                            <CloseIcon fontSize="large"/>
                        </IconButton>
                        <h3 class="texx">Edit your groups deatails</h3>

                        <hr></hr>

                        <input class="inputedit-title" id='edittitle_popup' placeholder="Title"></input>


                        <input class="inputedit-des" id='editdes_popup' placeholder="Description"></input>

                        <select id="admin-select" name="admin-select" required className='admin-select'>

                        </select>
                        <br></br>
                        <Button style={{
                            backgroundColor: "Red",
                            marginTop: "20px"
                        }} size='large' className="submitedit_popup" variant="contained" color="secondary">
                            <p>Apply</p>
                        </Button>

                    </div>
                    <div id="snackbar-succes-edit">Successfully edit</div>
                </div>


                <div id='formback_movie_id' className="formback_movie">

                    <div id="movie" className="div_player_movie">

                        <Player

                            ref={player => {

                                this.player = player;

                            }}

                            autoPlay

                            src={this.state.file_show_when_click}
                            id='players'

                        >

                            <Shortcut clickable={false} shortcuts={this.newShortcuts}/>


                        </Player>


                    </div>

                    <div id='firstprogress'>

                        <CircularProgress disableShrink color="secondary"/>

                    </div>
                    <div id='nameofthefilm'>
                        No movie has been selected yet
                    </div>
                    <div className='fullscreendiv'>
                        <IconButton id="fullscreenid" onClick={this.fullscreen} style={{
                            color: 'white',
                            cursor: "pointer",
                            pointerEvents: "auto",
                            zIndex: '999',
                        }} size='large' className="fullscreenbtn">


                            <FullscreenIcon/>
                        </IconButton>
                    </div>


                    <div id='movietxtdiv'>

                        <p id='movietxt'>Wait for admin to select the video</p>

                    </div>
                    <div id='controllbuttons2'></div>
                    <div id='controllbuttons'>

                        <div className="upload-btn-wrapper">

                            <IconButton style={{
                                color: 'white'


                            }} size='large' id='videopickbtn' className="btn" variant="contained" color="secondary">

                                <EjectIcon/>
                            </IconButton>


                            <input type="file" id='videopicks' className='videopicsk' name="file"

                                   onChange={(e) => this.onChange(e)}/>


                            <IconButton onClick={this.changeCurrentTime(-10)} style={{

                                transform: 'scaleX(-1)',
                                color: 'white'


                            }} size='large' className="mr-3">


                                <Forward10Icon/>

                            </IconButton>


                            <IconButton onClick={this.play} style={{
                                color: 'white'

                            }}
                                        id='play_btnid'
                                        className="play_btn">
                                <PlayArrowIcon fontSize="large"/>
                            </IconButton>


                            <IconButton onClick={this.pause} style={{
                                color: 'white',
                                marginTop: '2px',
                                display: 'none'
                            }} size='large'
                                        id="pause_btnid"
                                        className="pause_btn">


                                <PauseIcon/>

                            </IconButton>

                            <IconButton onClick={this.changeCurrentTime(10)} style={{
                                color: 'white'


                            }} size='large' className="mr-3">


                                <Forward10Icon/>
                            </IconButton>

                            <IconButton id='reselect' style={{
                                color: 'white'


                            }} size='large' className="mr-3">


                                <StopIcon/>
                            </IconButton>


                        </div>

                        <div id='blaybtndiv'>


                            <div className="control" id='controll_div'>

                                <IconButton onClick={this.changeCurrentTime(-10)} style={{

                                    transform: 'scaleX(-1)',
                                    color: 'white'


                                }} size='large' className="mr-3">


                                    <Forward10Icon/>

                                </IconButton>


                                <IconButton onClick={this.play} style={{
                                    color: 'white'

                                }}
                                            className="play_btn">
                                    <PlayArrowIcon fontSize="large"/>
                                </IconButton>


                                <IconButton onClick={this.pause} style={{color: 'white'}} size='large'
                                            className="pause_btn">


                                    <PauseIcon/>

                                </IconButton>

                                <IconButton onClick={this.changeCurrentTime(10)} style={{
                                    color: 'white'


                                }} size='large' className="mr-3">


                                    <Forward10Icon/>
                                </IconButton>


                            </div>
                        </div>


                        <div id='moviebtnd' className='moviebtns'>


                            <br/><br/><br/><br/>


                            <div id='progress'>
                                <CircularProgress disableShrink color="secondary"/>
                            </div>


                        </div>


                    </div>


                </div>


                <abbr title="Chat messanger">
                    <IconButton style={{
                        transform: 'scaleX(-1)',
                        color: 'white'
                    }}

                                className="openchat">

                        <FirstPageIcon fontSize="large"/>
                    </IconButton>
                </abbr>


                <div id='mysidenav2' className="back_coulom">

                    <div id='formback_text_id' className="formback_text">

                        <div className="formback_text">

                            <div className='titleofchat'> Chat</div>
                            <p className="khat">______________________________</p>
                            <div id='pmid' className="pm">


                            </div>


                            <div className="input_send">


                                <input className="formback_text_input" id="formback_text_input" autocomplete="off">

                                </input>
                                <div className='sendbutton'>
                                    <IconButton style={{
                                        color: 'white',
                                        fontSize: '80px'
                                    }}
                                                className="send_btn">
                                        <SendIcon/>
                                    </IconButton>
                                </div>
                            </div>


                        </div>


                    </div>

                </div>
            </form>


        )

    }

}


export default chat_room;
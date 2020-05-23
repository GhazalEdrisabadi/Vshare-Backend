import React, {Component} from 'react'

import './chat_room.css'

import $ from 'jquery';

import Websocket from 'react-websocket';

import Home from './home.png'

import Button from '@material-ui/core/Button';

import RedoIcon from '@material-ui/icons/Redo';

import Avatar from '@material-ui/core/Avatar'
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
import Select from 'react-select';

var Able_chat = 0;
var Able_controll = 0;
var Able_select = 0;
var adminisinstatezero = 1;
var logoutclicked = 0;
var azavalbude = 0;
var percant = 0;

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
        console.log(url)
        console.log(url1)
        console.log("is admin : " + isadmin);
        document.addEventListener("keyup", this.handlereq_forward_backward, false);

        console.log(localStorage.getItem('token'))

        //  id_gp = "test";

        //This will open the connection*


        ws.onopen = function () {

            console.log("Ping");

        };
        ws1.onopen = function () {
            console.log("ws1.open")

        }


        ws1.onmessage = evt => {
            messagee1 = JSON.parse(evt.data)
            console.log(messagee1)
            console.log(messagee1.message)


            if (messagee1.command == "chat_client") {

                if (messagee1.user == window.localStorage.getItem('username')) {
                    $(".pm").append("<div id='pmeman'>" + "me: " + messagee1.message + "</div>");

                } else {
                    $(".pm").append("<div id='pmeoon'>" + messagee1.user + ": " + messagee1.message + "</div>");
                }

                $(".pm").append("<br>")


                var element = document.getElementById("pmid");
                element.scrollTop = element.scrollHeight;


            }
            if (messagee1.message == 'isoffline' || messagee1.message == 'isonline') {
                console.log("onlineeeeeee")

                setTimeout(function () {
                    $('.onlinemembers').html('');
                    var settings = {
                        "url": "http://127.0.0.1:8000/group/online_users/?group=" + id,
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
                        console.log('aaaa12');
                        console.log(response);
                        for (var onlinememberscounter = 0; onlinememberscounter < response.length; onlinememberscounter++)
                            //  setTimeout(function () {
                            $('.onlinemembers').append('<p id="members">' + response[onlinememberscounter].online_user + '</p>');
                        //  },500);
                    });

                }, 250);


            }


        }

        ws.onmessage = evt => {

            console.log("messsssssage")

            const messagee = JSON.parse(evt.data)

            this.setState({server_pm: messagee})

            console.log(messagee)

            console.log(messagee.message)


            if (logoutclicked == 0 && adminisinstatezero == 0 && ("group was reset!" == messagee.message || "Nothing to reset in this state!" == messagee.message)) {
                window.location.reload();
            }
            if ("this is current time for new users" == messagee.message) {
                this.changeCurrentTime(messagee.time);
                this.play();
                $('#moviebtnd').fadeOut();
            }
            if (clienthashok == 0 && messagee.status == 1 && isadmin == 0) {
                adminhash = messagee.hash;
                $('#movietxt').fadeOut('slow');
                //  $('#reselect').fadeOut('fast');
                document.getElementById('reselect').style.pointerEvents = 'none';
                $('#moviebtnd').fadeIn('slow');
                if (iscontroller == 0)
                    document.getElementById('controllbuttons').style.pointerEvents = 'none';
                document.getElementById('videopickbtn').style.pointerEvents = 'auto';
                document.getElementById('videopicks').style.pointerEvents = 'auto';
                $('#movietxt').text('Click ▲ to select your video ');
                $('#movietxt').fadeIn();
                console.log('admin hash : ' + adminhash);


            }


            console.log(play_or_no)

            if (messagee.status == 0 && isadmin == 0) {
                azavalbude = 1;
            }

            if (messagee.status == 2 && isadmin == 0 && filmplayed == 0) {
                rejoined = 1;
                $('#movietxt').text('Admin has played the video , select your video too by clicking on ▲ ');
                $('#moviebtnd').fadeIn('slow');
                document.getElementById('videopickbtn').style.pointerEvents = 'auto';
                document.getElementById('videopicks').style.pointerEvents = 'auto';
                if (comeinstate1 == 0 && azavalbude == 0)
                    adminhash = messagee.hash;
                //console.log("admin hash in state 2 : " + adminhash);
            }


            if (messagee.status == 1 && isadmin == 0 && azavalbude == 0 && clienthashok == 0) {
                adminhash = messagee.hash;
                console.log("admin hash in state 2 : " + adminhash);
                rejoined = 1;
                $('#movietxt').text('Admin has selected the video , select it too by clicking on ▲ ');
                $('#moviebtnd').fadeIn('slow');
                adminhash = messagee.hash;
                comeinstate1 = 1;

            }


            if (messagee.status == 2 && play_or_no == true) {

                this.setState({

                    file_show_when_click: this.state.file_select

                })
                document.getElementById("formback_movie_id").style.background = "black";
                document.getElementById('movie').style.display = 'block';
                filmplayed = 1;
                document.getElementById('movietxt').style.display = 'none';
                if (iscontroller == 1) {
                    console.log("ssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss");
                    document.getElementById("controllbuttons2").style.zIndex = "-1";
                    document.getElementById('controllbuttons').style.pointerEvents = 'auto';
                }

                if (!(isadmin == 1 || iscontroller == 1)) {
                    console.log("ppppppppppppppppppppppppppppppppppppppppppp");
                    // document.getElementById('controllbuttons').style.display = 'none';
                    document.getElementById("controllbuttons2").style.zIndex = "1";
                    document.getElementById('controllbuttons').style.pointerEvents = 'none';
                    document.getElementById('videopicks').style.pointerEvents = 'none';
                    document.getElementById('movie').style.pointerEvents = 'none';

                }
                // document.getElementById('controll_div').style.display = 'block'


            }


            if (messagee.status == 2 && messagee.message == "new user's hash is ok." && isadmin == 1) {


                this.player.pause();
                const {player} = this.player.getState();
                console.log("curent " + player.currentTime)

                const message_send_play = {"command": "send_current_time", "currentTime": player.currentTime};
                ws.send(JSON.stringify(message_send_play));

            }
            if (messagee.status == 2 && messagee.message == "video paused by owner") {
                var time = messagee.time
                this.player.seek(time)
                this.player.pause();


            }
            if (messagee.status == 2 && messagee.message == "video played by owner again") {
                var time = messagee.time
                this.player.seek(time)
                this.player.play();


            }


        };


        const {id} = this.props.match.params

        $(document).ready(function () {
            // setTimeout(function () {
            //     const message_reselect = {"command": "reset"}
            //     ws.send(JSON.stringify(message_reselect));
            // }, 300);


            if (isadmin == 1 || isselector == 1) {
                $('#videopicks').fadeIn('fast');
            } else {
                if (iscontroller == 0)
                    document.getElementById('controllbuttons').style.pointerEvents = 'none';

            }
            $("#playbtnid").click(function () {
                filmplayed = 1;
            });

            //$(document).keyup(function (e) {
            //    if (e.keyCode == 39) {

            //        const { player } = this.player.getState();

            //        console.log("curent " + player.currentTime)

            //        const message_send_play = { "command": "play_video", "currentTime": player.currentTime }


            //        // ws.send(JSON.stringify(message_send))

            //        ws.send(JSON.stringify(message_send_play))

            //        console.log(JSON.stringify(message_send_play))
            //    }
            //});


            $(document).on("keypress", "input", function (e) {

                if (e.which == 13) {

                    var massage = $(".formback_text_input").val();
                    const message_send_chat = {"command": "chat_client", "message_client": massage}
                    ws1.send(JSON.stringify(message_send_chat))
                    $('.formback_text_input').val('');


                    e.preventDefault();
                }
            });


            if (window.localStorage.getItem('token') == null) {


                alert("Login first !");


                window.location.replace("/login/");


            }
            window.onclick = function (event) {

                if (event.target == document.getElementById("myModal")) {
                    $('.modal-').fadeOut("slow");
                }
            }
            $('.logout').click(function () {
                window.localStorage.setItem('id_gp', '');
                // ws1.close();
                logoutclicked = 1;


                setTimeout(function () {
                    const message_reselect = {"command": "reset"}
                    ws.send(JSON.stringify(message_reselect));
                    window.location.replace('/homepage/');
                }, 300);


            });
            $('.submitedit_popup').click(function () {


                var title = $('#edittitle_popup').val();
                var des = $('#editdes_popup').val();

                var form = new FormData();

                if (title != "")
                    form.append("title", title);
                if (des != '')
                    form.append("describtion", des);


                var settings = {
                    "url": "http://127.0.0.1:8000/groups/" + id_gp + "/",
                    "method": "PUT",
                    "timeout": 0,
                    "headers": {
                        "Authorization": "Token " + localStorage.getItem('token')
                    },
                    success: function () {

                        var x = document.getElementById("snackbar-succes-edit");
                        x.className = "show";
                        setTimeout(function () {
                            x.className = x.className.replace("show", "");
                        }, 3000);
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

                            $(".photogp").html(response.title.toUpperCase()[0]);

                            $(".name").html(response.title);

                            $(".namegp").html(response.title);

                            $(".idgp").html('@ ' + response.groupid);
                            $(".desbody").html(response.describtion);
                            $(".inputedit-title").val(response.title)
                            $(".inputedit-des").val(response.describtion)
                            document.getElementById('myModal_popup').style.display = 'none'
                        })
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
                    console.log(response);
                });

            })
            $('.edit_group').click(function () {
                alert('hdhhfhfhf')
                console.log("sdnskdbclskdbcn")
            });
            $('#reselect').click(function () {
                const message_reselect = {"command": "reset"}
                ws.send(JSON.stringify(message_reselect));

                //

            });

            $("#movie").dblclick(function (e) {
                e.preventDefault();

                /*  Prevents event bubbling  */
                e.stopPropagation();

                return;
            });

            /*  $("#formback_movie_id").mouseover(function () {
<<<<<<< HEAD
>>>>>>> features/stream-frontend
=======


>>>>>>> dev
                  if (filmplayed == 1)
                      $('#controll_div').fadeIn();
              });
              $("#formback_movie_id").mouseleave(function () {
                  $('#controll_div').fadeOut();
              });
  */

            $('.username').text(window.localStorage.getItem('username'));

            //id_gp = "test";

            //This will open the connection*

            document.getElementById('moviebtnd').style.display = 'none';

            document.getElementById('movietxt').style.display = 'none';

            setTimeout(function () {
                if (isadmin == 1 || isselector == 1) {

                    document.getElementById('moviebtnd').style.display = 'block';


                    document.getElementById('movietxt').style.display = 'block';
                    $('#movietxt').text('Click ▲ to select your video ');
                    if (iscontroller == 0)
                        document.getElementById('controllbuttons').style.pointerEvents = 'none';
                    document.getElementById('reselect').style.pointerEvents = 'auto';
                    document.getElementById('videopickbtn').style.pointerEvents = 'auto';
                    document.getElementById('videopicks').style.pointerEvents = 'auto';


                    //$('#videopickbtn').fadeIn('fast');

                    //    $('#movietxt').fadeOut('fast');


                } else {

                    // document.getElementById('reselect').style.display = 'none';
                    document.getElementById('reselect').style.pointerEvents = 'none';

                    if (rejoined == 0)
                        document.getElementById('moviebtnd').style.display = 'none';

                    document.getElementById('movietxt').style.display = 'block';

                    //   $('#videopickbtn').fadeOut('fast');

                    // $('#movietxt').fadeIn('fast');

                }

            }, 500);

            $("#formback_movie_id").mouseover(function () {

                if (filmplayed == 1)
                    $('#controllbuttons').fadeIn();

            });
            $("#formback_movie_id").mouseleave(function () {
                if (filmplayed == 1)
                    $('#controllbuttons').fadeOut();
            });


            //$('#videopickbtn').fadeIn('fast');
            //    $('#movietxt').fadeOut('fast');


            // if (localStorage.getItem('token') == null) {
            //     alert("Login please !");
            //     window.location.replace("/login/");
            // }


            var id = window.localStorage.getItem('id_gp');


            var settings = {
                "url": "http://127.0.0.1:8000/group/online_users/?group=" + id,
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
                console.log('aaaa');
                console.log(response);
                for (var onlinememberscounter = 0; onlinememberscounter < response.length; onlinememberscounter++)
                    //  setTimeout(function () {
                    $('.onlinemembers').append('<p id="members">' + response[onlinememberscounter].online_user + '</p>');
                //  },500);
            });


            $('#videopicks').change(function () {

                if (isadmin == 1 || isselector == 1) {

                    //   $('#videopickbtn').fadeOut('fast');
                    document.getElementById('videopickbtn').style.pointerEvents = 'none';
                    document.getElementById('videopicks').style.pointerEvents = 'none';

                    // $('#reselect').fadeIn('fast');
                    document.getElementById('reselect').style.pointerEvents = 'auto';

                    $('#firstprogress').fadeIn();
                    $('#movietxt').fadeOut();

                }

            });


            // if (localStorage.getItem('token') == null) {

            //     alert("Login please !");

            //     window.location.replace("/login/");

            // }


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

                $(".photogp").html(response.title.toUpperCase()[0]);

                $(".name").append(response.title);

                $(".namegp").append(response.title);

                $(".idgp").append('@ ' + response.groupid);

                $(".desbody").append(response.describtion);
                $(".inputedit-title").val(response.title)
                $(".inputedit-des").val(response.describtion)
                create_by = response.created_by


                for (var counter1 = 0; counter1 < response.members.length; counter1++, htmlcode = '') {
                    var obj = {}

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

                            //'X-CSRFToken': csrftoken,

                            //  "Authorization": "token " + token,

                            "accept": "application/json",

                            "Access-Control-Allow-Origin": "*",

                            "Access-Control-Allow-Headers": "*",

                            "Content-Type": "application/json"

                        }

                    };


                    $.ajax(settings).done(function (response_) {


                        console.log(response_);
                        if (response_.member == window.localStorage.getItem('username')) {
                            iscontroller = response_.playback_permission;
                            isselector = response_.choose_video_permission;
                        }
                        controller = response_.playback_permission
                        selector = response_.choose_video_permission

                        console.log("117778878")
                        var r = "window.open('/profile/" + response_.member + "')";
                        var a = "window.localStorage.setItem('user','" + response_.member + "')"; //id of the group
                        var hoverout = 'onMouseOut="this.style.color=';
                        var hoverrout = hoverout + "'white'";
                        var hover = 'onMouseOver="this.style.color=';
                        var hoverr = hover + "'red'";
                        var hoverout1 = 'onMouseOut="this.style.backgroundColor=';
                        var hoverrout1 = hoverout1 + "'rgb(35, 35, 35)'";
                        var hover1 = 'onMouseOver="this.style.backgroundColor=';
                        var hoverr1 = hover1 + "'rgb(365, 365,365,0.1)'";
                        htmlcode = ''
                        htmlcode += '<div class="divMem"' + hoverr1 + '"' + hoverrout1 + '"' + '>'
                        htmlcode += '<p ' + hoverr + '"' + hoverrout + '"' + ' style="font-size: 21px" class="mygroups"  onclick="' + a + "," + r + "," + r + '" id=' + '"c' + counter1 + '">' + "&nbsp" + response_.member + '</p>';
                        ;

                        if (response_.member == create_by && controller && selector) {
                            htmlcode += '<p  style="font-size: 15px" class="permissiontitle"  >admin</p>';
                        } else {

                            if (controller && selector) {
                                htmlcode += '<p  style="font-size: 15px" class="permissiontitle"  >selector &nbsp controller</p>';
                            }
                            if (controller && !selector) {
                                htmlcode += '<p  style="font-size: 15px" class="permissiontitle"  > controller</p>';
                            }
                            if (!controller && selector) {
                                htmlcode += '<p  style="font-size: 15px" class="permissiontitle"  >selector </p>';
                            }

                        }

                        htmlcode += '</div>';

                        $(".infobody").append(htmlcode);

                    })

                }
                console.log(op)
            });


            //Log the messages that are returned from the server

            $(".name").click(function () {

                document.getElementById('myModal').style.display = 'block'


            });


//Log the messages that are returned from the server
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
                for (var count_per = 0; count_per < per.length; count_per++) {
                    if (per[count_per].value == 1) {
                        Able_select = 1
                    }
                    if (per[count_per].value == 2) {
                        Able_controll = 1
                    }
                }
                var member_per = member_edit.value
                console.log(member_per)
                var settings = {
                    "url": "http://127.0.0.1:8000/group/" + id_gp + "/permissions/?member=" + member_per + "",
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
                            $(".infobody").html('');
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

                            create_by = response.created_by


                            for (var counter1 = 0; counter1 < response.members.length; counter1++, htmlcode = '') {

                                var htmlcode = '';
                                var controller = null
                                var selector = null

                                var settings = {

                                    "url": "http://127.0.0.1:8000/group/" + id_gp + "/permissions/?member=" + response.members[counter1] + "",

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


                                $.ajax(settings).done(function (response_) {


                                    console.log(response_);
                                    if (response_.member == window.localStorage.getItem('username')) {
                                        iscontroller = response_.playback_permission;
                                        isselector = response_.choose_video_permission;
                                    }
                                    controller = response_.playback_permission;
                                    selector = response_.choose_video_permission;

                                    console.log("117778878");
                                    var r = "window.open('/profile/" + response_.member + "')";
                                    var a = "window.localStorage.setItem('user','" + response_.member + "')"; //id of the group
                                    var hoverout = 'onMouseOut="this.style.color=';
                                    var hoverrout = hoverout + "'white'";
                                    var hover = 'onMouseOver="this.style.color=';
                                    var hoverr = hover + "'red'";
                                    var hoverout1 = 'onMouseOut="this.style.backgroundColor=';
                                    var hoverrout1 = hoverout1 + "'rgb(35, 35, 35)'";
                                    var hover1 = 'onMouseOver="this.style.backgroundColor=';
                                    var hoverr1 = hover1 + "'rgb(365, 365,365,0.1)'";
                                    htmlcode = ''
                                    htmlcode += '<div class="divMem"' + hoverr1 + '"' + hoverrout1 + '"' + '>'
                                    htmlcode += '<p ' + hoverr + '"' + hoverrout + '"' + ' style="font-size: 21px" class="mygroups"  onclick="' + a + "," + r + "," + r + '" id=' + '"c' + counter1 + '">' + "&nbsp" + response_.member + '</p>';
                                    ;

                                    if (response_.member == create_by && controller && selector) {
                                        htmlcode += '<p  style="font-size: 15px" class="permissiontitle"  >admin</p>';
                                    } else {

                                        if (controller && selector) {
                                            htmlcode += '<p  style="font-size: 15px" class="permissiontitle"  >selector &nbsp controller</p>';
                                        }
                                        if (controller && !selector) {
                                            htmlcode += '<p  style="font-size: 15px" class="permissiontitle"  > controller</p>';
                                        }
                                        if (!controller && selector) {
                                            htmlcode += '<p  style="font-size: 15px" class="permissiontitle"  >selector </p>';
                                        }

                                    }

                                    htmlcode += '</div>';
                                    console.log(htmlcode)
                                    $(".infobody").append(htmlcode);

                                })

                            }
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
                            "chat_permission": 1,
                            "choose_video_permission": Able_select,
                            "playback_permission": Able_controll,
                            "group": id_gp,
                            "member": member_per,
                        }
                    ),
                };

                $.ajax(settings).done(function (response) {
                    console.log("done")
                    console.log(response);

                });

            })
            $(".btnadd").click(function () {
                console.log(per_add)
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
                console.log(Able_select)
                console.log(Able_controll)
                var member_add = $(".inp-add").val();

                console.log(id_gp)

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
                                            $(".infobody").html('');
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

                                            create_by = response.created_by


                                            for (var counter1 = 0; counter1 < response.members.length; counter1++, htmlcode = '') {
                                                op = []
                                                var obj = {}

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

                                                        //'X-CSRFToken': csrftoken,

                                                        //  "Authorization": "token " + token,

                                                        "accept": "application/json",

                                                        "Access-Control-Allow-Origin": "*",

                                                        "Access-Control-Allow-Headers": "*",

                                                        "Content-Type": "application/json"

                                                    }

                                                };


                                                $.ajax(settings).done(function (response_) {


                                                    console.log(response_);
                                                    if (response_.member == window.localStorage.getItem('username')) {
                                                        iscontroller = response_.playback_permission;
                                                        isselector = response.choose_video_permission;
                                                    }
                                                    controller = response_.playback_permission
                                                    selector = response_.choose_video_permission

                                                    console.log("117778878")
                                                    var r = "window.open('/profile/" + response_.member + "')";
                                                    var a = "window.localStorage.setItem('user','" + response_.member + "')"; //id of the group
                                                    var hoverout = 'onMouseOut="this.style.color=';
                                                    var hoverrout = hoverout + "'white'";
                                                    var hover = 'onMouseOver="this.style.color=';
                                                    var hoverr = hover + "'red'";
                                                    var hoverout1 = 'onMouseOut="this.style.backgroundColor=';
                                                    var hoverrout1 = hoverout1 + "'rgb(35, 35, 35)'";
                                                    var hover1 = 'onMouseOver="this.style.backgroundColor=';
                                                    var hoverr1 = hover1 + "'rgb(365, 365,365,0.1)'";
                                                    htmlcode = ''
                                                    htmlcode += '<div class="divMem"' + hoverr1 + '"' + hoverrout1 + '"' + '>'
                                                    htmlcode += '<p ' + hoverr + '"' + hoverrout + '"' + ' style="font-size: 21px" class="mygroups"  onclick="' + a + "," + r + "," + r + '" id=' + '"c' + counter1 + '">' + "&nbsp" + response_.member + '</p>';
                                                    ;

                                                    if (response_.member == create_by && controller && selector) {
                                                        htmlcode += '<p  style="font-size: 15px" class="permissiontitle"  >admin</p>';
                                                    } else {

                                                        if (controller && selector) {
                                                            htmlcode += '<p  style="font-size: 15px" class="permissiontitle"  >selector &nbsp controller</p>';
                                                        }
                                                        if (controller && !selector) {
                                                            htmlcode += '<p  style="font-size: 15px" class="permissiontitle"  > controller</p>';
                                                        }
                                                        if (!controller && selector) {
                                                            htmlcode += '<p  style="font-size: 15px" class="permissiontitle"  >selector </p>';
                                                        }

                                                    }

                                                    htmlcode += '</div>';
                                                    console.log(htmlcode)
                                                    $(".infobody").append(htmlcode);

                                                })

                                            }
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

                                    console.log(response);
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

                            console.log(response);
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
                    // 
                    console.log(response);

                });

            });
            $(".send_btn").click(function () {
                var massage = $(".formback_text_input").val();

                const message_send_chat = {"command": "chat_client", "message_client": massage}
                ws1.send(JSON.stringify(message_send_chat))
                $('.formback_text_input').val('');


                console.log(JSON.stringify(message_send_chat))


            });


            var settings = {

                "url": "  http://127.0.0.1:8000/group/messages/?target=" + id,
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
                console.log(response);
                for (var counterchathistory = response.results.length - 1; counterchathistory >= 0; counterchathistory--) {
                    if (response.results[counterchathistory].message_sender == window.localStorage.getItem('username')) {
                        $(".pm").append("<div id='pmeman'>" + "me: " + response.results[counterchathistory].message_text + "</div>");

                    } else {
                        $(".pm").append("<div id='pmeoon'>" + response.results[counterchathistory].message_sender + ": " + response.results[counterchathistory].message_text + "</div>");
                    }
                    $(".pm").append("<br>");
                }
                var element = document.getElementById("pmid");
                element.scrollTop = element.scrollHeight;

            });

            setTimeout(function () {
                console.log("is admin : " + isadmin);
                console.log("is controller: " + iscontroller);
                console.log("is selector : " + isselector);

            }, 1000);

        });
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

        }

        this.onChange = this.onChange.bind(this);

        this.handleSubmit = this.handleSubmit.bind(this);


        this.play = this.play.bind(this);

        this.pause = this.pause.bind(this);
        this.handlereq_forward_backward = this.handlereq_forward_backward.bind(this);

        this.changeCurrentTime = this.changeCurrentTime.bind(this);

        this.newShortcuts = [


            // Press number 1 to jump to the postion of 10%

            {


                keyCode: 32, // Number 1


                // handle is the function to control the player

                // player: the player's state

                // actions: the player's actions

                handle: (player, actions) => {


                    const current_time = player.currentTime;


                    // jump to the postion of 10%


                    if (Play_pause_space == 0) {

                        console.log("pause")
                        played = 0;
                        //  actions.pause()


                        console.log("curent " + current_time)

                        const message_send_play = {"command": "pause_video", "currentTime": current_time}

                        // ws.send(JSON.stringify(message_send))

                        ws.send(JSON.stringify(message_send_play))

                        console.log(JSON.stringify(message_send_play))
                        $('#play_btnid').fadeIn('fast');
                        $('#pause_btnid').fadeOut('fast');

                        // this.player.pause();

                        Play_pause_space = 1;


                        return

                    }

                    if (Play_pause_space == 1) {
                        played = 1;
                        console.log("play")

                        //  actions.play()

                        Play_pause_space = 0;

                        console.log("curent " + current_time)

                        const message_send_play = {"command": "play_video", "currentTime": current_time}

                        // ws.send(JSON.stringify(message_send))

                        ws.send(JSON.stringify(message_send_play))

                        console.log(JSON.stringify(message_send_play))

                        $('#play_btnid').fadeOut('fast');
                        $('#pause_btnid').fadeIn('fast');

                        // this.player.play();

                        return

                    }

                }

            },

            {

                keyCode: 75, // Right arrow

                // Ctrl/Cmd

                handle: (player, actions) => {
                    console.log("press k")

                }

            },

            {

                keyCode: 74, // Right arrow

                // Ctrl/Cmd

                handle: (player, actions) => {

                    console.log("press j")


                }

            },
            {

                keyCode: 76, // Right arrow

                // Ctrl/Cmd

                handle: (player, actions) => {

                    console.log("press l")


                }

            },
            {

                keyCode: 36, // Right arrow

                // Ctrl/Cmd

                handle: (player, actions) => {

                    console.log("press home")


                }

            },
            {

                keyCode: 74, // Right arrow

                // Ctrl/Cmd

                handle: (player, actions) => {

                    console.log("press end")


                }

            },
            {

                keyCode: 70, // Right arrow

                // Ctrl/Cmd

                handle: (player, actions) => {

                    console.log("press f")


                }

            },
            {

                keyCode: 49, // Right arrow

                // Ctrl/Cmd

                handle: (player, actions) => {


                    const duration = player.duration;
                    // jump to the postion of 10%

                    const message_send_play = {"command": "play_video", "currentTime": duration * 0.1}

                    // ws.send(JSON.stringify(message_send))

                    ws.send(JSON.stringify(message_send_play))

                    console.log(JSON.stringify(message_send_play))

                }

            },
            {

                keyCode: 57, // Right arrow

                // Ctrl/Cmd

                handle: (player, actions) => {


                    const duration = player.duration;
                    // jump to the postion of 10%

                    const message_send_play = {"command": "play_video", "currentTime": duration * 0.9}

                    // ws.send(JSON.stringify(message_send))

                    ws.send(JSON.stringify(message_send_play))

                    console.log(JSON.stringify(message_send_play))

                }

            },
            {

                keyCode: 50, // Right arrow

                // Ctrl/Cmd

                handle: (player, actions) => {


                    const duration = player.duration;
                    // jump to the postion of 10%

                    const message_send_play = {"command": "play_video", "currentTime": duration * 0.2}

                    // ws.send(JSON.stringify(message_send))

                    ws.send(JSON.stringify(message_send_play))

                    console.log(JSON.stringify(message_send_play))

                }

            },
            {

                keyCode: 51, // Right arrow

                // Ctrl/Cmd

                handle: (player, actions) => {


                    const duration = player.duration;
                    // jump to the postion of 10%

                    const message_send_play = {"command": "play_video", "currentTime": duration * 0.3}

                    // ws.send(JSON.stringify(message_send))

                    ws.send(JSON.stringify(message_send_play))

                    console.log(JSON.stringify(message_send_play))

                }

            },
            {

                keyCode: 52, // Right arrow

                // Ctrl/Cmd

                handle: (player, actions) => {


                    const duration = player.duration;
                    // jump to the postion of 10%

                    const message_send_play = {"command": "play_video", "currentTime": duration * 0.4}

                    // ws.send(JSON.stringify(message_send))

                    ws.send(JSON.stringify(message_send_play))

                    console.log(JSON.stringify(message_send_play))

                }


            },
            {

                keyCode: 53, // Right arrow

                // Ctrl/Cmd

                handle: (player, actions) => {


                    const duration = player.duration;
                    // jump to the postion of 10%

                    const message_send_play = {"command": "play_video", "currentTime": duration * 0.5}

                    // ws.send(JSON.stringify(message_send))

                    ws.send(JSON.stringify(message_send_play))

                    console.log(JSON.stringify(message_send_play))

                }

            },
            {

                keyCode: 54, // Right arrow

                // Ctrl/Cmd

                handle: (player, actions) => {


                    const duration = player.duration;
                    // jump to the postion of 10%

                    const message_send_play = {"command": "play_video", "currentTime": duration * 0.6}

                    // ws.send(JSON.stringify(message_send))

                    ws.send(JSON.stringify(message_send_play))

                    console.log(JSON.stringify(message_send_play))

                }

            },
            {

                keyCode: 55, // Right arrow

                // Ctrl/Cmd

                handle: (player, actions) => {


                    const duration = player.duration;
                    // jump to the postion of 10%

                    const message_send_play = {"command": "play_video", "currentTime": duration * 0.7}

                    // ws.send(JSON.stringify(message_send))

                    ws.send(JSON.stringify(message_send_play))

                    console.log(JSON.stringify(message_send_play))

                }

            },
            {

                keyCode: 56, // Right arrow

                // Ctrl/Cmd

                handle: (player, actions) => {


                    const duration = player.duration;
                    // jump to the postion of 10%

                    const message_send_play = {"command": "play_video", "currentTime": duration * 0.8}

                    // ws.send(JSON.stringify(message_send))

                    ws.send(JSON.stringify(message_send_play))

                    console.log(JSON.stringify(message_send_play))

                }

            },
        ];


    }

    handleSubmit(e) {


        const message_send_play = {"command": "play_video", "currentTime": "0"}


        // ws.send(JSON.stringify(message_send))

        ws.send(JSON.stringify(message_send_play))

        console.log(JSON.stringify(message_send_play))

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
        console.log(file)

        function Send_data() {

            const message_send = {"command": "set_video_hash", "vhash": encrypted}


            // ws.send(JSON.stringify(message_send))

            ws.send(JSON.stringify(message_send))

            console.log(JSON.stringify(message_send))


            //ws.onmessage = evt => {

            //    console.log("messsssssage")

            //    const messagee = JSON.parse(evt.data)

            //    // this.setState({server_pm: messagee})

            //    console.log(messagee)

            //    console.log(+messagee.message)

            //};

        }


        function Send_data2() {
            $('#moviebtnd').fadeOut('slow');
            const message_send = {"command": "send_client_hash", "vhash": encrypted}

            play_or_no = true


            // ws.send(JSON.stringify(message_send))

            ws.send(JSON.stringify(message_send))

            console.log(JSON.stringify(message_send))


            //ws.onmessage = evt => {

            //    console.log("messsssssage")

            //    const messagee = JSON.parse(evt.data)

            //    // this.setState({server_pm: messagee})

            //    console.log(messagee)

            //    console.log(+messagee.message)

            //};

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


            if (percant == 100) {
                if (isadmin == 1 || isselector == 1) {


                    Send_data();

                    document.getElementById('blaybtndiv').style.display = 'block';
                    $('#movietxt').text('Click ► to play your video');
                    $('#movietxt').fadeIn();
                    document.getElementById('controllbuttons').style.pointerEvents = 'auto';


                    document.getElementById('firstprogress').style.display = 'none';

                } else {

                    if (encrypted == adminhash) {
                        clienthashok = 1;
                        filmplayed = 1;
                        document.getElementById('firstprogress').style.display = 'none';
                        if (iscontroller == 0)
                            $('#movietxt').text('Wait for admin to play the video');
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
                        //  play_or_no = true
                        Send_data2();


                    } else {

                        document.getElementById('firstprogress').style.display = 'none';

                        $('#movietxt').text('Your video is not same with admin\'s video , please chose another one');

                        $('#movietxt').fadeIn();

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


        console.log("aa");

    }


    Send_data() {


    }

    play() {

        const {player} = this.player.getState();

        console.log("curent " + player.currentTime)

        const message_send_play = {"command": "play_video", "currentTime": player.currentTime}

        // ws.send(JSON.stringify(message_send))

        ws.send(JSON.stringify(message_send_play))

        console.log(JSON.stringify(message_send_play))
        play_or_no = true;
        played = 1;
        $('#play_btnid').fadeOut('fast');
        $('#pause_btnid').fadeIn('fast');

        //this.player.play();


    }


    pause() {

        const {player} = this.player.getState();

        console.log("curent " + player.currentTime)

        const message_send_play = {"command": "pause_video", "currentTime": player.currentTime}

        // ws.send(JSON.stringify(message_send))

        ws.send(JSON.stringify(message_send_play))

        console.log(JSON.stringify(message_send_play))

        played = 0;
        console.log('played : ' + played);
        $('#play_btnid').fadeIn('fast');
        $('#pause_btnid').fadeOut('fast');

        //this.player.pause();


    }

    changeCurrentTime(seconds) {

        return () => {

            const {player} = this.player.getState();

            console.log("curent " + player.currentTime)
            var message_send_play;
            if (played == 1)
                message_send_play = {"command": "play_video", "currentTime": player.currentTime + seconds}
            else
                message_send_play = {"command": "pause_video", "currentTime": player.currentTime + seconds}
            ws.send(JSON.stringify(message_send_play))

            console.log(JSON.stringify(message_send_play))


            // this.player.seek(player.currentTime + seconds);

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
        console.log("hoooooooold")
        if (event.keyCode == 39 || event.keyCode == 37) {
            console.log('played : ' + played);
            const {player} = this.player.getState();

            console.log("curent " + player.currentTime)
            var message_send_play2;
            if (played == 1)
                message_send_play2 = {"command": "play_video", "currentTime": player.currentTime}
            else
                message_send_play2 = {"command": "pause_video", "currentTime": player.currentTime}
            // ws.send(JSON.stringify(message_send))

            ws.send(JSON.stringify(message_send_play2))

            console.log(JSON.stringify(message_send_play2))
            //console.log("11111111111111111111111111111111")
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
        console.log(per_add)

    }
    handleChanges_id = selectedOption_id => {
        this.setState(
            {selectedOption_id},
            () => member_edit = this.state.selectedOption_id
        );
        console.log(per_add)

    }

    render() {


        return (


            <div>


                < form className="back">


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

                            <Select className='select' placeholder="select your id"
                                    value={this.state.selectedOption_id}
                                    onChange={this.handleChanges_id}
                                    options={op}
                            />
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


                    <div className="back_coulom">


                        <div className="formback_info" style={{width: '350px', height: '395px'}}>

                            <div className="name"/>

                            <p className="khat">_______________________</p>

                            <p className='titleofonlines'>Online members :</p>

                            <div className="onlinemembers"></div>

                        </div>


                        <div className="formback_text" style={{width: '350px', height: '395px',}}>


                            <div id='pmid' className="pm">


                            </div>


                            <div className="input_send">


                                <input className="formback_text_input" id="formback_text_input" autocomplete="off">

                                </input>

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


                </form>

            </div>

        )

    }

}


export default chat_room;
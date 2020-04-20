import React, {Component} from 'react'


import './Homepage.css'

import Fontawesome from 'react-fontawesome'

import Navbar from '../navbar/navbar'

import Sidedrawer from '../SideDrawe/Sidedrawer'

import {BrowserRouter, Route} from 'react-router-dom'


import Backdrop from '../Backdrop/Backdrop'

import Create from '../create_room/create_room'

import plusss2 from './plusss2.png'
import zare from '../zare.png'
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';

import Grid from '@material-ui/core/Grid';
import AccountCircle from '@material-ui/icons/AccountCircle';
import AddIcon from '@material-ui/icons/Add';
import $ from 'jquery';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import jQuery from 'jquery'
import Leave from './leave.png'
import Profile from './profile.png'
import Home from './home_.png'
import Logo from './log.PNG'
import {makeStyles} from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined';

import {UserOutlined} from '@ant-design/icons';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Button from '@material-ui/core/Button';
import TextField from "@material-ui/core/TextField";

const name = window.$name;

class Homepage extends Component {

    componentDidMount() {
        const {id} = this.props.match.params;
        $(document).ready(function () {
            $('.createnewgp').click(function () {
                window.location.replace("/create/");
            });

            if (localStorage.getItem('token') == null) {
                alert("Login please !");
                window.location.replace("/startpage/");
            }
            $(".zare").click(function () {
                var id = $(".input").val();
                console.log("aaaa" + id);

                // console.log(id + " " + name + " " + bio);
                //console.log(csrftoken)
                var token = window.localStorage.getItem('token');
                console.log(token);

                var settings = {
                    "url": "http://127.0.0.1:8000/group/join/",
                    "method": "POST",
                    "timeout": 0,
                    error: function (event) {
                        if (event.status == 500) {
                            $('#joinstatus').html('You are already a member of this group !');
                            $('#joinstatus').toggle('slow');
                            $('#joinstatus').delay(3000).toggle('slow');
                        } else {
                            $('#joinstatus').html('Group not found !');
                            $('#joinstatus').toggle('slow');
                            $('#joinstatus').delay(3000).toggle('slow');
                        }
                    },
                    success: function () {
                      //  window.localStorage.setItem('id_gp', id);
                        window.location.replace("/homepage/");
                    },
                    "headers": {
                        //'X-CSRFToken': csrftoken,
                        "Authorization": "token " + token,
                        "accept": "application/json",
                        "Access-Control-Allow-Origin": "*",
                        "Access-Control-Allow-Headers": "*",
                        "Content-Type": "application/json"
                    },
                    "data": JSON.stringify({
                            "the_group": id,
                            "the_member": "",
                        }
                    ),
                };
                console.log(settings.headers);
                console.log(settings.method);
                $.ajax(settings).done(function (response) {
                    console.log("done")
                    console.log(response);
                    console.log(response.status);
                });
            });


            window.localStorage.removeItem('id_gp');


            console.log("aa");


            var token = window.localStorage.getItem('token');
            var username = window.localStorage.getItem('username');
            $('.groupsShow').append('<h4> Your Groups </h4>');
            // $('.groupsShow').append("<h5> User: " + username + "</h5>");

            // $('.groupsShow').append("</br>");
            $('.groupsShow').append("<hr>");
            $('.username').text(username);
            $(".logout").click(function () {
                window.localStorage.clear();
                window.location.replace("/startpage/");
            });

            $(".userprofile").click(function () {
                alert("im just a MVP version :)");
            });


            var groups = [];
            var mygroups = [];


            var settings = {
                "url": "http://127.0.0.1:8000/group/owned_groups/",
                "method": "GET",
                "timeout": 0,
                "headers": {
                    "Authorization": "Token " + token
                },
            };

            $.ajax(settings).done(function (response) {
                console.log(response);
                for (var counter = 0; counter < response.length; counter++)
                    mygroups.push({name: response[counter].title, id: response[counter].groupid});


                var htmlcode = '';
                for (var counter1 = 0; counter1 < mygroups.length; counter1++, htmlcode = '') {

                    // var modal = 'document.getElementById("myModal")';
                    //   var s=modal+'.style.display = "block"';
                    //     window.localStorage.setItem('id_gp',mygroups[counter1])
                    var s = "document.getElementById('myModal')";
                    var ss = s + ".style.display = 'block'";
                    var a = "window.localStorage.setItem('id_gp','" + mygroups[counter1].id + "')"; //id of the group
                    //  console.log("mygroupssss" + mygroups[counter1].id);
                    var d = "document.getElementById('myModal2')";
                    var dd = d + ".style.display = 'block'";


                    //   var l = "window.localStorage.setItem('id_gp','" + mygroups[counter1].id + "')";
                    //  console.log("mygroupssss" + mygroups[counter1].id);
                    // var l = "window.localStorage.setItem('id_gp','" + mygroups[counter1].id + "')";
                    //   window.localStorage.setItem('id_gp', id);
                    var r = "window.location.replace('/group/" + mygroups[counter1].id + "')";
                    //window.location.replace("/group/" + id + "");


                    var hoverout = 'onMouseOut="this.style.color=';
                    var hoverrout = hoverout + "'white'";

                    var hover = 'onMouseOver="this.style.color=';
                    var hoverr = hover + "'red'";
                    /*    var s="document.getElementById('close"+counter1+"')";
                        var ss=s+".remove()";
                        var a="document.getElementById('c"+counter1+"')";
                        var aa=a+".remove()";

                        var d="document.getElementById('h"+counter1+"')";
                        var dd=d+".remove()";
                        htmlcode+='<span onclick="'+ss+','+aa+','+dd+'"class="closes" id="close' + counter1 + '">&times;</span>';*/
                    //      onMouseOver="this.style.color='red'"
                    //  onMouseOut="this.style.color='green'" >GeeksforGeeks</a>


                    /*     var hoverout='onMouseOut="this.style.color=';
                         var hoverrout=hoverout+"'red'";

                         var hover='onMouseOver="this.style.color=';
                         var hoverr=hover+"'green'";*/
                    htmlcode += '</br>';
                    htmlcode += '<div class="admin"></div>';
                    htmlcode += '<p ' + hoverr + '"' + hoverrout + '"' + ' style="font-size: 21px" class="mygroups"  onclick="' + a + "," + r + '" id=' + '"c' + counter1 + '">' + "&nbsp" + mygroups[counter1].name + '</p>';


                    htmlcode += '<div class="buttonsforgp">';

                    htmlcode += '<div  onclick="' + a + "," + dd + '" class="leave"  style={{ width:45px , height:45px}} ></div>';
                    htmlcode += '<div  onclick="' + a + "," + ss + '" class="edit"></div>';
                    htmlcode += '</div>';
                    htmlcode += '</br>';


                    //htmlcode += '<hr class="line" id=' + '"h' + counter1 + '">';
                    $('.groupsShow').append(htmlcode);

                }

            });

            var localresponse;
            $('.modal2').mouseover(function () {
                var gpid = window.localStorage.getItem("id_gp");
                console.log(gpid);

                var settings = {
                    "url": "http://127.0.0.1:8000/groups/" + gpid + "/",
                    "method": "GET",
                    "timeout": 0,
                    "Content-Type": "application/json",

                };
                /*
                                var settings = {
                                    "url": "http://127.0.0.1:8000/groups/"+gpid,
                                    "method": "GET",
                                    "timeout": 0,
                                    "processData": false,
                                    "mimeType": "multipart/form-data",
                                    "contentType": false,

                                  };*/

                $.ajax(settings).done(function (response) {
                    // console.log(response.title);
                    localresponse = response;
                    //  $('.deleteTEXT').text("Are you sure \n you want to leave The " + response.title + "  ? ");
                    var obj = $('.deleteTEXT').text("Are you sure  you want to leave \n The  " + response.title + "  ? ");
                    obj.html(obj.html().replace(/\n/g, '<br/>'));
                    if (localresponse.created_by == window.localStorage.getItem('username')) {
                        $('.admintext').text("You are the admin of this group , if you leave , it will be deleted");
                    } else
                        $('.admintext').text("");


                });


            });


            $('.dltyes').click(function () {
                var gpid = window.localStorage.getItem("id_gp");
                // console.log("inee : "+gpid);
                if (localresponse.created_by == window.localStorage.getItem('username')) {
                    var settings = {
                        "url": "http://127.0.0.1:8000/groups/" + gpid + "/",
                        "method": "DELETE",
                        "timeout": 0,
                        "headers": {
                            "Authorization": "Token " + token
                        },
                        success: function () {

                            window.location.replace('/homepage/');
                        },
                        error: function () {
                            alert('something went wrong');
                        },
                        "processData": false,
                        "mimeType": "multipart/form-data",
                        "contentType": false,

                    };

                    $.ajax(settings).done(function (response) {
                        console.log(response);
                    });
                } else {
                    var settings = {
                        "url": "http://127.0.0.1:8000/group/" + gpid + "/leave/",
                        "method": "DELETE",
                        "timeout": 0,
                        "headers": {
                            "Authorization": "Token " + token
                        },
                        success: function () {

                            window.location.replace('/homepage/');
                        },
                        error: function () {
                            alert('something went wrong');
                        },
                        "processData": false,
                        "mimeType": "multipart/form-data",
                        "contentType": false,

                    };

                    $.ajax(settings).done(function (response) {
                        console.log(response);
                    });
                }
            });


            $('.dltno').click(function () {
                $('.modal2').fadeOut('slow');
            });

            $('.modal').mouseover(function () {
                var gpid = window.localStorage.getItem("id_gp");

                var settings = {
                    "url": "http://127.0.0.1:8000/groups/" + gpid,
                    "method": "GET",
                    "timeout": 0,
                    "Content-Type": "application/json",

                };
                /*
                                var settings = {
                                    "url": "http://127.0.0.1:8000/groups/"+gpid,
                                    "method": "GET",
                                    "timeout": 0,
                                    "processData": false,
                                    "mimeType": "multipart/form-data",
                                    "contentType": false,

                                  };*/

                $.ajax(settings).done(function (response) {
                    // console.log(response.title);
                    $('.texx').text("Edit " + response.title + " details");
                });


            });

            console.log("shomarash : " + window.localStorage.getItem('id_gp'));
            $('.submitedit').click(function () {

                var gpid = window.localStorage.getItem("id_gp");


                //   var idd = $('#editid').val();
                var title = $('#edittitle').val();
                var des = $('#editdes').val();
                // console.log('id : ' + idd + ' title : ' + title + ' des : ' + des);

                //  console.log("//////");
                console.log("AAAAAA  " + gpid);
                var form = new FormData();

                if (title != "")
                    form.append("title", title);
                if (des != '')
                    form.append("describtion", des);
                // form.append("invite_only", "");

                var settings = {
                    "url": "http://127.0.0.1:8000/groups/" + gpid + "/",
                    "method": "PUT",
                    "timeout": 0,
                    "headers": {
                        "Authorization": "Token " + token
                    },
                    success: function () {

                        window.location.replace("/homepage/");
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

                /*
                                var settings = {
                                    "url": "http://127.0.0.1:8000/groups/"+gpid+'/',
                                    "method": "PUT",
                                    "timeout": 0,
                                    "processData": false,
                                    "mimeType": "multipart/form-data",
                                    "contentType": false,
                                    "data": form
                                };
                                $.ajax(settings).done(function (response) {
                                    console.log(response);
                                });*/


            })

            window.onclick = function (event) {
                if (event.target == document.getElementById("myModal")) {
                    $('.modal').fadeOut("slow");
                    //     document.getElementById("myModal").style.display = "none";
                }
                if (event.target == document.getElementById("myModal2")) {
                    $('.modal2').fadeOut("slow");
                    //  document.getElementById("myModal2").style.display = "none";
                }
            }

            var settings = {
                "url": "http://127.0.0.1:8000/group/joined_groups/",
                "method": "GET",
                "timeout": 0,
                "headers": {
                    "Authorization": "Token " + token
                },
            };

            $.ajax(settings).done(function (response) {
                console.log(response);
                for (var counter = 0; counter < response.length; counter++) {
                    var gpid2 = response[counter].the_group;
                    var settings2 = {
                        "url": "http://127.0.0.1:8000/groups/" + gpid2 + "/",
                        "method": "GET",
                        "timeout": 0,
                        "Content-Type": "application/json",

                    };

                    $.ajax(settings2).done(function (response2) {
                        console.log(response2);
                        groups.push({name: response2.title, id: response2.groupid});
                        //  groups.push(response2.title);
                        //  $('.deleteTEXT').text("Are you sure you want to leave The " + response.title + "  ? ");
                    });

                    // groups.push(response[counter].the_group);


                }


                setTimeout(function () {
                    console.log(groups[1]);
                    var counter2 = 0;
                    var htmlcode2 = '';
                    while (counter2 < groups.length) {
                        var a2 = "window.localStorage.setItem('id_gp','" + groups[counter2].id + "')";
                        var d2 = "document.getElementById('myModal2')";
                        var dd2 = d2 + ".style.display = 'block'";

                        var r = "window.location.replace('/group/" + groups[counter2].id + "')";
                        //window.location.replace("/group/" + id + "");


                        var hoverout = 'onMouseOut="this.style.color=';
                        var hoverrout = hoverout + "'white'";

                        var hover = 'onMouseOver="this.style.color=';
                        var hoverr = hover + "'red'";

                        /*    var s="document.getElementById('close2"+counter1+"')";
                            var ss=s+".remove()";
                            var a="document.getElementById('c2"+counter1+"')";
                            var aa=a+".remove()";

                            var d="document.getElementById('h2"+counter1+"')";
                            var dd=d+".remove()";
                        htmlcode+=+'<span onclick="'+ss+','+aa+','+dd+'"class="closes" id="close2' + counter1 + '">&times;</span>';*/
                        htmlcode2 += '</br>';
                        htmlcode2 += '<p ' + hoverr + '"' + hoverrout + '"' + ' style="font-size: 21px" class="mygroups"  onclick="' + a2 + "," + r + '" id=' + '"c' + counter2 + '">' + "&nbsp&nbsp&nbsp&nbsp&nbsp" + groups[counter2].name + '</p>';
                        htmlcode2 += '<div class="buttonsforgp">';

                        htmlcode2 += '<div onclick="' + a2 + "," + dd2 + '" class="leave" ></div>';

                        htmlcode2 += '</div>';
                        htmlcode2 += '</br>';

                        $('.groupsShow').append(htmlcode2);
                        counter2++;
                        htmlcode2 = '';
                    }
                    console.log("groups :" + groups);
                }, 500);


            });


        });


        // var csrftoken = Cookies.get('csrftoken');

        $(document).ready(function () {

            console.log(window.localStorage.getItem('token'));

            //$(".zare").click(function () {

            //    var id = $(".input_input").val();;


            //    //console.log(id + " " + name + " " + bio);

            //    //console.log(csrftoken)

            //    var token = window.localStorage.getItem('token');

            //    console.log(token);


            //    var settings = {

            //        "url": "http://127.0.0.1:8000/group/join/",

            //        "method": "POST",

            //        "timeout": 0,

            //        error: function () {

            //            console.log("noooooooo");

            //        },

            //        success: function () {

            //            console.log("yeeeeeees");

            //        },

            //        "headers": {

            //            'X-CSRFToken': csrftoken,

            //            "Authorization": "token " + token,

            //            "accept": "application/json",

            //            "Access-Control-Allow-Origin": "*",

            //            "Access-Control-Allow-Headers": "*",

            //            "Content-Type": "application/json"

            //        },

            //        "data": JSON.stringify({

            //            "the_group":id

            //        }

            //        ),

            //    };

            //    console.log(settings.headers);

            //    console.log(settings.method);

            //    $.ajax(settings).done(function (response) {

            //        console.log(response);

            //        console.log(response.status);

            //        console.log("1");

            //        //if (response.status === 404) {

            //        //    console.log("no");

            //        //}

            //        //if (response.status===200) {

            //        //    console.log("yes");

            //        //}

            //        //if (response.o)

            //        //  console.log(responseDisplay);

            //        // console.log(response.status.);

            //    });


            //    //    window.location.replace("/account/menu/");

            //    // Window.location="/account/menu/"


            //});

        })
    };


    constructor(props) {

        super(props);


        this.states = {


            value: ''

        }

        this.handleChange = this.handleChange.bind(this);

        this.handleSubmit = this.handleSubmit.bind(this);

    }

    handleChange(event) {


        this.setState({value: event.target.value});


    }

    handleSubmit(event) {


        alert('A name was submitted: ' + this.state.value);


        event.preventDefault();

    }

    state = {

        sidedraweropen: false

    };


    drawertoggleclickhandler = () => {

        this.setState((prevState) => {


            return {sidedraweropen: !prevState.sidedraweropen}


        });

    };

    backdropclickhandeler = () => {

        this.setState({sidedraweropen: false})

    }

    render() {


        return (


            <div class="Homepage">


                <div id="myModal" class="modal">
                    <div class="modal-content">
                        <h3 class="texx">Edit your groups deatails</h3>

                        <hr></hr>

                        <input class="inputedit" id='edittitle' placeholder="Title"></input>


                        <input class="inputedit" id='editdes' placeholder="Description"></input>
                        <br></br>

                        <Button style={{
                            backgroundColor: "Red",
                            marginTop: "20px"
                        }} size='large' className="submitedit" variant="contained" color="secondary">
                            <p>Edit</p>
                        </Button>

                    </div>

                </div>

                <div id="myModal2" className="modal2">
                    <div className="modal-content2">
                        <h3 className='deleteTEXT'>Are you sure you want to leave this group ? </h3>
                        <p className='admintext'></p>
                        <div className='dltbtns'>

                            <Button style={{backgroundColor: "Red"}} size='large'
                                    className="dltno" variant="contained" color="secondary">
                                <p>No&nbsp;</p>
                            </Button>

                            <Button style={{
                                backgroundColor: 'gray',
                                marginRight: "4px"

                            }} size='large' className="dltyes" variant="contained" color="secondary">
                                <p>Yes</p>
                            </Button>

                        </div>
                        {/* <div className='dltno'>no</div> */}
                    </div>
                </div>


                <header className="head">

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

                        <div className='searchgp'>


                            <input placeholder='Enter id of the group' className='input'/>

                            <Button style={{
                                marginTop: "10px",
                                backgroundColor: "Red"
                            }} startIcon={<GroupAddIcon/>} className="zare" variant="contained" color="secondary">
                                join
                            </Button>
                            <div id='joinstatus' className='statusofjoin'>
                                Group not found !
                            </div>
                        </div>


                    </div>
                    <div className='logout'>
                        <p className='logout_text'>Logout</p>
                        <IconButton style={{
                            color: 'white'
                        }}
                                    className="div_leave">
                            <ExitToAppIcon fontSize="large"/>
                        </IconButton>
                    </div>
                </header>


                <div className="groupsShow">

                    <Button style={{
                        backgroundColor: "Red",
                        marginRight: "10px",
                        marginTop: "20px"
                    }} className='createnewgp' startIcon={<AddIcon/>} variant="contained" color="secondary">

                        Create new group
                    </Button>

                </div>


            </div>
            //<div className="div_home" ><a href="/homepage"><img src={Home} className="home" /></a></div>


        )

    }


}

export default Homepage
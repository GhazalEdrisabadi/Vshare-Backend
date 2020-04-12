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
import $ from 'jquery';
import jQuery from 'jquery'
import Leave from './leave.png'
import Profile from './profile.png'
import Home from './home_.png'
import Logo from './log.PNG'
import {makeStyles} from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';

class Homepage extends Component {

    componentDidMount() {
        $(document).ready(function () {

            window.localStorage.removeItem('numbergp1');

            if (window.localStorage.getItem('token') == null) {
                alert("Login first !");
                window.location.replace("/startpage/");
            }

            console.log("aa");
            var token = window.localStorage.getItem('token');
            var username = window.localStorage.getItem('username');
            $('.groupsShow').append('<h4> Your Groups </h4>');
            $('.groupsShow').append("<h5> User: " + username + "</h5>");
            $('.groupsShow').append("<hr>");

            $(".div_leave").click(function () {
                window.localStorage.clear();
                window.location.replace("/startpage/");
            });

            $(".profile").click(function () {
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
                    //     window.localStorage.setItem('numbergp1',mygroups[counter1])
                    var s = "document.getElementById('myModal')";
                    var ss = s + ".style.display = 'block'";
                    var a = "window.localStorage.setItem('numbergp1','" + mygroups[counter1].id + "')";
                    var d = "document.getElementById('myModal2')";
                    var dd = d + ".style.display = 'block'";
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
                    htmlcode += '<div class="admin"></div>';
                    htmlcode += '<p class="mygroups" id=' + '"c' + counter1 + '">' + mygroups[counter1].name + '</p>';
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
                var gpid = window.localStorage.getItem("numbergp1");
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
                    $('.deleteTEXT').text("Are you sure you want to leave The " + response.title + "  ? ");
                });


            });


            $('.dltyes').click(function () {
                var gpid = window.localStorage.getItem("numbergp1");
                if (localresponse.created_by == window.localStorage.getItem('username')) {
                    var settings = {
                        "url": "http://127.0.0.1:8000/groups/" + gpid + "/",
                        "method": "DELETE",
                        "timeout": 0,
                        "headers": {
                            "Authorization": "Token " + token
                        },
                        success: function () {
                            alert("Done");
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
                            alert("Done");
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
                var gpid = window.localStorage.getItem("numbergp1");

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

            console.log("shomarash : " + window.localStorage.getItem('numbergp1'));
            $('.submitedit').click(function () {

                var gpid = window.localStorage.getItem("numbergp1");


                var idd = $('#editid').val();
                var title = $('#edittitle').val();
                var des = $('#editdes').val();
                // console.log('id : ' + idd + ' title : ' + title + ' des : ' + des);

                //  console.log("//////");
                console.log(gpid);
                var form = new FormData();
                if (idd != "")
                    form.append("groupid", idd);
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
                        alert("Done");
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
                        var a2 = "window.localStorage.setItem('numbergp1','" + groups[counter2].id + "')";
                        var d2 = "document.getElementById('myModal2')";
                        var dd2 = d2 + ".style.display = 'block'";
                        /*    var s="document.getElementById('close2"+counter1+"')";
                            var ss=s+".remove()";
                            var a="document.getElementById('c2"+counter1+"')";
                            var aa=a+".remove()";

                            var d="document.getElementById('h2"+counter1+"')";
                            var dd=d+".remove()";
                        htmlcode+=+'<span onclick="'+ss+','+aa+','+dd+'"class="closes" id="close2' + counter1 + '">&times;</span>';*/
                        htmlcode2 += '<p class="mygroups" id=' + '"c2' + counter2 + '">' + groups[counter2].name + '</p>';
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
    }

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
                        <h2 class="texx">Edit your groups deatails</h2>
                        <br></br>
                        <input class="inputedit" id='editid' placeholder="Group ID"></input>
                        <hr></hr>
                        <input class="inputedit" id='edittitle' placeholder="Title"></input>
                        <hr></hr>
                        <input class="inputedit" id='editdes' placeholder="Description"></input>
                        <br></br>
                        <br></br>

                        <button class="submitedit">Submit</button>
                    </div>

                </div>

                <div id="myModal2" className="modal2">
                    <div className="modal-content2">
                        <p className='deleteTEXT'>Are you sure you want to leave this group ? </p>
                        <div className='dltbtns'></div>
                        {<IconButton style={{
                            color: 'green',
                            border: '1px solid green',
                            marginleft: '20px',
                            marginRight: "10px",
                            marginBottom: "65px",
                            marginTop: "-10px"
                        }} className="dltyes">
                            <CheckIcon/>
                        </IconButton>}
                        {/* <div className='dltyes'>yes</div> */}


                        {<IconButton style={{
                            color: 'red',
                            border: '1px solid red',
                            marginleft: '10px',
                            marginRight: "20px",
                            marginBottom: "65px",
                            marginTop: "-10px"
                        }} className="dltno">
                            <CloseIcon/>
                        </IconButton>}
                        {/* <div className='dltno'>no</div> */}
                    </div>
                </div>


                <header className="head">
                    <div className="zare"> join</div>
                    <input type="text"
                           className="input"/>


                </header>


                <div><a href="/create"><img src={plusss2} className="create"/></a></div>
                <div className="groupsShow">

                </div>

                <div id="mySidenav" className="sidenav">

                    <div className="profile"><img src={Profile}
                                                  style={{width: "45px", height: "45px"}}/></div>

                    <div className="div_leave"><a href="/startpage"><img src={Leave}
                                                                     style={{width: "45px", height: "45px"}}/></a></div>

                </div>

            </div>
            //<div className="div_home" ><a href="/homepage"><img src={Home} className="home" /></a></div>

        )
    }

}

export default Homepage
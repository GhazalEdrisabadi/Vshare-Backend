import React, {useState, Component} from "react";
import MultiSelect from "react-multi-select-component"
import './Homepage.css'

import AddIcon from '@material-ui/icons/Add';

import $ from 'jquery';

import GroupAddIcon from '@material-ui/icons/GroupAdd';

import IconButton from '@material-ui/core/IconButton';

import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined';

import ExitToAppIcon from '@material-ui/icons/ExitToApp';

import Button from '@material-ui/core/Button';

import CloseIcon from '@material-ui/icons/Close';
import Select from 'react-select';

var Able_chat = 0;
var Able_controll = 0;
var Able_select = 0;
const options = [

    {value: '1', label: 'Able to select video'},
    {value: '2', label: 'Able to controll the playback'},
]
var per = []
const name = window.$name;


class Homepage extends Component {


    componentDidMount() {

        const {id} = this.props.match.params;

        $(document).ready(function () {


                $('.nextbtn').click(function () {

                    var id = $(".input1").val();


                    var name = $(".input2").val();

                    var bio = $(".textarea").val();


                    var mem = [];

                    var token = window.localStorage.getItem('token');


                    var settings = {

                        "url": "http://185.206.92.246:8000/groups/",

                        "method": "POST",

                        "timeout": 0,

                        error: function (event) {

                            if (event.status == 400)


                                var x = document.getElementById("snackbar-exist");
                            x.className = "show";
                            setTimeout(function () {
                                x.className = x.className.replace("show", "");
                            }, 3000);


                        },

                        success: function () {
                            $('.formback-content').fadeOut();
                            $('.addmember-content').fadeIn();
                            window.localStorage.setItem('id_group', id);


                        },

                        "headers": {


                            "accept": "application/json",


                            "Authorization": "token " + token,


                            "Access-Control-Allow-Origin": "*",

                            "Access-Control-Allow-Headers": "*",

                            "Content-Type": "application/json"

                        },

                        "data": JSON.stringify({

                                "groupid": id,

                                "title": name,

                                "describtion": bio,

                                "invite_only": true,

                                "members": mem


                            }
                        ),


                    }

                    $.ajax(settings).done(function (response) {


                    });

                });

                $(".addbtn").click(function () {

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

                    var member = $(".inp").val();


                    var token = window.localStorage.getItem('token');

                    var id_gp = window.localStorage.getItem('id_group')


                    var settings = {

                        "url": "http://185.206.92.246:8000/user/" + member + "",

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

                                "url": "http://185.206.92.246:8000/group/add_member/",

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
                                        "url": "http://185.206.92.246:8000/group/permissions/",
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
                                            $(".textarea-addmember").append(member + '-');
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
                                                "member": member,
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

                                        "the_member": member

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


                $(".skipbtn").click(function () {

                    window.location.replace("/homepage");


                });


                $(".createnewgp").click(function () {


                    $('.formback').fadeIn();


                });

                $('.inp-search').keyup(function () {
                    //     $(".inp-search").on("change", function() {



                    $(".search-result2").html("")


                    var user_search = $('.inp-search').val()

                    var settings = {
                        "url": "http://185.206.92.246:8000/user/find/username/?search=" + user_search + "",
                        "method": "GET",
                        "timeout": 0,
                        "headers": {

                            "accept": "application/json",
                            "Access-Control-Allow-Origin": "*",
                            "Access-Control-Allow-Headers": "*",
                            "Content-Type": "application/json"
                        },

                    };

                    $.ajax(settings).done(function (response) {


                        var hoverout = 'onMouseOut="this.style.color=';


                        var hoverrout = hoverout + "'white'";

                        var hover = 'onMouseOver="this.style.color=';
                        var hoverr = hover + "'red'";
                        var htmlcode = '<br/>'

                        htmlcode = '';
                        $(".search-result2").append(htmlcode)
                        for (var counter1 = 0; counter1 < response.length; counter1++, htmlcode = '') {
                            var a2 = "window.localStorage.setItem('user','" + response[counter1].username + "')";
                            var r = "window.location.replace('/profile/" + response[counter1].username + "')";


                            htmlcode += '<div>'

                            htmlcode += '<div class="user-search">';
                            htmlcode += '<div ' + hoverr + '"' + hoverrout + '"' + ' style="font-size: 21px" class="username-result"  onclick="' + a2 + "," + r + '" id=' + '"c' + counter1 + '">' + "&nbsp&nbsp&nbsp&nbsp&nbsp" + response[counter1].username + '</div>';

                            htmlcode += '<br/>'


                            htmlcode += '</div>'

                            htmlcode += '</div>'
                            htmlcode += '<hr/>'
                            $(".search-result2").append(htmlcode)
                        }

                    });


                    var settings = {
                        "url": "http://185.206.92.246:8000/groups/?search=" + user_search + "",
                        "method": "GET",
                        "timeout": 0,
                        "headers": {
                            "Authorization": "token " + window.localStorage.getItem('token'),
                            "accept": "application/json",
                            "Access-Control-Allow-Origin": "*",
                            "Access-Control-Allow-Headers": "*",
                            "Content-Type": "application/json"
                        },


                    };

                    $.ajax(settings).done(function (response) {

                        var hoverout = 'onMouseOut="this.style.color=';
                        var hoverrout = hoverout + "'white'";

                        var hover = 'onMouseOver="this.style.color=';
                        var hoverr = hover + "'red'";
                        var htmlcode = '<br/>'

                        htmlcode = '';
                        $(".search-result2").append(htmlcode)
                        for (var counter1 = 0; counter1 < response.length; counter1++, htmlcode = '') {
                            var a2 = " document.getElementById('Modal-join').style.display = 'block'";
                            var r = "window.localStorage.setItem('id-join','" + response[counter1].groupid + "')";
                            htmlcode += '<div>'
                            htmlcode += '<div class="group-search">';
                            htmlcode += '<p ' + hoverr + '"' + hoverrout + '"' + ' style="font-size: 21px" class="username-result"  onclick="' + a2 + "," + r + '" id=' + '"c' + counter1 + '">' + "&nbsp&nbsp&nbsp&nbsp&nbsp" + response[counter1].groupid + '</p>';

                            htmlcode += '<br/>'


                            htmlcode += '</div>'

                            htmlcode += '</div>'
                            htmlcode += '<hr/>'
                            $(".search-result2").append(htmlcode)
                        }

                    });

                    setTimeout(function () {
                        if ($(".search-result2").html() == '') {
                         //   $(".search-result2").html("<p class='notfound'>not found</p>");
                            $(".search-result2").fadeOut()
                        } else {
                            $(".search-result2").fadeIn()
                        }
                    }, 200)


                });
                $(".KeyboardBackspaceIcon").click(function () {


                    $('.formback').fadeOut();

                });
                $(".Homepage").click(function () {
                    $(".search-result2").text("")
                    $(".search-result2").fadeOut();

                })
                $(".join-no ").click(function () {
                    $(".modal-join").fadeOut()

                })
                $(".join-yes ").click(function () {
                    var settings = {
                        "url": "http://185.206.92.246:8000/group/join/",
                        "method": "POST",
                        "timeout": 0,
                        error: function (event) {
                            if (event.status == 500) {
                                var x = document.getElementById("snackbar-already");
                                x.className = "show";
                                setTimeout(function () {
                                    x.className = x.className.replace("show", "");
                                }, 3000);
                                ;


                            }
                        },
                        success: function () {
                            var settings = {
                                "url": "http://185.206.92.246:8000/group/permissions/",
                                "method": "POST",
                                error: function () {

                                    alert("nooooooo")


                                },
                                success: function () {

                                    var x = document.getElementById("snackbar-succes-join");
                                    x.className = "show";
                                    setTimeout(function () {
                                        x.className = x.className.replace("show", "");
                                    }, 3000);
                                    setTimeout(function () {
                                        window.location.replace('/homepage')
                                    }, 3000)

                                },
                                "timeout": 0,
                                "headers": {

                                    "accept": "application/json",
                                    "Access-Control-Allow-Origin": "*",
                                    "Access-Control-Allow-Headers": "*",
                                    "Content-Type": "application/json"
                                },
                                "data": JSON.stringify({
                                        "group": window.localStorage.getItem('id-join'),
                                        "member": window.localStorage.getItem('username'),
                                        "chat_permission": 1,
                                        "playback_permission": 0,
                                        "choose_video_permission": 0
                                    }
                                ),
                            };

                            $.ajax(settings).done(function (response) {

                            });

                        },

                        "headers": {
                            "Authorization": "token " + window.localStorage.getItem('token'),
                            "accept": "application/json",
                            "Access-Control-Allow-Origin": "*",
                            "Access-Control-Allow-Headers": "*",
                            "Content-Type": "application/json"
                        },
                        "data": JSON.stringify({
                                "the_group": window.localStorage.getItem('id-join'),
                                "the_member": "",
                            }
                        ),
                    };

                    $.ajax(settings).done(function (response) {


                    });
                })
                if (localStorage.getItem('token') == null) {

                    alert("Login please !");

                    window.location.replace("/startpage/");

                }

                $(".zare").click(function () {

                    var id = $(".input").val();


                    var token = window.localStorage.getItem('token');


                    var settings = {

                        "url": "http://185.206.92.246:8000/group/join/",

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

                            var settings = {
                                "url": "http://185.206.92.246:8000/group/permissions/",
                                "method": "POST",
                                error: function () {

                                    alert("nooooooo")


                                },
                                success: function () {

                                    window.location.replace("/homepage/");
                                },
                                "timeout": 0,
                                "headers": {

                                    "accept": "application/json",
                                    "Access-Control-Allow-Origin": "*",
                                    "Access-Control-Allow-Headers": "*",
                                    "Content-Type": "application/json"
                                },
                                "data": JSON.stringify({
                                        "group": id,
                                        "member": username,
                                        "chat_permission": 1,
                                        "playback_permission": 0,
                                        "choose_video_permission": 0
                                    }
                                ),
                            };

                            $.ajax(settings).done(function (response) {


                            });
                        },

                        "headers": {


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

                    $.ajax(settings).done(function (response) {

                    });

                });


                window.localStorage.removeItem('id_gp');

                var token = window.localStorage.getItem('token');

                var username = window.localStorage.getItem('username');


                $('.username').text(username);

                $(".logout").click(function () {

                    window.localStorage.clear();

                    window.location.replace("/startpage/");

                });


                $(".userprofile").click(function () {

                    window.localStorage.setItem('myac', 1)
                    window.location.replace("/profile/" + username + "");

                });


                var groups = [];

                var mygroups = [];


                var settings = {

                    "url": "http://185.206.92.246:8000/group/owned_groups/",

                    "method": "GET",

                    "timeout": 0,

                    "headers": {

                        "Authorization": "Token " + token

                    },

                };


                $.ajax(settings).done(function (response) {


                    for (var counter = 0; counter < response.length; counter++)

                        mygroups.push({name: response[counter].title, id: response[counter].groupid});


                    var htmlcode = '';

                    for (var counter1 = 0; counter1 < mygroups.length; counter1++, htmlcode = '') {
                        var s = "document.getElementById('myModal')";
                        var ss = s + ".style.display = 'block'";
                        var a = "window.localStorage.setItem('id_gp','" + mygroups[counter1].id + "')";
                        var ad = "window.localStorage.setItem('isadmin','" + '1' + "')";
                        var d = "document.getElementById('myModal2')";
                        var dd = d + ".style.display = 'block'";
                        var r = "window.location.replace('/group/" + mygroups[counter1].id + "')";
                        var hoverout = 'onMouseOut="this.style.color=';
                        var hoverrout = hoverout + "'white'";
                        var hover = 'onMouseOver="this.style.color=';
                        var hoverr = hover + "'red'";
                        htmlcode += '</br>';
                        htmlcode += '<div class="admin"></div>';
                        htmlcode += '<p ' + hoverr + '"' + hoverrout + '"' + ' style="font-size: 21px" class="mygroups"  onclick="' + a + "," + ad + "," + r + '" id=' + '"c' + counter1 + '">' + "&nbsp" + mygroups[counter1].name + '</p>';
                        htmlcode += '<div class="buttonsforgp">';
                        htmlcode += '<div  onclick="' + a + "," + dd + '" class="leave"  style={{ width:45px , height:45px}} ></div>';
                        htmlcode += '<div  onclick="' + a + "," + ss + '" class="edit"></div>';
                        htmlcode += '</div>';
                        htmlcode += '</br>';
                        $('.groupshowbody').append(htmlcode);
                    }


                });


                var localresponse;

                $('.userprofile').mouseenter(function () {
                 $('.username').fadeIn();
                  $(".search-result2").fadeOut();
                })
                $('.userprofile').mouseleave(function () {
                 $('.username').fadeOut();
                })

                $('.modal2').mouseenter(function () {

                    var gpid = window.localStorage.getItem("id_gp");
                    var settings = {

                        "url": "http://185.206.92.246:8000/groups/" + gpid + "/",

                        "method": "GET",

                        "timeout": 0,

                        "Content-Type": "application/json",


                    };


                    $.ajax(settings).done(function (response) {


                        localresponse = response;

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


                    if (localresponse.created_by == window.localStorage.getItem('username')) {

                        var settings = {

                            "url": "http://185.206.92.246:8000/groups/" + gpid + "/",

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

                        });

                    } else {

                        var settings = {

                            "url": "http://185.206.92.246:8000/group/" + gpid + "/leave/",

                            "method": "DELETE",

                            "timeout": 0,

                            "headers": {

                                "Authorization": "Token " + token

                            },

                            success: function () {

                                var settings = {

                                    "url": "http://185.206.92.246:8000/group/" + gpid + "/permissions/?member=" + window.localStorage.getItem('username') + "",

                                    "method": "DELETE",

                                    "timeout": 0,

                                    "headers": {},

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

                                });


                            },

                            error: function () {

                                alert('something went wrong');

                            },

                            "processData": false,

                            "mimeType": "multipart/form-data",

                            "contentType": false,


                        };


                        $.ajax(settings).done(function (response) {

                        });

                    }

                });


                $('.dltno').click(function () {

                    $('.modal2').fadeOut('slow');

                });


                $('.modal').mouseenter(function () {

                    var gpid = window.localStorage.getItem("id_gp");


                    var settings = {

                        "url": "http://185.206.92.246:8000/groups/" + gpid,

                        "method": "GET",

                        "timeout": 0,

                        "Content-Type": "application/json",


                    };


                    $.ajax(settings).done(function (response) {

                        $('.texx').text("Edit " + response.title + " details");

                    });


                });

                $('.submitedit').click(function () {


                    var gpid = window.localStorage.getItem("id_gp");


                    var title = $('#edittitle').val();

                    var des = $('#editdes').val();

                    var form = new FormData();


                    if (title != "")

                        form.append("title", title);

                    if (des != '')

                        form.append("describtion", des);


                    var settings = {

                        "url": "http://185.206.92.246:8000/groups/" + gpid + "/",

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
                    });


                })


                window.onclick = function (event) {

                    if (event.target == document.getElementById("myModal")) {

                        $('.modal').fadeOut("slow");


                    }

                    if (event.target == document.getElementById("myModal2")) {

                        $('.modal2').fadeOut("slow");


                    }

                }


                var settings = {

                    "url": "http://185.206.92.246:8000/group/joined_groups/",

                    "method": "GET",

                    "timeout": 0,

                    "headers": {

                        "Authorization": "Token " + token

                    },

                };


                $.ajax(settings).done(function (response) {
                    for (var counter = 0; counter < response.length; counter++) {

                        var gpid2 = response[counter].the_group;

                        var settings2 = {

                            "url": "http://185.206.92.246:8000/groups/" + gpid2 + "/",

                            "method": "GET",

                            "timeout": 0,

                            "Content-Type": "application/json",


                        };


                        $.ajax(settings2).done(function (response2) {

                            var booll = 0;

                            for (var jj = 0; jj < mygroups.length; jj++) {

                                if (mygroups[jj].id == response2.groupid)

                                    booll = 1;


                            }

                            if (booll == 0)

                                groups.push({name: response2.title, id: response2.groupid});

                        });


                    }


                    setTimeout(function () {


                        var counter2 = 0;

                        var htmlcode2 = '';

                        while (counter2 < groups.length) {

                            var a2 = "window.localStorage.setItem('id_gp','" + groups[counter2].id + "')";
                            var d2 = "document.getElementById('myModal2')";
                            var dd2 = d2 + ".style.display = 'block'";
                            var ad2 = "window.localStorage.setItem('isadmin','" + '0' + "')";
                            var r = "window.location.replace('/group/" + groups[counter2].id + "')";
                            var hoverout = 'onMouseOut="this.style.color=';
                            var hoverrout = hoverout + "'white'";
                            var hover = 'onMouseOver="this.style.color=';
                            var hoverr = hover + "'red'";


                            htmlcode2 += '</br>';
                            htmlcode2 += '<p ' + hoverr + '"' + hoverrout + '"' + ' style="font-size: 21px" class="mygroups"  onclick="' + a2 + "," + ad2 + "," + r + '" id=' + '"c' + counter2 + '">' + "&nbsp&nbsp&nbsp&nbsp&nbsp" + groups[counter2].name + '</p>';

                            htmlcode2 += '<div class="buttonsforgp">';


                            htmlcode2 += '<div onclick="' + a2 + "," + dd2 + '" class="leave" ></div>';


                            htmlcode2 += '</div>';

                            htmlcode2 += '</br>';


                            $('.groupshowbody').append(htmlcode2);

                            counter2++;

                            htmlcode2 = '';

                        }


                    }, 1000);


                });


            }
        )
        ;

    };


    constructor(props) {


        super(props);


        this.states = {

            value: '',
            selectedOption: null,


        }


        this.handleChange = this.handleChange.bind(this);


        this.handleSubmit = this.handleSubmit.bind(this);


    }

    handleChanges = selectedOption => {
        this.setState(
            {selectedOption},
            () => per = this.state.selectedOption
        );

    };

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


    };


    render() {

        const {selectedOption} = this.state;
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


                    </div>

                </div>

                <div id="Modal-join" class="modal-join">
                    <div class="modal-content_join">
                        <h3 className='join-txt'>Are you sure you want to join this group ? </h3>

                        <div className='join-btns'>


                            <Button style={{backgroundColor: "Red"}} size='large'
                                    className="join-no" variant="contained" color="secondary">
                                <p>No&nbsp;</p>
                            </Button>

                            <Button style={{
                                backgroundColor: 'gray',
                                marginRight: "4px"

                            }} size='large' className="join-yes" variant="contained" color="secondary">
                                <p>Yes</p>
                            </Button>

                        </div>


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


                            <input placeholder='search' className='inp-search'/>


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


                <div className="formback">

                    <div className="formback-content">

                        <div className="TTitle">

                            <IconButton style={{color: 'white', marginRight: '130%', marginTop: '4%'}}

                                        className="KeyboardBackspaceIcon">

                                <CloseIcon fontSize="large"/>

                            </IconButton>


                            <h4 className="textForm">create new group</h4>

                            <hr></hr>


                        </div>

                        <input onChange={this.change_name} type="text"


                               className="input1" placeholder="id" style={{


                            height: '40px',

                            width: '65%',

                        }}/>


                        <br></br>


                        <br></br>

                        <input onChange={this.change_id} type="text"

                               className="input2" placeholder="name" style={{

                            height: '40px',

                            width: '65%'

                        }}/>


                        <div className="Status-Id" id="Status-Id"></div>


                        <br></br>


                        <textarea onChange={this.change_bio} type="text"

                                  className="textarea" placeholder=" bio" style={{

                            height: '60px',

                            width: '65%',

                            marginTop: '8%'


                        }}/>


                        <Button style={{

                            backgroundColor: "Red",

                            marginRight: "45%",

                            marginTop: "30%",

                            marginLeft: "42%"

                        }} className='nextbtn' variant="contained" color="secondary">

                            next

                        </Button>

                    </div>


                    <div className="addmember-content">

                        <p classname='tit' style={{fontSize: "100%", marginBottom: "8%", marginTop: "8%",}}>Add your

                            member</p>

                        <hr></hr>


                        <input class='inp' placeholder=" enter your user's id"></input>
                        <Select className='selector' isMulti placeholder="select your permission"
                                value={selectedOption}
                                onChange={this.handleChanges}
                                options={options}
                        />
                        <div className="textarea-addmember"

                             style={{borderRadius: "10px", marginTop: "10%", marginBottom: "5%",}}></div>

                        <div className="Status-Addmember" id="Addmember-Status"></div>

                        <div class="center">


                            <Button style={{marginTop: "14%", backgroundColor: "Red"}} size='large'

                                    className="addbtn" variant="contained" color="secondary">

                                <p>Add&nbsp;</p>

                            </Button>


                            <Button style={{

                                marginTop: "14%",

                                backgroundColor: 'gray',

                                marginLeft: "3%"


                            }} size='large' className="skipbtn" variant="contained" color="secondary">

                                <p>Done</p>

                            </Button>


                        </div>

                    </div>

                </div>
                <div className="search-result2" id='res'></div>
                <div className="groupsShow">
                    <div className="headershow">

                        <h4 className='yourgroupstext'> Your Groups </h4>


                        <Button style={{

                            backgroundColor: "Red",
                            width: '30%',

                            marginTop: '10px'


                        }} className='createnewgp' startIcon={<AddIcon/>} variant="contained" color="secondary">


                        </Button>

                    </div>
                    <div className=' groupshowbody'>
                        <hr></hr>

                    </div>


                </div>

                <div className="search-result" id='res'></div>
                <div id="snackbar-succes-join">Successfully join</div>
                <div id="snackbar-already">User is already a member of this group</div>
                <div id="snackbar-succes">Successfully add to group</div>
                <div id="snackbar-not">User not found</div>
                <div id="snackbar-exist">group with this groupid already exists!</div>
            </div>


        )


    }


}


export default Homepage
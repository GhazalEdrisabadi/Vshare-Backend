import React, {Component} from 'react'
import './profile.css'
import $ from 'jquery';
import Left from './left.png'
import Right from './right.png'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';

import HomeIcon from '@material-ui/icons/Home';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import IconButton from '@material-ui/core/IconButton';
import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined';
import Button from '@material-ui/core/Button';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import EditIcon from '@material-ui/icons/Edit';
import Avatar from '@material-ui/core/Avatar';
import Dorbin from './camera.png'

var username = window.location.href.split('/')[4];
var respone_get
var count

class profile extends Component {
    componentDidMount() {

        const {id} = this.props.match.params;
        $(document).ready(function () {
             $(".username_prof").text(username);
            console.log(username);
            if (username == window.localStorage.getItem('username')) {
                document.getElementById("content").style.display = 'none'
                document.getElementById("right-button").style.display = 'none'
                document.getElementById("left-button").style.display = 'none'
            }
            var settings = {
                "url": "http://127.0.0.1:8000/user/relations/followers/?user=" + username + "",
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


                count = response.followers_count
                $(".follower_count").text(response.followers_count)

            });
            var settings = {
                "url": "http://127.0.0.1:8000/user/relations/followings/?user=" + username + "",
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


                $(".following_count").text(response.followings_count)

            });


            var id_gp = window.localStorage.getItem('id_group')
            if (username == window.localStorage.getItem('username')) {
                document.getElementById("edite-btn").style.display = 'block'
                document.getElementById("f-btn").style.display = 'none'
                document.getElementById("uf-btn").style.display = 'none'
            } else {
                var settings = {
                    "url": "http://127.0.0.1:8000/user/followings/find/" + username + "/",
                    "method": "GET",
                    "timeout": 0,
                    "headers": {
                        "Authorization": "token " + window.localStorage.getItem('token'),
                        "accept": "application/json",
                        "Access-Control-Allow-Origin": "*",
                        "Access-Control-Allow-Headers": "*",
                        "Content-Type": "application/json"
                    }, success: function (event) {


                        if (event.status == 404) {
                            document.getElementById("f-btn").style.display = 'block'
                            document.getElementById("uf-btn").style.display = 'none'
                        } else {
                            document.getElementById("f-btn").style.display = 'none'
                            document.getElementById("uf-btn").style.display = 'block'
                        }
                    },


                };

                $.ajax(settings).done(function (response) {


                });
                document.getElementById("edite-btn").style.display = 'none'

                document.getElementById("f-btn").style.display = 'block'
                document.getElementById("uf-btn").style.display = 'none'
            }


                var settings = {
                    "url": "http://127.0.0.1:8000/user/" + username + "/edit/",
                    "method": "GET",
                    "timeout": 0,
                    "headers": {

                        "accept": "application/json",
                        "Access-Control-Allow-Origin": "*",
                        "Access-Control-Allow-Headers": "*",
                        "Content-Type": "application/json"
                    },

                };


                $.ajax(settings).done(function (response1) {
                    console.log(response1)
                    $(".photo").html(username.toUpperCase()[0]);


                });



            $('#file-input').change(function () {
                $('.status-upload').html(document.getElementById('file-input').files[0].name)


            })
            $(".inp-search").keyup(function () {
                $(".search-result").html("")

                var user_search = $('.inp-search').val()

                var settings = {
                    "url": "http://127.0.0.1:8000/user/find/username/?search=" + user_search + "",
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
                    $(".search-result").append(htmlcode)
                    for (var counter1 = 0; counter1 < response.length; counter1++, htmlcode = '') {
                        var a2 = "window.localStorage.setItem('user','" + response[counter1].username + "')";
                        var r = "window.location.replace('/profile/" + response[counter1].username + "')";


                        htmlcode += '<div>'

                        htmlcode += '<div class="user-search">';
                        htmlcode += '<p ' + hoverr + '"' + hoverrout + '"' + ' style="font-size: 21px" class="username-result"  onclick="' + a2 + "," + r + '" id=' + '"c' + counter1 + '">' + "&nbsp&nbsp&nbsp&nbsp&nbsp" + response[counter1].username + '</p>';

                        htmlcode += '<br/>'


                        htmlcode += '</div>'

                        htmlcode += '</div>'
                        htmlcode += '<hr/>'
                        $(".search-result").append(htmlcode)
                    }

                });

                var settings = {
                    "url": "http://127.0.0.1:8000/groups/?search=" + user_search + "",
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
                    $(".search-result").append(htmlcode)
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
                        $(".search-result").append(htmlcode)
                    }

                });

                setTimeout(function () {
                    if ($(".search-result").html() == '') {
                        // $(".search-result").html("<p class='notfound'>not found</p>");
                        $(".search-result").fadeOut()
                    } else {
                        $(".search-result").fadeIn()
                    }
                }, 200)


            })

            $(".modal-join ").click(function () {
                $(".modal-join").fadeOut()

            })
            $(".join-no ").click(function () {
                $(".modal-join").fadeOut()

            })
            $(".join-yes ").click(function () {
                var settings = {
                    "url": "http://127.0.0.1:8000/group/join/",
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
                            "url": "http://127.0.0.1:8000/group/permissions/",
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
                                    window.location.replace('/profile/' + username + '')
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

            $(".home-btn ").click(function () {
                window.location.replace('../homepage')

            })
            $(".back_profile").click(function () {
                $(".search-result").text("")
                $(".search-result").fadeOut();

            })
            $(".edite_profile").click(function () {
                $(".modal_edite_profile").fadeIn();
                $(".status-upload").html('')

            })
            $('.submitedit').click(function () {
                var photo_upload = $('#file-input').val()
                var email_edit = $('#editemail').val()
                var password_edit = $('#editpassword').val()
                if (photo_upload != '') {
                    var settings = {
                        "url": "http://127.0.0.1:8000/user/" + username + "/edit/upload_photo",
                        "method": "POST",
                        "timeout": 0,
                        "headers": {

                            "accept": "application/json",
                            "Access-Control-Allow-Origin": "*",
                            "Access-Control-Allow-Headers": "*",
                            "Content-Type": "application/json"
                        },


                    };

                    $.ajax(settings).done(function (response) {

                        console.log(response)

                        var file_upload = document.getElementById('file-input').files[0];
                        var fd = new FormData();


                        fd.append('key', response.fields.key);
                        //  fd.append('acl', 'public-read');
                        //fd.append('Content-Type', file.type);
                        fd.append('AWSAccessKeyId', response.fields.AWSAccessKeyId);
                        fd.append('policy', response.fields.policy)
                        fd.append('signature', response.fields.signature);

                        fd.append("file", file_upload);

                        var xhr = new XMLHttpRequest();

                        // xhr.upload.addEventListener("progress", uploadProgress, false);
                        // xhr.addEventListener("load", uploadComplete, false);
                        // xhr.addEventListener("error", uploadFailed, false);
                        // xhr.addEventListener("abort", uploadCanceled, false);

                        xhr.open('POST', response.url, true); //MUST BE LAST LINE BEFORE YOU SEND

                        xhr.send(fd);
                    })
                }


            })
            $(".unfollow-btn").click(function () {
                var settings = {
                    "url": "http://127.0.0.1:8000/user/followers/unfollow/" + username + "/",
                    "method": "DELETE",
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

                    document.getElementById("f-btn").style.display = 'block'
                    document.getElementById("uf-btn").style.display = 'none'
                    count = count - 1
                    $(".follower_count").html(count)

                })

            })
            $(".follow-btn").click(function () {
                var settings = {
                    "url": "http://127.0.0.1:8000/user/relations/follow/",
                    "method": "POST",
                    "timeout": 0,
                    "headers": {
                        "Authorization": "token " + window.localStorage.getItem('token'),
                        "accept": "application/json",
                        "Access-Control-Allow-Origin": "*",
                        "Access-Control-Allow-Headers": "*",
                        "Content-Type": "application/json"
                    },
                    "data": JSON.stringify({
                            "who_is_followed": username,
                            "who_follows": "",
                        }
                    ),

                };

                $.ajax(settings).done(function (response) {

                    document.getElementById("f-btn").style.display = 'none'
                    document.getElementById("uf-btn").style.display = 'block'
                    count = count + 1
                    $(".follower_count").html(count)
                })

            })
            $(".follower").click(function () {
                $(".modal-follower").fadeIn();
            })
            $(".userprofile").click(function () {
                window.localStorage.setItem('user', window.localStorage.getItem('username'))
                window.location.replace("/profile/" + window.localStorage.getItem('username') + "")
            })
            $(".modal-follower").click(function () {
                $(".modal-follower").fadeOut();
            })
            $(".following").click(function () {
                $(".modal-content-following").html("")
                var html = ''
                html += '  <h3 class="texx_following">Following!</h3>'
                html += '  <hr></hr>'


                $(".modal-content-following").append(html)
                var settings = {
                    "url": "http://127.0.0.1:8000/user/relations/followings/?user=" + username + "",
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
                    var htmlcode = ''

                    for (var counter1 = 0; counter1 < response.result.length; counter1++, htmlcode = '') {

                        var a2 = "window.localStorage.setItem('user','" + response.result[counter1].who_is_followed + "')";
                        var r = "window.location.replace('/profile/" + response.result[counter1].who_is_followed + "')";
                        htmlcode += '<div>'

                        htmlcode += '<div class="user-search">';
                        htmlcode += '<p ' + hoverr + '"' + hoverrout + '"' + ' style="font-size: 21px" class="username-result2"  onclick="' + a2 + "," + r + '" id=' + '"c' + counter1 + '">' + "&nbsp&nbsp&nbsp&nbsp&nbsp" + response.result[counter1].who_is_followed + '</p>';

                        htmlcode += '<br/>'


                        htmlcode += '</div>'

                        htmlcode += '</div>'
                        htmlcode += '<hr/>'
                        $(".modal-content-following").append(htmlcode)
                    }
                    $(".modal-following").fadeIn();

                });

            })

            $(".follower").click(function () {
                $(".modal-content-follower").html("")
                var html = ''

                html += '  <h3 class="texx_follower">Follower!</h3>'
                html += '<hr></hr>'


                $(".modal-content-follower").append(html)
                var settings = {
                    "url": "http://127.0.0.1:8000/user/relations/followers/?user=" + username + "",
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
                    var htmlcode = ''

                    for (var counter1 = 0; counter1 < response.result.length; counter1++, htmlcode = '') {

                        var a2 = "window.localStorage.setItem('user','" + response.result[counter1].who_follows + "')";
                        var r = "window.location.replace('/profile/" + response.result[counter1].who_follows + "')";
                        htmlcode += '<div>'

                        htmlcode += '<div class="user-search">';
                        htmlcode += '<p ' + hoverr + '"' + hoverrout + '"' + ' style="font-size: 21px" class="username-result2"  onclick="' + a2 + "," + r + '" id=' + '"c' + counter1 + '">' + "&nbsp&nbsp&nbsp&nbsp&nbsp" + response.result[counter1].who_follows + '</p>';

                        htmlcode += '<br/>'


                        htmlcode += '</div>'

                        htmlcode += '</div>'
                        htmlcode += '<hr/>'
                        $(".modal-content-follower").append(htmlcode)
                    }
                    $(".modal-follower").fadeIn();

                });

            })
            $(".modal-following").click(function () {
                $(".modal-following").fadeOut();
            })
            window.onclick = function (event) {

                if (event.target == document.getElementById("myModal")) {

                    $(".modal_edite_profile").fadeOut();

                }


            }

            var token = window.localStorage.getItem('token');
            var mygroups = [];
            var groups = [];

            var settings = {
                "url": "http://127.0.0.1:8000/group/user_groups/?user_id=" + username + "",
                "method": "GET",
                "timeout": 0,
                "headers": {},
            };

            $.ajax(settings).done(function (response) {

                // for (var counter = 0; counter < response.length; counter++)
                //     mygroups.push({ name: response[counter].title, id: response[counter].groupid });

                var hoverout = 'onMouseOut="this.style.color=';
                var hoverrout = hoverout + "'white'";

                var hover = 'onMouseOver="this.style.color=';
                var hoverr = hover + "'red'";
                var htmlcode = '';
                for (var counter1 = 0; counter1 < response.length; counter1++, htmlcode = '') {
                    var a2 = " document.getElementById('Modal-join').style.display = 'block'";
                    var r = "window.localStorage.setItem('id-join','" + response[counter1].the_group + "')"; //id of the group
                    htmlcode += '<div>'
                    htmlcode += '<div   onclick="' + a2 + "," + r + '"  class="admin_gp">' + response[counter1].the_group.toUpperCase()[0] + '</div>';
                    htmlcode += '<p ' + hoverr + '"' + hoverrout + '"' + '  class="id_group"  onclick="' + a2 + "," + r + '" id=' + '"c' + counter1 + '">' + "&nbsp&nbsp&nbsp&nbsp&nbsp" + response[counter1].the_group + '</p>';


                    htmlcode += '</div>'
                    $('.group_prof').append(htmlcode);

                }

            });


            document.getElementById('right-button').onclick = function () {
                scrollLeft(document.getElementById('content'), 300, 1000);

            }
            document.getElementById('left-button').onclick = function () {
                scrollLeft(document.getElementById('content'), -300, 1000);

            }

            function scrollLeft(element, change, duration) {
                var start = element.scrollLeft,
                    currentTime = 0,
                    increment = 20;


                var animateScroll = function () {
                    currentTime += increment;
                    var val = Math.easeInOutQuad(currentTime, start, change, duration);
                    element.scrollLeft = val;
                    if (currentTime < duration) {
                        setTimeout(animateScroll, increment);
                    }
                };
                animateScroll();
            }


            Math.easeInOutQuad = function (t, b, c, d) {
                t /= d / 2;
                if (t < 1) return c / 2 * t * t + b;
                t--;
                return -c / 2 * (t * (t - 2) - 1) + b;
            };
        })
    }

    render() {
        return (
            <div className="back_profile">
                <header className="head">


                    <div className='leftheader'>
                        <div className='userprofile'>
                            <IconButton style={{
                                color: 'white'

                            }}
                                        className="profilepic">
                                <AccountCircleOutlinedIcon fontSize="large"/>
                            </IconButton>

                        </div>

                        <div className='searchgp'>


                            <input placeholder='search' className='inp-search'/>


                            <div id='joinstatus' className='statusofjoin'>
                                Group not found !
                            </div>
                        </div>


                    </div>
                    <div className='home-btn'>

                        <IconButton style={{
                            color: 'white'
                        }}
                                    className="div_leave">
                            <HomeIcon fontSize="large"/>
                        </IconButton>
                    </div>
                </header>


                <div className="back_prof">

                    <div className='MuiAvatar-root MuiAvatar-circle photo MuiAvatar-colorDefault photo'>&nbsp;</div>

                    <div className="username_prof">USERNAME</div>


                    <IconButton style={{color: 'white', fontSize: "70px"}}
                                className="edite_profile" id="edite-btn">

                        <EditIcon fontSize="medium"/>
                        Edit profile
                    </IconButton>
                    <div className="follow-btn" id='f-btn'> Follow</div>
                    <div className="unfollow-btn" id='uf-btn'> UnFollow</div>
                    <div id="myModal" class="modal_edite_profile">
                        <div class="modal-content_edite_profile">
                            <h3 class="texx_edite">Edit your profile deatails</h3>
                            <hr></hr>
                            <div class="image-upload">
                                <label for="file-input">
                                    <img
                                        src="http://127.0.0.1:9000/minio/download/test/download.png?token=eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3NLZXkiOiJtaW5pbyIsImV4cCI6MTU5MTA2MjMwMCwic3ViIjoibWluaW8ifQ.4GxEaTiHCu8bJQdIHRNv4eJGv0mqCdgRIBQU_8iBKL-QBju2HtlJOdBan335lAifhW6xWi9rze-pkbEKC3jhqA"/>
                                </label>

                                <input id="file-input" type="file" accept=" image/jpeg, image/png"/>
                            </div>
                            <p className='status-upload'/>
                            <input class="inputedit" id='editemail' placeholder="PassWord"></input>
                            <input class="inputedit" id='editpassword' placeholder="Email"></input>
                            <br></br>
                            <button style={{
                                backgroundColor: "Red",
                                marginTop: "20px"
                            }} size='large' className="submitedit" variant="contained" color="secondary">
                                <p>Edit</p>
                            </button>

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
                    <div id="myModal-follower" class="modal-follower">
                        <div class="modal-content-follower">


                        </div>

                    </div>
                    <div id="myModal-following" class="modal-following">
                        <div class="modal-content-following">


                        </div>

                    </div>
                    <div className="follower_count"></div>
                    <div className="follower">follower</div>
                    <div className="following_count"></div>
                    <div className="following">following</div>


                    <IconButton style={{color: 'white'}}
                                className="left-button" id="left-button">
                        <ArrowBackIosIcon fontSize="large"/>
                    </IconButton>


                    <div className="group_prof" id="content">

                    </div>


                    <IconButton style={{color: 'white'}}
                                className="right-button" id="right-button">
                        <ArrowForwardIosIcon fontSize="large"/>
                    </IconButton>


                </div>
                <div className="search-result" id='res'></div>
                <div id="snackbar-succes-join">Successfully join</div>
                <div id="snackbar-already">User is already a member of this group</div>
            </div>

        )
    }
}

export default profile;



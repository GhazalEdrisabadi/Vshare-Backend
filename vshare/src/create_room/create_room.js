import React, { Component } from 'react'
import $ from 'jquery';
import './create_room.css'
import jQuery from 'jquery'
import { Cookies } from 'js-cookie'
class create_room extends Component {
    
    componentDidMount() {
        function getCSRFToken() {
            var cookieValue = null;
            if (document.cookie && document.cookie != '') {
                var cookies = document.cookie.split(';');
                for (var i = 0; i < cookies.length; i++) {
                    var cookie = jQuery.trim(cookies[i]);
                    if (cookie.substring(0, 10) == ('csrftoken' + '=')) {
                        cookieValue = decodeURIComponent(cookie.substring(10));
                        break;
                    }
                }
            }
            return cookieValue;
        }
        var csrftoken = getCSRFToken();
       // var csrftoken = Cookies.get('csrftoken');
        $(document).ready(function () {
            console.log(window.localStorage.getItem('token'));
            $("#homepagebtn").click(function () {
                window.location.replace("/homepage");
            });
            
            $(".next1").click(function () {
                var id = $(".input1").val();;
                var name = $(".input2").val();
                var bio = $(".textarea").val();
                var user = $(".textarea1").val();
                var mem = [];
                console.log(id + " " + name + " " + bio);
                console.log(csrftoken)
                var token = window.localStorage.getItem('token');
                console.log(token);
                
                var settings = {
                    "url": "http://localhost:8000/groups/",
                    "method": "POST",
                    "timeout": 0,
                    error: function () {
                        console.log("");
                    },
                    success: function () {
                        window.localStorage.setItem('id_group', id);
                        window.location.replace("/add");
                        alert("done");
                    },
                    "headers": {
                        'X-CSRFToken': csrftoken,
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
                       //"created_by": "milad",
                        "members": mem
                    }
),
                };
                console.log(settings.headers);
                console.log(settings.method);
                $.ajax(settings).done(function (response) {
                    console.log(response);
                    console.log(response.status);
                    console.log("1");
                    if (response.status === 400) {
                        console.log("no");
                    }
                    else {
                        console.log("yes");
                    }

                    //  console.log(responseDisplay);
                    // console.log(response.status.);
                });


                //    window.location.replace("/account/menu/");
                // Window.location="/account/menu/"

            });
            $(".btn").click(function () {
                var member = $(".input3").val();;
               
                //console.log(id + " " + name + " " + bio);
                //console.log(csrftoken)
                var token = window.localStorage.getItem('token');
                console.log(token);

                var settings = {
                    "url": "http://127.0.0.1:8000/user/"+ member+"",
                    "method": "GET",
                    "timeout": 0,
                    error: function () {
                        console.log("noooooooo");
                    },
                    success: function () {
                        console.log("yeeeeeees");
                    },
                    "headers": {
                        'X-CSRFToken': csrftoken,
                        "accept": "application/json",
                        "Access-Control-Allow-Origin": "*",
                        "Access-Control-Allow-Headers": "*",
                        "Content-Type": "application/json"
                    },
                    //"data": JSON.stringify({
                    //    "userid": id,
                    //    "title": name,
                    //    "describtion": bio,
                    //    "invite_only": true,
                    //    "created_by": 1,
                    //    "members": [user]
                    //}
                    //),
                };
                console.log(settings.headers);
                console.log(settings.method);
                $.ajax(settings).done(function (response) {
                    console.log(response);
                    console.log(response.status);
                    console.log("1");
                    //if (response.status === 404) {
                    //    console.log("no");
                    //}
                    //if (response.status===200) {
                    //    console.log("yes");
                    //}
                    //if (response.o)
                    //  console.log(responseDisplay);
                    // console.log(response.status.);
                });


                //    window.location.replace("/account/menu/");
                // Window.location="/account/menu/"

            });
        });
        $(document).ready(function () {
            $(".button1").click(function () {
                console.log("1111111111111")
                window.location.replace("/homepage");
            })
        })
    };
    constructor(props) {
        super(props);
        this.state={
            id_gp:'',
            name_gp:'',
            bio: '',
            user: '',
          
        }
        
    }
    change_name = e => {
        this.setState({ name_gp: e.target.value })
    }
    change_id = e => {
        this.setState({ id_gp: e.target.value })
    }
    change_bio = e => {
        this.setState({ bio: e.target.value })
    }
    change_user = e => {
        this.setState({ user: e.target.value })
    }

 
    render() {
        return (
            <form className="form" >
                <div id="homepagebtn">
                    <p>Homepage</p>
                </div>
            
                <div className="formback">
                    <legend className="title">Create new group</legend>
                <input value={this.state.name_gp} onChange={this.change_name} type="text"
                    className="input1" placeholder="name" style={{
                    height: '40px',
                        width: '290px',
                        marginLeft:'-30px'
                    }} />
                <input value={this.state.id_gp} onChange={this.change_id} type="text"
                    className="input2" placeholder="id" style={{
                    height: '40px',
                    width: '290px'
                        }} />
                    
        
                   
                    

                  
                <textarea value={this.state.bio} onChange={this.change_bio} type="text"
                    className="textarea" placeholder=" bio" style={{
                    height: '60px',
                    width: '290px'
                    }} />
          
                <dev id="create" className="next1" variant="raised"

                    >next</dev>


                
                </div>

            </form>

            )
    }
}
export default create_room;
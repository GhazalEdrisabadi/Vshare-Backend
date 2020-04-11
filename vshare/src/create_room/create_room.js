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
            
            $(".button").click(function () {
                var id = $(".input1").val();;
                var name = $(".input2").val();
                var bio = $(".textarea").val();
                var user = $(".textarea1").val();
                console.log(id + " " + name + " " + bio);
                console.log(csrftoken)
                var token = window.localStorage.getItem('token');
                console.log(token);
                
                var settings = {
                    "url": "http://localhost:8000/groups/",
                    "method": "POST",
                    "timeout": 0,
                    "headers": {
                        'X-CSRFToken': csrftoken,
                       "accept": "application/json",
                        "Access-Control-Allow-Origin": "*",
                        "Access-Control-Allow-Headers": "*",
                        "Content-Type": "application/json"
                    },
                    "data": JSON.stringify({
                        "userid": id,
                        "title": name,
                        "describtion": bio,
                        "invite_only": true,
                        "created_by": 1,
                        "members": [user]
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
                    <legend className="title">Create new group!</legend>
                <input value={this.state.name_gp} onChange={this.change_name} type="text"
                    className="input1" placeholder="name ..." style={{
                    height: '40px',
                    width: '290px'
                    }} />
                <input value={this.state.id_gp} onChange={this.change_id} type="text"
                    className="input2" placeholder="id ..." style={{
                    height: '40px',
                    width: '290px'
                    }} />
                <textarea value={this.state.bio} onChange={this.change_bio} type="text"
                    className="textarea" placeholder=" bio ..." style={{
                    height: '60px',
                    width: '290px'
                    }} />
                <textarea value={this.state.user} onChange={this.change_user} type="text"
                    className="textarea1" placeholder="id of member example :ali,hossein " style={{
                        height: '60px',
                        width: '290px'
                    }} />
                <button id="create" className="button" variant="raised"
                    
                    >next</button>
                </div>
            </form>

            )
    }
}
export default create_room;
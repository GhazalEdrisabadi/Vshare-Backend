import React, { Component } from 'react'
import './chat_room.css'
import $ from 'jquery';
import Websocket from 'react-websocket';
class chat_room extends Component {
    componentDidMount() {
        //This will open the connection*
        var ws = new WebSocket("ws://localhost:8000/user/signup/");
        ws.onopen = function () {
            console.log("Ping");
        };

        const { id } = this.props.match.params
        $(document).ready(function () {

            // if (localStorage.getItem('token') == null) {
            //     alert("Login please !");
            //     window.location.replace("/login/");
            // }
        
                var id = window.localStorage.getItem('id_gp');
                var settings = {
                    "url": "http://127.0.0.1:8000/groups/test",
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
                    console.log("111111")
                    console.log(response)
                    for (var i = 0; i < response.members.length; i++) {
                        var hoverout = 'onMouseOut="this.style.color=';
                        var hoverrout = hoverout + "'white'";
                        var htmlcode = '';
                        var hover = 'onMouseOver="this.style.color=';
                        var hoverr = hover + "'red'";

                        htmlcode += '<p class="mygroups" id=' + '"c' + i + '"' + hoverr + '"' + hoverrout + '"' + '>' + response.members[i] + '</p>';
                        $(".textarea_member").append(htmlcode);
                      
                        console.log("2")
                        //$(".textarea_member").append(response.members[i] + "\n")

                    }
                    $(".textarea_bio").append(response.describtion + "\n")

                });
        });


        //Log the messages that are returned from the server
  
    }
    render() {
        return (
            <form className="back">                <div className="formback_movie">                </div>                <div className="back_coulom">                    <div className="formback_info" style={{ width: '115%', height: '410px' }}>                        <legend className="title_gp">info of group</legend>                        <div className="textarea_member" style={{ overflowY: 'scroll' }} />                        <div className="textarea_bio" />                    </div>                    <div className="formback_text" style={{ width: '115%', height: '410px', }} >                    </div>                </div>               
                     />            </form>
            )
    }
}
export default chat_room;

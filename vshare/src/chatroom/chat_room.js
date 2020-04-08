import React, { Component } from 'react'
import './chat_room.css'
import $ from 'jquery';
class chat_room extends Component {
    componentDidMount() {
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
                        console.log("2")
                        $(".textarea_member").append(response.members[i] + "\n")

                    }
                    $(".textarea_bio").append(response.describtion + "\n")

                });
           

        });
    }
    render() {
        return (
            <form className="back">
                <div className="formback_text">
                
                </div>
                <div className="formback_movie">

                </div>
                <div className="formback_info">

                </div>
            </form>
            )
    }
}
export default chat_room;

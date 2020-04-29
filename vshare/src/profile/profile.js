import React, { Component } from 'react'
import './profile.css'
import $ from 'jquery';
var respone_get
class profile extends Component {
    componentDidMount() {
        const { id } = this.props.match.params;
        $(document).ready(function () {
                var member = $(".inp").val();

                var username = window.localStorage.getItem('username');
                var id_gp = window.localStorage.getItem('id_group')
           

                var settings = {
                    "url": "http://127.0.0.1:8000/user/" + username + "",
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
                    // 
                    console.log(response);
                    respone_get = response
                    $(".username_prof").text(respone_get.username)

                });
           

        })
    }
    render() {
        return (
            <div className="back_profile" >
                <div className="photo" />
                <div className="username_prof">USERNAME</div>
                <div className="edite_profile">Edite Profile</div>
        
            </div>
            )
    }
}
export default profile;
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
           
            $(".edite_profile").click(function () {
                $(".modal_edite_profile").fadeIn();

            })
            $(".modal_edite_profile").click(function () {
                $(".modal_edite_profile").fadeOut();
            })
            var token = window.localStorage.getItem('token');
            var mygroups = [];
            var groups = [];
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
                    mygroups.push({ name: response[counter].title, id: response[counter].groupid });


                var htmlcode = '';
                for (var counter1 = 0; counter1 < mygroups.length; counter1++ , htmlcode = '') {

                    htmlcode+='<div>'
                    htmlcode += '<div class="admin_gp"></div>';
                   
                    htmlcode += '<p class="id_group">' + mygroups[counter1].id + '</p>'
                    htmlcode+='</div>'
                    $('.group_prof').append(htmlcode);

                }

            });
            var htmlcode = '';
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
                        var booll = 0;
                        for (var jj = 0; jj < mygroups.length; jj++) {
                            if (mygroups[jj].id == response2.groupid)
                                booll = 1;

                        }
                        if (booll == 0)
                            groups.push({ name: response2.title, id: response2.groupid });
                    });


                }


                setTimeout(function () {
                    console.log(groups[1]);
                    var counter2 = 0;
                    var htmlcode2 = '';
                    while (counter2 < groups.length) {
                        htmlcode2 += '<div class="member_gp"></div>';

                        $('.group_prof').append(htmlcode2);
                        counter2++;
                        htmlcode2 = '';
                        console.log("1")
                    }
                    console.log("groups :" + groups);
                }, 500);


            });
        })
    }
    render() {
        return (
            <div className="back_profile" >
                <div className="photo" />
                <div className="username_prof">USERNAME</div>
                <div className="edite_profile">   Edite Profile</div>
                <div id="myModal" class="modal_edite_profile">
                    <div class="modal-content_edite_profile" >
                        <h3 class="texx_edite">Edit your profile deatails</h3>
                        <hr></hr>
                        <input class="inputedit" id='edittitle' placeholder="Title"></input>
                        <input class="inputedit" id='editdes' placeholder="Description"></input>
                        <br></br>
                        <button style={{
                            backgroundColor: "Red",
                            marginTop: "20px"
                        }} size='large' className="submitedit" variant="contained" color="secondary">
                            <p>Edit</p>
                        </button>

                    </div>
                   
                </div>
                <div className="follower_count">0</div>
                <div className="follower">followers</div>
                <div className="following_count">0</div>
                <div className="following">following</div>
                <div className="group_prof"></div>
            </div>
            )
    }
}
export default profile;
/*        <div id="myModal" class="modal">

                    <div class="modal-content">
                        <h3 class="texx">Edit your groups deatails</h3>

                        <hr></hr>

                        <input class="inputedit" id='edittitle' placeholder="Title"></input>


                        <input class="inputedit" id='editdes' placeholder="Description"></input>
                        <br></br>

                        <button style={{
                            backgroundColor: "Red",
                            marginTop: "20px"
                        }} size='large' className="submitedit" variant="contained" color="secondary">
                            <p>Edit</p>
                        </button>

                    </div>

                </div>
                */
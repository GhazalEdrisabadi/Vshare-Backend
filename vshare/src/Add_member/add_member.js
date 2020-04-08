import React, { Component } from 'react'
import './add_member.css'
import jQuery from 'jquery'
import $ from 'jquery';
class add_member extends Component {

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
            $(".next2").click(function () {
                window.location.replace("/homepage");

            });

            $(".next").click(function () {
                var member = $(".input").val();

                //console.log(id + " " + name + " " + bio);
                //console.log(csrftoken)
                var token = window.localStorage.getItem('token');
                var id_gp = window.localStorage.getItem('id_group')
                console.log(id_gp)
                console.log(token);

                var settings = {
                    "url": "http://127.0.0.1:8000/user/" + member + "",
                    "method": "GET",
                    "timeout": 0,
                    error: function () {
                        alert("نام کاربری مورد نظر وجود ندارد");
                    },
                    success: function () {
    
                        var settings = {
                            "url": "http://127.0.0.1:8000/group/add_member/",
                            "method": "POST",
                            error: function () {
                                alert("noooooo");
                            },
                            success: function () {
                                alert("با موفقیت اضافه شد")
                            },
                            "timeout": 0,
                            "headers": {
                                'X-CSRFToken': csrftoken,
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
                            console.log(response);
                        });
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

    };




    render() {
        return (
            <form className="form_add_mem">
                <div className="formback_add_mem">
                    <input className="input" style={{
                        height: '40px',
                        width: '290px'
                    }} placeholder="id of member example :ali " />

                    <div className="search">
                    <div id="create" className="next" variant="raised"
                        >next</div>
                        <div className="next2" variant="raised"
                        >skip</div>
                    </div>
                    </div>

                
            </form>
            )
    }
}
export default add_member;
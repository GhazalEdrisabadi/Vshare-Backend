
import React, { Component } from 'react'
import $ from 'jquery';
import './create_room.css'
import jQuery from 'jquery'
import { Cookies } from 'js-cookie'
class create_room extends Component {


    componentDidMount() {

        document.getElementById("myModel").style.display = "none";



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

            var mem = [];
            var mem2 = [];
            var htmlcode = '';
            var counter = 0;

            $(".addbtn").click(function () {
                var member = $(".inp").val();

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


            $("#homepagebtn").click(function () {
                window.location.replace("/homepage");
            });

            $(".skipbtn").click(function () {
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


                var settings = {
                    "url": "http://localhost:8000/groups/",
                    "method": "POST",
                    "timeout": 0,
                    error: function () {
                        console.log("");
                    },
                    success: function () {
                        document.getElementById("myModel").style.display = 'block'

                        window.localStorage.setItem('id_group', id);
                        //window.location.replace("/add");
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

                $.ajax(settings).done(function (response) {
                    console.log(response);

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
                var form = new FormData();
                var settings = {
                    "url": "http://127.0.0.1:8000/user/" + member,
                    "method": "GET",
                    "timeout": 0,
                    "processData": false,
                    "mimeType": "multipart/form-data",
                    "contentType": false,
                    "data": form,
                    error: function () {
                        alert("User not found");
                    }
                };

                $.ajax(settings).done(function (response) {
                    console.log(response);

                    if (response.status === 400) {
                        alert("User not found");
                    }
                    else {
                        htmlcode = '';
                        htmlcode += '<p className="pp" id=' + '"c' + counter + '">' + member + '</p>';
                        var s = "document.getElementById('close" + counter + "')";
                        var ss = s + ".remove()";
                        var a = "document.getElementById('c" + counter + "')";
                        var aa = a + ".remove()";

                        var d = "document.getElementById('h" + counter + "')";
                        var dd = d + ".remove()";


                        htmlcode += '<span onclick="' + ss + ',' + aa + ',' + dd + '"class="closes" id="close' + counter + '">&times;</span>';

                        htmlcode += '<hr class="line" id=' + '"h' + counter + '">';
                        $('.members').append(htmlcode);
                        counter++;
                    }
                });


                //    window.location.replace("/account/menu/");
                // Window.location="/account/menu/"

            });
        });
        $(document).ready(function () {

        })
    };



    render() {
        return (
            <form className="form" >
                <div id="homepagebtn">
                    <p>Homepage</p>
                </div>

                <div className="formback">
                    <legend className="title">Create new group</legend>
                <input onChange={this.change_name} type="text"

                    className="input1" placeholder="name" style={{
                    height: '40px',
                        width: '290px',
                        marginLeft:'-30px'
                    }} />
                <input  onChange={this.change_id} type="text"
                    className="input2" placeholder="id" style={{
                    height: '40px',
                    width: '290px'
                        }} />
                    
        
                   
                    

                  
                <textarea  onChange={this.change_bio} type="text"
                    className="textarea" placeholder=" bio" style={{
                    height: '60px',
                    width: '290px'
                    }} />
          
                <dev id="create" className="next1" variant="raised"

                    >next</dev>

                    <div id="myModel" className="modal2" >
                        <div className="modal-content2">
                            <p class='tit'>Add your member</p>
                            <input class='inp'></input>
                         
                                <div class='dltbtns'></div>
                                <div class='addbtn'>Add</div>
                                <div class='skipbtn'>Skip</div>
                            
                        </div>
                    </div>


                </div>
       

            </form>

        )
    }

}
export default create_room;
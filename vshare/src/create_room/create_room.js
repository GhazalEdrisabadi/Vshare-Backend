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
                var mem = ["milad"];
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
                        alert("done");
                    },
                    "headers": {
                        'X-CSRFToken': csrftoken,
                       "accept": "application/json",
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
       
     var htmlcode='';
     var counter=0;

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

                    if (response.status === 400) {
                        console.log("no");
                    }
                    else {
                        htmlcode='';
                        htmlcode += '<p className="pp" id=' + '"c' + counter + '">' + response.username+'</p>';
                        var s="document.getElementById('close"+counter+"')";
                        var ss=s+".remove()";
                        var a="document.getElementById('c"+counter+"')";
                        var aa=a+".remove()";
                    
                        var d="document.getElementById('h"+counter+"')";
                        var dd=d+".remove()";
                    

                        htmlcode += '<span onclick="'+ss+','+aa+','+dd+'"class="closes" id="close' + counter + '">&times;</span>';
                        
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
                <input  type="text"
                    className="input1" placeholder="name" style={{
                    height: '40px',
                        width: '290px',
                        marginLeft:'-30px'
                    }} />
                <input  type="text"
                    className="input2" placeholder="id" style={{
                    height: '40px',
                    width: '290px'
                    }} />
                    <div classname ="search">

                     <input   className="input3"  style={{
                        height: '40px',
                        width: '225px'
                            }} placeholder="id of member  "/>
          
                        <div id="btn" className="btn" >add member</div>

                    </div>
                   
                    

                  
                <textarea  type="text"
                    className="textarea" placeholder=" bio" style={{
                    height: '60px',
                    width: '290px'
                    }} />
                <div className='members' style={{width: '290px'}}>Members : <hr></hr></div>
                <button id="create" className="button" variant="raised">next</button>


                
                </div>

            </form>

            )
    }

}
export default create_room;
import React,{Component} from 'react';
import './signup-logincss.css'
import $ from 'jquery';
import jQuery from 'jquery'
import { Cookies } from 'js-cookie'
class sl extends Component{
  componentDidMount(){
   $(document).ready(function () {
    $(".signupbtn").click(function () {
        var username = $(".username").val();
        var firstname = $(".firstname").val();
        var lastname = $(".lastname").val();
        var email = $(".email").val();
        var cpassword = $(".cpassword").val();
        var password = $(":password").val();
    
        var settings = {
            "url": "http://127.0.0.1:8000/user/signup/",
            "method": "POST",
            "timeout": 0,
            error:function(){
              $("#statussignup").text("All field are required and enter a valid email address !");
            },
            success:function(){
                window.location.replace("/login");
            },
            "headers": {
                "accept": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*",
                "Content-Type": "application/json"
            },
            "data": JSON.stringify({"firstname": firstname,"lastname": lastname,"username": username,"email": email, "password": password ,"password2": cpassword }),
        };
        $.ajax(settings).done(function (response) {
            console.log(response);
        });
    });
       $(".cpassword").blur(function () {
           var password = $(":password").val();
           var cpassword = $(".cpassword").val();
           if (cpassword != password) {
               $("#checkpass").text("Passwords dose not match !");

           }
           else {
               $("#checkpass").text("");
           }
       });
    });
//////////////////////////////////////////////////////
/////////////////////////////////////////////////////
////////////////////////////////////////////////////

$(document).ready(function () {
  $("#status").text("");
  $("#forget").click(function(){
    alert("I'm just a demo version :)");
  })
    $(".signinbtn").click(function () {

        var username = $(".loginusername").val();
        var password = $(".loginpassword").val(); 
        var settings = {
            "url": "http://127.0.0.1:8000/user/login/",
            "method": "POST",
            "timeout": 0,
            error:function(){
              $("#status").text("Username or Password is incorrect !");
            },
            "headers": {
                "accept": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*",
                "Content-Type": "application/json"
            },
            "data": JSON.stringify({"username": username, "password": password}),
        };
        $.ajax(settings).done(function (response) {
            console.log(response);
            if (response.status === 400) {
                console.log("no");
            } else {
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
                console.log(csrftoken)
               // Cookies.set('csrftoken');
                window.localStorage.setItem('token', response.token);
                window.localStorage.setItem('username', username);
                window.location.replace("/homepage");
            }
         
        });
    });
});
      
//////////////////////
////////////////////
/////////////////////
window.onload=function(){
  const signUpButton = document.getElementById('signUp');
  const signInButton = document.getElementById('signIn');
  const container = document.getElementById('container');
  signUpButton.addEventListener('click', () => {
    container.classList.add("right-panel-active");
  });
  signInButton.addEventListener('click', () => {
    container.classList.remove("right-panel-active");
  });
}
}

render(){
return (
<dev>
<h2>Welcome to vShare</h2>
<div class="container" id="container">
  <div class="form-container sign-up-container">
    <form action="#">
      <h1 class="CreatAccount">Create Account</h1>
      <p id='statussignup'></p>
      <div class="social-container">
   
      </div>
      <input type="text" placeholder="Fisrt name" class='firstname'/>
      <input type="text" placeholder="Last name" class='lastname' />
                    <input type="text" placeholder="User name" class='username' />
                    <input type="password" placeholder="Password" class='password' />
                    <input type="password" placeholder="Confirm password" class='cpassword' />
      <input type="email" placeholder="Email" class='email'/>
      
                    <p id="checkpass"></p>
      <button class="signupbtn">Sign Up</button>
    </form>
  </div>
  <div class="form-container sign-in-container">
    <form action="#">
      <h1>Sign in</h1>
      <div class="social-container">
    
      </div>
   
      <input type="text" placeholder="Email Or Username" class="loginusername" />
      <input type="password" placeholder="Password" class="loginpassword"/>
      <p id="status"></p>
      <a href="#" id="forget">Forgot your password?</a>
      <button class="signinbtn">Sign In</button>
    </form>
  </div>
  
   <div class="overlay-container">
    <div class="overlay">
      <div class="overlay-panel overlay-left">
        <h1>Intro of vShare</h1>
        <p>Vshare is a web-base service which allows you to watch a video file with other users at the same time.
          All the participants can send messages through the room while The video is playing for everyone. This service doesn’t stream the video , actually , it works when every participant has a similar video file locally on his/her device. While the video is playing , every changes to the video playback by any participant affects on what other clients are watching at the same time.
         </p>
        <button class="ghost" id="signIn">Sign In</button>
      </div>
      <div class="overlay-panel overlay-right">
        <h1>Intro of vShare</h1>
        <p>Vshare is a web-base service which allows you to watch a video file with other users at the same time.
          All the participants can send messages through the room while The video is playing for everyone. This service doesn’t stream the video , actually , it works when every participant has a similar video file locally on his/her device. While the video is playing , every changes to the video playback by any participant affects on what other clients are watching at the same time.
          </p>
        <button class="ghost" id="signUp">Sign Up</button>
      </div>
    </div>
  </div>
</div>

</dev>
);
}
}

export default sl;
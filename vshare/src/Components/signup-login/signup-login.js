import React, {Component} from 'react';
import './signup-logincss.css'
import $ from 'jquery';


var checksamepass=1;
class sl extends Component {
    componentDidMount() {
        $(document).ready(function () {
            window.localStorage.clear();


            $(".signupbtn").click(function () {

                if (checksamepass === 1){
                    var username = $(".susername").val();
                var firstname = $(".firstname").val();
                var lastname = $(".lastname").val();
                var email = $(".email").val();
                var cpassword = $(".cpassword").val();
                var password = $(":password").val();

                var settings = {
                    "url": "http://185.206.92.246:8000/user/signup/",
                    "method": "POST",
                    "timeout": 0,
                    error: function () {

                    },
                    success: function () {
                        var x = document.getElementById("snackbarloginsignup");
                        x.innerHTML = "&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp  Account successfully created &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp";
                        x.className = "show";
                        setTimeout(function () {
                            x.className = x.className.replace("show", "");
                        }, 4000);
                    },
                    "headers": {
                        "accept": "application/json",
                        "Access-Control-Allow-Origin": "*",
                        "Access-Control-Allow-Headers": "*",
                        "Content-Type": "application/json"
                    },
                    "data": JSON.stringify({
                        "firstname": firstname,
                        "lastname": lastname,
                        "username": username,
                        "email": email,
                        "password": password,
                        "password2": cpassword
                    }),
                };
                $.ajax(settings).done(function (response) {

                });
                $.ajax(settings).fail(function (response) {
                    document.getElementById("snackbarloginsignup").innerHTML = '';

                    var json = JSON.parse(response.responseText);
                    var keys2 = Object.keys(json);
                    for (var counterforsignup = 0; counterforsignup < keys2.length; counterforsignup++) {
                        var x = document.getElementById("snackbarloginsignup");
                        x.innerHTML += keys2[counterforsignup] + " : " + json[keys2[counterforsignup]] + '<br>';
                        x.className = "show";
                        setTimeout(function () {
                            x.className = x.className.replace("show", "");
                        }, 8000);

                    }
                });
            }
                else{
                    var x = document.getElementById("snackbarloginsignup");
                        x.innerHTML = "Your password doesn't match"
                        x.className = "show";
                        setTimeout(function () {
                            x.className = x.className.replace("show", "");
                        }, 4000);
                }
            });

            $(".cpassword").blur(function () {
                var password = $(":password").val();
                var cpassword = $(".cpassword").val();
                if (cpassword !== password) {
                    $("#checkpass").text("Passwords dose not match !");
                    checksamepass=0;

                } else {
                    $("#checkpass").text("");
                    checksamepass=1;
                }
            });
        });
//////////////////////////////////////////////////////
/////////////////////////////////////////////////////
////////////////////////////////////////////////////


            $("#status").text("");
            $("#forget").click(function () {
                alert("I'm just a demo version :)");
            })
            $(".signinbtn").click(function () {

                var username = $(".loginusername").val();
                var password = $(".loginpassword").val();
                var settings = {
                    "url": "http://185.206.92.246:8000/user/login/",
                    "method": "POST",
                    "timeout": 0,
                    error: function () {
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

                        window.localStorage.setItem('token', response.token);
                        window.localStorage.setItem('username', response.username);
                          window.localStorage.setItem('user', response.username)
                        window.location.replace("/homepage");


                });
            });

//////////////////////
////////////////////
/////////////////////
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

    render() {
        return (
            <dev>
                <div id="snackbarloginsignup"></div>

                <h2 className='boro'>vSharee vSharee vSharee vSharee vSharee vSharee  v</h2>
                <a href='/'><div class='homepagebtn2'>Landing page</div></a>
                <div class="container" id="container">
                    <div class="form-container sign-up-container">
                        <form className='form1' action="#">
                            <h1 class="CreatAccount">Create Account</h1>
                            <p id='statussignup'></p>
                            <div class="social-container">
                            </div>
                            <input type="text" placeholder="Fisrt name" class='firstname'/>
                            <input type="text" placeholder="Last name" class='lastname'/>
                            <input type="text" placeholder="User name" class='susername'/>
                            <input type="password" placeholder="Password" class='password'/>
                            <input type="password" placeholder="Confirm password" class='cpassword'/>
                            <input type="email" placeholder="Email" class='email'/>

                            <p id="checkpass"></p>
                            <button class="signupbtn">Sign Up</button>
                        </form>
                    </div>
                    <div class="form-container sign-in-container">
                        <form className='form1'  action="#">
                            <h1>Sign in</h1>
                            <div class="social-container">

                            </div>

                            <input type="text" placeholder="Email Or Username" class="loginusername"/>
                            <input type="password" placeholder="Password" class="loginpassword"/>
                            <p id="status"></p>
                            <a href="#" id="forget">Forgot your password?</a>
                            <button class="signinbtn">Sign In</button>
                        </form>
                    </div>

                    <div class="overlay-container">
                        <div class="overlay">
                            <div class="overlay-panel overlay-left">
                                <h1>Intro of vSharee</h1>
                                <p className='explain-txt'>Vsharee is a web-base service which allows you to watch a video file with other users at the same time. You can talk through the movie with each other
                                </p>
                                <button class="ghost" id="signIn">Sign In</button>
                            </div>
                            <div class="overlay-panel overlay-right">
                                <h1>Intro of vSharee</h1>
                                <p className='explain-txt'>Vsharee is a web-base service which allows you to watch a video file with other users at the same time. You can talk through the movie with each other
                                </p>
                                   <hr></hr>
                                   <hr></hr>
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
import React, { Component } from 'react'
import './profile.css'
import $ from 'jquery';
import Left from './left.png'
import Right from './right.png'
import Home from './home-icon.png'
import HomeIcon from '@material-ui/icons/Home';
import IconButton from '@material-ui/core/IconButton';
var username = window.localStorage.getItem('user');
var respone_get
class profile extends Component {
    componentDidMount() {
        const { id } = this.props.match.params;
        $(document).ready(function () {
            var settings = {
                "url": "http://127.0.0.1:8000/user/relations/followers/?user="+username+"",
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
               
                $(".follower_count").text(response.followers_count)

            });
                    var settings = {
                "url": "http://127.0.0.1:8000/user/relations/followings/?user="+username+"",
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
               
                $(".following_count").text(response.followings_count)

            });

            
            var id_gp = window.localStorage.getItem('id_group')
if(username==window.localStorage.getItem('username')){
       document.getElementById("edite-btn").style.display = 'block'
       document.getElementById("f-btn").style.display = 'none'
       document.getElementById("uf-btn").style.display = 'none'
}
else{
           var settings = {
                "url": "http://127.0.0.1:8000/user/followings/find/"+username+"/",
                "method": "GET",
                "timeout": 0,
                "headers": {
 "Authorization": "token " + window.localStorage.getItem('token'),
                    "accept": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Headers": "*",
                    "Content-Type": "application/json"
                },       success: function (event) {

                          
                           if(event.status==404){
                            document.getElementById("f-btn").style.display = 'block'
                            document.getElementById("uf-btn").style.display = 'none'
                           }
                           else{
                                document.getElementById("f-btn").style.display = 'none'
       document.getElementById("uf-btn").style.display = 'block'
                           }
                        },
                

            };

            $.ajax(settings).done(function (response) {
               
                console.log(response.status);
              

            });
         document.getElementById("edite-btn").style.display = 'none'
       document.getElementById("f-btn").style.display = 'block'
       document.getElementById("uf-btn").style.display = 'none'
}

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
            $(".inp-search").change(function () {
                $(".search-result").text("")
                console.log("change")
                var user_search=$('.inp-search').val()
                console.log(user_search)
                var settings = {
                    "url": "http://127.0.0.1:8000/user/find/username/?search="+user_search+"",
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
if(response.length==0){
    $(".search-result").append("user not found")
    $(".search-result").fadeIn()
}
else{
        var hoverout = 'onMouseOut="this.style.color=';
                        var hoverrout = hoverout + "'white'";

                        var hover = 'onMouseOver="this.style.color=';
                        var hoverr = hover + "'red'";
    var htmlcode='<br/>'
  //   $(".search-result").append(htmlcode)
                htmlcode = '';
               $(".search-result").append(htmlcode)
                for (var counter1 = 0; counter1 < response.length; counter1++ , htmlcode = '') {
var a2 = "window.localStorage.setItem('user'," + response[counter1].username + ")";
 var r = "window.location.replace('/profile/" + response[counter1].username + "')";
                    htmlcode += '<div>'
                    // htmlcode+='<br/>'
                    htmlcode += '<div class="user-search">';
                   htmlcode += '<p ' + hoverr + '"' + hoverrout + '"' + ' style="font-size: 21px" class="username-result"  onclick="' + a2 + "," + r + '" id=' + '"c' + counter1 + '">' + "&nbsp&nbsp&nbsp&nbsp&nbsp" + response[counter1].username + '</p>';
                
                 htmlcode+='<br/>'
                  
                       
                    htmlcode+='</div>'
                    
                    htmlcode += '</div>'
                      htmlcode+='<hr/>'
                    $(".search-result").append(htmlcode)
}
$(".search-result").fadeIn()                
}
          
    
                });
              

            })
            $(".home-btn ").click(function () {
               window.location.replace('../homepage')

            })
                $(".back_profile").click(function () {
                    $(".search-result").text("")
               $(".search-result").fadeOut();

            })
            $(".edite_profile").click(function () {
                $(".modal_edite_profile").fadeIn();

            })
           
                          $(".unfollow-btn").click(function () {
                     var settings = {
                "url": "http://127.0.0.1:8000/user/followers/unfollow/"+username+"/",
                "method": "DELETE",
                "timeout": 0,
                "headers": {
  "Authorization": "token " + window.localStorage.getItem('token'),
                    "accept": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Headers": "*",
                    "Content-Type": "application/json"
                },
            

            };

            $.ajax(settings).done(function (response) {
                // 
                console.log(response);
              document.getElementById("f-btn").style.display = 'block'
       document.getElementById("uf-btn").style.display = 'none'

            })

            })
              $(".follow-btn").click(function () {
                     var settings = {
                "url": "http://127.0.0.1:8000/user/relations/follow/",
                "method": "POST",
                "timeout": 0,
                "headers": {
  "Authorization": "token " + window.localStorage.getItem('token'),
                    "accept": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Headers": "*",
                    "Content-Type": "application/json"
                },
                   "data": JSON.stringify({
                            "who_is_followed": window.localStorage.getItem('user'),
                          "who_follows":"",
                        }
                    ),

            };

            $.ajax(settings).done(function (response) {
                // 
                console.log(response);
              document.getElementById("f-btn").style.display = 'none'
       document.getElementById("uf-btn").style.display = 'block'

            })

            })
            $(".follower").click(function(){
                $(".modal-follower").fadeIn();
            })
                 $(".back-prof").click(function(){
                window.localStorage.setItem('user' , window.localStorage.getItem('username'))
                window.location.replace("/profile/"+window.localStorage.getItem('username')+"")
            })
            $(".modal-follower").click(function () {
                $(".modal-follower").fadeOut();
            })
                  $(".following").click(function(){
                    $(".modal-content-following").html("")
                      var html=''
                     html+='  <h3 class="texx_following">Following!</h3>'
                      html+='  <hr></hr>'
                 
               
                    $(".modal-content-following").append(html)
                            var settings = {
                "url": "http://127.0.0.1:8000/user/relations/followings/?user="+username+"",
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
                   var hoverout = 'onMouseOut="this.style.color=';
                        var hoverrout = hoverout + "'white'";

                        var hover = 'onMouseOver="this.style.color=';
                        var hoverr = hover + "'red'";
                var htmlcode=''
                console.log(response);
                               for (var counter1 = 0; counter1 < response.result.length; counter1++ , htmlcode = '') {
                                   console.log("1")
var a2 = "window.localStorage.setItem('user'," + response.result[counter1].who_is_followed+ ")";
 var r = "window.location.replace('/profile/" + response.result[counter1].who_is_followed + "')";
                    htmlcode += '<div>'
                    // htmlcode+='<br/>'
                    htmlcode += '<div class="user-search">';
                   htmlcode += '<p ' + hoverr + '"' + hoverrout + '"' + ' style="font-size: 21px" class="username-result"  onclick="' + a2 + "," + r + '" id=' + '"c' + counter1 + '">' + "&nbsp&nbsp&nbsp&nbsp&nbsp" + response.result[counter1].who_is_followed + '</p>';
                
                 htmlcode+='<br/>'
                  
                       
                    htmlcode+='</div>'
                    
                    htmlcode += '</div>'
                      htmlcode+='<hr/>'
                    $(".modal-content-following").append(htmlcode)
}
 $(".modal-following").fadeIn();   

            });

            })
                           $(".follower").click(function(){
                                 $(".modal-content-follower").html("")
                               var html=''
                               
                              html+= '  <h3 class="texx_follower">Follower!</h3>'
                        html+='<hr></hr>'
                 
                        
                          $(".modal-content-follower").append(html)
                            var settings = {
                "url": "http://127.0.0.1:8000/user/relations/followers/?user="+username+"",
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
                   var hoverout = 'onMouseOut="this.style.color=';
                        var hoverrout = hoverout + "'white'";

                        var hover = 'onMouseOver="this.style.color=';
                        var hoverr = hover + "'red'";
                var htmlcode=''
                console.log(response);
                               for (var counter1 = 0; counter1 < response.result.length; counter1++ , htmlcode = '') {
                                   console.log("1")
var a2 = "window.localStorage.setItem('user'," + response.result[counter1].who_follows+ ")";
 var r = "window.location.replace('/profile/" + response.result[counter1].who_follows + "')";
                    htmlcode += '<div>'
                    // htmlcode+='<br/>'
                    htmlcode += '<div class="user-search">';
                   htmlcode += '<p ' + hoverr + '"' + hoverrout + '"' + ' style="font-size: 21px" class="username-result"  onclick="' + a2 + "," + r + '" id=' + '"c' + counter1 + '">' + "&nbsp&nbsp&nbsp&nbsp&nbsp" + response.result[counter1].who_follows + '</p>';
                
                 htmlcode+='<br/>'
                  
                       
                    htmlcode+='</div>'
                    
                    htmlcode += '</div>'
                      htmlcode+='<hr/>'
                    $(".modal-content-follower").append(htmlcode)
}
 $(".modal-follower").fadeIn();   

            });

            })
            $(".modal-following").click(function () {
                $(".modal-following").fadeOut();
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

                    htmlcode += '<div>'
                    htmlcode += '<div class="admin_gp"></div>';

                    htmlcode += '<p class="id_group">' + mygroups[counter1].id + '</p>'
                    htmlcode += '</div>'
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
                        htmlcode2 += '<div>'
                        htmlcode2 += '<div class="member_gp"></div>';

                        htmlcode2 += '<p class="id_group">' + groups[counter2].id + '</p>'
                        htmlcode2 += '</div>'


                        $('.group_prof').append(htmlcode2);
                        counter2++;
                        htmlcode2 = '';
                        console.log("1")
                    }
                    console.log("groups :" + groups);
                }, 500);


            });
    

            document.getElementById('right-button').onclick = function () {
                scrollLeft(document.getElementById('content'), 300, 1000);
                console.log("right")
            }
            document.getElementById('left-button').onclick = function () {
                scrollLeft(document.getElementById('content'), -300, 1000);
                console.log("left")
            }
            function scrollLeft(element, change, duration) {
                var start = element.scrollLeft,
                    currentTime = 0,
                    increment = 20;

                console.log(start)

                var animateScroll = function () {
                    currentTime += increment;
                    var val = Math.easeInOutQuad(currentTime, start, change, duration);
                    element.scrollLeft = val;
                    if (currentTime < duration) {
                        setTimeout(animateScroll, increment);
                    }
                };
                animateScroll();
            }

            //t = current time
            //b = start value
            //c = change in value
            //d = duration
            Math.easeInOutQuad = function (t, b, c, d) {
                t /= d / 2;
                if (t < 1) return c / 2 * t * t + b;
                t--;
                return -c / 2 * (t * (t - 2) - 1) + b;
            };
        })
    }

    render() {
        return (
            <div className="back_profile" >
                <div className="div-head-prof">
                      <div className="div_site_name">
                            <h1 className="site_name" style={{marginTop:'5px'}}>Vshare</h1>
                        </div>
                        <div className="div-inp-btn">
                        <input placeholder='search' className='inp-search'/>
                      
                        <div className="home-div">
                             <IconButton style={{
                                color: 'white'

                            }}className="home-btn"
                                        >
                                <HomeIcon  fontSize="large"/>
                            </IconButton>
                            </div>
                            <div className="back-prof"></div>
                        </div>
                         
                </div>
                <div className="photo" />
                <div className="username_prof" >USERNAME</div>
                <div className="edite_profile" id='edite-btn'>   Edite Profile</div>
                 <div className="follow-btn" id='f-btn'>   follow !</div>
                  <div className="unfollow-btn" id='uf-btn'>   unfollow</div>
                <div id="myModal" class="modal_edite_profile">
                    <div class="modal-content_edite_profile" >
                        <h3 class="texx_edite">Edit your profile deatails</h3>
                        <hr></hr>
                        <input class="inputedit" id='editfirstname' placeholder="FirstName"></input>
                        <input class="inputedit" id='editlastname' placeholder="LastName"></input>
                           <input class="inputedit" id='editusername' placeholder="UserName"></input>
                              <input class="inputedit" id='editemail' placeholder="PassWord"></input>
                                 <input class="inputedit" id='editpassword' placeholder="Email"></input>
                        <br></br>
                        <button style={{
                            backgroundColor: "Red",
                            marginTop: "20px"
                        }} size='large' className="submitedit" variant="contained" color="secondary">
                            <p>Edit</p>
                        </button>

                    </div>

                </div>
                               <div id="myModal-follower" class="modal-follower">
                    <div class="modal-content-follower" >
                   
                

                    </div>

                </div>
                                           <div id="myModal-following" class="modal-following">
                    <div class="modal-content-following" >
                    
                

                    </div>

                </div>
                <div className="follower_count">0</div>
                <div className="follower">follower</div>
                <div className="following_count">0</div>
                <div className="following">following</div>

<div className="search-result" id='res'></div>

                <img id="left-button" className="left_div" src={Left} />
                       
  
                
                <div className="group_prof" id="content">

                </div>

                <img id="right-button" class="right_div" src={Right} />
                     
                    

            </div>
        )
    }
}
export default profile;

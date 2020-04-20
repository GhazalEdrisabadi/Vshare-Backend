import React, {Component} from 'react'
import './Homepage.css'
import AddIcon from '@material-ui/icons/Add';
import $ from 'jquery';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import IconButton from '@material-ui/core/IconButton';
import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Button from '@material-ui/core/Button';

const name = window.$name;

class Homepage extends Component {

    componentDidMount() {
        const {id} = this.props.match.params;
        $(document).ready(function () {
            $('.nextbtn').click(function () {
                var id = $(".input1").val();
                
                var name = $(".input2").val();
                var bio = $(".textarea").val();

                var mem = [];
                var token = window.localStorage.getItem('token');

                

                var settings = {
                    "url": "http://localhost:8000/groups/",
                    "method": "POST",
                    "timeout": 0,
                    error: function (event) {
                        if (event.status == 400)
                            alert("group with this groupid already exists");
                    },
                    success: function () {
                      //  document.getElementById("myModel").style.display = 'block'
                                    $('.formback-content').fadeOut(); 
                                    $('.addmember-content').fadeIn();

                        window.localStorage.setItem('id_group', id);
                        
                        alert("done");
                    },
                    "headers": {
                        
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
                            "members": mem

                        }
                   ),

                }
                $.ajax(settings).done(function (response) {
                    console.log(response);
                });
            });
            $(".addbtn").click(function () {
                var member = $(".inp").val();

                var token = window.localStorage.getItem('token');
                var id_gp = window.localStorage.getItem('id_group')
                

                var settings = {
                    "url": "http://127.0.0.1:8000/user/" + member + "",
                    "method": "GET",
                    "timeout": 0,
                    error: function (event) {
                        
                      
                        $('#Addmember-Status').html('User not found !');
                        $('#Addmember-Status').fadeIn();
                    //    $('#Addmember-Status').delay(16000).toggle('slow');
                        

                    },
                    success: function () {
                        $('#Addmember-Status').fadeOut();
                     
                        var settings = {
                            "url": "http://127.0.0.1:8000/group/add_member/",
                            "method": "POST",
                            error: function () {
                                
                                    $('#Addmember-Status').html('User is already a member of this group !');
                                    $('#Addmember-Status').fadeIn();
                                    

                                //    $('#Addmember-Status').delay(3000).toggle('slow');
                                 
                            },
                            success: function () {
                                $('#Addmember-Status').fadeOut(); 
                                $(".textarea-addmember").append(member+'-');
                            },
                            "timeout": 0,
                            "headers": {
                                
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
                        
                        "accept": "application/json",
                        "Access-Control-Allow-Origin": "*",
                        "Access-Control-Allow-Headers": "*",
                        "Content-Type": "application/json"
                    },
                   
                };
                
                $.ajax(settings).done(function (response) {
                    // 
                    console.log(response);
                    
                });

            });


            $(".skipbtn").click(function () {
                window.location.replace("/homepage");

            });


            $(".createnewgp").click(function () {
                
                $('.formback').fadeIn();

            });


            






        

            if (localStorage.getItem('token') == null) {
                alert("Login please !");
                window.location.replace("/startpage/");
            }
            $(".zare").click(function () {
                var id = $(".input").val();
                console.log("aaaa" + id);

                var token = window.localStorage.getItem('token');
                console.log(token);

                var settings = {
                    "url": "http://127.0.0.1:8000/group/join/",
                    "method": "POST",
                    "timeout": 0,
                    error: function (event) {
                        if (event.status == 500) {
                            $('#joinstatus').html('You are already a member of this group !');
                            $('#joinstatus').toggle('slow');
                           $('#joinstatus').delay(3000).toggle('slow');
                        } else {
                             $('#joinstatus').html('Group not found !');
                            $('#joinstatus').toggle('slow');
                           $('#joinstatus').delay(3000).toggle('slow');
                        }
                    },
                    success: function () {
                        window.localStorage.setItem('id_gp', id);
                        window.location.replace("/group/" + id + "");
                    },
                    "headers": {
                        //'X-CSRFToken': csrftoken,
                        "Authorization": "token " + token,
                        "accept": "application/json",
                        "Access-Control-Allow-Origin": "*",
                        "Access-Control-Allow-Headers": "*",
                        "Content-Type": "application/json"
                    },
                    "data": JSON.stringify({
                            "the_group": id,
                            "the_member": "",
                        }
                    ),
                };
                console.log(settings.headers);
                console.log(settings.method);
                $.ajax(settings).done(function (response) {
                    console.log("done")
                    console.log(response);
                    console.log(response.status);
                });
            });


            window.localStorage.removeItem('numbergp1');



            console.log("aa");


            var token = window.localStorage.getItem('token');
            var username = window.localStorage.getItem('username');
            $('.groupsShow').append('<h4> Your Groups </h4>');
            
            $('.groupsShow').append("<hr>");
            $('.username').text(username);
            $(".logout").click(function () {
                window.localStorage.clear();
                window.location.replace("/startpage/");
            });

            $(".userprofile").click(function () {
                alert("im just a MVP version :)");
            });


            var groups = [];
            var mygroups = [];


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
                    mygroups.push({name: response[counter].title, id: response[counter].groupid});


                var htmlcode = '';
                for (var counter1 = 0; counter1 < mygroups.length; counter1++, htmlcode = '') {

                    
                    var s = "document.getElementById('myModal')";
                    var ss = s + ".style.display = 'block'";
                    var a = "window.localStorage.setItem('numbergp1','" + mygroups[counter1].id + "')";
                    //  console.log("mygroupssss" + mygroups[counter1].id);
                    var d = "document.getElementById('myModal2')";
                    var dd = d + ".style.display = 'block'";
                    
                    htmlcode += '</br>';
                    htmlcode += '<div class="admin"></div>';
                    htmlcode += '<p   style="font-size: 21px" class="mygroups" id=' + '"c' + counter1 + '">' + "&nbsp" + mygroups[counter1].name + '</p>';


                    htmlcode += '<div class="buttonsforgp">';

                    htmlcode += '<div  onclick="' + a + "," + dd + '" class="leave"  style={{ width:45px , height:45px}} ></div>';
                    htmlcode += '<div  onclick="' + a + "," + ss + '" class="edit"></div>';
                    htmlcode += '</div>';
                    htmlcode += '</br>';
                    $('.groupsShow').append(htmlcode);

                }

            });

            var localresponse;
            $('.modal2').mouseover(function () {
                var gpid = window.localStorage.getItem("numbergp1");
                console.log(gpid);

                var settings = {
                    "url": "http://127.0.0.1:8000/groups/" + gpid + "/",
                    "method": "GET",
                    "timeout": 0,
                    "Content-Type": "application/json",

                };

                $.ajax(settings).done(function (response) {
                    
                    localresponse = response;
                    var obj = $('.deleteTEXT').text("Are you sure  you want to leave \n The  " + response.title + "  ? ");
                    obj.html(obj.html().replace(/\n/g, '<br/>'));
                      if (localresponse.created_by == window.localStorage.getItem('username')) {
$('.admintext').text("You are the admin of this group , if you leave , it will be deleted");
                      }
                      else
                          $('.admintext').text("");


                });


            });


            $('.dltyes').click(function () {
                var gpid = window.localStorage.getItem("numbergp1");
                if (localresponse.created_by == window.localStorage.getItem('username')) {
                    var settings = {
                        "url": "http://127.0.0.1:8000/groups/" + gpid + "/",
                        "method": "DELETE",
                        "timeout": 0,
                        "headers": {
                            "Authorization": "Token " + token
                        },
                        success: function () {

                            window.location.replace('/homepage/');
                        },
                        error: function () {
                            alert('something went wrong');
                        },
                        "processData": false,
                        "mimeType": "multipart/form-data",
                        "contentType": false,

                    };

                    $.ajax(settings).done(function (response) {
                        console.log(response);
                    });
                } else {
                    var settings = {
                        "url": "http://127.0.0.1:8000/group/" + gpid + "/leave/",
                        "method": "DELETE",
                        "timeout": 0,
                        "headers": {
                            "Authorization": "Token " + token
                        },
                        success: function () {

                            window.location.replace('/homepage/');
                        },
                        error: function () {
                            alert('something went wrong');
                        },
                        "processData": false,
                        "mimeType": "multipart/form-data",
                        "contentType": false,

                    };

                    $.ajax(settings).done(function (response) {
                        console.log(response);
                    });
                }
            });


            $('.dltno').click(function () {
                $('.modal2').fadeOut('slow');
            });

            $('.modal').mouseover(function () {
                var gpid = window.localStorage.getItem("numbergp1");

                var settings = {
                    "url": "http://127.0.0.1:8000/groups/" + gpid,
                    "method": "GET",
                    "timeout": 0,
                    "Content-Type": "application/json",

                };
               
                $.ajax(settings).done(function (response) {
                    $('.texx').text("Edit " + response.title + " details");
                });


            });

            console.log("shomarash : " + window.localStorage.getItem('numbergp1'));
            $('.submitedit').click(function () {

                var gpid = window.localStorage.getItem("numbergp1");
                var title = $('#edittitle').val();
                var des = $('#editdes').val();
                console.log("AAAAAA  " + gpid);
                var form = new FormData();

                if (title != "")
                    form.append("title", title);
                if (des != '')
                    form.append("describtion", des);
                

                var settings = {
                    "url": "http://127.0.0.1:8000/groups/" + gpid + "/",
                    "method": "PUT",
                    "timeout": 0,
                    "headers": {
                        "Authorization": "Token " + token
                    },
                    success: function () {

                        window.location.replace("/homepage/");
                    },
                    error: function (event) {
                        if (event.status == 400)
                            alert("group with this groupid already exists.");
                        else
                            alert("something went wrong");
                    },
                    "processData": false,
                    "mimeType": "multipart/form-data",
                    "contentType": false,
                    "data": form
                };

                $.ajax(settings).done(function (response) {
                    console.log(response);
                });

            })

            window.onclick = function (event) {
                if (event.target == document.getElementById("myModal")) {
                    $('.modal').fadeOut("slow");
                    
                }
                if (event.target == document.getElementById("myModal2")) {
                    $('.modal2').fadeOut("slow");
                    
                }
            }

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
                        console.log(response2);
                        groups.push({name: response2.title, id: response2.groupid});
                        
                    });

                    


                }


                setTimeout(function () {
                    console.log(groups[1]);
                    var counter2 = 0;
                    var htmlcode2 = '';
                    while (counter2 < groups.length) {
                        var a2 = "window.localStorage.setItem('numbergp1','" + groups[counter2].id + "')";
                        var d2 = "document.getElementById('myModal2')";
                        var dd2 = d2 + ".style.display = 'block'";
                        htmlcode2 += '</br>';
                        htmlcode2 += '<p  style="font-size: 21px" class="mygroups" id=' + '"c2' + counter2 + '">' + "&nbsp&nbsp&nbsp&nbsp&nbsp" + groups[counter2].name + '</p>';
                        htmlcode2 += '<div class="buttonsforgp">';

                        htmlcode2 += '<div onclick="' + a2 + "," + dd2 + '" class="leave" ></div>';

                        htmlcode2 += '</div>';
                        htmlcode2 += '</br>';

                        $('.groupsShow').append(htmlcode2);
                        counter2++;
                        htmlcode2 = '';
                    }
                    console.log("groups :" + groups);
                }, 500);


            });


        });


        $(document).ready(function () {

            console.log(window.localStorage.getItem('token'));

        })
    };

    




    constructor(props) {

        super(props);


        this.states = {

            // anchorPosition:null ,
            value: ''
            

        }

        this.handleChange = this.handleChange.bind(this);

        this.handleSubmit = this.handleSubmit.bind(this);

    }

    handleChange(event) {


        this.setState({value: event.target.value});


    }

    handleSubmit(event) {


        alert('A name was submitted: ' + this.state.value);


        event.preventDefault();

    }

    state = {

        sidedraweropen: false

    };


    drawertoggleclickhandler = () => {

        this.setState((prevState) => {


            return {sidedraweropen: !prevState.sidedraweropen}


        });

    };

    
      
    
    
    backdropclickhandeler = () => {

        this.setState({sidedraweropen: false})

    };
    


    render() {
        


        return (


            <div class="Homepage">


                <div id="myModal" class="modal">
                    <div class="modal-content">
                        <h3 class="texx">Edit your groups deatails</h3>

                        <hr></hr>

                        <input class="inputedit" id='edittitle' placeholder="Title"></input>


                        <input class="inputedit" id='editdes' placeholder="Description"></input>
                        <br></br>

                        <Button style={{
                            backgroundColor: "Red",
                            marginTop: "20px"
                        }} size='large' className="submitedit" variant="contained" color="secondary">
                            <p>Edit</p>
                        </Button>

                    </div>

                </div>

                <div id="myModal2" className="modal2">
                    <div className="modal-content2">
                        <h3 className='deleteTEXT'>Are you sure you want to leave this group ? </h3>
                        <p className='admintext'></p>
                        <div className='dltbtns'>

                            <Button style={{backgroundColor: "Red"}} size='large'
                                    className="dltno" variant="contained" color="secondary">
                                <p>No&nbsp;</p>
                            </Button>

                            <Button style={{
                                backgroundColor: 'gray',
                                marginRight: "4px"

                            }} size='large' className="dltyes" variant="contained" color="secondary">
                                <p>Yes</p>
                            </Button>

                        </div>
                        {/* <div className='dltno'>no</div> */}
                    </div>
                </div>


                <header className="head">

                    <div className='leftheader'>
                        <div className='userprofile'>
                            <IconButton style={{
                                color: 'white'

                            }}
                                        className="profilepic">
                                <AccountCircleOutlinedIcon fontSize="large"/>
                            </IconButton>

                            <p className='username'>Username</p>
                        </div>

                        <div className='searchgp'>


                            <input placeholder='Enter id of the group' className='input'/>

                            <Button style={{
                                marginTop: "10px",
                                backgroundColor: "Red"
                            }} startIcon={<GroupAddIcon/>} className="zare" variant="contained" color="secondary">
                                join
                            </Button>
                            <div id='joinstatus' className='statusofjoin'>
                                Group not found !
                            </div>
                        </div>


                    </div>
                    <div className='logout'>
                        <p className='logout_text'>Logout</p>
                        <IconButton style={{
                            color: 'white'
                        }}
                                    className="div_leave">
                            <ExitToAppIcon fontSize="large"/>
                        </IconButton>
                    </div>
                </header>



                
                    <div className="formback">
                        <div className="formback-content">
                    <h4 className="textForm">create new group</h4>
                    <hr></hr>
                    <input onChange={this.change_name} type="text"

                           className="input1" placeholder="name" style={{
                        height: '40px',
                        width: '65%',
                    }}/>

                    <br></br>
                    
                    <br></br>
                    <input onChange={this.change_id} type="text"
                           className="input2" placeholder="id" style={{
                        height: '40px',
                        width: '65%'
                    }}/>
                    <br></br>

                    <textarea onChange={this.change_bio} type="text"
                              className="textarea" placeholder=" bio" style={{
                        height: '60px',
                        width: '65%',
                        marginTop:'8%'
                        
                        
                    }}/>

                        <Button style={{
                        backgroundColor: "Red",
                        marginRight:"45%" ,
                        marginTop: "30%",
                        marginLeft:"42%"
                        }} className='nextbtn' variant="contained" color="secondary">
                        next
                        </Button>
                        </div>

                        <div className="addmember-content">
                        <p classname='tit' style={{fontSize:"100%" , marginBottom:"8%" , marginTop:"8%" ,}}>Add your member</p>
                        <hr></hr>

                            <input class='inp' placeholder=" enter your user's id"></input>
                            <div className = "textarea-addmember" style={{border:"solid" , borderRadius:"10px" , borderColor:"rgb(51, 51, 51)" ,marginTop:"10%", marginBottom:"5%" , backgroundColor: "rgb(51, 51, 51) "  }}></div>
                            <div className = "Status-Addmember" id = "Addmember-Status"></div>
                            <div class="center">

                            <Button style={{marginTop:"5%" , backgroundColor: "Red"}} size='large'
                                    className="addbtn" variant="contained" color="secondary">
                                <p>Add&nbsp;</p>
                            </Button>

                            <Button style={{
                                marginTop:"5%",
                                backgroundColor: 'gray',
                                marginRight: "7px"

                            }} size='large' className="skipbtn" variant="contained" color="secondary">
                                <p>Skip</p>
                            </Button>


                               
                            </div>
                        </div>
                    {/* <div id="myModel" className="modal2">
                        <div id="mymodal2" class="modal-content2">
                            <p class='tit'>Add your member</p>
                            <input class='inp' placeholder=" enter your user's id"></input>
                            <div class="center">
                                <div class='addbtn'>Add</div>
                                <div class='skipbtn'>Skip</div>
                            </div>

                        </div>
                    </div> */}


                    </div>


                    <div className="groupsShow">
                        
                       
                    <Button style={{
                        backgroundColor: "Red",
                        marginRight: "10px",
                        marginTop: "20px"
                    }} className='createnewgp' startIcon={<AddIcon/>} variant="contained" color="secondary">

                        Create new group
                    </Button>

                    </div>
                


            </div>
            


        )

    }


}

export default Homepage
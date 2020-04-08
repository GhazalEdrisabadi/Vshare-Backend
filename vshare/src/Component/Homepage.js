import React, { Component } from 'react'
import './Homepage.css'
import Fontawesome from 'react-fontawesome'
import Navbar from '../navbar/navbar'
import Sidedrawer from '../SideDrawe/Sidedrawer'
import { BrowserRouter, Route } from 'react-router-dom'
import Backdrop from '../Backdrop/Backdrop'
import Create from '../create_room/create_room'
import Plus from '../pngguru.com.png'
import zare from '../zare.png'
import $ from 'jquery';
import jQuery from 'jquery'

class Homepage extends Component {

    componentDidMount(){
        $(document).ready(function () {
            if (localStorage.getItem('token') == null) {
                alert("Login please !");
                window.location.replace("/login/");
            }
            console.log("aa");
            var token=window.localStorage.getItem('token');
            var username=window.localStorage.getItem('username');
            $('.groupsShow').append('<h4> Your Groups </h4>');
            $('.groupsShow').append("<h5> User: "+username+"</h5>");
            $('.groupsShow').append("<hr>");
            
            $(".logout").click(function () {
                window.localStorage.clear();
                window.location.replace("/login/");
            });
                var groups=[];
                var mygroups=[];

 
                var settings = {
                    "url": "http://127.0.0.1:8000/group/owned_groups/",
                    "method": "GET",
                    "timeout": 0,
                    "headers": {
                      "Authorization": "Token "+token
                    },
                  };
                  
                  $.ajax(settings).done(function (response) {
                    console.log(response);
                    for(var counter=0;counter<response.length;counter++)
                    mygroups.push(response[counter].title);
   
                    console.log("mygroups :"+mygroups);
                    var counter1=0;
                    var htmlcode='';
                    while(counter1<mygroups.length){
                               
                                var s="document.getElementById('close"+counter1+"')";
                                var ss=s+".remove()";
                                var a="document.getElementById('c"+counter1+"')";
                                var aa=a+".remove()";
                            
                                var d="document.getElementById('h"+counter1+"')";
                                var dd=d+".remove()";
                            
                                htmlcode += '<p class="mygroups" id=' + '"c' + counter1 + '">' + mygroups[counter1]+'</p>'+'<span onclick="'+ss+','+aa+','+dd+'"class="closes" id="close' + counter1 + '">&times;</span>';
                           
                                
                                htmlcode += '<hr class="line" id=' + '"h' + counter1 + '">';
                                $('.groupsShow').append(htmlcode);
                                counter1++;
                    }
                    
                  });



            var settings = {
                "url": "http://127.0.0.1:8000/group/joined_groups/",
                "method": "GET",
                "timeout": 0,
                "headers": {
                    "Authorization": "Token "+token
                },
              };
              
              $.ajax(settings).done(function (response) {
                console.log(response);
                for(var counter=0;counter<response.length;counter++)
                 groups.push(response[counter].the_group);

                 console.log("groups :"+groups);
                                 
                 var counter1=0;
                 var htmlcode='';
                 while(counter1<groups.length){
                             
                             var s="document.getElementById('close2"+counter1+"')";
                             var ss=s+".remove()";
                             var a="document.getElementById('c2"+counter1+"')";
                             var aa=a+".remove()";
                         
                             var d="document.getElementById('h2"+counter1+"')";
                             var dd=d+".remove()";
                         
                             htmlcode += '<p class="pp" id=' + '"c2' + counter1 + '">' + groups[counter1]+'</p>'+'<span onclick="'+ss+','+aa+','+dd+'"class="closes" id="close2' + counter1 + '">&times;</span>';
                         
                             
                             htmlcode += '<hr class="line" id=' + '"h2' + counter1 + '">';
                             $('.groupsShow').append(htmlcode);
                             counter1++;
                 }
                 
              });

           
        });
    }

    constructor(props) {
        super(props);
        this.states ={
            value: ''
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleChange(event) {
        this.setState({ value: event.target.value });
        
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
            return { sidedraweropen: !prevState.sidedraweropen }
            
        });
    };
    backdropclickhandeler = () => {
        this.setState({ sidedraweropen: false })
    }
    render() {
        let sidedrawer;
        let backdrop;
        if (this.state.sidedraweropen) {
            sidedrawer = <Sidedrawer />;
            backdrop = <Backdrop click={this.backdropclickhandeler} />;
        }
        return (
            <div className="Homepage">
                 <button className="logout">logout</button>
              
                <Navbar drawerClickHandeler={this.drawertoggleclickhandler} />
                {sidedrawer}
                {backdrop}
                <div style={{ alignContent:"center" }}>
                <img style={{ width: '30px', height: '27px' }} src={zare} className="zare" onClick={this.handleSubmit} />
                <input value={this.state.value} onChange={this.handleChange} type="text"
                        className="zare" />
                </div>
                <div className="groupsShow">
                    </div>
                <div><a href="/create"><img src={Plus} className="create" /></a></div>
             
            </div>
       
        
        )
    }

}
export default Homepage
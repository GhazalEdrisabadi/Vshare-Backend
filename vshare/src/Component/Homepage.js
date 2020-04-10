import React, { Component } from 'react'
import './Homepage.css'
import Fontawesome from 'react-fontawesome'
import Navbar from '../navbar/navbar'
import Sidedrawer from '../SideDrawe/Sidedrawer'
import { BrowserRouter, Route } from 'react-router-dom'
import Backdrop from '../Backdrop/Backdrop'
import Create from '../create_room/create_room'
import Plus from './plus.png'
import zare from '../zare.png'
import $ from 'jquery';
import jQuery from 'jquery'
import Leave from './leave.png'
import Home from './home_.png'
class Homepage extends Component {

    componentDidMount(){
        $(document).ready(function () {
            // if (localStorage.getItem('token') == null) {
            //     alert("Login please !");
            //     window.location.replace("/login/");
            // }
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
                {/* <button className="logout">logout</button>  */}

                <header className="head">
                    <div className="zare"> join</div>
                    <input   type="text"
                        className="input" />
                    
                </header>
               

                <div style={{ alignContent:"center" }}>
               
             
                    
                </div>
                <div><a href="/create"><img src={Plus} className="create" /></a></div>
                <div className="groupsShow">
                    </div>

                <div id="mySidenav" className="sidenav">
                     <div className="div_home" ><a href="/homepage"><img src={Home} className="home" /></a></div>
                    <div className="div_leave" ><a href="/login"><img src={Leave} className="leave" /></a></div>
                   
                </div>
             
            </div>
       
        
        )
    }

}
export default Homepage
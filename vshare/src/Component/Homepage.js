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
            //$(".zare").click(function () {
            //    var id = $(".input_input").val();;

            //    //console.log(id + " " + name + " " + bio);
            //    //console.log(csrftoken)
            //    var token = window.localStorage.getItem('token');
            //    console.log(token);

            //    var settings = {
            //        "url": "http://127.0.0.1:8000/group/join/",
            //        "method": "POST",
            //        "timeout": 0,
            //        error: function () {
            //            console.log("noooooooo");
            //        },
            //        success: function () {
            //            console.log("yeeeeeees");
            //        },
            //        "headers": {
            //            'X-CSRFToken': csrftoken,
            //            "Authorization": "token " + token,
            //            "accept": "application/json",
            //            "Access-Control-Allow-Origin": "*",
            //            "Access-Control-Allow-Headers": "*",
            //            "Content-Type": "application/json"
            //        },
            //        "data": JSON.stringify({
            //            "the_group":id
            //        }
            //        ),
            //    };
            //    console.log(settings.headers);
            //    console.log(settings.method);
            //    $.ajax(settings).done(function (response) {
            //        console.log(response);
            //        console.log(response.status);
            //        console.log("1");
            //        //if (response.status === 404) {
            //        //    console.log("no");
            //        //}
            //        //if (response.status===200) {
            //        //    console.log("yes");
            //        //}
            //        //if (response.o)
            //        //  console.log(responseDisplay);
            //        // console.log(response.status.);
            //    });


            //    //    window.location.replace("/account/menu/");
            //    // Window.location="/account/menu/"

            //});
        });

    };







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
            <div className="Homepage"
            >
                <Navbar drawerClickHandeler={this.drawertoggleclickhandler} />
                {sidedrawer}
                {backdrop}
                <div style={{ alignContent:"center" }}>
                <img style={{ width: '30px', height: '27px' }} src={zare} className="zare" onClick={this.handleSubmit} />
                <input value={this.state.value} type="text"
                        className="input_input" />
                </div>
                <div><a href="/create"><img src={Plus} className="create" /></a></div>
             
            </div>
       
        
        )
    }

}
export default Homepage











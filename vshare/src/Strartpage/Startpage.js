import React, { Component } from 'react'
import './Startpage.css'
import "react-responsive-carousel/lib/styles/carousel.min.css";

import { Carousel } from 'react-responsive-carousel';
import AwesomeSlider from 'react-awesome-slider'
import 'react-awesome-slider/dist/styles.css';
import ReactDOM from 'react-dom';
class startpage extends Component {
    
    render() {

        return (

            <div className="back_startpage">
                <div className="Main_div">
                <header className="page-header" >

                        <div className="div_header_start" style={{ overflow:"hidden" }}>
                        <div className="div_site_name">
                            <h1 className="site_name">Vshare</h1>
                        </div>
                        <div className="button_header">
                            <button className="btn_about" type="link" ghost><a href="./about">
                                about</a>
                            </button>
                            <button className="btn_contact" type="link" ghost><a href="./contact">
                                contact
</a>        
                            </button>
                            <button className="btn_app" type="link" ghost><a href="./app">
                                Application
</a>        
    </button>
                        <button className="btn_login-singup" type="link" ghost>
                            login/signup
    </button>
                        </div>
                    </div>
                    </header>
                    <div className="txt_explain">
                        <div>
                        Vshare is a web-base service which allows you to watch a video file with other users
                                                                at the same time.
                                                                You can talk through the movie with each other
                            </div>
                        <button className="btn_start"><a href="./login">Get Start</a></button>
                    </div>
          
                    </div>
                
                </div>
            
            )

    }
}
export default startpage;
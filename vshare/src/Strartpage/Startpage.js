import React, { Component } from 'react'
import './Startpage.css'

import 'bootstrap/dist/css/bootstrap.min.css';
import AwesomeSlider from 'react-awesome-slider'
import 'react-awesome-slider/dist/styles.css';
import ReactDOM from 'react-dom';
import { border } from '@material-ui/system';
class startpage extends Component {

    render() {

        return (

            <div className="back_startpage">
                <div className="Main_div">
                    <header className="page-header " >

                        <div className="div_header_start " style={{ overflow: "hidden" }}>
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
                                    <a href="../login">  login/signup</a>
                                </button>
                            </div>
                        </div>
                    </header>
                    <div className="container-lg cont" style={{ backgroundColor: "transparent" }}>
                        <div className="row">
                            <div className="txt-container col-sm-12 col-lg-12 col-xl-12 col-md-12">
                                <div className="txt-content" style={{ display: "block" }}>
                                    Vshare is a web-base service which allows you to watch a video file with other users
                                                                            at the same time.
                                                                            You can talk through the movie with each other
                                    </div>
                                <button className="btn_start"><a href="../login">Get Start</a></button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

        )

    }
}
export default startpage;
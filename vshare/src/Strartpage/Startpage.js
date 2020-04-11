import React, { Component } from 'react'
import './Startpage.css'
import AwesomeSlider from 'react-awesome-slider'
import 'react-awesome-slider/dist/styles.css';
import Home from './homepage.png'
class startpage extends Component {
    render() {
        return (
            <div className="start">
                <header className="head_first">
                    <div className="div_head">
                        <div className="btn_login"><a href='./login'> login/signup</a></div>
                        <div className="contact"><a href='./contact'>Contact</a></div>
                        <div className="app"><a href='./application'>Application</a></div>
                        <div className="btn_about"><a href='./about'>About</a></div>
                    </div>
                </header>
                <div className="body_start" >
                    <p className="welcome">Welcome to Vshare</p>
                    <div className="text">
                        <p className="txt">We are here</p>
                        <p className="txt">  </p>
                        <p className="txt">to mak your life</p>
                        <p className="txt">  </p>
                        <p className="txt">more instresting</p>
                    </div>
                <AwesomeSlider style={{ height: "500px", width: "500px" , top:"20px" , left:"1%" }}>
                    <div>1</div>
                    <div ><img src={Home} style={{ height: "700px", width:"900px" }} /></div>
                    <div>3</div>
                    <div>4</div>
                    </AwesomeSlider>
                </div>
            </div>
            )
    }
}
export default startpage;
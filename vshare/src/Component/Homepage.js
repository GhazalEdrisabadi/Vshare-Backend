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
class Homepage extends Component {

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
                <input value={this.state.value} onChange={this.handleChange} type="text"
                        className="zare" />
                </div>
                <div><a href="/create"><img src={Plus} className="create" /></a></div>
             
            </div>
       
        
        )
    }

}
export default Homepage
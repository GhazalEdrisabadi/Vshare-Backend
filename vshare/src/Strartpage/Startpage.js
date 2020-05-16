import React, { Component } from 'react'

import 'bootstrap/dist/css/bootstrap.min.css'
import './Startpage.css'
import { Navbar , Nav} from 'react-bootstrap';

class startpage extends Component {

    render() {

        return (

            <div className="back_startpage">
                <div className="Main_div">
                  <Navbar collapseOnSelect expand="lg"  style={{backgroundColor:'transparent' }}>
  <Navbar.Brand href="#home" style={{color:'white' , fontSize:'35px' , fontWeight:'bold'}}>Vshare</Navbar.Brand>
  <Navbar.Toggle aria-controls="responsive-navbar-nav " style={{backgroundColor:'transparent' , color:'white'}}  variant="white"/>
  <Navbar.Collapse id="responsive-navbar-nav">
    <Nav className="mr-auto">
  
    </Nav>
    <Nav>
      <Nav.Link href="/about" style={{color:'white' , fontSize:'20px' , paddingRight:'100px'  , fontWeight:'bold'}}>about</Nav.Link>
      <Nav.Link eventKey={2} href="#memes" style={{color:'white' , fontSize:'20px' , paddingRight:'100px' , fontWeight:'bold'}}>
       contact
      </Nav.Link>
       <Nav.Link href="#deets" style={{color:'white' , fontSize:'20px' , paddingRight:'100px' , fontWeight:'bold'}}>Application</Nav.Link>
      <Nav.Link eventKey={2} href="#memes" style={{color:'white' , fontSize:'20px'  , fontWeight:'bold'}}>
       login/signup
      </Nav.Link>
    </Nav>
  </Navbar.Collapse>
</Navbar>
                    
                    <div className="container-lg" style={{ backgroundColor: "transparent" , marginTop:'150px' }}>
                        <div className="row">
                            <div className="txt-container col-sm-12 col-lg-12 col-xl-12 col-md-12">
                                <div className="txt-content" style={{ display: "block" }}>
                                    Vshare is a web-base service which allows you to watch a video file with other users
                                                                            at the same time.
                                                                            You can talk through the movie with each other
                                    </div>
                                <button className="btn_start"><a href="../login"style={{color:'black'}}>Get Start</a></button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

        )

    }
}
export default startpage;
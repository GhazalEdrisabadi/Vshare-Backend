import React, { Component } from 'react'
import './About.css'
import Kamyab from './kamyab.jpg'
import Poria from './poria.jpg'
import Ghazal from './ghazal.jpg'
import Mobin from './mobin.jpg'
import Amin from './AMIN.jpg'

class About extends Component {
  render() {
    return (
      <div className="about">
        <div className='row'style={{display:'flex',justifyContent:'center',alignItems:'flex',textAlign:"center", paddingTop:'30px', borderBottomColor:'red', borderBottomStyle:'solid'}}>
          <div className='col'>
            <h1 >About Us</h1>
          </div>
        </div>
        <div className='row' style={{display:'flex',justifyContent:'center',alignItems:'flex',textAlign:"center", paddingTop:'20px'}}>
          <div style={{width:'120px', height:'30px'}}>
          <a href='/' style={{fontSize:'13px', textAlign:'center'}}><div style={{borderColor:'red', borderStyle:'solid', paddingBottom:'7px', borderRadius:'15px'}} >Landing page</div></a>
          </div>
        </div>



        <div className='row query' style={{display:'flex',justifyContent:'center',alignItems:'flex',textAlign:"center", paddingTop:'50px'}}>
          <div className='  col-4 '>
            <div className='div_image' ><img src={Poria} className="poria" /></div>
            <div ><a  >پوریا پرهیزکار</a></div>
            <div ><a >frontend-Developer</a></div>
          </div>
          <div className='col-4 paddImg'>
            <div className='div_image'><img src={Kamyab} className="kamyab" /></div>
            <div ><a  >امیرحسین قاسمی</a></div>
            <div ><a >frontend-Developer</a></div>
          </div>
          <div className=' col-4 paddImg' >
            <div className='div_image'><img src={Mobin} className="mobin" /></div>
            <div ><a  >مبین شاه حیدری</a></div>
            <div ><a >frontend-Developer</a></div>
          </div>
        </div>

        <div className='row query pad'  style={{display:'flex',justifyContent:'center',alignItems:'flex',textAlign:"center", paddingTop:'130px'}}>
          <div className='  col-6 paddImg'>
            <div className='div_image'><img src={Ghazal} className="ghazal" /></div>
            <div ><a  >غزال ادریس آبادی</a></div>
            <div><a >backend-Developer</a></div>
          </div>
          <div className='col-6 paddImg'>
            <div className='div_image'><img src={Amin} className="amin" /></div>
            <div ><a  >امین شهیدی</a></div>
            <div ><a >backend-Developer</a></div>
          </div>
        </div>

      


      </div>


    )
  }
}
export default About;
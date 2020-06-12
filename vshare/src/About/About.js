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

                <h1 className="mem_team">About Us</h1>
              <div className='kolli_about'>
                <div className='homepagebtn'><a href='/'>Landing page</a></div>
                <div className="div_kamyab"><img src={Kamyab} className="kamyab" /></div>
                <div className="div_poria"><img src={Poria} className="poria" /></div>
                <div className="div_mobin"><img src={Mobin} className="mobin" /></div>
                <div className="div_ghazal"><img src={Ghazal} className="ghazal" /></div>
                <div className="div_amin"><img src={Amin}className="amin" /></div>
                <div className="name_poria"><a  >پوریا پرهیزکار</a></div>
                <div className="job_poria"><a >frontend-Developer</a></div>
                <div className="name_kamyab"><a  >امیرحسین قاسمی</a></div>
                <div className="job_kamyab"><a >frontend-Developer</a></div>
                <div className="name_mobin"><a  >مبین شاه حیدری</a></div>
                <div className="job_mobin"><a >frontend-Developer</a></div>
                <div className="name_ghazal"><a  >غزال ادریس آبادی</a></div>
                <div className="job_ghazal"><a >backend-Developer</a></div>
                <div className="name_amin"><a  >امین شهیدی</a></div>
                <div className="job_amin"><a >backend-Developer</a></div>
                  </div>
            </div>

            )
    }
}
export default About;
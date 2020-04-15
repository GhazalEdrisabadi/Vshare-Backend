import React from 'react'
import './navbar.css'
import SideToggleButton from '../SideDrawe/SideToggleButton'
const navbar = props => (
    <header className="navbar">

        <SideToggleButton click={props.drawerClickHandeler} />

    </header>
    );

export default navbar
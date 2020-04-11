import React from 'react'
import './SideToggleButton.css'
const sideToggleButton = props => (
    <button className="toggle-button" onClick={props.click}>
        <div className="toggle-button_line" />
        <div className="toggle-button_line" />
        <div className="toggle-button_line" />
    </button>
    
    );
export default sideToggleButton
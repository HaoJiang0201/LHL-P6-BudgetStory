import React, { Component } from 'react';
import '../App/styles/navbar.css'

class Navbar extends Component {
  constructor(props) {
    super()
  }

  ComponentDidMount() {
  }

  render() {
    return (
      <div className="navbar">
        <a className="menu_button" href="/track">
          <div className="menu_button_image" id="track_button"></div>
          Track
        </a>
        <a className="menu_button" href="/manage">
          <div className="menu_button_image" id="manage_button"></div>
          Manage
        </a>
        <p className="navbar-brand">Budget Story</p>
        <div className="right-space"></div>
      </div>
    )
  }
}
export default Navbar

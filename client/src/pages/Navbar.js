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
      <nav className="navbar">
        <div className="menu_button_area">
          <a className="menu_button" href="/">
            <div className="menu_button_image" id="home_button"></div>
            Home
          </a>
          <a className="menu_button" href="/compare">
            <div className="menu_button_image" id="compare_button"></div>
            Compare
          </a>
          <a className="menu_button" href="/manage">
            <div className="menu_button_image" id="manage_button"></div>
            Manage
          </a>
        </div>
        <p className="navbar-brand">Budget Story</p>
      </nav>
    )
  }
}
export default Navbar

import React, { Component } from 'react';
import axios from 'axios';
import NewRecord from './NewRecord'
import DateRange from './DateRange.js'
import '../App/styles/home.css'
import Navbar from './Navbar.js';

class Management extends Component {

  constructor(props) {
    super(props);
    this.state = {
      
    }
  }

  componentDidMount() {
  }

  render() {
   
    return (
      <div className="Management">
        <Navbar />
       
      </div>
    );
  }
}
export default Management;
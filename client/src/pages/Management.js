import React, { Component } from 'react';
import axios from 'axios';
import NewRecord from './NewRecord'
import DateRange from './DateRange.js'
import '../App/styles/management.css'
import 'bootstrap/dist/css/bootstrap.css';
import { Button, Badge, Modal, Form } from 'react-bootstrap';
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
      <div>
        {/* <Navbar/> */}
        <div className="ManagementPage">
          <div className="CategoryList">
            <div className="CategoryControlBar">
              <Button id="back_btn" variant="secondary" onClick={this.onItemClick}>
                {'<< Back'}
              </Button>
              <h5 className="category_title" variant="secondary">Category Name</h5>
              <Button id="new_category_btn" variant="info" onClick={this.handleShow}>
                new
              </Button>
            </div>
            <div className="CategoriesArea">
              Category List
            </div>
          </div>
          <div className="RecordList">
            <div className="RecordControlBar">
              <h5 className="record_title" variant="secondary">Record List</h5>
              <Button id="new_record_btn" variant="info" onClick={this.handleShow}>
                new
              </Button>
            </div>
            <div className="RecordsArea">
              Record List
            </div>
          </div>
        </div> 
      </div>
    );
  }
}
export default Management;
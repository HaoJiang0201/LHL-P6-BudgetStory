import React, { Component } from 'react';
import axios from 'axios';
import NewRecord from './NewRecord'
import DateRange from './DateRange.js'
import CategoryItem from './CategoryItem'
import '../App/styles/management.css'
import 'bootstrap/dist/css/bootstrap.css';
import { Button, Modal, Form } from 'react-bootstrap';
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
   
    let categoryList = (<CategoryItem />);
    let testArray = [];
    for(let i = 0; i < 20; i ++) {
      testArray.push(i);
    }
    categoryList = testArray.map((name, index) => (
      <CategoryItem key={index} name={name}/>
    ));
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
              <div className="category_item_list">
                {categoryList}
              </div>
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
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
      parentCategory: "Balance",
      parentID: 0,
      grantParentCategory: "",
      grandParentID: -1,
      categorySelect: 0,
      recordSelect: 0,
      subCategoryItems: [
        {
          id: 1,
          parent_id: 0,
          name: "Expenses"
        },
        {
          id: 2,
          parent_id: 0,
          name: "Incomes"
        }
      ]
    }
  }

  backButtonClick = () => {
    this.getSubCategories(this.state.grandParentID, this.state.grantParentCategory);
  }

  categorySelect = (id) => {
    this.setState({
      ...this.state,
      categorySelect: id
    });
  }

  categoryOpen = (id, name) => {
    this.getSubCategories(id, name);
  }

  getSubCategories = (parent_id, parent_name) => {
    const grantParentID = this.state.subCategoryItems[0].parent_id;
    const grantParentCategory = this.state.parentCategory;
    axios('/api/GetSubCategories', {
      params: {
        parent_id: parent_id
      }
    })
    .then(
      ({data}) => {
        this.setState({
          ...this.state,
          parentCategory: parent_name,
          parentID: parent_id,
          grantParentCategory: grantParentCategory,
          grandParentID: grantParentID,
          categorySelect: 0,
          recordSelect: 0,
          subCategoryItems: data.results
        });
      }
    ).catch(function (error) {
      console.log(error);
    });

  }

  componentDidMount() {
    this.getSubCategories(0, "Balance");
  }

  render() {

    const CategoryItems = (

      this.state.subCategoryItems.map(category => {

        if(category.id === this.state.categorySelect) {
          return (
            <CategoryItem 
              key={category.id}
              id={category.id} name={category.name}
              select={true}
              categorySelect={this.categorySelect.bind(this)}
              categoryOpen={this.categoryOpen.bind(this)}/>
          );
        } else {
          return (
            <CategoryItem
              key={category.id}
              id={category.id} name={category.name}
              select={false}
              categorySelect={this.categorySelect.bind(this)}
              categoryOpen={this.categoryOpen.bind(this)}/>
          );
        }                
      })
    );

    let BackButton = (
      <Button className="back_btn" variant="secondary" onClick={this.backButtonClick}>
        {'<< Back'}
      </Button>
    );

    if(this.state.parentID <= 0) {
      BackButton = (
        <div className="back_btn_empty"></div>
      );
    }

    return (
      <div>
        {/* <Navbar/> */}
        <div className="ManagementPage">
          <div className="CategoryList">
            <div className="CategoryControlBar">
              { BackButton  }
              <h5 className="category_title" variant="secondary">{this.state.parentCategory}</h5>
              <Button id="new_category_btn" variant="info" onClick={this.handleShow}>
                new
              </Button>
            </div>
            <div className="CategoriesArea">
              <div className="category_item_list">
                {CategoryItems}
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
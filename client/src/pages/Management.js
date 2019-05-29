import React, { Component } from 'react';
import axios from 'axios';
import NewRecord from './NewRecord'
import DateRange from './DateRange.js'
import CategoryItem from './CategoryItem'
import RecordItem from './RecordItem'
import '../App/styles/management.css'
import 'bootstrap/dist/css/bootstrap.css';
import { Image, Button, Modal, Form } from 'react-bootstrap';
import Navbar from './Navbar.js';

class Management extends Component {

  constructor(props) {
    super(props);
    this.state = {
      parentCategory: "Balance",
      parentID: 0,
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
      ],
      subRecordItems: [
        {
          id: 1,
          category_id: 0,
          value: 100,
          date: "2019-01-01",
          notes: "Record 1"
        },
        {
          id: 2,
          category_id: 0,
          value: 200,
          date: "2019-01-02",
          notes: "Record 2"
        }
      ]
    }
  }

  backButtonClick = () => {
    axios('/api/GetParentCategory', {
      params: {
        id: this.state.parentID
      }
    })
    .then(
      ({data}) => {
        if(data.results.length === 0) {
          this.getSubCategories(0, "Balance");
        } else {
          this.getSubCategories(data.results[0].id, data.results[0].name);
        }
      }
    ).catch(function (error) {
      console.log(error);
    });

    
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
          categorySelect: 0,
          recordSelect: 0,
          subCategoryItems: data.categories,
          subRecordItems: data.records
        });
      }
    ).catch(function (error) {
      console.log(error);
    });
  }

  recordSelect = (id) => {
    this.setState({
      ...this.state,
      recordSelect: id
    });
  }

  newCategory = () => {
    console.log("New Category Button Clicked!");
  }
  newRecord = () => {
    console.log("New Record Button Clicked!");
  }
  editCategory = () => {
    console.log("Edit Category Button Clicked!");
  }
  editRecord = () => {
    console.log("Edit Record Button Clicked!");
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
    const RecordItems = (

      this.state.subRecordItems.map(record => {
        let date = record.date.split('T')[0];
        let value = record.value/100.0;
        if(record.id === this.state.recordSelect) {
          return (
            <RecordItem 
              key={record.id}
              id={record.id} category_id={record.category_id} value={value} date={date} notes = {record.notes}
              select={true}
              recordSelect={this.recordSelect.bind(this)} />
          );
        } else {
          return (
            <RecordItem
              key={record.id}
              id={record.id} category_id={record.category_id} value={value} date={date} notes = {record.notes}
              select={false}
              recordSelect={this.recordSelect.bind(this)} />
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
            </div>
            <div className="CategoriesArea">
              <div className="category_item_list">
                {CategoryItems}
              </div>
            </div>
            <div className="CategoryBottomBar">
              <Button className="control_button" variant="info" onClick={this.newCategory}>
                <div className="control_button_image" id="new_button_image"></div>New
              </Button>
              <Button className="control_button" variant="info" onClick={this.editCategory}>
                <div className="control_button_image" id="edit_button_image"></div>Edit
              </Button>
              <Button className="control_button" variant="info" onClick={this.deleteCategory}>
                <div className="control_button_image" id="delete_button_image"></div>Delete
              </Button>
            </div>
          </div>
          <div className="RecordList">
            <div className="RecordControlBar">
              <h5 className="record_title" variant="secondary">Record List</h5>
            </div>
            <div className="RecordsArea">
              <div className="record_item_list">
                {RecordItems}
              </div>
            </div>
            <div className="RecordBottomBar">
              <Button className="control_button" variant="info" onClick={this.newCategory}>
                <div className="control_button_image" id="copy_button_image"></div>Copy
              </Button>
              <Button className="control_button" variant="info" onClick={this.editCategory}>
                <div className="control_button_image" id="cut_button_image"></div>Cut
              </Button>
              <Button className="control_button" variant="info" onClick={this.deleteCategory}>
                <div className="control_button_image" id="paste_button_image"></div>Paste
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default Management;
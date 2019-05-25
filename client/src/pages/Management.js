import React, { Component } from 'react';
import axios from 'axios';
import NewRecord from './NewRecord'
import DateRange from './DateRange.js'
import CategoryItem from './CategoryItem'
import RecordItem from './RecordItem'
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
    axios('/api/GetParentCategory', {
      params: {
        id: this.state.parentID
      }
    })
    .then(
      ({data}) => {
        this.getSubCategories(data.results[0].id, data.results[0].name);
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
              <div className="record_item_list">
                <RecordItem
                  key={1}
                  id={1} value={100} date={"2019-01-01"} notes={'This is the notes of the record.This is the notes of the record.'}
                  select={false}
                  categorySelect={this.categorySelect.bind(this)}/>
                <RecordItem
                  key={1}
                  id={1} value={100} date={"2019-01-01"} notes={'This is the notes of the record.This is the notes of the record.'}
                  select={false}
                  categorySelect={this.categorySelect.bind(this)}/>
                <RecordItem
                  key={1}
                  id={1} value={100} date={"2019-01-01"} notes={'This is the notes of the record.This is the notes of the record.'}
                  select={false}
                  categorySelect={this.categorySelect.bind(this)}/>
                <RecordItem
                  key={1}
                  id={1} value={100} date={"2019-01-01"} notes={'This is the notes of the record.This is the notes of the record.'}
                  select={false}
                  categorySelect={this.categorySelect.bind(this)}/>
                <RecordItem
                  key={1}
                  id={1} value={100} date={"2019-01-01"} notes={'This is the notes of the record.This is the notes of the record.'}
                  select={false}
                  categorySelect={this.categorySelect.bind(this)}/>
                <RecordItem
                  key={1}
                  id={1} value={100} date={"2019-01-01"} notes={'This is the notes of the record.This is the notes of the record.'}
                  select={false}
                  categorySelect={this.categorySelect.bind(this)}/>
              </div>
            </div>
          </div>

        </div> 
      </div>
    );
  }
}
export default Management;
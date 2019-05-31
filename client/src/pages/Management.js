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
import CreateNewModal from './CreateNewModal.js';

class Management extends Component {

  constructor(props) {
    super(props);
    this.state = {
      parentCategory: "Balance",
      parentID: 0,
      categorySelect: 0,
      recordSelect: 0,
      subCategoryItems: [
        // {
        //   id: 1,
        //   parent_id: 0,
        //   name: "Expenses"
        // },
        // {
        //   id: 2,
        //   parent_id: 0,
        //   name: "Incomes"
        // }
      ],
      subRecordItems: [
        // {
        //   id: 1,
        //   category_id: 0,
        //   value: 100,
        //   date: "2019-01-01",
        //   notes: "Record 1"
        // },
        // {
        //   id: 2,
        //   category_id: 0,
        //   value: 200,
        //   date: "2019-01-02",
        //   notes: "Record 2"
        // }
      ],
      createNewShow: false
    }
    this.date = new Date().toISOString().split('T')[0];
    this.selectYear = this.date.split('-')[0];
    this.selectMonth = this.date.split('-')[1];
    this.filterYear = this.selectYear;
    this.filterMonth = this.selectMonth;
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

  yearChange = (event) => {
    this.selectYear = event.target.value;
  }

  monthChange = (event) => {
    this.selectMonth = event.target.value;
  }

  updateButtonClick = () => {
    this.filterYear = this.selectYear;
    this.filterMonth = this.selectMonth;
    this.getSubCategories(this.state.parentID, this.state.parentCategory);
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

  endOfMonth (month) {
    let endDay = "";
    switch(month) {
      case "01": endDay = "31"; break;
      case "02": endDay = "28"; break;
      case "03": endDay = "31"; break;
      case "04": endDay = "30"; break;
      case "05": endDay = "31"; break;
      case "06": endDay = "30"; break;
      case "07": endDay = "31"; break;
      case "08": endDay = "31"; break;
      case "09": endDay = "30"; break;
      case "10": endDay = "31"; break;
      case "11": endDay = "30"; break;
      case "12": endDay = "31"; break;
      default  : endDay = "31"; break;
    }
    return endDay;
  }

  getSubCategories = (parent_id, parent_name) => {
    let start = this.filterYear + "-" + this.filterMonth + "-01";
    let end = this.filterYear + "-" + this.filterMonth + "-" + this.endOfMonth(this.filterMonth);
    axios('/api/GetSubCategories', {
      params: {
        parent_id: parent_id,
        start: start,
        end:end
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

  newCategoryRecord = () => {
    this.setState({
      ...this.state,
      createNewShow: true
    });
  }

  newDlgClose = () => {
    this.setState({
      ...this.state,
      createNewShow: false
    });
  }

  updateNewCategory = () => {
    this.getSubCategories(this.state.parentID, this.state.parentCategory);
  }

  editCategoryRecord = () => {
    console.log("Edit Button Clicked!");
  }
  deleteCategoryRecord = () => {
    console.log("Delete Button Clicked!");
  }
  copyCategoryRecord = () => {
    console.log("Copy Button Clicked!");
  }
  cutCategoryRecord = () => {
    console.log("Cut Button Clicked!");
  }
  pasteCategoryRecord = () => {
    console.log("Paste Button Clicked!");
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
      <Button className="control_button back_btn" variant="info" onClick={this.backButtonClick}>
        <div className="control_button_image" id="back_button_image"></div>Back
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
              <h5 className="category_record_title" variant="secondary">
                {this.state.parentCategory}
                <div className="category_record_title_icon category_imgage"></div>
              </h5>
              { BackButton  }
            </div>
            <div className="CategoriesArea">
              <div className="category_item_list">
                {CategoryItems}
              </div>
            </div>
            <div className="CategoryBottomBar">
              <Button className="control_button" variant="info" onClick={this.newCategoryRecord}>
                <div className="control_button_image" id="new_button_image"></div>New
              </Button>
              <CreateNewModal createNewShow={this.state.createNewShow}
                parentID={this.state.parentID} parentCategory={this.state.parentCategory}
                updateNewCategory={(this.updateNewCategory.bind(this))}
                newDlgClose={this.newDlgClose.bind(this)} />
              <Button className="control_button" variant="info" onClick={this.editCategoryRecord}>
                <div className="control_button_image" id="edit_button_image"></div>Edit
              </Button>
              <Button className="control_button" variant="info" onClick={this.deleteCategoryRecord}>
                <div className="control_button_image" id="delete_button_image"></div>Delete
              </Button>
            </div>
          </div>
          <div className="RecordList">
            <div className="RecordControlBar">
              <h5 className="category_record_title" variant="secondary">
                Records
                <div className="category_record_title_icon record_image"></div>
              </h5>
              <div className="time_selector_area">
                {/* <h6 className="time_label">Year</h6> */}
                <select className="time_selector" defaultValue={this.selectYear} onChange={this.yearChange}>
                  <option value="2020">2022</option>
                  <option value="2020">2021</option>
                  <option value="2020">2020</option>
                  <option value="2019">2019</option>
                  <option value="2018">2018</option>
                  <option value="2018">2017</option>
                  <option value="2018">2016</option>
                </select>
                {/* <h6 className="time_label">Month</h6> */}
                <select className="time_selector" defaultValue={this.selectMonth} onChange={this.monthChange}>
                  <option value="12">Dec</option>
                  <option value="11">Nov</option>
                  <option value="10">Oct</option>
                  <option value="09">Sep</option>
                  <option value="08">Aug</option>
                  <option value="07">Jul</option>
                  <option value="06">Jun</option>
                  <option value="05">May</option>
                  <option value="04">Apr</option>
                  <option value="03">Mar</option>
                  <option value="02">Feb</option>
                  <option value="01">Jan</option>
                </select>
                <Button className="control_button" variant="info" onClick={this.updateButtonClick}>
                  <div className="control_button_image" id="update_button_image"></div>Update
                </Button>
              </div>
            </div>
            <div className="RecordsArea">
              <div className="record_item_list">
                {RecordItems}
              </div>
            </div>
            <div className="RecordBottomBar">
              <Button className="control_button" variant="info" onClick={this.copyCategoryRecord}>
                <div className="control_button_image" id="copy_button_image"></div>Copy
              </Button>
              <Button className="control_button" variant="info" onClick={this.cutCategoryRecord}>
                <div className="control_button_image" id="cut_button_image"></div>Cut
              </Button>
              <Button className="control_button" variant="info" onClick={this.pasteCategoryRecord}>
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
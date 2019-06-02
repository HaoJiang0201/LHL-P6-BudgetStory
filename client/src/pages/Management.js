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
import EditExistModal from './EditExistModal.js';
import { dateFormat } from 'highcharts';

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
      createNewShow: false,
      editExistShow: false,
      deleteShow: false
    }
    this.date = new Date().toISOString().split('T')[0];
    this.selectYear = this.date.split('-')[0];
    this.selectMonth = this.date.split('-')[1];
    this.showAllRecords = false;
  }

  backButtonClick = () => {
    axios('/GetParentCategory', {
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
    this.getSubCategories(this.state.parentID, this.state.parentCategory);
  }

  monthChange = (event) => {
    this.selectMonth = event.target.value;
    this.getSubCategories(this.state.parentID, this.state.parentCategory);
  }

  // updateButtonClick = () => {
  //   // this.filterYear = this.selectYear;
  //   // this.filterMonth = this.selectMonth;
  //   this.getSubCategories(this.state.parentID, this.state.parentCategory);
  // }

  categorySelect = (id) => {
    this.setState({
      ...this.state,
      categorySelect: id,
      recordSelect: 0
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
    let start = this.selectYear + "-" + this.selectMonth + "-01";
    let end = this.selectYear + "-" + this.selectMonth + "-" + this.endOfMonth(this.selectMonth);
    if(this.showAllRecords) {
      start = "";
      end = "";
    }
    axios('/GetSubCategories', {
      params: {
        parent_id: parent_id,
        start: start,
        end: end
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
      categorySelect: 0,
      recordSelect: id
    });
  }

  showAllChecked = (event) => {
    this.showAllRecords = event.target.checked;
    this.getSubCategories(this.state.parentID, this.state.parentCategory);
  }

  newCategoryRecord = () => {
    if(this.state.parentID === 0) {
      alert("Please create new Category or Record in Expenses or Incomes.");
    } else {
      this.setState({
        ...this.state,
        createNewShow: true
      });
    }
  }

  dlgClose = () => {
    this.setState({
      ...this.state,
      createNewShow: false,
      editExistShow: false,
      deleteShow: false
    });
  }

  updateNewCategoryRecord = (date) => {
    if(date != "category" && date != "delete") {
      this.selectYear = date.split('-')[0];
      this.selectMonth = date.split('-')[1];
    }
    this.getSubCategories(this.state.parentID, this.state.parentCategory);
  }

  editCategoryRecord = () => {
    if(this.state.categorySelect === 0 && this.state.recordSelect === 0) {
      alert("Please select a Category or Record to Edit.");
    } else {
      if(this.state.categorySelect === 1 || this.state.categorySelect === 2) {
        alert("Expenses and Incomes are default parent category which cannot be Edit.");
      } else {
        if(this.state.categorySelect != 0) {
          this.setState({
            ...this.state,
            editExistShow: true
          });
        }
        if(this.state.recordSelect != 0) {
          this.setState({
            ...this.state,
            editExistShow: true
          });
        }
      }
    }
  }

  showDeleteDialog = () => {
    if(this.state.categorySelect === 0 && this.state.recordSelect === 0) {
      alert("Please select a Category or Record to Delete.");
    } else {
      if(this.state.categorySelect === 1 || this.state.categorySelect === 2) {
        alert("Expenses and Incomes are default parent category which cannot be Deleted.");
      } else {
        if(this.state.categorySelect != 0) {
          this.setState({
            ...this.state,
            deleteShow: true
          });
        }
        if(this.state.recordSelect != 0) {
          this.setState({
            ...this.state,
            deleteShow: true
          });
        }
      }
    }
  }

  deleteCategoryRecord = (event) => {
    event.preventDefault();
    if(this.state.categorySelect != 0) {
      const delCategory = {
        id: this.state.categorySelect
      }
      axios.post('/DeleteCategory', {delCategory})
      .then((response) => {
        this.dlgClose();
        this.updateNewCategoryRecord("delete");
      });
    }
    if(this.state.recordSelect != 0) {
      const delRecord = {
        id: this.state.recordSelect
      }
      axios.post('/DeleteRecord', {delRecord})
      .then((response) => {
        this.dlgClose();
        this.updateNewCategoryRecord("delete");
      });
    }
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

    let editCategory = {id: this.state.categorySelect};
    let editRecord = {id: this.state.recordSelect};

    const CategoryItems = (

      this.state.subCategoryItems.map(category => {

        if(category.id === this.state.categorySelect) {
          editCategory.name = category.name;
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
          editRecord.name = record.name;
          editRecord.value = value
          editRecord.date = date;
          editRecord.notes = record.notes;
          return (
            <RecordItem 
              key={record.id}
              id={record.id} category_id={record.category_id} value={value} date={date} notes = {record.notes}
              select={true}
              recordSelect={this.recordSelect.bind(this)}
              editCategoryRecord={this.editCategoryRecord} />
          );
        } else {
          return (
            <RecordItem
              key={record.id}
              id={record.id} category_id={record.category_id} value={value} date={date} notes = {record.notes}
              select={false}
              recordSelect={this.recordSelect.bind(this)}
              editCategoryRecord={this.editCategoryRecord} />
          );
        }                
      })
    );

    let DeleteModalContents;

    if(this.state.categorySelect != 0) {
      DeleteModalContents = (
        <div>
          <Modal.Header className="modal_dialog_title" closeButton>
            <Modal.Title >Delete Category <b>{editCategory.name}</b></Modal.Title>
          </Modal.Header>
          <Modal.Body className="modal_dialog_body">
            <Form id="delete_cr" onSubmit={this.deleteCategoryRecord}>
              <p>The category and elements inside will be removed.</p>
            </Form>
          </Modal.Body>
        </div>
      );
    }
    if(this.state.recordSelect != 0) {
      DeleteModalContents = (
        <div>
          <Modal.Header className="modal_dialog_title" closeButton>
            <Modal.Title >Delete Warning</Modal.Title>
          </Modal.Header>
          <Modal.Body className="modal_dialog_body">
            <Form id="delete_cr" onSubmit={this.deleteCategoryRecord}>
              <p>The Record will be removed:</p>
              <p><b>Amount:</b> {editRecord.value} <b>Date:</b> {editRecord.date}</p>
              <p><b>Notes:</b> {editRecord.notes}</p>
            </Form>
          </Modal.Body>
        </div>
      );
    }

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
              <h5 className="category_record_title disable-selection" variant="secondary">
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
                updateNewCategoryRecord={(this.updateNewCategoryRecord.bind(this))}
                dlgClose={this.dlgClose.bind(this)} />
              <Button className="control_button" variant="info" onClick={this.editCategoryRecord}>
                <div className="control_button_image" id="edit_button_image"></div>Edit
              </Button>
              <EditExistModal editExistShow={this.state.editExistShow}
                editCategory={editCategory} editRecord={editRecord}
                updateNewCategoryRecord={(this.updateNewCategoryRecord.bind(this))}
                dlgClose={this.dlgClose.bind(this)} />
              <Button className="control_button" variant="info" onClick={this.showDeleteDialog}>
                <div className="control_button_image" id="delete_button_image"></div>Delete
              </Button>
              <Modal className="modal_dialog" show={this.state.deleteShow} onHide={this.dlgClose}>
                {DeleteModalContents}
                <Modal.Footer className="modal_dialog_footer">
                  <Button variant="danger" className="control_button submit_btn" type="submit" form="delete_cr">Confirm</Button>
                </Modal.Footer>
              </Modal>
            </div>
          </div>
          <div className="RecordList">
            <div className="RecordControlBar">
              <h5 className="category_record_title disable-selection" variant="secondary">
                Records
                <div className="category_record_title_icon record_image"></div>
              </h5>
              <p className="checkbox_text">
                <input className="checkbox" type="checkbox" defaultChecked={this.showAllRecords}
                onChange={this.showAllChecked}>
                </input>Show All
              </p>
              <div className="time_selector_area">
                {/* <h6 className="time_label">Year</h6> */}
                <select className="time_selector" value={this.selectYear} onChange={this.yearChange}>
                  <option value="2020">2022</option>
                  <option value="2020">2021</option>
                  <option value="2020">2020</option>
                  <option value="2019">2019</option>
                  <option value="2018">2018</option>
                  <option value="2018">2017</option>
                  <option value="2018">2016</option>
                </select>
                {/* <h6 className="time_label">Month</h6> */}
                <select className="time_selector" value={this.selectMonth} onChange={this.monthChange}>
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
                {/* <Button className="control_button" variant="info" onClick={this.updateButtonClick}>
                  <div className="control_button_image" id="update_button_image"></div>Update
                </Button> */}
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
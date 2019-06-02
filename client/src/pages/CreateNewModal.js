import React, { Component } from 'react';
import axios from 'axios';
import '../App/styles/management.css'
import 'bootstrap/dist/css/bootstrap.css';
import { Button, Modal, Form } from 'react-bootstrap';

class CreateNewModal extends Component {

    constructor(props) {
      super(props);
      this.state = {
        currentType: "1"
      }
    }

    dlgClose = () => {
        this.props.dlgClose();
    }

    createNewTypeChange = (event) => {
        this.setState({
            ...this.state,
            currentType: event.target.value
        });
    }

    createCategoryRecord = (event) => {
        event.preventDefault();
        if(this.state.currentType === "1") {
            const newCat = {
                name: event.target.name.value,
                notes: "",
                parent_id: this.props.parentID
            }
            axios.post('/NewCategory', {newCat})
            .then((response) => {
                this.props.updateNewCategoryRecord("category");
                this.dlgClose();
            });
        } else {
            let dateNew = event.target.date.value;
            const newRec = {
                category_id: this.props.parentID,
                value: Math.round((event.target.value.value*100) * 100) / 100,
                date: dateNew,
                notes: event.target.notes.value
            };
            axios.post('/NewRecord', {newRec}).then((response) => {
                this.props.updateNewCategoryRecord(dateNew);
                this.dlgClose();
            })
        }
        
    }

    render() {
        let NewCRContents;
        if(this.state.currentType === "1") {
            NewCRContents = (
                <div className="dlg_contents">
                    <Form.Group controlId="recordAmount">
                        <Form.Label>Name:</Form.Label>
                        <Form.Control type="text" placeholder="" name='name' />
                    </Form.Group>
                </div>
            );
        } else {
            let date = new Date().toISOString().split('T')[0];
            NewCRContents = (
                <div className="dlg_contents">
                    <Form.Group controlId="recordAmount">
                        <Form.Label>Amount: $</Form.Label>
                        <Form.Control type="number" placeholder="" step='0.01' name='value' />
                    </Form.Group>
                    <Form.Group controlId="recordDate">
                        <Form.Label>Date:</Form.Label>
                        <Form.Control type="text" defaultValue={date} placeholder={date} name='date' />
                    </Form.Group>
                    <Form.Group controlId="recordNotes">
                        <Form.Label>Notes:</Form.Label>
                        <Form.Control type="text" placeholder="Where and why did I spent this money?" name='notes' />
                    </Form.Group>
                </div>
            );
        }

        return (
            <Modal className="modal_dialog" show={this.props.createNewShow} onHide={this.dlgClose}>
                <Modal.Header className="modal_dialog_title" closeButton>
                  <Modal.Title >In Category <b>{this.props.parentCategory}</b></Modal.Title>
                </Modal.Header>
                <Modal.Body className="modal_dialog_body">
                    <Form id="create_new" onSubmit={this.createCategoryRecord}>
                        <div className="create_new_type">
                            Create a new: 
                            <select className="time_selector create_new_type_selector" defaultValue={this.state.currentType} onChange={this.createNewTypeChange}>
                                <option value="1">Category</option>
                                <option value="2">Record</option>
                            </select>
                        </div>
                        <hr />
                        {NewCRContents}
                    </Form>
                </Modal.Body>
                <Modal.Footer className="modal_dialog_footer">
                  <Button variant="info" className="control_button submit_btn" type="submit" form="create_new">Submit</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default CreateNewModal;
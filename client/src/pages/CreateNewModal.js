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

    newDlgClose = () => {
        this.props.newDlgClose();
    }

    createNewTypeChange = (event) => {
        this.setState({
            ...this.state,
            currentType: event.target.value
        });
    }

    createCategoryRecord = (event) => {
        event.preventDefault();
        const newCat = {
            name: event.target.name.value,
            notes: "",
            parent_id: this.props.parentID
        }
        axios.post('/newCategory', {newCat})
        .then((response) => {
            this.props.updateNewCategory();
            this.newDlgClose();
        })
    }


    render() {
        let NewCRContents;
        if(this.state.currentType === "1") {
            NewCRContents = (
                <div className="new_cr_contents">
                    <Form.Group controlId="recordAmount">
                        <Form.Label>Name:</Form.Label>
                        <Form.Control type="text" placeholder="" name='name' />
                    </Form.Group>
                </div>
            );
        } else {
            let date = new Date().toISOString().split('T')[0];
            NewCRContents = (
                <div className="new_cr_contents">
                    <Form.Group controlId="recordAmount">
                        <Form.Label>Amount:</Form.Label>
                        <Form.Control type="number" placeholder="$" step='0.01' name='amount' />
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
            <Modal className="new_dialog" show={this.props.createNewShow} onHide={this.newDlgClose}>
                <Modal.Header className="new_dialog_title" closeButton>
                  <Modal.Title >In Category <b>{this.props.parentCategory}</b></Modal.Title>
                </Modal.Header>
                <Modal.Body className="new_dialog_body">
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
                <Modal.Footer className="new_dialog_footer">
                  <Button variant="info" className="control_button submit_btn" type="submit" form="create_new">Submit</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default CreateNewModal;
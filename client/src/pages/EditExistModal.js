import React, { Component } from 'react';
import axios from 'axios';
import '../App/styles/management.css'
import 'bootstrap/dist/css/bootstrap.css';
import { Button, Modal, Form } from 'react-bootstrap';

class EditExistModal extends Component {

    constructor(props) {
      super(props);
      this.state = {
      }
    }

    dlgClose = () => {
        this.props.dlgClose();
    }

    editCategoryRecord = (event) => {
        event.preventDefault();
        if(this.props.editCategory.id !== 0) {
            const editCat = {
                id: this.props.editCategory.id,
                name: event.target.name.value,
                notes: ""
            }
            axios.post('/EditCategory', {editCat})
            .then((response) => {
                this.props.updateNewCategoryRecord("category");
                this.dlgClose();
            });
        }
        if(this.props.editRecord.id !== 0) {
            let dateNew = event.target.date.value;
            const editRecord = {
                id: this.props.editRecord.id,
                value: Math.round((event.target.value.value*100) * 100) / 100,
                date: dateNew,
                notes: event.target.notes.value
            };
            axios.post('/EditRecord', {editRecord}).then((response) => {
                this.props.updateNewCategoryRecord(dateNew);
                this.dlgClose();
            })
        }
        
    }

    render() {
        let EditCRContents;
        let EditTitle;
        if(this.props.editCategory.id !== 0) {
            EditCRContents = (
                <div className="dlg_contents">
                    <Form.Group controlId="recordAmount">
                        <Form.Label>Name:</Form.Label>
                        <Form.Control type="text" defaultValue={this.props.editCategory.name}
                            placeholder={this.props.editCategory.name} name='name' />
                    </Form.Group>
                </div>
            );
            EditTitle = (
                <Modal.Title >Edit Category</Modal.Title>
            );
        }
        if(this.props.editRecord.id !== 0) {
            EditCRContents = (
                <div className="dlg_contents">
                    <Form.Group controlId="recordAmount">
                        <Form.Label>Amount: $</Form.Label>
                        <Form.Control type="number" defaultValue={this.props.editRecord.value}
                            placeholder={this.props.editRecord.value} step='0.01' name='value' />
                    </Form.Group>
                    <Form.Group controlId="recordDate">
                        <Form.Label>Date:</Form.Label>
                        <Form.Control type="text" defaultValue={this.props.editRecord.date} 
                            placeholder={this.props.editRecord.date} name='date' />
                    </Form.Group>
                    <Form.Group controlId="recordNotes">
                        <Form.Label>Notes:</Form.Label>
                        <Form.Control type="text" defaultValue={this.props.editRecord.notes} 
                            placeholder={this.props.editRecord.notes} name='notes' />
                    </Form.Group>
                </div>
            );
            EditTitle = (
                <Modal.Title >Edit Record</Modal.Title>
            );
        }

        return (
            <Modal className="modal_dialog" show={this.props.editExistShow} onHide={this.dlgClose}>
                <Modal.Header className="modal_dialog_title" closeButton>
                    {EditTitle}
                </Modal.Header>
                <Modal.Body className="modal_dialog_body">
                    <Form id="edit_exist" onSubmit={this.editCategoryRecord}>
                        {EditCRContents}
                    </Form>
                </Modal.Body>
                <Modal.Footer className="modal_dialog_footer">
                  <Button variant="info" className="control_button submit_btn" type="submit" form="edit_exist">Submit</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default EditExistModal;
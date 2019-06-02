import React, { Component } from 'react';
import '../App/styles/management.css'
import 'bootstrap/dist/css/bootstrap.css';
// import { Container, Row, Col } from 'react-bootstrap';

class RecordItem extends Component {

    constructor(props) {
      super(props);
      this.state = {
        id: props.id,
        category_id: props.category_id,
        value: props.value,
        date: props.date,
        notes: props.notes,
        select: props.select
      }
    }

    onItemClick = (event) => {
        event.preventDefault();
        this.setState({
            select: true
        });
        this.props.recordSelect(this.state.id);
    }

    onItemDoubleClick = (event) => {
        event.preventDefault();
        this.setState({
            select: true
        });
        this.props.recordSelect(this.state.id);
        this.props.editCategoryRecord();
    }
  
    componentDidMount() {

    }
  
    render() {
        let recordItemClass = this.props.select ? "record_item_select" : "record_item";
        return (
            <div className={recordItemClass} onClick={this.onItemClick} onDoubleClick={this.onItemDoubleClick}>
                <div className="record_img"></div>
                <div className="record_text disable-selection">
                    <div className="record_value">$ {this.props.value}</div>
                    <div className="record_date">{this.props.date}</div>
                    <div className="record_notes">{this.props.notes}</div>
                </div>
            </div>
        );
    }
  }
  export default RecordItem;
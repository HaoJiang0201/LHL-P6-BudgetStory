import React, { Component } from 'react';
import '../App/styles/management.css'
import 'bootstrap/dist/css/bootstrap.css';
// import { Container, Row, Col } from 'react-bootstrap';

class RecordItem extends Component {

    constructor(props) {
      super(props);
      this.state = {
        id: props.id,
        value: props.value,
        date: props.date,
        notes: props.notes,
        select: props.select
      }
    }

    onItemClick = () => {
        this.setState({
            select: true
        });
        // this.props.recordSelect(this.state.id);
    }
  
    componentDidMount() {

    }
  
    render() {
        let recordItemClass = this.props.select ? "record_item_select" : "record_item";
        // let recordName = this.props.name ? this.props.name: this.state.name;
        return (
            <div className={recordItemClass} onClick={this.onItemClick}>
                <div className="record_img"></div>
                <div className="record_text">
                    <div className="record_value">$ {this.state.value}</div>
                    <div className="record_date">{this.state.date}</div>
                    <div className="record_notes">{this.state.notes}</div>
                </div>
            </div>
        );
    }
  }
  export default RecordItem;
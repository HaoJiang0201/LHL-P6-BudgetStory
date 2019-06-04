import React, { Component } from 'react';
import DatePicker from 'react-datepicker'
import isAfter from 'date-fns/isAfter'
import { Button } from 'react-bootstrap';
import "react-datepicker/dist/react-datepicker.css";
import '../App/styles/datepicker.css'
// import '../App/styles/compare.css'
// import '../App/styles/home.css'

class DateRange extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: this.GetDate(true),
      endDate: this.GetDate(false)
    };
  }

  GetDate (bStart) {
    if(bStart) {
      let year = new Date().toISOString().split('T')[0].split('-')[0];
      let month = new Date().toISOString().split('T')[0].split('-')[1];
      let day = "01";
      let date = year + "/" + month + "/" + day;
      return new Date(date);
    } else {
      let year = new Date().toISOString().split('T')[0].split('-')[0];
      let month = new Date().toISOString().split('T')[0].split('-')[1];
      let day = "30";
      let date = year + "/" + month + "/" + day;
      return new Date(date);
    }
  }

  // Adjust real date passed down from Home or Compare page into DatePicker element
  // getCalenderDate(inputDate) {
  //   let outputDate = inputDate.setDate(inputDate.getDate() + 1);
  //   return outputDate;
  // }

  handleChange = ({ startDate, endDate }) => {
    startDate = startDate || this.state.startDate;
    endDate = endDate || this.state.endDate;
    if (isAfter(startDate, endDate)) {
      endDate = startDate
    }
    this.setState({ 
      startDate: startDate,
      endDate: endDate
    });
  };

  handleChangeStart = startDate => this.handleChange({ startDate });

  handleChangeEnd = endDate => this.handleChange({ endDate });

  // static getDerivedStateFromProps(props, state) {
  // }

  updateDate = () => {
    let startDate = this.state.startDate.toISOString();
    let endDate = this.state.endDate.toISOString();
    this.props.updateDate(startDate, endDate);
  }

  componentDidMount() {

  }

  render() {

    // console.log(">>> DR: start = ", this.state.startDate);
    // console.log(">>> DR: end = ", this.state.endDate);
    // console.log(">>> DR: startISO = ", this.state.startDate.toISOString());
    // console.log(">>> DR: endISO = ", this.state.endDate.toISOString());

    return (
      <div className="DateRange disable-selection">
        <div className="CalendarArea">
          <p className="CalendarText">Start</p>
          <DatePicker
            className="Calendar"
            selected={this.state.startDate}
            selectsStart
            startDate={this.state.startDate}
            endDate={this.state.endDate}
            onChange={this.handleChangeStart}
          />
          <p className="CalendarText">End</p>
          <DatePicker
            className="Calendar"
            selected={this.state.endDate}
            selectsEnd
            startDate={this.state.startDate}
            endDate={this.state.endDate}
            onChange={this.handleChangeEnd}
          />
        </div>
        <Button className="control_button" variant="info" onClick={this.updateDate}>
          <div className="update_button_image"></div><p className="update_button_text">Update</p>
        </Button>
      </div>
    );
  }
}

export default DateRange
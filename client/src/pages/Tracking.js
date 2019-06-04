import React, { Component } from 'react';
import Select from 'react-select';
import axios from 'axios';
import Highcharts from 'highcharts';
import DateRange from './DateRange.js'
import PieChartController from './PieChartController.js'
import ColumnChart from './ColumnChart.js';
// import Highchart from './Highchart'
import '../App/styles/tracking.css'
import Drilldown from 'highcharts/modules/drilldown';
import Navbar from './Navbar.js'
// check if HighchartsDrilldown has already been loaded
if (!Highcharts.Chart.prototype.addSeriesAsDrilldown) {
  Drilldown(Highcharts);
}

class Tracking extends Component {
    constructor(props) {
        super(props);
        this.state = {
            
        }
    }

    updateDate = (startDate, endDate) => {
        console.log(">>> Tracking: start = ", startDate);
        console.log(">>> Tracking: end = ", endDate);
    }

    render() {
        return (
            <div>
                <div className="Background"></div>
                <Navbar/>
                <div className="TrackingPage">
                    <div className="ControlBar">
                        <DateRange date={this.state.date} updateDate={this.updateDate.bind(this)}/>
                    </div>
                </div>
            </div>
        );
    }
}

export default Tracking;
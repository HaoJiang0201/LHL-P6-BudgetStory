import React, { Component } from 'react';
import axios from 'axios';

import Highchart from './Highchart'
import Highcharts from 'highcharts';
import PieChartController from './PieChartController.js'
import ColumnChart from './ColumnChart.js';
import Drilldown from 'highcharts/modules/drilldown';

import Navbar from './Navbar.js'
import DateRange from './DateRange.js'
import Select from 'react-select';
import '../App/styles/tracking.css'

// Check if HighchartsDrilldown has already been loaded
if (!Highcharts.Chart.prototype.addSeriesAsDrilldown) {
  Drilldown(Highcharts);
}

class Tracking extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentCategory: {
              id: 0,
              name: "Balance"
            },
            options: {
                series: [],
                drilldown: {
                    series: []
                }
            }
        }
    }

    getCurrentCategory = (id, name) => {
        this.setState({
            ...this.state,
            currentCategory: {
            id: id,
            name: name
            }
        });
    }

    updateDate = (startDate, endDate) => {
        // Drill Up back to balance level everytime update the chart
        Highcharts.targetLevel = -1;
        Highcharts.charts.forEach((chart) => {
            const drillUpLevel = chart.drilled;
            for(let level = 0; level <= drillUpLevel; level ++) {
                chart.drillUp();
            }
            chart.drilled = 0;
        });
        // Re-Tracking the data based on new date range
        axios('/Tracking', {
            params: {
                start: startDate,
                end: endDate
            }
        })
        .then(
            ({data}) => {
                Highcharts.charts.forEach((chart) => {
                    chart.setTitle({text: data.title});
                });
                let balanceValue = (data.series[0].data[1].v - data.series[0].data[0].v).toFixed(2);
                this.setState({
                    ...this.state,
                    options: {
                        title: "Balance: $" + balanceValue,
                        series: data.series,
                        drilldown: data.drilldown
                    }
                });
            }
        ).catch(function (error) {
            console.log(error);
        });
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
                    <div className="TrackingDataArea">
                        <div className="PieChartArea">
                            <Highchart Highcharts={Highcharts} type={"pie"} options={this.state.options} getCurrentCategory={this.getCurrentCategory.bind(this)}/>
                        </div>
                        <div className="ColumnChartArea">
                        </div>
                    </div>
                </div>
                
            </div>
        );
    }
}

export default Tracking;
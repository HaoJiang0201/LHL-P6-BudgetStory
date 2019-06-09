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

let columnData = [];
let columnDataBK = [];
let columnXCategories = [];
let defaultCulumnOption = {
    xAxis: {
      categories: ['Mar', 'Apr', 'May']
    },
    series: [
        {
            name: 'Expenses',
            data: [100, 200, 300]
        },
        {
            name: 'Incomes',
            data: [312, 231, 123]
        }
    ]
};

class Tracking extends Component {
    constructor(props) {
        super(props);
        this.state = {
            viewOption: "1",
            currentCategory: {
              id: 0,
              name: "Balance"
            },
            options: {
              series: [],
              drilldown: {
                series: []
              }
            },
            columnOptions: {
              xAxis: {
                categories: ['Feb', 'Mar', 'Apr']
              },
              series: [
                {
                  name: 'Category1',
                  data: [100, 200, 300]
                },
                {
                  name: 'Category2',
                  data: [312, 231, 123]
                }
              ]
            }
        }
    }
    // Refresh statement while the "view option" changed
    ViewOptionChange = (event) => {
        let viewOption = "1";
        switch(event.target.value) {
            case "1": viewOption = "1"; break;
            case "2": viewOption = "2"; break;
            case "3": viewOption = "3"; break;
            default: viewOption = "1"; break;
        }
        this.setState({
            ...this.state,
            viewOption: viewOption
        });
    }

    // Call back function for the PieChartController class
    GetCurrentCategory = (id, name) => {
        let columnOptions = this.CurrentColumnOptions(id);
        this.setState({
            ...this.state,
            currentCategory: {
                id: id,
                name: name
            },
            columnOptions: columnOptions
        });
    }
    // Get current level's children C/R information by given a specific category ID
    // This if used for column chart
    CurrentColumnOptions (categoryID) {
        columnData = JSON.parse(JSON.stringify(columnDataBK));
        if(categoryID === "Balance") {
          categoryID = 0;
        }
        let optionsObj = {
            xAxis: {},
            series: []
        };
        let seriesObj = {};
        if(columnData.length > 0) {
            for(let i = 0; i < columnData.length; i ++) {
                if(columnData[i].pid === categoryID) {
                    seriesObj = {};
                    seriesObj.name = columnData[i].name;
                    seriesObj.data = [];
                    if(columnData[i].data.length > 0) {
                        for(let j = 0; j < columnData[i].data.length; j ++) {
                            let value = columnData[i].data[j].toFixed(2);
                            seriesObj.data.push(parseFloat(value));
                        }
                    }
                    optionsObj.series.push(seriesObj);
                }
            }
            optionsObj.xAxis.categories = columnXCategories;
        } else {
            optionsObj = defaultCulumnOption;
        }
        return optionsObj;
    }

    GetMonthEndDate (id) {
        let endDate = "31";
        switch(id) {
          case 1: endDate = "31"; break;
          case 2: endDate = "28"; break;
          case 3: endDate = "31"; break;
          case 4: endDate = "30"; break;
          case 5: endDate = "31"; break;
          case 6: endDate = "30"; break;
          case 7: endDate = "31"; break;
          case 8: endDate = "31"; break;
          case 9: endDate = "30"; break;
          case 10: endDate = "31"; break;
          case 1: endDate = "30"; break;
          case 12: endDate = "31"; break;
          default : endDate = "31"; break;
        }
        return endDate;
    }

    GetMonthName (id) {
        let monthName = "Mon";
        switch(id) {
          case 1: monthName = "Jan"; break;
          case 2: monthName = "Feb"; break;
          case 3: monthName = "Mar"; break;
          case 4: monthName = "Apr"; break;
          case 5: monthName = "May"; break;
          case 6: monthName = "Jun"; break;
          case 7: monthName = "Jul"; break;
          case 8: monthName = "Aug"; break;
          case 9: monthName = "Sep"; break;
          case 10: monthName = "Oct"; break;
          case 11: monthName = "Nov"; break;
          case 12: monthName = "Dec"; break;
          default : monthName = "Mon"; break;
        }
        return monthName;
    }

    GetMonthString (id) {
        let monthString = "00";
        switch(id) {
            case 1: monthString = "01"; break;
            case 2: monthString = "02"; break;
            case 3: monthString = "03"; break;
            case 4: monthString = "04"; break;
            case 5: monthString = "05"; break;
            case 6: monthString = "06"; break;
            case 7: monthString = "07"; break;
            case 8: monthString = "08"; break;
            case 9: monthString = "09"; break;
            case 10: monthString = "10"; break;
            case 11: monthString = "11"; break;
            case 12: monthString = "12"; break;
            default : monthString = "00"; break;
        }
        return monthString;
    }

    ViewByMonth (start, end) {
        let year = start.stringISO.split('-')[0];
        let startMonth = parseInt(start.stringISO.split('-')[1], 10);
        let endMonth = parseInt(end.stringISO.split('-')[1], 10);
        let startList = [];
        let endList = [];
        startList.push(start.stringISO);
        endList.push(year + "-" + start.stringISO.split('-')[1] + "-" + this.GetMonthEndDate(startMonth));
        columnXCategories.push(this.GetMonthName(startMonth));
        let monthNum = endMonth - startMonth + 1;
        if(monthNum >= 2) {
          for(let i = startMonth + 1; i < endMonth; i ++) {
            startList.push(year + "-" + this.GetMonthString(i) + "-01");
            endList.push(year + "-" + this.GetMonthString(i) + "-" + this.GetMonthEndDate(i));
            columnXCategories.push(this.GetMonthName(i));
          }
          startList.push(year + "-" + end.stringISO.split('-')[1] + "-01");
          endList.push(end.stringISO);
          columnXCategories.push(this.GetMonthName(endMonth));
        }
        return {
            startList: startList,
            endList: endList
        };
    }

    GetWeekEndDate (start, monthID) {
        let endString = "31";
        let endInt = start + 6;
        let endMonth = parseInt(this.GetMonthEndDate(monthID), 10);
        if(endInt > endMonth) {
            endInt = endMonth;
        }
        if(endInt >= 1 && endInt <= endMonth) {
            if(endInt <= 9) {
                endString = "0" + endInt;
            } else {
                endString = endInt.toString();
            }
        }
        return {
            int: endInt,
            string: endString
        };
    }
    
    ViewByWeek (start, end) {
        let year = start.stringISO.split('-')[0];
        let startList = [];
        let endList = [];
        let startMonth = parseInt(start.stringISO.split('-')[1], 10);
        let endMonth = parseInt(end.stringISO.split('-')[1], 10);
        let startDay = parseInt(start.stringISO.split('-')[2], 10);
        let endDay = parseInt(end.stringISO.split('-')[2], 10);
        let weekNum = parseInt((endDay-startDay)/7, 10) + 1;
        startList.push(start.stringISO);
        let endData = this.GetWeekEndDate(parseInt(start.stringISO.split('-')[2], 10), startMonth);
        endList.push(year + "-" + start.stringISO.split('-')[1] + "-" + endData.string);
        for(let i = 1; i < weekNum; i ++) {
            let newStart = endData.int + 1;
            if(newStart <= 9) {
                newStart = "0" + newStart;
            }
            startList.push(year + "-" + start.stringISO.split('-')[1] + "-" + newStart);
            endData = this.GetWeekEndDate(parseInt(endData.int + 1, 10), startMonth);
            endList.push(year + "-" + start.stringISO.split('-')[1] + "-" + endData.string);
            columnXCategories.push("Week" + i);
        }
        columnXCategories.push("Week" + weekNum);
        return {
            startList: startList,
            endList: endList
        };
    }

    UpdateDate = (startDate, endDate) => {
        // Get start and end date
        let start = {
            stringISO: "2019-01-01",
            day: "Mon"
        };
        let end = {
            stringISO: "2019-12-31",
            day: "Sun"
        };
        if(startDate){
            start.stringISO = startDate.toISOString().split('T')[0];
            start.day = startDate.toString().split(' ')[0];
        }
        if(endDate){
            end.stringISO = endDate.toISOString().split('T')[0];
            end.day = endDate.toString().split(' ')[0];
        }
        // Init data for column chart
        columnData = [];
        columnXCategories = [];
        let dateRange = {};
        switch(this.state.viewOption) {
            case "1": dateRange = this.ViewByMonth(start, end); break;
            case "2": dateRange = this.ViewByWeek(start, end); break;
            default: dateRange = this.ViewByMonth(start, end); break;
        }
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
                dateRange
            }
        })
        .then(
            ({data}) => {
                let pie = data.pie;

                columnData = JSON.parse(JSON.stringify(data.column));
                columnDataBK = JSON.parse(JSON.stringify(data.column));

                let balanceValue = (pie.series[0].data[1].v - pie.series[0].data[0].v).toFixed(2);
                let columnOptions = this.CurrentColumnOptions(0);
                
                this.setState({
                    ...this.state,
                    options: {
                        title: "Balance: $" + balanceValue,
                        series: pie.series,
                        drilldown: pie.drilldown
                    },
                    columnOptions: columnOptions
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
                        <DateRange date={this.state.date} UpdateDate={this.UpdateDate.bind(this)}/>
                        <b>View</b>
                        <select className="ViewByOption" value={this.state.viewOption} onChange={this.ViewOptionChange}>
                            <option value="1">Month</option>
                            <option value="2">Week</option>
                            <option value="3">Year</option>
                        </select>
                    </div>
                    <div className="TrackingDataArea">
                        <div className="PieChartArea">
                            {/* <Highchart Highcharts={Highcharts} type={"pie"} options={this.state.options} getCurrentCategory={this.getCurrentCategory.bind(this)}/> */}
                            <PieChartController Highcharts={Highcharts} options={this.state.options}
                            getCurrentCategory={this.GetCurrentCategory.bind(this)}/>
                        </div>
                        <div className="ColumnChartArea">
                            <ColumnChart Highcharts={Highcharts} options={this.state.columnOptions}/>
                        </div>
                    </div>
                </div>
                
            </div>
        );
    }
}

export default Tracking;
import React, { Component } from 'react';
import HighchartsReact from 'highcharts-react-official';
import { drillDownEvent } from "./DrillDownUp";
import { drillUpEvent } from "./DrillDownUp";
import '../App/styles/home.css';
import '../App/styles/compare.css';

class PieChartController extends Component {
  constructor(props) {
    super(props);
    this.state = {
      options: {
        chart: {
          type: 'pie',
          // spacingTop: 0,
          // spacingRight: 0,
          // spacingBottom: 0,
          // spacingLeft: 10,
          // marginRight: 10,
          marginBottom:65,
          width: 650,
          height: 500,
          events: {
            drilldown: (e) => {
              let categoryID = e.seriesOptions.id;
              let categoryName = e.seriesOptions.name;
              drillDownEvent(e, true);
              props.getCurrentCategory(categoryID, categoryName);
            },
            drillup: function (e) {
              let categoryID = e.seriesOptions.id;
              let categoryName = e.seriesOptions.name;
              drillUpEvent(e, true);
              props.getCurrentCategory(categoryID, categoryName);
            }
          }
        },
        title: {
          text: 'Balance'
        },
        credits: {
          enabled: false
        },
        plotOptions: {
          series: {
            dataLabels: {
              enabled: true,
              format: '${point.v:.1f}   {point.y:.1f}%   {point.d}   {point.name}'
            },
            showInLegend: true,
            cursor: 'pointer'
          }
        },
        tooltip: {
          headerFormat: '<span style="font-size:12px">{series.name}</span><br>',
          pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b> of total<br/>'
        },
        series: [
          {
            name: "Balance",
            id: "Balance",
            data: [
              { name: "Expenses", y: 60, v: 600, drilldown: 1},
              { name: "Incomes", y: 40, v: 400, drilldown: 2}
            ]
          }
        ],
        drilldown: {
          // drillUpButton: {
          //   position: {
          //     align:"left",
          //     verticalAlign:"top",
          //     x:-100,
          //     y:100
          //   }
          // },
          series: [
            {
              name: "Expenses",
              id: 1,
              data: [
                { name: "Clothes", y: 70, v: 700, drilldown: 3},
                { name: "Dining Out", y: 30, v: 300, drilldown: 4}
              ]
            },
            {
              name: "Incomes",
              id: 2,
              data: [
                { name: "Salary", y: 90, v: 9000, drilldown: null},
                { name: "Bonus", y: 10, v: 1000, drilldown: null}
              ]
            },
            {
              name: "Clothes",
              id: 3,
              data: [
                { name: "Clothes1", y: 10, v: 100, drilldown: null},
                { name: "Clothes2", y: 20, v: 200, drilldown: null},
                { name: "Clothes3", y: 30, v: 300, drilldown: null},
                { name: "Clothes4", y: 40, v: 400, drilldown: null}
              ]
            },
            {
              name: "Dining Out",
              id: 4,
              data: [
                { name: "Food1", y: 20, v: 200},
                { name: "Food2", y: 30, v: 300},
                { name: "Food3", y: 50, v: 500}
              ]
            }
          ]
        }
      }
    }
  }

  componentDidMount() {
  }

  render() {

    let options = this.props.options;
    options.chart = this.state.options.chart;
    options.title = {text: this.props.options.title}
    options.plotOptions = this.state.options.plotOptions;
    options.tooltip = this.state.options.tooltip;

    return (
      <HighchartsReact highcharts={this.props.Highcharts} options={options} />
    );
  }
}

export default PieChartController;
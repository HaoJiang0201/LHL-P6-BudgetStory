import React, { Component } from 'react';
import HighchartsReact from 'highcharts-react-official';
import { drillDownEvent } from "./DrillDownUp";
import { drillUpEvent } from "./DrillDownUp";

class Highchart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      options: {
        title: {
          text: 'Balance'
        },
        credits: {
          enabled: false
        },
        chart: {
          // spacingTop: 0,
          // spacingRight: 0,
          // spacingBottom: 0,
          // spacingLeft: 0,
          width: 700,
          height: 550,
          type: this.props.type,
          events: {
            drilldown: (e) => {
              let categoryID = e.seriesOptions.id;
              let categoryName = e.seriesOptions.name;
              drillDownEvent(e, false);
              props.getCurrentCategory(categoryID, categoryName);
            },
            drillup: function (e) {
              let categoryID = e.seriesOptions.id;
              let categoryName = e.seriesOptions.name;
              drillUpEvent(e, false);
              props.getCurrentCategory(categoryID, categoryName);
            }
          }
        },
        // legend: {
        //   align: 'left',
        //   layout: 'vertical',
        //   verticalAlign: 'top',
        //   x: -100,
        //   y: 100
        // },
        plotOptions: {
          series: {
            dataLabels: {
              enabled: true,
              format: '${point.v:.1f}   {point.y:.1f}%   {point.d}   {point.name}'
            },
            showInLegend: true,
            cursor: 'hand'
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
          //   align: "left",
          //   verticalAlign: "bottom",
          //   position: {
          //     x: 100,
          //     y: 100
          //   }
          // },
          // relativeTo: "spacingBox",
          series: []
        }
      }
    }
  }


  componentDidMount() {

  }

  render() {
    let options = this.props.options;
    options.chart = this.state.options.chart;
    options.title = {text: options.title}
    options.plotOptions = this.state.options.plotOptions;
    options.tooltip = this.state.options.tooltip;
    return (
        <HighchartsReact highcharts={this.props.Highcharts} options={options} />
    );
  }
}

export default Highchart;
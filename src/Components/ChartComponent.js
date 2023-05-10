import React from 'react'
import Chart from 'react-apexcharts'
import { formatNumber } from '../Helpers/Util.js'
import './ChartComponentStyle.css';

function ChartComponent(props) {
  const {title, line1, line2, xname, data1, data2, categories, isMobile} = props
  let options = {
    options: {
      chart: {
        shadow: {
          enabled: true,
          color: '#000',
          top: 18,
          left: 7,
          blur: 10,
          opacity: 1
        },
        toolbar: {
          show: true
        }
      },
      tooltip: {
        followCursor: true,
      },
      colors: ['#20B1DF', '#DF4E20'],
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth'
      },
      markers: {
        size: 0
      },
      title: {
        text: title,
        align: 'left'
      },
      xaxis: {
        categories: categories,
        labels: {
          // rotate: -45,
          // rotateAlways: rotate,
          hideOverlappingLabels: true,
        },
        title: {
          text: xname
        },

      },
      yaxis: {
        title: {
          text: 'Patrimônio'
        },
        labels: {
          formatter: (value) => { return formatNumber(value, "currency").slice(0,-3) },
        },
        min: 0,
        forceNiceScale: true
      },
      legend: {
        position: 'top',
        horizontalAlign: 'right',
      },
      theme: {
        mode: 'light', 
        palette: 'palette2', 
      }
    },
    series: [
      {
        name: line1,
        data: data1
      },
      {
        name: line2,
        data: data2
      }
    ]
  }
  return (
    <Chart
      options={options.options}
      series={options.series}
      type="line"
      className={isMobile ? "chartMobile" : "chart"}
    />
  )
}

export default ChartComponent;

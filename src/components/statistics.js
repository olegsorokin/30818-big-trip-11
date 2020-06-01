import AbstractSmartComponent from "./abstract-smart-component";
import Chart from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {allTypes} from "../const";
import {getDuration} from "../utils/common";

const BAR_HEIGHT = 55;

const createStatisticsTemplate = () => {
  return (
    `<section class="statistics">
      <h2 class="visually-hidden">Trip statistics</h2>

      <div class="statistics__item statistics__item--money">
        <canvas class="statistics__chart  statistics__chart--money" width="900"></canvas>
      </div>

      <div class="statistics__item statistics__item--transport">
        <canvas class="statistics__chart  statistics__chart--transport" width="900"></canvas>
      </div>

      <div class="statistics__item statistics__item--time-spend">
        <canvas class="statistics__chart  statistics__chart--time" width="900"></canvas>
      </div>
    </section>`
  );
};

const createChartData = (valueCallback) => {
  return allTypes
    .map((type) => {
      return {
        label: type.toUpperCase(),
        value: valueCallback(type)
      }
    })
    .filter((it) => it.value > 0)
    .sort((a, b) => b.value - a.value);
};

const getOptions = (title, formatter) => {
  return {
    plugins: {
      datalabels: {
        font: {
          size: 13
        },
        color: `#000000`,
          anchor: 'end',
          align: 'start',
          formatter
      }
    },
    title: {
      display: true,
        text: title,
        fontColor: `#000000`,
        fontSize: 23,
        position: `left`
    },
    scales: {
      yAxes: [{
        ticks: {
          fontColor: `#000000`,
          padding: 5,
          fontSize: 13,
        },
        gridLines: {
          display: false,
          drawBorder: false
        },
        barThickness: 44,
      }],
        xAxes: [{
        ticks: {
          display: false,
          beginAtZero: true,
        },
        gridLines: {
          display: false,
          drawBorder: false
        },
        minBarLength: 50
      }],
    },
    legend: {
      display: false
    },
    tooltips: {
      enabled: false,
    }
  }
};

const renderMoneyChart = (moneyCtx, points) => {
  const moneyChartData = createChartData((type) => {
    return points.reduce((acc, point) => point.type === type ? acc + point.price : acc, 0);
  })

  moneyCtx.height = BAR_HEIGHT * moneyChartData.length;

  return new Chart(moneyCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: moneyChartData.map((it) => it.label),
      datasets: [{
        data: moneyChartData.map((it) => it.value),
        backgroundColor: `#ffffff`,
        hoverBackgroundColor: `#ffffff`,
        anchor: `start`
      }]
    },
    options: getOptions(`MONEY`, (val) => `$ ${val}`)
  });
}

const renderTransportChart = (transportCtx, points) => {
  const transportChartData = createChartData((type) => {
    return points.reduce((acc, point) => point.type === type ? ++acc : acc, 0);
  })

  transportCtx.height = BAR_HEIGHT * transportChartData.length;

  return new Chart(transportCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: transportChartData.map((it) => it.label),
      datasets: [{
        data: transportChartData.map((it) => it.value),
        backgroundColor: `#ffffff`,
        hoverBackgroundColor: `#ffffff`,
        anchor: `start`
      }]
    },
    options: getOptions(`TRANSPORT`, (val) => `${val}x`)
  });
}

const renderTimeChart = (transportCtx, points) => {
  const calculateDuration = (type) => {
    const result = points.reduce((acc, point) => {
      return point.type === type ? acc + getDuration(point.startTime, point.endTime) : acc;
    }, 0);

    return Math.round(result);
  };

  const timeChartData = createChartData((type) => {
    return calculateDuration(type);
  })

  transportCtx.height = BAR_HEIGHT * timeChartData.length;

  return new Chart(transportCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: timeChartData.map((it) => it.label),
      datasets: [{
        data: timeChartData.map((it) => it.value),
        backgroundColor: `#ffffff`,
        hoverBackgroundColor: `#ffffff`,
        anchor: `start`
      }]
    },
    options: getOptions(`TIME SPENT`, (val) => `${val}H`)
  });
}

export default class Statistics extends AbstractSmartComponent {
  constructor(points) {
    super();

    this._points = points;
    this._moneyChart = null;
    this._transportChart = null;
    this._timeChart = null;

    this._renderCharts();
  }

  getTemplate() {
    return createStatisticsTemplate();
  }

  show() {
    super.show();

    this.rerender(this._points);
  }

  recoveryListeners() {}

  rerender(points) {
    this._points = points;

    super.rerender();

    this._renderCharts();
  }

  _renderCharts() {
    const element = this.getElement();

    const moneyCtx = element.querySelector(`.statistics__chart--money`);
    const transportCtx = element.querySelector(`.statistics__chart--transport`);
    const timeCtx = element.querySelector(`.statistics__chart--time`);

    this._resetCharts();

    this._moneyChart = renderMoneyChart(moneyCtx, this._points);
    this._transportChart = renderTransportChart(transportCtx, this._points);
    this._timeChart = renderTimeChart(timeCtx, this._points);
  }

  _resetCharts() {
    if (this._moneyChart) {
      this._moneyChart.destroy();
      this._moneyChart = null;
    }

    if (this._transportChart) {
      this._transportChart.destroy();
      this._transportChart = null;
    }

    if (this._timeChart) {
      this._timeChart.destroy();
      this._timeChart = null;
    }
  }
}

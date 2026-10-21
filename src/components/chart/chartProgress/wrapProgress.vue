<template>
  <div id="chartOrderBar">
    <apexchart
      type="bar"
      height="350"
      :options="chartOptions"
      :series="series"
    />
  </div>
</template>

<script>
export default {
  name: "WrapProgress",
  props: ["data"],
  data: () => ({
    loaded: false,
    percent: [],
    series: [
      {
        data: [],
        name: ""
      }
    ],
    chartOptions: {
      chart: {
        toolbar: {
          tools: {
            download: false
          }
        }
      },
      grid: {
        show: true,
        xaxis: {
          lines: {
            show: false
          }
        },
        yaxis: {
          lines: {
            show: false
          }
        },
        row: {
          opacity: 0
        }
      },

      plotOptions: {
        bar: {
          horizontal: false
        }
      },
      dataLabels: {
        enabled: false
      },
      xaxis: {
        categories: []
      }
    }
  }),
  watch: {
    data(e) {
      this.percent = e.percent
      this.series = [
        {
          data: e.data.map(e => {
            return +e
          })
        }
      ]
      let a = this.percent
      this.chartOptions = {
        xaxis: {
          categories: e.labels
        },
        tooltip: {
          // eslint-disable-next-line no-unused-vars
          custom: ({ series, seriesIndex, dataPointIndex, w }) => {
            return `<div class='chart__customTooltip'>
                                    <div>
                                        <div class="header">
                                        <span class="name">
                                            ${e.labels[dataPointIndex]}
                                        </span>
                                        </div>
                                        <div class="content">
                                            <span class='name'>${series[seriesIndex][dataPointIndex]} грн /</span>
                                            <span class='value'>${a[dataPointIndex]} %</span>
                                        </div>
                                        <div class="footer"></div>
                                    </div>

                                </div>`
          }
        }
      }
    }
  }
}
</script>

<style scoped></style>

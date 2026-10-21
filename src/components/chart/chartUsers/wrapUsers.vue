<template>
  <div class="container__wrap">
    <div class="chartAplex">
      <apexchart
        type="pie"
        width="100%"
        height="100%"
        :options="chartOptions"
        :series="series"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: "WrapUsers",
  props: ["data"],
  data: () => ({
    loaded: false,
    series: [],
    chartOptions: {
      colors: ["#64DD17", "#F24949", "#FCBD00"],
      tooltip: {
        theme: true,
        fillSeriesColor: false
      },
      plotOptions: {
        pie: {
          size: 110
        }
      },
      stroke: {
        width: 0
      },
      dataLabels: {
        enabled: false
      },
      labels: [],
      legend: {
        showForSingleSeries: true,
        showForZeroSeries: true,
        inverseOrder: false,
        position: "right",
        itemMargin: {
          horizontal: 20,
          vertical: 5
        },
        floating: false,
        onItemHover: {
          highlightDataSeries: true
        },
        onItemClick: {
          toggleDataSeries: true
        }
      },
      responsive: [
        {
          breakpoint: 1920,
          chart: {
            height: 400
          },
          options: {
            legend: {
              position: "right"
            }
          }
        },
        {
          breakpoint: 1440,
          options: {
            plotOptions: {
              pie: {
                size: 110
              }
            },
            legend: {
              position: "right"
            }
          }
        },
        {
          breakpoint: 1290,
          options: {
            legend: {
              position: "right"
            }
          }
        },
        {
          breakpoint: 768,
          options: {
            chart: {
              width: "100%",
              height: "100%"
            },
            plotOptions: {
              pie: {
                size: 80
              }
            },
            legend: {
              position: "top"
            }
          }
        }
      ]
    }
  }),
  watch: {
    data(e) {
      let a = e.users.map(i => {
        return +i
      })
      this.chartOptions = {
        labels: e.labels,
        tooltip: {
          // eslint-disable-next-line no-unused-vars
          custom: ({ series, seriesIndex, dataPointIndex, w }) => {
            return (
              `<div class='chart__customTooltip'>
                                    <div>
                                        <div class="header"></div>
                                        <div class="content">
                                            <span class='name'>${
                                              e.labels[seriesIndex]
                                            }:</span>
                                            <span class='value'>${
                                              e.users[seriesIndex]
                                            }</span> /
                                            <span class='value'>${(
                                              (e.users[seriesIndex] * 100) /
                                              e.total
                                            ).toFixed(0)}</span>%
                                        </div>
                                        <div class="footer">
                                            ` + //<span class='name'>${this.series[seriesIndex].data[dataPointIndex].name}:</span>`
              //<span class='value'>${series[seriesIndex][dataPointIndex]} грн</span>
              `</div>
                                    </div>

                                </div>`
            )
          }
        }
      }
      this.series = a
    }
  }
}
</script>

<style scoped></style>

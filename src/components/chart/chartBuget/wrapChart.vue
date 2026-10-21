<template>
  <div class="containerChart">
    <div class="item__head">
      <div class="caption">Статистика бюджетiв</div>
      <div class="item__head__wrap">
        <div class="item__head__box">
          <div class="item__head-selectPeriod">
            <div class="block">
              <el-date-picker
                v-model="value1"
                popper-class="rangePickerDrop"
                format="dd/MM/yyyy"
                type="daterange"
                align="center"
                unlink-panels
                range-separator="по"
                start-placeholder="Початок"
                end-placeholder="Кiнець"
                :picker-options="
                  !$store.getters['params/mobileView']
                    ? pickerOptions
                    : pickerOptionsMobile
                "
              />
            </div>
          </div>
        </div>
        <div class="item__head__box">
          <div class="item__head-selectLocation">
            <v-select
              v-model="dataListLocationItem"
              attach
              :items="dataListLocation"
              item-text="name"
              item-value="id"
              class="solo-hint"
              label="Локацiя"
              flat
              hide-details
              solo
            />
          </div>
        </div>
        <div
          v-if="dataListLocationItem"
          class="item__head__box flex-grow-0 flex no-wrap"
        >
          <v-switch
            v-model="allBudjet"
            hide-details
            color="#19B200"
            :label="`всi бюджети`"
          />
        </div>
      </div>
    </div>
    <div id="chart" class="chart-container">
      <apexchart
        type="area"
        height="350"
        :options="chartOptions"
        :series="series"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: "WrapChart",
  // eslint-disable-next-line vue/require-prop-types
  props: ["dataListLocation"],
  data: () => ({
    loaded: false,
    allBudjet: true,
    chartOptions: {
      legend: {
        show: true,
        showForSingleSeries: true,
        onItemClick: {
          toggleDataSeries: true
        },
        onItemHover: {
          highlightDataSeries: true
        }
      },
      tooltip: {
        style: {
          fontSize: "14px",
          fontFamily: "Roboto"
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        curve: "stepline",
        lineCap: "butt",
        colors: undefined,
        width: 2,
        dashArray: 0
      },
      markers: {
        size: 6,
        shape: "circle",
        hover: {
          sizeOffset: 2
        }
      },
      chart: {
        locales: [
          {
            name: "en",
            options: {
              months: [
                "Січень",
                "Лютий",
                "Березень",
                "Квітень",
                "Травень",
                "Червень",
                "Липень",
                "Серпень",
                "Вересень",
                "Жовтень",
                "Листопад",
                "Грудень"
              ],
              shortMonths: [
                "Січ",
                "Лют",
                "Бер",
                "Квіт",
                "Трав",
                "Чер",
                "Лип",
                "Серп",
                "Вер",
                "Жов",
                "Лист",
                "Груд"
              ],
              days: [
                "неділя",
                "понеділок",
                "вівторок",
                "середа",
                "четвер",
                "п’ятниця",
                "субота"
              ],
              shortDays: ["нед", "пон", "вівт", "сер", "четв", "п’ят", "суб"],
              toolbar: {
                download: "Завантажити SVG",
                selection: "Selection",
                selectionZoom: "Режим масштабу",
                zoomIn: "Масштаб бiльше",
                zoomOut: "Масштаб менше",
                pan: "Схоплення",
                reset: "Повернути в початкове положення"
              }
            }
          }
        ],
        zoom: {
          type: "x",
          enabled: true,
          autoScaleYaxis: true
        },
        toolbar: {
          tools: {
            download: false
          }
        },
        id: "vuechart-example"
      },
      yaxis: {
        max: undefined,
        min: undefined,
        show: true,
        logarithmic: false,
        labels: {
          // eslint-disable-next-line no-unused-vars
          formatter: function(val, index) {
            return val.toFixed(0)
          }
        },
        tooltip: {
          enabled: true,
          offsetX: 0
        }
      },
      xaxis: {
        type: "datetime",
        axisBorder: {
          show: false,
          color: "#78909C",
          height: 0,
          width: "100%",
          offsetX: 0,
          offsetY: 0
        },
        axisTicks: {
          show: false,
          borderType: "solid",
          color: "#78909C",
          height: 6,
          offsetX: 0,
          offsetY: 0
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
      }
    },
    series: [],
    dataListLocationItem: 0,
    selectDateItem: 0,
    pickerOptionsMobile: {
      shortcuts: false
    },
    pickerOptions: {
      shortcuts: [
        {
          text: "за тиждень",
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit("pick", [start, end])
          }
        },
        {
          text: "мiсяць",
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit("pick", [start, end])
          }
        },
        {
          text: "3 мiсяця",
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit("pick", [start, end])
          }
        }
      ]
    },
    value1: "",
    value2: ""
  }),
  watch: {
    allBudjet() {
      this.getDataFromApi()
    },
    dataListLocationItem(e) {
      if (!e) {
        this.allBudjet = true
      }
      this.getDataFromApi()
    },
    // eslint-disable-next-line no-unused-vars
    value1(e) {
      this.loaded = false
      setTimeout(() => {
        this.loaded = true
      }, 100)
      this.rangeDataDefault()
    },
    // eslint-disable-next-line no-unused-vars
    selectDateItem(e) {
      this.getDataFromApi()
    }
  },
  mounted() {
    this.getDataFromApi()
    this.chartOptions = {
      tooltip: {
        // eslint-disable-next-line no-unused-vars
        custom: ({ series, seriesIndex, dataPointIndex, w }) => {
          return (
            `<div class='chart__customTooltip'>
                                    <div>
                                        <div class="header"></div>
                                        <div class="content">
                                            <span class='name'>${this.series[seriesIndex].name}:</span>
                                            <span class='value'>${series[seriesIndex][dataPointIndex]} грн</span>
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
  },
  methods: {
    getDataFromApi() {
      this.loaded = false
      this.$api
        .post("/dashboard/get-budget", {
          location_id: this.dataListLocationItem,
          format: this.selectDateItem,
          all_budget: this.allBudjet
        })
        .then(response => {
          let opt = response.data.sets
          this.series = opt.map(e => {
            return {
              data: e.data,
              name: e.label
            }
          })

          this.loaded = true
          this.$nextTick(() => {
            this.rangeDataDefault()
          })
        })
    },
    rangeDataDefault() {
      let e = this.value1
      let end = new Date()
      let start = new Date()
      const dataChartXY = this.series
      // eslint-disable-next-line no-unused-vars
      let zoomVal = false

      function logMin(val) {
        val *= 1.3
        let n = val.toFixed(0).toString().length - 3
        n *= -1
        n = Math.pow(10, n || 0)
        let min = false
        if (val < 0) {
          min = true
        }
        if (!min) {
          return Math.ceil(val * n) / n
        } else {
          return Math.floor(val * n) / n
        }
      }

      function logMax(val) {
        val *= 1.3
        let n = val.toFixed(0).toString().length - 3
        n *= -1
        n = Math.pow(10, n || 0)
        let min = true
        if (val < 0) {
          min = false
        }
        if (!min) {
          return Math.ceil(val * n) / n
        } else {
          return Math.floor(val * n) / n
        }
      }

      function secMap(start, end) {
        let secStart = Date.parse(start)
        let secEnd = Date.parse(end)
        let min = 1000000000
        let max = -1000000000
        let arrSeriesY = []
        let Ymin = -1000000000
        let Ymax = 1000000000
        let MinMax = []
        let MinMax_min = 0

        dataChartXY.map(e => {
          // console.log(e);
          // eslint-disable-next-line no-unused-vars
          let ctx = e
          e.data.map((i, key) => {
            arrSeriesY.push(i.y)
            MinMax.push(i.x)
            Ymin = Math.min(...arrSeriesY)
            Ymax = Math.max(...arrSeriesY)
            MinMax_min = MinMax.filter(n => {
              if (n >= secStart) {
                return n > secStart
              }
            })
            if (MinMax_min.length) {
              MinMax_min = MinMax_min[0]
            }
            if (i.x >= secStart && i.x <= secEnd) {
              min = logMin(Ymin)
              max = logMax(Ymax)
              // console.log(min, max)
            }
            if (MinMax_min >= secStart && max == -1000000000) {
              if (e.data[key - 1].y > 0) {
                max = logMax(Ymax)
                min = 0
              }
              if (e.data[key - 1].y < 0) {
                max = logMax(Ymax)
                min = logMin(e.data[key - 1].y)
              }
            }
          })
        })
        // if (min == 1000000000) {
        //
        //     min = -1000000000;
        //     max = 1000000000;
        //
        // }
        return {
          min: min,
          max: max
        }
      }

      if (this.value1 == "") {
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
        this.value1 = [start, end]
      }
      if (this.value1 == null) {
        this.chartOptions = {
          yaxis: {
            max: undefined,
            min: undefined
          },
          xaxis: {
            min: undefined,
            max: undefined
          }
        }
      } else {
        let a = secMap(e[0], e[1])
        this.chartOptions = {
          chart: {
            events: {
              // eslint-disable-next-line no-unused-vars
              zoomed: (chartContext, { xaxis, yaxis }) => {
                if (xaxis.min !== undefined) {
                  let zoomMin = new Date(xaxis.min)
                  let zoomMax = new Date(xaxis.max)
                  this.value1 = [zoomMin, zoomMax]
                }
              }
            }
          },
          yaxis: {
            labels: {
              formatter: function(val) {
                return val.toFixed(0)
              }
            },
            max: a.max,
            min: a.min
          },
          xaxis: {
            min: new Date(e[0]).getTime(),
            max: new Date(e[1]).getTime()
          }
        }
      }
    }
  }
}
</script>

<style scoped></style>

<template>
  <div class="ukChart">
    <div id="chartdiv" ref="chartdiv"></div>
  </div>
</template>

<script>
import * as am4core from "@amcharts/amcharts4/core"
import * as am4maps from "@amcharts/amcharts4/maps"
import am4geodata_usaLow from "../i18n/amchart/ukraineHigh"

// am4core.useTheme(am4geodata_usaLow);
export default {
  name: "ChartStatick",
  data: () => ({}),
  mounted() {
    /* Chart code */
    // Themes begin

    // Themes end

    // Create map instance
    let chart = am4core.create("chartdiv", am4maps.MapChart)
    chart.maxZoomLevel = 3

    // Set map definition
    chart.geodata = am4geodata_usaLow

    // Set projection
    chart.projection = new am4maps.projections.Miller()

    // Add button
    let zoomOut = chart.tooltipContainer.createChild(am4core.ZoomOutButton)
    zoomOut.align = "right"
    zoomOut.valign = "top"
    zoomOut.margin(20, 20, 20, 20)
    zoomOut.events.on("hit", function() {
      if (currentSeries) {
        currentSeries.hide()
      }
      chart.goHome()
      zoomOut.hide()
      currentSeries = regionalSeries.US.series
      currentSeries.show()
    })
    zoomOut.hide()

    // Create map polygon series
    let polygonSeries = chart.series.push(new am4maps.MapPolygonSeries())
    polygonSeries.useGeodata = true
    polygonSeries.calculateVisualCenter = true
    // Configure series
    let polygonTemplate = polygonSeries.mapPolygons.template
    polygonTemplate.tooltipText = "{name}"
    polygonTemplate.fill = chart.colors.getIndex(0)

    // Load data when map polygons are ready
    chart.events.on("ready", loadStores)
    let api = this.$api
    // Loads store data
    function loadStores() {
      // let loader = new am4core.DataSource();
      // loader.url = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/t-160/TargetStores.json";
      // loader.events.on("parseended", function(ev) {
      //     setupStores(ev.target.data);
      // });
      // loader.load();
      let data
      api.post("/dashboard/map").then(response => {
        data = response.data.data
        setupStores({ query_results: data })
      })
      // setupStores({query_results:[
      //         {
      //             "co_loc_n":"Київ",
      //             "MAIL_ST_PROV_C":"30",
      //             "LNGTD_I":"30.5238",
      //             "LATTD_I":"50.45466",
      //             "mail_city_n":"Київ",
      //             "count":1
      //         },
      //         {
      //             "co_loc_n":"Київ",
      //             "MAIL_ST_PROV_C":"30",
      //             "LNGTD_I":"30.5238",
      //             "LATTD_I":"50.45466",
      //             "mail_city_n":"Київ",
      //             "count":13
      //         },
      //         {
      //         "co_loc_n":"Черкаська область",
      //         "MAIL_ST_PROV_C":"71",
      //         "LNGTD_I":"32.0593157",
      //         "LATTD_I":"49.4464023",
      //         "mail_city_n":"Черкаська область",
      //         "count":555.45
      //     },
      // ]})
    }

    // Creates a series
    function createSeries(heatfield) {
      let series = chart.series.push(new am4maps.MapImageSeries())
      series.dataFields.value = heatfield

      let template = series.mapImages.template
      template.verticalCenter = "middle"
      template.horizontalCenter = "middle"
      template.propertyFields.latitude = "lat"
      template.propertyFields.longitude = "long"
      template.tooltipText =
        "{name}:\n[bold]{stores} грн. \nЗамовлень {count}[/]"

      let circle = template.createChild(am4core.Circle)
      circle.radius = 10
      circle.fillOpacity = 0.7
      circle.fill = am4core.color("#F00")
      circle.verticalCenter = "middle"
      circle.horizontalCenter = "middle"
      circle.nonScaling = true

      let label = template.createChild(am4core.Label)
      label.text = "{stores}"
      label.fill = am4core.color("#fff")
      label.verticalCenter = "middle"
      label.horizontalCenter = "middle"
      label.nonScaling = true

      // eslint-disable-next-line no-unused-vars
      let heat = series.heatRules.push({
        target: circle,
        property: "radius",
        min: 10,
        max: 30
      })

      // Set up drill-down
      series.mapImages.template.events.on("hit", function(ev) {
        return
        // Determine what we've clicked on
        // eslint-disable-next-line no-unreachable
        let data = ev.target.dataItem.dataContext

        // No id? Individual store - nothing to drill down to further
        if (!data.target) {
          return
        }

        // Create actual series if it hasn't been yet created
        if (!regionalSeries[data.target].series) {
          regionalSeries[data.target].series = createSeries("count")
          regionalSeries[data.target].series.data = data.markerData
        }

        // Hide current series
        if (currentSeries) {
          currentSeries.hide()
        }

        // Control zoom
        if (data.type == "state") {
          let statePolygon = polygonSeries.getPolygonById("US-" + data.state)
          chart.zoomToMapObject(statePolygon)
        } else if (data.type == "city") {
          chart.zoomToGeoPoint(
            {
              latitude: data.lat,
              longitude: data.long
            },
            64,
            true
          )
        }
        zoomOut.show()

        // Show new targert series
        currentSeries = regionalSeries[data.target].series
        currentSeries.show()
      })

      return series
    }

    let regionalSeries = {}
    let currentSeries

    function setupStores(data) {
      // Init country-level series
      regionalSeries.US = {
        markerData: [],
        series: createSeries("stores")
      }

      // Set current series
      currentSeries = regionalSeries.US.series

      // Process data
      am4core.array.each(data.query_results, function(store) {
        // Get store data
        store = {
          state: store.MAIL_ST_PROV_C,
          long: am4core.type.toNumber(store.LNGTD_I),
          lat: am4core.type.toNumber(store.LATTD_I),
          location: store.co_loc_n,
          city: store.mail_city_n,
          count: am4core.type.toNumber(store.count),
          total_orders: store.total_orders
        }

        // Process state-level data
        if (regionalSeries[store.state] == undefined) {
          let statePolygon = polygonSeries.getPolygonById("UA-" + store.state)
          if (statePolygon) {
            // Add state data
            regionalSeries[store.state] = {
              target: store.state,
              type: "state",
              name: statePolygon.dataItem.dataContext.name,
              count: store.total_orders,
              stores: store.count,
              lat: statePolygon.visualLatitude,
              long: statePolygon.visualLongitude,
              state: store.state,
              markerData: []
            }
            regionalSeries.US.markerData.push(regionalSeries[store.state])
          } else {
            // State not found
            return
          }
        } else {
          regionalSeries[store.state].stores += store.count
          regionalSeries[store.state].count += store.total_orders
        }
        // Process city-level data
        if (regionalSeries[store.city] == undefined) {
          regionalSeries[store.city] = {
            target: store.city,
            type: "city",
            name: store.city,
            count: store.total_orders,
            stores: store.count,
            lat: store.lat,
            long: store.long,
            state: store.state,
            markerData: []
          }
          regionalSeries[store.state].markerData.push(
            regionalSeries[store.city]
          )
        } else {
          regionalSeries[store.city].stores += store.count
          regionalSeries[store.city].count += store.total_orders
        }

        // Process individual store
        // regionalSeries[store.city].markerData.push({
        //     name: store.location,
        //     count: 1,
        //     stores: store.count,
        //     lat: store.lat,
        //     long: store.long,
        //     state: store.state
        // });
      })
      regionalSeries.US.series.data = regionalSeries.US.markerData
    }
  },

  beforeDestroy() {
    if (this.chart) {
      this.chart.dispose()
    }
  }
}
</script>

<style scoped>
.ukChart {
  width: 100%;
  height: 100%;
}
#chartdiv {
  height: 100%;
  width: 100%;
}
</style>

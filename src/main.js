import App from "./App.vue"
import Vue from "vue"
import Vuetify from "vuetify"
import router from "./router"
import store from "./store"
import Vuelidate from "vuelidate"

import moment from "moment"
import VueSocketIO from "vue-socket.io"
import BootstrapVue from "bootstrap-vue"
import jQuery from "jquery"
import Slick from "vue-slick"
import AOS from "aos"
import PerfectScrollbar from "vue2-perfect-scrollbar"
import ElementUI from "element-ui"
import locale from "element-ui/lib/locale/lang/ua"
import Chat from "./components/vue-chat/src"
import uk from "./i18n/vuetify/uk"
import socketio from "socket.io-client"
import c_chips from "./components/customUI/c_chips"
import author from "./components/customUI/author"
import my_dialog from "./components/customUI/my-dialog"
import VueApexCharts from "vue-apexcharts"
import VueNumber from "vue-number-animation"
import ScrollLoader from "vue-scroll-loader"
import { VueMasonryPlugin } from "vue-masonry"
import hotjar from "vue-hotjar"

import lazySizes from 'lazysizes';
// other imports ...

lazySizes.cfg.expand = 0;

import './plugins/filters'

window.jQuery = window.$ = jQuery
var VueScrollTo = require("vue-scrollto")
import { directive as onClickOutside } from "vue-on-click-outside"

Vue.directive("on-click-outside", onClickOutside)

//=============================================================================css
import "slick-carousel/slick/slick.css"
import "bootstrap/dist/css/bootstrap.css"
import "bootstrap-vue/dist/bootstrap-vue.css"
import "vue2-perfect-scrollbar/dist/vue2-perfect-scrollbar.css"
import "element-ui/lib/theme-chalk/index.css"
import "material-design-icons-iconfont/dist/material-design-icons.css"
import "aos/dist/aos.css"
//===============================================================================icons
import { library } from "@fortawesome/fontawesome-svg-core"
import { fas } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome"

library.add(fas)
//============================================================apiService && tokenService
import ApiService from "./services/api.service"
import { TokenService } from "./services/storage.service"
import Permission from "./services/permission.service"

ApiService.init(process.env.VUE_APP_API_HOST)
// ApiService.init('https://api.salvi.ua/v1')

// If token exists set header
if (TokenService.getToken()) {
  ApiService.setHeader()
}
//==================================================================================VueUse
Vue.use(Vuelidate)
Vue.use(Chat)
Vue.use(ScrollLoader)
Vue.use(BootstrapVue)
Vue.use(Vuetify, {
  lang: {
    locales: { uk },
    current: "uk"
  }
})
Vue.use(VueApexCharts)
Vue.use(ElementUI, { locale })
Vue.use(VueMasonryPlugin)
Vue.use(hotjar, {
  id: "1902333", // Hotjar Site ID
  isProduction: true,
  snippetVersion: 6
})
let current_user = localStorage.getItem("current_user")
let userId = 0
if (current_user != null) {
  current_user = JSON.parse(current_user)
  userId = current_user.id
}
const SocketInstance = socketio.connect(process.env.VUE_APP_SOCKET, {
  query: {
    id: userId
  }
})
Vue.use(
  new VueSocketIO({
    debug: false,
    connection: SocketInstance
  })
)
Vue.use(VueScrollTo, {
  container: "body",
  duration: 500,
  easing: "ease",
  offset: 0,
  force: true,
  cancelable: true,
  onStart: false,
  onDone: false,
  onCancel: false,
  x: false,
  y: true
})
Vue.use(VueNumber)
Vue.prototype.$api = ApiService
Vue.prototype.$permission = Permission
Vue.prototype.$rbac = {}
Vue.prototype.$changeRbac = function(data) {
  Vue.prototype.$rbac = data
}
Vue.directive("scroll", {
  inserted: function(el, binding) {
    let f = function(evt) {
      if (binding.value(evt, el)) {
        window.removeEventListener("scroll", f)
      }
    }
    window.addEventListener("scroll", f)
  }
})
Vue.component("font-awesome-icon", FontAwesomeIcon)
Vue.component("c_chips", c_chips)
Vue.component("author", author)
Vue.component("my-dialog", my_dialog)
Vue.component("apexchart", VueApexCharts)

Vue.config.productionTip = false

Vue.filter("formatDateSlash", function(value) {
  value = value * 1000
  if (value) {
    return moment(value).format("MM/DD/YYYY")
  }
})
var filter = function(text, length, clamp) {
  clamp = clamp || "..."
  var node = document.createElement("div")
  node.innerHTML = text
  var content = node.textContent
  return content.length > length ? content.slice(0, length) + clamp : content
}
Vue.filter("truncate", filter)
Vue.filter("formatDateDot", function(value) {
  value = value * 1000
  if (value) {
    return moment(value).format("DD.MM.YYYY")
  }
})

Vue.filter("formatDateDotWithTime", function(value) {
  value = value * 1000
  if (value) {
    return moment(value).format("DD.MM.YYYY, HH:mm")
  }
})

Vue.filter("formatDateMinus", function(value) {
  value = value * 1000
  if (value) {
    return moment(value).format("YYYY-MM-DD")
  }
})
Vue.directive("disable-all", {
  // When all the children of the parent component have been updated
  componentUpdated: function(el, binding) {
    if (!binding.value) {
      const tags = ["input", "button", "textarea", "select"]
      tags.forEach(tagName => {
        const nodes = el.getElementsByTagName(tagName)
        for (let i = 0; i < nodes.length; i++) {
          if (nodes[i].dataset.exclude == undefined) {
            nodes[i].disabled = false
            nodes[i].tabIndex = 1
          }
        }
      })
      let classNodes = el.getElementsByClassName("v-input")
      for (let a = 0; a < classNodes.length; a++) {
        classNodes[a].classList.remove("v-input--is-disabled")
      }
    } else {
      const tags = ["input", "button", "textarea", "select"]
      tags.forEach(tagName => {
        const nodes = el.getElementsByTagName(tagName)
        for (let i = 0; i < nodes.length; i++) {
          nodes[i].disabled = true
          nodes[i].tabIndex = -1
        }
      })
      let classNodes = el.getElementsByClassName("v-input")
      for (let a = 0; a < classNodes.length; a++) {
        classNodes[a].className += " v-input--is-disabled "
      }
    }
  }
})
// eslint-disable-next-line no-unused-vars
Vue.directive("hide-empty", function(el, binding) {
  let elements = el.childNodes
  if (elements.length > 0) {
    let count = 0
    elements.forEach(function(value) {
      if (value.style != undefined && value.style.display == "") {
        count += 1
      }
    })
    if (count > 1) {
      el.style.display = "block"
    } else {
      el.style.display = "none"
    }
  }
})
Vue.use(PerfectScrollbar)

Vue.config.wswipeEasing = true
Vue.config.devtools = true;

Vue.prototype.$loadingBus = new Vue()
new Vue({
    globals: {
        cartChanged: false,
    },
  data: function() {
    return {
      rbac: { test: "" }
    }
  },
  created() {
    AOS.init()
  },
  router,
  store,
  render: h => h(App)
}).$mount("#app")

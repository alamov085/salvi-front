import Vue from "vue"
import Vuex from "vuex"
import auth from "./store/auth.module"
import params from "./store/params.module"
import user from "./store/user.module"
import permissionStore from "./store/permissionStore.module"
import chat from "./store/chat.module"
import basket from "./store/basket.module"
import category from "./store/category.module"

Vue.use(Vuex)

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    auth,
    params,
    user,
    permissionStore,
    chat,
    basket,
    category
  },
  getters: {}
})

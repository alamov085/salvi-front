const state = {
  bodyMin: false,
  mobileView: false,
  search: "",
  searchCatalog: ""
}

const getters = {
  bodyMin: state => {
    return state.bodyMin
  },
  mobileView: state => {
    return state.mobileView
  },
  search: state => {
    return state.search
  }
}
const actions = {
  setCollaps({ commit }, { ctx }) {
    commit("setMutation", ctx)
  },
  setMobileView({ commit }, { ctx }) {
    commit("setMobileMutation", ctx)
  },
  setSearch({ commit }, { ctx }) {
    commit("setSearchMutation", ctx)
  }
}
const mutations = {
  setMutation(state, ctx) {
    state.bodyMin = ctx
  },
  setMobileMutation(state, ctx) {
    state.mobileView = ctx
  },
  // eslint-disable-next-line no-unused-vars
  setSearchMutation(state, ctx) {
    // state.search = ctx
    state.search = ""
  }
}
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}

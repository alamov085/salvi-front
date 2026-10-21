const state = {
  current_user: localStorage.getItem("current_user"),
  locationId: JSON.parse(window.localStorage.getItem("basketLastOrder"))
}

const getters = {
  currentUser: state => {
    return JSON.parse(state.current_user)
  },
  currentLocation: state => {
    if (state.locationId == null) {
      return 0
    }
    if (state.locationId.location_id == undefined) {
      return 0
    }
    return state.locationId.location_id
  }
}
const actions = {
  setData({ commit }, { ctx }) {
    commit("set", ctx)
  },
  setLocation({ commit }, { ctx }) {
    commit("setLocation", ctx)
  },
  removeLocation({ commit }, { ctx }) {
    commit("removeLocation", ctx)
  }
}
const mutations = {
  set(state, ctx) {
    localStorage.setItem("current_user", ctx)
    state.current_user = localStorage.getItem("current_user")
  },
  setLocation(state, ctx) {
    state.locationId = JSON.parse(
      window.localStorage.getItem("basketLastOrder")
    )
    return true
    // eslint-disable-next-line no-unreachable
    localStorage.setItem("selected_location", ctx)
    state.locationId = localStorage.getItem("selected_location")
  },
  // eslint-disable-next-line no-unused-vars
  removeLocation(state, ctx) {
    state.locationId = JSON.parse(
      window.localStorage.getItem("basketLastOrder")
    )
    return true
    // eslint-disable-next-line no-unreachable
    localStorage.removeItem("selected_location")
    state.locationId = localStorage.getItem("selected_location")
  }
}
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}

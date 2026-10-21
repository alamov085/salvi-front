const state = {
  permission: localStorage.getItem("user_permissions")
}

const getters = {
  getPermission: state => {
    return JSON.parse(state.permission)
  }
}
const actions = {
  setData({ commit }, { ctx }) {
    commit("set", ctx)
  }
}
const mutations = {
  set(state, ctx) {
    localStorage.setItem("user_permissions", JSON.stringify(ctx))
    state.permission = localStorage.getItem("user_permissions")
  }
}
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}

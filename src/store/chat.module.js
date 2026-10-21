const state = {
  chat: localStorage.getItem("current_chat")
}

const getters = {
  currentChatId: state => {
    let data = JSON.parse(state.chat)
    if (data !== null) {
      if (data.chat_id != undefined) {
        return data.chat_id
      }
    }
    return 0
  },
  currentChatUser: state => {
    let data = JSON.parse(state.chat)
    if (data !== null) {
      if (data.user_id != undefined) {
        return data.user_id
      }
    }
    return 0
  }
}
const actions = {
  setData({ commit }, { ctx }) {
    commit("set", ctx)
  }
}
const mutations = {
  set(state, ctx) {
    localStorage.setItem("current_chat", JSON.stringify(ctx))
    state.chat = localStorage.getItem("current_chat")
  }
}
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}

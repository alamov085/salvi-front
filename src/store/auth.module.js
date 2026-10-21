import { UserService, AuthenticationError } from "../services/user.service"
import { TokenService } from "../services/storage.service"
import router from "../router"

const state = {
  authenticating: false,
  accessToken: TokenService.getToken(),
  authenticationErrorCode: 0,
  authenticationError: ""
}

const getters = {
  loggedIn: state => {
    return state.accessToken ? true : false
  },

  authenticationErrorCode: state => {
    return state.authenticationErrorCode
  },

  authenticationError: state => {
    return state.authenticationError
  },

  authenticating: state => {
    return state.authenticating
  },

  token: state => {
    return state.accessToken
  }
}

const actions = {
  async login({ commit }, { email, password, recaptcha }) {
    commit("loginRequest")
    try {
      const token = await UserService.login(email, password, recaptcha)
      commit("loginSuccess", token)

      // Redirect the user to the page he first tried to visit or to the home view
      router.push(router.history.current.query.redirect || "/catalog")
      return true
    } catch (e) {
      if (e instanceof AuthenticationError) {
        commit("loginError", {
          errorCode: e.errorCode,
          errorMessage: e.message
        })
      }

      return false
    }
  },
  async loginByToken({ commit }, { userToken }) {
    commit("loginRequest")
    try {
      const token = await UserService.loginByToken(userToken)
      commit("loginSuccess", token)

      // Redirect the user to the page he first tried to visit or to the home view
      router.push(router.history.current.query.redirect || "/catalog")
      return true
    } catch (e) {
      if (e instanceof AuthenticationError) {
        commit("loginError", {
          errorCode: e.errorCode,
          errorMessage: e.message
        })
      }

      return false
    }
  },

  logout({ commit }) {
    UserService.logout()
    commit("logoutSuccess")
    router.push("/login")
  }
}

const mutations = {
  loginRequest(state) {
    state.authenticating = true
    state.authenticationError = ""
    state.authenticationErrorCode = 0
  },

  loginSuccess(state, accessToken) {
    state.accessToken = accessToken
    state.authenticating = false
  },

  loginError(state, { errorCode, errorMessage }) {
    state.authenticating = false
    state.authenticationErrorCode = errorCode
    state.authenticationError = errorMessage
  },

  logoutSuccess(state) {
    state.accessToken = ""
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}

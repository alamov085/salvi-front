import ApiService from "./api.service"
import { TokenService } from "./storage.service"
import Permission from "./permission.service"

class AuthenticationError extends Error {
  constructor(errorCode, message) {
    super(message)
    this.name = this.constructor.name
    this.message = message
    this.errorCode = errorCode
  }
}

// eslint-disable-next-line no-unused-vars
class ValidationError extends Error {
  constructor(message) {
    super(message)
    this.name = this.constructor.name
    this.message = message
  }
}

const UserService = {
  /**
   * Login the user and store the access token to TokenService.
   *
   * @returns access_token
   * @throws AuthenticationError
   **/
  login: async function(email, password, recaptcha) {
    const requestData = {
      method: "post",
      url: "/auth/login",
      data: {
        username: email,
        password: password,
        recaptchaToken: recaptcha
      }
    }
    var error = false
    var res = ""
    try {
      const response = await ApiService.customRequest(requestData)

      if (response.data.success) {
        TokenService.saveToken(response.data.access_token)
        localStorage.setItem("current_user", JSON.stringify(response.data.user))
        localStorage.setItem(
          "current_chat",
          JSON.stringify(response.data.current_chat)
        )
        Permission.setPermissions(response.data.permissions)
        // TokenService.saveRefreshToken(response.data.refresh_token)
        ApiService.setHeader()
        // NOTE: We haven't covered this yet in our ApiService
        //       but don't worry about this just yet - I'll come back to it later
        ApiService.mount401Interceptor()
        return response.data.access_token
      } else {
        error = true
        res = response
      }
    } catch (error) {
      // throw new AuthenticationError(error.response.status, error.response.data.detail)
    }
    if (error) {
      throw new AuthenticationError("422", res.data.errors)
    }
  },
  loginByToken: async function(token) {
    const requestData = {
      method: "post",
      url: "/auth/verify-email?token=" + token
    }
    var error = false
    var res = ""
    //console.log('fsd');
    try {
      const response = await ApiService.customRequest(requestData)

      if (response.data.success) {
        TokenService.saveToken(response.data.access_token)
        localStorage.setItem("current_user", JSON.stringify(response.data.user))

        // TokenService.saveRefreshToken(response.data.refresh_token)
        ApiService.setHeader()
        // NOTE: We haven't covered this yet in our ApiService
        //       but don't worry about this just yet - I'll come back to it later
        ApiService.mount401Interceptor()
        return response.data.access_token
      } else {
        error = true
        res = response
      }
    } catch (error) {
      // throw new AuthenticationError(error.response.status, error.response.data.detail)
    }
    if (error) {
      throw new AuthenticationError("422", res.data.errors)
    }
  },

  /**
   * Refresh the access token.
   **/
  refreshToken: async function() {
    const refreshToken = TokenService.getRefreshToken()

    const requestData = {
      method: "post",
      url: "/o/token/",
      data: {
        grant_type: "refresh_token",
        refresh_token: refreshToken
      },
      auth: {
        username: process.env.VUE_APP_CLIENT_ID,
        password: process.env.VUE_APP_CLIENT_SECRET
      }
    }

    try {
      const response = await ApiService.customRequest(requestData)

      TokenService.saveToken(response.data.access_token)
      TokenService.saveRefreshToken(response.data.refresh_token)
      // Update the header in ApiService
      ApiService.setHeader()

      return response.data.access_token
    } catch (error) {
      throw new AuthenticationError(
        error.response.status,
        error.response.data.detail
      )
    }
  },

  /**
   * Logout the current user by removing the token from storage.
   *
   * Will also remove `Authorization Bearer <token>` header from future requests.
   **/
  logout() {
    // Remove the token and remove Authorization header from Api Service as well
    TokenService.removeToken()
    TokenService.removeRefreshToken()
    ApiService.removeHeader()

    // NOTE: Again, we'll cover the 401 Interceptor a bit later.
    ApiService.unmount401Interceptor()
  }
}

export default UserService

export { UserService, AuthenticationError }

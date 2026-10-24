// eslint-disable-next-line no-unused-vars
const USER_PERMISSIONS = "user_permissions"

/**
 * Manage the how Access Tokens are being stored and retreived from storage.
 *
 * Current implementation stores to localStorage. Local Storage should always be
 * accessed through this instace.
 **/
import store from "../store"
const Permission = {
  getPermissions() {
    return store.getters["permissionStore/getPermission"]
  },

  can(permission) {
    if (Permission.getPermissions() == null) {
      return false
    }
    if (Permission.getPermissions().hasOwnProperty(permission)) {
      return true
    } else {
      return false
    }
  },

  setPermissions(permissions) {
    store.commit("permissionStore/set", permissions)
    // store.setData({ctx:response.data.user});
    // localStorage.setItem(USER_PERMISSIONS, JSON.stringify(permissions))
  },
  profileCompleted() {
    let data = localStorage.getItem("current_user")
    if (!data || data === "undefined") {
      return true
    }
    let user = null
    try {
      user = JSON.parse(data)
    } catch (e) {
      return true
    }
    if (user === null) {
      return true
    }
    if (!user.first_name) {
      return false
    }
    if (!user.last_name) {
      return false
    }
    if (!user.phone_number) {
      return false
    }
    return true
  }
}

export default Permission

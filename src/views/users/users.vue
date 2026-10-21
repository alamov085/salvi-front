<template>
  <div class="section__content">
    <div class="section__content__head">
      <div class="caption">Користувачі</div>
      <v-menu
        offset-x
        bottom
        :close-on-content-click="false"
        nudge-bottom="40"
        nudge-left="-67"
        left
        content-class="action__td__drop"
      >
        <v-btn slot="activator" class="btn__setting__table">
          <v-icon color="#646C9A">apps</v-icon>
          <v-icon class="arrow-icon" color="#93A2DD">arrow_drop_down</v-icon>
        </v-btn>
        <v-list>
          <span>Налаштування таблиці</span>
          <div v-for="(item, index) in headColl" :key="index">
            <v-list-tile>
              <v-checkbox
                v-model="selected"
                :value="item"
                :label="item.label"
                @change="sortSelect"
              />
            </v-list-tile>
          </div>
        </v-list>
      </v-menu>
      <Create__user
        :user="user"
        :dialog="dialog"
        :update="update"
        :roles="roles"
        :locations="locations"
        @closeDialog="closeDialog"
        @updateList="updateList"
        @openDialog="openDialog"
      />
    </div>
    <Table__users
      :selected-t-h="selected"
      :update-list="updateListVal"
      @headerColl="headerColl"
      @editItem="editItem"
      @rolesList="rolesList"
      @listUpdated="listUpdated"
    />
  </div>
</template>

<script>
import Create__user from "./create__user"
import Table__users from "./table__users"

export default {
  name: "Users",
  components: { Create__user, Table__users },
  data() {
    return {
      selected: [],
      headColl: [],
      user: {
        history: {
          email: "",
          role: ""
        }
      },
      dialog: false,
      update: false,
      updateListVal: false,
      roles: [],
      locations: []
    }
  },
  methods: {
    headerColl(e) {
      this.headColl = e
      this.selected = this.headColl
      let i = 0
      this.selected.forEach(e => {
        e.index = i++
      })
    },
    sortSelect() {
      // eslint-disable-next-line no-unused-vars
      let s = []
      s = this.selected.sort((a, b) => {
        return a.index - b.index
      })
    },
    editItem(e) {
      this.user = e
      this.dialog = true
      this.update = true
    },
    closeDialog(e) {
      this.dialog = e
      this.initialize()
      this.update = false
    },
    openDialog(e) {
      this.dialog = e
    },
    updateList(e) {
      this.updateListVal = e
    },
    listUpdated(e) {
      this.updateListVal = e
    },
    initialize() {
      this.user = {
        email: "",
        phone_number: "",
        first_name: "",
        last_name: "",
        position: "",
        role: "",
        password: "",
        repeatPassword: "",
        role_name: "",
        all_location: false,
        isActive: true,
        activeTill: "",
        companyEntity: "",
        locations: [],
        cost_centers: [],
        history: {
          email: "",
          role: ""
        }
      }
    },
    rolesList(e) {
      this.roles = e.roles
      this.locations = e.locations
    }
  }
}
</script>

<style scoped></style>

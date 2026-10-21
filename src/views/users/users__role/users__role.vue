<template>
  <div class="section__content">
    <div class="section__content__head">
      <div class="caption">Список ролей</div>

      <v-spacer />
      <Create__role
        :model="user"
        :selected-rules="selectedRules"
        :dialog="dialog"
        :update="update"
        :rules="rules"
        @closeDialog="closeDialog"
        @updateList="updateList"
        @openDialog="openDialog"
      />
    </div>
    <Table__user__role
      :update-list="updateListVal"
      @editItem="editItem"
      @rulesList="rulesList"
      @listUpdated="listUpdated"
    />
  </div>
</template>

<script>
import Create__role from "./create__role"
import Table__user__role from "./table__user__role"

export default {
  name: "UsersRole",
  components: { Table__user__role, Create__role },
  data() {
    return {
      user: {
        history: {
          email: "",
          role: ""
        }
      },
      dialog: false,
      update: false,
      updateListVal: false,
      rules: [],
      selectedRules: []
    }
  },
  methods: {
    editItem(e) {
      this.user = e
      this.selectedRules = e.selectedRules
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
        description: "",
        history: {
          email: "",
          role: ""
        }
      }
      this.selectedRules = []
    },
    rulesList(e) {
      this.rules = e.rules
    }
  }
}
</script>

<style scoped></style>

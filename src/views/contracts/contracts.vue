<template>
  <div class="section__content">
    <div class="section__content__head">
      <div class="caption">Договори</div>
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
      <createContacts
        :model="model"
        :dialog="dialog"
        :update="update"
        :company-entity="companyEntity"
        :supplier="supplier"
        @closeDialog="closeDialog"
        @updateList="updateList"
        @openDialog="openDialog"
      />
    </div>
    <table__contracts
      :selected-t-h="selected"
      :update-list="updateListVal"
      @headerColl="headerColl"
      @editItem="editItem"
      @listUpdated="listUpdated"
      @initData="initData"
    />
  </div>
</template>

<script>
import createContacts from "@/views/contracts/dialog-create-contacts.vue"
import table__contracts from "@/views/contracts/table__contracts.vue"

export default {
  name: "Contracts",
  components: {
    createContacts,
    table__contracts
  },
  data() {
    return {
      selected: [],
      headColl: [],
      model: {
        history: {
          email: "",
          role: ""
        }
      },
      dialog: false,
      update: false,
      updateListVal: false,
      supplier: [],
      companyEntity: []
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
    loading(e) {
      this.$emit("loading", e)
    },
    initData(e) {
      this.supplier = e.supplier
      this.companyEntity = e.companyEntity
    },
    editItem(e) {
      this.model = e
      this.model.date_start = this.$options.filters.formatDateMinus(
        this.model.date_start
      )
      this.model.date_end = this.$options.filters.formatDateMinus(
        this.model.date_end
      )
      this.dialog = true
      this.update = true
    },
    closeDialog(e) {
      this.dialog = e
      this.initialize()
      this.update = false
    },
    openDialog(e) {
      this.initialize()
      this.dialog = e
    },
    updateList(e) {
      this.updateListVal = e
    },
    listUpdated(e) {
      this.updateListVal = e
    },
    initialize() {
      this.model = {
        name: "",
        number: "",
        supplier_id: "",
        company_entity_id: "",
        date_start: "",
        date_end: "",
        locations: [],
        all_location: false,
        costCenters: [],
        comment: "",
        history: {
          email: "",
          role: ""
        }
      }
    }
  }
}
</script>

<style scoped></style>

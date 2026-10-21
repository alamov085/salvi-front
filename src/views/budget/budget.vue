<template>
  <div class="section__content">
    <div class="section__content__head">
      <div class="caption">Бюджети</div>
      <Create__budget
        :model="model"
        :dialog="dialog"
        :update="update"
        :locations="locations"
        @closeDialog="closeDialog"
        @updateList="updateList"
        @openDialog="openDialog"
        @deleteBudget="deleteBudget"
      />
    </div>
    <Table__budget
      :update-list="updateListVal"
      :delete-item="deleteItem"
      @editItem="editItem"
      @locationsList="locationsList"
      @listUpdated="listUpdated"
      @deleteClose="deleteClose"
      @deleteSubmit="deleteSubmit"
      @specificationsList="specificationsList"
    />
  </div>
</template>

<script>
import Create__budget from "./create__budget"
import Table__budget from "./table__budget"

export default {
  name: "Budget",
  components: { Create__budget, Table__budget },
  data() {
    return {
      model: {
        history: {
          email: "",
          role: ""
        }
      },
      dialog: false,
      update: false,
      updateListVal: false,
      locations: [],
      specifications: [],
      deleteItem: {}
    }
  },
  methods: {
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
        sum: "",
        date_start: "",
        date_end: "",
        budget_restriction: false,
        all_cost: false,
        all_location: false,
        locations: [],
        cost_centers: [],
        history: {
          email: "",
          role: ""
        }
      }
    },
    locationsList(e) {
      this.locations = e.locations
    },
    specificationsList(e) {
      this.specifications = e.specifications
    },
    deleteBudget(e) {
      this.deleteItem = e
    },
    deleteClose() {
      this.deleteItem = {}
    },
    deleteSubmit() {
      this.closeDialog(false)
    }
  }
}
</script>

<style scoped></style>

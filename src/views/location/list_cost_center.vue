<template>
  <div class="section__content">
    <div class="section__content__head">
      <div class="caption">Кост-центри</div>

      <create__cost_center
        :cost-center="costCenter"
        :dialog="dialog"
        :update="update"
        :company-entities="companies"
        @closeDialog="closeDialog"
        @updateList="updateList"
      />
    </div>
    <table__cost_center
      :update-list="updateListVal"
      @editItem="editItem"
      @listUpdated="listUpdated"
      @companyEntities="companyEntities"
    />
  </div>
</template>

<script>
import create__cost_center from "@/views/location/dialog-create-cost-center.vue"
import table__cost_center from "@/views/location/table__cost_center.vue"

export default {
  name: "ListCostCenter",
  components: {
    create__cost_center,
    table__cost_center
  },
  data: () => ({
    costCenter: {
      name: "",
      location_id: ""
    },
    dialog: false,
    update: false,
    updateListVal: false,
    companies: []
  }),
  methods: {
    editItem(e) {
      this.costCenter = e
      this.dialog = true
      this.update = true
    },
    closeDialog(e) {
      this.dialog = e
      this.costCenter = {
        name: "",
        location_id: "",
        history: {
          email: "",
          role: ""
        }
      }
      this.update = false
    },
    updateList(e) {
      this.updateListVal = e
    },
    listUpdated(e) {
      this.updateListVal = e
    },
    companyEntities(e) {
      this.companies = e
    }
  }
}
</script>

<style scoped></style>

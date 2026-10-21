<template>
  <div class="section__content">
    <div class="section__content__head">
      <div class="caption">Локації</div>

      <createLocation
        :location="location"
        :dialog="dialog"
        :update="update"
        :company-entities="companies"
        @closeDialog="closeDialog"
        @updateList="updateList"
      />
    </div>
    <table__location
      :update-list="updateListVal"
      @editItem="editItem"
      @listUpdated="listUpdated"
      @companyEntities="companyEntities"
    />
  </div>
</template>

<script>
import createLocation from "@/views/location/dialog-create-location.vue"
import table__location from "@/views/location/table__location.vue"

export default {
  name: "ListLocation",
  components: {
    createLocation,
    table__location
  },
  data: () => ({
    location: {
      name: "",
      company_id: 0,
      zip_code: "",
      city: "",
      street: "",
      building: "",
      office: "",
      floor: "",
      phone_one: "",
      phone_two: "",
      isActive: false,
      activeDate: "",
      budgetLocationOnly: false,
      comment: "",
      costCenters: [],
      companyEntitiesIds: [],
      allCompanies: false,
      history: {
        email: "",
        role: ""
      }
    },
    dialog: false,
    update: false,
    updateListVal: false,
    companies: []
  }),
  methods: {
    editItem(e) {
      this.location = e
      this.dialog = true
      this.update = true
    },
    closeDialog(e) {
      this.dialog = e
      this.location = {
        name: "",
        company_id: 0,
        zip_code: "",
        city: "",
        street: "",
        building: "",
        office: "",
        floor: "",
        phone_one: "",
        phone_two: "",
        isActive: false,
        activeDate: "",
        budgetLocationOnly: false,
        comment: "",
        costCenters: [],
        companyEntitiesIds: [],
        allCompanies: false,
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

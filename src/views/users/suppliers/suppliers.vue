<template>
  <div class="section__content">
    <div class="section__content__head">
      <div class="caption">Постачальники</div>
      <create__suppliers
        :model="model"
        :dialog="dialog"
        :update="update"
        :companies="company"
        @closeDialog="closeDialog"
        @updateList="updateList"
      />
      <add__suppliers
        :dialog="dialogAdd"
        :update="update"
        :companies="company"
        @closeDialog="closeDialogAdd"
        @updateList="updateList"
      />
    </div>
    <table__suppliers
      :update-list="updateListVal"
      @editItem="editItem"
      @listUpdated="listUpdated"
      @company="companyList"
    />
  </div>
</template>

<script>
import create__suppliers from "@/views/users/suppliers/create__suppliers.vue"
import add__suppliers from "@/views/users/suppliers/add__suppliers.vue"
import table__suppliers from "@/views/users/suppliers/table__suppliers.vue"

export default {
  name: "Suppliers",
  components: {
    create__suppliers,
    table__suppliers,
    add__suppliers
  },
  data: () => ({
    model: {
      name: "",
      edrpou: "",
      inn: "",
      description: "",
      history: {
        email: "",
        role: ""
      }
    },
    dialog: false,
    dialogAdd: false,
    update: false,
    updateListVal: false,
    company: []
  }),
  methods: {
    companyList(e) {
      this.company = e
    },
    editItem(e) {
      this.model = e
      this.dialog = true
      this.update = true
    },
    closeDialog(e) {
      this.dialog = e
      this.model = {
        name: "",
        edrpou: "",
        inn: "",
        description: "",
        history: {
          email: "",
          role: ""
        }
      }
      this.update = false
    },
    closeDialogAdd(e) {
      this.dialogAdd = e
      this.update = false
    },
    updateList(e) {
      this.updateListVal = e
    },
    listUpdated(e) {
      this.updateListVal = e
    }
  }
}
</script>

<style scoped></style>

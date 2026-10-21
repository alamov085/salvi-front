<template>
  <div class="section__content">
    <div class="section__content__head">
      <div class="caption">Довідник юридичних осіб</div>

      <create__directory__legal
        :id="id"
        :edited-item="editedItem"
        :dialog="dialog"
        :update="update"
        :tax-option="taxOption"
        @closeDialog="closeDialog"
        @updateList="updateList"
        @openDialog="openDialog"
      />
    </div>
    <table__directory__legal
      :id="id"
      :update-list="updateListVal"
      @editItem="editItem"
      @listUpdated="listUpdated"
      @taxOptionValue="taxOptionValue"
    />
  </div>
</template>

<script>
import table__directory__legal from "@/views/directory-legal/table__directory__legal.vue"
import create__directory__legal from "@/views/directory-legal/create__directory__legal.vue"

export default {
  name: "DirectoryLegalIndex",
  components: {
    table__directory__legal,
    create__directory__legal
  },
  props: ["id"],
  data: () => ({
    editedItem: {
      history: {
        email: "",
        role: ""
      }
    },
    dialog: false,
    update: false,
    updateListVal: false,
    taxOption: []
  }),
  methods: {
    initialize() {
      this.editedItem = {
        short_name: "",
        address: "",
        bank_number: "",
        bank_name: "",
        mfo: "",
        edrpou: "",
        inn: "",
        history: {
          email: "",
          role: ""
        }
      }
    },
    editItem(e) {
      this.editedItem = e
      this.editedItem.from_date = this.$options.filters.formatDateMinus(
        this.editedItem.from_date
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
      this.dialog = e
    },
    updateList(e) {
      this.updateListVal = e
    },
    listUpdated(e) {
      this.updateListVal = e
    },
    taxOptionValue(e) {
      this.taxOption = e
    }
  }
}
</script>

<style scoped></style>

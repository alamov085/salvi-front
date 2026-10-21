<template>
  <div class="section__content">
    <div class="section__content__head">
      <div class="caption">Доступні категорії товарів</div>
      <create__catalog_permission
        :dialog="dialog"
        :update="update"
        :model="model"
        @closeDialog="closeDialog"
        @updateList="updateList"
      />
    </div>
    <table__location :update-list="updateListVal" @listUpdated="listUpdated" />
  </div>
</template>
<script>
import table__location from "@/views/price-policy/table__price-policy.vue"
import create__catalog_permission from "@/views/price-policy/create__catalog_permission.vue"

export default {
  name: "PricePolicy",
  components: {
    table__location,
    create__catalog_permission
  },
  data: () => ({
    dialog: false,
    update: false,
    model: {},
    updateListVal: false
  }),
  methods: {
    closeDialog(e) {
      this.dialog = e
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

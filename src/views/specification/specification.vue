<template>
  <div class="section__content">
    <div class="section__content__head">
      <div class="caption">Специфікація</div>
      <router-link
        v-show="$root.rbac.createSpecification"
        to="/specification/create"
        tag="button"
        class="button button__yellow"
      >
        Створити специфікацію
      </router-link>
    </div>

    <specification_table />
  </div>
</template>

<script>
import specification_table from "@/views/specification/specification__table.vue"

export default {
  name: "Specification",
  components: {
    specification_table
  },
  data() {
    return {
      dialog: false,
      update: false,
      specification: "0",
      selected: [],
      options: []
    }
  },
  methods: {
    closeDialog(e) {
      this.dialog = e
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

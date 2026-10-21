<template>
  <div class="section__content">
    <div class="section__content__head">
      <div class="caption">Довідник підприємств</div>
      <!-- <createContacts></createContacts>-->
    </div>
    <table__company />
  </div>
</template>

<script>
import table__company from "@/views/company/table__company.vue"

export default {
  name: "CompanyIndex",
  components: {
    table__company
  }
}
</script>

<style scoped></style>

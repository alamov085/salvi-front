<template>
  <enhanced-el-tree
    :horizontal="!$store.getters['params/mobileView']"
    show-checkbox
    node-key="id"
    :props="label"
    :data="categoryData"
    :clear="clear"
    @checkedCategory="checkedCategory"
  />
</template>

<script>
import EnhancedElTree from "./category/enhanced-el-tree/src/tree"
export default {
  name: "FilterCategory",
  components: {
    EnhancedElTree
  },
  // eslint-disable-next-line vue/require-prop-types
  props: ["clear", "orderId", "locationId"],
  data() {
    return {
      label: {
        label: "name"
      },
      categoryData: []
    }
  },
  watch: {
    location_id() {
      this.getCategory()
    },
    order_id() {
      this.getCategory()
    }
  },
  created() {
    this.getCategory()
  },
  methods: {
    getCategory() {
      let obj = {}
      if (this.location_id && this.order_id != undefined) {
        obj = { location_id: this.location_id, order_id: this.order_id }
      } else if (this.order_id != undefined) {
        obj = { order_id: this.order_id }
      } else if (this.location_id) {
        obj = { location_id: this.location_id }
      }
      obj.add_product = false

      if (this.$route.name == "order-add-product") {
        obj.add_product = true
      }
      this.$api.post("/categories", obj).then(response => {
        this.categoryData = response.data.category.tree
      })
    },
    checkedCategory(e) {
      this.$emit("checkedCategory", e)
    }
  }
}
</script>

<style scoped></style>

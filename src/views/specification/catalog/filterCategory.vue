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
import { mapGetters } from "vuex"

export default {
  name: "FilterCategory",
  components: {
    EnhancedElTree
  },
  // eslint-disable-next-line vue/require-prop-types
  props: ["clear"],
  data() {
    return {
      label: {
        label: "name"
      },
      categoryData: []
    }
  },
  computed: {
    ...mapGetters("user", ["currentUser"])
  },
  created() {
    this.getCategory()
  },
  methods: {
    getCategory() {
      this.$api
        .post("/categories/all-tree", { id: this.currentUser.company_id })
        .then(response => {
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

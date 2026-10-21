<template>
  <div class="">
    <div class="item category__item">
      <v-checkbox
        v-model="categorySelectArr[toggleKey]"
        color="#5578EB"
        hide-details
        @change="categoryTotal(toggleKey, categorySelectArr[toggleKey])"
      />
      <label :title="titleName(item)" @click="toggle">{{ item.name }}</label>
      <i v-if="item.has_child" class="arrow material-icons">keyboard_arrow_right</i>
    </div>
    <div class="box__sub" :class="{ active: isOpen }">
      <div v-if="isOpen" class="item category__item__sub">
        <category
          v-for="(child, index) in item.children"
          :key="index"
          class="sub__category"
          :item="child"
          :toggle-key="toggleKey + '-' + index"
          @increment="categoryTotalChild"
          @filterUuid="uuid"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Category",
  props: ["item", "toggleKey", "categorySelect"],
  data: function() {
    return {
      isOpen: false,
      categorySelectArr: []
    }
  },
  computed: {
    isFolder: function() {
      return this.item.children && this.item.children.length
    }
  },
  methods: {
    titleName(item) {
      return item.name
    },
    uuid(e) {
      this.$emit("filterUuid", e)
    },
    categoryTotal(e, val) {
      if (val) {
        this.$emit("filterUuid", this.item.uuid)
      } else {
        this.$emit("filterUuid", "")
      }
      this.$emit("increment", {
        name: e,
        val: val
      })
    },
    categoryTotalChild(e) {
      this.$emit("increment", {
        name: e.name,
        val: e.val
      })
    },
    getData: async function() {
      await this.$api
        .post("/graphql", {
          query:
            `query{
                                category(parent_uuid: "` +
            this.item.uuid +
            `" limitation: false){
                                 id
                                 uuid
                                 name
                                 is_view
                                 is_props
                                 parent_uuid
                                 parent_id
                                 is_props_value
                                 is_value
                                 has_child
                                 total_product
                                }
                           }`
        })
        .then(response => {
          this.item.children = response.data.data.category
        })
    },
    toggle: async function() {
      await this.getData()
      if (this.$el.querySelector(".box__sub")) {
        let box = this.$el.parentElement.getElementsByClassName("box__sub")
        for (let i = 0; i < box.length; i++) {
          box[i].style.opacity = 0
          box[i].style.zIndex = 0
          box[i].style.display = "none"
        }
        let item = this.$el.parentElement.getElementsByClassName(
          "category__item"
        )
        for (let i = 0; i < item.length; i++) {
          item[i].setAttribute("class", "item category__item")
        }

        if (
          this.$el.querySelector(".category__item").classList.contains("active")
        ) {
          this.$el.querySelector(".category__item").classList.remove("active")
        } else {
          this.isOpen = true
          this.$el.querySelector(".category__item").classList.add("active")
        }

        this.$el.querySelector(".box__sub").style.opacity = 1
        this.$el.querySelector(".box__sub").style.display = "block"
        this.$el.querySelector(".box__sub").style.zIndex = 3
      }
    }
  }
}
</script>

<style scoped></style>

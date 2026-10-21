<template>
  <div
    class="catalog__page section__content"
    :class="{ overlay: showCategory }"
  >
    <div class="section__content__head">
      <div class="caption">Вибiр товарiв</div>
      <button
        class="button button__yellow catalogFilterBtn"
        :class="{ active: showCategory }"
        @click="toggleCategory"
      >
        Категорії
      </button>
    </div>

    <div class="category__wrap" :class="{ open: showCategory }">
      <label>Вибір категорії</label>
      <div class="category__wrap__section">
        <div class="category__wrap__box">
          <filterCategory
            :clear="this.clear"
            @checkedCategory="checkedCategory"
          />
        </div>
      </div>

      <div
        class="category__wrap__section__footer category__wrap__section__footer__specification "
      >
        <span class="clear" @click="clearCategory">Очистити</span>
        <button class="button button__yellow filterAdd" @click="filterData">
          Застосувати
        </button>
      </div>
    </div>

    <div class="catalog__table__head">
      <span class="count__price">Виділено товарів: {{ selected.length }}</span>
      <create_specification
        v-if="selected.length > 0 && id == undefined"
        :dialog="dialog"
        :products="selected"
        @closeDialog="closeDialog"
      />
      <button
        v-if="selected.length > 0 && id > 0"
        class="button button__yellow"
        @click="addProduct"
      >
        Додати товар
      </button>
    </div>
    <catalog__table
      :selected="selected"
      :filter-uuid="filterUuid"
      :list-update="updateListVal"
      @eventSelected="eventSelected"
      @listUpdated="listUpdatedResponse"
    />
    <v-snackbar
      v-model="errorModal"
      dismissible
      type="success"
      :bottom="true"
      color="#FCBD00"
      :multi-line="false"
      :timeout="6000"
    >
      нового товару не було додано до специфікації
      <v-btn color="pink" flat icon @click="errorModal = false">
        <v-icon> close</v-icon>
      </v-btn>
    </v-snackbar>
  </div>
</template>

<script>
// import category from './category.vue'
import filterCategory from "./filterCategory"
import catalog__table from "./catalog__table.vue"
import create_specification from "@/views/specification/specification__create"

export default {
  name: "Users",
  components: { filterCategory, catalog__table, create_specification },
  props: ["id"],
  data() {
    return {
      clear: false,
      filterUuid: "",
      showCategory: false,
      incIndex: 1,
      dialog: false,
      update: false,
      updateListVal: false,
      selected: [],
      selectedData: [],
      selectTags: [],
      categoryData: [],
      categorySelect: [],
      errorModal: false
    }
  },
  created() {
    this.getCategory()
  },
  methods: {
    clearCategory() {
      this.clear = true
      let $this = this
      setTimeout(function() {
        $this.clear = false
      }, 100)
    },
    toggleCategory() {
      this.showCategory = !this.showCategory
      if (
        this.$store.getters["params/mobileView"] &&
        this.showCategory == true
      ) {
        document.querySelector("html").classList = "overflow-y-hidden"
      } else {
        document.querySelector("html").classList = " "
      }
    },
    checkedCategory(e) {
      this.filterUuid = e.uuid
    },
    addProduct() {
      this.$api
        .post("/specification/add-product", {
          id: this.id,
          products: this.selected
        })
        .then(response => {
          if (response.data.success) {
            this.$router.push("/specification/" + this.id)
          } else {
            this.errorModal = true
          }
        })
    },
    eventSelected(e) {
      if (e.val == true) {
        for (let i = 0; i < this.selected.length; i++) {
          if (this.selected[i].id == e.id) {
            this.selected.splice(i, 1)
          }
        }
        this.selected.push(e)
      } else {
        for (let i = 0; i < this.selected.length; i++) {
          if (this.selected[i].id == e.id) {
            this.selected.splice(i, 1)
          }
        }
      }
      //console.log(this.selected);
    },
    listUpdatedResponse(e) {
      this.updateListVal = e
    },
    filterData() {
      this.updateListVal = true
    },
    uuid(e) {
      this.filterUuid = e
    },
    categoryTotal(e) {
      if (e.val == true) {
        this.categorySelect.push(e.name)
      } else {
        for (let i = 0; i < this.categorySelect.length; i++) {
          if (this.categorySelect[i] == e.name) {
            this.categorySelect.splice(i)
          }
        }
      }
    },
    closeDialog(e) {
      this.dialog = e
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
    getCategory() {
      this.$api
        .post("/graphql", {
          query: `query{
                                category(limitation: false){
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
          this.categoryData = response.data.data.category
        })
    }
  }
}
</script>

<style scoped>
.section__content__head {
  grid-template-columns: 1fr 1fr;
}
.section__content__head .button {
  justify-self: end;
}
@media screen and (max-width: 768px) {
  .section__content__head {
    grid-template-columns: 38px 1fr 38px;
  }
  .section__content__head .button {
    justify-self: start;
  }
}
</style>

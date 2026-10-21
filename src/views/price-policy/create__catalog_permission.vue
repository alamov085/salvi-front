<template>
  <v-dialog
    v-model="dialog"
    content-class="price-policy-modal"
    :fullscreen="$store.getters['params/mobileView']"
    persistent
    max-width="705px"
  >
    <template v-slot:activator="{ on }">
      <button
        v-show="$root.rbac.catalogLimitationCreate"
        class="button button__yellow"
        @click="openDialog"
      >
        Створити обмеження
      </button>
    </template>
    <v-card>
      <v-card-title>
        <span class="headline">Обмеження доступів до каталогу</span>
        <v-spacer />
        <v-flex xs1 sm1>
          <v-btn flat icon color="" @click="cancel">
            <v-icon>close</v-icon>
          </v-btn>
        </v-flex>
      </v-card-title>

      <v-container grid-list-md>
        <v-layout wrap>
          <v-flex xs12 sm12 md12 class="input-box">
            <label>Вибір підприємств з доступом</label>
            <v-select
              v-model="model.companies"
              deletable-chips
              chips
              solo
              multiple
              :clearable="false"
              :searchable="false"
              label="Виберіть підприємства"
              :items="companies"
              item-text="short_name"
              item-value="id"
            />
          </v-flex>

          <v-flex xs12 sm12 class="price__tree__category">
            <div class="price__tree__category__head">
              <label>Категорії:</label>
              <label>Націнка:</label>
            </div>
            <v-treeview
              v-model="selection"
              :active.sync="active"
              :items="items"
              :load-children="fetchData"
              :open.sync="open"
              item-key="uuid"
              activatable
              item-text=""
              :label="false"
              color="warning"
              transition
              :selection-type="selectionType"
              selectable
              return-object
            >
              <template v-slot:append="{ item, open }">
                <span class="v-treeview__label" :title="item.name">{{
                  item.name
                }}</span>
                <input
                  v-model="item.markup"
                  type="number"
                  min="0"
                  oninput="validity.valid||(value='')"
                  placeholder="%"
                  @keyup="markupItem(item)"
                />
              </template>
            </v-treeview>
          </v-flex>
        </v-layout>
      </v-container>

      <v-card-actions>
        <v-spacer />
        <button class="button button__blue" flat @click="cancel">
          Скасувати
        </button>
        <button class="button button__yellow" flat @click="createLimitation">
          Застосувати
        </button>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "CreateCatalogPermission",
  props: ["dialog", "update", "model"],
  data: () => ({
    items: [],
    active: [],
    open: [],
    selectionType: "leaf",
    selection: [],
    companies: [],
    products: [],
    loading: false
  }),
  watch: {
    loading(e) {
      this.$loadingBus.$emit("loading", e)
    }
  },
  mounted() {
    this.getCategory()
  },
  methods: {
    markupItem(item) {
      if (item.children) {
        let m = item.markup
        item.children.forEach(i => ((i.markup = m), this.markupItem(i)))
      } else {
        return false
      }
    },
    openDialog() {
      this.$emit("closeDialog", true)
    },
    cancel() {
      this.$emit("closeDialog", false)
    },
    createLimitation() {
      this.model.categories = this.selection
      this.$api
        .post("/catalog-limitation/create", this.model)
        // eslint-disable-next-line no-unused-vars
        .then(response => {
          this.$emit("updateList", true)
          setTimeout(() => {
            this.$emit("updateList", false)
          }, 100)
          this.cancel()
        })
    },
    fetchData(item) {
      this.loading = true
      return this.$api
        .post("/graphql", {
          query:
            `query{
                                category(parent_uuid: "` +
            item.uuid +
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
                                }
                           }`
        })
        .then(response => {
          let data = response.data.data.category
          data.forEach(function(value, index) {
            if (value.has_child) {
              data[index].children = []
            }
          })
          item.children = data
          this.markupItem(item)
          this.loading = false
        })
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
                                }
                                catalogLimitation(perPage: 1000 catalog_limitation:0){
                                 items{
                                  id
                                  full_name
                                  short_name
                                }
                              }
                           }`
        })
        .then(response => {
          let data = response.data.data.category
          data.forEach(function(value, index) {
            if (value.has_child) {
              data[index].children = []
            }
          })
          this.items = data
          this.companies = response.data.data.catalogLimitation.items
        })
    },
    getProducts() {
      this.$api
        .post("/product/get-by-categories", { categories: this.selection })
        .then(response => {
          this.products = response.data.products
        })
    }
  }
}
</script>

<style scoped></style>

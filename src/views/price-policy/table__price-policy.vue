<template>
  <div>
    <!------------------------------------------------------------------------------------table modal -------------------------------------------------------------------->
    <v-dialog
      v-model="dialogE"
      :fullscreen="$store.getters['params/mobileView']"
      persistent
      max-width="700px"
    >
      <v-card>
        <v-card-title>
          <span class="headline">Редагування категорій</span>
          <v-spacer />
          <v-flex xs1 sm1>
            <v-btn flat icon color="" @click="dialog = false">
              <v-icon>close</v-icon>
            </v-btn>
          </v-flex>
        </v-card-title>
        <v-container grid-list-md>
          <v-flex class="price__tree__category">
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
        </v-container>
        <v-card-actions>
          <v-spacer />
          <button class="button button__blue" flat @click="close">
            Відмінити
          </button>
          <button
            v-show="$root.rbac.catalogLimitationUpdate"
            class="button button__yellow"
            flat
            @click="updatePolicy"
          >
            Редагувати
          </button>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!------------------------------------------------------------------------------------table page -------------------------------------------------------------------->

    <v-data-table
      :headers="headers"
      :items="pricePolicy"
      :pagination.sync="pagination"
      :total-items="total_items"
      :loading="loading"
      class="table__tamplate-2 theme--light"
      no-data-text="Немає даних"
    >
      <template v-slot:items="props">
        <td>{{ props.item.short_name }}</td>
        <td>{{ props.item.total_categories }}</td>
        <td class="justify-center  action__td" align="center">
          <v-menu
            offset-x
            bottom
            nudge-bottom="40"
            nudge-left="-40"
            left
            content-class="action__td__drop"
          >
            <v-btn slot="activator" icon>
              <v-icon>more_horiz</v-icon>
            </v-btn>
            <v-list v-hide-empty>
              <span>Дії</span>
              <v-list-tile
                v-show="
                  $root.rbac.catalogLimitationUpdate ||
                    $root.rbac.catalogLimitationViewDetail
                "
              >
                <v-list-tile-title @click="editItem(props.item)">Деталі</v-list-tile-title>
              </v-list-tile>
            </v-list>
          </v-menu>
        </td>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { mapGetters } from "vuex"

export default {
  name: "TableContracts",
  props: ["updateList"],
  data: () => ({
    total_items: 0,
    pagination: {
      sortBy: "id",
      rowsPerPage: 10,
      page: 1
    },
    loading: false,
    dialog: false,
    inputDisable: false,
    headers: [
      { text: "Підприємство", sortable: false, value: "name" },
      { text: "Кількість категорій", value: "category", sortable: false },
      { text: "Дії", value: "name", class: "action__th", sortable: false }
    ],
    headersModal: [
      { text: "Категорія", sortable: true, value: "name" },
      { text: "Націнка", value: "calories" },
      { text: "", value: "name", sortable: false }
    ],
    pricePolicy: [],
    items: [],
    open: [],
    selectionType: "leaf",
    active: [],
    selection: [],
    editedItem: {}
  }),

  watch: {
    dialog(val) {
      val || this.close()
    },
    pagination: {
      handler() {
        this.getDataFromApi()
      },
      deep: true
    },
    search() {
      this.getDataFromApi()
    },
    updateList(e) {
      if (e) {
        this.getDataFromApi()
      }
    },
    loading(e) {
      this.$loadingBus.$emit("loading", e)
    }
  },
  computed: {
    ...mapGetters("params", ["search"])
  },

  methods: {
    updatePolicy() {
      this.loading = true
      this.$api
        .post("/catalog-limitation/update", {
          companies: [this.editedItem.id],
          categories: this.selection
        })
        .then(response => {
          if (response.data.success) {
            this.getDataFromApi()
            this.close()
          } else {
            this.loading = false
          }
        })
    },
    markupItem(item) {
      if (item.children) {
        let m = item.markup
        item.children.forEach(i => {
          i.markup = m
          this.markupItem(i)
        })
      } else {
        return false
      }
    },
    fetchData(item) {
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
        })
    },
    getCategory() {
      this.loading = true
      this.selection = []
      this.$api
        .post("/categories/all-tree", { id: this.editedItem.id })
        .then(response => {
          this.items = response.data.category.tree
          let data = response.data.category.selection
          this.selection = data.map(function(item) {
            return { uuid: item.category_uuid }
          })
          this.loading = false
        })
    },
    getDataFromApi() {
      this.loading = true
      let order = "DESC"
      if (this.pagination.descending) {
        order = "ASC"
      }
      this.$api
        .post("/graphql", {
          query:
            `
                        query{
                              catalogLimitation(catalog_limitation:1 page: ` +
            this.pagination.page +
            ` perPage: ` +
            this.pagination.rowsPerPage +
            ` orderBy: "` +
            this.pagination.sortBy +
            `" order: "` +
            order +
            `"  search:"` +
            this.search +
            `"){
                                 totalCount
                                 items{
                                    id
                                    short_name
                                    total_categories
                                 }
                              }
                            }`
        })
        .then(response => {
          this.pricePolicy = response.data.data.catalogLimitation.items
          this.total_items = response.data.data.catalogLimitation.totalCount
          this.loading = false
        })
      this.$emit("listUpdated", false)
    },
    editItem(item) {
      this.dialog = true
      this.editedItem = item
      this.getCategory()
    },
    close() {
      this.dialog = false
    },
    save() {
      this.close()
    }
  }
}
</script>

<style scoped>
.icon-redact {
  font-size: 18px;
}

.icon-redact:hover:before {
  color: #5678ff;
}
</style>

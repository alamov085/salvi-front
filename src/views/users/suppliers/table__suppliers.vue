<template>
  <div>
    <v-dialog
      v-model="dialogDesc"
      width="500"
      :fullscreen="$store.getters['params/mobileView']"
    >
      <v-card>
        <v-card-title>
          <span class="headline">Повний опис</span>
          <v-spacer />
          <v-flex xs1 sm1>
            <v-btn flat icon color="" @click="dialogDesc = false">
              <v-icon>close</v-icon>
            </v-btn>
          </v-flex>
        </v-card-title>
        <v-container grid-list-md>
          <v-layout wrap>
            <div style="word-break: break-all">
              {{ modalData.description }}
            </div>
          </v-layout>
        </v-container>
      </v-card>
    </v-dialog>
    <v-data-table
      :headers="headers"
      :items="dataTable"
      :pagination.sync="pagination"
      :total-items="total_items"
      :loading="loading"
      class="table__tamplate-2 theme--light trPointer"
      no-data-text="Немає даних"
    >
      <template v-slot:items="props">
        <tr @click="editItem(props.item)">
          <td>
            <v-tooltip top max-width="320px">
              <div class="wrap-text">{{ props.item.name }}</div>
              <span slot="activator">{{
                props.item.name | truncate(40, "...")
              }}</span>
            </v-tooltip>
          </td>
          <td>{{ props.item.edrpou }}</td>
          <td>{{ props.item.inn }}</td>
          <td>
            <div
              class=""
              style=" display: flex; align-items: center; cursor: pointer"
            >
              {{ props.item.description | truncate(30, "...") }}
              <div
                v-if="props.item.description.length > 30"
                @click.stop="descDialog(props.item)"
              >
                <v-icon style="font-size: 15px" color="#19B200">more</v-icon>
              </div>
            </div>
          </td>
          <td class="justify-center action__td" align="center" @click.stop>
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
                <v-list-tile v-show="$root.rbac.updateSupplier">
                  <v-list-tile-title @click="editItem(props.item)">
                    Деталі
                  </v-list-tile-title>
                </v-list-tile>
                <v-list-tile
                  v-show="$root.rbac.updateSupplier && currentUser.company_id"
                >
                  <v-list-tile-title @click="removeDialogOpen(props.item)">
                    Прибрати постачальника
                  </v-list-tile-title>
                </v-list-tile>
              </v-list>
            </v-menu>
          </td>
        </tr>
      </template>
    </v-data-table>
    <v-dialog v-model="dialogRemove" max-width="400px">
      <v-card>
        <v-card-title class="headline">Підтвердіть дію</v-card-title>
        <v-card-text>
          Ви впевнені, що хочете зняти з цього підприємства постачальника?
          Постачальник прибереться з договорів, в яких він вказаний і такі
          договори будуть деактивовані.
          <div v-if="dialogRemoveContract.length > 0">
            Постачальник закріплений в таких договорах:
            <ul class="contract_to_deactivate">
              <li v-for="(value, key) in dialogRemoveContract" :key="key">
                {{ value.name }}
              </li>
            </ul>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <button class="button button__blue" @click="dialogRemove = false">
            Скасувати
          </button>
          <button class="button button__yellow" @click="removeSupplier()">
            Підтвердити
          </button>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex"

export default {
  name: "TableSuppliers",
  props: ["updateList"],
  data: () => ({
    loading: false,
    total_items: 0,
    companyEntities: [],
    pagination: {
      sortBy: "id",
      rowsPerPage: 10,
      page: 1
    },
    headers: [
      { text: "Найменування", value: "name", align: "left" },
      { text: "Код ЄДРПОУ", value: "edrpou" },
      { text: "ІПН", value: "inn" },
      { text: "Опис", value: "description" },
      { text: "", value: "actions", sortable: false }
    ],
    dataTable: [],
    modalData: {},
    dialogDesc: false,
    companies: [],
    dialogRemove: false,
    removeDialogData: {},
    dialogRemoveContract: []
  }),
  watch: {
    pagination: {
      handler() {
        this.getDataFromApi()
      },
      deep: true
    },
    updateList(e) {
      if (e) {
        this.getDataFromApi()
      }
    },
    companyEntities(e) {
      this.$emit("companyEntities", e)
    },
    search() {
      this.getDataFromApi()
    },
    loading(e) {
      this.$loadingBus.$emit("loading", e)
    }
  },
  computed: {
    ...mapGetters("params", ["search"]),
    ...mapGetters("user", ["currentUser"])
  },
  methods: {
    removeDialogOpen(e) {
      this.$api
        .post("/supplier/get-valid-contract", { id: e.id })
        .then(response => {
          this.dialogRemoveContract = response.data.contract
          this.removeDialogData = e
          this.dialogRemove = true
        })
    },
    removeSupplier() {
      this.$api
        .post("/supplier/remove-from-company", { id: this.removeDialogData.id })
        .then(response => {
          if (response.data.success) {
            this.dialogRemove = false
            this.getDataFromApi()
          }
        })
    },
    descDialog(e) {
      this.modalData = e
      this.dialogDesc = true
    },
    getDataFromApi() {
      this.loading = true
      let url = "/graphql"
      let order = "DESC"
      if (this.pagination.descending) {
        order = "ASC"
      }
      this.$api
        .post(url, {
          query:
            `
                        query{
                              supplier(page: ` +
            this.pagination.page +
            ` perPage: ` +
            this.pagination.rowsPerPage +
            ` order: "` +
            order +
            `" orderBy: "` +
            this.pagination.sortBy +
            `" search: "` +
            this.search +
            `"){
                                 totalCount
                                 items{
                                  id
                                  name
                                  edrpou
                                  inn
                                  description
                                  status
                                  companySupplier{
                                    id
                                    company_id
                                    supplier_id
                                  }
                                  history{
                                    email
                                    role
                                  }
                                }
                              }
                              company(page: 1 perPage: 1000 order: "ASC" orderBy: "company.name"){
                                 totalCount
                                 items{
                                  id
                                  full_name
                                  short_name
                                }
                              }
                            }`
        })
        .then(response => {
          let data = response.data.data.supplier.items
          data.forEach(function(value, index) {
            data[index].companies = value.companySupplier.map(function(value) {
              return value.company_id
            })
          })
          this.dataTable = data
          this.total_items = response.data.data.supplier.totalCount
          this.companies = response.data.data.company.items
          this.loading = false
          this.$emit("company", this.companies)
        })
      this.$emit("listUpdated", false)
    },
    editItem(item) {
      this.$emit("editItem", item)
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
.contract_to_deactivate {
  list-style: circle;
}
.contract_to_deactivate li {
  font-weight: 600;
}
</style>

<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="dataTable"
      :pagination.sync="pagination"
      :total-items="total_items"
      :loading="loading"
      class="table__tamplate-2 theme--light sh"
      no-data-text="Немає даних"
    >
      <template v-slot:items="props">
        <tr
          :class="{ non_active: props.item.isActive }"
          @click="editItem(props.item)"
        >
          <td width="50px" class="icon">
            <div>
              <v-tooltip right>
                <v-icon
                  v-if="props.item.isActive"
                  slot="activator"
                  style="color: white; background-color: #19B200;"
                >
                  done
                </v-icon>
                <v-icon
                  v-else
                  slot="activator"
                  style="color: white; background-color: #F24949;"
                >
                  priority_high
                </v-icon>
                <span v-if="props.item.isActive">Активна</span>
                <span v-else>Не активна</span>
              </v-tooltip>
            </div>
          </td>
          <td class="ellipsis" style="max-width: 200px">
            <v-tooltip top z-index="101">
              <span slot="activator" style="cursor: pointer">
                {{ props.item.name }}
              </span>
              <span>{{ props.item.name }}</span>
            </v-tooltip>
          </td>
          <td
            class="text-xs-left"
            width="300px"
            style="min-width: 350px"
          >
            <div @click.stop>
              <c_chips
                :id="props.item.companyEntitiesIds"
                :absolute="true"
                :items="companyEntities"
                name="short_name"
              />
            </div>
          </td>
          <td class="ellipsis" style="width: 320px; white-space: nowrap">
            <v-tooltip top z-index="101">
              <span slot="activator" style="cursor: pointer">
                {{ showFullAdress(props.item) }}
              </span>
              <span>{{ showFullAdress(props.item) }}</span>
            </v-tooltip>
          </td>
          <td class="justify-center  action__td" align="center" @click.stop>
            <v-menu
              bottom
              nudge-bottom="40"
              nudge-left="-40"
              content-class="action__td__drop"
            >
              <v-btn slot="activator" icon>
                <v-icon>more_horiz</v-icon>
              </v-btn>
              <v-list v-hide-empty>
                <span>Дії</span>
                <v-list-tile
                  v-show="
                    $root.rbac.updateLocations || $root.rbac.viewOnlyLocations
                  "
                >
                  <v-list-tile-title @click="editItem(props.item)">
                    Деталі
                  </v-list-tile-title>
                </v-list-tile>
                <v-list-tile
                  v-if="props.item.isActive == 0"
                  v-show="$root.rbac.statusLocations"
                >
                  <v-list-tile-title @click="activateButton(props.item)">
                    Активувати
                  </v-list-tile-title>
                </v-list-tile>
                <v-list-tile
                  v-if="props.item.isActive == 1"
                  v-show="$root.rbac.statusLocations"
                >
                  <v-list-tile-title @click="deactivateButton(props.item)">
                    Деактивувати
                  </v-list-tile-title>
                </v-list-tile>
              </v-list>
            </v-menu>
          </td>
        </tr>
      </template>
    </v-data-table>
    <v-dialog v-model="dialogActivate" max-width="400px">
      <v-card>
        <v-card-title class="headline">Активувати локацію?</v-card-title>
        <v-card-text>
          Ви впевнені, що хочете активувати локацію?
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <button class="button button__blue" @click="dialogActivate = false">
            Скасувати
          </button>
          <button
            class="button button__yellow"
            @click="activateAction(dialogData.id)"
          >
            Підтвердити
          </button>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogDeactivate" max-width="400px">
      <v-card>
        <v-card-title class="headline">Деактивувати локацію?</v-card-title>
        <v-card-text>
          Ви впевнені, що хочете деактивувати локацію?
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <button class="button button__blue" @click="dialogDeactivate = false">
            Скасувати
          </button>
          <button
            class="button button__yellow"
            @click="deactivateAction(dialogData.id)"
          >
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
  name: "TableContracts",
  props: ["updateList"],
  data: () => ({
    loading: false,
    total_items: 0,
    pagination: {
      sortBy: "id",
      rowsPerPage: 10,
      page: 1
    },
    headers: [
      { text: "", value: "isActive", sortable: false },
      { text: "Назва", value: "name", align: "left" },
      { text: "Юридичні особи", value: "companyEntities", sortable: false },
      { text: "Адреса", value: "address", sortable: false },
      { text: "", value: "actions", sortable: false }
    ],
    dataTable: [],
    companyEntities: [],
    dialogActivate: false,
    dialogDeactivate: false,
    dialogData: {}
  }),
  computed: {
    ...mapGetters("params", ["search"])
  },
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

  created() {
    this.getDataFromApi()
  },
  methods: {
    showFullAdress(item) {
      let address = ""
      if (item.city != "") {
        address += item.city
      }
      if (item.street != "") {
        address += ", " + item.street
      }
      if (item.building != "") {
        address += ", б." + item.building
      }
      if (item.office != "") {
        address += ", оф." + item.office
      }
      if (item.floor) {
        address += ", поверх " + item.floor
      }
      return address
    },
    activateButton(item) {
      this.dialogData = item
      this.dialogActivate = true
    },
    deactivateButton(item) {
      this.dialogData = item
      this.dialogDeactivate = true
    },
    activateAction(id) {
      this.$api
        .post("/locations/change-status", {
          id: id,
          status: 1
        })
        // eslint-disable-next-line no-unused-vars
        .then(response => {
          this.dialogActivate = false
          this.getDataFromApi()
        })
    },
    deactivateAction(id) {
      this.$api
        .post("/locations/change-status", {
          id: id,
          status: 0
        })
        // eslint-disable-next-line no-unused-vars
        .then(response => {
          this.dialogDeactivate = false
          this.getDataFromApi()
        })
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
                              location(page: ` +
            this.pagination.page +
            ` perPage: ` +
            this.pagination.rowsPerPage +
            ` order: "` +
            order +
            `" orderBy: "` +
            this.pagination.sortBy +
            `"  search:"` +
            this.search +
            `"){
                                totalCount
                                items{
                                  id
                                  company_id
                                  name
                                  zip_code
                                  city
                                  street
                                  building
                                  office
                                  floor
                                  phone_one
                                  phone_two
                                  comment
                                  isActive
                                  activeDate
                                  allCompanies
                                  budgetLocationOnly
                                  companyEntities{
                                   id
                                    location_id
                                    company_id
                                  }
                                  costCenters{
                                    id
                                    name
                                    location_id
                                  }
                                  history{
                                    email
                                    role
                                  }
                                }
                              }
                              companyEntity(perPage:100){
                                items{
                                  id
                                  full_name
                                  short_name
                                }
                              }
                            }`
        })
        .then(response => {
          this.companyEntities = response.data.data.companyEntity.items
          let data = response.data.data.location.items
          data.forEach(function(value, index) {
            if (value.allCompanies) {
              data[
                index
              ].companyEntitiesIds = response.data.data.companyEntity.items.map(
                function(value) {
                  return value.id
                }
              )
            } else {
              data[index].companyEntitiesIds = value.companyEntities.map(
                function(value) {
                  return value.company_id
                }
              )
            }
          })
          this.dataTable = data
          this.total_items = response.data.data.location.totalCount
          this.statuses = response.data.statuses
          this.loading = false
        })
      this.$emit("listUpdated", false)
    },
    editItem(item) {
      this.$emit("editItem", item)
    },
    updateCompanyEntities(item) {
      item.allCompanies = false
      this.$api.post("/locations/update-location", item).then(response => {
        if (response.data.success) {
          this.getDataFromApi()
        }
      })
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

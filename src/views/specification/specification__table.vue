<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="dataTable"
      :pagination.sync="pagination"
      :total-items="total_items"
      :loading="loading"
      class="elevation-1 table__tamplate-2 trPointer"
      no-data-text="Немає даних"
    >
      <template v-slot:items="props">
        <tr @click="goToSpecification(props.item.id)">
          <td class="icon">
            <div>
              <v-tooltip z-index="101" right>
                <v-icon
                  v-if="props.item.status_add == 1"
                  slot="activator"
                  style="color: white; background-color: #19B200;"
                >
                  done
                </v-icon>
                <v-icon
                  v-else-if="props.item.status_add == 2"
                  slot="activator"
                  style="color: white; background-color: #fcbd00;"
                >
                  timer_off
                </v-icon>
                <v-icon
                  v-else
                  slot="activator"
                  style="color: white; background-color: #F24949;"
                >
                  priority_high
                </v-icon>
                <span v-if="props.item.status_add == 1">Активна</span>
                <span v-else-if="props.item.status_add == 2">В даний час специфікація не активна</span>
                <span v-else>Не активна</span>
              </v-tooltip>
            </div>
          </td>
          <td class="wrap-text wm200p">
            <v-tooltip top max-width="320px">
              <div class="wrap-text">{{ props.item.name }}</div>
              <span slot="activator">{{
                props.item.name | truncate(100, "...")
              }}</span>
            </v-tooltip>
          </td>
          <td class="wrap-text wm200p">
            <v-tooltip top max-width="320px">
              <div class="wrap-text">{{ props.item.contract.name }}</div>
              <span slot="activator">{{
                props.item.contract.name | truncate(100, "...")
              }}</span>
            </v-tooltip>
          </td>
          <td class="text-xs-left" @click.stop>
            <c_chips :id="props.item.locations" :items="locations" />
          </td>
          <td class="text-xs-left">
            {{ props.item.date_start | formatDateDot }} -
            {{ props.item.date_end | formatDateDot }}
          </td>
          <td
            class="justify-center px-0  action__td"
            align="center"
            @click.stop
          >
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
                    $root.rbac.updateSpecification ||
                      $root.rbac.viewSpecificationDetail
                  "
                >
                  <v-list-tile-title @click="goToSpecification(props.item.id)">
                    Деталі
                  </v-list-tile-title>
                </v-list-tile>
                <v-list-tile
                  v-if="props.item.status"
                  v-show="$root.rbac.changeStatusSpecification"
                >
                  <v-list-tile-title @click="statusDeactivateBtn(props.item)">
                    Деактивувати
                  </v-list-tile-title>
                </v-list-tile>
                <v-list-tile
                  v-else
                  v-show="$root.rbac.changeStatusSpecification"
                >
                  <v-list-tile-title @click="statusActivateBtn(props.item)">
                    Активувати
                  </v-list-tile-title>
                </v-list-tile>
              </v-list>
            </v-menu>
          </td>
        </tr>
      </template>
    </v-data-table>
    <v-dialog v-model="dialogStatus" max-width="400px">
      <v-card>
        <v-card-title class="headline">{{ dialogStatusHead }}</v-card-title>
        <v-card-text>
          {{ dialogStatusText }}
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <button class="button button__blue" @click="dialogStatus = false">
            Скасувати
          </button>
          <button class="button button__yellow" @click="dialogStatusAction()">
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
  name: "SpecificationTable",
  data() {
    return {
      radios: "radio-1",
      selected: [],
      headers: [
        { text: "Статус", value: "name", sortable: false },
        { text: "Назва", value: "name" },
        { text: "Договір", value: "contract.name" },
        { text: "Локації", value: "locations.name", sortable: false },
        { text: "Період дії", value: "date", sortable: false },
        { text: "", value: "date", sortable: false }
      ],
      pagination: {
        sortBy: "id",
        rowsPerPage: 10,
        page: 1,
        descending: false
      },
      loading: false,
      total_items: 0,
      dataTable: [],
      locations: [],
      dialogStatus: false,
      dialogStatusHead: "",
      dialogStatusText: "",
      dialogStatusAct: {}
    }
  },
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
    search() {
      this.getDataFromApi()
    },
    loading(e) {
      this.$loadingBus.$emit("loading", e)
    }
  },
  methods: {
    statusActivateBtn(e) {
      this.dialogStatusHead = "Активувати специфікацію?"
      this.dialogStatusText = "Ви впевнені, що хочете активувати специфікацію?"
      this.dialogStatusAct = e
      this.dialogStatus = true
    },
    statusDeactivateBtn(e) {
      this.dialogStatusHead = "Деактивувати специфікацію?"
      this.dialogStatusText =
        "Ви впевнені, що хочете деактивувати специфікацію?"
      this.dialogStatusAct = e
      this.dialogStatus = true
    },
    dialogStatusAction() {
      this.changeStatus(this.dialogStatusAct)
      this.dialogStatus = false
    },
    changeStatus(e) {
      this.loading = true
      this.$api
        .post("/specification/change-status", { id: e.id, status: !e.status })
        .then(response => {
          if (response.data.success) {
            this.getDataFromApi()
          } else {
            this.loading = false
          }
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
                              specification(page: ` +
            this.pagination.page +
            ` perPage: ` +
            this.pagination.rowsPerPage +
            ` order: "` +
            order +
            `" orderBy: "` +
            this.pagination.sortBy +
            `" search:"` +
            this.search +
            `"){
                                 totalCount
                                 items{
                                  id
                                  company_id
                                  name
                                  contract_id
                                  contract{
                                    id
                                    name
                                  }
                                  date_start
                                  date_end
                                  status
                                  status_add
                                  locations{
                                    id
                                    location_id
                                    specification_id
                                  }
                                }
                              }
                              location(perPage: 1000 list:true){
                                  items{
                                      id
                                      name
                                  }
                              }
                            }`
        })
        .then(response => {
          let data = response.data.data.specification.items
          if (data.length > 0) {
            data.forEach(function(value, index) {
              data[index].locations = value.locations.map(function(value) {
                return value.location_id
              })
            })
          }
          this.dataTable = data
          this.total_items = response.data.data.specification.totalCount
          this.locations = response.data.data.location.items
          this.loading = false
        })
      this.$emit("listUpdated", false)
    },
    goToSpecification(id) {
      this.$router.push("/specification/" + id)
    }
  }
}
</script>

<style scoped></style>

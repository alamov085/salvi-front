<template>
  <div>
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
              <div class="wrap-text">{{ props.item.short_name }}</div>
              <span slot="activator">{{
                props.item.short_name | truncate(40, "...")
              }}</span>
            </v-tooltip>
          </td>
          <td class="text-xs-left">
            <div class="status-desc" :class="statuses[props.item.status].class">
              {{ statuses[props.item.status].name }}
            </div>
          </td>
          <td class="justify-center action__td" @click.stop>
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
                    $root.rbac.updateCompanyEntity ||
                      $root.rbac.viewOnlyCompanyEntity
                  "
                >
                  <v-list-tile-title @click="editItem(props.item)">
                    Деталі
                  </v-list-tile-title>
                </v-list-tile>
                <v-list-tile
                  v-if="props.item.status == 0"
                  v-show="$root.rbac.statusCompanyEntity"
                >
                  <v-list-tile-title @click="activateButton(props.item)">
                    Активувати
                  </v-list-tile-title>
                </v-list-tile>
                <v-list-tile
                  v-if="props.item.status == 1"
                  v-show="$root.rbac.statusCompanyEntity"
                >
                  <v-list-tile-title @click="deactivateButton(props.item)">
                    Деактивувати
                  </v-list-tile-title>
                </v-list-tile>

                <!--<v-list-tile v-show="props.item.is_main == 0">
                                  <v-list-tile-title @click="markAsMainButton(props.item)">Призначити головним
                                  </v-list-tile-title>
                              </v-list-tile>-->
              </v-list>
            </v-menu>
          </td>
        </tr>
      </template>
    </v-data-table>
    <v-dialog v-model="dialogActivate" max-width="400px">
      <v-card>
        <v-card-title class="headline">Активувати юридичну особу?</v-card-title>
        <v-card-text>
          Ви впевнені, що хочете активувати юридичну особу?
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
        <v-card-title class="headline">Деактивувати юридичну особу?</v-card-title>
        <v-card-text>
          Ви впевнені, що хочете деактивувати юридичну особу?
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
    <v-dialog v-model="dialogMainCompany" max-width="400px">
      <v-card>
        <v-card-title class="headline">Призначити головним?</v-card-title>
        <v-card-text>
          Ви впевнені, що хочете призначити дану юридичну особу головною?
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <button
            class="button button__blue"
            @click="dialogMainCompany = false"
          >
            Скасувати
          </button>
          <button class="button button__yellow" @click="markAsMain(dialogData)">
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
  name: "TableDirectoryLegal",
  props: ["updateList"],
  data: () => ({
    date: new Date().toISOString().substr(0, 10),
    dialog: false,
    dialogActivate: false,
    dialogRollBack: false,
    dialogDeactivate: false,
    dialogMainCompany: false,
    dialogData: {},
    reason: "",
    modal: false,
    loading: false,
    total_items: 0,
    statuses: [],
    pagination: {
      sortBy: "number",
      rowsPerPage: 10,
      page: 1,
      descending: false
    },
    headers: [
      {
        text: "Юридична особа",
        align: "left",
        sortable: true,
        value: "short_name"
      },
      { text: "Статус", value: "status" },
      { text: "", value: "name", sortable: false }
    ],
    dataTable: [],
    taxOption: [{ id: 0, name: "" }]
  }),
  computed: {
    ...mapGetters("params", ["search"])
  },
  watch: {
    search() {
      this.getDataFromApi()
    },
    dialog(val) {
      val || this.close()
    },
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
    taxOption() {
      this.$emit("taxOptionValue", this.taxOption)
    },
    loading(e) {
      this.$loadingBus.$emit("loading", e)
    }
  },

  methods: {
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
                              companyEntity(page: ` +
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
                                  short_name
                                  full_name
                                  address
                                  bank_number
                                  bank_name
                                  mfo
                                  edrpou
                                  inn
                                  tax_payer
                                  status
                                  status_check
                                  is_main
                                  from_date
                                  history{
                                    email
                                    role
                                  }
                                }
                              }
                              companyEntityStatus{
                                id
                                name
                                class
                              }
                              taxOption{
                                  id
                                  name
                              }
                            }`
        })
        .then(response => {
          this.dataTable = response.data.data.companyEntity.items
          this.total_items = response.data.data.companyEntity.totalCount
          this.statuses = response.data.data.companyEntityStatus
          this.taxOption = response.data.data.taxOption
          this.loading = false
        })
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
        .post("/company-entity/change-status", {
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
        .post("/company-entity/change-status", {
          id: id,
          status: 0
        })
        // eslint-disable-next-line no-unused-vars
        .then(response => {
          this.dialogDeactivate = false
          this.getDataFromApi()
        })
    },
    editItem(item) {
      this.$emit("editItem", item)
    },
    markAsMainButton(item) {
      this.dialogMainCompany = true
      this.dialogData = item
    },
    markAsMain() {
      this.$api
        .post("/company-entity/make-as-main", { id: this.dialogData.id })
        .then(response => {
          if (response.data.success) {
            this.getDataFromApi()
          }
        })
      this.dialogMainCompany = false
    }
  }
}
</script>

<style scoped></style>

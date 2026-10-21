<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="dataTable"
      :pagination.sync="pagination"
      :total-items="total_items"
      :loading="loading"
      class="table__tamplate-2 theme--light table__users trPointer"
      no-data-text="Немає даних"
    >
      <template v-slot:items="props">
        <tr @click="editItem(props.item)">
          <td class="icon">
            <div>
              <v-tooltip top max-width="320px">
                <div v-if="props.item.status == 20">
                  Активний
                </div>
                <div v-else>Не активний</div>
                <v-icon
                  v-if="props.item.status == 20"
                  slot="activator"
                  style="color: white; background-color: #19B200;"
                  class="pointer"
                >
                  done
                </v-icon>
                <v-icon
                  v-else
                  slot="activator"
                  style="color: white; background-color: #F24949;"
                  class="pointer"
                >
                  priority_high
                </v-icon>
              </v-tooltip>
            </div>
          </td>
          <td>{{ props.item.email }}</td>
          <td v-if="!currentUser.company_id" class="text-xs-left">
            <div v-if="props.item.all_company">Всі підприємства</div>
            <div v-else>
              <span v-for="item in props.item.userCompanyList" :key="item.id">
                {{ item.short_name }}
              </span>
            </div>
          </td>
          <td v-else class="text-xs-left">
            <span v-if="props.item.phone_number != null">
              +380{{ props.item.phone_number }}
            </span>
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
                    $root.rbac.updateManager || $root.rbac.viewOnlyManager
                  "
                >
                  <v-list-tile-title @click="editItem(props.item)">
                    Деталі
                  </v-list-tile-title>
                </v-list-tile>
                <v-list-tile
                  v-if="props.item.status == 20"
                  v-show="$root.rbac.updateManagerStatus"
                >
                  <v-list-tile-title
                    @click="statusDeactivateBtn(props.item.id)"
                  >
                    Деактивувати
                  </v-list-tile-title>
                </v-list-tile>
                <v-list-tile
                  v-else-if="props.item.status != 20"
                  v-show="$root.rbac.updateManagerStatus"
                >
                  <v-list-tile-title @click="statusActivateBtn(props.item.id)">
                    Активувати
                  </v-list-tile-title>
                </v-list-tile>
                <v-list-tile
                  v-show="$root.rbac.updateManager && currentUser.company_id"
                >
                  <v-list-tile-title
                    v-if="!props.item.all_company"
                    @click="removeDialogOpen(props.item)"
                  >
                    Прибрати менеджера
                  </v-list-tile-title>
                  <v-list-tile-title v-else>
                    <div class="d-flex align-center">
                      <div style="opacity: 0.5">Прибрати менеджера</div>
                      <v-tooltip tag="div" top>
                        <i slot="activator" class="vsm-icon icon-info"></i>
                        <div>
                          Менеджер має доступ до всіх існуючих підприємств, дану
                          дію можливо виконати в загальному режимі
                        </div>
                      </v-tooltip>
                    </div>
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
    <v-dialog v-model="dialogRemove" max-width="400px">
      <v-card>
        <v-card-title class="headline">Підтвердіть дію</v-card-title>
        <v-card-text>
          Ви впевнені, що хочете зняти з цього підприємства менеджера?
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <button class="button button__blue" @click="dialogRemove = false">
            Скасувати
          </button>
          <button class="button button__yellow" @click="removeManager()">
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
      { text: "", value: "icon", sortable: false, class: "icon" },
      { text: "E-mail", value: "email", align: "left" },
      { text: "Підприємства", value: "full_name", sortable: false },
      { text: "", value: "actions", sortable: false }
    ],
    dataTable: [],
    roles: [],
    company: [],
    editedIndex: -1,
    dialogStatus: false,
    dialogStatusHead: "",
    dialogStatusText: "",
    dialogStatusAct: 1,
    dialogStatusModel: 1,
    removeDialogData: {},
    dialogRemove: false
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
    roles() {
      this.$emit("rolesList", { roles: this.roles, company: this.company })
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
  created() {
    if (this.currentUser.company_id) {
      // this.headers.splice(2,1);
      this.headers[2].text = "Телефон"
    }
  },
  methods: {
    removeManager() {
      this.$api
        .post("/managers/remove-from-company", { id: this.removeDialogData.id })
        .then(response => {
          if (response.data.success) {
            this.dialogRemove = false
            this.getDataFromApi()
          }
        })
    },
    removeDialogOpen(e) {
      this.removeDialogData = e
      this.dialogRemove = true
    },
    statusActivateBtn(id) {
      this.dialogStatusModel = id
      this.dialogStatusHead = "Активувати менеджера?"
      this.dialogStatusText = "Ви впевнені, що хочете активувати менеджера?"
      this.dialogStatusAct = 1
      this.dialogStatus = true
    },
    statusDeactivateBtn(id) {
      this.dialogStatusModel = id
      this.dialogStatusHead = "Деактивувати менеджера?"
      this.dialogStatusText = "Ви впевнені, що хочете деактивувати менеджера?"
      this.dialogStatusAct = 0
      this.dialogStatus = true
    },
    dialogStatusAction() {
      if (this.dialogStatusAct) {
        this.statusActivate(this.dialogStatusModel)
      } else {
        this.statusDeactivate(this.dialogStatusModel)
      }
      this.dialogStatus = false
    },
    getDataFromApi() {
      this.loading = true
      var url = "/graphql"
      let order = "DESC"
      if (this.pagination.descending) {
        order = "ASC"
      }
      this.$api
        .post(url, {
          query:
            `
                        query{
                              manager(page: ` +
            this.pagination.page +
            ` perPage: ` +
            this.pagination.rowsPerPage +
            ` order: "` +
            order +
            `" orderBy: "` +
            this.pagination.sortBy +
            `"  search: "` +
            this.search +
            `"){
                                 totalCount
                                 items{
                                  id
                                  first_name
                                  last_name
                                  email
                                  status
                                  phone_number
                                  password_difficult
                                  role_name
                                  role_description
                                  all_company
                                  userCompany{
                                    id
                                    company_id
                                  }
                                  userCompanyList{
                                    id
                                    short_name
                                  }
                                  history{
                                    email
                                    role
                                  }
                                }
                              }
                              authItem(type: 1 status: 1 manager: true){
                                name
                                company_id
                                description
                                status
                                company_id
                              }
                              company(perPage: 1000){
                                items{
                                  id
                                  short_name
                                  full_name
                                }
                              }
                            }`
        })
        .then(response => {
          var data = response.data.data.manager.items
          data.forEach(function(value, index) {
            data[index].companies = value.userCompany.map(function(value) {
              return value.company_id
            })
          })
          this.dataTable = data
          this.total_items = response.data.data.manager.totalCount
          this.statuses = response.data.statuses
          this.roles = response.data.data.authItem
          this.company = response.data.data.company.items
          this.loading = false
        })
      this.$emit("listUpdated", false)
    },
    editItem(item) {
      this.$emit("editItem", item)
    },
    statusDeactivate(id) {
      this.$api.post("users/deactivate", { id: id }).then(response => {
        if (response.data.success) {
          this.$emit("listUpdated", true)
        }
      })
    },
    statusActivate(id) {
      this.$api.post("users/activate", { id: id }).then(response => {
        if (response.data.success) {
          this.$emit("listUpdated", true)
        }
      })
    }
  }
}
</script>

<style scoped></style>

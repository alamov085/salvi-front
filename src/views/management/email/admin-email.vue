<template>
  <div class="section__content">
    <div class="section__content__head">
      <div class="caption">Управлiння email для прийому заявок</div>
      <modalEmail
        :item-email="itemEmail"
        :dialog="dialog"
        :update="update"
        :company-entities="companies"
        @closeDialog="closeDialog"
        @listUpdated="listUpdated"
      />
    </div>
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
              <v-tooltip z-index="101" right>
                <v-icon
                  v-if="props.item.status == 1"
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
                <span v-if="props.item.status == 1">Активний</span>
                <span v-else>Не активний</span>
              </v-tooltip>
            </div>
          </td>
          <td>
            <v-tooltip top>
              <span slot="activator">{{
                props.item.email | truncate(40, "...")
              }}</span>
              <span>{{ props.item.email }}</span>
            </v-tooltip>
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
                <v-list-tile v-show="$root.rbac.managementEmail">
                  <v-list-tile-title @click="editItem(props.item)">
                    Деталі
                  </v-list-tile-title>
                </v-list-tile>
                <v-list-tile
                  v-show="$root.rbac.managementEmail && props.item.status == 2"
                >
                  <v-list-tile-title
                    v-if="!props.item.all_company"
                    @click="statusActivateBtn(props.item.id)"
                  >
                    Активувати
                  </v-list-tile-title>
                </v-list-tile>
                <v-list-tile
                  v-show="$root.rbac.managementEmail && props.item.status == 1"
                >
                  <v-list-tile-title
                    v-if="!props.item.all_company"
                    @click="statusDeactivateBtn(props.item.id)"
                  >
                    Деактивувати
                  </v-list-tile-title>
                </v-list-tile>
                <v-list-tile v-show="$root.rbac.managementEmail">
                  <v-list-tile-title
                    v-if="!props.item.all_company"
                    @click="removeDialogOpen(props.item.id)"
                  >
                    Видалити
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
import modalEmail from "./modalEmail"

export default {
  name: "AdminEmail",
  components: { modalEmail },
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
      { text: "Email", value: "email", align: "left" },
      { text: "", value: "actions", sortable: false }
    ],
    dataTable: [],
    itemEmail: {
      email: "",
      status: 1
    },
    dialog: false,
    update: false,
    updateListVal: false,
    companies: [],

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
    updateListVal(e) {
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
    ...mapGetters("params", ["search"])
  },
  methods: {
    closeDialog(e) {
      this.dialog = e
      this.itemEmail = {
        name: "",
        status: 1
      }
      this.update = false
    },
    removeBtn() {
      this.$api
        .post("/admin-email/delete", { id: this.dialogStatusModel })
        .then(response => {
          if (response.data.success) {
            this.dialogRemove = false
            this.getDataFromApi()
          }
        })
    },
    removeDialogOpen(id) {
      this.dialogStatusModel = id
      this.dialogStatusHead = "Выдалити Email?"
      this.dialogStatusText = "Ви впевнені, що хочете видалити Email?"
      this.dialogStatusAct = 3
      this.dialogStatus = true
    },
    statusActivateBtn(id) {
      this.dialogStatusModel = id
      this.dialogStatusHead = "Активувати Email?"
      this.dialogStatusText = "Ви впевнені, що хочете активувати Email?"
      this.dialogStatusAct = 1
      this.dialogStatus = true
    },
    statusDeactivateBtn(id) {
      this.dialogStatusModel = id
      this.dialogStatusHead = "Деактивувати Email?"
      this.dialogStatusText = "Ви впевнені, що хочете деактивувати Email?"
      this.dialogStatusAct = 0
      this.dialogStatus = true
    },
    dialogStatusAction() {
      if (this.dialogStatusAct) {
        this.statusActivate(this.dialogStatusModel)
      } else {
        this.statusDeactivate(this.dialogStatusModel)
      }
      if (this.dialogStatusAct == 3) {
        this.removeBtn(this.dialogStatusModel)
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
                              adminEmail(page: ` +
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
                                  email
                                  status
                                }
                              }
                            }`
        })
        .then(response => {
          this.dataTable = response.data.data.adminEmail.items
          this.total_items = response.data.data.adminEmail.totalCount
          this.loading = false
        })
      this.listUpdated(false)
    },
    editItem(item) {
      this.itemEmail = item
      this.dialog = true
      this.update = true
    },
    statusDeactivate(id) {
      this.$api.post("admin-email/deactivate", { id: id }).then(response => {
        if (response.data.success) {
          // console.log('response');
          this.listUpdated(true)
        }
      })
    },
    statusActivate(id) {
      this.$api.post("admin-email/activate", { id: id }).then(response => {
        if (response.data.success) {
          this.listUpdated(true)
        }
      })
    },
    listUpdated(e) {
      this.updateListVal = e
    },
    companyEntities(e) {
      this.companies = e
    }
  }
}
</script>

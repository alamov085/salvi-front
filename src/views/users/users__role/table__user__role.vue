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
          <td
            class="text-xs-left"
            :class="{ defualt_role: props.item.default_role }"
          >
            <v-tooltip top max-width="320px">
              <div class="wrap-text">{{ props.item.description }}</div>
              <span slot="activator">
                {{ props.item.description | truncate(40, "...") }}
              </span>
            </v-tooltip>
          </td>

          <td class="text-xs-left">
            <div
              class="status-desc"
              :class="{
                green: props.item.status == 1,
                red: props.item.status == 0
              }"
            >
              {{ props.item.status == 1 ? "Активована" : "Деактивована" }}
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
              <v-list v-if="currentUser.company_id">
                <span>Дії</span>
                <v-list-tile
                  v-show="$root.rbac.updateRoles || $root.rbac.viewOnlyRoles"
                >
                  <v-list-tile-title @click="editItem(props.item)">
                    Деталі
                  </v-list-tile-title>
                </v-list-tile>
                <v-list-tile
                  v-if="props.item.status == 1"
                  v-show="$root.rbac.changeStatusRoles"
                >
                  <v-list-tile-title @click="deactivateRole(props.item)">
                    Деактивувати
                  </v-list-tile-title>
                </v-list-tile>
                <v-list-tile v-else v-show="$root.rbac.changeStatusRoles">
                  <v-list-tile-title @click="activateRole(props.item)">
                    Активувати
                  </v-list-tile-title>
                </v-list-tile>
              </v-list>
              <v-list v-else>
                <span>Дії</span>
                <v-list-tile v-show="$root.rbac.updateManagerRoles">
                  <v-list-tile-title @click="editItem(props.item)">
                    Деталі
                  </v-list-tile-title>
                </v-list-tile>
                <v-list-tile
                  v-if="props.item.status == 1"
                  v-show="$root.rbac.changeStatusManagerRoles"
                >
                  <v-list-tile-title @click="deactivateRole(props.item)">
                    Деактивувати
                  </v-list-tile-title>
                </v-list-tile>
                <v-list-tile
                  v-else
                  v-show="$root.rbac.changeStatusManagerRoles"
                >
                  <v-list-tile-title @click="activateRole(props.item)">
                    Активувати
                  </v-list-tile-title>
                </v-list-tile>
              </v-list>
            </v-menu>
          </td>
        </tr>
      </template>
    </v-data-table>
    <v-dialog v-model="dialogModal" max-width="400px">
      <v-card>
        <v-card-title class="headline">{{ dialogHeader }}</v-card-title>
        <v-card-text>
          {{ dialogBody }}
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <button class="button button__blue" @click="dialogModal = false">
            Скасувати
          </button>
          <button
            v-if="dialogAction == 'deactivate'"
            class="button button__yellow"
            @click="deactivateAction()"
          >
            Підтвердити
          </button>
          <button
            v-else
            class="button button__yellow"
            @click="activateAction()"
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
  name: "TableUserRole",
  props: ["updateList"],
  data: () => ({
    dialogModal: false,
    dialogData: {},
    dialogHeader: "Деактивувати роль?",
    dialogBody: "Ви впевнені, що хочете деактивувати роль?",
    dialogAction: "deactivate",
    loading: false,
    total_items: 0,
    pagination: {
      sortBy: "id",
      rowsPerPage: 10,
      page: 1
    },
    headers: [
      { text: "Назва", value: "name", sortable: true, align: "left" },
      { text: "Статус", value: "full_name", sortable: false },
      { text: "", value: "actions", sortable: false }
    ],
    dataTable: [],
    rules: [],
    locations: [],
    editedIndex: -1
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
    rules() {
      this.$emit("rulesList", { rules: this.rules })
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
  computed: {
    ...mapGetters("params", ["search"]),
    ...mapGetters("user", ["currentUser"])
  },
  methods: {
    getDataFromApi() {
      this.loading = true
      this.$api
        .post("/graphql", {
          query:
            `query{
                            authItem(type:1  search: "` +
            this.search +
            `" list:true){
                                status
                                description
                                name
                                type
                                default_role
                                permission{
                                    name
                                    type
                                    parent_id
                                }
                                history{
                                    email
                                    role
                                }
                            }
                            authItemParent{
                                id
                                name
                                description
                                children{
                                  name
                                  description
                                  parent_id
                                }
                            }
                        }`
        })
        .then(response => {
          this.dataTable = response.data.data.authItem
          this.total_items = response.data.total
          this.rules = response.data.data.authItemParent
          this.loading = false
        })
      this.$emit("listUpdated", false)
    },
    editItem(item) {
      item.selectedRules = []
      item.permission.forEach(function(val) {
        item.selectedRules.push(val.name)
      })
      this.$emit("editItem", item)
    },
    deactivateRole(item) {
      this.dialogModal = true
      this.dialogAction = "deactivate"
      this.dialogBody = "Ви впевнені, що хочете деактивувати роль?"
      this.dialogHeader = "Деактивувати роль?"
      this.dialogData = item
    },
    activateRole(item) {
      this.dialogModal = true
      this.dialogAction = "activate"
      this.dialogBody = "Ви впевнені, що хочете активувати роль?"
      this.dialogHeader = "Аактивувати роль?"
      this.dialogData = item
    },
    deactivateAction() {
      this.$api
        .post("/roles/deactivate", { role_name: this.dialogData.name })
        .then(response => {
          if (response.data.success) {
            this.getDataFromApi()
            this.dialogModal = false
            this.$socket.emit("setPermissions", {})
          }
        })
    },
    activateAction() {
      this.$api
        .post("/roles/activate", { role_name: this.dialogData.name })
        .then(response => {
          if (response.data.success) {
            this.getDataFromApi()
            this.dialogModal = false
            this.$socket.emit("setPermissions", {})
          }
        })
    }
  }
}
</script>

<style>
.defualt_role {
  font-weight: bold !important;
}
</style>

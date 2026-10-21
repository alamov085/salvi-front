<template>
  <div>
    <v-data-table
      :headers="selectedTH"
      :items="dataTable"
      :pagination.sync="pagination"
      :total-items="total_items"
      :loading="loading"
      class="table__tamplate-2 theme--light table__users trPointer"
      no-data-text="Немає даних"
    >
      <template v-slot:items="props">
        <tr @click="editItem(props.item)">
          <td v-show="showHideColl(0)" class="icon">
            <div>
              <v-tooltip top max-width="320px">
                <div v-if="props.item.status == 20">
                  Активний
                </div>
                <div v-else>Не активний</div>
                <v-icon
                  v-if="props.item.status == 20"
                  slot="activator"
                  class="pointer"
                  style="color: white; background-color: #19B200;"
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
          <td v-show="showHideColl(1)">
            <v-tooltip top max-width="320px">
              <div class="wrap-text">{{ props.item.email }}</div>
              <span slot="activator">
                {{ props.item.email | truncate(55, "...") }}
              </span>
            </v-tooltip>
          </td>
          <td v-show="showHideColl(2)" class="text-xs-left">
            <v-tooltip top max-width="320px">
              <div class="wrap-text">
                {{ props.item.first_name }} {{ props.item.last_name }}
              </div>
              <span slot="activator">
                {{ props.item.first_name | truncate(55, "...") }}
                {{ props.item.last_name | truncate(55, "...") }}
              </span>
            </v-tooltip>
          </td>
          <td v-show="showHideColl(3)" class="text-xs-left">
            {{ props.item.phone_number }}
          </td>
          <td v-show="showHideColl(4)" class="text-xs-left">
            <v-tooltip top max-width="320px">
              <div class="wrap-text">{{ props.item.role_description }}</div>
              <span slot="activator">
                {{ props.item.role_description | truncate(30, "...") }}
              </span>
            </v-tooltip>
          </td>
          <td v-show="showHideColl(5)" class="text-xs-left">
            {{ props.item.position }}
          </td>
          <td
            v-show="showHideColl(6)"
            class="text-xs-left"
            style="min-width: 240px"
          >
            <span v-if="props.item.all_location"> Всі локації</span>
            <span v-else @click.stop>
              <c_chips :id="props.item.locations" :items="locations" />
            </span>
          </td>
          <td
            v-show="showHideColl(7)"
            class="text-xs-left"
            style="min-width: 240px"
          >
            <span v-if="props.item.all_cost"> Всі кост-центри</span>
            <span v-else @click.stop>
              <c_chips :id="props.item.cost_centers" :items="costCenter" />
            </span>
          </td>
          <td v-show="showHideColl(8)" class="justify-center action__td" @click.stop>
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
                <v-list-tile v-show="$root.rbac.updateUser">
                  <v-list-tile-title @click="editItem(props.item)">
                    Деталі
                  </v-list-tile-title>
                </v-list-tile>
                <v-list-tile
                  v-if="props.item.status == 20"
                  v-show="
                    currentUser.id != props.item.id && $root.rbac.statusUser
                  "
                >
                  <v-list-tile-title
                    @click="statusDeactivateBtn(props.item.id)"
                  >
                    Деактивувати
                  </v-list-tile-title>
                </v-list-tile>
                <v-list-tile v-else>
                  <v-list-tile-title
                    v-show="
                      currentUser.id != props.item.id && $root.rbac.statusUser
                    "
                    @click="statusActivateBtn(props.item.id)"
                  >
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
  name: "TableContracts",
  // eslint-disable-next-line vue/require-prop-types
  props: ["updateList", "selectedTH"],
  data: () => ({
    loading: false,
    total_items: 0,
    pagination: {
      sortBy: "id",
      rowsPerPage: 60,
      page: 1
    },
    headers: [
      {
        text: "",
        value: "icon",
        sortable: false,
        class: "icon",
        label: "Статус"
      },
      { text: "E-mail", value: "email", align: "left", label: "E-mail" },
      { text: "Ім'я, Прізвище", value: "first_name", label: "Ім'я, Прізвище" },
      { text: "Телефон", value: "phone_number", label: "Телефон" },
      { text: "Роль", value: "role", label: "Роль", sortable: false },
      { text: "Посада ", value: "position", label: "Посада" },
      {
        text: "Локація  ",
        value: "location",
        label: "Локація ",
        sortable: false
      },
      {
        text: "Костцентр  ",
        value: "cost",
        label: "Костцентр ",
        sortable: false
      },
      { text: "", value: "actions", sortable: false, label: "Налаштування" }
    ],
    dataTable: [],
    roles: [],
    locations: [],
    editedIndex: -1,
    dialogStatus: false,
    dialogStatusHead: "",
    dialogStatusText: "",
    dialogStatusAct: 1,
    dialogStatusModel: 1,
    costCenter: []
  }),
  computed: {
    ...mapGetters("params", ["search"]),
    ...mapGetters("user", ["currentUser"])
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
    roles() {
      this.$emit("rolesList", { roles: this.roles, locations: this.locations })
    },
    search() {
      this.getDataFromApi()
    },
    loading(e) {
      this.$loadingBus.$emit("loading", e)
    }
  },
  created() {
    this.tableColl()
  },
  methods: {
    statusActivateBtn(id) {
      this.dialogStatusModel = id
      this.dialogStatusHead = "Активувати користувача?"
      this.dialogStatusText = "Ви впевнені, що хочете активувати користувача?"
      this.dialogStatusAct = 1
      this.dialogStatus = true
    },
    statusDeactivateBtn(id) {
      this.dialogStatusModel = id
      this.dialogStatusHead = "Деактивувати користувача?"
      this.dialogStatusText = "Ви впевнені, що хочете деактивувати користувача?"
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
    showHideColl(id) {
      let result = false
      this.selectedTH.forEach(e => {
        if (e.index == id) {
          result = true
        }
      })
      return result
    },
    tableColl() {
      this.$emit("headerColl", this.headers)
    },
    getDataFromApi() {
      this.loading = true
      let order = "DESC"
      if (this.pagination.descending) {
        order = "ASC"
      }
        let url = `users/get-info-page-users?page=${this.pagination.page}&perPage=${this.pagination.rowsPerPage}&order=${order}&orderBy=${this.pagination.sortBy || 'id'}`
        this.$api
        .post(url)
        .then(response => {
          this.locations = response.data[0].location.items
          let data = response.data[0].user.items
          let allLocation = []
          allLocation = this.locations.map(function(val) {
            return val.id
          })
          data.forEach(function(value, index) {
            if (value.all_location) {
              data[index].locations = allLocation
            } else {
              data[index].locations = value.locations.map(function(value) {
                return value.location_id
              })
            }
              data[index].cost_centers = value.costCenters.map(function(value) {
                return value.cost_center_id
              })
          })
          this.dataTable = data
          this.total_items = response.data[0].user.totalCount
          this.statuses = response.statuses
          this.roles = response.data[0].authItem
          this.costCenter = response.data[0].costCenter.items
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

<template>
  <div>
    <div class="item__head__box">
      <div class="item__head-selectPeriod">
        <div class="item__head-selectPeriod-Budget">
          <el-date-picker
            v-model="timePeriod"
            popper-class="rangePickerDrop"
            format="dd/MM/yyyy"
            type="daterange"
            align="center"
            unlink-panels
            range-separator="по"
            start-placeholder="Початок"
            end-placeholder="Кiнець"
            :picker-options="
              !$store.getters['params/mobileView']
                ? pickerOptions
                : pickerOptionsMobile
            "
          />
        </div>
      </div>
    </div>
    <v-data-table
      :headers="headers"
      :items="dataTable"
      :pagination.sync="pagination"
      :total-items="total_items"
      :loading="loading"
      class="table__tamplate-2 theme--light table__budget trPointer"
      no-data-text="Немає даних"
    >
      <template v-slot:items="props">
        <tr
          :class="{ has__ended: props.item.status == 2 }"
          @click="link(props.item.id)"
        >
          <td class="icon">
            <div>
              <v-tooltip top max-width="320px">
                <div v-if="props.item.status == 1">
                  Активний
                </div>
                <div v-else>Не активний</div>
                <v-icon
                  v-if="props.item.status == 1"
                  slot="activator"
                  class="pointer"
                  style="color: white; background-color: #19B200;"
                >
                  done
                </v-icon>
                <v-icon
                  v-else
                  slot="activator"
                  class="pointer"
                  style="color: white; background-color: #F24949;"
                >
                  priority_high
                </v-icon>
              </v-tooltip>
            </div>
          </td>
          <td>{{ props.item.name }}</td>
          <td class="text-xs-left">
            {{ props.item.user_responsible.first_name }}
            {{ props.item.user_responsible.last_name }}
          </td>
          <td class="text-xs-left">
            {{ props.item.date_start | formatDateDot }}
          </td>
          <td class="text-xs-left">
            {{ props.item.date_end | formatDateDot }}
          </td>
          <td class="text-xs-left">
            {{ props.item.availableSum > 0 ? props.item.availableSum : 0 }}
          </td>
          <td class="text-xs-left">
            {{ props.item.allSum }}
          </td>
          <td class="text-xs-left">{{ props.item.sum }}</td>
          <td class="text-xs-left">
            <span v-if="props.item.all_location"> Всі локації</span>
            <span v-else @click.stop>
              <c_chips :id="props.item.locations" :items="locations" />
            </span>
          </td>
          <td class="text-xs-left">
            <span v-if="props.item.all_cost"> Всі кост-центри</span>
            <span v-else @click.stop>
              <c_chips :id="props.item.cost_centers" :items="costs" />
            </span>
          </td>
          <td class="text-xs-left">
            <div v-if="!+props.item.sum == 0" class="sum__procent">
              <div class="sum__procent__row">
                <label>{{
                  props.item.availableSum > 0
                    ? props.item.availableSumString
                    : 0
                }}</label>
                <label>{{ props.item.usedSumString }}</label>
              </div>
              <div class="sum__procent__row">
                <div
                  class="used"
                  :style="{ width: widthPercent(props.item) + '%' }"
                ></div>
                <div
                  class="remainder"
                  :style="{
                    width:
                      100 -
                      (props.item.availableSum / props.item.sum) * 100 +
                      '%'
                  }"
                ></div>
              </div>
              <div class="sum__procent__row">
                <label>
                  {{
                    props.item.availableSum > 0
                      ? Number(
                          (props.item.availableSum / props.item.sum) * 100
                        ).toFixed(2)
                      : 0
                  }}%
                </label>
                <label>{{ summBudgetProcent(props.item) }}%</label>
              </div>
            </div>
            <div v-else class="sum__procent">
              <label class="chips-desc red">Нульовий бюджет</label>
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
                <v-list-tile v-show="$root.rbac.detailBudget">
                  <v-list-tile-title @click="link(props.item.id)">
                    Деталі
                  </v-list-tile-title>
                </v-list-tile>
                <v-list-tile v-show="$root.rbac.updateBudget">
                  <v-list-tile-title @click="editItem(props.item)">
                    Редагувати
                  </v-list-tile-title>
                </v-list-tile>
                <v-list-tile v-show="$root.rbac.deleteBudget">
                  <v-list-tile-title @click="deleteMethodBtn(props.item)">
                    Вилучити
                  </v-list-tile-title>
                </v-list-tile>
              </v-list>
            </v-menu>
          </td>
        </tr>
      </template>
    </v-data-table>
    <v-dialog v-model="dialogDelete" max-width="400">
      <v-card>
        <v-card-title class="headline">Вилучення бюджету?</v-card-title>
        <v-card-text>
          Ви впевнені, що хочете вилучити бюджет?
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <button class="button button__blue" @click="deleteMethodBtnClose">
            Скасувати
          </button>
          <button
            class="button button__yellow"
            @click="deleteBudgetMethod(dialogData.id)"
          >
            Пiдтвердити
          </button>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex"

export default {
  name: "TableBudget",
  props: ["updateList", "deleteItem"],
  data: () => ({
    loading: false,
    dialogDelete: false,
    dialogData: [],
    total_items: 0,
    pagination: {
      sortBy: "id",
      rowsPerPage: 10,
      page: 1
    },
    viewStatusUser: true,
    headers: [
      { text: "Статус", value: "icon", sortable: false, class: "icon" },
      { text: "Назва", value: "name" },
      { text: "Відповідальний", value: "user_id_responsible" },
      { text: "Старт", value: "date_start" },
      { text: "Завершення", value: "date_end" },
      { text: "Доступно", value: "availableSum", sortable: false },
      { text: "Сума", value: "sum" },
      { text: "Вся Сума", value: "allSum" },
      { text: "Локації", value: "location", sortable: false },
      { text: "Кост-центри", value: "cost", sortable: false },
      { text: "", value: "actions", sortable: false },
      { text: "", value: "actions", sortable: false }
    ],
    dataTable: [],
    roles: [],
    locations: [],
    editedIndex: -1,
    costs: [],
    specifications: [],
    pickerOptionsMobile: {
      shortcuts: false
    },
    pickerOptions: {
      shortcuts: [
        {
          text: "за тиждень",
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit("pick", [start, end])
          }
        },
        {
          text: "мiсяць",
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit("pick", [start, end])
          }
        },
        {
          text: "3 мiсяця",
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit("pick", [start, end])
          }
        }
      ]
    },
    timePeriod: null
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
    locations() {
      this.$emit("locationsList", { locations: this.locations })
    },
    specifications() {
      this.$emit("specificationsList", { specifications: this.specifications })
    },
    deleteItem() {
      if (this.deleteItem.id != undefined) {
        this.deleteMethodBtn(this.deleteItem)
      }
    },
    search() {
      this.getDataFromApi()
    },
    loading(e) {
      this.$loadingBus.$emit("loading", e)
    },
    timePeriod() {
      this.getDataFromApi()
    }
  },
  // eslint-disable-next-line vue/order-in-components
  computed: {
    ...mapGetters("params", ["search"])
  },
  methods: {
    widthPercent(item) {
      if (item.availableSum <= 0) {
        return 0
      } else {
        return (item.availableSum / item.sum) * 100
      }
    },
    summBudgetProcent(item) {
      if (item.availableSum <= 0) {
        return 100
      } else {
        return Number(
          100 -
            ((item.availableSum > 0 ? item.availableSum : 1) /
              (item.sum > 0 ? item.sum : 1)) *
              100
        ).toFixed(2)
      }
    },
    summBudget(item) {
      if (item.availableSum <= 0) {
        return 100
      } else {
        return Number(
          100 -
            ((item.availableSum > 0 ? item.availableSum : 1) /
              (item.sum > 0 ? item.sum : 1)) *
              100
        ).toFixed(2)
      }
    },
    getDataFromApi() {
      this.loading = true
      let order = "DESC"
      if (this.pagination.descending) {
        order = "ASC"
      }
      let period = ""
      if (this.timePeriod != null) {
        let from = new Date(this.timePeriod[0]).getTime()
        let to = new Date(this.timePeriod[1]).getTime()
        period = 'from: "' + from + '" to:"' + to + '"'
      }
      this.$api
        .post("/graphql", {
          query:
            `
                        query{
                              budget(page: ` +
            this.pagination.page +
            ` perPage: ` +
            this.pagination.rowsPerPage +
            ` order: "` +
            order +
            `" orderBy: "` +
            this.pagination.sortBy +
            `" search: "` +
            this.search +
            `" ` +
            period +
            ` ){
                                 totalCount
                                 items{
                                  id
                                  company_id
                                  name
                                  sum
                                  allSum
                                  availableSumString
                                  usedSumString
                                  availableSum
                                  date_start
                                  date_end
                                  budget_restriction
                                  all_cost
                                  all_location
                                  user_id_responsible
                                  status
                                  user_responsible{
                                    last_name
                                    first_name
                                  }
                                  locations{
                                    location_id
                                  }
                                  cost_centers{
                                    cost_center_id
                                  }
                                  history{
                                    email
                                    role
                                  }
                                  specifications
                                }
                              }
                              location(perPage: 1000 list:true){
                                items{
                                  id
                                  name
                                }
                              }
                              costCenter(perPage: 1000){
                                items{
                                  id
                                  name
                                }
                              }
                            }`
        })
        .then(response => {
          var data = response.data.data.budget.items
          data.forEach(function(value, index) {
            data[index].locations = value.locations.map(function(value) {
              return value.location_id
            })
            data[index].cost_centers = value.cost_centers.map(function(value) {
              return value.cost_center_id
            })
          })
          this.dataTable = data
          this.total_items = response.data.data.budget.totalCount
          // this.statuses = response.data.statuses;
          this.locations = response.data.data.location.items
          this.costs = response.data.data.costCenter.items
          this.loading = false
        })
      this.$emit("listUpdated", false)
    },
    editItem(item) {
      this.$emit("editItem", item)
    },
    deleteMethodBtn(item) {
      this.dialogData = item
      this.dialogDelete = true
    },
    deleteMethodBtnClose() {
      this.$emit("deleteClose", {})
      this.dialogDelete = false
    },
    deleteBudgetMethod(id) {
      this.$api.post("/budget/delete", { id: id }).then(response => {
        if (response.data.success) {
          this.$emit("deleteSubmit", true)
          this.getDataFromApi()
        }
      })
      this.dialogDelete = false
    },
    link(id) {
      return this.$router.push("/budget/" + id)
    }
  }
}
</script>

<style scoped></style>

<template>
  <div class="budjet__detali">
    <Create__budget
      :model="modelEdit"
      :dialog="dialog"
      :update="true"
      :show-btn="false"
      :locations="locations"
      :specifications="specifications"
      @closeDialog="closeDialog"
    />
    <div class="section__content">
      <div class="section__content__head">
        <div class="caption">Бюджети - Інформація</div>
      </div>
      <v-flex xs12 sm12 class="section__box__head">
        <v-toolbar color="#FFFFFF">
          <div class="toolbar__wrap">
            <v-toolbar-title>Бюджет - {{ budgetInfo.name }}</v-toolbar-title>
          </div>
          <v-spacer />
          <span class="label__head__menu">Дії</span>
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
            <v-list>
              <span>Дії</span>
              <v-list-tile @click="editDialog">
                <v-list-tile-title>Редагувати </v-list-tile-title>
              </v-list-tile>
            </v-list>
          </v-menu>
        </v-toolbar>
        <v-card class="section__box__head__body">
          <div class="item">
            <span>Відповідальний:</span>
            <span class="desc">{{ budgetInfo.responsible }}</span>
          </div>
          <div class="item">
            <span>Використано</span>
            <span class="desc">{{ budgetInfo.usedSum }}</span>
          </div>
          <div class="item">
            <span>Доступно</span>
            <span class="desc">{{ budgetInfo.availableSum }}</span>
          </div>
          <div class="item">
            <span>Всього</span>
            <span class="desc">{{ budgetInfo.sum }}</span>
          </div>
          <div class="item">
            <span>Вся сума</span>
            <span class="desc">{{ budgetInfo.allSum }}</span>
          </div>
          <div class="item">
            <span>Старт</span>
            <span class="desc">{{
              budgetInfo.date_start | formatDateDot
            }}</span>
          </div>
          <div class="item">
            <span>Завершення</span>
            <span class="desc">{{ budgetInfo.date_end | formatDateDot }}</span>
          </div>
        </v-card>
      </v-flex>
      <div class="section__content__head">
        <div class="caption">Локації</div>
      </div>
      <div class="section__box orders__list">
        <span v-if="budgetInfo.all_location">Всі локації</span>
        <v-select
          v-else
          v-model="budgetInfo.locations"
          readonly
          class="v-select-empty"
          hide-details
          hide-selected
          chips
          :items="budgetInfo.locationData"
          :multiple="true"
          :clearable="false"
          :searchable="false"
          placeholder=""
          item-text="name"
          item-value="id"
        />
      </div>
      <div class="section__content__head">
        <div class="caption">Кост-центри</div>
      </div>
      <div class="section__box orders__list">
        <span v-if="budgetInfo.all_cost">Всі кост-центри</span>
        <v-select
          v-else
          v-model="budgetInfo.cost_centers"
          readonly
          class="v-select-empty"
          hide-details
          deletable-chips
          chips
          :items="budgetInfo.costCenterData"
          :multiple="true"
          :clearable="false"
          :searchable="false"
          placeholder=""
          item-text="name"
          item-value="id"
        />
      </div>
      <div class="section__content__head">
        <div class="caption">Прикріплені замовлення</div>
      </div>
      <v-data-table
        :headers="headers"
        :items="dataTable"
        :pagination.sync="pagination"
        :total-items="total_items"
        :loading="loading"
        class="table__tamplate-2 theme--light"
        no-data-text="Немає даних"
      >
        <template v-slot:items="props">
          <td>
            {{
              (pagination.page - 1) * pagination.rowsPerPage + props.index + 1
            }}
          </td>
          <td class="text-xs-left">
            <v-tooltip top max-width="320px">
              <div class="wrap-text">{{ props.item.cost_center_name }}</div>
              <span slot="activator">{{
                props.item.cost_center_name | truncate(55, "...")
              }}</span>
            </v-tooltip>
          </td>
          <td class="text-xs-left d-flex align-center">
            <div
              v-if="orderStatus.find(x => x.id === props.item.status)"
              class="status-desc"
              :class="orderStatus.find(x => x.id === props.item.status).class"
            >
              {{ orderStatus.find(x => x.id === props.item.status).name }}
            </div>
            <router-link
              v-show="$root.$rbac.viewOrderDetail"
              :to="link(props.item.id)"
              class="chips-desc default flex-grow-0 hover ml-2"
            >
              {{ props.item.id }}
            </router-link>
            <span
              v-show="!$root.$rbac.viewOrderDetail"
              class="chips-desc default flex-grow-0 ml-2"
            >
              {{ props.item.id }}
            </span>
          </td>
          <td class="text-xs-left">{{ props.item.total_sum }}</td>
        </template>
      </v-data-table>
    </div>
  </div>
</template>

<script>
import Create__budget from "./create__budget"

export default {
  name: "BudgetDetail",
  components: { Create__budget },
  // eslint-disable-next-line vue/require-prop-types
  props: ["id"],
  data: () => ({
    budgetInfo: {},
    model: {},
    pagination: {
      sortBy: "id",
      rowsPerPage: 5,
      page: 1,
      descending: false
    },
    loading: true,
    total_items: 0,
    dataTable: [],
    headers: [
      { text: "№", value: "number", sortable: false },
      { text: "Кост-центр", value: "articul" },
      { text: "Номер замовлення", value: "cost_center" },
      { text: "Сума", value: "delivery_date" }
    ],
    demoArr: ["1", "2", "3", "4"],
    orderStatus: [],
    dialog: false,
    locations: [],
    modelEdit: {},
    specifications: []
  }),
  watch: {
    pagination: {
      handler() {
        this.getDataFromApi()
      },
      deep: true
    }
  },
  methods: {
    editDialog() {
      this.modelEdit = this.budgetInfo
      this.modelEdit.date_start = this.$options.filters.formatDateMinus(
        this.budgetInfo.date_start
      )
      this.modelEdit.date_end = this.$options.filters.formatDateMinus(
        this.budgetInfo.date_end
      )
      this.dialog = true
    },
    closeDialog() {
      this.dialog = false
      this.getDataFromApi()
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
                          budgetInfo(id: ` +
            this.id +
            `){
                              id
                              name
                              sum
                              allSum
                              availableSum
                              availableSumString
                              usedSumString
                              budget_restriction
                              usedSum
                              all_cost
                              all_location
                              user_responsible{
                                first_name
                                last_name
                              }
                              date_start
                              date_end
                              locations{
                                location_id
                              }
                              locationData{
                                  id
                                  name
                              }
                              costCenterData{
                                  id
                                  name
                              }
                              specifications
                          }
                          order(budget_id: ` +
            this.id +
            ` page: ` +
            this.pagination.page +
            ` perPage: ` +
            this.pagination.rowsPerPage +
            ` order: "` +
            order +
            `" orderBy: "` +
            this.pagination.sortBy +
            `"){
                                 totalCount
                                 items{
                                  id
                                  cost_center_name
                                  total_sum
                                  status
                                }
                              }
                          orderStatus{
                                id
                                name
                                class
                          }
                          location(perPage: 1000 list:true){
                                items{
                                  id
                                  name
                                }
                          }
                          specification(perPage: 1000 list:true){
                                 items{
                                  id
                                  name
                                }
                          }
                        }`
        })
        .then(response => {
          let data = response.data.data.budgetInfo
          data.locations = data.locations.map(function(value) {
            return value.location_id
          })
          data.cost_centers = data.costCenterData.map(function(value) {
            return value.id
          })
          this.budgetInfo = data
          this.orderStatus = response.data.data.orderStatus
          this.budgetInfo.responsible =
            this.budgetInfo.user_responsible.first_name +
            " " +
            this.budgetInfo.user_responsible.last_name
          this.dataTable = response.data.data.order.items
          this.total_items = response.data.data.order.totalCount
          this.locations = response.data.data.location.items
          this.specifications = response.data.data.specification.items
          this.loading = false
        })
    },
    link(id) {
      return "/order/" + id
    }
  }
}
</script>

<style scoped>
.label__head__menu {
  color: #646c9a;
  font-size: 14px;
}
</style>

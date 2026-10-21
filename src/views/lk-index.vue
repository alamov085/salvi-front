<template>
  <div class="order__section">
    <v-dialog
      v-model="dialogDesc"
      width="500"
      :fullscreen="$store.getters['params/mobileView']"
    >
      <v-card>
        <v-card-title>
          <span class="headline">Повний коментар</span>
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
              {{ modalData.comment }}
            </div>
          </v-layout>
        </v-container>
      </v-card>
    </v-dialog>
    <div class="section__content">
      <div v-show="$root.rbac.viewDashboardOpenStatistic" class="counter-box">
        <div v-for="(item, index) of dataCounter" :key="index" class="item">
          <div class="item__head">
            <v-tooltip z-index="101 " max-width="280px" top>
              <i slot="activator" class="vsm-icon icon-info"></i>
              <span>{{ item.tooltip }}</span>
            </v-tooltip>
            <div class="caption ellipsis">
              {{ item.name }}
            </div>
          </div>
          <div class="item__body">
            <number
              v-if="!item.date"
              ref="number1"
              :from="0"
              :to="item.num"
              :format="theFormat"
              :duration="3"
              :delay="1"
              easing="Power1.easeOut"
            />
            <span v-if="item.percent">%</span>
            <div v-if="item.date" class="date">
              <span>{{ item.num[0] }}</span>
              <span>:</span>
              <number
                v-if="item.date"
                ref="number1"
                :from="0"
                :to="item.num[1]"
                :format="theFormatDate"
                :duration="3"
                :delay="1"
                easing="Power1.easeOut"
              />
              <span>:</span>
              <number
                v-if="item.date"
                ref="number1"
                :from="0"
                :to="item.num[2]"
                :format="theFormatDate"
                :duration="3"
                :delay="1"
                easing="Power1.easeOut"
              />
            </div>
          </div>
        </div>
      </div>
      <v-dialog v-model="dialogModal" max-width="400">
        <v-card>
          <v-card-title class="headline">Передати постачальнику?</v-card-title>
          <v-card-text>
            Ви впевнені що хочете передати постачальнику виділені замовлення?
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <button class="button button__blue" @click="dialogModal = false">
              Скасувати
            </button>
            <button class="button button__yellow" @click="sendToSupplier">
              Підтвердити
            </button>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <div
        v-show="$root.rbac.viewDashboardOrder"
        class="section__content__head section__content__head__lk"
      >
        <div class="caption">Замовлення</div>
        <button
          v-if="selected.length > 0"
          class="button button__yellow no-plus mr-2"
          @click="dialogModal = true"
        >
          Передати постачальнику
          <span class="chip-btn">{{ this.selected.length }}</span>
        </button>
        <v-menu
          offset-x
          bottom
          class="mr-0"
          :close-on-content-click="true"
          nudge-bottom="40"
          nudge-left="-67"
          left
          content-class="action__td__drop setting__table__collumn radio__view-catalog "
        >
          <v-btn slot="activator" class="btn__setting__table">
            <i class="fas fa-filter"></i>
            <v-icon class="arrow-icon" color="#93A2DD">arrow_drop_down</v-icon>
          </v-btn>
          <v-list>
            <span>Фільтрація по статусу</span>
            <v-radio-group
              v-model="status"
              class="mt-0"
              hide-details
              :mandatory="false"
            >
              <v-list-tile>
                <v-radio label="Всі" value="-1" />
              </v-list-tile>
              <v-list-tile v-for="item in statuses" :key="item.id">
                <v-radio :label="item.name" :value="item.id" />
              </v-list-tile>
            </v-radio-group>
          </v-list>
        </v-menu>
      </div>

      <v-data-table
        v-show="$root.rbac.viewDashboardOrder"
        v-model="selected"
        :headers="headers"
        :items="dataTable"
        :pagination.sync="pagination"
        :total-items="total_items"
        :loading="loading"
        class="table__tamplate-2 tableOrders theme--light trPointer"
        no-data-text="Немає даних"
      >
        <template v-slot:headers="props">
          <th v-if="currentUser.manager">
            <v-checkbox
              :input-value="props.all"
              :indeterminate="selected.length > 0 && !selectedAll"
              :value="selectedAll"
              primary
              hide-details
              @click.stop="toggleAll"
            />
          </th>
          <th
            v-for="header in props.headers"
            :key="header.text"
            :class="[
              'column sortable',
              pagination.descending ? 'desc' : 'asc',
              header.value === pagination.sortBy ? 'active' : ''
            ]"
            @click="changeSort(header.value)"
          >
            {{ header.text }}
            <v-icon small>arrow_upward</v-icon>
          </th>
        </template>
        <template v-slot:items="props">
          <tr @click="goToOrder(props.item.id, props.item)">
            <td v-if="currentUser.manager" @click.stop>
              <v-checkbox
                v-if="props.item.status == 4"
                v-model="props.selected"
                primary
                hide-details
              />
            </td>
            <td>{{ props.item.id }}</td>
            <td class="text-xs-left">
              <v-tooltip top max-width="320px">
                <div class="wrap-text">{{ props.item.company.short_name }}</div>
                <span slot="activator">{{
                  props.item.company.short_name | truncate(80, "...")
                }}</span>
              </v-tooltip>
            </td>
            <td class="text-xs-left">
              <v-tooltip top max-width="320px">
                <div class="wrap-text">{{ props.item.location_name }}</div>
                <span slot="activator">{{
                  props.item.location_name | truncate(30, "...")
                }}</span>
              </v-tooltip>
            </td>
            <td class="text-xs-left">
              <v-tooltip top max-width="320px">
                <div class="wrap-text">{{ props.item.cost_center_name }}</div>
                <span slot="activator">{{
                  props.item.cost_center_name | truncate(30, "...")
                }}</span>
              </v-tooltip>
            </td>
            <td class="text-xs-left">
              <template v-if="props.item.delivery_date && props.item.delivery_date > 10800">
                {{ props.item.delivery_date | formatDateDot }}
              </template>
              <template v-else>
                повідомимо додатково
              </template>
            </td>
            <td class="text-xs-left">{{ props.item.total_sum }}</td>
            <td
              class="text-xs-left"
              style=" display: flex; align-items: center; cursor: pointer"
            >
              {{ props.item.comment | truncate(20, "...") }}
              <div
                v-if="props.item.comment.length > 20"
                @click.stop="descDialog(props.item)"
              >
                <v-icon style="font-size: 15px" color="#19B200">more</v-icon>
              </div>
            </td>
            <td class="text-xs-left">
              <div
                v-if="statuses.find(x => x.id === props.item.status)"
                class="status-desc"
                :class="statuses.find(x => x.id === props.item.status).class"
              >
                {{ statuses.find(x => x.id === props.item.status).name }}
              </div>
            </td>
            <td class="text-xs-left action__td" @click.stop>
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
                  <v-list-tile>
                    <v-list-tile-title
                      @click="goToOrder(props.item.id, props.item)"
                    >
                      Деталі
                    </v-list-tile-title>
                  </v-list-tile>
                </v-list>
              </v-menu>
            </td>
          </tr>
        </template>
      </v-data-table>
    </div>
    <div
      v-show="$root.rbac.viewDashboardOpenStatistic"
      class="section__content"
    >
      <div class="section__content__head">
        <div class="caption">
          Аналітика
        </div>
      </div>

      <div v-if="!$store.getters['params/mobileView']" class="chart__box">
        <div class="item">
          <wrapChart :data-list-location="dataListLocation" />
        </div>
        <!--                <div class="item mapChart">-->
        <!--                    <div class="item__head">-->
        <!--                        <div class="caption">-->
        <!--                            Статистика замовлень(карта)-->
        <!--                        </div>-->
        <!--                    </div>-->
        <!--                    <chartStatick></chartStatick>-->
        <!--                </div>-->
        <div class="chart__box__wrap">
          <div class="item">
            <div class="item__head">
              <div class="caption">
                Кiлькiсть замовлень:
              </div>
              <div class="descChart">
                Всьго замовлень: {{ dashboard.orders.total }}
              </div>
            </div>
            <wrapOrder :data="dashboard.orders" />
          </div>
          <div class="item">
            <div class="item__head">
              <div class="caption">
                Кiлькiсть користувачiв:
              </div>
              <div class="descChart">
                Всього користувачiв: {{ dashboard.users.total }}
              </div>
            </div>
            <wrapUsers :data="dashboard.users" />
          </div>
        </div>
        <div class="item">
          <div class="item__head">
            <div class="caption">
              Частки замовлень по категорiям:
            </div>
            <div class="descChart">
              Загальна сумма: {{ dashboard.categories.totalSum }} грн
            </div>
          </div>
          <wrapProgress :data="dashboard.categories" />
        </div>
      </div>
    </div>
    <v-snackbar
      v-model="errorModal"
      dismissible
      type="success"
      :bottom="true"
      :left="false"
      color="#FCBD00"
      :multi-line="true"
      :right="false"
      :timeout="6000"
      :vertical="true"
    >
      {{ errorMsg }}
      <v-btn color="pink" flat icon @click="errorModal = false">
        <v-icon> close</v-icon>
      </v-btn>
    </v-snackbar>
  </div>
</template>

<script>
  import chartStatick from "@/components/chart-statick.vue"
  import wrapChart from "@/components/chart/chartBuget/wrapChart.vue"
  import wrapOrder from "@/components/chart/chartOrder/wrapOrder.vue"
  import wrapUsers from "@/components/chart/chartUsers/wrapUsers.vue"
  import wrapProgress from "@/components/chart/chartProgress/wrapProgress.vue"
  import { mapActions, mapGetters } from "vuex"

  export default {
    name: "LkIndex",
    components: {
      // eslint-disable-next-line vue/no-unused-components
      chartStatick,
      wrapChart,
      wrapOrder,
      wrapUsers,
      wrapProgress
    },
    data() {
      return {
        loading: false,
        total_items: 0,
        pagination: {
          sortBy: "number",
          rowsPerPage: 10
        },
        headers: [
          { text: "№", align: "left", sortable: true, value: "number" },
          { text: "Підприємство", value: "company_id" },
          { text: "Локація", value: "locations.name" },
          { text: "Кост-центр", value: "cost_center.name" },
          { text: "Дата доставки", value: "delivery_date" },
          { text: "Сума", value: "sum" },
          { text: "Коментар", value: "comments" },
          { text: "Статус", value: "status" },
          { text: "", sortable: false, value: "action" }
        ],
        dataTable: [],
        errorModal: false,
        errorMsg: "",
        selected: [],
        selectedAll: false,
        status: "-1",
        modalData: {},
        dialogDesc: false,
        dataListLocation: [],
        statuses: [],
        dialogModal: false,
        dataCounter: [],
        dashboard: {
          orders: {
            total: 0
          },
          users: {
            total: 0
          },
          categories: {}
        }
      }
    },
    watch: {
      pagination: {
        handler() {
          // let table = document.querySelector('.counter-box').offsetTop;
          // document.querySelector('html').scrollTop = table - 80;
          this.getDataFromApi()
        },
        deep: true
      },
      loading(e) {
        this.$loadingBus.$emit("loading", e)
      },
      search() {
        this.getDataFromApi()
      },
      status() {
        this.getDataFromApi()
      }
    },
    created() {
      // this.getDataFromApi();
      this.getCounter()
    },
    methods: {
      ...mapActions("basket", ["setIdProduct"]),
      ...mapActions("user", ["setData", "removeLocation"]),
      getCounter() {
        this.loading = true
        this.$api.post("/dashboard").then(response => {
          this.dashboard = response.data.dashboard
          // this.dataCounter = response.data.dashboard.counter
          this.loading = false
        })
      },
      theFormat(number) {
        return number.toFixed(0)
      },
      theFormatDate(number) {
        if (String(number.toFixed(0)).length < 2) {
          return "0" + number.toFixed(0)
        } else return number.toFixed(0)
      },
      completed() {
        // console.log('Animation ends!');
      },
      playAnimation() {
        this.$refs.number2.play()
      },
      sendToSupplier() {
        this.loading = true
        this.$api
          .post("/order/send-to-supplier", { ids: this.selected })
          // eslint-disable-next-line no-unused-vars
          .then(response => {
            this.selected = []
            this.dialogModal = false
            this.getDataFromApi()
          })
      },
      descDialog(e) {
        this.modalData = e
        this.dialogDesc = true
      },
      toggleAll() {
        if (this.selected.length) {
          this.selected = []
          this.selectedAll = false
        } else {
          this.selectedAll = true
          this.selectAll()
        }
      },
      selectAll() {
        this.loading = true
        this.$api.post("/order/get-all-orders", { status: 4 }).then(response => {
          this.selected = response.data.orders
          this.loading = false
        })
      },
      changeSort(column) {
        if (this.pagination.sortBy === column) {
          this.pagination.descending = !this.pagination.descending
        } else {
          this.pagination.sortBy = column
          this.pagination.descending = false
        }
      },
      getDataFromApi() {
        this.loading = true
        let url = "/graphql"
        let order = "DESC"
        if (this.pagination.descending) {
          order = "ASC"
        }
        let status = +this.status

        this.$api
          .post(url, {
            query:
              `
                        query{
                              orderDashboard(page: ` +
              this.pagination.page +
              ` perPage: ` +
              this.pagination.rowsPerPage +
              ` order: "` +
              order +
              `" orderBy: "` +
              this.pagination.sortBy +
              `" status: ` +
              status +
              ` search: "` +
              this.search +
              `"){
                                 totalCount
                                 items{
                                   id
                                  company_id
                                  delivery_date
                                  company_entity_id
                                  location_id
                                  location_name
                                  cost_center_id
                                  cost_center_name
                                  contract_id
                                  budget_id
                                  comment
                                  created_by_user
                                  status
                                  total_sum
                                  company_id
                                  company{
                                    short_name
                                  }
                                }
                              }
                              location(perPage: 1000){
                                items{
                                id
                                name
                              }
                            }
                              orderStatus{
                                id
                                name
                                class
                              }
                            }`
          })
          .then(response => {
            this.dataTable = response.data.data.orderDashboard.items
            this.dataListLocation = response.data.data.location.items
            this.dataListLocation.unshift({ id: 0, name: "Всі локації" })
            this.total_items = response.data.data.orderDashboard.totalCount
            this.statuses = response.data.data.orderStatus
            this.loading = false
          })
        this.$emit("listUpdated", false)
      },
      goToOrder(route_id, props) {
        if (props.company_id !== this.currentUser.company_id) {
          this.setCompanyId(props.company_id, props.company.short_name, route_id)
        } else {
          this.getUserData(route_id)
        }
      },
      setCompanyId(id, nameCompany, route_id) {
        this.$api
          .post("/account/set-company", { id: id })
          .then(response => {
            if (response.data.success) {
              this.$loadingBus.$emit("snackbar", {
                title: `${"Підприємство встановлене " + nameCompany}`,
                color: "#4caf50"
              })
              this.getUserData(route_id)
            }
          })
          .finally(() => {
            this.removeLocation({ ctx: true })
          })
      },
      getUserData(route_id) {
        this.$api.get("/account/index").then(response => {
          this.setData({ ctx: JSON.stringify(response.data.user) })
          this.$router.push("/orders?order=" + route_id)
        })
      },
      setStatusOnApprove(item) {
        this.$api
          .post("/order/set-status-on-approve", { id: item.id, delivery_date: this.model.delivery_date })
          .then(response => {
            if (response.data.success) {
              this.goToOrder(item.id)
            } else {
              this.errorModal = true
              this.errorMsg = response.data.message
            }
          })
      },
      receivedOrder(item) {
        this.$api
          .post("/order/order-received", { id: item.id })
          .then(response => {
            if (response.data.success) {
              this.getDataFromApi()
            }
          })
      },
      cancelOrder(item) {
        this.$api
          .post("/order/repeat-from-start", { id: item.id })
          .then(response => {
            if (response.data.success) {
              this.getDataFromApi()
            }
          })
      }
    },
    computed: {
      ...mapGetters("params", ["search"]),
      ...mapGetters("user", ["currentUser"])
    }
  }
</script>

<style lang="sass">
  .line__chart
    height: 500px

    .order__section
      display: flex
      flex-direction: column
      @media screen and (max-width: 768px)
        flex-direction: column-reverse
</style>
<style scoped type="sass"></style>

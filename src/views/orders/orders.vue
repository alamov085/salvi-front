<template>
  <div>
    <div class="section__content">
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
                {{ modalData }}
              </div>
            </v-layout>
          </v-container>
        </v-card>
      </v-dialog>
      <my-dialog
        :model="myDialog"
        :button-one="btnClose"
        :button-two="btnApprove"
        :item="dialogItem"
        :text="dialogText"
        :headline="dialogHeadline"
        @buttonOne="buttonOne"
        @buttonTwo="buttonTwo"
      />
      <div class="section__content__head__orders">
        <div class="caption">Замовлення</div>
        <div class="filter-row">
          <div class="form-group locations__container">
            <label for="locations">Локації</label>
            <input placeholder="Усі" type="text" class="form-control" name="locations" id="locations" style="width: 130px" v-model="nameLocations" v-on:input="filterLocationList" v-on:focus="onFocusLocations" v-on:blur="onBlurLocations">
            <div v-if="activeLocationsInput" class="locations__items" v-on:mouseenter="onMouseEnterLocations" v-on:mouseleave="onMouseLeaveLocations">
              <div v-if="filtredLocationsList.length > 0">
                <div @click="getCostCenters({name: 'Усі', id: 0})" class="locations__item">
                  Усі
                </div>
                <div v-for="location in filtredLocationsList" @click="getCostCenters(location)" :class="['locations__item', location.id == selectedLocation && 'active']">
                  {{location.name}}
                </div>
              </div>
              <div v-else>
                <div @click="getCostCenters({name: 'Усі', id: 0})" class="locations__item">
                  Усі
                </div>
                <div class="locations__text">
                   Немає співпадінь
                </div>
              </div>
            </div>
          </div>
          <div class="form-group">
            <label for="costs">Кост центри</label>
            <select class="form-control" name="costs" id="costs" style="width: 130px" @change="changeCostCenter">
              <option value="0">Усі</option>
              <option v-for="costCenter in costCenters" :value="costCenter.id">{{costCenter.name}}</option>
            </select>
          </div>
          <div class="form-group">
            <label for="date_from">Дата від</label>
            <input type="date" class="form-control" name="date_from" id="date_from" style="width: 130px" @change="changeDateFrom"/>

          </div>
          <div class="form-group">
            <label for="date_to">Дата до</label>
            <input type="date" class="form-control" name="date_to" id="date_to" style="width: 130px" @change="changeDateTo"/>

          </div>
        </div>
        <!--<create_order-->
          <!--:id="undefined"-->
          <!--:dialog="createDialog"-->
          <!--:products="[]"-->
          <!--:model="model"-->
          <!--:update="false"-->
          <!--:non-catalog="true"-->
          <!--:copy="copy"-->
          <!--@closeDialog="closeDialogCreate"-->
        <!--/>-->
        <change_product
          :orders="selected"
          :dialog="changeProductModal"
          @showModal="showModalChangeProduct"
          @snackModal="snackModalChangeProduct"
        />
        <v-menu
          offset-x
          bottom
          class="mr-0 ml-3"
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
      <template>
        <v-data-table
          v-model="selected"
          :headers="headers"
          :items="dataTable"
          :pagination.sync="pagination"
          :total-items="total_items"
          :loading="loading"
          class="table__tamplate-2 theme--light trPointer"
          no-data-text="Немає даних"
        >
          <template v-slot:headers="props">
            <th v-show="$root.rbac.orderChangeProduct" v-if="dataTable.length">
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
              @click="changeSort(header.value, header.sortable)"
            >
              {{ header.text }}
              <v-icon
                v-if="header.sortable == true || header.sortable == undefined"
                small
              >
                arrow_upward
              </v-icon>
            </th>
          </template>
          <template v-slot:items="props">
            <tr @click="goToOrder(props.item.id)">
              <td v-show="$root.rbac.orderChangeProduct" @click.stop>
                <v-checkbox
                  v-if="props.item.status == 2 || props.item.status == 3"
                  v-model="props.selected"
                  primary
                  hide-details
                />
              </td>
              <td>{{ props.item.id }}</td>
              <td class="text-xs-left wrap-text">
                <v-tooltip top max-width="320px">
                  <div class="wrap-text">{{ props.item.location_name }}</div>
                  <span slot="activator">{{
                    props.item.location_name | truncate(80, "...")
                  }}</span>
                </v-tooltip>
              </td>
              <td class="text-xs-left wrap-text">
                <v-tooltip top max-width="320px">
                  <div class="wrap-text">{{ props.item.cost_center_name }}</div>
                  <span slot="activator">{{
                    props.item.cost_center_name | truncate(80, "...")
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
              <td class="text-xs-left">
                {{ props.item.total_sum }}
              </td>
              <td class="text-xs-left">
                <div
                  style=" display: flex; align-items: center; cursor: pointer; max-width: 100px"
                >
                  {{ props.item.ro_number | truncate(10, "...") }}
                  <div
                    v-if="props.item.ro_number.length > 10"
                    @click.stop="descDialog(props.item.ro_number)"
                  >
                    <v-icon style="font-size: 15px" color="#19B200">
                      more
                    </v-icon>
                  </div>
                </div>
              </td>
              <td
                class="text-xs-left"
                style=" display: flex; align-items: center; cursor: pointer; max-width: 100px"
              >
                {{ props.item.comment | truncate(10, "...") }}
                <div
                  v-if="props.item.comment.length > 10"
                  @click.stop="descDialog(props.item.comment)"
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
              <td class="text-xs-left" @click.stop>
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
                    <v-list-tile v-show="$root.rbac.viewOrderDetail">
                      <v-list-tile-title @click="goToOrder(props.item.id)">
                        Деталі
                      </v-list-tile-title>
                    </v-list-tile>
                    <!--<v-list-tile-->
                      <!--v-show="-->
                        <!--$root.rbac.orderDuplicate &&-->
                          <!--+props.item.created_at > 1584112034-->
                      <!--"-->
                    <!--&gt;-->
                      <!--<v-list-tile-title-->
                        <!--@click="duplicateDialog(props.item.id)"-->
                      <!--&gt;-->
                        <!--Копіювати замовлення-->
                      <!--</v-list-tile-title>-->
                    <!--</v-list-tile>-->
                    <v-list-tile
                      v-if="props.item.status == 0"
                      v-show="$root.rbac.changeStatusOrder"
                    >
                      <v-list-tile-title @click="deleteOrderModal(props.item)">
                        Видалити замовлення
                      </v-list-tile-title>
                    </v-list-tile>
                  </v-list>
                </v-menu>
              </td>
            </tr>
          </template>
        </v-data-table>
      </template>
    </div>
    <v-snackbar
      v-model="errorModal"
      :bottom="true"
      :color="snackColor"
      :timeout="6000"
    >
      <span v-html="errorMsg"></span>
      <v-btn color="pink" flat icon @click="errorModal = false">
        <v-icon> close</v-icon>
      </v-btn>
    </v-snackbar>
    <v-dialog v-model="approveModal" max-width="400">
      <v-card>
        <v-card-title class="headline">Змінити статус?</v-card-title>
        <v-card-text>
          Ви впевнені, що хочете перевести замовлення до узгодження?
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <button class="button button__blue" @click="approveModal = false">
            Скасувати
          </button>
          <button
            class="button button__yellow"
            @click="setStatusOnApprove(approveModalData)"
          >
            Підтвердити
          </button>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <div v-if="modalOrder" @click.self="closeOrder" class="order-modal__wrap">
      <div @click="closeOrder" class="order-modal__close">
        <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24" fill="none">
          <path d="M20.7457 3.32851C20.3552 2.93798 19.722 2.93798 19.3315 3.32851L12.0371 10.6229L4.74275 3.32851C4.35223 2.93798 3.71906 2.93798 3.32854 3.32851C2.93801 3.71903 2.93801 4.3522 3.32854 4.74272L10.6229 12.0371L3.32856 19.3314C2.93803 19.722 2.93803 20.3551 3.32856 20.7457C3.71908 21.1362 4.35225 21.1362 4.74277 20.7457L12.0371 13.4513L19.3315 20.7457C19.722 21.1362 20.3552 21.1362 20.7457 20.7457C21.1362 20.3551 21.1362 19.722 20.7457 19.3315L13.4513 12.0371L20.7457 4.74272C21.1362 4.3522 21.1362 3.71903 20.7457 3.32851Z" fill="#0F0F0F"/>
        </svg>
      </div>
      <div class="order-modal__container">
        <order_page :id="$route.query['order']" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex"
// import create_order from "@/views/orders/create-order"
import change_product from "@/views/orders/change-product"
import order_page from "@/views/orders/order__page"

export default {
  name: "Orders",
  components: {
    // create_order,
    change_product,
    order_page
  },
  data() {
    return {
      modalOrder: false,
      dialog: false,
      errorModal: false,
      errorMsg: "",
      snackColor: "#FCBD00",
      loading: false,
      total_items: 0,
      pagination: {
        sortBy: "id",
        rowsPerPage: 60,
        page: 1,
        descending: false
      },
      headers: [
        { text: "№", align: "left", sortable: true, value: "number" },
        { text: "Локація", value: "locations.name" },
        { text: "Кост-центр", value: "cost_center.name" },
        { text: "Дата доставки", value: "delivery_date" },
        { text: "Сума", value: "sum" },
        { text: "№ Purchase Order", value: "ro_number" },
        { text: "Коментар", value: "comments" },
        { text: "Статус", value: "status" },
        { text: "Дії", value: "action", sortable: false, class: "action__th" }
      ],
      dataTable: [],
      statuses: [],
      approveModal: false,
      approveModalData: {},
      modalData: {},
      dialogDesc: false,
      createDialog: false,
      model: {
        delivery_date: "",
        company_entity_id: "",
        location_id: "",
        cost_center_id: "",
        contract_id: "",
        budget_id: "",
        comment: "",
        ro_number: ""
      },
      status: "-1",
      myDialog: false,
      btnClose: { name: "Скасувати", class: "button__blue" },
      btnApprove: { name: "Підтвердити", class: "button__yellow" },
      dialogText: "",
      dialogItem: {},
      dialogHeadline: "",
      myDialogAction: "",
      selected: [],
      selectedAll: false,
      changeProductModal: false,
      copy: 0,
        listLocations: [],
        costCenters: [],
        nameLocations: '',
        activeLocationsInput: false,
        hoverListLocations: false,
        filtredLocationsList: [],
        selectedLocation: 0,
        selectedCostCenter: 0,
        selectedDateFrom: "",
        selectedDateTo: ""
    }
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
    },
    status() {
      this.getDataFromApi()
    },
    $route(to, from) {
        if (to != from) {
            if (this.$route.query['order']) {
                this.modalOrder = true
                document.documentElement.classList.add('overflow-hidden');
            } else {
                this.modalOrder = false
                document.documentElement.classList.remove('overflow-hidden');
            }
        }
    }
  },
  computed: {
    ...mapGetters("params", ["search"]),
    ...mapGetters("user", ["currentUser"])
  },
  mounted() {
      if (this.$route.query['order']) {
          this.modalOrder = true
          console.log(this.modalOrder)
          document.documentElement.classList.add('overflow-hidden');
      } else {
          this.modalOrder = false
          document.documentElement.classList.remove('overflow-hidden');
      }
      window.addEventListener('keydown', this.handleKeyDown);
  },
    beforeDestroy() {
        // Удаление обработчика событий при размонтировании компонента
        window.removeEventListener('keydown', this.handleKeyDown);
    },
  methods: {
    socketEmit(id) {
      this.$socket.emit("userCartAction", {
        order_id: id,
        user_id: 0,
        update: true
      })
    },
      handleKeyDown(event) {
          if (event.keyCode === 27 && this.modalOrder) {
              this.closeOrder()
          }
      },
    deleteOrderModal(item) {
      this.myDialogAction = "deleteOrder"
      this.dialogItem = item
      this.dialogHeadline = "Видалення замовлення"
      this.dialogText = "Ви впевнені, що хочете видалити замовлення?"
      this.btnClose = { name: "Скасувати", class: "button__blue" }
      this.btnApprove = { name: "Підтвердити", class: "button__yellow" }
      this.myDialog = true
    },
    deleteOrder(item) {
      this.$api.post("/order/delete", { id: item.id }).then(response => {
        if (response.data.success) {
          this.socketEmit(item.id)
          this.getDataFromApi()
        }
      })
    },
    snackModalChangeProduct(e) {
      this.errorModal = e.snack
      this.snackColor = e.snackColor
      this.errorMsg = e.snackText
    },
    showModalChangeProduct(e) {
      this.changeProductModal = e
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
      this.$api
        .post("/order/get-all-orders", { status: [2, 3] })
        .then(response => {
          this.selected = response.data.orders
          this.loading = false
        })
    },
    changeSort(column, sort) {
      if (sort == false) {
        return
      } else {
        if (this.pagination.sortBy === column) {
          this.pagination.descending = !this.pagination.descending
        } else {
          this.pagination.sortBy = column
          this.pagination.descending = false
        }
      }
    },
    buttonOne() {
      if (this.myDialogAction == "duplicateOrder") {
        this.myDialog = false
        this.myDialogAction = ""
        this.getDataFromApi()
      }
      if (this.myDialogAction == "deleteOrder") {
        this.myDialog = false
        this.myDialogAction = ""
        this.getDataFromApi()
      }
    },
    buttonTwo(e) {
      if (this.myDialogAction == "duplicateOrder") {
        this.myDialog = false
        this.myDialogAction = ""
        this.duplicateAction(e)
      }
      if (this.myDialogAction == "deleteOrder") {
        this.myDialog = false
        this.myDialogAction = ""
        this.deleteOrder(e)
      }
    },
    duplicate(id) {
      this.myDialogAction = "duplicateOrder"
      this.dialogItem = { id: id }
      this.dialogHeadline = "Копіювати замовлення"
      this.dialogText = "Ви впевнені, що хочете копіювати замовлення?"
      this.btnClose = { name: "Скасувати", class: "button__blue" }
      this.btnApprove = { name: "Підтвердити", class: "button__yellow" }
      this.myDialog = true
    },
    duplicateAction(id) {
      this.loading = true
      this.$api.post("/order/duplicate", id).then(response => {
        if (response.data.success) {
          this.goToOrder(response.data.id)
        } else {
          this.errorModal = true
          this.snackColor = "#FCBD00"
          this.errorMsg = "Помилка!"
        }
        this.loading = false
      })
    },
    descDialog(e) {
      this.modalData = e
      this.dialogDesc = true
    },
    setStatusOnApproveModal(item) {
      this.approveModalData = item
      this.approveModal = true
    },
    closeDialogCreate(e) {
      this.createDialog = e
      this.copy = 0
      this.initialize()
    },
    duplicateDialog(id) {
      this.createDialog = true
      this.copy = id
      this.initialize()
    },
    initialize() {
      this.model = {
        delivery_date: "",
        company_entity_id: "",
        location_id: "",
        cost_center_id: "",
        contract_id: "",
        budget_id: "",
        comment: ""
      }
    },
    closeDialog(e) {
      this.dialog = e
      this.copy = 0
    },
      loadListLocation() {
          this.loading = true
          let order_id = ""
          let order = ""
          this.$api
              .post("/graphql", {
                  query:
                  `query{
                                locationList(all_location: true){
                                     id
                                     name
                                }
                                specification(page: 1 perPage: 1000 active_only: true list: true){
                                 items{
                                  id
                                  name
                                }
                              }
                           }`
              })
              .then(response => {
                  this.specification = response.data.data.specification.items
                  this.listLocations = response.data.data.locationList
                  this.filterLocationList()
                  this.loading = false
              })
      },
      filterLocationList() {
        if (this.nameLocations.length > 0) {
            const list = Object.values(this.listLocations)
            const newList = []
            for (let i = 0; list.length > i; i++) {
                if (list[i].name.toLowerCase().includes(this.nameLocations.toLowerCase())) {
                    newList.push(list[i])
                }
            }
            this.filtredLocationsList = newList
        } else {
            this.filtredLocationsList = Object.values(this.listLocations)
        }
      },
      onFocusLocations() {
        this.activeLocationsInput = true
      },
      onBlurLocations() {
        if (!this.hoverListLocations) {
          this.activeLocationsInput = false
        }
      },
      onMouseEnterLocations() {
        this.hoverListLocations = true
      },
      onMouseLeaveLocations() {
        this.hoverListLocations = false
      },
    getDataFromApi() {
        this.loadListLocation();
        if (localStorage.getItem('ordersLocationData')) {
            const item = JSON.parse(localStorage.getItem('ordersLocationData'))
            this.nameLocations = item.name
            this.selectedLocation = item.id
            this.filterLocationList()
            this.$api
                .post("/cost-centers/get-list-by-location", { location: this.selectedLocation })
                .then(response => {
                    if (response.data.success) {
                        this.costCenters = response.data.data;
                    }
                });
        }
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
                              order(page: ` +
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
            `" location_id: ` +
            this.selectedLocation +
            ` cost_center_id: ` +
            this.selectedCostCenter +
            ` date_from: "` +
            this.selectedDateFrom
            + `" date_to: "`+
            this.selectedDateTo
            +`"){
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
                                  created_at
                                  created_by_user
                                  status
                                  total_sum
                                  ro_number
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
          this.statuses = response.data.data.orderStatus
          this.dataTable = response.data.data.order.items
          this.total_items = response.data.data.order.totalCount
          this.loading = false
        })
      this.$emit("listUpdated", false)
    },
    goToOrder(id) {
        document.documentElement.classList.add('overflow-hidden');
        return this.$router.push("/orders?order=" + id)
    },
    closeOrder() {
        document.documentElement.classList.remove('overflow-hidden');
        this.$router.push("/orders")
    },
    setStatusOnApprove(item) {
      this.$api
        .post("/order/set-status-on-approve", { id: item.id, delivery_date: this.model.delivery_date })
        .then(response => {
          if (response.data.success) {
            this.goToOrder(item.id)
          } else {
            this.errorModal = true
            this.snackColor = "#FCBD00"
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
    },
    setStatusAtSupplier(item) {
      this.$api
        .post("/order/set-status-at-supplier", { id: item.id })
        .then(response => {
          if (response.data.success) {
            this.getDataFromApi()
          }
        })
    },

    getCostCenters(item) {
        this.activeLocationsInput = false
        this.hoverListLocations = false
        this.selectedLocation = item.id;
        if (item.id == 0) {
            localStorage.removeItem('ordersLocationData');
          this.nameLocations = '';
        } else {
          localStorage.setItem('ordersLocationData', JSON.stringify(item));
          this.nameLocations = item.name;
        }
        this.selectedCostCenter = 0;

        this.$api
            .post("/cost-centers/get-list-by-location", { location: this.selectedLocation })
            .then(response => {
                if (response.data.success) {
                    this.costCenters = response.data.data;
                }
            });

        this.getDataFromApi();
    },
    changeCostCenter(event) {
        this.selectedCostCenter = event.target.value;

        this.getDataFromApi();
    },
      changeDateFrom(event) {
        this.selectedDateFrom = event.target.value;

        this.getDataFromApi();
      },
      changeDateTo(event) {
        this.selectedDateTo = event.target.value;

        this.getDataFromApi();
      }
  }
}
</script>
<style lang="sass" scoped>
  .section__content__head__orders
    display: flex
    align-items: center
    justify-content: space-between
  .filter-row
    display: flex
    flex-wrap: wrap
  .order-modal__close
    position: absolute
    top: 20px
    right: 20px
    cursor: pointer
    z-index: 20
  .order-modal__wrap
    position: fixed
    z-index: 11000
    inset: 0
    background: rgba(0,0,0,0.5)
  .order-modal__container
    padding: 0
    background: #ffffff
    position: absolute
    right: 0
    max-height: 100vh
    height: 100vh
    top: 0
    bottom: 0
    max-width: 700px
    width: 700px
    overflow-y: hidden
    overflow-x: hidden
    box-shadow: 0 2px 5px rgba(0,0,0,0.2), 0 4px 6px rgba(0,0,0,0.2)
    @media (max-width: 768px)
      max-width: 100%
      width: 100%
  .locations__container
    position: relative
  .locations__items
    z-index: 1000
    padding: 0
    background: #ffffff
    box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px
    position: absolute
    top: 105%
    left: 0
    width: 100%
    max-height: 200px
    overflow-y: auto
  .locations__text
    padding: 10px
  .locations__item
    padding: 5px 20px

    &:hover
      background: gainsboro

    &.active
      background: black
      color: #ffffff
  .section__content__head
    & .v-menu.v-menu--inline
      @media only screen and (max-width: 768px)
        grid-column-start: 1
        justify-self: start
    @media only screen and (max-width: 1410px)
      grid-template-columns: 150px auto auto auto
    @media only screen and (max-width: 768px)
      grid-template-columns: 40px 120px auto
  .container-lk.flex
    display: flex
    .content
        width: 100%

.filter-row
  margin-right: 2rem
  @media only screen and (max-width: 768px)
    margin-right: 0
    margin-left: 0
  .form-group
    margin-right: 1rem
    input, select
      width: 200px !important
</style>

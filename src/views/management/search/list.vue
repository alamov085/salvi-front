<template>
  <div class="section__content">
    <div class="section__content__head">
      <div class="caption">Управлiння запитами</div>
      <div class="filter">
        <input placeholder="Кількість продуктів" v-if="tab_type == 'product'" type="number" v-model="filter_count" class="filter__count">
        <select v-if="tab_type == 'product'" v-model="filter_type" class="filter__count">
          <option value="null">Виберіть зрівняння / null</option>
          <option value="=">Дорівнює</option>
          <option value="<">Менше</option>
          <option value=">">Більше</option>
        </select>
        <el-date-picker
          v-model="date"
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
        <div class="filter__button">
          <button
            class="button button__yellow"
            @click="getDataFromApi"
          >
            Фільтрувати
          </button>
        </div>
      </div>
      <button
        class="button button__yellow"
        @click="resetDialogOpen"
      >
        Скинути всі запити
      </button>
    </div>
    <div class="tab">
      <div @click="changeType('product')" :class="['tab__item', tab_type == 'product' && 'active']">
        По кількості продуктів
      </div>
      <div @click="changeType('count')" :class="['tab__item', tab_type == 'count' && 'active']">
        По кількості запитів
      </div>
    </div>
    <v-data-table
      v-if="tab_type == 'product'"
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
                  v-if="props.item._source.exist"
                  slot="activator"
                  style="color: white; background-color: #19B200;"
                >
                  done
                </v-icon>
                <span v-if="props.item._source.exist">Активний</span>
              </v-tooltip>
            </div>
          </td>
          <td>
            <span>{{ props.item._source.query }}</span>
          </td>
          <td>
              <span>{{ props.item._source.email }}</span>
          </td>
          <td>
              <span>{{ props.item._source.timestamp }}</span>
          </td>
          <td>
              <span>{{ props.item._source.count_products }}</span>
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
                  <v-list-tile-title
                    @click="removeDialogOpen(props.item._source.query)"
                  >
                    Додати
                  </v-list-tile-title>
                </v-list-tile>
              </v-list>
            </v-menu>
          </td>
        </tr>
      </template>
    </v-data-table>
    <v-data-table
      v-if="tab_type == 'count'"
      :headers="headers_count"
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
                  v-if="props.item.exist"
                  slot="activator"
                  style="color: white; background-color: #19B200;"
                >
                  done
                </v-icon>
                <span v-if="props.item.exist">Активний</span>
              </v-tooltip>
            </div>
          </td>
          <td>
            <span>{{ props.item.key }}</span>
          </td>
          <td>
            <span>{{ props.item.doc_count }}</span>
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
                  <v-list-tile-title
                    @click="removeDialogOpen(props.item.key)"
                  >
                    Додати
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
  import moment from "moment";

  export default {
    name: "management_banner",
    components: { modalEmail },
    data: () => ({
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
      tab_type: 'product',
      date: null,
      filter_type: null,
      filter_count: '',
      filter_types: [
        {
          id: 1,
          name: '='
        },
        {
          id: 2,
          name: '<'
        },
        {
          id: 3,
          name: '>'
        }
      ],
      loading: false,
      total_items: 0,
      pagination: {
        sortBy: "id",
        rowsPerPage: 10,
        page: 1
      },
      headers: [
        { text: "", value: "icon", sortable: false, class: "icon" },
        { text: "Query", value: "query", sortable: false, align: "left" },
        { text: "Email", value: "email", sortable: false, align: "left" },
        { text: "Date", value: "timestamp", align: "left" },
        { text: "Count product", value: "count_products", sortable: false, align: "left" },
        { text: "", value: "actions", sortable: false }
      ],
      headers_count: [
        { text: "", value: "icon", sortable: false, class: "icon" },
        { text: "Query", value: "key", sortable: false, align: "left" },
        { text: "Count", value: "doc_count", align: "left" },
        { text: "", value: "actions", sortable: false }
      ],
      dataTable: [],
      itemEmail: {
        name: '',
        url: '',
        text: '',
        img: null,
        img_path: null,
        time_swap: '',
        sort: '',
        active: 1
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
      changeType(item) {
        this.tab_type = item
        this.getDataFromApi()
      },
      closeDialog(e) {
        this.dialog = e
        this.itemEmail = {
          name: '',
          url: '',
          text: '',
          img: null,
          img_path: null,
          time_swap: '',
          sort: '',
          active: 1
        }
        this.update = false
      },
      removeBtn() {
        const data = {
          query: this.dialogStatusModel,
        }

        if (this.tab_type == 'product') {
          data.type = 'count_products'
        } else {
          data.type = 'base'
        }
        this.$api
          .post("/search/create-elastic-search-history-prosses", data)
          .then(response => {
            if (response.data.success) {
              this.dialogRemove = false
              this.getDataFromApi()
            }
          })
      },
      removeDialogOpen(id) {
        this.dialogStatusModel = id
        this.dialogStatusHead = "Додати запит?"
        this.dialogStatusText = "Ви впевнені, що хочете додати запит?"
        this.dialogStatusAct = 3
        this.dialogStatus = true
      },
      resetDialogOpen() {
        this.dialogStatusHead = "Скинути запити?"
        this.dialogStatusText = "Ви впевнені, що хочете скинути всі запити?"
        this.dialogStatusAct = 2
        this.dialogStatus = true
      },
      dialogStatusAction() {
        if (this.dialogStatusAct == 3) {
          this.removeBtn(this.dialogStatusModel)
        }

        if (this.dialogStatusAct == 2) {
          this.resetBtn()
        }

        this.dialogStatus = false
      },
      resetBtn() {
        const data = {}

        if (this.tab_type == 'product') {
          data.type = 'count_products'
        } else {
          data.type = 'base'
        }
        this.$api
          .post("/search/reset-search-history-elastic-prosess", data)
          .then(response => {
            if (response.data.success) {
              this.dialogRemove = false
              this.getDataFromApi()
            }
          })
      },
      getDataFromApi() {
        this.loading = true
        let order = "DESC"
        if (this.pagination.descending) {
          order = "ASC"
        }

        const data = {
          pagination: {
            page: this.pagination.page,
            rowsPerPage: this.pagination.rowsPerPage,
            sortOrder: order
          }
        }

        if (this.date) {
          data.dateFrom = moment(this.date[0]).format('YYYY-MM-DD[T]HH:mm:ss')
          data.dateTo   = moment(this.date[1]).format('YYYY-MM-DD[T]HH:mm:ss')
        } else {
          data.dateFrom = moment().subtract(7, 'days').format('YYYY-MM-DD[T]HH:mm:ss')
          data.dateTo   = moment().format('YYYY-MM-DD[T]HH:mm:ss')
        }

        if (this.tab_type == 'product') {
          if (this.filter_type) {
            data.typeCountProduct = this.filter_type
          }
          if (this.filter_count.length) {
            data.countProduct = this.filter_count
          }
        }

        let url = ''

        if (this.tab_type == 'product') {
          url = `/search/get-search-history-elastic`
        } else {
          url = '/search/get-search-base-history-elastic'
        }

        this.$api.post(url, data).then(response => {
          console.log(response, 'data')
          this.dataTable = response.data.items
          this.total_items = response.data.total
          this.loading = false
        })
        this.listUpdated(false)
      },
      editItem(item) {
        this.itemEmail = item
        this.dialog = true
        this.update = true
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
<style lang="scss">
  .filter {
    display: flex;

    &__button {
      margin: 0 10px 0;
    }

    &__count {
      border: 1px solid grey;
      padding: 5px 10px;
      color: #000;
      margin-right: 10px;
      -webkit-appearance: default-button;
    }
  }
  .tab {
    display: flex;
    padding: 10px 0;

    &__item {
      border: 1px solid grey;
      border-radius: 10px;
      font-size: 20px;
      color: grey;
      padding: 10px 20px;
      margin-right: 10px;
      cursor: pointer;

      &.active {
        background: #269447;
        color: #fff;
        border: 1px solid #269447;
      }
    }
  }
</style>

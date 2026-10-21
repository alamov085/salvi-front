<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="dataTable"
      :pagination.sync="pagination"
      :total-items="total_items"
      :loading="loading"
      item-key="name"
      class="elevation-1 table__tamplate-2 testBlock"
      no-data-text="Немає даних"
    >
      <template v-slot:items="props">
        <tr :class="{ add: btnId(props) }">
          <td>
            <v-icon
              v-if="!btnId(props)"
              color="#5578EB"
              @click="dialogQuantity(props.item.id, props)"
            >
              check_box_outline_blank
            </v-icon>
            <v-checkbox
              v-if="btnId(props)"
              v-model="selectedChild"
              :value="props.item.id"
              hide-details
              @change="
                changeCheckbox(props.item.id, props.item.quantity, props)
              "
            />
          </td>
          <td class="img__table">
            <v-tooltip content-class="tooltip__catalog__table" bottom>
              <template v-slot:activator="{ on }">
                <img
                  :src="props.item.img"
                  class="img__display"
                  alt=""
                  onload="this.classList.add('finishLoad')"
                  v-on="on"
                />
              </template>
              <img :src="props.item.img" class="img__hover" alt="" />
            </v-tooltip>
          </td>
          <td class="text-xs-left" style="min-width: 130px">
            <v-tooltip top max-width="320px">
              <div class="wrap-text">{{ props.item.sku }}</div>
              <span slot="activator">{{
                props.item.sku | truncate(20, "...")
              }}</span>
            </v-tooltip>
          </td>
          <td
            class="text-xs-left"
            style="min-width: 250px; white-space: pre-wrap"
          >
            <v-tooltip bottom max-width="320px">
              <div class="wrap-text">{{ props.item.name }}</div>
              <span slot="activator">{{
                props.item.name | truncate(20, "...")
              }}</span>
            </v-tooltip>
          </td>
          <td class="text-xs-left">{{ props.item.buy_price }}</td>
          <td class="text-xs-left">
            <div
              style="display: flex; align-items: center; justify-content: center"
            >
              {{ props.item.unit.name }}
            </div>
          </td>
          <td class="text-xs-left">{{ props.item.category }}</td>
        </tr>
      </template>
    </v-data-table>
    <v-snackbar
      v-model="snack"
      :timeout="3000"
      :color="snackColor"
      :bottom="true"
    >
      {{ snackText }}
      <v-btn flat @click="snack = false">
        <v-icon>close</v-icon>
      </v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import { mapGetters } from "vuex"

export default {
  name: "CatalogTable",
  props: ["selected", "filterUuid", "listUpdate"],
  data: () => ({
    headers: [
      { text: "", sortable: false },
      { text: "Зображення", sortable: false },
      { text: "Артикул", value: "sku" },
      { text: "Назва", value: "name" },
      { text: "Ціна", value: "buy_price" },
      { text: "Кiлькiсть", value: "unit.name" },
      { text: "Категорія", value: "carbs", sortable: false }
    ],
    dataTable: [],
    pagination: {
      sortBy: "id",
      rowsPerPage: 30,
      page: 1
    },
    total_items: 0,
    loading: false,
    selectedChild: [],
    dialogInput: false,
    summ__prod: [],
    snack: false,
    snackColor: "",
    snackText: "",
    quantity: "",
    idProd: -1,
    valProd: "",
    trigerSave: false
  }),
  computed: {
    ...mapGetters("params", ["search"])
  },
  watch: {
    selected() {
      this.selectedChild = this.selected.map(ctx => {
        return ctx["id"]
      })
    },
    pagination: {
      handler() {
        this.getDataFromApi()
      },
      deep: true
    },
    listUpdate(e) {
      if (e) {
        this.getDataFromApi()
      }
    },
    loading(e) {
      this.$loadingBus.$emit("loading", e)
    },
    search() {
      this.getDataFromApi()
    }
  },
  created() {
    this.selectedChild = this.selected.map(ctx => {
      return ctx["id"]
    })
  },

  methods: {
    btnId(e) {
      let s = this.selectedChild
      let visible = false
      for (let i = 0; i < s.length; i++) {
        if (this.selectedChild[i] == e.item.id) {
          visible = true
        }
      }
      if (visible == true) {
        return true
      }
    },
    qantityFunc(e) {
      let quantityId = 0
      let a = this.selected

      for (let i = 0; i < a.length; i++) {
        if (this.selected[i].id == e.id) {
          quantityId = this.selected[i].quantity
        }
      }
      if (quantityId) {
        return quantityId
      }
      return e.quantity
    },
    dialogQuantity(id, props) {
      this.dialogInput = false
      this.snack = true
      this.snackColor = "#19B200"
      this.snackText = "Зміни збережені"
      this.trigerSave = true
      this.selectedChild.push(id)

      let $false = false
      for (let i = 0; i < this.selectedChild.length; i++) {
        if (this.selectedChild[i] == id) {
          $false = true
        }
      }

      this.$emit("eventSelected", {
        index: props.index,
        uuid: props.item.uuid,
        id: id,
        val: $false
      })
    },
    num__input(e) {
      this.summ__prod.push(e)
    },
    changeCheckbox(id, quantity, val) {
      let $false = false
      for (let i = 0; i < this.selectedChild.length; i++) {
        if (this.selectedChild[i] == val.item.id) {
          $false = true
        }
      }

      this.$emit("eventSelected", {
        index: val.index,
        id: val.item.id,
        quantity: val.item.quantity,
        val: $false
      })
    },
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
                              product(all_products: true category_uuid: "` +
            this.filterUuid +
            `" page: ` +
            this.pagination.page +
            ` perPage: ` +
            this.pagination.rowsPerPage +
            ` order: "` +
            order +
            `" orderBy: "` +
            this.pagination.sortBy +
            `" search: "` +
            this.search +
            `"){
                                totalCount
                                 items{
                                    id
                                    uuid
                                    sku
                                    price
                                    buy_price
                                    name
                                    description
                                    unit{
                                      name
                                    }
                                    img
                                    category
                                    quantity
                                }
                              }
                            }`
        })
        .then(response => {
          this.dataTable = response.data.data.product.items
          this.total_items = response.data.data.product.totalCount
          this.loading = false
        })
      this.$emit("listUpdated", false)
    }
  }
}
</script>

<style scoped></style>

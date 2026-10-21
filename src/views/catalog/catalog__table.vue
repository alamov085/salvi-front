<template>
  <div>
    <v-dialog
            v-model="dialogDesc"
            width="500"
            :fullscreen="$store.getters['params/mobileView']"
    >
      <v-card>
        <v-card-title>
          <span class="headline">Повний опис</span>
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
              {{ modalData.description }}
            </div>
          </v-layout>
        </v-container>
      </v-card>
    </v-dialog>
    <v-dialog
            v-model="dialogInput"
            content-class="dialogInput"
            dark
            max-width="200px"
            @keyup="keymonitor"
    >
      <v-card>
        <v-card-title style="line-height: 16px">
          <span>Кількість:</span>
          <b style="font-size: 16px; color: white">{{ summ__prod.join("") }}</b>
        </v-card-title>
        <v-card-text style="height: 240px;">
          <v-btn fab small dark color="teal" @click="num__input(1)">
            <span>1</span>
          </v-btn>
          <v-btn fab small dark color="teal" @click="num__input(2)">
            <span>2</span>
          </v-btn>
          <v-btn fab small dark color="teal" @click="num__input(3)">
            <span>3</span>
          </v-btn>
          <v-btn fab small dark color="teal" @click="num__input(4)">
            <span>4</span>
          </v-btn>
          <v-btn fab small dark color="teal" @click="num__input(5)">
            <span>5</span>
          </v-btn>
          <v-btn fab small dark color="teal" @click="num__input(6)">
            <span>6</span>
          </v-btn>
          <v-btn fab small dark color="teal" @click="num__input(7)">
            <span>7</span>
          </v-btn>
          <v-btn fab small dark color="teal" @click="num__input(8)">
            <span>8</span>
          </v-btn>
          <v-btn fab small dark color="teal" @click="num__input(9)">
            <span>9</span>
          </v-btn>
          <v-btn fab small dark color="teal" @click="num__input(0)">
            <span>0</span>
          </v-btn>

          <v-btn fab small dark color="teal" @click="summ__prod = ['']">
            <v-icon>delete_forever</v-icon>
          </v-btn>
          <v-btn fab small dark color="teal" @click="summ__prod.splice(-1, 1)">
            <v-icon>backspace</v-icon>
          </v-btn>
        </v-card-text>
        <v-card-actions style="justify-content: space-around">
          <v-btn color="#fff" small icon flat @click="closeDialogInput">
            <v-icon>close</v-icon>
          </v-btn>
          <v-btn color="#19B200" small icon flat @click="saveQuality">
            <v-icon>check</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <load-table v-if="loadingProduct" />
    <div v-show="!loadingProduct" style="width: 100%">
      <perfect-scrollbar
              v-scroll="paginationScroll"
              :options="scrollOption"
              class="scroll__catalogTable ps"
              :class="{ fixed: scrollBarFixed }"
      >
        <v-data-table
                ref="catalog"
                :headers="headers"
                :items="dataTable"
                :pagination.sync="pagination"
                :total-items="total_items"
                :loading="loading"
                hide-actions
                item-key="name"
                class="elevation-1 table__tamplate-2 catalog__table"
                no-data-text="Немає даних"
        >
          <template v-slot:items="props">
            <tr :class="{ add: btnId(props), 'no-available': props.item.deleted }" >
              <td>
                <v-icon
                        v-if="!btnId(props)"
                        color="#5578EB"
                        @click="
                    dialogQuantity(props.item.id, props.item.quantity, props)
                  "
                        :disabled="props.item.deleted"
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
                        :disabled="props.item.deleted"
                />
              </td>
              <td
                      class="img__table"
                      @click="openImg(props.item.images, props.item.name)"
              >
                <v-badge class="imgBarge__custom" overlap color="green">
                  <template v-slot:badge>
                    <span v-if="props.item.images.length > 1">{{
                      props.item.images.length
                    }}</span>
                  </template>
                  <div>
                    <img
                            v-if="showImgDefault"
                            class="img__display default"
                            src="/images/Spinner.gif"
                            alt="Завантаження"
                    />
                    <img
                            v-if="showImg && props.item.img"
                            :src="props.item.img"
                            style="cursor: zoom-in"
                            class="img__display"
                            onload="this.classList.add('finishLoad')"
                    />
                  </div>
                  <svg
                          v-if="!showImg && !props.item.img"
                          class="img__display"
                          xmlns="http://www.w3.org/2000/svg"
                          width="260"
                          height="260"
                          viewBox="0 0 260 260"
                          fill="none"
                  >
                    <rect width="260" height="260" fill="#E3E3E3" />
                    <rect
                            x="55"
                            y="88"
                            width="150"
                            height="100"
                            rx="10"
                            fill="white"
                    />
                    <rect
                            x="90"
                            y="72"
                            width="80"
                            height="100"
                            rx="10"
                            fill="white"
                    />
                    <rect
                            x="110"
                            y="118"
                            width="40"
                            height="40"
                            rx="20"
                            fill="#E3E3E3"
                    />
                    <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M105 138C105 151.807 116.193 163 130 163C143.807 163 155 151.807 155 138C155 124.193 143.807 113 130 113C116.193 113 105 124.193 105 138ZM130 108C113.431 108 100 121.431 100 138C100 154.569 113.431 168 130 168C146.569 168 160 154.569 160 138C160 121.431 146.569 108 130 108Z"
                            fill="#E3E3E3"
                    />
                  </svg>
                </v-badge>
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
                      class="text-xs-left wrap-text"
                      style="min-width: 275px; width: 275px; white-space: pre-wrap"
              >
                <div class="d-flex position-relative">
                  <v-tooltip
                          v-if="props.item.isSpecificationProduct"
                          top
                          max-width="320px"
                  >
                    <span>Товар зi спецiфiкацii</span>
                    <v-icon
                            slot="activator"
                            class="icon__isSpecification"
                            color="#3D4465"
                            size="16px"
                    >book
                    </v-icon>
                  </v-tooltip>
                  <v-tooltip top max-width="320px" style="padding-left: 20px">
                    <div class="wrap-text">{{ props.item.name }}</div>
                    <span slot="activator">{{
                      props.item.name | truncate(100, "...")
                    }}</span>
                  </v-tooltip>
                </div>
              </td>
              <td class="text-xs-left">
                <span v-if="!props.item.deleted">{{ props.item.price }} &#8372; </span>
                <span v-else style="color: #F24949; font-size: 14px">
                    Товару немає в наявностi
                </span>
              <td
                      class="text-xs-left"
                      @click="
                  dialogQuantity(props.item.id, props.item.quantity, props)
                "
              >
                <div
                        style="display: flex; align-items: center; justify-content: center"
                >
                  <input
                          v-model="props.item.quantity"
                          style="display: flex; width: 0px; opacity: 0"
                          class="table__select"
                  />
                  <span
                          style="font-size: 13px; font-weight: 600; color: #0d47a1"
                  >
                    {{ props.item.quantity >= 1 ? props.item.quantity : 0 }}
                  </span>
                  <span class="ml-1">{{
                    !props.item.unit ? "" : props.item.unit.name
                  }}</span>
                  <v-btn class="mr-0" color="#2A8B1A" icon flat small>
                    <v-icon style="font-size: 16px">edit</v-icon>
                  </v-btn>
                </div>
              </td>
              <td class="text-xs-left" style="max-width: 150px;">
                <v-tooltip top max-width="320px" style="padding-left: 20px">
                  <div class="wrap-text">{{ props.item.category }}</div>
                  <span
                          slot="activator"
                          class="pointer underlineHover ellipsis"
                          style="color: #5578EB"
                          @click="updateCategory(props.item)"
                  >
                    {{ props.item.category }}
                  </span>
                </v-tooltip>
              </td>
              <td class="text-xs-left">
                <div
                        style="display: flex; align-items: center; cursor: pointer"
                >
                  {{
                  props.item.description == null ||
                  props.item.description.length == 0
                  ? "Опис вiдсутнiй"
                  : props.item.description | truncate(20, "...")
                  }}
                  <div
                          v-if="props.item.description.length > 20"
                          @click="descDialog(props.item)"
                  >
                    <v-icon style="font-size: 15px" color="#19B200">
                      more
                    </v-icon>
                  </div>
                </div>
              </td>
            </tr>
          </template>
        </v-data-table>
      </perfect-scrollbar>
      <v-pagination
              v-if="dataTable.length > 0"
              v-model="pagination.page"
              :length="total_pages"
              :total-visible="7"
              color="#2a8b1a"
              class="mt-5"
      />
    </div>
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
    <v-dialog v-model="dialogImg" max-width="500">
      <v-card>
        <v-card-title>
          <span class="headline">{{
            imgSliderName | truncate(40, "...")
          }}</span>
          <v-spacer />
          <v-flex xs1 sm1>
            <v-btn flat icon color="" @click="dialogImg = false">
              <v-icon>close</v-icon>
            </v-btn>
          </v-flex>
        </v-card-title>
        <div class="silerModal">
          <el-carousel
                  :arrow="imgSlider.length <= 1 ? 'never' : 'hover'"
                  height="250px"
          >
            <el-carousel-item v-for="(src, i) in imgSlider" :key="i">
              <img :src="src.url" class="img__slider" />
            </el-carousel-item>
          </el-carousel>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
    import { mapActions, mapGetters } from "vuex"
    import LoadTable from "../../loadTable"

    export default {
        name: "CatalogTable",
        components: { LoadTable },
        props: [
            "selected",
            "filterUuid",
            "listUpdate",
            "id",
            "locationId",
            "canLoad",
            "radiosSpecification",
            "search"
        ],
        data: () => ({
            headers: [
                { text: "", sortable: false },
                { text: "Зображення", sortable: false },
                { text: "Артикул", value: "sku" },
                { text: "Назва", value: "name" },
                { text: "Ціна", value: "price", sortable: false },
                { text: "Кiлькiсть", value: "unit.name" },
                { text: "Категорія", value: "category.name", sortable: false },
                { text: "Опис", value: "description" }
            ],
            dataTable: [],
            pagination: {
                sortBy: "deleted",
                rowsPerPage: 60,
                page: 1
            },
            scrollOption: {
                swipeEasing: true,
                wheelSpeed: 1,
                suppressScrollY: false,
                wheelPropagation: true
            },
            total_items: 0,
            loading: false,
            showImg: false,
            selectedChild: [],
            dialogInput: false,
            summ__prod: [],
            snack: false,
            snackColor: "",
            snackText: "",
            quantity: "",
            idProd: -1,
            valProd: "",
            trigerSave: false,
            scrollBarFixed: true,
            total_pages: 0,
            dataKey: "",
            modalData: {},
            dialogDesc: false,
            dialogImg: false,
            imgSlider: [],
            imgSliderName: "Зображення",
            loadingProduct: true,
            showImgDefault: true
        }),
        computed: {
            ...mapGetters("params", ["searchCatalog"]),
            ...mapGetters("basket", ["newBasketProduct", "idProduct"]),
            ...mapGetters("user", ["currentUser"])
        },
        watch: {
            search(e) {
                this.$nextTick(() => {
                    this.getDataFromApi(true)
                })
            },
            dataTable() {
                this.$emit("productData", this.dataTable)
            },
            dialogInput() {
                this.keymonitor()
            },
            total_items() {
                this.totalPages()
            },
            newBasketProduct() {
                this.qantityFunc()
                this.selectedChild = this.newBasketProduct.map(ctx => {
                    return ctx["id"]
                })
            },
            pagination: {
                handler() {
                    document.querySelector("html").scrollTop = 0
                    if (this.canLoad) {
                        this.getDataFromApi(true)
                    }
                },
                deep: true
            },
            canLoad() {
                this.pagination.page = 0
            },
            listUpdate(e) {
                if (e) {
                    this.getDataFromApi(true)
                }
            },
            radiosSpecification() {
                this.getDataFromApi(true)
            },
            loading(e) {
                this.$loadingBus.$emit("loading", e)
            },
            id() {
                this.getDataFromApi()
            },
            locationId() {
                this.getDataFromApi()
            }
        },
        updated() {
            this.qantityFunc()
        },
        created() {
            this.qantityFunc()
            this.selectedChild = this.newBasketProduct.map(ctx => {
                return ctx["id"]
            })
        },
        methods: {
            ...mapActions("basket", ["setNewBasketProduct"]),
            updateCategory(item) {
                this.$store.dispatch("category/setUUID", { ctx: item.category.uuid })
                this.$loadingBus.$emit("updateBreadcrum", item.category.name)
            },
            openImg(item, name) {
                if (item.length > 0) {
                    this.dialogImg = true
                    this.imgSlider = item
                    this.imgSliderName = name
                }
            },
            closeDialogInput() {
                this.dialogInput = false
                this.summ__prod = [""]
            },
            descDialog(e) {
                this.modalData = e
                this.dialogDesc = true
            },
            paginationScroll(evt, el) {
                let target = el
                let winScrollTop = document.querySelector("html").scrollTop
                let winHeight = document.documentElement.clientHeight
                let targetHeight = this.$el.querySelector(".catalog__table").clientHeight
                let targetPos = target.offsetTop
                this.scrollBarFixed = targetPos + targetHeight - 50 >= winScrollTop + winHeight;
            },
            totalPages() {
                if (this.total_items > 0) {
                    this.pagination.page = 1
                    this.total_pages = Math.ceil(
                        this.total_items / this.pagination.rowsPerPage
                    )
                } else {
                    this.total_pages = 0
                }
            },
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
            qantityFunc() {
                let e = this.newBasketProduct
                this.dataTable.forEach(i => {
                    e.forEach(n => {
                        if (i.id == n.id) {
                            i.quantity = n.quantity
                        } else {
                            i.quantity
                        }
                    })
                })
            },
            socketEmitFreez(freez) {
                this.$socket.emit("userCartAction", {
                    order_id: this.idProduct.order_id,
                    user_id: this.currentUser.id,
                    update: false,
                    freez: freez
                })
            },
            dialogQuantity(id, quantity, val) {
                this.idProd = id
                this.valProd = val
                this.dialogInput = true
            },

            num__input(e) {
                this.summ__prod.push(e)
            },
            saveQuality() {
                this.socketEmitFreez(true)
                let sum = this.summ__prod.reduce((a, b) => a + b, 0)
                if (this.idProd === this.valProd.item.id) {
                    if (sum > 0) {
                        this.valProd.item.quantity = +this.summ__prod.join("")
                        this.summ__prod = []
                        this.dialogInput = false
                        this.snack = true
                        this.snackColor = "#19B200"
                        this.snackText = "Зміни збережені"
                        this.trigerSave = true
                        this.selectedChild.push(this.idProd)

                        let $false = false
                        for (let i = 0; i < this.selectedChild.length; i++) {
                            if (this.selectedChild[i] === this.valProd.item.id) {
                                $false = true
                            }
                        }
                        let newProduct = true
                        let changeQuantity = false
                        let index = undefined
                        this.newBasketProduct.forEach(e => {
                            if (e.id === this.valProd.item.id) {
                                e.newProduct ? (newProduct = true) : (newProduct = false)
                                index = e.index
                            }
                        })
                        if (!this.valProd.item.newProduct) {
                            changeQuantity = true
                        }
                        let price = this.valProd.item.price
                        price = price.replace(/[\s,%]/g, "")
                        let total_sum = +price * +this.valProd.item.quantity
                        this.$api
                            .post("/cart/add-product", {
                                id: this.idProduct.id,
                                order_id: this.idProduct.order_id,
                                product_id: this.valProd.item.id,
                                quantity: this.valProd.item.quantity,
                                price: this.valProd.item.price
                            })
                            // eslint-disable-next-line no-unused-vars
                            .then(response => {
                                // this.socketEmitFreez(false);
                                if (response.data.success) {
                                    this.socketEmit()
                                    this.$nextTick(() => {
                                        this.setNewBasketProduct({
                                            ctx: {
                                                index: index,
                                                id: this.valProd.item.id,
                                                addId: undefined,
                                                lastUpdate: true,
                                                name: this.valProd.item.name,
                                                quantity: this.valProd.item.quantity,
                                                val: $false,
                                                total_sum: total_sum.toFixed(2),
                                                price: this.valProd.item.price,
                                                img: this.valProd.item.img,
                                                newProduct: newProduct,
                                                changeQuantity: changeQuantity
                                            }
                                        })
                                    })
                                }
                            })
                    } else if (sum <= 0) {
                        this.snack = true
                        this.snackColor = "#ff2525"
                        this.snackText = "число больше 0 !"
                    }
                }
            },
            socketEmit() {
                this.$socket.emit("userCartAction", {
                    order_id: this.idProduct.order_id,
                    user_id: this.currentUser.id,
                    update: true
                })
            },
            keyOn(e) {
                if (
                    e.key == 1 ||
                    e.key == 2 ||
                    e.key == 3 ||
                    e.key == 4 ||
                    e.key == 5 ||
                    e.key == 6 ||
                    e.key == 7 ||
                    e.key == 8 ||
                    e.key == 9 ||
                    e.key == 0
                ) {
                    this.dataKey = e.key
                    this.summ__prod.push(this.dataKey)
                }
                if (e.key == "Enter") {
                    this.saveQuality()
                }
                if (e.key == "Backspace") {
                    this.summ__prod.splice(-1, 1)
                }
            },
            keymonitor() {
                if (this.dialogInput) {
                    document.addEventListener("keydown", this.keyOn)
                } else {
                    document.removeEventListener("keydown", this.keyOn)
                }
            },
            changeCheckbox(id, quantity, val) {
                this.socketEmitFreez(true)
                let $false = false
                for (let i = 0; i < this.selectedChild.length; i++) {
                    if (this.selectedChild[i] == val.item.id) {
                        $false = true
                    }
                }
                this.setNewBasketProduct({
                    ctx: {
                        index: val.index,
                        id: val.item.id,
                        quantity: val.item.quantity,
                        val: $false,
                        price: val.item.price
                    }
                })
                this.$api
                    .post("/cart/delete-product", {
                        order_id: this.idProduct.order_id,
                        product_id: val.item.id
                    })
                    // eslint-disable-next-line no-unused-vars
                    .then(response => {
                        this.socketEmit()
                    })
            },
            async getDataFromApi(loadCard) {
                if (loadCard) {
                    this.loadingProduct = true
                } else {
                    this.loading = true
                }
                let url = "/graphql"
                let order = "ASC"
                if (this.pagination.descending) {
                    order = "DESC"
                }
                let order_id = ""
                if (this.locationId && this.id != undefined) {
                    order_id = "location_id: " + this.locationId + " order_id: " + this.id
                } else if (this.id != undefined) {
                    order_id = "order_id: " + this.id
                } else if (this.locationId) {
                    order_id = "location_id: " + this.locationId
                }
                let add_product = false

                if (this.$route.name == "order-add-product") {
                    add_product = true
                }
                await this.$api
                    .post("/search/search", {
                        query: this.search,
                        order: order,
                        order_id: order_id,
                        pagination: this.pagination,
                        specification_only: this.radiosSpecification,
                        add_product: add_product,
                        location_id: this.locationId,
                        category: this.filterUuid,
                    })
                    .then(response => {
                        this.dataTable = response.data.model
                        this.total_items = response.data.total
                        this.showImg = false
                        this.showImgDefault = true
                        setTimeout(() => {
                            this.showImg = true
                            this.loadingProduct = false
                        }, 300)
                        this.loading = false
                        setTimeout(() => (this.showImgDefault = false), 10000);

                    })
                // await this.$api
                //     .post(url, {
                //         query:
                //         `
                //         query{
                //               product(category_uuid: "` +
                //         this.filterUuid +
                //         `" page: ` +
                //         this.pagination.page +
                //         ` perPage: ` +
                //         this.pagination.rowsPerPage +
                //         ` order: "` +
                //         order +
                //         `" orderBy: "` +
                //         this.pagination.sortBy +
                //         `" search: "` +
                //         this.search +
                //         `" ` +
                //         order_id +
                //         ` add_product: ` +
                //         add_product +
                //         ` specification_only: ` +
                //         this.radiosSpecification +
                //         `){
                //                 totalCount
                //                  items{
                //                     id
                //                     deleted
                //                     uuid
                //                     sku
                //                     price
                //                     name
                //                     isSpecificationProduct
                //                     description
                //                     unit{
                //                       name
                //                     }
                //                     img
                //                     images{
                //                         id
                //                         name
                //                         url
                //                      }
                //                     category
                //                     category_uuid
                //                     category_id
                //                     quantity
                //                     isSpecificationProduct
                //                 }
                //               }
                //             }`
                //     })
                //     .then(response => {
                //         this.dataTable = response.data.data.product.items
                //         this.total_items = response.data.data.product.totalCount
                //         this.showImg = false
                //         this.showImgDefault = true
                //         setTimeout(() => {
                //             this.showImg = true
                //             this.loadingProduct = false
                //         }, 300)
                //         setTimeout(() => (this.showImgDefault = false), 10000)
                //         this.loading = false
                //     })
                this.$emit("listUpdated", false)
            }
        }
    }
</script>

<style scoped>
  .icon__isSpecification {
    position: absolute;
    left: 0px;
    top: 2px;
  }
</style>

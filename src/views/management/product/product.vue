<template>
    <div>
        <div class="section__content">
            <div class="section__content__head">
                <button
                        v-if="$store.getters['params/mobileView']"
                        class="button button__yellow catalogFilterBtn"
                        :class="{ active: showCategory }"
                        @click="showCategory = !showCategory"
                ></button>
                <div class="caption">Управління товарами</div>
                <div
                        v-if="$store.getters['params/mobileView']"
                        class="action-right d-flex justify-content-end"
                >
                    <div class="input-box no-margin filters-boxSelect">
                        <i class="icon fas fa-filter"></i>
                        <v-select
                                v-model="filterItemsDefault"
                                hide-details
                                solo
                                :items="filterItems"
                                :clearable="true"
                                :searchable="false"
                                item-text="name"
                                item-value="short_name"
                                label="Виберіть фільтр"
                        />
                    </div>
                </div>
            </div>
            <div class="section__content__head--action">
                <div class="action-left">
                    <modalProduct
                            :category-types="categoryTypes"
                            :management-category="managementCategory"
                            :brand="brand"
                            :dialog="dialog"
                            :update="update"
                            :vendor="vendor"
                            :unit="unit"
                            :uktzed="uktzed"
                            :vat="vat"
                            :model="model"
                            :model-change="modelChange"
                            @closeDialog="closeDialog"
                            @listUpdated="listUpdated"
                            @changeOn="changeOn"
                    />
                    <div
                            v-if="!$store.getters['params/mobileView']"
                            class="button button__blue"
                            :class="{ active: showCategory }"
                            @click="showCategory = !showCategory"
                    >
                        <v-icon v-if="!showCategory" class="mr-2">apps</v-icon>
                        <v-icon v-else class="mr-2">close</v-icon>
                        Категорії
                    </div>
                    <v-menu offset-y content-class="menu-default">
                        <template v-slot:activator="{ on }">
                            <div
                                    v-show="
                  $root.rbac.managementImportCatalog ||
                    $root.rbac.managementImportPrice ||
                    $root.rbac.managementImportImage
                "
                                    class="button button__blue upload"
                                    v-on="on"
                            >
                                Імпорт
                                <v-icon class="pos-right">more_horiz</v-icon>
                            </div>
                        </template>
                        <v-list>
                            <v-list-tile
                                    v-show="$root.rbac.managementImportCatalog"
                                    class="upload-fileItem"
                            >
                                Імпорт товарiв
                                <input ref="files7" type="file" @change="handleFileUpload(7)"/>
                            </v-list-tile>
                            <v-list-tile
                                    v-show="$root.rbac.managementImportPrice"
                                    class="upload-fileItem"
                            >
                                Імпорт цiн
                                <input ref="files6" type="file" @change="handleFileUpload(6)"/>
                            </v-list-tile>
                            <v-list-tile
                                    v-show="$root.rbac.managementImportImage"
                                    class="upload-fileItem"
                            >
                                Імпорт зображень
                                <input ref="files8" type="file" @change="handleFileUpload(8)"/>
                            </v-list-tile>
                        </v-list>
                    </v-menu>
                </div>
                <div v-if="!$store.getters['params/mobileView']" class="action-right">
                    <div class="input-box no-margin filters-boxSelect">
                        <i class="icon fas fa-filter"></i>
                        <v-select
                                v-model="filterItemsDefault"
                                hide-details
                                solo
                                :items="filterItems"
                                :clearable="false"
                                :searchable="false"
                                single-line
                                persistent-hint
                                item-text="name"
                                item-value="short_name"
                                label="Виберіть фільтр"
                        />
                    </div>
                </div>
            </div>
            <div class="category__wrap mb-3" :class="{ open: showCategory }">
                <label>Вибір категорії</label>
                <div class="category__wrap__section">
                    <div class="category__wrap__box">
                        <filterCategory
                                :clear="clear"
                                :order_id="selectedId"
                                :location_id="location_id"
                                @checkedCategory="checkedCategory"
                        />
                    </div>
                </div>

                <div class="category__wrap__section__footer">
                    <span></span>
                    <span class="clear" @click="clearCategory">Очистити</span>
                </div>
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
                    <tr v-bind:class="[props.item.deleted === 1 ? 'no-available' : '']" @click="editItem(props.item)">
                        <td
                                v-if="filterItemsDefault == 'is_buffer'"
                                width="50px"
                                class="icon"
                        >
                            <div>
                                <v-tooltip right>
                                    <v-icon
                                            v-if="props.item.buffer_status == 2"
                                            slot="activator"
                                            style="color: white; background-color: #19B200;"
                                    >
                                        done
                                    </v-icon>
                                    <v-icon
                                            v-if="props.item.buffer_status == 1"
                                            slot="activator"
                                            style="color: white; background-color: #C7A500;"
                                    >
                                        done
                                    </v-icon>
                                    <v-icon
                                            v-if="props.item.buffer_status == 0"
                                            slot="activator"
                                            style="color: white; background-color: #F24949;"
                                    >
                                        priority_high
                                    </v-icon>
                                    <span v-if="props.item.buffer_status == 2">
                    Переданий в 1с
                  </span>
                                    <span v-if="props.item.buffer_status == 1">
                    Обробляється
                  </span>
                                    <span v-if="props.item.buffer_status == 0">
                    Редагується. Не передано на 1с
                  </span>
                                </v-tooltip>
                            </div>
                        </td>
                        <td
                                class="img__table"
                                @click.stop="openImg(props.item.images, props.item.name)"
                        >
                            <v-badge class="imgBarge__custom" overlap color="green">
                                <template v-slot:badge>
                  <span v-if="props.item.images.length > 1">{{
                    props.item.images.length
                  }}</span>
                                </template>
                                <img
                                        v-if="props.item.images.length"
                                        :src="props.item.images[0].url"
                                        class="img__display"
                                        onload="this.classList.add('finishLoad')"
                                />
                                <svg
                                        v-else
                                        class="img__display"
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="260"
                                        height="260"
                                        viewBox="0 0 260 260"
                                        fill="none"
                                >
                                    <rect width="260" height="260" fill="#E3E3E3"/>
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
                        <td>
                            <v-tooltip top max-width="320px">
                                <div class="wrap-text">{{ props.item.sku }}</div>
                                <span slot="activator">{{
                  props.item.sku | truncate(20, "...")
                }}</span>
                            </v-tooltip>
                        </td>
                        <td class="wrap-text" style="min-width: 210px">
                            <v-tooltip top max-width="320px">
                                <div class="wrap-text">{{ props.item.name }}</div>
                                <span slot="activator">{{
                  props.item.name | truncate(100, "...")
                }}</span>
                            </v-tooltip>
                        </td>
                        <td style="max-width: 100px">{{ props.item.buy_price }}</td>
                        <td>{{ props.item.unit_name }}</td>
                        <td class="wrap-text" style="max-width: 200px">
                            <span>{{ props.item.category_name }}</span>
                        </td>
                        <td class="text-wrap" style="min-width: 150px">
                            <v-tooltip top>
                <span slot="activator">{{
                  props.item.description | truncate(40, "...")
                }}</span>
                                <span>{{ props.item.description }}</span>
                            </v-tooltip>
                        </td>
                        <td
                                class="text-wrap"
                                style="word-break: break-all; min-width: 150px"
                        >
                            <v-tooltip top max-width="320px">
                                <div class="wrap-text">{{ props.item.brand_name }}</div>
                                <span slot="activator">{{
                  props.item.brand_name | truncate(30, "...")
                }}</span>
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
                                    <v-list-tile
                                            v-show="
                      $root.rbac.managementProductBuffer &&
                        props.item.buffer_status == 0 &&
                        props.item.is_buffer
                    "
                                    >
                                        <v-list-tile-title
                                                @click="sendBufferDialogOpen(props.item.id)"
                                        >
                                            Передати на 1с
                                        </v-list-tile-title>
                                    </v-list-tile>
                                    <v-list-tile
                                            v-show="
                      $root.rbac.managementProductBuffer &&
                        props.item.buffer_status == 2
                    "
                                    >
                                        <v-list-tile-title
                                                @click="reSendBufferDialogOpen(props.item.id, props.item)"
                                        >
                                            Обробити повторно
                                        </v-list-tile-title>
                                    </v-list-tile>
                                    <v-list-tile v-show="$root.rbac.managementProductUpdate">
                                        <v-list-tile-title @click="editItem(props.item)">
                                            Деталі
                                        </v-list-tile-title>
                                    </v-list-tile>
                                    <v-list-tile
                                            v-show="
                      $root.rbac.managementProductUpdate &&
                        props.item.buffer_status == 0
                    "
                                    >
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
            <v-dialog v-model="dialogImg" max-width="500">
                <v-card>
                    <v-card-title>
            <span class="headline">{{
              imgSliderName | truncate(40, "...")
            }}</span>
                        <v-spacer/>
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
                                <img :src="src.url" class="img__slider"/>
                            </el-carousel-item>
                        </el-carousel>
                    </div>
                </v-card>
            </v-dialog>
            <v-dialog v-model="dialogStatus" max-width="400px">
                <v-card>
                    <v-card-title class="headline">{{ dialogStatusHead }}</v-card-title>
                    <v-card-text>
                        {{ dialogStatusText }}
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer/>
                        <button class="button button__blue" @click="dialogStatus = false">
                            Скасувати
                        </button>
                        <button class="button button__yellow" @click="dialogStatusAction()">
                            Підтвердити
                        </button>
                    </v-card-actions>
                </v-card>
            </v-dialog>
            <v-snackbar
                    v-model="snack"
                    :bottom="true"
                    :color="snackColor"
                    :timeout="6000"
            >
                <span v-html="snackMsg"></span>
                <v-btn color="pink" flat icon @click="snack = false">
                    <v-icon> close</v-icon>
                </v-btn>
            </v-snackbar>
        </div>
    </div>
</template>

<script>
    import modalProduct from "./modalProduct"
    import filterCategory from "@/views/specification/catalog/filterCategory"
    import {mapGetters} from "vuex"

    export default {
        name: "ImportEntity",
        components: {modalProduct, filterCategory},
        data() {
            return {
                selectedId: undefined,
                location_id: 0,
                clear: false,
                showCategory: false,
                filterUuid: "",

                dialogImg: false,
                imgSlider: [],
                imgSliderName: "Зображення",
                dataTable: [],
                model: {
                    id: 0,
                    uuid: "",
                    sku: "",
                    uktzed: "",
                    vat: "",
                    buy_price: "",
                    name: "",
                    description: "",
                    unit_uuid: "",
                    unit_name: "",
                    category_uuid: "",
                    category_name: "",
                    images: [],
                    vendor_id: 0,
                    brand_id: "",
                    props: [],
                    is_buffer: 1,
                    files: [],
                    buffer_status: ""
                },
                dialogStatusHead: "",
                dialogStatusText: "",
                dialogStatusAct: -1,
                dialogStatus: false,
                categoryTypes: [],
                managementCategory: [],
                brand: [],
                vendor: [],
                unit: [],
                uktzed: [],
                vat: [],
                total_items: 0,
                files: "",
                fileList: [],
                snack: false,
                snackMsg: "",
                snackColor: "",
                inProgress: false,
                loading: false,
                dialog: false,
                update: false,
                updateListVal: false,
                pagination: {
                    sortBy: "deleted",
                    rowsPerPage: 60,
                    page: 1,
                    descending: false
                },
                headers: [
                    {text: "Зображення", value: "img", align: "left", sortable: false},
                    {text: "Артикул", value: "sku", align: "left"},
                    {text: "Назва", value: "name", align: "left"},
                    {text: "Зак. ціна", value: "buy_price", align: "left"},
                    {text: "Од.вим", value: "unit.name", align: "left"},
                    {text: "Категорія", value: "category.name", align: "left"},
                    {text: "Опис", value: "description", align: "left"},
                    {text: "Марка/бренд", value: "uuid", align: "left"},
                    {text: "", value: "actions", sortable: false}
                ],
                filterItems: [
                    {name: "Всi товари", short_name: "", id: 0},
                    {name: "Без артикула", short_name: "empty_sku", id: 1},
                    {name: "Без УКТЗЕД", short_name: "empty_uktzed", id: 2},
                    {name: "Без опису", short_name: "empty_description", id: 3},
                    {name: "Без постачальника", short_name: "empty_vendor", id: 4},
                    {name: "Без марки", short_name: "empty_brand", id: 5},
                    {name: "Без фото", short_name: "empty_photo", id: 6},
                    {name: "Без ціни", short_name: "empty_price", id: 7},
                    {name: "Без категорії", short_name: "empty_category", id: 8},
                    {name: "Без одиниць вимірювань", short_name: "empty_unit", id: 9},
                    {name: "Буфер", short_name: "is_buffer", id: 0}
                ],
                filterItemsDefault: "",
                modelChange: false
            }
        },
        watch: {
            "model.vendor_id": function (e) {
                this.changeVendor(e)
            },
            filterItemsDefault() {
                if (this.filterItemsDefault == "is_buffer") {
                    this.headers = [
                        {text: "", value: "is_buffer", align: "left", sortable: false},
                        {text: "Зображення", value: "img", align: "left", sortable: false},
                        {text: "Артикул", value: "sku", align: "left"},
                        {text: "Назва", value: "name", align: "left"},
                        {text: "Зак. ціна", value: "buy_price", align: "left"},
                        {text: "Од.вим", value: "unit.name", align: "left"},
                        {text: "Категорія", value: "category.name", align: "left"},
                        {text: "Опис", value: "description", align: "left"},
                        {text: "Код", value: "uuid", align: "left"},
                        {text: "", value: "actions", sortable: false}
                    ]
                } else {
                    this.headers = [
                        {text: "Зображення", value: "img", align: "left", sortable: false},
                        {text: "Артикул", value: "sku", align: "left"},
                        {text: "Назва", value: "name", align: "left"},
                        {text: "Зак. ціна", value: "buy_price", align: "left"},
                        {text: "Од.вим", value: "unit.name", align: "left"},
                        {text: "Категорія", value: "category.name", align: "left"},
                        {text: "Опис", value: "description", align: "left"},
                        {text: "Код", value: "uuid", align: "left"},
                        {text: "", value: "actions", sortable: false}
                    ]
                }
                this.getDataFromApi()
            },
            updateListVal(e) {
                console.log("hello update")
                if (e) {
                    this.$nextTick(() => this.getDataFromApi())
                }
            },
            roles() {
                this.$emit("rolesList", {roles: this.roles, company: this.company})
            },
            loading(e) {
                this.$loadingBus.$emit("loading", e)
            },
            filterUuid() {
                this.updateListVal = true
            },
            update(e) {
                // console.log(e)
                if (!e) {
                    this.model.is_buffer = 1
                }
            },
            search() {
                this.getDataFromApi()
            },
            pagination: {
                handler() {
                    this.getDataFromApi()
                },
                deep: true
            }
        },
        mounted() {
            this.getDataFromApi()
            this.apiModel()
        },
        methods: {
            //filter methods
            checkedCategory(e) {
                this.filterUuid = e.uuid
            },
            clearCategory() {
                this.clear = true
                let $this = this
                setTimeout(function () {
                    $this.clear = false
                }, 100)
            },

            //---------------------------------------------

            editItem(e) {
                this.model = e
                this.dialog = true
                this.update = true
            },
            openImg(item, name) {
                if (item.length > 0) {
                    this.dialogImg = true
                    this.imgSlider = item
                    this.imgSliderName = name
                }
            },
            removeDialogOpen(id) {
                this.dialogStatusModel = id
                this.dialogStatusHead = "Выдалити товар?"
                this.dialogStatusText = "Ви впевнені, що хочете видалити товар?"
                this.dialogStatusAct = 3
                this.dialogStatus = true
            },
            sendBufferDialogOpen(id) {
                this.dialogStatusModel = id
                this.dialogStatusHead = "Передати на 1С?"
                this.dialogStatusText = "Ви впевнені, що хочете Передати на 1С?"
                this.dialogStatusAct = 4
                this.dialogStatus = true
            },
            reSendBufferDialogOpen(id, itemModel) {
                this.dialogStatusModel = itemModel
                this.dialogStatusHead = "Передати на 1С?"
                this.dialogStatusText = "Ви впевнені, що хочете Передати на 1С?"
                this.dialogStatusAct = 2
                this.dialogStatus = true
            },
            dialogStatusAction() {
                if (this.dialogStatusAct == 3) {
                    this.removeBtn(this.dialogStatusModel)
                }
                if (this.dialogStatusAct == 4) {
                    this.sendBuffer(this.dialogStatusModel)
                }
                if (this.dialogStatusAct == 2) {
                    this.reSendBuffer(this.dialogStatusModel)
                }

                this.dialogStatus = false
            },
            sendBuffer(id) {
                this.$api.post("product/approve-buffer", {id: id}).then(response => {
                    if (response.data.success) {
                        this.listUpdated(true)
                    }
                })
            },
            reSendBuffer(item) {
                this.$api
                    .post("product/restart-buffer", {id: item.id})
                    .then(response => {
                        if (response.data.success) {
                            this.listUpdated(true)
                            this.editItem(item)
                        }
                    })
            },
            removeBtn() {
                this.$api
                    .post("/product/delete", {id: this.dialogStatusModel})
                    .then(response => {
                        if (response.data.success) {
                            this.listUpdated(true)
                        }
                    })
            },
            changeVendor(id) {
                this.loading = true
                var url = "/graphql"
                this.$api
                    .post(url, {
                        query:
                        `
                        query{

                              brand(vendor_id: ` +
                        id +
                        `){
                                id
                                name
                              }

                            }`
                    })
                    .then(response => {
                        this.brand = response.data.data.brand
                        this.loading = false
                    })
                this.listUpdated(false)
                // console.log('load budjet')
            },
            closeDialog(e) {
                this.dialog = e
                if (!e) {
                    this.model = {
                        id: 0,
                        uuid: "",
                        sku: "",
                        uktzed: "",
                        vat: "",
                        buy_price: "",
                        name: "",
                        description: "",
                        unit_uuid: "",
                        unit_name: "",
                        category_uuid: "",
                        category_name: "",
                        images: [],
                        vendor_id: 0,
                        brand_id: "",
                        props: [],
                        is_buffer: 1,
                        files: [],
                        buffer_status: ""
                    }
                }
                this.update = false
            },
            listUpdated(e) {
                this.updateListVal = e
                this.modelChange = false
            },
            getDataFromApi() {
                this.loading = true
                var url = "/graphql"
                let order = "ASC"
                if (this.pagination.descending) {
                    order = "DESC"
                }
                let filterItemsDefault = this.filterItemsDefault
                if (filterItemsDefault !== undefined && filterItemsDefault.length > 0) {
                    filterItemsDefault += ":true"
                } else {
                    filterItemsDefault = ""
                }
                this.$api
                    .post(url, {
                        query:
                        `
                        query{
                              managementProduct(page: ` +
                        this.pagination.page +
                        ` category_uuid: "` +
                        this.filterUuid +
                        `" perPage: ` +
                        this.pagination.rowsPerPage +
                        ` order: "` +
                        order +
                        `" orderBy: "` +
                        this.pagination.sortBy +
                        `"  search: "` +
                        this.search +
                        `" ` +
                        filterItemsDefault +
                        `){
                                 totalCount
                                 items{
                                  id
                                  uuid
                                  sku
                                  uktzed
                                  vat
                                  buy_price
                                  name
                                  description
                                  unit_uuid
                                  unit_name
                                  category_uuid
                                  category_name
                                  deleted
                                  images{
                                    id
                                    name
                                    url
                                  }
                                  vendor_id
                                  brand_id
                                  brand_name
                                  props
                                  is_buffer
                                  buffer_status
                                  category_type
                                }
                              }
                            }`
                    })
                    .then(response => {
                        this.dataTable = response.data.data.managementProduct.items
                        this.total_items = response.data.data.managementProduct.totalCount
                        this.loading = false
                    })
                this.listUpdated(false)
            },
            apiModel() {
                this.loading = true
                var url = "/graphql"
                // eslint-disable-next-line no-unused-vars
                let order = "DESC"
                this.$api
                    .post(url, {
                        query: `
                        query{
                              categoryTypes{
                                id
                                name
                              }
                              managementCategory{
                                uuid
                                name
                                type
                              }
                              brand{
                                id
                                name
                              }
                              vendor{
                                id
                                name
                              }
                              unit{
                                id
                                uuid
                                name
                              }
                              uktzed{
                                id
                                short_name
                                uuid
                              }
                              vat
                            }`
                    })
                    .then(response => {
                        this.categoryTypes = response.data.data.categoryTypes
                        this.managementCategory = response.data.data.managementCategory
                        // this.brand = response.data.data.brand;
                        this.vendor = response.data.data.vendor
                        this.unit = response.data.data.unit
                        this.uktzed = response.data.data.uktzed
                        this.vat = response.data.data.vat
                        this.loading = false
                    })
                this.listUpdated(false)
            },
            handleFileUpload(id) {
                this.files = this.$refs["files" + id].files
                let formData = new FormData()
                formData.append("id", id)
                for (let i = 0; i < this.files.length; i++) {
                    let file = this.files[i]
                    formData.append("files", file)
                }
                this.$api
                    .post("/import", formData, {
                        headers: {"Content-Type": "multipart/form-data"}
                    })
                    .then(response => {
                        if (response.data.success) {
                            this.snack = true
                            this.snackColor = "#FCBD00"
                            this.snackMsg = "Завдання поставлено в чергу."
                        } else {
                            this.snack = true
                            this.snackColor = "#FCBD00"
                            this.snackMsg = "Помилка!"
                        }
                    })
            },
            changeOn(e) {
                // console.log(e);
                if (
                    this.model.name !== "" &&
                    this.model.category_uuid !== "" &&
                    this.model.vat !== "" &&
                    this.model.buy_price !== "" &&
                    this.model.unit_uuid !== ""
                ) {
                    this.modelChange = e
                } else {
                    this.modelChange = false
                }
            }
        },
        computed: {
            ...mapGetters("params", ["search"])
        }
    }
</script>

<style lang="sass">
    .imgBarge__custom
        .v-badge__badge
            display: flex
            align-items: center
            justify-content: center
            line-height: 20px
            height: 20px
            min-width: 20px
            font-size: 13px
            border-radius: 15px
            padding-left: 3px
            width: auto
            padding-right: 3px
            top: -5px
            right: 5px
</style>

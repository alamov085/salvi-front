<template>
  <div class="section__content">
    <my-dialog
      :model="myDialog"
      :button-one="btnClose"
      :button-two="btnApprove"
      :item="dialogItem"
      :text="dialogText"
      :headline="dialogHeadline"
      @buttonOne="buttonOne"
      @buttonTwo="buttonTwo"
    >
      <div slot="body">
        <p slot="text">{{ dialogText }}</p>
        <div v-if="otherSpecification.length" class="modal-scrollBox">
          <div class="caption">Перейдiть до специфiкацї:</div>
          <div class="scrollWrap">
            <router-link
              v-for="(spec, k) in otherSpecification"
              :key="k"
              :to="`/specification/${spec.id}`"
              class="link-default"
            >
              {{ spec.name }}
            </router-link>
          </div>
        </div>
      </div>
    </my-dialog>
    <div class="section__content__head">
      <div class="caption">Специфікація</div>
    </div>
    <v-flex class="section__box__head">
      <div class="section__box__head__body">
        <div class="item">
          <span class="head">Договір:</span>
          <v-tooltip v-if="!loading" top max-width="320px">
            <div class="wrap-text">{{ model.contract.name }}</div>
            <span slot="activator" class="desc">{{
              model.contract.name | truncate(20, "...")
            }}</span>
          </v-tooltip>
        </div>
        <div class="item">
          <span class="head">Локації:</span>
          <div v-if="!loading" class="desc">
            <c_chips :id-object="model.locationModel" :use-arr="false" />
          </div>
        </div>
        <div class="item">
          <span class="head">Юр.особа:</span>
          <span v-if="!loading" class="desc wrap-text">{{
            model.company.short_name
          }}</span>
        </div>
      </div>
    </v-flex>
    <div
      v-disable-all="!$root.rbac.updateSpecification"
      class="section__box__head"
    >
      <div class="section__box__head__body" style="overflow: visible">
        <div class="specification__edit">
          <div class="input-box">
            <label>Назва</label>
            <input
              v-model="model.name"
              type="text"
              class="input-default"
              placeholder="Введіть назву специфікації"
            />
            <div class="error__box">
              <span>{{ errors.name }}</span>
            </div>
          </div>
          <div class="input-box">
            <label>Статус</label>
            <v-select
              v-model="model.status"
              class=" "
              hide-details
              solo
              :items="statuses"
              :clearable="false"
              :searchable="false"
              placeholder=""
              item-text="name"
              item-value="id"
              :disabled="
                !$root.rbac.changeStatusSpecification &&
                  !$root.rbac.updateSpecification
              "
            />
            <div class="error__box">
              <span>{{ errors.contract_id }}</span>
            </div>
          </div>
          <div class="input-box">
            <label>Дата старту</label>
            <v-dialog
              ref="dialog_start"
              v-model="modal_date_start"
              content-class="datepicker"
              :return-value.sync="model.date_start"
              persistent
              lazy
              full-width
              width="290px"
            >
              <template v-slot:activator="{ on }">
                <input
                  v-model="model.date_start"
                  type="text"
                  class="input-default"
                  placeholder="ДД/ММ/ГГГГ"
                  prepend-icon="event"
                  readonly
                  v-on="on"
                />
                <div class="error__box">
                  <span>{{ errors.date_start }}</span>
                </div>
              </template>
              <v-date-picker
                v-model="model.date_start"
                first-day-of-week="1"
                locale="uk"
                dark
                scrollable
              >
                <v-spacer />
                <v-btn flat color="primary" @click="modal_date_start = false">
                  Відмінити
                </v-btn>
                <v-btn
                  flat
                  color="primary"
                  @click="$refs.dialog_start.save(model.date_start)"
                >
                  OK
                </v-btn>
              </v-date-picker>
            </v-dialog>
          </div>
          <div class="input-box">
            <label>Дата завершення</label>
            <v-dialog
              ref="dialog_end"
              v-model="modal_date_end"
              content-class="datepicker"
              :return-value.sync="model.date_end"
              persistent
              lazy
              full-width
              width="290px"
            >
              <template v-slot:activator="{ on }">
                <input
                  v-model="model.date_end"
                  type="text"
                  class="input-default"
                  placeholder="ДД/ММ/ГГГГ"
                  prepend-icon="event"
                  readonly
                  v-on="on"
                />
                <div class="error__box">
                  <span>{{ errors.date_end }}</span>
                </div>
              </template>
              <v-date-picker
                v-model="model.date_end"
                first-day-of-week="1"
                locale="uk"
                dark
                scrollable
              >
                <v-spacer />
                <v-btn flat color="primary" @click="modal_date_end = false">
                  Відмінити
                </v-btn>
                <v-btn
                  flat
                  color="primary"
                  @click="$refs.dialog_end.save(model.date_end)"
                >
                  OK
                </v-btn>
              </v-date-picker>
            </v-dialog>
          </div>
          <div class="">
            <v-flex xs12 class="">
              <div class="checkbox__custom">
                <v-checkbox
                  v-model="model.all_location"
                  :label="`Доступний у всіх локаціях`"
                />
                <template>
                  <v-tooltip top>
                    <template v-slot:activator="{ on }">
                      <i class="vsm-icon icon-info" v-on="on"></i>
                    </template>
                    <span>Специфікація доступна всім локаціям договору</span>
                  </v-tooltip>
                </template>
              </div>
            </v-flex>
          </div>
          <div v-if="!model.all_location" class="input-box">
            <label>Локації</label>
            <v-select
              v-model="model.locations_id"
              class="v-select-empty"
              hide-details
              solo
              deletable-chips
              chips
              multiple
              :items="locations"
              :clearable="false"
              :searchable="false"
              placeholder=""
              item-text="name"
              item-value="id"
              :disabled="
                !$root.rbac.changeStatusSpecification &&
                  !$root.rbac.updateSpecification
              "
              @change="locationsEdit"
            >
              <template v-slot:selection="{ item, index, locations_id }">
                <v-chip v-if="index === 0">
                  <span>{{ item.name }}</span>
                </v-chip>
                <v-chip v-if="index === 1">
                  <span>{{ item.name }}</span>
                </v-chip>
                <span v-if="index === 2" class="grey--text labelOther">
                  (ще + {{ model.locations_id.length - 2 }} )
                </span>
              </template>
            </v-select>
            <div class="error__box">
              <span>{{ errors.locations_id }}</span>
            </div>
          </div>
          <button
            v-show="$root.rbac.updateSpecification && updateModel"
            class="button button__yellow"
            @click="updateSpecification"
          >
            Оновити
          </button>
        </div>
      </div>
    </div>
    <div v-show="$root.rbac.updateSpecification" class="specification__row">
      <div class="box__button wrap">
        <router-link
          :to="`/specification/create/${id}`"
          tag="button"
          class="button button__yellow toCatalog"
        >
          Додати товар
        </router-link>
        <button class="button button__green toCatalog" @click="getCategory">
          Додати категорію
        </button>
      </div>
      <form class="setting__specification">
        <div class="input-box ">
          <label>Відсоток націнки на інші товари</label>
          <input v-model="model.markup" class="input-default" />
          <div class="box__button mt-2">
            <button class="button button__yellow mr-2" @click="updateMarkup">
              Застосувати
            </button>
            <button class="button button__border-blue">Відмінити</button>
          </div>
        </div>
      </form>
    </div>

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
          <b style="font-size: 16px; color: white">{{
            this.summ__prod.join("")
          }}</b>
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

          <v-btn fab small dark color="teal" @click="summ__prod = []">
            <v-icon>delete_forever</v-icon>
          </v-btn>
          <v-btn fab small dark color="teal" @click="summ__prod.splice(-1, 1)">
            <v-icon>backspace</v-icon>
          </v-btn>
        </v-card-text>
        <div class="w-100 d-flex">
          <v-btn
            dark
            color="teal"
            class="m-auto"
            @click="num__input(-1), saveQuality()"
          >
            необмежено
          </v-btn>
        </div>

        <v-card-actions style="justify-content: space-around">
          <v-btn color="#fff" small icon flat @click="exitDialog">
            <v-icon>close</v-icon>
          </v-btn>
          <v-btn color="#19B200" small icon flat @click="saveQuality">
            <v-icon>check</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-data-table
      :headers="headers"
      :items="dataTable"
      :pagination.sync="pagination"
      :total-items="total_items"
      :loading="loading"
      class="elevation-1 table__tamplate-2"
      no-data-text="Немає даних"
    >
      <template v-slot:headers="props">
        <th
          v-for="(header, k) in props.headers"
          v-show="
            header.roleShow ||
              $root.rbac.updateSpecification ||
              (!header.roleShow && !$root.rbac.viewSpecificationDetail)
          "
          :key="header.text + k"
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
        <td class="icon">
          <v-tooltip v-if="props.item.manual_markup" z-index="101" bottom>
            <v-icon
              slot="activator"
              style="color: white; background-color: #F24949; cursor: pointer"
              @click="manualMarkup(props.item)"
            >
              lock
            </v-icon>
            <span>Вартість товару без залежності від загальної націнки.</span>
          </v-tooltip>
          <v-tooltip v-else z-index="101" bottom>
            <v-icon
              slot="activator"
              style="color: white; background-color: #19B200; cursor: pointer"
              @click="manualMarkup(props.item)"
            >
              lock_open
            </v-icon>
            <span>Вартість товару з залежністю від загальної націнки.</span>
          </v-tooltip>
          <v-tooltip
            v-if="!props.item.status"
            z-index="101"
            max-width="200px"
            right
          >
            <v-icon
              slot="activator"
              class="ml-2"
              style="color: white; background-color: #F24949; cursor: pointer"
              @click="receivedOrder(props.item)"
            >
              control_camera
            </v-icon>
            <span>
              Товар не доступний. В інших специфікаціях, закріплених за цими ж
              локаціями, так само є даний товар, і, може бути доступним тільки
              на одній з таких специфікацій. Натисніть на кнопочку, щоб зробити
              доступним даний товар в цій специфікації
            </span>
          </v-tooltip>
        </td>
        <td>
          <v-tooltip bottom max-width="320px">
            <div class="wrap-text">{{ props.item.product.sku }}</div>
            <span slot="activator">{{
              props.item.product.sku | truncate(20, "...")
            }}</span>
          </v-tooltip>
        </td>
        <td
          class="text-xs-left ellipsis"
          style="min-width: 320px; display: block; max-width: 400px"
        >
          <v-tooltip bottom max-width="320px">
            <div class="wrap-text">{{ props.item.product.name }}</div>
            <span slot="activator">{{
              props.item.product.name | truncate(20, "...")
            }}</span>
          </v-tooltip>
        </td>
        <td class="text-xs-left">
          <div class="d-flex">
            <span>{{
              !props.item.product.unit ? "" : props.item.product.unit.name
            }}</span>
          </div>
        </td>
        <td
          v-if="
            $root.rbac.updateSpecification ||
              !$root.rbac.viewSpecificationDetail
          "
          class="text-xs-left"
        >
          {{ props.item.product.buy_price }}
        </td>
        <td class="text-xs-left">
          <div :class="[props.item.product.deleted === 1 ? 'no-have' : '']">{{ props.item.product.deleted === 1 ? 'немає в наявності' : 'в наявності' }}</div>
        </td>
        <td class="text-xs-left">
          <v-tooltip bottom>
            <v-icon
              v-if="!props.item.use_markup"
              slot="activator"
              class="istar"
            >
              star
            </v-icon>
            <span>Фiксована цiна</span>
          </v-tooltip>

          <input
            v-model="props.item.price"
            :disabled="!$root.rbac.updateSpecification"
            style="max-width: 100px"
            @change="changePriceMarkup(props.item)"
          />
        </td>
        <td
          v-if="
            $root.rbac.updateSpecification ||
              !$root.rbac.viewSpecificationDetail
          "
          class="text-xs-left"
        >
          <v-tooltip bottom>
            <v-icon v-if="props.item.use_markup" slot="activator" class="istar">
              star
            </v-icon>
            <span>Фiксована нацiнка</span>
          </v-tooltip>

          <input
            v-model="props.item.markup"
            :disabled="!$root.rbac.updateSpecification"
            style="max-width: 100px"
            @change="changePriceMarkup(props.item)"
          />
        </td>
        <td
          class="text-xs-left"
          @click="dialogQuantity(props.item.id, props.item.quantity, props)"
        >
          <!--<input v-model="props.item.quantity" v-on:change="changeQuantity(props.item)"-->
          <!--:disabled="!$root.rbac.updateSpecification" style="max-width: 100px">-->
          <span v-html="qantityFunc(props.item)"></span>
        </td>
        <td class="text-xs-left">
          <div class="d-flex">
            <i
              v-show="$root.rbac.updateSpecification"
              class="icon icon-delete"
              @click="deleteItem(props.item)"
            ></i>
          </div>
        </td>
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
    <v-dialog
      v-model="dialogCategory"
      :fullscreen="$store.getters['params/mobileView']"
      persistent
      max-width="700px"
    >
      <v-card>
        <v-card-title>
          <span class="headline">Додати товар</span>
          <v-spacer />
          <v-flex xs1 sm1>
            <v-btn flat icon color="" @click="dialogCategory = false">
              <v-icon>close</v-icon>
            </v-btn>
          </v-flex>
        </v-card-title>
        <v-container grid-list-md>
          <v-flex class="price__tree__category">
            <div class="price__tree__category__head">
              <label>Додати категорію:</label>
              <label>Нацiнка:</label>
            </div>
            <v-treeview
              v-model="selection"
              :active.sync="active"
              :items="items"
              :open.sync="open"
              item-key="uuid"
              activatable
              item-text=""
              :label="false"
              color="warning"
              transition
              :selection-type="selectionType"
              selectable
              return-object
            >
              <template v-slot:append="{ item, open }">
                <span class="v-treeview__label" :title="item.name">{{
                  item.name
                }}</span>
                <div class="v-treeview__label__box-input">
                  <input
                    v-model="item.markup"
                    placeholder="%"
                    @keypress="onlyForCurrency(item, $event)"
                    @change="markupItem(item)"
                  />
                </div>
              </template>
            </v-treeview>
          </v-flex>
        </v-container>
        <v-card-actions>
          <v-spacer />
          <button
            class="button button__blue"
            flat
            @click="dialogCategory = false"
          >
            Відмінити
          </button>
          <button class="button button__yellow" flat @click="addProduct">
            Додати
          </button>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex"

export default {
  name: "SpecificationDetail",
  props: ["id"],
  data() {
    return {
      radios: "radio-1",
      selected: [],
      headers: [
        { text: "", value: "manual", sortable: false, roleShow: true },
        { text: "Артикул", value: "product.sku", roleShow: true },
        { text: "Назва", value: "product.name", roleShow: true },
        { text: "Од.виміру", value: "unit.name", roleShow: true },
        { text: "РРЦ", value: "product.buy_price", roleShow: false },
        { text: "Cтатус", value: "status", roleShow: true },
        { text: "Ціна", value: "mprice", roleShow: true },
        {
          text: "Націнка %",
          value: "specification_product.markup",
          roleShow: false
        },
        {
          text: "Кількість",
          value: "specification_product.quantity",
          roleShow: true
        },
        { text: "", value: "carbs", sortable: false, roleShow: true }
      ],
      pagination: {
        sortBy: "id",
        rowsPerPage: 50,
        page: 1,
        descending: false
      },
      loading: true,
      total_items: 0,
      dataTable: [],
      markup: 0,
      model: {
        id: 0,
        company: {
          short_name: ""
        },
        locations_id: [],
        contract: {
          name: ""
        },
        markup: 0
      },
      errors: [],
      modal_date_end: false,
      modal_date_start: false,
      statuses: [
        { id: 0, name: "Не активний" },
        { id: 1, name: "Активний" }
      ],
      dialogInput: false,
      summ__prod: [],
      snack: false,
      snackColor: "",
      snackText: "",
      quantity: "",
      idProd: -1,
      valProd: "",
      dataKey: "",
      locations: [],
      items: [],
      dialogCategory: false,
      active: [],
      selection: [],
      open: [],
      selectionType: "leaf",
      myDialog: false,
      btnClose: { name: "Скасувати", class: "button__blue" },
      btnApprove: { name: "Підтвердити", class: "button__yellow" },
      dialogText: "",
      dialogItem: {},
      dialogHeadline: "",
      myDialogAction: "",
      otherSpecification: [],
      updateModel: false
    }
  },
  watch: {
    pagination: {
      handler() {
        this.getDataFromApi()
      },
      deep: true
    },
    loading(e) {
      this.$loadingBus.$emit("loading", e)
    },
    dialogInput() {
      this.keymonitor()
    },
    "model.id": function() {
      this.listLocations()
    },
    search() {
      this.getDataFromApi()
    },
    "model.name": function() {
      if (!this.loading) {
        this.updateModel = true
      }
    },
    "model.status": function() {
      if (!this.loading) {
        this.updateModel = true
      }
    },
    "model.date_start": function() {
      if (!this.loading) {
        this.updateModel = true
      }
    },
    "model.date_end": function() {
      if (!this.loading) {
        this.updateModel = true
      }
    },
    "model.all_location": function() {
      if (!this.loading) {
        this.updateModel = true
      }
    }
  },
  methods: {
    exitDialog() {
      this.dialogInput = false
      this.summ__prod = [""]
    },
    locationsEdit() {
      this.updateModel = true
    },
    buttonOne() {
      if (this.myDialogAction == "orderPlay") {
        this.myDialog = false
        this.myDialogAction = ""
      }
    },
    buttonTwo() {
      if (this.myDialogAction == "orderPlay") {
        this.activateProduct(this.dialogItem)
        this.myDialog = false
        this.myDialogAction = ""
      }
    },
    async receivedOrder(item) {
      await this.checkProduct(item.id)
      this.myDialog = true
      this.dialogHeadline = "Підтвердіть дію"
      this.dialogText =
        "Ви впевнені що хочете зробити доступним товар в цій специфікації? (Товар стане недоступним в інших специфікаціях з однiєю і тiєю ж локацією)"
      this.myDialogAction = "orderPlay"
      this.dialogItem = item
    },
    async checkProduct(id) {
      this.loading = true
      await this.$api
        .post("/specification/check-product", { id: id })
        .then(response => {
          if (response.data.success) {
            this.otherSpecification = response.data.data
          } else {
            this.otherSpecification = []
          }
          this.loading = false
        })
    },
    onlyForCurrency(item, event) {
      let keyCode = event.keyCode ? event.keyCode : event.which

      if (
        (keyCode < 48 || keyCode > 57) &&
        (keyCode !== 46 || item.markup.indexOf(".") != -1)
      ) {
        event.preventDefault()
      }

      if (
        item.markup != null &&
        item.markup.indexOf(".") > -1 &&
        item.markup.split(".")[1].length > 1
      ) {
        event.preventDefault()
      }
    },
    markupItem(item) {
      if (item.children) {
        let m = item.markup
        item.children.forEach(i => {
          i.markup = m
          this.markupItem(i)
        })
      } else {
        return false
      }
    },
    addProduct() {
      this.loading = true
      this.$api
        .post("/specification/add-category", {
          id: this.model.id,
          category: this.selection
        })
        // eslint-disable-next-line no-unused-vars
        .then(response => {
          this.dialogCategory = false
          this.getDataFromApi()
        })
    },
    getCategory() {
      this.loading = true
      this.selection = []
      this.$api
        .post("/categories/all-tree", { id: this.model.company_id })
        .then(response => {
          this.items = response.data.category.tree
          this.loading = false
          this.dialogCategory = true
        })
    },
    activateProduct(item) {
      this.loading = true
      this.$api
        .post("/specification/activate-product", {
          id: item.id
        })
        // eslint-disable-next-line no-unused-vars
        .then(response => {
          this.getDataFromApi()
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
    num__input(e) {
      this.summ__prod.push(e)
    },
    keymonitor() {
      if (this.dialogInput) {
        document.addEventListener("keydown", this.keyOn)
      } else {
        document.removeEventListener("keydown", this.keyOn)
      }
    },
    dialogQuantity(id, quantity, val) {
      this.idProd = id
      this.valProd = val
      this.dialogInput = true
    },
    saveQuality() {
      let sum = this.summ__prod.reduce((a, b) => a + b, 0)
      if (this.idProd == this.valProd.item.id) {
        if (sum > 0) {
          this.valProd.item.quantity = +this.summ__prod.join("")
          this.summ__prod = []
          this.dialogInput = false
          this.snack = true
          this.snackColor = "#19B200"
          this.snackText = "Зміни збережені"
        } else if (sum === 0) {
          this.valProd.item.quantity = 0
          this.summ__prod = []
          this.dialogInput = false
          this.snack = true
          this.snackColor = "#19B200"
          this.snackText = "Зміни збережені"
        } else if (sum === -1) {
          this.valProd.item.quantity = +this.summ__prod.join("")
          this.summ__prod = []
          this.dialogInput = false
          this.snack = true
          this.snackColor = "#19B200"
          this.snackText = "Зміни збережені"
        } else if (sum < -1) {
          this.snack = true
          this.snackColor = "#ff2525"
          this.snackText = "число больше 0 !"
        }
      }
      this.$api
        .post("/specification/update-product-quantity", this.valProd.item)
        .then(response => {
          if (response.data.success) {
            this.getDataFromApi()
          }
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
    qantityFunc(e) {
      if (e.quantity == -1) {
        return "&#8734;"
      }
      return e.quantity
    },
    updateSpecification(e) {
      e.preventDefault()
      this.model.products = [1]
      //this.model.locations_id = this.model.locations;
      this.$api.post("/specification/update", this.model).then(response => {
        let errors = []
        if (response.data.success) {
          this.getDataFromApi()
          this.updateModel = false
          this.errors = []
        } else {
          response.data.errors.forEach(function(value) {
            errors[value.field] = value.message
          })
          this.errors = errors
        }
      })
    },
    deleteItem(e) {
      this.loading = true
      this.$api
        .post("/specification/delete-product", { id: e.id })
        .then(response => {
          if (response.data.success) {
            this.getDataFromApi()
          }
        })
    },
    manualMarkup(e) {
      if (this.$root.rbac.updateSpecification) {
        this.loading = true
        this.$api.post("/specification/manual-markup", e).then(response => {
          if (response.data.success) {
            this.getDataFromApi()
          }
        })
      }
    },
    updateMarkup(e) {
      this.loading = true
      e.preventDefault()
      this.$api
        .post("/specification/update-all-products", {
          id: this.id,
          markup: this.model.markup
        })
        .then(response => {
          if (response.data.success) {
            this.snack = true
            this.snackColor = "#19B200"
            this.snackText = "Зміни збережені"
          } else {
            this.snack = true
            this.snackColor = "#ff2525"
            this.snackText = "Немає товарів відкритих для загальної націнки"
          }
          this.getDataFromApi()
        })
    },
    changePriceMarkup(e) {
      this.$api.post("/specification/update-product", e).then(response => {
        if (response.data.success) {
          this.getDataFromApi()
        }
      })
    },
    changeQuantity(e) {
      this.$api
        .post("/specification/update-product-quantity", e)
        .then(response => {
          if (response.data.success) {
            this.getDataFromApi()
          }
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
                            oneSpecification(id: ` +
            this.id +
            `){
                                id
                                name
                                status
                                contract_id
                                contract{
                                  name
                                }
                                date_start
                                date_end
                                locations{
                                  location_id
                                }
                                company_id
                                company{
                                  short_name
                                }
                                locationModel{
                                  name
                                  id
                                }
                                history{
                                    email
                                    role
                                }
                                markup
                                all_location
                              }
                              specificationProduct(specification_id: ` +
            this.id +
            ` page: ` +
            this.pagination.page +
            ` perPage: ` +
            this.pagination.rowsPerPage +
            ` order: "` +
            order +
            `" orderBy: "` +
            this.pagination.sortBy +
            `"  search: "` +
            this.search +
            `"){
                                 totalCount
                                 items{
                                  id
                                  price
                                  markup
                                  manual_markup
                                  use_markup
                                  quantity
                                  status
                                  product{
                                    id
                                    sku
                                    buy_price
                                    name
                                    deleted
                                    unit{
                                      name
                                    }
                                  }
                                }
                              }
                            }`
        })
        .then(response => {
          if (response.data.data.oneSpecification == null) {
            this.$router.push("/specification")
          }
          this.dataTable = response.data.data.specificationProduct.items
          this.total_items = response.data.data.specificationProduct.totalCount
          this.model = response.data.data.oneSpecification
          this.model.date_start = this.$options.filters.formatDateMinus(
            this.model.date_start
          )
          this.model.date_end = this.$options.filters.formatDateMinus(
            this.model.date_end
          )
          this.model.locations_id = this.model.locations.map(e => {
            return e.location_id
          })
          this.$nextTick(() => {
            this.loading = false
          })
        })
      this.$emit("listUpdated", false)
    },
    listLocations() {
      if (this.model.contract_id > 0) {
        this.$api
          .post("/specification/get-list-of-locations", {
            id: this.model.contract_id,
            specification_id: this.model.id
          })
          .then(response => {
            this.locations = response.data.locations
          })
      } else {
        this.locations = []
      }
    }
  },
  computed: {
    ...mapGetters("params", ["search"])
  }
}
</script>

<style scoped>
.istar {
  font-size: 14px;
  color: #cecece;
  line-height: 16px;
}
  .no-have {
    color: red;
  }
</style>

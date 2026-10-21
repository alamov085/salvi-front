<template>
  <div class="section__content">
    <div class="section__content__head">
      <div class="caption" style="display: flex; align-items: center">
        <v-tooltip z-index="101" bottom>
          <template v-slot:activator="{ on }">
            <div
              class="ellipsis company__select"
              style="display: block; max-width: 255px"
              v-on="on"
            >
              <router-link to="/setting-company-page" tag="span">
                {{ currentCompany.company_name }}
              </router-link>
            </div>
          </template>
          <span>
            Встановлене підприємство: {{ currentCompany.company_name }}
          </span>
        </v-tooltip>
        <span v-if="!loading && currentCompany.company_id">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <span
                class="ellipsis ml-2"
                style="display: block; max-width: 255px"
                v-on="on"
              >
                <v-icon :color="statuses[currentCompany.company_status].color">
                  {{ statuses[currentCompany.company_status].icon }}
                </v-icon>
              </span>
            </template>
            <span>{{ statuses[currentCompany.company_status].name }}</span>
          </v-tooltip>
        </span>
        <span v-if="!loading && !currentCompany.company_id">Не обрано</span>
        <router-link
          v-if="!loading && currentCompany.company_id"
          to="/setting-company-page"
          class="icon__setting mr-2"
        >
          <v-tooltip z-index="101" bottom>
            <v-btn
              slot="activator"
              class="m-0"
              flat
              icon
              color="rgb(100, 108, 154)"
            >
              <v-icon style="font-size: 18px">launch</v-icon>
            </v-btn>
            <span>Налаштування компанії</span>
          </v-tooltip>
        </router-link>
      </div>
      <button
        v-show="
          $root.rbac.createCompany && !currentCompany.company_id && !loading
        "
        class="button button__yellow mr-2"
        @click="openDialog"
      >
        Створити підприємство
      </button>
      <button
        v-show="currentCompany.company_id"
        class="button button__red"
        @click="setCompanyId(0)"
      >
        Загальний режим
      </button>
      <span
        v-if="!loading && !currentCompany.company_id"
        class="icon__setting"
        @click="defaultMarkup"
      >
        <v-tooltip z-index="101" bottom>
          <v-btn
            slot="activator"
            class="m-0"
            flat
            icon
            color="rgb(100, 108, 154)"
          >
            <v-icon style="font-size: 22px">local_atm</v-icon>
          </v-btn>
          <span>Загальні націнки</span>
        </v-tooltip>
      </span>
    </div>
    <v-dialog
      v-model="dialog"
      :fullscreen="$store.getters['params/mobileView']"
      :persistent="false"
      max-width="700px"
    >
      <v-card>
        <v-card-title>
          <span v-if="update" class="headline">Редагування підприємства</span>
          <span v-else class="headline">Створення підприємства</span>
          <v-spacer />
          <v-flex xs1 sm1>
            <v-btn flat icon color="" @click="closeDialog">
              <v-icon>close</v-icon>
            </v-btn>
          </v-flex>
        </v-card-title>
        <v-container grid-list-md>
          <v-layout wrap>
            <v-flex xs12 sm6 md6 class="input-box">
              <label>Скорочена назва</label>
              <input v-model="editedItem.short_name" class="input-default" />
              <div class="error__box">
                <span>{{ errors.short_name }}</span>
              </div>
            </v-flex>
            <v-flex xs12 sm6 md6 class="input-box">
              <label>Повна назва</label>
              <input
                v-model="editedItem.full_name"
                placeholder="Повна назва підприємства"
                class="input-default"
              />
              <div class="error__box">
                <span>{{ errors.full_name }}</span>
              </div>
            </v-flex>
            <v-flex xs12 sm6 md6 class="input-box">
              <label>Код ЄДРПОУ</label>
              <input
                v-model="editedItem.edrpou"
                placeholder="Код ЄДРПОУ"
                class="input-default"
              />
              <div class="error__box">
                <span>{{ errors.edrpou }}</span>
              </div>
            </v-flex>
            <v-flex xs12 sm6 md6 class="input-box">
              <label>ІПН</label>
              <input
                v-model="editedItem.inn"
                placeholder="Введіть код"
                class="input-default"
              />
              <div class="error__box">
                <span>{{ errors.inn }}</span>
              </div>
            </v-flex>
            <v-flex xs12 sm12 md12 class="input-box">
              <label>Юридична адреса</label>
              <input
                v-model="editedItem.address"
                placeholder="Юридична адреса"
                class="input-default"
              />
              <div class="error__box">
                <span>{{ errors.address }}</span>
              </div>
            </v-flex>
            <!--<v-flex xs12 sm12 md12 class="input-box">
                            <v-checkbox color="rgb(85, 120, 235)" v-model="editedItem.show_catalog" :label="`Показувати каталог`"></v-checkbox>
                        </v-flex>-->
            <author :update="update" :history="editedItem.history" />

            <v-flex xs12 sm12 md12 class="input-box">
              <label>E-mail менеджера(через кому)</label>
              <input
                      v-model="editedItem.manager_email"
                      placeholder="manager@gmail.com, manager13@website.com"
                      class="input-default"
              />
              <div class="error__box">
                <span>{{ errors.address }}</span>
              </div>
            </v-flex>
          </v-layout>
        </v-container>
        <v-card-actions>
          <v-spacer />
          <button class="button button__blue" flat @click="close">
            Скасувати
          </button>
          <button
            v-if="update"
            class="button button__yellow"
            flat
            @click="updateCompany"
          >
            Зберегти
          </button>
          <button
            v-else
            class="button button__yellow"
            flat
            @click="createCompany"
          >
            Створити
          </button>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="dialog2"
      :fullscreen="$store.getters['params/mobileView']"
      persistent
      max-width="705px"
    >
      <v-card>
        <v-card-title>
          <span class="headline">Створення підприємства</span>
          <v-spacer />
          <v-flex xs1 sm1>
            <v-btn flat icon color="" @click="closeDialog">
              <v-icon>close</v-icon>
            </v-btn>
          </v-flex>
        </v-card-title>
        <v-container grid-list-md>
          <v-layout wrap>
            <v-flex xs12 sm6 md6 class="input-box">
              <label>Форма діяльності</label>
              <v-select
                v-model="editedItem.type"
                solo
                :items="types"
                item-text="label"
                item-value="key"
                label="Вибрати форму діяльності"
                append-icon="keyboard_arrow_down"
                :clearable="false"
                :searchable="false"
              />

              <div class="error__box">
                <span>{{ errors.type }}</span>
              </div>
            </v-flex>
            <v-flex
              v-if="editedItem.type == '1' || editedItem.type == '2'"
              xs12
              sm6
              md6
              class="input-box"
            >
              <label>Email</label>
              <input
                v-model="editedItem.email"
                class="input-default"
                placeholder="Введіть email"
              />
              <div class="error__box">
                <span>{{ errors.email }}</span>
              </div>
            </v-flex>
            <v-flex
              v-if="editedItem.type == '1'"
              xs12
              sm6
              md6
              class="input-box"
            >
              <label>Прізвище</label>
              <input
                v-model="editedItem.lastName"
                placeholder="Введіть прізвище"
                class="input-default"
              />
              <div class="error__box">
                <span>{{ errors.lastName }}</span>
              </div>
            </v-flex>
            <v-flex
              v-if="editedItem.type == '1'"
              xs12
              sm6
              md6
              class="input-box"
            >
              <label>Ім'я</label>
              <input
                v-model="editedItem.firstName"
                placeholder="Введіть ваше ім'я"
                class="input-default"
              />
              <div class="error__box">
                <span>{{ errors.firstName }}</span>
              </div>
            </v-flex>
            <v-flex
              v-if="editedItem.type == '1'"
              xs12
              sm6
              md6
              class="input-box"
            >
              <label>ІПН</label>
              <input
                v-model="editedItem.inn"
                placeholder="Введіть код"
                class="input-default"
              />
              <div class="error__box">
                <span>{{ errors.inn }}</span>
              </div>
            </v-flex>
            <v-flex
              v-if="editedItem.type == '1'"
              xs12
              sm6
              md6
              class="input-box"
            >
              <label>Телефон*</label>
              <div class="row  m-0 p-0">
                <div class="mask__phone">+380</div>
                <input
                  v-model="editedItem.phone"
                  type="text"
                  class="input-default"
                  placeholder="Номер сотового"
                />
                <div class="error__box">
                  <span>{{ errors.phone }}</span>
                </div>
              </div>
            </v-flex>
            <v-flex
              v-if="editedItem.type == '2'"
              xs12
              sm6
              md6
              class="input-box"
            >
              <label>Скорочена назва</label>
              <input
                v-model="editedItem.shortName"
                class="input-default"
                placeholder="Введіть скорочену назву"
              />
              <div class="error__box">
                <span>{{ errors.shortName }}</span>
              </div>
            </v-flex>
            <v-flex
              v-if="editedItem.type == '2'"
              xs12
              sm6
              md6
              class="input-box"
            >
              <label>Повна назва</label>
              <input
                v-model="editedItem.fullName"
                placeholder="Повна назва підприємства"
                class="input-default"
              />
              <div class="error__box">
                <span>{{ errors.fullName }}</span>
              </div>
            </v-flex>
            <v-flex
              v-if="editedItem.type == '2'"
              xs12
              sm6
              md6
              class="input-box"
            >
              <label>Код ЄДРПОУ</label>
              <input
                v-model="editedItem.edrpou"
                placeholder="Код ЄДРПОУ"
                class="input-default"
              />
              <div class="error__box">
                <span>{{ errors.edrpou }}</span>
              </div>
            </v-flex>
            <v-flex
              v-if="editedItem.type == '2'"
              xs12
              sm6
              md6
              class="input-box"
            >
              <label>ІПН</label>
              <input
                v-model="editedItem.inn"
                placeholder="Введіть код"
                class="input-default"
              />
              <div class="error__box">
                <span>{{ errors.inn }}</span>
              </div>
            </v-flex>
            <v-flex
              v-if="editedItem.type == '2'"
              xs12
              sm6
              md6
              class="input-box"
            >
              <label>Телефон*</label>
              <div class="row  m-0 p-0">
                <div class="mask__phone">+380</div>
                <input
                  v-model="editedItem.phone"
                  type="text"
                  class="input-default"
                  placeholder="Номер сотового"
                />
                <div class="error__box">
                  <span>{{ errors.phone }}</span>
                </div>
              </div>
            </v-flex>
            <v-flex
              v-if="editedItem.type == '2'"
              xs12
              sm12
              md12
              class="input-box"
            >
              <label>Юридична адреса</label>
              <input
                v-model="editedItem.address"
                placeholder="Юридична адреса"
                class="input-default"
              />
              <div class="error__box">
                <span>{{ errors.address }}</span>
              </div>
            </v-flex>
            <!--<v-flex xs12 sm12 md12 class="input-box">
                            <v-checkbox color="rgb(85, 120, 235)" v-model="editedItem.show_catalog" :label="`Показувати каталог`"></v-checkbox>
                        </v-flex>-->
          </v-layout>
        </v-container>
        <v-card-actions>
          <v-spacer />
          <button class="button button__blue" flat @click="close">
            Скасувати
          </button>
          <button class="button button__yellow" flat @click="createCompany">
            Створити
          </button>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!------------------------------------------------------------------------------------table modal -------------------------------------------------------------------->
    <v-dialog
      v-model="dialogEditCategory"
      :fullscreen="$store.getters['params/mobileView']"
      persistent
      max-width="700px"
    >
      <v-card>
        <v-card-title>
          <span class="headline">Редагування нацiнок</span>
          <v-spacer />
          <v-flex xs1 sm1>
            <v-btn flat icon color="" @click="dialogEditCategory = false">
              <v-icon>close</v-icon>
            </v-btn>
          </v-flex>
        </v-card-title>
        <v-container grid-list-md>
          <v-flex v-if="editedItem.id > 0" xs12 sm12 md12 class="input-box">
            <v-checkbox
              v-model="editedItem.new_category"
              hide-details
              :label="`Давати доступ на нові категорії`"
            />
          </v-flex>
          <v-flex v-else xs12 sm12 md12 class="input-box">
            <label>Загальна націнка</label>
            <label>
              <input
                v-model="default_markup"
                type="text"
                class="input-default"
                placeholder="Введіть загальну націнку"
              />
            </label>
            <div class="error__box">
              <span>{{ errors.default_markup }}</span>
            </div>
          </v-flex>
          <v-flex class="price__tree__category">
            <div class="price__tree__category__head">
              <label>Обмежити категорії:</label>
              <label>Нацiнка:</label>
            </div>
            <v-treeview
              v-if="editedItem.id > 0"
              v-model="selection"
              :active.sync="active"
              :items="items"
              :load-children="fetchData"
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
                  <span
                    v-if="editedItem.id > 0 && !item.markup"
                    class="chips-desc mr-2"
                  >
                    {{
                      item.default_markup ? item.default_markup : default_markup
                    }}
                  </span>
                  <input
                    v-model="item.markup"
                    placeholder="Загальна"
                    @keypress="onlyForCurrency(item, $event)"
                    @change="markupItem(item)"
                  />
                </div>
              </template>
            </v-treeview>
            <v-treeview
              v-else
              :active.sync="active"
              :items="items"
              :load-children="fetchData"
              :open.sync="open"
              item-key="uuid"
              activatable
              item-text=""
              :label="false"
              color="warning"
              transition
              return-object
            >
              <template v-slot:append="{ item, open }">
                <span class="v-treeview__label" :title="item.name">{{
                  item.name
                }}</span>
                <div class="v-treeview__label__box-input">
                  <span v-if="!item.markup" class="chips-desc mr-2">{{
                    default_markup
                  }}</span>
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
          <button class="button button__blue" flat @click="closeEditCategory">
            Відмінити
          </button>
          <button
            v-show="$root.rbac.catalogLimitationUpdate"
            class="button button__yellow"
            flat
            @click="updatePolicyMethod"
          >
            Редагувати
          </button>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!------------------------------------------------------------------------------------table page -------------------------------------------------------------------->

    <div>
      <v-snackbar
        v-model="alert"
        dismissible
        type="success"
        color="#4caf50"
        :bottom="true"
      >
        <span v-if="currentCompany.company_id > 0">
          Підприємство встановлене
        </span>
        <span v-else>Ви вишли з підприємства</span>
        <v-btn color="pink" flat icon @click="alert = false">
          <v-icon>close</v-icon>
        </v-btn>
      </v-snackbar>
      <v-data-table
        :headers="headers"
        :items="dataTable"
        :pagination.sync="pagination"
        :total-items="total_items"
        :loading="loading"
        class="table__tamplate-2 theme--light table__company "
        no-data-text="Немає даних"
      >
        <template v-slot:items="props">
          <tr :class="{ active: currentCompany.company_id == props.item.id }">
            <td @click="setCompanyId(props.item.id)">
              {{ props.item.full_name }}
            </td>
            <td class="text-xs-left">
              <div
                class="status-desc"
                :class="statuses[props.item.status].class"
              >
                {{ statuses[props.item.status].name }}
              </div>
            </td>
            <td class="justify-center action__td">
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
                    <v-list-tile-title @click="editItem(props.item)">
                      Деталі
                    </v-list-tile-title>
                  </v-list-tile>
                  <v-list-tile
                    v-show="
                      $root.rbac.catalogLimitationUpdate ||
                        $root.rbac.catalogLimitationViewDetail
                    "
                  >
                    <v-list-tile-title @click="editCategory(props.item)">
                      Націнка і обмеження
                    </v-list-tile-title>
                  </v-list-tile>
                  <v-list-tile
                    v-if="props.item.status === 0 || props.item.status === 2"
                  >
                    <v-list-tile-title
                      @click="approveRegistrationButton(props.item)"
                    >
                      Підтвердити реєстрацію
                    </v-list-tile-title>
                  </v-list-tile>
                  <v-list-tile
                    v-if="props.item.status === 1 || props.item.status === 2"
                  >
                    <v-list-tile-title
                      @click="refuseRegistrationButton(props.item)"
                    >
                      Відхилити реєстрацію
                    </v-list-tile-title>
                  </v-list-tile>
                </v-list>
              </v-menu>
            </td>
          </tr>
        </template>
      </v-data-table>
      <v-dialog v-model="dialogApprove" max-width="400px">
        <v-card>
          <v-card-title class="headline">
            Підтвердження реєстрації?
          </v-card-title>
          <v-card-text>
            Ви впевнені що хочете підтвердити реєстрацію даної юр.особою?
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <button class="button button__blue" @click="dialogApprove = false">
              Скасувати
            </button>
            <button
              class="button button__yellow"
              @click="approveRegistration(dialogData.id)"
            >
              Підтвердити
            </button>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="dialogRefuse" max-width="400">
        <v-card>
          <v-card-title class="headline">Відхилення реєстрації?</v-card-title>
          <v-card-text>
            Ви впевнені що хочете відхилити реєстрацію даної юр.особи?
            <v-flex xs12 sm12 md12>
              <v-text-field
                v-model="reason"
                label="Причина"
                hint="Вкажіть, будь ласка причину відхилення реєстрації"
                persistent-hint
                required
              />
            </v-flex>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <button class="button button__blue" @click="dialogRefuse = false">
              Скасувати
            </button>
            <button
              class="button button__yellow"
              @click="refuseRegistration(dialogData.id)"
            >
              Підтвердити
            </button>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="dialogRollBack" max-width="400">
        <v-card>
          <v-card-title class="headline">Скасувати підтвердження?</v-card-title>
          <v-card-text>
            Ви впевнені що хочете скасувати підтвердження даної юр.особи?
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <button class="button button__blue" @click="dialogRollBack = false">
              Скасувати
            </button>
            <button
              class="button button__yellow"
              @click="rollBackRegistration(dialogData.id)"
            >
              Підтвердити
            </button>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex"

export default {
  name: "AdminSettingCompany",
  data() {
    return {
      dataTable: [],
      currentCompany: {},
      headers: [
        {
          text: "Назва підприємства",
          align: "left",
          sortable: true,
          value: "short_name"
        },
        { text: "Статус", value: "status" },
        { text: "", value: "name", sortable: false }
      ],
      pagination: {
        sortBy: "id",
        rowsPerPage: 100,
        page: 1
      },
      alert: false,
      loading: true,
      total_items: 0,
      statuses: [],
      dialogApprove: false,
      dialogRefuse: false,
      dialogRollBack: false,
      dialog: false,
      dialog2: false,
      dialogData: {},
      errors: [],
      editedIndex: -1,
      editedItem: {
        history: {
          email: "",
          role: ""
        }
      },
      reason: "",
      update: false,
      types: [
        {
          key: 1,
          label: "Фізична особа"
        },
        {
          key: 2,
          label: "Юридична особа"
        }
      ],
      dialogPolicy: false,
      updatePolicy: false,
      modelPolicy: {},
      updateListVal: false,
      dialogEditCategory: false,
      active: [],
      items: [],
      selectionType: "leaf",
      selection: [],
      open: [],
      default_markup: 0
    }
  },
  computed: {
    ...mapGetters("params", ["search"])
  },
  watch: {
    pagination: {
      handler() {
        this.getDataFromApi()
      },
      deep: true
    },
    alert() {
      this.getDataFromApi()
    },
    loading(e) {
      this.$loadingBus.$emit("updateCompanyList", e)
      this.$loadingBus.$emit("loading", e)
    },
    updateListVal(e) {
      if (e) {
        this.getDataFromApi()
      }
    },
    search() {
      this.getDataFromApi()
    }
  },
  methods: {
    defaultMarkup() {
      this.editCategory({ id: 0 })
    },
    editCategory(item) {
      this.dialogEditCategory = true
      this.editedItem = item
      this.getCategory()
    },
    onlyForCurrency(item, event) {
      // console.log(event.keyCode); //keyCodes value
      let keyCode = event.keyCode ? event.keyCode : event.which

      // only allow number and one dot
      if (
        (keyCode < 48 || keyCode > 57) &&
        (keyCode !== 46 || item.markup.indexOf(".") != -1)
      ) {
        // 46 is dot
        event.preventDefault()
      }

      // restrict to 2 decimal places
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
    closeEditCategory() {
      this.dialogEditCategory = false
    },
    updatePolicyMethod() {
      this.loading = true
      this.$api
        .post("/catalog-limitation/update", {
          companies: [this.editedItem.id],
          company: this.editedItem.id,
          categories: this.selection,
          new_category: this.editedItem.new_category,
          markup: this.items,
          default_markup: this.default_markup
        })
        .then(response => {
          if (response.data.success) {
            this.getDataFromApi()
            this.closeEditCategory()
          } else {
            this.loading = false
          }
        })
    },
    getCategory() {
      this.loading = true
      this.selection = []
      let url = "/categories/all-tree"
      if (!this.editedItem.id) {
        url = "/categories/default-tree"
      }
      this.$api.post(url, { id: this.editedItem.id }).then(response => {
        this.items = response.data.category.tree
        let data = response.data.category.selection
        this.selection = data.map(function(item) {
          return { uuid: item.category_uuid }
        })
        this.default_markup = response.data.default
        this.loading = false
      })
    },
    fetchData(item) {
      return this.$api
        .post("/graphql", {
          query:
            `query{
                                category(parent_uuid: "` +
            item.uuid +
            `" limitation: false){
                                 id
                                 uuid
                                 name
                                 is_view
                                 is_props
                                 parent_uuid
                                 parent_id
                                 is_props_value
                                 is_value
                                 has_child
                                }
                           }`
        })
        .then(response => {
          let data = response.data.data.category
          data.forEach(function(value, index) {
            if (value.has_child) {
              data[index].children = []
            }
          })
          item.children = data
          this.markupItem(item)
        })
    },
    openDialog() {
      this.dialog2 = true
      this.update = false
      this.editedItem = {}
      this.errors = []
    },
    closeDialog() {
      this.dialog = false
      this.dialog2 = false
      this.update = false
    },
    editItem(item) {
      this.editedIndex = this.dataTable.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
      this.update = true
      this.errors = []
    },
    getUserData() {
      this.loading = true
      this.$api.get("/account/index").then(response => {
        this.setData({ ctx: JSON.stringify(response.data.user) })
        this.loading = false
      })
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
                              company(page: ` +
            this.pagination.page +
            ` perPage: ` +
            this.pagination.rowsPerPage +
            ` order: "` +
            order +
            `" orderBy: "` +
            this.pagination.sortBy +
            `"  search:"` +
            this.search +
            `"){
                                 totalCount
                                 items{
                                  id
                                  short_name
                                  manager_email
                                  address
                                  edrpou
                                  full_name
                                  inn
                                  status
                                  show_catalog
                                  history{
                                    email
                                    role
                                  }
                                  catalog_limitation
                                  new_category
                                }
                              }
                              companyStatus{
                                id
                                name
                                class
                                color
                                icon
                              }
                              account{
                                id
                                company_id
                                company_name
                                company_status
                              }
                            }`
        })
        .then(response => {
          this.dataTable = response.data.data.company.items
          this.total_items = response.data.data.company.totalCount
          this.currentCompany = response.data.data.account
          this.statuses = response.data.data.companyStatus
          this.loading = false
        })
    },
    setCompanyId(id) {
      this.$api
        .post("/account/set-company", { id: id })
        .then(response => {
          if (response.data.success) {
            this.alert = true
            this.setData({ ctx: JSON.stringify(response.data.user) })
            this.currentCompany.company_id = id
            window.localStorage.setItem("location_id", 0)
            this.setIdProduct({
              ctx: {
                order_id: 0
              }
            })
            this.$loadingBus.$emit("updateBasket", true)
            //this.getUserData();
          }
        })
        .finally(() => {
          this.removeLocation({ ctx: true })
        })
    },
    approveRegistrationButton(item) {
      this.dialogData = item
      this.dialogApprove = true
    },
    rollBackRegistrationButton(item) {
      this.dialogData = item
      this.dialogRollBack = true
    },
    refuseRegistrationButton(item) {
      this.dialogData = item
      this.dialogRefuse = true
      this.reason = ""
    },
    approveRegistration(id) {
      this.$api
        .post("/company/approve-registration", {
          id: id
        })
        // eslint-disable-next-line no-unused-vars
        .then(response => {
          this.dialogApprove = false
          this.getDataFromApi()
        })
    },
    refuseRegistration(id) {
      this.$api
        .post("/company/refuse-registration", {
          id: id,
          reason: this.reason
        })
        // eslint-disable-next-line no-unused-vars
        .then(response => {
          this.dialogRefuse = false
          this.getDataFromApi()
        })
    },
    rollBackRegistration(id) {
      this.$api
        .post("/company/roll-back-registration", {
          id: id
        })
        // eslint-disable-next-line no-unused-vars
        .then(response => {
          this.dialogRollBack = false
          this.getDataFromApi()
        })
    },
    ...mapActions("user", ["setData", "removeLocation"]),
    ...mapActions("basket", ["setIdProduct"]),
    close() {
      this.dialog = false
      this.dialog2 = false
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      }, 300)
      this.getDataFromApi()
    },
    updateCompany() {
      this.$api.post("company/update", this.editedItem).then(response => {
        let errors = []
        if (response.data.success) {
          this.close()
        } else {
          response.data.errors.forEach(function(value) {
            errors[value.field] = value.message
          })
          this.errors = errors
        }
      })
    },
    createCompany() {
      this.$api
        .post("company/create?type=" + this.editedItem.type, this.editedItem)
        .then(response => {
          let errors = []
          if (response.data.success) {
            this.close()
          } else {
            response.data.errors.forEach(function(value) {
              errors[value.field] = value.message
            })
          }
          this.errors = errors
        })
    }
  }
}
</script>

<style lang="sass">
.table__company table.v-table tbody tr
    td
        cursor: pointer !important

    &.active
        background-color: #e8ffef !important

        &:hover
            background-color: #e8ffef !important

    .icon__settingTD svg
        fill: #64DD17
</style>
<style lang="sass" scoped>
.section__content__head
    grid-template-columns: 1.5fr auto auto auto

    .company__select
        cursor: pointer

        &:hover
            text-decoration: underline

    @media screen and (max-width: 768px)
        grid-template-columns: 1fr auto auto

    .icon__setting
        @media screen and (max-width: 768px)
            justify-self: end
            margin-right: 0px !important

    .caption
        grid-column-start: inherit
        justify-self: start
        text-align: start
        @media screen and (max-width: 768px)
            grid-column: 1/4

    .button
        @media screen and (max-width: 768px)
            grid-column-start: inherit
            grid-row-start: inherit
            &.button__yellow
                grid-column-start: 1
                grid-row-start: 2
</style>

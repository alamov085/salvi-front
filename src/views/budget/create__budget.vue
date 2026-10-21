<template>
  <v-dialog
    v-model="dialog"
    :fullscreen="$store.getters['params/mobileView']"
    persistent
    max-width="705px"
  >
    <template v-slot:activator="{ on }">
      <button
        v-show="$root.rbac.createBudget && showBtn"
        class="button button__yellow"
        @click="openDialog"
      >
        Створити бюджет
      </button>
    </template>
    <v-card>
      <v-card-title>
        <span v-if="!update" class="headline">Створення бюджету</span>
        <span v-else class="headline">Редагування бюджету</span>
        <v-spacer />
        <v-flex xs1 sm1>
          <v-btn flat icon color="" @click="cancel">
            <v-icon>close</v-icon>
          </v-btn>
        </v-flex>
      </v-card-title>

      <v-container grid-list-md>
        <v-layout wrap>
          <v-flex xs12 sm6 md6 class="input-box">
            <label>Назва</label>
            <input
              v-model="model.name"
              type="text"
              class="input-default"
              placeholder="Придумайте назву"
            />
            <div class="error__box">
              <span>{{ errors.name }}</span>
            </div>
          </v-flex>
          <v-flex xs12 sm6 md6 class="input-box">
            <label>Сума</label>
            <input
              v-model="model.sum"
              type="text"
              class="input-default"
              placeholder="Введіть суму бюджету"
            />
            <div class="error__box">
              <span>{{ errors.sum }}</span>
            </div>
          </v-flex>
          <v-flex xs12 sm6 class="input-box">
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
          </v-flex>
          <v-flex xs12 sm6 class="input-box">
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
          </v-flex>
          <v-flex xs12 sm12 class="">
            <div class="checkbox__custom">
              <v-checkbox
                v-model="model.budget_restriction"
                :label="`Обмеження бюджетом`"
              />
              <template>
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <i class="vsm-icon icon-info" v-on="on"></i>
                  </template>
                  <span>
                    Жорстке обмеження допустимої суми замовлень в період дії
                    бюджету
                  </span>
                </v-tooltip>
              </template>
            </div>
          </v-flex>
          <v-flex xs12 sm12 class="">
            <div class="checkbox__custom">
              <v-checkbox
                v-model="model.all_location"
                :label="`Доступний у всіх локаціях`"
                @change="loadCostCenters"
              />
              <template>
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <i class="vsm-icon icon-info" v-on="on"></i>
                  </template>
                  <span>Бюджет доступний всім локаціям</span>
                </v-tooltip>
              </template>
            </div>
          </v-flex>
          <v-flex v-if="!model.all_location" class="input-box" xs12 sm12>
            <label>Локації</label>
            <v-select
              v-model="model.locations"
              hide-details
              solo
              deletable-chips
              chips
              :items="locations"
              item-text="name"
              item-value="id"
              multiple
              :clearable="false"
              :searchable="false"
              placeholder=""
              @change="loadCostCenters"
            />
            <div class="error__box">
              <span>{{ errors.locations }}</span>
            </div>
          </v-flex>
          <v-flex xs12 sm12 class="">
            <div class="checkbox__custom">
              <v-checkbox
                v-model="model.all_cost"
                :label="`Доступний у всіх кост-центрах`"
              />
              <template>
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <i class="vsm-icon icon-info" v-on="on"></i>
                  </template>
                  <span>Бюджет доступний всім кост-центрам</span>
                </v-tooltip>
              </template>
            </div>
          </v-flex>
          <v-flex v-if="!model.all_cost" xs12 sm12 class="input-box">
            <label>Кост-центри</label>
            <v-select
              v-model="model.cost_centers"
              solo
              hide-details
              deletable-chips
              chips
              :items="costCenters"
              multiple
              :clearable="false"
              :searchable="false"
              item-text="name"
              item-value="id"
              placeholder=""
            />
            <div class="error__box">
              <span>{{ errors.cost_centers }}</span>
            </div>
          </v-flex>
          <v-flex xs12 sm12 class="input-box">
            <label>Специфікації</label>
            <v-select
              v-model="model.specifications"
              solo
              hide-details
              deletable-chips
              chips
              :items="specifications"
              multiple
              :clearable="false"
              :searchable="false"
              item-text="name"
              item-value="id"
              placeholder=""
            />
            <div class="error__box">
              <span>{{ errors.specifications }}</span>
            </div>
          </v-flex>
          <author :update="update" :history="model.history" />
        </v-layout>
      </v-container>

      <v-card-actions>
        <!--                <button class="button button__blue" flat @click="deleteBudget" v-if="update && canDeleteBudget">Вилучити</button>-->
        <v-spacer />
        <button class="button button__blue" flat @click="cancel">
          Відмінити
        </button>
        <button
          v-if="!update"
          class="button button__yellow"
          flat
          @click="createBudget"
        >
          Далі
        </button>
        <button v-else class="button button__yellow" flat @click="updateBudget">
          Застосувати
        </button>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "CreateBudget",
  props: {
    model: {
      type: Object
    },
    dialog: {
      type: Boolean
    },
    update: {
      type: Boolean
    },
    locations: {
      type: Array
    },
    // specifications: {
    //     type: Array
    // },
    showBtn: {
      type: Boolean,
      default: true
    }
  },
  data: () => ({
    modal_date_end: false,
    modal_date_start: false,
    costCenters: [],
    errors: [],
    specifications: [],
    preventAction: false
  }),
  watch: {
    dialog() {
      this.loadCostCenters()
    }
  },
  methods: {
    createBudget() {
      if (this.preventAction) {
        return true
      }
      this.preventAction = true
      this.$api.post("budget/create", this.model).then(response => {
        this.preventAction = false
        var errors = []
        if (response.data.success) {
          this.cancel()
        } else {
          response.data.errors.forEach(function(value) {
            errors[value.field] = value.message
          })
          this.errors = errors
        }
      })
    },
    updateBudget() {
      if (this.preventAction) {
        return true
      }
      this.preventAction = true
      this.$api.post("budget/update", this.model).then(response => {
        this.preventAction = false
        var errors = []
        if (response.data.success) {
          this.cancel()
        } else {
          response.data.errors.forEach(function(value) {
            errors[value.field] = value.message
          })
          this.errors = errors
        }
      })
    },
    deleteBudget() {
      this.$emit("deleteBudget", this.model)
    },
    cancel() {
      this.errors = []
      this.$emit("closeDialog", false)
      this.updateList()
    },
    updateList() {
      this.$emit("updateList", true)
      setTimeout(() => {
        this.$emit("updateList", false)
      }, 100)
    },
    openDialog() {
      this.$emit("openDialog", true)
    },
    loadCostCenters() {
      this.$api
        .post("/cost-centers/get-list-by-location", {
          location: this.model.locations,
          all_location: this.model.all_location
        })
        .then(response => {
          this.costCenters = response.data.data
        })
      this.loadSpecification()
    },
    loadSpecification() {
      this.$api
        .post("/specification/get-list-by-location", {
          locations: this.model.locations,
          all_location: this.model.all_location
        })
        .then(response => {
          this.specifications = response.data.data
        })
    }
  }
}
</script>

<style scoped></style>

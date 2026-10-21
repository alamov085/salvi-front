<template>
  <v-dialog
    v-model="dialog"
    :fullscreen="$store.getters['params/mobileView']"
    persistent
    max-width="705px"
  >
    <template v-slot:activator="{ on }">
      <button
        v-show="$root.rbac.createLocations && !hideButton"
        class="button button__yellow"
        @click="openDialog"
      >
        Створити локацію
      </button>
    </template>
    <v-card>
      <v-card-title>
        <span v-if="!update" class="headline">Створення локації</span>
        <span v-else class="headline">
          <span v-show="!viewOnly && $root.rbac.updateLocations">
            Редагування локації
          </span>
          <span v-show="viewOnly">Перегляд локації</span>
        </span>
        <v-spacer />
        <v-flex xs1 sm1>
          <v-btn flat icon color="" @click="cancel">
            <v-icon>close</v-icon>
          </v-btn>
        </v-flex>
      </v-card-title>
      <v-container
        v-disable-all="!$root.rbac.updateLocations && update"
        grid-list-md
      >
        <v-layout wrap>
          <v-flex xs12 sm6 md6 class="input-box">
            <label>Назва локації*</label>
            <input
              v-model="location.name"
              type="text"
              class="input-default"
              placeholder="Придумайте назву локації"
            />
            <div class="error__box">
              <span>{{ errors.name }}</span>
            </div>
          </v-flex>
          <v-flex xs12 sm6 md6 class="input-box">
            <label>Поштовий індекс</label>
            <input
              v-model="location.zip_code"
              type="text"
              class="input-default"
              placeholder="Поштовий індекс міста / району"
            />
            <div class="error__box">
              <span>{{ errors.zip_code }}</span>
            </div>
          </v-flex>
          <v-flex xs12 sm6 class="input-box">
            <label>Місто*</label>
            <input
              v-model="location.city"
              type="text"
              class="input-default"
              placeholder="Назва міста"
            />
            <div class="error__box">
              <span>{{ errors.city }}</span>
            </div>
          </v-flex>
          <v-flex xs12 sm6 class="input-box">
            <label>Вулиця*</label>
            <input
              v-model="location.street"
              type="text"
              class="input-default"
              placeholder="Вулиця розташування"
            />
            <div class="error__box">
              <span>{{ errors.street }}</span>
            </div>
          </v-flex>
          <v-flex xs12 sm6 class="input-box">
            <label>Номер будинку*</label>
            <input
              v-model="location.building"
              type="text"
              class="input-default"
              placeholder="Введіть номер будинку"
            />
            <div class="error__box">
              <span>{{ errors.building }}</span>
            </div>
          </v-flex>
          <v-flex xs12 sm6 class="input-box">
            <label>Поверх</label>
            <input
              v-model="location.floor"
              type="text"
              class="input-default"
              placeholder="Номер поверху"
            />
            <div class="error__box">
              <span>{{ errors.floor }}</span>
            </div>
          </v-flex>
          <v-flex xs12 sm6 class="input-box">
            <label>Офіс</label>
            <input
              v-model="location.office"
              type="text"
              class="input-default"
              placeholder="Номер офісу"
            />
            <div class="error__box">
              <span>{{ errors.office }}</span>
            </div>
          </v-flex>
          <v-flex xs12 sm6 class="input-box" />
          <v-flex xs12 sm6 class="input-box">
            <label>Робочий номер телефону*</label>
            <div class="row w-100 m-0 p-0">
              <div class="mask__phone">+380</div>
              <input
                v-model="location.phone_one"
                type="text"
                class="input-default"
                placeholder="Номер стільникового"
              />
            </div>
            <div class="error__box">
              <span>{{ errors.phone_one }}</span>
            </div>
          </v-flex>
          <v-flex xs12 sm6 class="input-box">
            <label>Додатковий номер телефону</label>
            <div class="row w-100 m-0 p-0">
              <div class="mask__phone">+380</div>
              <input
                v-model="location.phone_two"
                type="text"
                class="input-default"
                placeholder="Номер стільникового"
              />
            </div>
            <div class="error__box">
              <span>{{ errors.phone_two }}</span>
            </div>
          </v-flex>
          <v-flex xs12 sm12 class="">
            <div class="checkbox__custom">
              <v-checkbox
                v-model="location.budgetLocationOnly"
                :label="`Бюджети по локаціях`"
              />
              <template>
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <i class="vsm-icon icon-info" v-on="on"></i>
                  </template>
                  <span>Бюджет діє на всі кост-центри даної локації</span>
                </v-tooltip>
              </template>
            </div>
          </v-flex>
          <v-flex xs12 sm12 class="wrap__selectInput">
            <div class="checkbox__custom">
              <v-checkbox
                v-model="location.allCompanies"
                :label="`Доступ до всіх юридичних осіб`"
              />
              <template>
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <i class="vsm-icon icon-info" v-on="on"></i>
                  </template>
                  <span>Локація доступна для всіх юридичних осіб даного
                    підприємства</span>
                </v-tooltip>
              </template>
            </div>
            <div v-if="!location.allCompanies" name="visibleBlock">
              <v-select
                v-model="location.companyEntitiesIds"
                class="v-select-empty v-select-empty-modal"
                hide-details
                deletable-chips
                chips
                :items="companyEntities"
                multiple
                :clearable="false"
                :searchable="false"
                placeholder=""
                item-text="short_name"
                item-value="id"
                :disabled="!$root.rbac.updateLocations && update"
              />
              <div class="error__box">
                <span>{{ errors.companyEntitiesIds }}</span>
              </div>
            </div>
          </v-flex>
          <v-flex xs12 sm12 class="input-box plus__modal__box">
            <template>
              <v-flex
                v-for="(cost, index) in location.costCenters"
                :key="index"
                xs12
                sm12
                class="input-box"
              >
                <label>Кост-центр: {{ location.costCenters[index].value }}</label>
                <v-flex xs12 sm6 class="box-cost-input">
                  <input
                    v-model="location.costCenters[index].name"
                    class="input-default xs5 sm5"
                    type="text"
                  />
                  <v-btn
                    v-show="
                      $root.rbac.updateLocations && $root.rbac.updateCostCenter
                    "
                    flat
                    icon
                    @click="deleteCostButton(index)"
                  >
                    <v-icon>
                      close
                    </v-icon>
                  </v-btn>
                </v-flex>
              </v-flex>
            </template>
            <label
              v-show="$root.rbac.updateLocations && $root.rbac.updateCostCenter"
              style="cursor: pointer"
              @click="addCost"
            >
              <v-btn class="btn__plus" small flat>
                <v-icon>add</v-icon>
              </v-btn>
              Додати кост-центр</label>
          </v-flex>
          <author :update="update" :history="location.history" />
        </v-layout>
      </v-container>

      <v-card-actions>
        <v-spacer />
        <button class="button button__blue" flat @click="cancel">
          Скасувати
        </button>
        <button
          v-if="!update"
          class="button button__yellow"
          flat
          @click="createLocation"
        >
          Створити
        </button>
        <button
          v-show="!viewOnly && $root.rbac.updateLocations"
          v-else
          class="button button__yellow"
          flat
          @click="updateLocation"
        >
          Застосувати
        </button>
      </v-card-actions>
    </v-card>
    <v-dialog v-model="dialogDelete" max-width="400">
      <v-card>
        <v-card-title class="headline">Видалити кост-центр?</v-card-title>
        <v-card-text>
          Ви впевнені що хочете видалити кост-центр?
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <button class="button button__blue" @click="dialogDelete = false">
            Скасувати
          </button>
          <button class="button button__yellow" @click="deleteCost(dialogData)">
            Підтвердити
          </button>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-dialog>
</template>

<script>
export default {
  name: "DialogCreateContacts",
  props: {
    location: { type: Object },
    dialog: { type: Boolean },
    update: { type: Boolean },
    companyEntities: { type: Array },
    viewOnly: {
      type: Boolean,
      default: false
    },
    hideButton: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    date: new Date().toISOString().substr(0, 10),
    modal: false,
    checkbox2: false,
    errors: [],
    dialogData: 0,
    dialogDelete: false,
    preventAction: false
  }),
  methods: {
    addCost() {
      this.location.costCenters.push({
        name: ""
      })
    },
    deleteCost(index) {
      this.location.costCenters.splice(index, 1)
      this.dialogDelete = false
    },
    deleteCostButton(index) {
      this.dialogDelete = true
      this.dialogData = index
    },
    createLocation() {
      if (this.preventAction) {
        return true
      }
      this.preventAction = true
      this.$api
        .post("/locations/create-location", this.location)
        .then(response => {
          this.preventAction = false
          let errors = []
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
    updateLocation() {
      if (this.preventAction) {
        return true
      }
      this.preventAction = true
      this.$api
        .post("/locations/update-location", this.location)
        .then(response => {
          this.preventAction = false
          let errors = []
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
    cancel() {
      this.$emit("closeDialog", false)
      this.updateList()
      this.errors = []
    },
    updateList() {
      this.$emit("updateList", true)
      setTimeout(() => {
        this.$emit("updateList", false)
      }, 100)
    },
    openDialog() {
      this.$emit("closeDialog", true)
    }
  }
}
</script>

<style scoped lang="sass">
.checkbox__custom
    transition: 0.3s

.visibleBlock-enter-active,
.visibleBlock-leave-active,
.visibleBlock-move
    transition: 600ms
    transition-property: opacity, transform
.visibleBlock-enter
    transition: 100ms
    opacity: 0
    max-height: 1000px
    transform: translateY(200px)


.visibleBlock-enter-to
    opacity: 1
    transition: 0.5s
    transform: translateY(0)


.visibleBlock-leave-active
    max-height: 0px
    padding: 0px !important
    overflow: hidden
    opacity: 0
    transition: 0.3s


.visibleBlock-leave-to
    opacity: 0
    transform-origin: center top
.box-cost-input
    width: 100%
    display: flex
    padding-left: 0px!important
    .v-icon
        color: red
</style>

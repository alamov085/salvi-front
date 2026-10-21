<template>
  <v-dialog
    v-model="dialog"
    persistent
    :fullscreen="$store.getters['params/mobileView']"
    max-width="705px"
  >
    <template v-slot:activator="{ on }">
      <button
        v-show="$root.rbac.createContract"
        class="button button__yellow"
        @click="openDialog"
      >
        Створити договір
      </button>
    </template>
    <v-card>
      <v-card-title>
        <span v-if="!update" class="headline">Створення нового договору</span>
        <span v-else class="headline">Редагування договору</span>
        <v-spacer />
        <v-flex xs1 sm1>
          <v-btn flat icon color="" @click="cancel">
            <v-icon>close</v-icon>
          </v-btn>
        </v-flex>
      </v-card-title>

      <v-container
        v-disable-all="!$root.rbac.updateContract && update"
        grid-list-md
      >
        <v-layout wrap>
          <v-flex xs12 sm6 md6 class="input-box">
            <label>Назва договору</label>
            <input
              v-model="model.name"
              type="text"
              class="input-default"
              placeholder="Введіть назву договору"
            />
            <div class="error__box">
              <span>{{ errors.name }}</span>
            </div>
          </v-flex>
          <v-flex xs12 sm6 md6 class="input-box">
            <label>Номер договору</label>
            <input
              v-model="model.number"
              type="text"
              class="input-default"
              placeholder="Введіть номер вашого договору"
            />
            <div class="error__box">
              <span>{{ errors.number }}</span>
            </div>
          </v-flex>
          <v-flex xs12 sm6 class="input-box">
            <label>Постачальник</label>
            <v-select
              v-model="model.supplier_id"
              solo
              :items="supplierNew"
              hide-details
              item-text="name"
              item-value="id"
              :clearable="false"
              :searchable="false"
              label="Вибрати постачальника"
              :disabled="!$root.rbac.updateContract && update"
            />
            <div class="error__box">
              <span>{{ errors.supplier_id }}</span>
            </div>
          </v-flex>
          <v-flex xs12 sm6 class="input-box">
            <label>Юридична особа</label>
            <v-select
              v-model="model.company_entity_id"
              hide-details
              solo
              :items="companyEntity"
              :clearable="false"
              :searchable="false"
              item-text="short_name"
              item-value="id"
              label="Вибрати особу"
              :disabled="!$root.rbac.updateContract && update"
            />
            <div class="error__box">
              <span>{{ errors.company_entity_id }}</span>
            </div>
          </v-flex>
          <v-flex xs12 sm6 class="input-box">
            <label>Дата початку договору</label>
            <v-dialog
              ref="dialog_date_start"
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
                  placeholder="ДД/ММ/РРРР"
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
                <v-btn flat color="primary" @click="modal_date_start = false">Скасувати</v-btn>
                <v-btn
                  flat
                  color="primary"
                  @click="$refs.dialog_date_start.save(model.date_start)"
                >
                  Зберегти
                </v-btn>
              </v-date-picker>
            </v-dialog>
          </v-flex>
          <v-flex xs12 sm6 class="input-box">
            <label>Дата закінчення договору</label>
            <v-dialog
              ref="dialog_date_end"
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
                  placeholder="ДД/ММ/РРРР"
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
                <v-btn flat color="primary" @click="modal_date_end = false">Скасувати</v-btn>
                <v-btn
                  flat
                  color="primary"
                  @click="$refs.dialog_date_end.save(model.date_end)"
                >
                  Зберегти
                </v-btn>
              </v-date-picker>
            </v-dialog>
          </v-flex>
          <v-flex xs12 sm12 class="">
            <div class="checkbox__custom">
              <v-checkbox
                v-model="model.all_location"
                :label="`Для всіх локацій`"
              />
              <template>
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <i class="vsm-icon icon-info" v-on="on"></i>
                  </template>
                  <span>Договору будуть доступні всі локації і кост-центри
                    підприємства</span>
                </v-tooltip>
              </template>
            </div>
            <div class="error__box">
              <span>{{ errors.all_location }}</span>
            </div>
          </v-flex>
          <v-flex v-if="!model.all_location" xs12 sm6 class="input-box">
            <label>Локація</label>
            <v-select
              v-model="model.locations"
              hide-details
              solo
              :items="locations"
              :clearable="false"
              :searchable="false"
              multiple
              deletable-chips
              chips
              item-text="name"
              item-value="id"
              label="Вибір локації"
              :disabled="!$root.rbac.updateContract && update"
            />
            <div class="error__box">
              <span>{{ errors.locations }}</span>
            </div>
          </v-flex>
          <v-flex v-if="!model.all_location" xs12 sm6 class="input-box">
            <label>Кост-центри</label>
            <v-select
              v-model="model.costCenters"
              hide-details
              solo
              :items="costCenters"
              :clearable="false"
              :searchable="false"
              multiple
              deletable-chips
              chips
              item-text="name"
              item-value="id"
              label="Вибір кост-центрів"
              :disabled="!$root.rbac.updateContract && update"
            />
            <div class="error__box">
              <span>{{ errors.costCenters }}</span>
            </div>
          </v-flex>
          <v-flex xs12 sm12 class="input-box">
            <label>Примітка</label>
            <textarea
              v-model="model.comment"
              class="textarea-default"
              placeholder="Додайте коментар до договору"
            ></textarea>
          </v-flex>
          <author :update="update" :history="model.history" />
        </v-layout>
      </v-container>

      <v-card-actions>
        <v-spacer />
        <button class="button button__blue" flat @click="cancel">
          Відмінити
        </button>
        <button
          v-if="!update"
          class="button button__yellow"
          flat
          @click="createContract"
        >
          Зберегти
        </button>
        <button
          v-show="$root.rbac.updateContract"
          v-else
          class="button button__yellow"
          flat
          @click="updateContract"
        >
          Застосувати
        </button>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "DialogCreateContacts",
  props: ["model", "dialog", "update", "supplier", "companyEntity"],
  data: () => ({
    errors: [],
    modal_date_start: false,
    modal_date_end: false,
    locations: [],
    costCenters: [],
    options: ["foo", "bar", "baz"],
    supplierNew: [],
    initLoad: true,
    preventAction: false
  }),
  watch: {
    "model.company_entity_id": function() {
      this.changeCompanyEntity()
    },
    "model.locations": function() {
      this.changeLocation()
    },
    "model.all_location": function() {
      this.$nextTick(() => this.changeLocation())
    },
    dialog() {
      this.initLoad = true
      this.supplierRecalc()
    }
  },
  methods: {
    supplierRecalc() {
      let a = [...this.supplier]
      if (a.length > 0) {
        let model = this.model
        let need_add = true
        a.forEach(function(value, index) {
          a[index].disabled = false
          if (model.supplier != null && model.supplier.id == a[index].id) {
            need_add = false
          }
        })
        if (need_add && model.supplier != null) {
          a.unshift({
            id: this.model.supplier.id,
            name: this.model.supplier.name,
            disabled: true
          })
        }
      } else {
        if (this.model.supplier != null) {
          a.unshift({
            id: this.model.supplier.id,
            name: this.model.supplier.name,
            disabled: true
          })
        } else {
          a = []
        }
      }
      this.supplierNew = a
    },
    createContract() {
      if (this.preventAction) {
        return true
      }
      this.preventAction = true
      this.$api.get(`/contract/isset-number-contract?number=` + this.model.number).then(response => {
          this.preventAction = false
          if (response.data.issetNumberContract) {
            this.errors = {number: "Договір з таким номером вже існує"}
          } else {
            this.$api.post("contract/create", this.model).then(response => {
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
          }
      });

    },
    updateContract() {
      if (this.preventAction) {
        return true
      }
      this.preventAction = true
        this.$api.get(`/contract/isset-number-contract?number=` + this.model.number + '&id=' + this.model.id).then(response => {
            this.preventAction = false
            if (response.data.issetNumberContract) {
                this.errors = {number: "Договір з таким номером вже існує"}
            } else {
                this.$api.post("contract/update", this.model).then(response => {
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
            }
        });
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
    changeCompanyEntity() {
      if (this.model.company_entity_id > 0) {
        this.$api
          .post("company-entity/get-list-of-locations-contract", {
            id: this.model.company_entity_id
          })
          .then(response => {
            this.locations = response.data.locations
          })
      } else {
        this.locations = []
      }
      if (!this.initLoad) {
        this.model.location_id = 0
        this.model.costCenters = []
      }
    },
    changeLocation() {
      if (this.model.locations.length > 0 || this.model.all_location) {
        this.$api
          .post("locations/get-list-of-cost-centers-contract", {
            id: this.model.locations,
            all_location: this.model.all_location
          })
          .then(response => {
            this.costCenters = response.data.costCenters
            if (!this.initLoad) {
              let modelCosts = []
              this.costCenters.forEach(item => {
                this.model.costCenters.forEach(id => {
                  if (item.id == id) {
                    modelCosts.push(id)
                  }
                })
              })
              this.model.costCenters = modelCosts
            }
          })
      } else {
        this.costCenters = []
      }
      this.initLoad = false
    }
  }
}
</script>

<style scoped></style>

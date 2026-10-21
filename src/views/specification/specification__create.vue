<template>
  <v-dialog
    v-model="dialog"
    :fullscreen="$store.getters['params/mobileView']"
    persistent
    max-width="705px"
  >
    <template v-slot:activator="{ on }">
      <button
        v-show="$root.rbac.createSpecification"
        class="button button__yellow"
        @click="openDialog"
      >
        Створити специфікацію
      </button>
    </template>
    <v-card>
      <v-card-title>
        <span class="headline">Створення специфікації</span>
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
              placeholder="Введіть назву специфікації"
            />
            <div class="error__box">
              <span>{{ errors.name }}</span>
            </div>
          </v-flex>
          <v-flex xs12 sm6 md6 class="input-box">
            <label>Договір</label>
            <v-select
              v-model="model.contract_id"
              class=" "
              hide-details
              solo
              :items="contracts"
              :clearable="false"
              :searchable="false"
              placeholder=""
              item-text="name"
              item-value="id"
            />
            <div class="error__box">
              <span>{{ errors.contract_id }}</span>
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
                  >OK
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
          <v-flex xs12 sm6 md6 class="d-flex align-center">
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
          <v-flex v-if="!model.all_location" xs12 sm6 md6 class="input-box">
            <label>Локація</label>
            <v-select
              v-model="model.locations_id"
              class=""
              multiple
              hide-details
              chips
              deletable-chips
              solo
              :items="locations"
              :clearable="false"
              :searchable="false"
              placeholder=""
              item-text="name"
              item-value="id"
            />
            <div class="error__box">
              <span>{{ errors.locations_id }}</span>
            </div>
          </v-flex>
        </v-layout>
      </v-container>
      <v-card-actions>
        <v-spacer />
        <button class="button button__blue" flat @click="cancel">
          Скасувати
        </button>
        <button class="button button__yellow" flat @click="create">
          Створити
        </button>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "SpecificationCreate",
  props: ["dialog", "products"],
  data() {
    return {
      model: {},
      errors: [],
      modal_date_end: false,
      modal_date_start: false,
      contracts: [],
      locations: [],
      preventAction: false
    }
  },
  watch: {
    dialog(e) {
      if (e) {
        this.getContracts()
      }
    },
    "model.contract_id": function() {
      this.changeContract()
    }
  },
  methods: {
    cancel() {
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
      this.$emit("closeDialog", true)
      this.errors = []
    },
    create() {
      this.model.products = this.products
      if (this.preventAction) {
        return true
      }
      this.preventAction = true
      this.$api.post("/specification/create", this.model).then(response => {
        this.preventAction = false
        let errors = []
        if (response.data.success) {
          this.cancel()
          this.$router.push("/specification")
        } else {
          response.data.errors.forEach(function(value) {
            errors[value.field] = value.message
          })
          this.errors = errors
        }
      })
    },
    getContracts() {
      this.$api
        .post("/graphql", {
          query: `
                        query{
                              contract(perPage: 1000){
                                items{
                                  id
                                  company_id
                                  name
                                  number
                                  supplier_id
                                  supplier_name
                                  company_entity_id
                                  company_entity_name
                                  date_start
                                  date_end
                                  location_id
                                  comment
                                  cost_centers{
                                    id
                                    contract_id
                                    cost_center_id
                                  }
                                }
                              }
                            }`
        })
        .then(response => {
          this.contracts = response.data.data.contract.items
        })
    },
    changeContract() {
      this.model.locations_id = []
      if (this.model.contract_id > 0) {
        this.$api
          .post("/specification/get-list-of-locations", {
            id: this.model.contract_id
          })
          .then(response => {
            this.locations = response.data.locations
          })
      } else {
        this.locations = []
      }
    }
  }
}
</script>

<style scoped></style>

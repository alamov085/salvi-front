<template>
  <v-dialog
    v-model="dialog"
    :fullscreen="$store.getters['params/mobileView']"
    persistent
    max-width="705px"
  >
    <template v-slot:activator="{ on }">
      <button
        v-show="$root.rbac.createCompanyEntity"
        class="button button__yellow"
        @click="openDialog"
      >
        Створити юридичну особу
      </button>
    </template>
    <v-card>
      <v-card-title>
        <span v-if="!update" class="headline">Створення юридичної особи</span>
        <span v-else class="headline">Редагування юридичної особи</span>
        <v-spacer />
        <v-flex xs1 sm1>
          <v-btn flat icon color="" @click="cancel">
            <v-icon>close</v-icon>
          </v-btn>
        </v-flex>
      </v-card-title>

      <v-container
        v-disable-all="!$root.rbac.updateCompanyEntity && update"
        grid-list-md
      >
        <v-layout wrap>
          <v-flex xs12 sm6 md6 class="input-box">
            <label>Юридична особа</label>
            <input
              v-model="editedItem.short_name"
              placeholder="Введіть ім'я юридичної особи"
              class="input-default"
            />
            <div class="error__box">
              <span>{{ errors.short_name }}</span>
            </div>
          </v-flex>
          <v-flex xs12 sm6 md6 class="input-box">
            <label>Юридична адреса</label>
            <input
              v-model="editedItem.address"
              placeholder="Актуальна юридична адреса"
              class="input-default"
            />
            <div class="error__box">
              <span>{{ errors.address }}</span>
            </div>
          </v-flex>
          <v-flex xs12 sm6 md6 class="input-box">
            <label>Розрахунковий рахунок</label>
            <input
              v-model="editedItem.bank_number"
              placeholder="Введіть номер розрахункового рахунку"
              class="input-default"
            />
            <div class="error__box">
              <span>{{ errors.bank_number }}</span>
            </div>
          </v-flex>
          <v-flex xs12 sm6 md6 class="input-box">
            <label>Банк</label>
            <input
              v-model="editedItem.bank_name"
              placeholder="Назва банку"
              class="input-default"
            />
            <div class="error__box">
              <span>{{ errors.bank_name }}</span>
            </div>
          </v-flex>
          <v-flex xs12 sm6 md6 class="input-box">
            <label>МФО</label>
            <input
              v-model="editedItem.mfo"
              placeholder="Введіть код"
              class="input-default"
            />
            <div class="error__box">
              <span>{{ errors.mfo }}</span>
            </div>
          </v-flex>
          <v-flex xs12 sm6 md6 class="input-box">
            <label>ЄДРПОУ</label>
            <input
              v-model="editedItem.edrpou"
              placeholder="Мінімум 6 цифр"
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
              placeholder="Ідентифікаційний код"
              class="input-default"
            />
            <div class="error__box">
              <span>{{ errors.inn }}</span>
            </div>
          </v-flex>
          <v-flex xs12 sm6 md6 class="input-box">
            <label>Статус платника податків на прибуток</label>
            <v-select
              v-model="editedItem.tax_payer"
              hide-details
              solo
              :items="taxOption"
              :clearable="false"
              :searchable="false"
              label="Виберіть статус"
              item-value="id"
              item-text="name"
              :disabled="!$root.rbac.updateCompanyEntity && update"
            />
          </v-flex>
          <!--                    <v-flex xs2 sm2 m2 class="input-box">-->
          <!--                        <label>Активний</label>-->
          <!--                        <v-select solo :items="status" :multiple="false" :clearable="false" v-model="editedItem.status_check"-->
          <!--                                  :searchable="false" placeholder='' item-text="name" item-value="value"></v-select>-->
          <!--                    </v-flex>-->
          <!--                    <v-flex xs12 sm6 md6 class="input-box" v-if="editedItem.status_check == 0">-->
          <!--                        <label>З</label>-->
          <!--                        <v-dialog-->
          <!--                                content-class="datepicker"-->
          <!--                                ref="dialog"-->
          <!--                                v-model="modal"-->
          <!--                                :return-value.sync="date"-->
          <!--                                persistent-->
          <!--                                lazy-->
          <!--                                full-width-->
          <!--                                width="290px"-->
          <!--                        >-->
          <!--                            <template v-slot:activator="{ on }">-->
          <!--                                <input type="text" class="input-default" placeholder="ДД/ММ/ГГГГ"-->
          <!--                                       v-model="editedItem.from_date"-->
          <!--                                       prepend-icon="event"-->
          <!--                                       readonly-->
          <!--                                       v-on="on"-->
          <!--                                >-->
          <!--                            </template>-->
          <!--                            <v-date-picker locale="ua" dark v-model="editedItem.from_date" scrollable>-->
          <!--                                <v-spacer></v-spacer>-->
          <!--                                <v-btn flat color="primary" @click="modal = false">Відміна</v-btn>-->
          <!--                                <v-btn flat color="primary" @click="$refs.dialog.save(editedItem.from_date)">OK</v-btn>-->
          <!--                            </v-date-picker>-->
          <!--                        </v-dialog>-->
          <!--                    </v-flex>-->
          <author :update="update" :history="editedItem.history" />
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
          @click="createCompanyEntity"
        >
          Створити
        </button>
        <button
          v-show="$root.rbac.updateCompanyEntity"
          v-else
          class="button button__yellow"
          flat
          @click="updateCompanyEntity"
        >
          Застосувати
        </button>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "CreateDirectoryLegal",
  props: [
    "editedItem",
    "dialog",
    "update",
    "roles",
    "locations",
    "id",
    "taxOption"
  ],
  data: () => ({
    date: new Date().toISOString().substr(0, 10),
    modal: false,
    costCenters: [],
    errors: [],
    status: [
      { value: 0, name: "Ні" },
      { value: 1, name: "Так" }
    ],
    preventAction: false
  }),
  methods: {
    createCompanyEntity() {
      if (this.preventAction) {
        return true
      }
      this.preventAction = true
      this.editedItem.current_company = this.id
      this.$api
        .post("company-entity/create", this.editedItem)
        .then(response => {
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
    updateCompanyEntity() {
      if (this.preventAction) {
        return true
      }
      this.preventAction = true
      this.editedItem.current_company = this.id
      this.$api
        .post("company-entity/update", this.editedItem)
        .then(response => {
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
    }
  }
}
</script>

<style scoped></style>

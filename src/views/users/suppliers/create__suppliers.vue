<template>
  <v-dialog
    v-model="dialog"
    :fullscreen="$store.getters['params/mobileView']"
    persistent
    max-width="705px"
  >
    <template v-slot:activator="{ on }">
      <button
        v-show="$root.rbac.createSupplier"
        v-if="!currentUser.company_id"
        class="button button__yellow"
        @click="openDialog"
      >
        Створити постачальника
      </button>
      <v-dialog v-model="modal" max-width="400px">
        <v-card>
          <v-card-title class="headline">Підтвердіть дію</v-card-title>
          <v-card-text>
            Ви впевнені, що хочете внести зміни в постачальника? Постачальник
            прибереться з договорів, в яких він вказаний і такі договори будуть
            деактивовані.
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <button class="button button__blue" @click="modal = false">
              Скасувати
            </button>
            <button class="button button__yellow" @click="updateCostCenter()">
              Підтвердити
            </button>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </template>
    <v-card>
      <v-card-title>
        <span v-if="!update" class="headline">Створення постачальника</span>
        <span v-else class="headline">Редагування постачальника</span>
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
            <label for="">Найменування</label>
            <input
              v-model="model.name"
              type="text"
              class="input-default"
              placeholder="Введіть назву постачальника"
            />
            <div class="error__box">
              <span>{{ errors.name }}</span>
            </div>
          </v-flex>
          <v-flex xs12 sm6 md6 class="input-box">
            <label for="">Код ЄДРПОУ</label>
            <input
              v-model="model.edrpou"
              type="text"
              class="input-default"
              placeholder="Мінімум 6 цифр"
            />
            <div class="error__box">
              <span>{{ errors.edrpou }}</span>
            </div>
          </v-flex>
          <v-flex xs12 sm6 md6 class="input-box">
            <label for="">ІПН</label>
            <input
              v-model="model.inn"
              type="text"
              class="input-default"
              placeholder="Ідентифікаційний код"
            />
            <div class="error__box">
              <span>{{ errors.inn }}</span>
            </div>
          </v-flex>
          <v-flex xs12 sm12 class="input-box">
            <label for="">Опис</label>
            <textarea
              id=""
              v-model="model.description"
              class="textarea-default"
              name=""
              cols="30"
              rows="10"
              placeholder="Додайте опис постачальника"
            ></textarea>
            <div class="error__box">
              <span>{{ errors.description }}</span>
            </div>
          </v-flex>
          <v-flex v-if="!currentUser.company_id" xs12 sm12 class="input-box">
            <label for="">Підприємства</label>
            <v-select
              v-model="model.companies"
              solo
              hide-details
              deletable-chips
              chips
              :items="companies"
              item-text="full_name"
              item-value="id"
              multiple
              :clearable="false"
              :searchable="false"
              placeholder=""
            />
            <div class="error__box">
              <span>{{ errors.locations }}</span>
            </div>
          </v-flex>
          <author :update="update" :history="model.history" />
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
          @click="createCostCenter"
        >
          Створити
        </button>
        <button
          v-else
          class="button button__yellow"
          flat
          @click="updateCostCenterModal"
        >
          Застосувати
        </button>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from "vuex"

export default {
  name: "CreateSuppliers",
  props: ["model", "dialog", "update", "companies"],
  data: () => ({
    errors: [],
    modal: false,
    preventAction: false
  }),
  methods: {
    updateCostCenterModal() {
      this.modal = true
    },
    createCostCenter() {
      if (this.preventAction) {
        return true
      }
      this.preventAction = true
      this.$api.post("/supplier/create", this.model).then(response => {
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
    updateCostCenter() {
      if (this.preventAction) {
        return true
      }
      this.preventAction = true
      this.$api.post("/supplier/update", this.model).then(response => {
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
      this.errors = []
    }
  },
  computed: {
    ...mapGetters("user", ["currentUser"])
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
    .plus__cost__box
        .input-box
            margin-bottom: 0px
        label
            font-size: 13px
            color: #5578EB
        .btn__plus
            width: 20px!important
            min-width: 20px!important
            height: 20px!important
            background-color: #5578EB!important
            border-radius: 4px!important
            margin: 0px!important
            margin-right: 8px!important
            margin-left: 2px!important
            i
                color: white!important
                font-size: 18px!important
</style>

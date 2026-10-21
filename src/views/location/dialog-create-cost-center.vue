<template>
  <v-dialog
    v-model="dialog"
    :fullscreen="$store.getters['params/mobileView']"
    persistent
    max-width="705px"
  >
    <template v-slot:activator="{ on }">
      <button
        v-show="$root.rbac.createCostCenter && !hideButton"
        class="button button__yellow"
        @click="openDialog"
      >
        Створити кост-центр
      </button>
    </template>
    <v-card>
      <v-card-title>
        <span v-if="!update" class="headline">Створення кост-центру</span>
        <span v-else class="headline">
          <span v-show="!viewOnly && $root.rbac.updateCostCenter">Редагування кост-центру</span>
          <span v-show="viewOnly">Перегляд кост-центру</span>
        </span>
        <v-spacer />
        <v-flex xs1 sm1>
          <v-btn flat icon color="" @click="cancel">
            <v-icon>close</v-icon>
          </v-btn>
        </v-flex>
      </v-card-title>
      <v-container
        v-disable-all="!$root.rbac.updateCostCenter && viewOnly"
        grid-list-md
      >
        <v-layout wrap>
          <v-flex xs12 sm6 md6 class="input-box">
            <label>Назва</label>
            <input
              v-model="costCenter.name"
              type="text"
              class="input-default"
              placeholder="Введіть назву кост-центру"
            />
            <div class="error__box">
              <span>{{ errors.name }}</span>
            </div>
          </v-flex>
          <v-flex xs12 sm6 md6 class="input-box">
            <label>Локація</label>
            <v-select
              v-model="costCenter.location_id"
              class=" "
              hide-details
              solo
              :items="companyEntities"
              :clearable="false"
              :searchable="false"
              placeholder=""
              item-text="name"
              item-value="id"
              :disabled="!$root.rbac.updateCostCenter && update"
            />
            <div class="error__box">
              <span>{{ errors.location_id }}</span>
            </div>
          </v-flex>
          <v-flex
            v-show="$root.$rbac.uuidCostCenter"
            xs12
            sm6
            md6
            class="input-box"
          >
            <label>uID Клієнта</label>
            <input
              v-model="costCenter.uuid_client"
              type="text"
              class="input-default"
              placeholder="Введіть uID Клієнта"
            />
            <div class="error__box">
              <span>{{ errors.uuid_client }}</span>
            </div>
          </v-flex>
          <v-flex
            v-show="$root.$rbac.uuidCostCenter"
            xs12
            sm6
            md6
            class="input-box"
          >
            <label>uID Узгодження</label>
            <input
              v-model="costCenter.uuid_contract"
              type="text"
              class="input-default"
              placeholder="Введіть uID Узгодження"
            />
            <div class="error__box">
              <span>{{ errors.uuid_contract }}</span>
            </div>
          </v-flex>
          <author :update="update" :history="costCenter.history" />
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
          v-show="!viewOnly && $root.rbac.updateCostCenter"
          class="button button__yellow"
          flat
          @click="updateCostCenter"
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
  name: "DialogCreateCostCenter",
  props: {
    costCenter: { type: Object },
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
    errors: [],
    preventAction: false
  }),
  methods: {
    createCostCenter() {
      if (this.preventAction) {
        return true
      }
      this.preventAction = true
      this.$api.post("/cost-centers/create", this.costCenter).then(response => {
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
      this.$api.post("/cost-centers/update", this.costCenter).then(response => {
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

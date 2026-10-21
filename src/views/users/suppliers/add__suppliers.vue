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
        v-if="currentUser.company_id"
        class="button button__yellow"
        @click="openDialog"
      >
        Додати постачальника
      </button>
    </template>
    <v-card>
      <v-card-title>
        <span class="headline">Додати постачальника</span>
        <v-spacer />
        <v-flex xs1 sm1>
          <v-btn flat icon color="" @click="cancel">
            <v-icon>close</v-icon>
          </v-btn>
        </v-flex>
      </v-card-title>

      <v-container grid-list-md>
        <v-layout wrap>
          <v-flex xs12 sm12 class="input-box">
            <label>Постачальники</label>
            <v-select
              v-model="model.supplier"
              class="v-select-empty"
              hide-details
              deletable-chips
              chips
              :items="suppliers"
              item-text="name"
              item-value="id"
              multiple
              :clearable="false"
              :searchable="false"
              placeholder=""
            />
            <div class="error__box">
              <span>{{ errors.supplier }}</span>
            </div>
          </v-flex>
        </v-layout>
      </v-container>

      <v-card-actions>
        <v-spacer />
        <button class="button button__blue" flat @click="cancel">
          Скасувати
        </button>
        <button
          v-if="model.supplier.length > 0"
          class="button button__yellow"
          flat
          @click="create"
        >
          Додати
        </button>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from "vuex"

export default {
  name: "AddSuppliers",
  props: ["dialog", "update"],
  data: () => ({
    errors: [],
    suppliers: [],
    model: { supplier: [] }
  }),
  methods: {
    create() {
      this.$api.post("/supplier/add-company", this.model).then(response => {
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
      this.model = { supplier: [] }
      this.getSuppliers()
      this.errors = []
    },
    getSuppliers() {
      this.$api.post("/supplier/get-list-to-add").then(response => {
        this.suppliers = response.data.supplier
      })
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

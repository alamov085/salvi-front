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
        Додати менеджера
      </button>
    </template>
    <v-card>
      <v-card-title>
        <span class="headline">Додати менеджера</span>
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
            <label>Менеджери</label>
            <v-select
              v-model="model.manager"
              class="v-select-empty"
              hide-details
              deletable-chips
              chips
              :items="managers"
              item-text="name"
              item-value="id"
              multiple
              :clearable="false"
              :searchable="false"
              placeholder=""
            />
            <div class="error__box">
              <span>{{ errors.manager }}</span>
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
          v-if="model.manager.length > 0"
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
  name: "AddManagers",
  props: ["dialog", "update"],
  data: () => ({
    errors: [],
    managers: [],
    model: { manager: [] }
  }),
  methods: {
    create() {
      this.$api.post("/managers/add-company", this.model).then(response => {
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
      this.model = { manager: [] }
      this.getSuppliers()
      this.errors = []
    },
    getSuppliers() {
      this.$api.post("/managers/get-list-to-add").then(response => {
        this.managers = response.data.managers
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

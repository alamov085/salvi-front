<template>
  <v-dialog
    v-model="dialog"
    :fullscreen="$store.getters['params/mobileView']"
    persistent
    max-width="705px"
  >
    <template v-slot:activator="{ on }">
      <button
        v-show="$root.rbac.managementEmail && !hideButton"
        class="button button__yellow"
        @click="openDialog"
      >
        Додати Email
      </button>
    </template>
    <v-card>
      <v-card-title>
        <span v-if="!update" class="headline">Створення нового Email</span>
        <span v-else class="headline">
          <span v-show="!viewOnly && $root.rbac.managementEmail">Редагування Email</span>
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
        v-disable-all="!$root.rbac.managementEmail && viewOnly"
        grid-list-md
      >
        <v-layout wrap>
          <v-flex xs12 sm12 md12 class="box--newEmail">
            <v-flex xs7 sm7 md12 class="input-box">
              <label>Email</label>
              <input
                v-model="itemEmail.email"
                type="email"
                class="input-default"
                placeholder="Введіть Email"
              />
              <div class="error__box">
                <span>{{ errors.email }}</span>
              </div>
            </v-flex>
          </v-flex>
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
          @click="create"
        >
          Створити
        </button>
        <button
          v-else
          v-show="!viewOnly"
          class="button button__yellow"
          flat
          @click="updateDataModal"
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
    // eslint-disable-next-line vue/require-default-prop
    itemEmail: { type: Object },
    dialog: { type: Boolean },
    update: { type: Boolean },
    // eslint-disable-next-line vue/require-default-prop
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
    preventAction: false,
    switch1: true
  }),
  watch: {
    dialog() {
      this.errors = []
    }
  },
  methods: {
    create() {
      if (this.preventAction) {
        return true
      }
      this.preventAction = true
      this.$api.post("/admin-email/create", this.itemEmail).then(response => {
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
    updateDataModal() {
      if (this.preventAction) {
        return true
      }
      this.preventAction = true
      this.$api.post("/admin-email/update", this.itemEmail).then(response => {
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
      this.listUpdated()
    },
    listUpdated() {
      this.$emit("listUpdated", true)
      setTimeout(() => {
        this.$emit("listUpdated", false)
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

<style lang="sass"></style>

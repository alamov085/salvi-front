<template>
  <v-dialog
    v-model="dialog"
    :fullscreen="$store.getters['params/mobileView']"
    persistent
    max-width="705px"
  >
    <template v-slot:activator="{ on }">
      <button
        v-show="$root.rbac.orderChangeProduct && orders.length > 0"
        class="button button__yellow ml-2 no-plus fastChangeOrderBtn"
        @click="showModal(true)"
      >
        Заміна товару
      </button>
    </template>
    <v-card>
      <v-card-title>
        <span class="headline">Заміна товару</span>
        <v-spacer />
        <v-flex xs1 sm1>
          <v-btn flat icon color="" @click="showModal(false)">
            <v-icon>close</v-icon>
          </v-btn>
        </v-flex>
      </v-card-title>
      <v-container grid-list-md>
        <v-layout wrap>
          <div class="input-box">
            <v-autocomplete
              v-model="autocompleteOld"
              class="input-default"
              solo
              :items="itemsOld"
              :loading="isLoadingOld"
              :search-input.sync="searchAutocompleteOld"
              item-text="name"
              item-value="uuid"
              :no-filter="true"
              placeholder="Назва або uuid товару"
              return-object
              hide-details
            />
            <div v-if="errorOld">Виберіть товар зі списку</div>
          </div>
          <div class="input-box">
            <v-autocomplete
              v-model="autocomplete"
              class="input-default"
              solo
              :items="items"
              :loading="isLoading"
              :search-input.sync="searchAutocomplete"
              :no-filter="true"
              item-text="name"
              item-value="uuid"
              hide-details
              placeholder="Назва або uuid товару"
              return-object
            />
            <div v-if="error">Виберіть товар зі списку</div>
          </div>
        </v-layout>
      </v-container>

      <v-card-actions>
        <v-spacer />
        <button class="button button__blue" flat @click="showModal(false)">
          >Скасувати
        </button>
        <button class="button button__yellow" flat @click="makeChanges">
          Змінити
        </button>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "ChangeProduct",
  props: {
    dialog: {
      type: Boolean
    },
    orders: {
      type: Array
    }
  },
  data: () => ({
    entries: [],
    isLoading: false,
    autocomplete: null,
    searchAutocomplete: null,
    entriesOld: [],
    isLoadingOld: false,
    autocompleteOld: null,
    searchAutocompleteOld: null,
    error: false,
    errorOld: false,
    count: 0
  }),
  computed: {
    fields() {
      if (!this.searchAutocomplete) return []

      return Object.keys(this.searchAutocomplete).map(key => {
        return {
          key,
          value: this.searchAutocomplete[key] || "n/a"
        }
      })
    },
    items() {
      let descriptionLimit = 30
      return this.entries.map(entry => {
        const Description =
          entry.name.length > descriptionLimit
            ? entry.name.slice(0, descriptionLimit) + "..."
            : entry.name

        return Object.assign({}, entry, { Description })
      })
    },
    fieldsOld() {
      if (!this.searchAutocompleteOld) return []

      return Object.keys(this.searchAutocompleteOld).map(key => {
        return {
          key,
          value: this.searchAutocompleteOld[key] || "n/a"
        }
      })
    },
    itemsOld() {
      let descriptionLimit = 30
      return this.entriesOld.map(entry => {
        const Description =
          entry.name.length > descriptionLimit
            ? entry.name.slice(0, descriptionLimit) + "..."
            : entry.name

        return Object.assign({}, entry, { Description })
      })
    }
  },
  watch: {
    searchAutocomplete(val) {
      // Items have already been loaded
      if (val == null || val.length < 1) return
      this.count += 1
      let count = this.count
      // Items have already been requested
      // if (this.isLoading) return;
      val = val.replace(/["]/g, '\\"').replace(/[']/g, "'")
      this.isLoading = true
      this.$api
        .post("/graphql", {
          query:
            `
                        query{
                          allProduct(search: "` +
            val +
            `"){
                              uuid
                              name
                            }
                        }`
        })
        .then(res => {
          if (this.count == count) {
            this.entries = res.data.data.allProduct
          }
        })
        // eslint-disable-next-line no-unused-vars
        .catch(err => {
          // console.log(err)
        })
        .finally(() => (this.isLoading = false))
    },
    searchAutocompleteOld(val) {
      // Items have already been loaded
      if (val == null || val.length < 3) return
      this.count += 1
      let count = this.count

      // Items have already been requested
      // if (this.isLoadingOld) return;
      val = val.replace(/["]/g, '\\"').replace(/[']/g, "'")
      let temp = this.orders.map(val => {
        return val.id
      })
      let orders = temp.join()
      this.isLoadingOld = true
      this.$api
        .post("/graphql", {
          query:
            `
                        query{
                          allProduct(search: "` +
            val +
            `" orders:"` +
            orders +
            `"){
                              uuid
                              name
                            }
                        }`
        })
        .then(res => {
          if (this.count == count) {
            this.entriesOld = res.data.data.allProduct
          }
        })
        // eslint-disable-next-line no-unused-vars
        .catch(err => {
          // console.log(err)
        })
        .finally(() => (this.isLoadingOld = false))
    }
  },
  methods: {
    makeChanges() {
      this.error = false
      this.errorOld = false
      if (this.autocomplete == null || this.autocompleteOld == null) {
        if (this.autocomplete == null) {
          this.error = true
        }
        if (this.autocompleteOld == null) {
          this.errorOld = true
        }
        return
      }
      this.loading = true
      this.$api
        .post("/order/change-orders-product", {
          from: this.autocompleteOld.uuid,
          to: this.autocomplete.uuid,
          orders: this.orders
        })
        .then(response => {
          if (response.data.success) {
            this.$emit("snackModal", {
              snack: true,
              snackColor: "#19B200",
              snackText: "Зміни збережені"
            })
            this.showModal(false)
          } else {
            this.$emit("snackModal", {
              snack: true,
              snackColor: "#ff2525",
              snackText: response.data.message
            })
          }
        })
        .finally(() => {
          this.autocomplete = ""
          this.autocompleteOld = ""
          this.loading = false
        })
    },
    showModal(e) {
      this.$emit("showModal", e)
    }
  }
}
</script>

<style scoped lang="sass">
.fastChangeOrderBtn
    @media screen and (max-width: 768px)
        margin-top: 10px
        grid-area: 2 / 1 / 3 / 4
        place-self: center end
</style>

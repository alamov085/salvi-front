<template>
  <div>
    <v-dialog
      v-model="dialog"
      :fullscreen="$store.getters['params/mobileView']"
      :persistent="false"
      max-width="700px"
    >
      <v-card>
        <v-card-title>
          <span class="headline">Редагування підприємства</span>
          <v-spacer />
          <v-flex xs1 sm1>
            <v-btn flat icon color="" @click="dialog = false">
              <v-icon>close</v-icon>
            </v-btn>
          </v-flex>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12 sm6 md6 class="input-box">
                <label>Скорочена назва</label>
                <input v-model="editedItem.short_name" class="input-default" />
                <div class="error__box">
                  <span>{{ errors.short_name }}</span>
                </div>
              </v-flex>
              <v-flex xs12 sm6 md6 class="input-box">
                <label>Повна назва</label>
                <input
                  v-model="editedItem.full_name"
                  placeholder="Повна назва підприємства"
                  class="input-default"
                />
                <div class="error__box">
                  <span>{{ errors.full_name }}</span>
                </div>
              </v-flex>
              <v-flex xs12 sm6 md6 class="input-box">
                <label>Код ЄДРПОУ</label>
                <input
                  v-model="editedItem.edrpou"
                  placeholder="Код ЄДРПОУ"
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
                  placeholder="Введіть код"
                  class="input-default"
                />
                <div class="error__box">
                  <span>{{ errors.inn }}</span>
                </div>
              </v-flex>
              <v-flex xs12 sm12 md12 class="input-box">
                <label>Юридична адреса</label>
                <input
                  v-model="editedItem.address"
                  placeholder="Юридична адреса"
                  class="input-default"
                />
                <div class="error__box">
                  <span>{{ errors.address }}</span>
                </div>
              </v-flex>
              <!--<v-flex xs12 sm12 md12 class="input-box">
                                <v-checkbox color="rgb(85, 120, 235)" v-model="editedItem.show_catalog" :label="`Показувати каталог`"></v-checkbox>
                            </v-flex>-->
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <button class="button button__blue" flat @click="close">
            Скасувати
          </button>
          <button class="button button__yellow" flat @click="save">
            Зберегти
          </button>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-data-table
      :headers="headers"
      :items="dataTable"
      :pagination.sync="pagination"
      :total-items="total_items"
      :loading="loading"
      class="table__tamplate-2 theme--light"
      no-data-text="Немає даних"
    >
      <template v-slot:items="props">
        <td>
          <router-link :to="link(props.item.id)">{{
            props.item.short_name
          }}</router-link>
        </td>
        <td class="text-xs-left">
          <div class="status-desc" :class="statuses[props.item.status].class">
            {{ statuses[props.item.status].name }}
          </div>
        </td>
        <td class="justify-center action__td">
          <v-menu
            offset-x
            bottom
            nudge-bottom="40"
            nudge-left="-40"
            left
            content-class="action__td__drop"
          >
            <v-btn slot="activator" icon>
              <v-icon>more_horiz</v-icon>
            </v-btn>
            <v-list v-hide-empty>
              <span>Дії</span>
              <v-list-tile v-if="updateCompany">
                <v-list-tile-title @click="editItem(props.item)">Деталі</v-list-tile-title>
              </v-list-tile>
              <v-list-tile v-if="props.item.status == 2 && approveCompany">
                <v-list-tile-title
                  @click="approveRegistrationButton(props.item)"
                  >Підтвердити реєстрацію
                </v-list-tile-title>
              </v-list-tile>
              <v-list-tile v-if="props.item.status == 2 && approveCompany">
                <v-list-tile-title @click="refuseRegistrationButton(props.item)">Відхилити реєстрацію
                </v-list-tile-title>
              </v-list-tile>
              <v-list-tile
                v-if="
                  (props.item.status == 1 && approveCompany) ||
                    (props.item.status == 3 && approveCompany)
                "
              >
                <v-list-tile-title
                  @click="rollBackRegistrationButton(props.item)"
                  >Скасувати підтвердження
                </v-list-tile-title>
              </v-list-tile>
            </v-list>
          </v-menu>
        </td>
      </template>
    </v-data-table>
    <v-dialog v-model="dialogApprove" max-width="400px">
      <v-card>
        <v-card-title class="headline">Підтвердження реєстрації?</v-card-title>
        <v-card-text>
          Ви впевнені що хочете підтвердити реєстрацію даної юр.особою?
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <button class="button button__blue" @click="dialogApprove = false">
            Скасувати
          </button>
          <button
            class="button button__yellow"
            @click="approveRegistration(dialogData.id)"
          >
            Підтвердити
          </button>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogRefuse" max-width="400">
      <v-card>
        <v-card-title class="headline">Відхилення реєстрації?</v-card-title>
        <v-card-text>
          Ви впевнені що хочете відхилити реєстрацію даної юр.особи?
          <v-flex xs12 sm12 md12>
            <v-text-field
              v-model="reason"
              label="Причина"
              hint="Вкажіть, будь ласка причину відхилення реєстрації"
              persistent-hint
              required
            />
          </v-flex>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <button class="button button__blue" @click="dialogRefuse = false">
            Скасувати
          </button>
          <button
            class="button button__yellow"
            @click="refuseRegistration(dialogData.id)"
          >
            Підтвердити
          </button>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogRollBack" max-width="400">
      <v-card>
        <v-card-title class="headline">Скасувати підтвердження?</v-card-title>
        <v-card-text>
          Ви впевнені що хочете скасувати підтвердження даної юр.особи?
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <button class="button button__blue" @click="dialogRollBack = false">
            Скасувати
          </button>
          <button
            class="button button__yellow"
            @click="rollBackRegistration(dialogData.id)"
          >
            Підтвердити
          </button>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: "TableCompany",
  data: () => ({
    dialog: false,
    dialogData: {},
    modal: false,
    loading: true,
    total_items: 0,
    statuses: [],
    pagination: {
      sortBy: "id",
      rowsPerPage: 5,
      page: 1
    },
    headers: [
      {
        text: "Назва підприємства",
        align: "left",
        sortable: true,
        value: "short_name"
      },
      { text: "Статус", value: "status" },
      { text: "", value: "name", sortable: false }
    ],
    dataTable: [],
    editedIndex: -1,
    editedItem: {},
    dialogApprove: false,
    dialogRefuse: false,
    dialogRollBack: false,
    reason: "",
    errors: []
  }),

  watch: {
    dialog(val) {
      val || this.close()
    },
    pagination: {
      handler() {
        this.getDataFromApi()
      },
      deep: true
    }
  },

  created() {
    this.getDataFromApi()
  },

  methods: {
    getDataFromApi() {
      this.loading = true
      let url = "/graphql"
      let order = "DESC"
      if (this.pagination.descending) {
        order = "ASC"
      }
      this.$api
        .post(url, {
          query:
            `
                        query{
                              company(page: ` +
            this.pagination.page +
            ` perPage: ` +
            this.pagination.rowsPerPage +
            ` order: "` +
            order +
            `" orderBy: "` +
            this.pagination.sortBy +
            `"){
                                totalCount
                                items{
                                  id
                                  short_name
                                  address
                                  edrpou
                                  full_name
                                  inn
                                  status
                                  show_catalog
                                }
                              }
                              companyStatus{
                                id
                                name
                                class
                              }
                            }`
        })
        .then(response => {
          this.dataTable = response.data.data.company.items
          this.total_items = response.data.data.company.totalCount
          this.statuses = response.data.data.companyStatus
          this.loading = false
        })
    },
    editItem(item) {
      this.editedIndex = this.dataTable.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
      this.errors = []
    },

    close() {
      this.dialog = false
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      }, 300)
      this.getDataFromApi()
    },
    link(id) {
      return "/directory-legal/" + id
    },
    save() {
      this.$api.post("company/update", this.editedItem).then(response => {
        let errors = []
        if (response.data.success) {
          this.close()
        } else {
          response.data.errors.forEach(function(value) {
            errors[value.field] = value.message
          })
          this.errors = errors
        }
      })
    },
    approveRegistrationButton(item) {
      this.dialogData = item
      this.dialogApprove = true
    },
    rollBackRegistrationButton(item) {
      this.dialogData = item
      this.dialogRollBack = true
    },
    refuseRegistrationButton(item) {
      this.dialogData = item
      this.dialogRefuse = true
      this.reason = ""
    },
    approveRegistration(id) {
      this.$api
        .post("/company/approve-registration", {
          id: id
        })
        // eslint-disable-next-line no-unused-vars
        .then(response => {
          this.dialogApprove = false
          this.getDataFromApi()
        })
    },
    refuseRegistration(id) {
      this.$api
        .post("/company/refuse-registration", {
          id: id,
          reason: this.reason
        })
        // eslint-disable-next-line no-unused-vars
        .then(response => {
          this.dialogRefuse = false
          this.getDataFromApi()
        })
    },
    rollBackRegistration(id) {
      this.$api
        .post("/company/roll-back-registration", {
          id: id
        })
        // eslint-disable-next-line no-unused-vars
        .then(response => {
          this.dialogRollBack = false
          this.getDataFromApi()
        })
    }
  }
}
</script>

<style scoped></style>

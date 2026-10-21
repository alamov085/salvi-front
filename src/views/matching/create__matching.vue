<template>
  <v-dialog
    v-model="dialog"
    :fullscreen="$store.getters['params/mobileView']"
    persistent
    max-width="705px"
  >
    <template v-slot:activator="{ on }">
      <button
        v-show="$root.rbac.createCoordination"
        class="button button__yellow"
        @click="openDialog"
      >
        Створити
      </button>
    </template>
    <v-card>
      <v-card-title>
        <span v-if="!update" class="headline">Створення шагу</span>
        <span v-else class="headline">Редагування шагу</span>
        <v-spacer />
        <v-flex xs1 sm1>
          <v-btn flat icon color="" @click="cancel">
            <v-icon>close</v-icon>
          </v-btn>
        </v-flex>
      </v-card-title>

      <v-container
        v-disable-all="!$root.rbac.updateCoordination && update"
        grid-list-md
      >
        <v-layout wrap>
          <v-flex xs12 sm6 md6 class="input-box">
            <label>Назва</label>
            <input
              v-model="model.name"
              type="text"
              class="input-default"
              placeholder="Придумайте назву"
            />
            <div class="error__box">
              <span>{{ errors.name }}</span>
            </div>
          </v-flex>
          <v-flex xs12 sm12 class="mb-3 input-box">
            <label>Ролі</label>
            <v-select
              v-model="model.roles"
              hide-details
              solo
              deletable-chips
              chips
              :items="roles"
              multiple
              :disabled="!$root.rbac.updateCoordination && update"
              :clearable="false"
              :searchable="false"
              placeholder=""
              item-text="description"
              item-value="name"
              @change="getUserList"
            />
            <div class="error__box">
              <span>{{ errors.roles }}</span>
            </div>
          </v-flex>
          <v-flex xs12 sm12 class="wrap__selectInput">
            <div class="checkbox__custom">
              <v-checkbox
                v-model="model.all_roles"
                :label="`Всі користувачі данних ролей`"
                :disabled="!$root.rbac.updateCoordination && update"
              />
              <template>
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <i class="vsm-icon icon-info" v-on="on"></i>
                  </template>
                  <span>Користувачі, з даною роллю зможуть затверджувати данний
                    крок узгодження
                  </span>
                </v-tooltip>
              </template>
            </div>
            <transition v-if="!model.all_roles" name="visibleBlock">
              <div>
                <v-select
                  v-model="model.users"
                  class="v-select-empty v-select-empty-modal"
                  hide-details
                  deletable-chips
                  chips
                  :items="userList"
                  multiple
                  :disabled="!$root.rbac.updateCoordination && update"
                  :clearable="false"
                  :searchable="false"
                  placeholder=""
                  item-text="name"
                  item-value="id"
                />
                <div class="error__box">
                  <span>{{ errors.users }}</span>
                </div>
              </div>
            </transition>
          </v-flex>
          <v-flex xs12 sm12 class="wrap__selectInput">
            <div class="checkbox__custom">
              <v-checkbox
                v-model="model.enable_notification"
                :label="`Відправляти повідомлення на пошту`"
                :disabled="!$root.rbac.updateCoordination && update"
              />
              <template>
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <i class="vsm-icon icon-info" v-on="on"></i>
                  </template>
                  <span>Користувачі, до яких підійде крок узгодження, отримають
                    повідомлення на пошту
                  </span>
                </v-tooltip>
              </template>
            </div>
          </v-flex>
          <v-flex xs12 sm12 class="">
            <div class="input-box noBorder ">
              <label>Тип суми затвердження:</label>
              <v-radio-group
                v-model="model.type"
                hide-details
                :disabled="!$root.rbac.updateCoordination && update"
              >
                <v-radio color="#5578EB" label="Всі" :value="1" />
                <v-radio
                  color="#5578EB"
                  label="Більше або дорівнює"
                  :value="3"
                />
              </v-radio-group>
            </div>
          </v-flex>
          <v-flex
            v-if="model.type != 1"
            xs12
            sm6
            md6
            class="input-box noBorder"
          >
            <label>Сума затвердження</label>
            <input
              v-model="model.sum"
              type="text"
              class="input-default"
              placeholder="Введіть суму затвердження"
            />
          </v-flex>
          <v-flex xs12 sm12 class="">
            <div class="input-box noBorder">
              <label>Додаткові умови:</label>
              <v-radio-group
                v-model="model.additional_type"
                hide-details
                :disabled="!$root.rbac.updateCoordination && update"
              >
                <v-radio color="#5578EB" label="Без умов" :value="1" />
                <v-radio
                  color="#5578EB"
                  label="Замовлення перевищує бюджет"
                  :value="2"
                />
                <v-radio
                  color="#5578EB"
                  label="Замовлення без бюджету"
                  :value="3"
                />
                <v-radio
                  color="#5578EB"
                  label="Товари з загального каталогу"
                  :value="4"
                />
              </v-radio-group>
            </div>
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
          @click="createCoordination"
        >
          Створити
        </button>
        <button
          v-else
          v-show="$root.rbac.updateCoordination"
          class="button button__yellow"
          flat
          @click="updateCoordination"
        >
          Застосувати
        </button>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "CreateMatching",
  props: ["dialog", "model", "roles", "update"],
  data: () => ({
    date: new Date().toISOString().substr(0, 10),
    modal: false,
    checkbox2: false,
    location: [],
    userList: [],
    errors: [],
    preventAction: false
  }),
  watch: {
    model: {
      handler(e) {
        if (!e.all_roles) {
          this.getUserList()
        }
      },
      deep: true
    }
  },
  methods: {
    createCoordination() {
      if (this.preventAction) {
        return true
      }
      this.preventAction = true
      this.$api.post("/coordination/create", this.model).then(response => {
        this.preventAction = false
        var errors = []
        if (response.data.success) {
          this.cancel()
        } else {
          response.data.errors.forEach(function(value) {
            errors[value.field] = value.message
          })
        }
        this.errors = errors
      })
    },
    updateCoordination() {
      if (this.preventAction) {
        return true
      }
      this.preventAction = true
      this.$api.post("/coordination/update", this.model).then(response => {
        this.preventAction = false
        var errors = []
        if (response.data.success) {
          this.cancel()
        } else {
          response.data.errors.forEach(function(value) {
            errors[value.field] = value.message
          })
        }
        this.errors = errors
      })
    },
    cancel() {
      this.errors = []
      this.$emit("closeDialog", false)
    },
    openDialog() {
      this.$emit("closeDialog", true)
    },
    updateList() {
      this.$emit("updateList", true)
      setTimeout(() => {
        this.$emit("updateList", false)
      }, 100)
    },
    getUserList() {
      this.$api
        .post("/users/get-users-by-role", { roles: this.model.roles })
        .then(response => {
          if (response.data.success) {
            this.userList = response.data.users
          }
        })
    }
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
        padding-left: 0px !important

        .v-icon
            color: red

    .plus__cost__box
        .input-box
            margin-bottom: 0px

        label
            font-size: 13px
            color: #5578EB

        .btn__plus
            width: 20px !important
            min-width: 20px !important
            height: 20px !important
            background-color: #5578EB !important
            border-radius: 4px !important
            margin: 0px !important
            margin-right: 8px !important
            margin-left: 2px !important

            i
                color: white !important
                font-size: 18px !important
</style>

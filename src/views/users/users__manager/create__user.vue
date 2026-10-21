<template>
  <v-dialog
    v-model="dialog"
    :fullscreen="$store.getters['params/mobileView']"
    persistent
    max-width="705px"
  >
    <template v-slot:activator="{ on }">
      <button
        v-show="$root.rbac.createManager"
        v-if="!currentUser.company_id"
        class="button button__yellow"
        @click="openDialog"
      >
        Створити менеджера
      </button>
    </template>
    <v-card>
      <v-card-title>
        <span v-if="!update" class="headline">Створення менеджера</span>
        <span v-else class="headline">Редагування менеджера</span>
        <v-spacer />
        <v-flex xs1 sm1>
          <v-btn flat icon color="" @click="cancel">
            <v-icon>close</v-icon>
          </v-btn>
        </v-flex>
      </v-card-title>
      <v-container
        v-disable-all="!$root.rbac.updateManager && update"
        grid-list-md
      >
        <v-layout wrap>
          <v-flex xs12 sm6 md6 class="input-box">
            <label>Email*</label>
            <input
              v-model="user.email"
              type="text"
              class="input-default"
              placeholder="Введіть email менеджера"
              :disabled="update"
              data-exclude="true"
            />
            <div class="error__box">
              <span>{{ errors.email }}</span>
            </div>
          </v-flex>
          <v-flex xs12 sm6 md6 class="input-box">
            <label>Телефон*</label>
            <div class="row w-100 m-0 p-0">
              <div class="mask__phone">+380</div>
              <input
                v-model="user.phone_number"
                type="text"
                class="input-default"
                placeholder="Номер сотового"
              />
            </div>
            <div class="error__box">
              <span>{{ errors.phone_number }}</span>
            </div>
          </v-flex>

          <v-flex xs12 sm6 class="input-box">
            <label>Ім'я*</label>
            <input
              v-model="user.first_name"
              type="text"
              class="input-default"
              placeholder="Повне ім'я менеджера"
            />
            <div class="error__box">
              <span>{{ errors.first_name }}</span>
            </div>
          </v-flex>
          <v-flex xs12 sm6 class="input-box">
            <label>Прізвище*</label>
            <input
              v-model="user.last_name"
              type="text"
              class="input-default"
              placeholder="Справжнє прізвище менеджера"
            />
            <div class="error__box">
              <span>{{ errors.last_name }}</span>
            </div>
          </v-flex>
          <v-flex xs12 sm12 class="input-box">
            <label>Роль*</label>
            <v-select
              v-model="user.role_name"
              hide-details
              solo
              :items="roles"
              :clearable="false"
              :searchable="false"
              item-text="description"
              item-value="name"
              :disabled="!$root.rbac.updateManager && update"
              label="Виберіть роль зі списку"
            />
            <div class="error__box">
              <span>{{ errors.role_name }}</span>
            </div>
          </v-flex>
          <v-flex xs12 sm6 class="input-box">
            <label>Пароль
              <template>
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <i class="vsm-icon icon-info" v-on="on"></i>
                  </template>
                  <span>Пароль повинен бути написаний латиницею, містити мінімум 8
                    символів, з яких обов'язково 1 заголовну букву і 1
                    цифру</span>
                </v-tooltip>
              </template>
            </label>
            <input
              v-model="user.password"
              type="text"
              class="input-default"
              placeholder="Придумайте пароль"
            />
            <div class="error__box">
              <span>{{ errors.password }}</span>
            </div>
          </v-flex>
          <v-flex xs12 sm6 class="input-box">
            <label>Підтвердження пароля*</label>
            <input
              v-model="user.repeatPassword"
              type="text"
              class="input-default"
              placeholder="Повторіть пароль"
            />
            <div class="error__box">
              <span>{{ errors.repeatPassword }}</span>
            </div>
          </v-flex>
          <v-flex v-if="!currentUser.company_id" xs12 sm12 class="">
            <div class="checkbox__custom">
              <v-checkbox
                v-model="user.all_company"
                :label="`Доступ до всіх підприємств`"
                :disabled="!$root.rbac.updateManager && update"
              />
              <template>
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <i class="vsm-icon icon-info" v-on="on"></i>
                  </template>
                  <span>Якщо стоїть данна опція, менеджер має доступ до всіх
                    існуючих підприємств</span>
                </v-tooltip>
              </template>
            </div>
            <div class="error__box">
              <span>{{ errors.all_company }}</span>
            </div>
          </v-flex>
          <v-flex
            v-if="!user.all_company && !currentUser.company_id"
            xs12
            sm12
            class="input-box"
          >
            <label>Підприємства*</label>
            <v-select
              v-model="user.companies"
              solo
              hide-details
              deletable-chips
              chips
              :items="company"
              item-text="full_name"
              item-value="id"
              multiple
              :clearable="false"
              :searchable="false"
              placeholder=""
              :disabled="!$root.rbac.updateManager && update"
            />
            <div class="error__box">
              <span>{{ errors.companies }}</span>
            </div>
          </v-flex>
          <author :update="update" :history="user.history" />
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
          @click="createUser"
        >
          Створити
        </button>
        <button
          v-else
          v-show="user.id != currentUser.id && $root.rbac.updateManager"
          class="button button__yellow"
          flat
          @click="updateUser"
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
  name: "CreateUser",
  props: ["user", "dialog", "update", "roles", "company"],
  data: () => ({
    date: new Date().toISOString().substr(0, 10),
    modal: false,
    errors: [],
    preventAction: false
  }),
  methods: {
    createUser() {
      if (this.preventAction) {
        return true
      }
      this.preventAction = true
      this.$api.post("managers/create", this.user).then(response => {
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
    updateUser() {
      if (this.preventAction) {
        return true
      }
      this.preventAction = true
      this.$api.post("managers/update", this.user).then(response => {
        this.preventAction = false
        var errors = []
        if (response.data.success) {
          this.cancel()
          this.$socket.emit("setPermissions", {})
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
  },
  computed: {
    ...mapGetters("user", ["currentUser"])
  }
}
</script>

<style scoped></style>

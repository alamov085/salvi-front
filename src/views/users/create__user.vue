<template>
    <v-dialog
            v-model="dialog"
            :fullscreen="$store.getters['params/mobileView']"
            persistent
            max-width="705px"
    >
        <template v-slot:activator="{ on }">
            <button
                    v-show="$root.rbac.createUser"
                    class="button button__yellow"
                    @click="openDialog"
            >
                Створити користувача
            </button>
            <v-snackbar
                    v-model="snack"
                    :timeout="3000"
                    color="#4caf50"
                    :bottom="true"
            >
                {{ snackText }}
                <v-btn flat @click="snack = false">
                    <v-icon>close</v-icon>
                </v-btn>
            </v-snackbar>
            <v-snackbar
                    v-model="errorSnack"
                    :timeout="3000"
                    color="#FF0000"
                    :bottom="true"
            >
                {{ errorSnackText }}
                <v-btn flat @click="errorSnack = false">
                    <v-icon>close</v-icon>
                </v-btn>
            </v-snackbar>
        </template>
        <v-card>
            <v-card-title>
                <span v-if="!update" class="headline">Створення користувача</span>
                <span v-else class="headline">Редагування користувача</span>
                <v-spacer/>
                <v-flex xs1 sm1>
                    <v-btn flat icon color="" @click="cancel">
                        <v-icon>close</v-icon>
                    </v-btn>
                </v-flex>
            </v-card-title>

            <v-container
                    v-disable-all="!$root.rbac.updateUser && update"
                    grid-list-md
            >
                <v-layout wrap>
                    <v-flex xs12 sm6 md6 class="input-box">
                        <label>Email*</label>
                        <input
                                v-model="user.email"
                                type="text"
                                class="input-default"
                                placeholder="Введіть email користувача"
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
                                    placeholder="Номер стільникового"
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
                                placeholder="Повне ім'я користувача"
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
                                placeholder="Справжнє прізвище користувача"
                        />
                        <div class="error__box">
                            <span>{{ errors.last_name }}</span>
                        </div>
                    </v-flex>
                    <v-flex xs12 sm6 class="input-box">
                        <label>Посада</label>
                        <input
                                v-model="user.position"
                                type="text"
                                class="input-default"
                                placeholder="Введіть посаду користувача"
                        />
                        <div class="error__box">
                            <span>{{ errors.position }}</span>
                        </div>
                    </v-flex>
                    <v-flex xs12 sm6 class="input-box">
                        <label>Роль</label>
                        <v-select
                                v-model="user.role_name"
                                solo
                                :items="roles"
                                hide-details
                                :clearable="false"
                                :searchable="false"
                                item-text="description"
                                item-value="name"
                                :disabled="!$root.rbac.updateUser && update"
                                label="Виберіть роль зі списку"
                        />
                        <div class="error__box">
                            <span>{{ errors.role_name }}</span>
                        </div>
                    </v-flex>
                    <v-flex xs12 sm6 class="input-box mb-5">
                        <label>Пароль*
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
                    <v-flex xs12 sm12 class="">
                        <div class="checkbox__custom">
                            <v-checkbox
                                    v-model="user.all_location"
                                    :label="`Доступ до всіх локацій`"
                                    @change="loadCostCenters"
                            />
                            <template>
                                <v-tooltip top>
                                    <template v-slot:activator="{ on }">
                                        <i class="vsm-icon icon-info" v-on="on"></i>
                                    </template>
                                    <span>Користувачу будуть доступні всі локації підприємства</span>
                                </v-tooltip>
                            </template>
                        </div>
                        <div class="error__box">
                            <span>{{ errors.all_location }}</span>
                        </div>
                    </v-flex>
                    <v-flex v-if="!user.all_location" xs12 sm12 class="input-box">
                        <label>Локації</label>
                        <v-select
                                v-model="user.locations"
                                solo
                                hide-details
                                deletable-chips
                                chips
                                :items="locations"
                                item-text="name"
                                item-value="id"
                                multiple
                                :clearable="false"
                                :searchable="false"
                                placeholder=""
                                :disabled="!$root.rbac.updateUser && update"
                                @change="loadCostCenters"
                        />
                        <div class="error__box">
                            <span>{{ errors.locations }}</span>
                        </div>
                    </v-flex>
                    <v-flex xs12 sm12 class="">
                        <div class="checkbox__custom">
                            <v-checkbox
                                    v-model="user.all_cost"
                                    :label="`Доступ до всіх кост-центрів`"
                            />
                            <template>
                                <v-tooltip top>
                                    <template v-slot:activator="{ on }">
                                        <i class="vsm-icon icon-info" v-on="on"></i>
                                    </template>
                                    <span>Користувачу будуть доступні всі кост-центри
                    підприємства</span>
                                </v-tooltip>
                            </template>
                        </div>
                        <div class="error__box">
                            <span>{{ errors.all_cost }}</span>
                        </div>
                    </v-flex>
                    <v-flex v-if="!user.all_cost" xs12 sm12 class="input-box">
                        <label>Кост-центр</label>
                        <v-select
                                v-model="user.cost_centers"
                                solo
                                hide-details
                                deletable-chips
                                chips
                                :items="costCenters"
                                multiple
                                :clearable="false"
                                :searchable="false"
                                :disabled="!$root.rbac.updateUser && update"
                                item-text="name"
                                item-value="id"
                                placeholder=""
                        />
                        <div class="error__box">
                            <span>{{ errors.cost_centers }}</span>
                        </div>
                    </v-flex>
                    <!--<v-flex xs12 sm12 class="">
                                  <div class="checkbox__custom">
                                      <v-checkbox v-model="user.isActive" :label="`Активен`"></v-checkbox>
                                      <template>
                                          <v-tooltip top>
                                              <template v-slot:activator="{ on }">
                                                  <i class="vsm-icon icon-info" v-on="on"></i>
                                              </template>
                                              <span>подсказка</span>
                                          </v-tooltip>
                                      </template>
                                  </div>
                              </v-flex>-->
                    <!-- <v-flex xs12 sm6 class="input-box">
                                   <label>Активен до</label>
                                   <v-dialog
                                          content-class="datepicker"
                                           ref="dialog"
                                           v-model="modal"
                                           :return-value.sync="date"
                                           persistent
                                           lazy
                                           full-width
                                           width="290px"
                                   >
                                       <template v-slot:activator="{ on }">
                                           <input type="text" class="input-default" placeholder="ДД/ММ/ГГГГ"
                                                  v-model="date"
                                                  prepend-icon="event"
                                                  readonly
                                                  v-on="on"
                                           >
                                       </template>
                                       <v-date-picker locale="ua" dark v-model="date" scrollable>
                                           <v-spacer></v-spacer>
                                           <v-btn flat color="primary" @click="modal = false">Cancel</v-btn>
                                           <v-btn flat color="primary" @click="$refs.dialog.save(date)">OK</v-btn>
                                       </v-date-picker>
                                   </v-dialog>
                               </v-flex>-->
                    <author :update="update" :history="user.history"/>
                </v-layout>
            </v-container>

            <v-card-actions>
                <v-spacer v-if="!update"/>
                <button v-if="update" class="button button__red" flat @click="sendNewPassword()">
                    Відіслати пароль
                </button>
                <button class="button button__blue" flat @click="cancel">
                    Скасувати
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
                        v-show="user.id != currentUser.id"
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
    import {mapGetters} from "vuex"

    export default {
        name: "CreateUser",
        props: ["user", "dialog", "update", "roles", "locations"],
        data: () => ({
            date: new Date().toISOString().substr(0, 10),
            modal: false,
            costCenters: [],
            errors: [],
            snack: false,
            snackText: "",
            errorSnack: false,
            errorSnackText: "",
            preventAction: false
        }),
        watch: {
            dialog() {
                this.loadCostCenters()
            }
        },
        methods: {
            createUser() {
                if (this.preventAction) {
                    return true
                }
                this.preventAction = true
                this.$api.post("users/create-user", this.user).then(response => {
                    this.preventAction = false
                    let errors = []
                    if (response.data.success) {
                        this.cancel()
                        this.snack = true
                        this.snackText = "Користувача створено"
                    } else {
                        response.data.errors.forEach(function (value) {
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
                this.$api.post("users/update-user", this.user).then(response => {
                    this.preventAction = false
                    let errors = []
                    if (response.data.success) {
                        this.cancel()
                        this.snack = true
                        this.snackText = "Користувача оновлено"
                        this.$socket.emit("setPermissions", {})
                    } else {
                        response.data.errors.forEach(function (value) {
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
            },
            loadCostCenters() {
                let url = "/cost-centers/get-list-by-location"
                let list = []
                if (!this.user.all_location) {
                    list = this.user.locations
                } else {
                    // eslint-disable-next-line no-unused-vars
                    list = this.locations.map((name, index) => {
                        return name["id"]
                    })
                }
                this.$api.post(url, {location: list}).then(response => {
                    this.costCenters = response.data.data
                })
            },
            sendNewPassword() {
                if (this.preventAction) {
                    return true
                }
                this.preventAction = true
                this.$api.post("users/generate-password", this.user).then(response => {
                    this.preventAction = false
                    let errors = []
                    if (response.data.success) {
                        this.cancel()
                        this.snack = true
                        this.snackText = "Новий пароль відіслано користувачу"
                    } else {
                        this.errorSnack = true
                        this.errorSnackText = response.data.errorMessage
                        // response.data.errors.forEach(function (value) {
                        //     errors[value.field] = value.message
                        // })
                        // this.errors = errors
                    }
                })
            }
        },
        computed: {
            ...mapGetters("user", ["currentUser"])
        }
    }
</script>

<style scoped></style>

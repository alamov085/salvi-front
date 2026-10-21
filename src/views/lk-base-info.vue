<template lang="pug">
    .section__content
        .caption Основна інформація
        v-snackbar(
            v-model="alert"
            dismissible
            type="success"
            :top="false"
            :bottom="true"
            :left="false"
            color='#4caf50'
            :multi-line="true"
            :right="false"
            :timeout="6000"

            :vertical="false" ) Інформація оновлена
            v-btn(
                color="pink"
                flat
                icon
                @click="alert = false")
                v-icon close
        form.base__info
            .p-0.m-0
                .base__info__col
                    .base__info__col__row
                        .input-box
                            label Ім'я
                            input.input-default(type='' placeholder='Ваше повне ім\'я' v-model="user.first_name")
                            .error__box
                                span {{errors.first_name}}
                        .input-box
                            label Прізвище
                            input.input-default(type='' placeholder='Ваша фамилия' v-model="user.last_name")
                            .error__box
                                span {{errors.last_name}}
                    .base__info__col__row
                        .input-box
                            label Мобільний телефон
                            .row.col-12.m-0.p-0
                                .mask__phone +380
                                input.input-default(type='' placeholder='Номер стільникового' v-model="user.phone_number")
                            .error__box
                                span {{errors.phone_number}}
                        .input-box
                            label Email
                            .row.col-12.m-0.p-0
                                input.input-default(type='' placeholder='Ваш e-mail' v-model="user.email")
                            .error__box
                                span {{errors.email}}
                    .base__info__col__row
                        .input-box
                            label Пароль
                            .flex-column.col-12.p-0
                                input.input-default(type='password' placeholder='********' v-model="user.password" v-on:keyup="validatePassword")
                                .hint__password
                                    span Складність пароля:
                                        b(:style="{color: user.password_difficult === '1' ? '#F24949' :  user.password_difficult == 2 ? '#FCBD00' :  user.password_difficult === 3 ? '#19B200' : '#F24949' }") {{user.password_difficult == false ? 'мінімум 8 символів, одна заголовна буква i одна цифра' : user.password_difficult === 1 ? 'Низька' : user.password_difficult === 2 ? 'Средня' : user.password_difficult === 3 ? 'Висока' :  "мінімум 8 символів і 1 заголовна літера" }}
                        .input-box
                            label Повторіть пароль
                            .flex-column.col-12.p-0
                                input.input-default(type='password' placeholder='********' v-model="user.repeatPassword")
                                .error__box
                                    span(style='color: red') {{errors.repeatPassword}}
                    .base__info__col__row
                        .input-box
                            label Посада
                            input.input-default(placeholder="Выбранная должность" :disabled="!this.$root.rbac.updateProfileAddFields"  v-model="user.position" )
                        .input-box
                            label Валюта
                            v-select(solo hide-details disabled append-icon='keyboard_arrow_down' item-text='name' item-value='id' :items="currency" label="Валюта" v-model="user.currency_id" )
                            .error__box
                                span(style='color: red') {{errors.currency_id}}
                    .base__info__col__row(v-show="!user.manager")
                        .input-box
                            label Локації
                            v-select(solo hide-details v-on:change="loadCostCenters" chips :multiple="true" deletable-chips :disabled="!this.$root.rbac.updateProfileAddFields" append-icon='keyboard_arrow_down' label="Обрані локації" v-model="user.locations" item-text='name' item-value='id' :items="location")
                        .input-box
                            label Кост-центр
                            v-select(solo hide-details :disabled="!this.$root.rbac.updateProfileAddFields" label='Кост-центр' deletable-chips v-model='user.cost_center' append-icon='keyboard_arrow_down' item-text='name' item-value='id' :items="cost_center" chips :multiple="true"  )


                    .base__info__col__row
                        .input-box.checkbox-container
                            .row.col-12.m-0.p-0
                                v-checkbox( v-model="user.is_sending_mail" :label="`Не відправляти повідомлення від сайту на пошту`")
                            .error__box
                                span {{errors.is_sending_mail}}




                button.button.button__yellow(@click="handleSubmit" v-show="showButton") Зберегти


</template>

<script>
    import { mapActions } from "vuex"

    export default {
        name: "LkIndex",
        data() {
            return {
                user: {
                    first_name: "",
                    last_name: "",
                    phone_number: "",
                    email: "",
                    position: "",
                    password: "",
                    repeatPassword: "",
                    currency_id: "",
                    location_id: "",
                    password_difficult: "",
                    cost_center: [],
                    is_sending_mail: 0,
                },
                errors: [],
                location: [],
                currency: [],
                cost_center: [],
                options: [],
                alert: false,
                showButton: false,
                loading: false
            }
        },
        watch: {
            user: {
                handler() {
                    this.showButton = true
                    // console.log('watch')
                },
                deep: true
            },
            loading(e) {
                this.showButton = false
                this.$loadingBus.$emit("loading", e)
            }
        },
        mounted() {
            this.loading = true
            this.$api.get("/account/index").then(response => {
                const resUser = response.data.user
                resUser.is_sending_mail = resUser.is_sending_mail ? 0 : 1
                this.user = resUser
                this.currency = response.data.currency
                this.position = response.data.position
                this.location = response.data.location
                this.cost_center = response.data.cost_center
                if (!this.user.first_name) {
                    this.errors.first_name = 'Необхідно заповнити "Ім\'я".'
                }
                if (!this.user.last_name) {
                    this.errors.last_name = 'Необхідно заповнити "Прізвище".'
                }
                if (!this.user.phone_number) {
                    this.errors.phone_number = 'Необхідно заповнити "Мобільний телефон".'
                }
                this.loading = false
            })
        },
        methods: {
            handleSubmit(e) {
                e.preventDefault()
                const data = { ...this.user }
                data.is_sending_mail = data.is_sending_mail ? 0 : 1
                this.$api.post("/account/update", data).then(response => {
                    this.errors = [];
                    if (response.data.success === true) {
                        if(response.data.emailChanged === true) {
                            this.$router.push({name: 'logout'});
                        }

                        const resUser = response.data.user
                        resUser.is_sending_mail = resUser.is_sending_mail ? 0 : 1;
                        this.user = resUser;
                        this.alert = true;
                        this.setData({ ctx: JSON.stringify(response.data.user) });

                        setTimeout(() => {
                            this.showButton = false
                        }, 100)
                    } else {
                        let errors = [];
                        response.data.errors.forEach(function(value) {
                            errors[value.field] = value.message
                        });
                        this.errors = errors
                    }
                })
            },
            validatePassword() {
                this.$api
                    .post("/public/password-difficult", { password: this.user.password })
                    .then(response => {
                        if (response.data.success) {
                            this.user.password_difficult = response.data.password_difficult
                        }
                    })
            },
            loadCostCenters() {
                let url = "/cost-centers/get-list-by-location"
                this.$api.post(url, { location: this.user.locations }).then(response => {
                    this.cost_center = response.data.data
                })
            },
            ...mapActions("user", ["setData"])
        }
    }
</script>

<style lang="sass">
    .checkbox-container .v-input__slot
        border: none !important
</style>

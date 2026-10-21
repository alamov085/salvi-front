<template lang="pug">
    div
        v-snackbar(
            v-model="alert"
            dismissible
            type="success"
            :top="false"
            :bottom="true"
            :left="false"
            color='#4caf50'
            :multi-line="false"
            :right="false"
            :timeout="3000"
            :vertical="false" ) Новий пароль збережено
        .section__wrap--form
            form.section__form( @submit.prevent="submitHandler" v-if="validUrl")
                .caption Відновлення паролю
                .input-box
                    label Пароль
                    input.input-default(type='password' placeholder='Ваш новий пароль' v-model='password')
                    .error__box
                        span {{errors.password}}
                .input-box
                    label Повторіть пароль
                    input.input-default(type='password' placeholder='Повторіть ваш новий пароль' v-model='repeatPassword')
                    .error__box
                        span {{errors.repeatPassword}}
                button.button.button__yellow Зберегти пароль
                .account__hint
                    span Немає облікового запису?
                        router-link(to="/")  Створіть його тут.
            div.section__form(v-else)
                div {{message}}
</template>

<script>
import { mapActions } from "vuex"
import { TokenService } from "./../services/storage.service"

export default {
  name: "ResetPassword",
  data: () => ({
    password: "",
    repeatPassword: "",
    errors: [],
    message: "",
    validUrl: true,
    alert: false
  }),
  methods: {
    ...mapActions("user", ["setData"]),
    submitHandler() {
      this.$api
        .post(this.generateUrl(), {
          password: this.password,
          repeatPassword: this.repeatPassword
        })
        .then(response => {
          var errors = []
          if (response.data.success) {
            // TokenService.saveToken(response.data.access_token);
            // this.$permission.setPermissions(response.data.permissions);
            // this.setData({ctx:JSON.stringify(response.data.user)});
            // localStorage.setItem('current_chat', JSON.stringify(response.data.current_chat));
            this.alert = true
            setTimeout(function() {
              window.location.href = "/lk-index"
            }, 3000)
          } else {
            response.data.errors.forEach(function(value) {
              errors[value.field] = value.message
            })
          }
          this.errors = errors
        })
    },
    generateUrl() {
      var url = ""
      if (this.$route.query.token != undefined) {
        url = "?token=" + this.$route.query.token
      }
      var fullUrl = "auth/reset-password" + url
      return fullUrl
    }
  },
  created() {
    this.$api
      .post(this.generateUrl(), {
        password: this.password,
        repeatPassword: this.repeatPassword
      })
      .then(response => {
        if (!response.data.success) {
          if (response.data.errors == undefined) {
            this.validUrl = false
            this.message = response.data.message
          }
        }
      })
  }
}
</script>

<style scoped></style>

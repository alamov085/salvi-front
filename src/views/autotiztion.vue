<template lang="pug">
    .section__wrap--form
        form.section__form( @submit.prevent="submitHandler")
            .caption Авторизація
            .input-box
                label Email
                input.input-default(

                    placeholder='Введіть ваш email'
                    v-model.trim='email'
                    :class="{invalid: ($v.email.$dirty && !$v.email.required) }"
                    )
                .error__box
                    span(v-if='$v.email.$dirty && !$v.email.required') Поле Email не повинно бути порожнім
                    //span(v-else-if='$v.email.$dirty && !$v.email.email') Введіть коректний Email
                    span(v-else-if='("username" in this.errors)') Введіть коректний Email

            .input-box
                label Пароль
                input.input-default(
                    type='password'
                    placeholder='Введіть пароль'
                    v-model.trim='password'
                    :class="{invalid: ($v.password.$dirty && !$v.password.required) || ($v.password.$dirty && !$v.password.minLength) }"
                    )
                .error__box
                    span(v-if='$v.password.$dirty && !$v.password.required') Введіть пароль
                    span(v-else-if='$v.password.$dirty && !$v.password.minLength') Пароль повинен бути {{$v.password.$params.minLength.min}} символів. Зараз він {{password.length}}
                    span(v-else-if='("password" in this.errors)') {{this.errors.password}}
            vue-recaptcha(ref="recaptcha" size="invisible" :sitekey="sitekey" @verify="register" @expired="onCaptchaExpired")
            button.button.button__yellow( type="submit") Увійти
            .account__hint
                span Немає облікового запису ?
                    a.form-open(@click="openForm")  Створіть його тут.
                router-link(to="/recovery-password") Забули пароль ?


</template>
<script>
// eslint-disable-next-line no-unused-vars
import { email, required, minLength } from "vuelidate/lib/validators"
import { mapGetters, mapActions } from "vuex"
import VueRecaptcha from "vue-recaptcha"
export default {
  name: "Autotiztion",
  components: { VueRecaptcha },
  data: () => ({
    email: "",
    password: "",
    errors: [],
    sitekey: process.env.VUE_APP_RECAPTCHA_KEY
  }),
  validations: {
    email: { required },
    password: { required, minLength: minLength(8) }
  },
  created() {
    const $script = document.createElement("script")
    $script.async = true
    $script.src =
      "https://www.google.com/recaptcha/api.js?onload=vueRecaptchaApiLoaded&render=explicit"
    document.head.appendChild($script)
    this.$emit("oneButton", { name: "Залишити заявку", link: "/registration" })
  },

  computed: {
    ...mapGetters("auth", [
      "token",
      "authenticating",
      "authenticationError",
      "authenticationErrorCode"
    ])
  },
  methods: {
    async submitHandler() {
      if (this.$v.$invalid) {
        this.$v.$touch()

        return
      }
      this.validate()
    },
    ...mapActions("auth", ["login"]),
    validate() {
      this.$refs.recaptcha.execute()
    },
    onCaptchaExpired() {
      this.$refs.recaptcha.reset()
    },
      openForm() {
          document.querySelector('.b24-web-form-popup-btn-1').click();
      },
    async register(recaptchaToken) {
      // this.login({email: this.email, password: this.password, });
      // this.password = "";
      const formData = {
        email: this.email,
        password: this.password,
        recaptcha: recaptchaToken
      }
      var authLogin = await this.login(formData)
      if (authLogin) {
        // this.$router.push({ name: 'lk-index', query: { redirect: '/lk-index' } });
        // this.$router.push('/lk-index')
        // console.log(this.$router.history.current.query.redirect)
        window.location.href = this.$router.history.current.query.redirect
      } else {
        return false
      }
    }
  },
  watch: {
    authenticationError(e) {
      this.errors = []
      if (e.length > 0) {
        var errors = []
        e.forEach(function(value) {
          errors[value.field] = value.message
        })
        this.errors = errors
      }
      this.$refs.recaptcha.reset()
    }
  }
}
</script>

<style scoped>
    .form-open {
        cursor: pointer;
    }
</style>

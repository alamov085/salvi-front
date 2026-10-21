<template lang="pug">
    div
        .section__wrap--form
            form.section__form
                .caption Створення заявки на реєстрацію аккаунта підприємства
                .input-box
                    label Форма діяльності
                    v-select( solo :items="activity" item-text='label' item-value='id' label='Вибрати форму діяльності' append-icon='keyboard_arrow_down' :clearable="false" :searchable="false"  v-model="user.type")
                    .error__box
                        span {{errors.type}}
                transition(name="opacity")
                    .user__1( v-if="user.type == '1'")
                        .input-box
                            label Email
                              i.red--text *
                            input.input-default(type='email' required placeholder='Введіть ваш email' v-model="user.email")
                            .error__box
                                span {{errors.email}}
                        .input-box
                            label Прізвище
                              i.red--text *
                            input.input-default(type='text' required placeholder='Введіть ваше прізвище' v-model="user.lastName")
                            .error__box
                                span {{errors.lastName}}
                        .input-box
                            label Ім'я
                              i.red--text *
                            input.input-default(type='text' required placeholder="Введіть ваше ім'я" v-model="user.firstName")
                            .error__box
                                span {{errors.firstName}}
                        .input-box
                            label Мобільний телефон
                              i.red--text *
                            .row.col-12.m-0.p-0
                                .mask__phone +380
                                input.input-default(type='' placeholder='Номер мобільного' v-model="user.phone")
                            .error__box
                                span {{errors.phone}}
                transition(name="opacity2")
                    .user__2( v-if="user.type == '2'")
                        .input-box
                            label Email
                              i.red--text *
                            input.input-default(type='email' required placeholder='Введіть ваш email' v-model="user.email")
                            .error__box
                                span {{errors.email}}
                        .input-box
                            label Назва компанії
                            input.input-default(type='text' required placeholder='Введіть скорочену назву' v-model="user.shortName")
                            .error__box
                                span {{errors.shortName}}
                        .input-box
                            label Мобільний телефон
                              i.red--text *
                            .row.col-12.m-0.p-0
                                .mask__phone +380
                                input.input-default(type='' placeholder='Номер мобільного' v-model="user.phone")
                            .error__box
                                span {{errors.phone}}
                .success__box( v-if="user.type == '1' || user.type == '2'")
                    .checkbox__custom
                        input#null_stroke(type="checkbox" v-model="user.rules")
                        label(for="null_stroke" v-if='demo') Я соглашаюсь с
                            a(href="#") Пользовательским соглашением
                            b  и
                            a Политикой конфиденциальности
                    .error__box
                        span {{errors.rules}}
                    vue-recaptcha(ref="recaptcha" size="invisible" :sitekey="sitekey" @verify="register" @expired="onCaptchaExpired")
                    button.button.button__yellow(@click="handleSubmit") Підтвердити
                    .account__hint(v-if='demo')
                        span Уже есть аккаунт ? ?
                            router-link(to="/autorization")   Войдите тут.
                        span Все поля обязательны к заполнению
</template>

<script>
import VueRecaptcha from "vue-recaptcha"
export default {
  name: "Registration",
  components: { VueRecaptcha },
  data() {
    return {
      demo: false,
      alert: false,
      activity: [
        {
          id: 1,
          label: "Фізична особа"
        },
        {
          id: 2,
          label: "Юридична особа"
        }
      ],
      errors: [],
      user: {
        type: null,
        email: null,
        firstName: null,
        lastName: null,
        phone: null,
        inn: null,
        rules: true,
        edrpou: null,
        fullName: null,
        shortName: null
      },
      sitekey: process.env.VUE_APP_RECAPTCHA_KEY
    }
  },
  created() {
    const $script = document.createElement("script")
    $script.async = true
    $script.src =
      "https://www.google.com/recaptcha/api.js?onload=vueRecaptchaApiLoaded&render=explicit"
    document.head.appendChild($script)
    this.$emit("oneButton", { name: "Увійти", link: "/login" })
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault()
      this.validate()
    },
    register(recaptchaToken) {
      this.user.recaptchaToken = recaptchaToken
      this.$api
        .post("/auth/register?type=" + this.user.type, this.user)
        .then(response => {
          this.errors = []
          if (response.data.success) {
            this.$loadingBus.$emit("snackbar", {
              title: "Заявка на реєстрацію прийнята. Очікуйте підтвердження",
              color: "#4caf50"
            })
            this.alert = true
            this.user = {
              type: null,
              email: null,
              firstName: null,
              lastName: null,
              phone: null,
              inn: null,
              rules: true,
              edrpou: null,
              fullName: null,
              shortName: null
            }
            this.$router.push("/")
          } else {
            var errors = []
            response.data.errors.forEach(function(value) {
              errors[value.field] = value.message
            })
            this.errors = errors
            this.onCaptchaExpired()
          }
        })
    },
    validate() {
      this.$refs.recaptcha.execute()
    },
    onCaptchaExpired() {
      this.$refs.recaptcha.reset()
    }
  }
}
</script>

<style scoped>
.input-box label i.red--text {
  margin-left: 3px;
}
.opacity-enter-active,
.opacity-leave-active,
.opacity-move {
  transition: 600ms;
  transition-property: opacity, transform;
}

.opacity-enter {
  transition: 100ms;
  opacity: 0;
  transform: translateX(-400px);
}

.opacity-enter-to {
  opacity: 1;
  transition: 0.5s;
  transform: translateX(0);
}

.opacity-leave-active {
  position: absolute;
}

.opacity-leave-to {
  opacity: 0;
  transform: translateX(400px);
  transform-origin: center top;
}

/*=====================================================================*/

.opacity2-enter-active,
.opacity2-leave-active,
.opacity2-move {
  transition: 600ms;
  transition-property: opacity, transform;
}

.opacity2-enter {
  transition: 100ms;
  opacity: 0;
  transform: translateX(-400px);
}

.opacity2-enter-to {
  opacity: 1;
  transition: 0.5s;
  transform: translateX(0);
}

.opacity2-leave-active {
  position: absolute;

  transform-origin: top;
}

.opacity2-leave-to {
  opacity: 0;
  position: absolute;
  transform-origin: center top;
  height: 0px;
  transform: translateX(0px);
}
</style>

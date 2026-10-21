<template lang="pug">
            .section__wrap--form
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
                    :timeout="6000"
                    :vertical="false" ) Інструкції з відновлення паролю відправлені на почту.
                form.section__form( @submit.prevent="submitHandler")
                    .caption Відновлення паролю
                    .input-box
                        label Email
                        input.input-default(type='' placeholder='Ваш Email' v-model='email')
                        .error__box
                            span {{errors.email}}
                    button.button.button__yellow Надіслати посилання
                    .account__hint
                        span Немає облікового запису?
                            a(href='#' @click='openForm')  Створіть його тут.
</template>

<script>
export default {
  name: "RecoveryPassword",
  data: () => ({
    email: "",
    errors: [],
    alert: false
  }),
  methods: {
    submitHandler() {
      this.$api
        .post("auth/recovery-password", {
          email: this.email
        })
        .then(response => {
          if (response.data.success) {
            var errors = []
            this.alert = true
          } else {
            // eslint-disable-next-line no-redeclare
            var errors = []
            response.data.errors.forEach(function(value) {
              errors[value.field] = value.message
            })
          }
          this.errors = errors
        })
    },
      openForm() {
          document.querySelector('.b24-web-form-popup-btn-1').click();
      }
  }
}
</script>

<style scoped></style>

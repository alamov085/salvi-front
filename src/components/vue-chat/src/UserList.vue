<template>
  <form class="user-list">
    <div class="input-box">
      <label>Введіть своє ім'я</label>
      <input
        v-model="model.name"
        type="text"
        class="input-default"
        placeholder="Підказка поля введення"
      />
      <div class="error__box">
        <span>{{ validationError.name }}</span>
      </div>
    </div>
    <div class="input-box">
      <label>Вашу електронну адресу</label>
      <input
        v-model="model.email"
        type="text"
        class="input-default"
        placeholder="Введіть email"
      />
      <div class="error__box">
        <span>{{ validationError.email }}</span>
      </div>
    </div>
    <div class="input-box">
      <label data-v-01b89153="">Мобільний телефон</label>
      <div class="row w-100 m-0 p-0">
        <div class="mask__phone">+380</div>
        <input
          v-model="model.phone"
          type=""
          placeholder="Номер мобільного"
          class="input-default"
        />
      </div>
      <div class="error__box">
        <span>{{ validationError.phone }}</span>
      </div>
    </div>
    <div class="input-box">
      <label>Ваше повідомлення</label>
      <textarea
        v-model="model.message"
        class="input-default"
        type="text"
        placeholder="Повідомлення адміністратору"
      ></textarea>
      <div class="error__box">
        <span>{{ validationError.message }}</span>
      </div>
    </div>
    <button
      class="button button__yellow"
      @click.prevent="firstGuestMessage(model)"
    >
      Надіслати
    </button>
  </form>
</template>
<script>
export default {
  props: {
    participants: {
      type: Array,
      required: true
    },
    firstGuestMessage: {
      type: Function,
      required: true
    },
    validationError: {
      type: Array,
      required: true
    }
  },
  data: () => ({
    model: {
      name: "",
      email: "",
      phone: ""
    },
    valid: false,
    firstname: "",
    lastname: "",
    nameRules: [
      v => !!v || "Name is required",
      v => v.length <= 10 || "Name must be less than 10 characters"
    ],
    email: "",
    emailRules: [
      v => !!v || "E-mail is required",
      v => /.+@.+/.test(v) || "E-mail must be valid"
    ]
  })
}
</script>
<style scoped></style>

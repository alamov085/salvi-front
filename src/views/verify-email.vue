<template>
  <div></div>
</template>

<script>
import { mapActions } from "vuex"

export default {
  name: "VerifyEmail",
  methods: {
    ...mapActions("auth", ["loginByToken"])
  },
  created() {
    this.loginByToken({ userToken: this.$route.query.token })
  }
}
</script>

<style scoped></style>

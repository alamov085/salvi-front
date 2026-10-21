<template>
  <div></div>
</template>

<script>
export default {
  name: "Logout",
  data() {
    return {
      loading: true
    }
  },
  mounted() {
    localStorage.clear()
    window.location.href = "/"
  }
}
</script>

<style lang="sass"></style>

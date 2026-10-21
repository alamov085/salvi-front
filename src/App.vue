<template lang="pug">
    #app
        component(:is="layout")
            router-view
</template>

<script>
import MainLayout from "@/layouts/MainLayout.vue"
import AuthLayout from "@/layouts/AuthLayout.vue"
import { mapGetters } from "vuex"

export default {
  name: "App",
  computed: {
    ...mapGetters("user", ["currentUser"]),
    layout() {
      let l = ""
      if (this.$route.meta.layout == undefined) {
        this.$nextTick(function() {
          l = (this.$route.meta.layout || "auth") + "-layout"
        })
      } else {
        l = (this.$route.meta.layout || "auth") + "-layout"
      }
      return l
    }
  },
  components: {
    MainLayout,
    AuthLayout
  },
  updated() {
    // console.log(this.$router.options.routes)
    // console.log(this.currentUser.company_id)
  },
  methods: {}
}
</script>


<style lang="sass">
@import "style-global/base/_index"
@import "style-global/blocks/_index"
</style>

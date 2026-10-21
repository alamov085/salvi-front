<template>
  <header data-app>
    <div class="menu__mobile">
      <template>
        <v-layout wrap>
          <v-layout justify-center>
            <v-btn color="pink" dark icon @click.stop="navMenu">
              <v-icon>menu</v-icon>
            </v-btn>
          </v-layout>

          <v-navigation-drawer v-model="drawer" absolute temporary dark>
            <div class="mobile__header__nav">
              <v-btn flat icon @click.stop="navMenu">
                <v-icon>close</v-icon>
              </v-btn>
              <router-link to="/" class="logo">
                <img src="..//img/index__page/Salvi-head.png" alt="" />
              </router-link>
              <router-link to="/" class="autorization__link">
                <v-icon color="#fff">person</v-icon>
              </router-link>
            </div>
            <v-divider />
            <div class="nav-mobile">
              <div class="nav-mobile__head">
                <router-link class="nav-mobile__link" to="/">
                  Головна
                </router-link>
                <router-link class="nav-mobile__link" to="/">
                  Salvi assistant
                </router-link>
                <router-link class="nav-mobile__link" to="/">
                  Про нас
                </router-link>
              </div>
              <router-link
                class="button button__green naw-mobile__link"
                to="/registration"
              >
                Залишити заявку
              </router-link>
            </div>
          </v-navigation-drawer>
        </v-layout>
      </template>
    </div>
    <router-link to="/" class="logo">
      <img src="..//img/index__page/Salvi-head.png" alt="" />
    </router-link>
    <v-spacer />
    <div class="nav">
      <router-link v-if="demo" to="/">Головна</router-link>
      <router-link v-if="demo" to="/catalog">Salvi assistant</router-link>
      <router-link v-if="demo" to="/">Про нас</router-link>
      <!--<router-link class="button__login" to="/autotiztion">Увійти</router-link>-->
      <router-link class="button__login" :to="button.link">{{
        button.name
      }}</router-link>
    </div>
    <router-link class="btn-profile" :to="button.link"><v-icon color="#fff">person</v-icon></router-link>
  </header>
</template>

<script>
export default {
  name: "Header",
  props: {
    button: {
      type: Object,
      default: () => ({
        name: "Залишити заявку",
        link: "/registration"
      })
    }
  },
  data() {
    return {
      drawer: null,
      demo: false
    }
  },
  methods: {
    navMenu() {
      this.drawer = !this.drawer
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>

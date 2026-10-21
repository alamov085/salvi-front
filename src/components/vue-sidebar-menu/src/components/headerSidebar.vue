<template>
  <div>
    <button
      v-if="
        $root.rbac.viewCatalog &&
          $store.getters['user/currentUser'].company_id !== 0
      "
      class="button__category"
      @click="openCategory"
    >
      Каталог Товарів
      <v-icon>folder</v-icon>
    </button>
    <settingCompany
      class="settingCompany__mobile"
      :notification="notification"
    />
    <div class="head">
      <transition name="logo">
        <a href="/catalog/" v-if="!isCollapsed" class="logo">
          <svg width="111" height="26" viewBox="0 0 111 26" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M10.8388 26C8.70977 26 6.70977 25.7419 4.70977 25.2258C2.77428 24.7097 1.16138 24 8.78649e-05 23.0968L2.0646 18.7097C3.22589 19.4839 4.58073 20.129 6.12912 20.5807C7.67751 21.0323 9.29042 21.2903 10.8388 21.2903C12.5807 21.2903 13.8711 21.0323 14.7098 20.5807C15.5485 20.0645 15.9356 19.4194 15.9356 18.5807C15.9356 18 15.6775 17.4839 15.1614 17.0968C14.7098 16.7097 14.0646 16.3871 13.2904 16.129C12.5162 15.871 11.484 15.6129 10.1936 15.3548C8.19364 14.9032 6.51622 14.4516 5.2259 14C3.93558 13.5484 2.8388 12.8387 1.87105 11.8065C0.967828 10.7742 0.516219 9.48388 0.516219 7.80646C0.516219 6.32259 0.903314 5.03226 1.74202 3.87097C2.58073 2.64517 3.80654 1.74194 5.48396 1.03226C7.16138 0.322585 9.2259 4.25901e-06 11.6775 4.36618e-06C13.3549 4.4395e-06 15.0324 0.193553 16.6453 0.58065C18.2582 0.967747 19.6775 1.48388 20.9033 2.19355L19.0324 6.58065C16.5807 5.29033 14.1291 4.64517 11.6775 4.64517C9.93558 4.64517 8.70977 4.90323 7.87106 5.41936C7.03235 5.93549 6.64525 6.64517 6.64525 7.48388C6.64525 8.32259 7.09686 8.96775 8.06461 9.41936C9.03235 9.80646 10.4517 10.2581 12.4517 10.6452C14.4517 11.0968 16.1291 11.5484 17.4194 12C18.7098 12.4516 19.8065 13.1613 20.7098 14.129C21.6775 15.0968 22.1291 16.4516 22.1291 18.129C22.1291 19.5484 21.6775 20.9032 20.8388 22.0645C20.0001 23.2258 18.7098 24.1936 17.0323 24.8387C15.2904 25.6774 13.2259 26 10.8388 26Z" fill="#fff"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M43.8061 20.1926L31.4835 20.1926L29.1609 25.5475L22.8384 25.5475L34.5803 0.450688L40.6448 0.450688L52.5803 25.5475L46.1287 25.5475L43.8061 20.1926ZM41.8706 15.741L37.6771 6.12811L33.4835 15.741L41.8706 15.741Z" fill="#fff"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M55.3542 0.450688L61.4833 0.450688L61.4833 20.7733L74.8381 20.7733L74.8381 25.483L55.3542 25.5475L55.3542 0.450688Z" fill="#fff"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M101.936 0.387212L90.4519 25.484L84.3874 25.484L72.9035 0.387211L79.5487 0.387211L87.6132 18.3227L95.8067 0.387212L101.936 0.387212Z" fill="#fff"/>
            <path d="M110.338 25.4796L110.307 0.382817L104.178 0.39047L104.209 25.4873L110.338 25.4796Z" fill="#fff"/>
          </svg>
        </a>
      </transition>
      <transition name="logo-btn">
        <v-btn v-if="!hoverMenu" icon flat @click.prevent="$emit('onFull')">
          <i class="line__menu"></i>
          <i class="line__menu"></i>
          <i class="line__menu"></i>
          <i class="line__menu"></i>
          <i class="line__menu"></i>
          <i class="material-icons close__menu__icon">arrow_back</i>
          <i class="material-icons close__menu__icon close__menu__icon__mobile">
            close
          </i>
        </v-btn>
      </transition>
    </div>
    <search />
  </div>
</template>

<script>
import search from "@/components/search-LK.vue"
import settingCompany from "@/components/setting-company.vue"
import { mapActions } from "vuex"
export default {
  name: "HeaderSidebar",
  components: {
    search,
    settingCompany
  },
  props: {
    isCollapsed: {
      type: Boolean
    },
    notification: {
      type: Boolean
    },
    hoverMenu: {
      type: Boolean
    }
  },
  methods: {
    ...mapActions("params", ["setCollaps"]),
    openCategory() {
      this.setCollaps({
        ctx: false
      })
      this.$store.dispatch("category/setModalCategory", { ctx: true })
    }
  }
}
</script>

<style>
.logo-enter-active,
.logo-leave-active,
.logo-move {
  transition: 0.3s linear;
  transition-property: opacity, transform;
}

.logo-enter {
  transition: 0.3s;
  opacity: 0;
}

.logo-enter-to {
  opacity: 1;
  transition: 0.3s linear;
}

.logo-leave-active {
}

.logo-leave-to {
  opacity: 0;
  width: 0px;
  transform-origin: center top;
}

.logo-btn-enter-active,
.logo-btn-leave-active,
.logo-btn-move {
  transition: 1s linear !important;
  transition-property: opacity, transform;
}

.logo-btn-enter {
  transition: 1s !important;
  opacity: 0;
}

.logo-btn-enter-to {
  opacity: 1;
  transition: 1s linear !important;
}

.logo-btn-leave-active {
  transition: 0.3s !important;
  opacity: 0;
}

.logo-btn-leave-to {
  opacity: 0;
  transition: 0s !important;
  transform-origin: center top;
}
</style>

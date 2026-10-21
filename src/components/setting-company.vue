<template>
  <div
    class="setting__company"
    @mouseover="noHideMouse"
    @mouseleave="hideMouse(2000)"
  >
    <div class="setting__company__head">
      <div class="setting__company__user">
        <div class="info__box">
          <div class="info__box__head">
            <span class="info__box__name">{{ name }}</span>
          </div>
          <div class="info__box__setting" @click="openCompanyModal">
            <span class="info__box__email info__box__company">
              {{ model.company_id ? model.company_name : "Не обрано" }}
            </span>
            <v-icon
              v-if="currentUser.manager == 1"
              class="setting__company__trigger "
              :class="{ open: openCompany }"
            >
              arrow_drop_down
            </v-icon>
          </div>
        </div>
        <div class="iconBox">
          <div v-show="$route.name !== 'order-create'" class="basket">
              <div
                class="basket__icon svg-container"
                :class="{
                plus: countProduct,
                pulse:
                  (cardProduct.length && !basketModal) ||
                  (newBasketProduct.length && !basketModal)
              }"
                      @click="basketModalFunc"
                    >
                      <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2 14V2H1C0.447715 2 0 1.55228 0 1C0 0.447715 0.447715 0 1 0H3C3.26522 0 3.51957 0.105357 3.70711 0.292893C3.89464 0.48043 4 0.734784 4 1V13H16.438L18.438 5H7C6.44772 5 6 4.55228 6 4C6 3.44772 6.44772 3 7 3H19.72C19.872 3 20.022 3.03466 20.1586 3.10134C20.2952 3.16801 20.4148 3.26495 20.5083 3.38479C20.6019 3.50462 20.6668 3.6442 20.6983 3.79291C20.7298 3.94162 20.7269 4.09555 20.69 4.243L18.19 14.243C18.1358 14.4592 18.011 14.6512 17.8352 14.7883C17.6595 14.9255 17.4429 15 17.22 15H3C2.73478 15 2.48043 14.8946 2.29289 14.7071C2.10536 14.5196 2 14.2652 2 14ZM4 21C3.46957 21 2.96086 20.7893 2.58579 20.4142C2.21071 20.0391 2 19.5304 2 19C2 18.4696 2.21071 17.9609 2.58579 17.5858C2.96086 17.2107 3.46957 17 4 17C4.53043 17 5.03914 17.2107 5.41421 17.5858C5.78929 17.9609 6 18.4696 6 19C6 19.5304 5.78929 20.0391 5.41421 20.4142C5.03914 20.7893 4.53043 21 4 21ZM16 21C15.4696 21 14.9609 20.7893 14.5858 20.4142C14.2107 20.0391 14 19.5304 14 19C14 18.4696 14.2107 17.9609 14.5858 17.5858C14.9609 17.2107 15.4696 17 16 17C16.5304 17 17.0391 17.2107 17.4142 17.5858C17.7893 17.9609 18 18.4696 18 19C18 19.5304 17.7893 20.0391 17.4142 20.4142C17.0391 20.7893 16.5304 21 16 21Z" fill="#646c9a"/>
                      </svg>
                    </div>
                    <div
                      v-if="cardProduct.length || newBasketProduct.length"
                      class="basket__icon__count"
                      :class="{ big: newBasketProduct.length > 99 }"
                    >
                      {{ newBasketProduct.length }}
                    </div>
          </div>
<!--          <basket v-if="$store.getters['user/currentUser'].company_id !== 0" ref="basketComponent"/>-->
          <router-link
            :to="getUrl()"
            class="icon__setting"
            @click.native="closeMenu()"
          >
            <v-icon>settings</v-icon>
          </router-link>
          <div class="setting__company__bell">
            <router-link to="/notification" class="icon-bell">
              <div v-if="countNotify" class="new-notify-count"></div>
              <v-btn
                icon
                flat
                small
                color="#fff"
                class="icon-bell__mobile"
                @click.native="closeMenu(), $router.push('/notification')"
              >
                <v-icon>notifications</v-icon>
              </v-btn>
            </router-link>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="currentUser.manager == 1"
      v-on-click-outside="hide"
      :class="{ active: openCompany }"
      class="setting__company__body"
    >
      <div class="setting__company__body__input">
        <input
          v-model="searchCompany"
          type="text"
          placeholder="Пошук по підприємствам"
        />
      </div>
      <div class="listCompany custom-scroll">
        <div
          v-for="(item, index) in dataListCompany"
          :key="index"
          class="item"
          @click="setCompanyId(item.id)"
        >
          <span :class="{ yellow_text: item.id == 0 }">
            {{ item.full_name }}
          </span>
        </div>
      </div>
    </div>
    <v-snackbar v-model="alert" dismissible type="success" color="#4caf50">
      <span v-if="currentCompany.company_id > 0">Підприємство встановлене</span>
      <span v-else>Ви вишли з підприємства</span>
      <v-btn color="pink" flat icon @click="alert = false">
        <v-icon>close</v-icon>
      </v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex"
// import basket from "../components/shop/basket"
// import PerfectScrollbar from "perfect-scrollbar"

export default {
  name: "SettingCompany",
  // eslint-disable-next-line vue/require-prop-types
  props: ["notification"],
  data() {
    return {
      email: "bezpupk@poshta.com",
      name: "Романа Пупкевич",
      countProduct: false,
      model: {},
      openCompany: false,
      dataListCompany: [],
      pagination: {
        sortBy: "full_name",
        descending: "ASC",
        rowsPerPage: 1000,
        page: 1
      },
      searchCompany: "",
      alert: false,
      currentCompany: {},
      countNotify: 0,
      needUpdate: false,
      count: 0,
      menuOver: false
    }
  },
    components: {
        // basket
    },
  computed: {
    filterCompany() {
      return this.dataListCompany.filter(company => {
        return company.full_name.match(this.searchCompany)
      })
    },
    ...mapGetters("user", ["currentUser"]),
    ...mapGetters("basket", [
      "basketModal",
      "cardProduct",
      "newBasketProduct"
    ]),
  },
  watch: {
    currentUser() {
      this.userData()
    },
    alert() {
      this.getDataFromApi()
    },
    searchCompany() {
      this.getDataFromApi()
    },
    notification(e) {
      if (e) {
        this.getDataFromApi()
      }
    },
    needUpdate(e) {
      if (e) {
        this.getDataFromApi()
        this.getUserData()
      }
    },
    newBasketProduct(e) {
      this.countProductFunc()
    },
    cardProduct() {
      this.countProductFunc()
    },
  },
  created() {
    this.sockets.subscribe("notification_" + this.currentUser.id, () => {
      this.getDataFromApi()
    })
    this.sockets.subscribe("newChatMessage", () => {
      this.getDataFromApi()
    })
    this.$loadingBus.$on("updateCompanyList", this.updateCompanyList)
    this.$loadingBus.$on("openCompany", this.openCompanyModal)
  },
  beforeDestroy() {
    this.$loadingBus.$off("updateCompanyList")
  },
  mounted() {
    this.userData()
    this.getDataFromApi()
  },
  updated() {
    // if(this.currentUser.manager == 1) {
    //     let selectorScroll = new PerfectScrollbar('.listCompany', {
    //         wheelSpeed: 0.05,
    //         wheelPropagation: false,
    //         minScrollbarLength: 20,
    //         swipeEasing: true
    //     });
    //     if (this.$store.getters['params/mobileView'] == true) {
    //         selectorScroll.destroy()
    //     } else {
    //         selectorScroll.update()
    //     }
    // }
  },
  methods: {
    ...mapActions("basket", [
      "setBasketModal",
    ]),
    countProductFunc() {
      if (this.cardProduct.length > 0 || this.newBasketProduct.length > 0) {
        this.countProduct = true
        setTimeout(() => {
          this.countProduct = false
        }, 2000)
      }
    },
    basketModalFunc() {
      if (this.basketModal) {
        this.setBasketModal({
          ctx: false
        })
        if (this.$route.query.basket == 'open') {
          let currentQuery = { ...this.$route.query };
          delete currentQuery.basket;
          this.$router.push({ query: currentQuery });
        }
      } else {
        this.setBasketModal({
          ctx: true
        })
      }
    },
    openCompanyModal() {
      if (this.currentUser.manager == 1) {
        this.openCompany = !this.openCompany
      } else return false
    },
    updateCompanyList(e) {
      this.needUpdate = e
    },
    // ...mapActions('params', [
    //     'setCollaps'
    // ]),
    hide(e) {
      let el = document.querySelector(".info__box__setting")
      if (
        e.target.parentElement === el ||
        e.target.classList.contains("openModalCompany")
      ) {
        if (this.openCompany) {
          this.openCompany = true
        }
      } else {
        this.openCompany = false
      }
    },
    hideMouse(sec) {
      setTimeout(() => {
        this.menuOver = false
        // eslint-disable-next-line no-unused-vars
        let timer = setTimeout(() => {
          if (!this.menuOver) {
            this.openCompany = false
          }
        }, sec)
      }, 2000)
    },
    noHideMouse() {
      if (this.openCompany) {
        this.menuOver = true
        this.openCompany = true
      }
    },
    ...mapActions("params", ["setCollaps"]),
    ...mapActions("basket", ["setIdProduct"]),
    closeMenu() {
      if (window.innerWidth <= 768) {
        this.setCollaps({
          ctx: false
        })
      }
    },
    getUserData() {
      this.loading = true
      this.$api.get("/account/index").then(response => {
        this.setData({ ctx: JSON.stringify(response.data.user) })
        this.loading = false
      })
    },
    getDataFromApi() {
      this.loading = true
      this.count += 1
      let countBlock = this.count
      this.$api
        .post("/graphql", {
          query:
            `
                        query{
                              company(page: ` +
            this.pagination.page +
            ` perPage: ` +
            this.pagination.rowsPerPage +
            ` order: "` +
            this.pagination.descending +
            `" orderBy: "` +
            this.pagination.sortBy +
            `" search: "` +
            this.searchCompany +
            `" status: 1){
                                 totalCount
                                 items{
                                  id
                                  full_name
                                  short_name
                                }
                              }
                              account{
                                id
                                company_id
                                company_name
                              }
                              countNotification{
                                count
                              }
                            }`
        })
        .then(response => {
          if (countBlock == this.count) {
            this.dataListCompany = response.data.data.company.items
            this.dataListCompany.unshift({
              id: 0,
              full_name: "Загальний режим",
              short_name: "Загальний режим"
            })
          }
          this.total_items = response.data.data.company.totalCount
          this.currentCompany = response.data.data.account
          let count = response.data.data.countNotification.count
          if (count > 99) {
            this.countNotify = "99+"
          } else {
            this.countNotify = count
          }
          this.loading = false
        })
    },
    setCompanyId(id) {
      this.currentCompany.company_id = id
      this.$api
        .post("/account/set-company", { id: id })
        .then(response => {
          if (response.data.success) {
            window.localStorage.setItem("location_id", 0)
            this.setIdProduct({
              ctx: {
                order_id: 0
              }
            })
            this.$loadingBus.$emit("updateBasket", true)
            this.alert = true
            this.getUserData()
          }
        })
        .finally(() => {
          this.removeLocation({ ctx: true })
        })
      this.openCompany = false
    },
    ...mapActions("user", ["setData", "removeLocation"]),
    getUrl() {
      if (this.$root.rbac.administrationChangeCompany) {
        return "/admin-setting-company"
      } else {
        return "/setting-company-page"
      }
    },
    userData() {
      let userData = this.currentUser
      this.email = userData.email
      this.name = userData.first_name + " " + userData.last_name
      this.model = userData
    }
  }
}
</script>

<style scoped>
.yellow_text {
  color: #c7a500;
}
.new-notify-count {
  position: absolute;
  top: 10px;
  left: 27px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  border-radius: 50%;
  width: 8px;
  height: 8px;
  background: #ff4646;
  color: white;
  text-align: center;
  margin: auto;
  font-size: 9px;
  font-weight: 500;
  z-index: 1;
}

.new-notify-count:hover {
  -webkit-transform: scale(1.05);
  transform: scale(1.05);
}

@media only screen and (max-width: 768px) {
  .new-notify-count {
    display: none;
  }
}
</style>

<template>
  <div
    ref="search_popup"
    class="search-head"
    :class="{ active: model.length > 0 || searchCatalog.length > 0 }"
  >
    <form @submit.prevent="searchData">
      <v-btn flat icon type="submit" color="A1A8C3" class="searchIcon">
        <svg
          v-if="model.length > 0 && model !== searchCatalog"
          class="searchBtnIcon"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M19.7753 18.6511L16.8091 15.7067C17.9605 14.2699 18.5181 12.4464 18.3672 10.6109C18.2164 8.77535 17.3685 7.06745 15.998 5.83834C14.6275 4.60923 12.8385 3.95232 10.9989 4.0027C9.15928 4.05307 7.40887 4.8069 6.10758 6.10918C4.80629 7.41146 4.05303 9.1632 4.0027 11.0042C3.95236 12.8452 4.60876 14.6356 5.83694 16.0071C7.06512 17.3787 8.77172 18.2272 10.6058 18.3781C12.4399 18.5291 14.2621 17.9711 15.6978 16.8188L18.64 19.7633C18.7143 19.8383 18.8028 19.8978 18.9002 19.9385C18.9976 19.9791 19.1021 20 19.2077 20C19.3132 20 19.4177 19.9791 19.5152 19.9385C19.6126 19.8978 19.701 19.8383 19.7753 19.7633C19.9194 19.6141 20 19.4147 20 19.2072C20 18.9997 19.9194 18.8003 19.7753 18.6511ZM11.2124 16.8188C10.1055 16.8188 9.02346 16.4903 8.10309 15.8749C7.18272 15.2595 6.46538 14.3847 6.04178 13.3613C5.61818 12.3379 5.50735 11.2117 5.7233 10.1252C5.93925 9.03875 6.47228 8.04076 7.25499 7.25746C8.0377 6.47416 9.03493 5.94072 10.1206 5.72461C11.2062 5.50849 12.3315 5.61941 13.3542 6.04333C14.3768 6.46725 15.2509 7.18514 15.8659 8.1062C16.4809 9.02727 16.8091 10.1102 16.8091 11.2179C16.8091 12.7034 16.2195 14.128 15.1699 15.1784C14.1203 16.2287 12.6968 16.8188 11.2124 16.8188Z"
            fill="#A1A8C3"
          />
        </svg>
        <svg
          class="searchDefault"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M19.7753 18.6511L16.8091 15.7067C17.9605 14.2699 18.5181 12.4464 18.3672 10.6109C18.2164 8.77535 17.3685 7.06745 15.998 5.83834C14.6275 4.60923 12.8385 3.95232 10.9989 4.0027C9.15928 4.05307 7.40887 4.8069 6.10758 6.10918C4.80629 7.41146 4.05303 9.1632 4.0027 11.0042C3.95236 12.8452 4.60876 14.6356 5.83694 16.0071C7.06512 17.3787 8.77172 18.2272 10.6058 18.3781C12.4399 18.5291 14.2621 17.9711 15.6978 16.8188L18.64 19.7633C18.7143 19.8383 18.8028 19.8978 18.9002 19.9385C18.9976 19.9791 19.1021 20 19.2077 20C19.3132 20 19.4177 19.9791 19.5152 19.9385C19.6126 19.8978 19.701 19.8383 19.7753 19.7633C19.9194 19.6141 20 19.4147 20 19.2072C20 18.9997 19.9194 18.8003 19.7753 18.6511ZM11.2124 16.8188C10.1055 16.8188 9.02346 16.4903 8.10309 15.8749C7.18272 15.2595 6.46538 14.3847 6.04178 13.3613C5.61818 12.3379 5.50735 11.2117 5.7233 10.1252C5.93925 9.03875 6.47228 8.04076 7.25499 7.25746C8.0377 6.47416 9.03493 5.94072 10.1206 5.72461C11.2062 5.50849 12.3315 5.61941 13.3542 6.04333C14.3768 6.46725 15.2509 7.18514 15.8659 8.1062C16.4809 9.02727 16.8091 10.1102 16.8091 11.2179C16.8091 12.7034 16.2195 14.128 15.1699 15.1784C14.1203 16.2287 12.6968 16.8188 11.2124 16.8188Z"
            fill="#A1A8C3"
          />
        </svg>
        <v-icon
          v-if="!model.length || model == searchCatalog"
          class="searchBtnIcon"
          color="#fff"
          @click="cleanSearch()"
        >
          close
        </v-icon>
      </v-btn>
      <input
        v-model="model"
        class="search-head__input"
        type="search"
        placeholder="Пошук в Salvi"
        @input="onSearchInput"
        @focus="focusSearch"
        ref="searchInput"
      />
    </form>
    <div v-if="isActive && (historySearch.length || categorySearch.length)" class="search-head__history">

      <template v-if="historySearch.length">
        <div @click="historyData(item.key, item.url)" v-for="(item, index) in historySearch" :key="index" class="search-head__history-item">
          <span class="search-head__history-item-model">{{item.key}}</span>
        </div>
      </template>

      <template v-if="categorySearch.length && model.length > 0">
        <div class="search-head__history-container">
          <div class="search-head__history-left">
            <div @click="categoryData(item.name, item.path)"
                 @mouseover="hoverCategory(item.productList, item)"
                 v-for="(item, index) in categorySearch"
                 :key="index"
                 :class="['search-head__history-item', selectedCategory && selectedCategory.path == item.path && 'active']"
            >
              <span class="search-head__history-item-model">{{ model }}</span>
              в категорії
              <span class="search-head__history-item-category">
                {{ item.name }}
                <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4.25 0C4.80812 0 5.36077 0.10993 5.87641 0.323512C6.39204 0.537095 6.86056 0.850147 7.2552 1.2448C7.64985 1.63945 7.96291 2.10796 8.17649 2.62359C8.39007 3.13923 8.5 3.69188 8.5 4.25V8.5H4.25C3.12283 8.5 2.04183 8.05223 1.2448 7.2552C0.447768 6.45817 1.81719e-06 5.37717 1.81719e-06 4.25C1.81719e-06 3.12283 0.447768 2.04183 1.2448 1.2448C2.04183 0.447767 3.12283 0 4.25 0ZM6.5 6.5V4.25C6.5 3.80499 6.36804 3.36998 6.12081 2.99997C5.87357 2.62996 5.52217 2.34157 5.11104 2.17127C4.6999 2.00097 4.24751 1.95642 3.81105 2.04323C3.37459 2.13005 2.97368 2.34434 2.65901 2.65901C2.34434 2.97368 2.13005 3.37459 2.04323 3.81105C1.95642 4.2475 2.00098 4.6999 2.17127 5.11104C2.34157 5.52217 2.62996 5.87357 2.99997 6.12081C3.36998 6.36804 3.80499 6.5 4.25 6.5H6.5ZM4.25 10.5H8.5V14.75C8.5 15.5906 8.25074 16.4123 7.78375 17.1112C7.31675 17.8101 6.65299 18.3548 5.87641 18.6765C5.09982 18.9982 4.24529 19.0823 3.42087 18.9183C2.59645 18.7543 1.83917 18.3496 1.2448 17.7552C0.650425 17.1608 0.245652 16.4036 0.0816645 15.5791C-0.0823227 14.7547 0.00184146 13.9002 0.323514 13.1236C0.645186 12.347 1.18992 11.6832 1.88883 11.2163C2.58774 10.7493 3.40943 10.5 4.25 10.5ZM4.25 12.5C3.80499 12.5 3.36998 12.632 2.99997 12.8792C2.62996 13.1264 2.34157 13.4778 2.17127 13.889C2.00098 14.3001 1.95642 14.7525 2.04323 15.189C2.13005 15.6254 2.34434 16.0263 2.65901 16.341C2.97368 16.6557 3.37459 16.8699 3.81105 16.9568C4.24751 17.0436 4.6999 16.999 5.11104 16.8287C5.52217 16.6584 5.87357 16.37 6.12081 16C6.36804 15.63 6.5 15.195 6.5 14.75V12.5H4.25ZM14.75 0C15.8772 0 16.9582 0.447767 17.7552 1.2448C18.5522 2.04183 19 3.12283 19 4.25C19 5.37717 18.5522 6.45817 17.7552 7.2552C16.9582 8.05223 15.8772 8.5 14.75 8.5H10.5V4.25C10.5 3.12283 10.9478 2.04183 11.7448 1.2448C12.5418 0.447767 13.6228 0 14.75 0ZM14.75 6.5C15.195 6.5 15.63 6.36804 16 6.12081C16.37 5.87357 16.6584 5.52217 16.8287 5.11104C16.999 4.6999 17.0436 4.2475 16.9568 3.81105C16.8699 3.37459 16.6557 2.97368 16.341 2.65901C16.0263 2.34434 15.6254 2.13005 15.189 2.04323C14.7525 1.95642 14.3001 2.00097 13.889 2.17127C13.4778 2.34157 13.1264 2.62996 12.8792 2.99997C12.632 3.36998 12.5 3.80499 12.5 4.25V6.5H14.75ZM10.5 10.5H14.75C15.5906 10.5 16.4123 10.7493 17.1112 11.2163C17.8101 11.6832 18.3548 12.347 18.6765 13.1236C18.9982 13.9002 19.0823 14.7547 18.9183 15.5791C18.7543 16.4036 18.3496 17.1608 17.7552 17.7552C17.1608 18.3496 16.4036 18.7543 15.5791 18.9183C14.7547 19.0823 13.9002 18.9982 13.1236 18.6765C12.347 18.3548 11.6833 17.8101 11.2163 17.1112C10.7493 16.4123 10.5 15.5906 10.5 14.75V10.5ZM12.5 12.5V14.75C12.5 15.195 12.632 15.63 12.8792 16C13.1264 16.37 13.4778 16.6584 13.889 16.8287C14.3001 16.999 14.7525 17.0436 15.189 16.9568C15.6254 16.8699 16.0263 16.6557 16.341 16.341C16.6557 16.0263 16.8699 15.6254 16.9568 15.189C17.0436 14.7525 16.999 14.3001 16.8287 13.889C16.6584 13.4778 16.37 13.1264 16 12.8792C15.63 12.632 15.195 12.5 14.75 12.5H12.5Z" fill="#269447"/>
                </svg>
              </span>
              ({{ item.countItems }})
            </div>
          </div>
          <div class="search-head__history-right">
            <template v-if="productList.length > 0">
              <div @click="categoryData(selectedCategory.name, selectedCategory.path)"
                   class="search-head__history-category">
                Всі результати з категорії ({{ selectedCategory.countItems }})
                <svg width="8" height="13" viewBox="0 0 8 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4.24289 7.07065C4.63342 6.68012 4.63342 6.04696 4.24289 5.65643L0.707 2.12054C0.316535 1.73007 0.316534 1.097 0.706999 0.706538C1.09746 0.316072 1.73053 0.316073 2.121 0.706538L7.07089 5.65643C7.46142 6.04696 7.46142 6.68012 7.07089 7.07065L2.121 12.0205C1.73053 12.411 1.09747 12.411 0.707 12.0205C0.316534 11.6301 0.316535 10.997 0.707 10.6065L4.24289 7.07065Z" fill="#BCBCBC"/>
                </svg>

              </div>
              <div v-for="(item, index) in productList" :key="item.id" class="search-head__history-product">
                <div class="search-head__history-product-image">
                  <img
                    v-if="item.images[0].url"
                    :src="item.images[0].url"
                    onerror="this.style.display='none'"
                  />
                </div>
                <div class="search-head__history-product-info">
                  <div class="search-head__history-product-name">
                    {{ item.name }}
                  </div>
                  <div class="search-head__history-product-price">
                    {{ item.price | price-break }}₴

                    <div
                      v-if="!item.strict_multiplicity && item.multiplicity > 1"
                      @click="handleChangeMultiplicity(index, item)"
                      :class="['multiplicity__toggle', item.multiplicity_switch && 'active']"
                    >
                      <div class="multiplicity__toggle-button"></div>
                      <div class="multiplicity__toggle-count">{{ item.multiplicity }}</div>
                    </div>

                    <div
                      v-if="item.strict_multiplicity && item.multiplicity > 1"
                      :class="['multiplicity__toggle', 'active no-pointer']"
                    >
                      <div class="multiplicity__toggle-count">{{ item.multiplicity }}</div>
                    </div>

                    <v-tooltip v-if="item.strict_multiplicity && item.multiplicity > 1" max-width="320px" bottom z-index="101">
                      <span slot="activator" class="multiplicity__info-icon-question">?</span>
                      <div v-if="item.strict_multiplicity" class="wrap-text">Товар можливо замовити лише кратно упаковці</div>
                    </v-tooltip>
                    <v-tooltip v-if="!item.strict_multiplicity && item.multiplicity > 1" max-width="320px" bottom z-index="101">
                      <span slot="activator" class="multiplicity__info-icon-question">?</span>
                      <div v-if="!item.strict_multiplicity" class="wrap-text">Товар можливо замовити кратно упаковці</div>
                    </v-tooltip>
                  </div>
                </div>

                <div class="search-head__history-add-container">
                  <div @click="addToCart(item)" v-if="canAddToCart(item)" class="search-head__history-add">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1.5444 10.6667V1.52381H0.761905C0.341117 1.52381 0 1.18269 0 0.761905C0 0.341116 0.341117 0 0.761905 0H2.31661C2.52141 0 2.71782 0.0802718 2.86263 0.223157C3.00745 0.366042 3.08881 0.559835 3.08881 0.761905V9.90476H12.6935L14.2379 3.80952H13.1171C12.6963 3.80952 12.3552 3.46841 12.3552 3.04762C12.3552 2.62683 12.6963 2.28571 13.1171 2.28571H15.2278C15.3452 2.28572 15.461 2.31212 15.5665 2.36292C15.672 2.41372 15.7644 2.48758 15.8366 2.57889C15.9088 2.67019 15.959 2.77653 15.9833 2.88984C16.0076 3.00314 16.0054 3.12042 15.9769 3.23276L14.0463 10.8518C14.0045 11.0166 13.9081 11.1628 13.7724 11.2673C13.6367 11.3718 13.4695 11.4286 13.2973 11.4286H2.31661C2.1118 11.4286 1.91539 11.3483 1.77058 11.2054C1.62576 11.0625 1.5444 10.8687 1.5444 10.6667ZM3.08881 16C2.67921 16 2.28638 15.8395 1.99675 15.5537C1.70712 15.2679 1.5444 14.8803 1.5444 14.4762C1.5444 14.0721 1.70712 13.6845 1.99675 13.3987C2.28638 13.1129 2.67921 12.9524 3.08881 12.9524C3.49841 12.9524 3.89123 13.1129 4.18087 13.3987C4.4705 13.6845 4.63321 14.0721 4.63321 14.4762C4.63321 14.8803 4.4705 15.2679 4.18087 15.5537C3.89123 15.8395 3.49841 16 3.08881 16ZM12.3552 16C11.9456 16 11.5528 15.8395 11.2632 15.5537C10.9735 15.2679 10.8108 14.8803 10.8108 14.4762C10.8108 14.0721 10.9735 13.6845 11.2632 13.3987C11.5528 13.1129 11.9456 12.9524 12.3552 12.9524C12.7648 12.9524 13.1577 13.1129 13.4473 13.3987C13.7369 13.6845 13.8996 14.0721 13.8996 14.4762C13.8996 14.8803 13.7369 15.2679 13.4473 15.5537C13.1577 15.8395 12.7648 16 12.3552 16Z" fill="white"/>
                      <rect x="8.49414" width="6.17761" height="1.5444" rx="0.772202" transform="rotate(90 8.49414 0)" fill="white"/>
                      <rect x="4.63281" y="2.31689" width="6.17761" height="1.5444" rx="0.772202" fill="white"/>
                    </svg>
                  </div>

                  <div class="quantity-section" v-if="!canAddToCart(item)">
                    <button class="minus-btn" @click="changeQuantity(item, 'remove', index, item.id)">
                      <v-icon color="#4caf50">remove</v-icon>
                    </button>

                    <input type="number" name="item-quantity" :value="getProductCartQty(item.id)" :data-quantity="getProductCartQty(item.id)" @mouseleave="getProductCartQty(item.id) != $event.target.value ? changeQuantity(item, $event.target.value, index, item.id) : ''" @change="changeQuantity(item, $event.target.value, index, item.id)">

                    <button class="plus-btn" @click="changeQuantity(item, 'add', index, item.id)">
                      <v-icon color="#4caf50">add</v-icon>
                    </button>
                  </div>
                </div>
              </div>

            </template>
          </div>
        </div>
      </template>

    </div>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from "vuex"
  import { debounce } from "lodash";

  export default {
    name: "SearchLK",
    data() {
      return {
        model: "",
        historySearch: [],
        categorySearch: [],
        productList: [],
        selectedCategory: null,
        isActive: false,
        isNoBlur: false,
        pauseSearch: false,
        summ__prod: [],
        selectedChild: []
      };
    },
    computed: {
      ...mapGetters("params", ["search"]),
      ...mapGetters("category", ["searchCatalog"]),
      ...mapGetters("basket", ["newBasketProduct", "idProduct"]),
    },
    watch: {
      model(e) {},
      search(e) {
        if (e == "") {
          this.model = e
        }
      },
      searchCatalog(e) {
        if (e == "") {
          this.model = e
        }
      },
      currentLocation(e) {
        this.location_id = e
      },
      $route(to, from) {
        this.model = ""
        this.$refs.searchInput.blur()
      },
    },
    mounted() {
      if (this.$route.name == "Search") {
        this.model =  "";
      }
    },
    methods: {
      ...mapActions("params", ["setSearch"]),
      ...mapActions("category", ["setSearchCatalog"]),
      ...mapGetters("user", ["currentUser"]),
      ...mapActions("basket", ["setNewBasketProduct"]),

      cleanSearch() {
        if(this.model.length > 0) {
          this.model = ""
          this.routeSearch(`/search`)
        }
      },
      focusSearch() {
        this.historySearch = []
        this.categorySearch = []
        this.productList = []
        this.selectedCategory = null
        this.getSearchHistory();
        this.getSearchCategory();
        this.isActive = true
        document.addEventListener("click", this.handleClick)
      },
      handleClick(e) {
        if (this.$refs.search_popup && !this.$refs.search_popup.contains(e.target)) {
          if(this.isNoBlur) {
            return
          }
          this.isActive = false
          document.removeEventListener("click", this.handleClick)
        }
      },
      // blurSearch() {
      //   setTimeout(() => {
      //     if(this.isNoBlur) {
      //       return
      //     }
      //     this.isActive = false
      //     document.removeEventListener("click", this.handleClick)
      //   }, 700)
      // },
      // stopBlur() {
      //   this.isNoBlur = true
      //
      //   setTimeout(() => {
      //     this.isNoBlur = false
      //   }, 800)
      // },
      debouncedGetSearchHistory: debounce(function () {
        this.historySearch = []
        this.categorySearch = []
        this.getSearchHistory();
        this.getSearchCategory();
      }, 300),
      onSearchInput(e) {
        // this.model = e.target.value.replace(/[^a-zA-Z0-9А-Яа-яЁёІіЇїЄєҐґÜüÖöÄäßÇçÑñ\s.,-]+/g, '')

        this.debouncedGetSearchHistory()
      },

      getSearchHistory() {
        if (this.model.trim().length == 0) {
          try {
            this.$api
              .get(`/search/get-history-search?query=${this.model.trim()}`)
              .then(res => {
                if (res.data.success && res.data.list.length > 0) {
                  this.historySearch = res.data.list
                }
              })
          } catch (e) {}
        }
      },
      setSearchHistory(item) {
        try {
          this.$api
            .get(`/search/set-search-clue?query=${item.trim()}`)
            .then(res => {})
        } catch (e) {}
      },
      getSearchCategory() {
        if (this.model.trim().length > 0) {
          let url = `/search/get-category-search?query=${this.model.trim()}`
          if (window.localStorage.getItem("location_id")) {
            this.location_id = window.localStorage.getItem("location_id")
          }
          if (this.location_id && this.location_id != 0) {
            url += `&location_id=${this.location_id}`
          }
          try {
            this.$api
              .get(url)
              .then(res => {
                if (res.data.success && res.data.urls.length > 0) {
                  this.categorySearch = res.data.urls

                  const data = this.categorySearch[0].productList

                  for(let i = 0; data.length > i; i++) {
                    data[i].multiplicity_switch = false

                    if(this.newBasketProduct.length) {
                      this.newBasketProduct.find(product => {
                        if(product.id === data[i].id) {
                          if (product.is_strict_multiplicity) {
                            data[i].multiplicity_switch = true
                          }
                        };
                      });
                    }
                  }

                  this.productList = data


                  this.selectedCategory = this.categorySearch[0]
                }
              })
          } catch (e) {}
        }
      },
      searchData() {
        if (!this.pauseSearch) {
          const searchQuery = this.model.trim().replace(/[^a-zA-Z0-9А-Яа-яЁёІіЇїЄєҐґÜüÖöÄäßÇçÑñ\s.,-]+/g, '')
          if(searchQuery.length > 0) {
            this.isActive = false
            this.routeSearch(`/search?query=${searchQuery}`)
          }
        }
      },
      routeSearch(url) {
        const isMobile = /Mobi|Android/i.test(navigator.userAgent) && window.innerWidth < 768
        isMobile ? location.href = url : this.$router.push(url)
      },
      historyData(key, url = false) {
        this.model = key.trim()
        this.pauseSearch = true;
        setTimeout(() => {
          if (url) {
            this.routeSearch(`/search?query=${key.trim()}&category=${url.includes('/') ? url.split('/').pop() : url}`)
          } else {
            this.routeSearch(`/search?query=${key.trim()}`)
          }
          this.isActive = false
        }, 0)
        setTimeout(() => {
          this.pauseSearch = false;
        }, 2000)
      },

      categoryData(name, path) {
        this.setSearchHistory(name)
        this.pauseSearch = true;
        this.isActive = false
        const url = this.model
          .trim()
          .replace(/[^\p{L}\p{N}\s-]/gu, "");

        setTimeout(() => {
          this.routeSearch(`/search?query=${url}&category=${path.includes('/') ? path.split('/').pop() : path}`)
        }, 1000)
        setTimeout(() => {
          this.pauseSearch = false;
        }, 2000)
      },

      hoverCategory(items, item) {
        this.productList = items;
        this.selectedCategory = item
      },

      canAddToCart(item) {
        var result = true;

        if(!this.newBasketProduct.length) {
          return result;
        }

        this.newBasketProduct.find(product => {
          if(product.id === item.id) {
            result = false;
          };
        });

        return result;
      },

      socketEmit() {
        this.$socket.emit("userCartAction", {
          order_id: this.idProduct.order_id,
          user_id: this.currentUser.id,
          update: true
        })
      },

      addToCart(item,index) {
        if(item.deleted === 1) {
          return false;
        }
        this.valProd = item;
        this.idProd = item.id;
        this.indexProd = index;

        // let sum = this.summ__prod.reduce((a, b) => a + b, 0)


        if(this.idProd === this.valProd.id) {
          // if(sum > 0) {/
          this.valProd.quantity = +this.summ__prod.join("");
          this.summ__prod = [];

          let $false = false;
          let s = this.selectedChild;

          this.selectedChild.push(this.idProd);

          for(let i = 0; i < s.length; i++) {
            if(this.selectedChild[i] == item.id) {
              $false = true;
            }
          }
          let newProduct = true;
          let changeQuantity = false;
          let index = undefined;

          this.newBasketProduct.forEach(i => {
            if (i.id === item.id) {
              i.newProduct ? (newProduct = true) : (newProduct = false)
              index = i.index
            }
          });

          if(!item.newProduct) {
            changeQuantity = true;
          }

          let price = item.price;
          price = price.replace(/[\s,%]/g, "");

          let total_sum
          let quantity

          if (item.multiplicity_switch || item.strict_multiplicity) {
            total_sum = +price * item.multiplicity;
            quantity = item.multiplicity
          } else {
            total_sum = +price
            quantity = 1
          }

          this.$api
            .post("/cart/add-product", {
              id: this.idProduct.id,
              order_id: this.idProduct.order_id,
              product_id: item.id,
              quantity: quantity,
              price: item.price,
              is_specification: item.isSpecificationProduct ? 1 : 0,
              is_strict_multiplicity: item.multiplicity_switch || item.strict_multiplicity ? 1 : 0,
            })
            // eslint-disable-next-line no-unused-vars
            .then(response => {
              if (response.data.success) {
                this.socketEmit()
                this.$nextTick(() => {
                  this.setNewBasketProduct({
                    ctx: {
                      index: index,
                      id: item.id,
                      addId: undefined,
                      lastUpdate: true,
                      quantity: quantity,
                      val: $false,
                      total_sum: total_sum.toFixed(2),
                      price: item.price,
                      img: item.img,
                      name: item.name,
                      newProduct: newProduct,
                      changeQuantity: changeQuantity,
                      leftovers_salvi: item.leftovers_salvi,
                      leftovers_supplier: item.leftovers_supplier,
                      supplier_delivery_postpone: item.supplier_delivery_postpone,
                      multiplicity: item.multiplicity,
                      isSpecificationProduct: item.isSpecificationProduct,
                      is_strict_multiplicity: item.multiplicity_switch || item.strict_multiplicity ? 1 : 0,
                      strict_multiplicity: item.strict_multiplicity,
                      is_temperature_conditions : item.is_temperature_conditions
                    }
                  })
                })
              }
            });
        }
      },

      getProductCartQty(productId) {
        var qty = 1;

        this.newBasketProduct.forEach(i => {
          if (i.id === productId) {
            qty = i.quantity;
          }
        });

        return qty;
      },

      changeQuantity(item, newQty, index, productId) {
        var nQty;
        const multiplicity = item.multiplicity
        // const maxCount = Math.floor(item.leftovers / item.multiplicity) * item.multiplicity
        this.newBasketProduct.forEach(i => {
          if (i.id === productId) {
            nQty = +i.quantity;
          }
        });
        if(newQty === 'add') {
          if (item.multiplicity_switch || item.strict_multiplicity) {
            nQty += +multiplicity;
          } else {
            nQty += 1
          }
        } else if(newQty === 'remove') {
          if (item.multiplicity_switch || item.strict_multiplicity) {
            nQty -= +multiplicity;
          } else {
            nQty -= 1
          }
        } else {
          if (item.multiplicity_switch || item.strict_multiplicity) {
            if (Number.isInteger(newQty / item.multiplicity) * item.multiplicity) {
              nQty = Math.floor(newQty / item.multiplicity) * item.multiplicity;
            } else {
              if (Math.floor(item.leftovers / item.multiplicity) < Math.floor(newQty / item.multiplicity)) {
                nQty = Math.floor(newQty / item.multiplicity) * item.multiplicity;
              } else {
                nQty = Math.ceil(newQty / item.multiplicity) * item.multiplicity;
              }
            }
          } else {
            nQty = newQty
          }

        }

        if(nQty < 1) {
          this.deleteItemNewBasket(item, index)
          return
        }

        if (item.multiplicity_switch || item.strict_multiplicity) {
          nQty = Math.floor(nQty / item.multiplicity) * item.multiplicity
        }

        // r = +r;
        let newProduct = false;
        // let changeQuantity = true;
        if (item.newProduct) {
          newProduct = true
        }

        if (true) {
          item.quantity = nQty;
          // this.socketEmitFreez(true);

          let total_sum = +item.price * + nQty;
          this.setNewBasketProduct({
            ctx: {
              name: item.name,
              total_sum: total_sum.toFixed(2),
              index: index,
              id: item.id,
              addId: item.addId,
              lastUpdate: item.lastUpdate,
              quantity: nQty,
              val: true,
              price: item.price,
              img: item.img,
              newProduct: newProduct,
              changeQuantity: true,
              leftovers_salvi: item.leftovers_salvi,
              leftovers_supplier: item.leftovers_supplier,
              supplier_delivery_postpone: item.supplier_delivery_postpone,
              multiplicity: item.multiplicity,
              isSpecificationProduct: item.isSpecificationProduct,
              is_strict_multiplicity: item.multiplicity_switch || item.strict_multiplicity ? 1 : 0,
              strict_multiplicity: item.strict_multiplicity,
              is_temperature_conditions : item.is_temperature_conditions
            }
          })
          this.$api
            .post("/cart/update-product", {
              order_id: this.idProduct.order_id,
              product_id: item.id,
              id: item.addId,
              quantity: nQty,
              is_strict_multiplicity: item.multiplicity_switch || item.strict_multiplicity ? 1 : 0,
            })
            // eslint-disable-next-line no-unused-vars
            .then(response => {
              // if (response.data.success) {
              this.socketEmit()
              // }
            })
          this.changeInputBlock = false
          this.loading = true
          setTimeout(() => {
            this.loading = false
          }, 1000)
        }
      },
      handleChangeMultiplicity(index, item) {
        const next = !item.multiplicity_switch

        // гарантированно триггерим реактивность массива
        this.$set(this.productList, index, {
          ...item,
          multiplicity_switch: next
        })

        const el = this.productList[index]

        if (!this.canAddToCart(el)) {
          this.changeQuantity(el, this.getProductCartQty(el.id), index, el.id)
        }
      },

      deleteItemNewBasket(e, i) {
        this.setNewBasketProduct({
          ctx: {
            index: i,
            id: e.id,
            quantity: e.quantity,
            val: false,
            price: e.price
          }
        })
        this.$api
          .post("/cart/delete-product", {
            order_id: this.idProduct.order_id,
            id: e.addId,
            product_id: e.id
          })
          .then(response => {})
      },
    }
  }
</script>

<style lang="scss">
  .search-head {
    position: relative;

    form {
      width: 100%;
      height: 100%;
      position: relative;
    }

    &__history {
      position: absolute;
      z-index: 100;
      top: 100%;
      left: 0;
      right: 0;
      max-height: 650px;
      overflow-y: auto;
      overflow-x: hidden;
      width: 100%;
      border-radius: 0 5px 5px 0;
      background: #ffffff;
      box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;

      &::-webkit-scrollbar {
        width: 5px;
      }
      &::-webkit-scrollbar-thumb {
        background-color: #7f85aa;
        border-radius: 6px;
      }
      &::-webkit-scrollbar-track {
        background-color: #eeeeee;
      }
    }

    &__history-item {
      padding: 10px 20px;
      font-size: 14px;
      cursor: pointer;
      border-bottom: 1px solid #E3E3E3;
      color: #A4A4A5;

      &:hover, &.active {
        background: #c7c7c7;
      }
    }

    &__history-item-model {
      color: #222222;
    }

    &__history-item-category {
      color: #269447;
      font-weight: 600;

      svg {
        margin-right: 10px;
      }
    }

    &__history-container {
      display: flex;
    }

    &__history-left {
      width: 35%;

      @media (max-width: 768px) {
        width: 100%;
      }
    }

    &__history-right {
      width: 65%;
      border-right: 1px solid #E3E3E3;

      @media (max-width: 768px) {
        display: none;
      }
    }

    &__history-product {
      display: flex;
      padding: 10px 20px;
    }

    &__history-product-image {
      margin-right: 20px;
      width: 70px;
      height: 70px;
      min-height: 70px;
      min-width: 70px;

      img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
    }

    &__history-product-price {
      font-size: 12px;
      font-weight: 600;
      padding-bottom: 5px;
      color: #222222;
      min-width: 140px;
      width: 140px;
      display: flex;
      height: fit-content;
      align-items: center;
      justify-content: space-between;
    }

    &__history-product-name {
      font-size: 12px;
      color: #222222;
    }

    &__history-add {
      margin: auto 0 auto auto;
    }

    &__history-category {
      padding: 10px 20px 10px 30px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
      margin: 10px 0;
      color: #269447;
      font-size: 14px;
      font-weight: 700;
    }

    &__history-add-container {
      width: 80px;
      min-width: 80px;
      margin-left: auto;
      padding-left: 10px;
    }

    &__history-add {
      width: 100%;
      height: 32px;
      border-radius: 4px;
      background: #269447;
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-left: auto;
    }

    &__history-product-info {
      display: flex;
      flex-grow: 1;
    }

    &__history-product-price {
      margin-left: auto;
      padding-left: 10px;
    }
  }

  .multiplicity__container {
    display: flex;
    align-items: center;
  }
  .multiplicity__wrap {
    display: flex;
    align-items: center;
  }
  .price__wrap {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .multiplicity__info-icon {
    font-size: 14px;
    font-weight: 700;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: rgb(42, 139, 26);
    border: 2px solid rgb(42, 139, 26);
    margin-right: 10px;
    border-radius: 50px;
    cursor: pointer;
  }
  .multiplicity__toggle {
    height: 26px;
    width: 52px;
    border-radius: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    background: grey;
    padding: 0 2px;
  }
  .multiplicity__toggle.no-pointer {
    cursor: auto;
  }
  .multiplicity__toggle.active {
    background: rgb(42, 139, 26);
  }
  .multiplicity__toggle.active .multiplicity__toggle-button {
    order: 1;
  }
  .multiplicity__toggle-count {
    flex-grow: 1;
    color: #ffffff;
    text-align: center;
  }
  .multiplicity__toggle-button {
    width: 22px;
    height: 22px;
    border-radius: 50px;
    background: #ffffff;
  }

  .icon__isSpecification {
    position: absolute;
    top: 5px;
    left: 5px;
    z-index: 9;
  }

  .btnAdd {
    background: rgb(42, 139, 26);
    width: 80px;
    border-radius: 5px;
  }

  .quantity-section {
    /*height: 50px;*/
    display: flex;
  }

  .quantity-section > button {
    color: #4caf50;
    height: 40px;
    width: 40px;
  }

  .quantity-section > button.minus-btn {
    border: 1px solid #E3E3E3;
    border-right: none;
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
  }
  .quantity-section > button.plus-btn {
    border: 1px solid #E3E3E3;
    border-left: none;
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
  }
  .quantity-section > input {
    width: 70px;
    border: 1px solid #E3E3E3;
    height: 40px;
    padding: 5px 10px;
    text-align: center;
  }

  .quantity-section > button:hover {
    background-color: #4caf50;
  }
  .quantity-section > button:hover > i{
    color: #fff !important;
  }

  .quantity-section > input::-webkit-outer-spin-button,
  .quantity-section > input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  .quantity-section > input[type="number"] {
    -moz-appearance: textfield;
  }

  .buttons {
    display: flex;
    justify-content: space-between;
  }

  .image-modal {
    padding-right: 40px;
    white-space: normal !important;
    overflow: auto;
  }

  .multiplicity__info-icon-question {
    font-size: 14px;
    font-weight: 700;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: rgb(42, 139, 26);
    border: 2px solid rgb(42, 139, 26);
    border-radius: 50px;
    cursor: pointer;
  }
</style>

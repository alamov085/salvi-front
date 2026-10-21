<template>
  <div>
    <div>
      <div class="slider__header">
        <template v-if="true">
          <div @click="prevSlide" :class="['slider__header-nav prev', slide == 0 && 'disabled']">
            <svg width="8" height="13" viewBox="0 0 8 13" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3.95635 7.07273C4.31194 6.68921 4.31194 6.09647 3.95635 5.71295L0.267087 1.73383C-0.0884986 1.3503 -0.0884987 0.757562 0.267087 0.374039L0.317408 0.319765C0.713126 -0.107043 1.38831 -0.107043 1.78403 0.319764L6.78435 5.71295C7.13994 6.09647 7.13994 6.68921 6.78435 7.07273L1.78403 12.4659C1.38831 12.8927 0.713126 12.8927 0.317408 12.4659L0.267087 12.4116C-0.0884988 12.0281 -0.0884992 11.4354 0.267087 11.0518L3.95635 7.07273Z" fill="#565656"/>
            </svg>
          </div>
          <div @click="nextSlide" :class="['slider__header-nav next', slide == carouselItems.length - 1 && 'disabled']">
            <svg width="8" height="13" viewBox="0 0 8 13" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3.95635 7.07273C4.31194 6.68921 4.31194 6.09647 3.95635 5.71295L0.267087 1.73383C-0.0884986 1.3503 -0.0884987 0.757562 0.267087 0.374039L0.317408 0.319765C0.713126 -0.107043 1.38831 -0.107043 1.78403 0.319764L6.78435 5.71295C7.13994 6.09647 7.13994 6.68921 6.78435 7.07273L1.78403 12.4659C1.38831 12.8927 0.713126 12.8927 0.317408 12.4659L0.267087 12.4116C-0.0884988 12.0281 -0.0884992 11.4354 0.267087 11.0518L3.95635 7.07273Z" fill="#565656"/>
            </svg>
          </div>
        </template>
        <a :href="urlLink" class="slider__header-button">
          Показати всі
        </a>
      </div>
      <div class="catalog__tile">
        <v-carousel
          v-model="slide"
          :show-arrows="true"
          hide-delimiters
          :hide-controls="true"
          height="auto"
          :cycle="false"
        >
          <v-carousel-item
            v-for="(group, index) in carouselItems"
            :key="`${index}_${carouselKey}`"
          >
            <div class="slider__row">
              <div
                class="slider__col"
                v-for="(item, i) in group"
                :key="`${i}_${carouselKey}`"
                :style="{
                  '--per-slide': perSlide,
                  '--per-slide-mobile': 2
                }"
              >
                <div v-if="item.is_empty" class="item">
                  <a :href="urlLink" class="item__last">
                    Показати всі товари - {{total}}
                  </a>
                </div>
                <div
                  v-else
                  class="item"
                  :class="{ add: btnId(item), 'no-available': item.deleted }"
                  @mouseleave="hoverCatalog = -1"
                  @mouseover="hoverItem(index)"
                >
                  <div class="item__head">
                    <div v-if="item.is_popular && !item.deleted" class="item__top">Топ продажів</div>
                    <v-tooltip v-if="item.is_temperature_conditions " top max-width="320px">
                      <span>Товар вимагає дотримання температурного режиму зберігання</span>
                      <span slot="activator" class="icon__isTemp">
                        <font-awesome-icon :icon="['fas', 'temperature-low']" />
                      </span>
                    </v-tooltip>
                    <v-badge
                      v-if="item.images.length"
                      class="imgBarge__custom img__display"
                      overlap
                      color="green"
                    >
                      <template v-slot:badge>
                        <span v-if="item.images.length > 1">{{
                          item.images.length
                        }}</span>
                      </template>
<!--                      <img-->
<!--                        v-if="showImgDefault"-->
<!--                        class="default"-->
<!--                        src="/images/Spinner.gif"-->
<!--                        alt="Завантаження"-->
<!--                      />-->
                      <img
                        :key="item.id + '-' + item.img"
                        v-if="item.img && !item.imageError"
                        class="lazyload"
                        :data-src="item.img"
                        @load="onImageLoad"
                        @error="setImageError(item)"
                        @click="openImg(item.images, item.name)"
                      />
                      <svg
                        v-else
                        class="img__display"
                        xmlns="http://www.w3.org/2000/svg"
                        width="260"
                        height="260"
                        viewBox="0 0 260 260"
                        fill="none"
                      >
                        <rect width="260" height="260" fill="#E3E3E3" />
                        <rect x="55" y="88" width="150" height="100" rx="10" fill="white" />
                        <rect x="90" y="72" width="80" height="100" rx="10" fill="white" />
                        <rect
                          x="110"
                          y="118"
                          width="40"
                          height="40"
                          rx="20"
                          fill="#E3E3E3"
                        />
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M105 138C105 151.807 116.193 163 130 163C143.807 163 155 151.807 155 138C155 124.193 143.807 113 130 113C116.193 113 105 124.193 105 138ZM130 108C113.431 108 100 121.431 100 138C100 154.569 113.431 168 130 168C146.569 168 160 154.569 160 138C160 121.431 146.569 108 130 108Z"
                          fill="#E3E3E3"
                        />
                      </svg>
                    </v-badge>

                  </div>
                  <div class="item__body">
                    <v-tooltip top max-width="320px">
                      <div class="wrap-text">{{ item.sku }}</div>
                      <span slot="activator" class="number">{{
                        item.sku | truncate(20, "...")
                      }}</span>
                    </v-tooltip>

                    <v-tooltip max-width="320px" bottom z-index="101">
                      <span slot="activator" class="name">{{ item.name }}</span>
                      <div class="wrap-text">{{ item.name }}</div>
                    </v-tooltip>
                    <div class="chip">
                      <router-link :to="item.category_url" class="chip__item">{{ item.category.name }}</router-link>
                    </div>

                    <div v-if="!item.deleted" class="price__wrap">
                      <div class="price">
                        <template v-if="item.discount_price && item.discount_price != '0.00'">
                          <span class="new-price">{{ item.price }} &#8372; </span>
                          <span class="old">{{ item.discount_price }} &#8372; </span>
                        </template>
                        <span v-else>{{ item.price }} &#8372; </span>
                        <v-tooltip v-if="item.isSpecificationProduct" top max-width="320px">
                          <span>Товар зi спецiфiкацii</span>
                          <span slot="activator" class="icon__isSpec">
                            <font-awesome-icon :icon="['fas', 'tag']" />
                          </span>
                        </v-tooltip>
                      </div>
                      <div class="multiplicity__wrap">
                        <div v-if="item.multiplicity > 1" class="multiplicity__container">
                          <v-tooltip max-width="320px" bottom z-index="101">
                            <span slot="activator" class="multiplicity__info-icon">?</span>
                            <div v-if="item.strict_multiplicity" class="wrap-text">Товар можливо замовити лише кратно упаковці</div>
                            <div v-if="!item.strict_multiplicity && item.multiplicity_switch" class="wrap-text">Товар можливо замовити кратно упаковці</div>
                            <div v-if="!item.strict_multiplicity && !item.multiplicity_switch" class="wrap-text">Товар можливо замовити кратно упаковці</div>
                          </v-tooltip>

                          <div
                            v-if="!item.strict_multiplicity"
                            @click="handleChangeMultiplicity(item.id)"
                            :class="['multiplicity__toggle', item.multiplicity_switch && 'active']"
                          >
                            <div class="multiplicity__toggle-button"></div>
                            <div class="multiplicity__toggle-count">{{ item.multiplicity }}</div>
                          </div>

                          <div
                            v-if="item.strict_multiplicity"
                            :class="['multiplicity__toggle', 'active no-pointer']"
                          >
                            <div class="multiplicity__toggle-count">{{ item.multiplicity }}</div>
                          </div>
                        </div>

                        <div class="multiplicity__unit" v-if="item.unit">
                          {{item.unit.name}}
                        </div>
                      </div>
                    </div>

                    <div v-else class="price">
                      <span style="color: #F24949; font-size: 14px">
                        Товару немає в наявностi
                      </span>
                    </div>

                    <div v-if="!item.deleted" class="buttons">
                      <transition name="scaleBtn">
                        <v-btn
                          v-if="!btnId(item) && canAddToCart(item)"
                          class="btnAdd"
                          v-class="{'d-none': canAddToCart(item)}"
                          flat
                          icon
                          color="#2A8B1A"
                          @click="addToCart(item)"
                        >
                          <v-icon color="#fff">add_shopping_cart</v-icon>
                        </v-btn>
                      </transition>

                      <div class="quantity-section" v-if="!canAddToCart(item)">
                        <button class="minus-btn" @click="changeQuantity(item, 'remove', index, item.id)">
                          <v-icon color="#4caf50">remove</v-icon>
                        </button>

                        <input type="number" name="item-quantity" :value="getProductCartQty(item.id)" :data-quantity="getProductCartQty(item.id)" @mouseleave="getProductCartQty(item.id) != $event.target.value ? changeQuantity(item, $event.target.value, index, item.id) : ''" @change="changeQuantity(item, $event.target.value, index, item.id)">

                        <button class="plus-btn" @click="changeQuantity(item, 'add', index, item.id)">
                          <v-icon color="#4caf50">add</v-icon>
                        </button>
                      </div>

                      <v-btn
                        v-if="!canAddToCart(item)"
                        class="removeItem"
                        icon
                        flat
                        color="#CCCCCC"
                        @click="deleteItemNewBasket(item, index)"
                      >
                        <v-icon color="#CCCCCC">delete_outline</v-icon>
                      </v-btn>
                    </div>

                    <div class="delivery" v-if="!item.deleted">
                      <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                           viewBox="0 0 100.354 100.352" style="enable-background:new 0 0 100.354 100.352;" xml:space="preserve">
                      <path fill="#262447" d="M94.384,49.638h-7.759V36.544c0-0.829-0.672-1.5-1.5-1.5H60.824V21.977c0-0.829-0.672-1.5-1.5-1.5H5.618
                        c-0.829,0-1.5,0.671-1.5,1.5v49.185c0,0.828,0.671,1.5,1.5,1.5h12.538c0.52,3.867,3.832,6.861,7.838,6.861s7.318-2.994,7.838-6.861
                        h25.492h9.686c0.52,3.867,3.834,6.861,7.844,6.861s7.324-2.994,7.845-6.861h9.686c0.828,0,1.5-0.672,1.5-1.5V51.138
                        C95.884,50.309,95.212,49.638,94.384,49.638z M25.994,76.523c-2.711,0-4.917-2.207-4.917-4.92s2.206-4.92,4.917-4.92
                        s4.917,2.207,4.917,4.92S28.706,76.523,25.994,76.523z M25.994,63.683c-3.695,0-6.797,2.549-7.666,5.979H7.118V23.477h50.706v13.067
                        v14.594v18.523H33.661C32.792,66.232,29.689,63.683,25.994,63.683z M76.854,76.523c-2.715,0-4.923-2.207-4.923-4.92
                        s2.208-4.92,4.923-4.92s4.924,2.207,4.924,4.92S79.568,76.523,76.854,76.523z M92.884,69.661h-8.357
                        c-0.87-3.43-3.975-5.979-7.673-5.979s-6.803,2.549-7.672,5.979h-8.357V51.138V38.044h22.801v13.094c0,0.828,0.672,1.5,1.5,1.5h7.759
                        V69.661z"/>
                      </svg>
                      <span v-if="!canAddToCart(item)">
                        <span class="delivery-info">{{getDeliveryInfo(item, getProductCartQty(item.id))}}</span>
                      </span>

                      <span v-else>
                        <span class="delivery-info">{{getDeliveryInfo(item, item.multiplicity, true)}}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </v-carousel-item>
        </v-carousel>
      </div>

      <v-snackbar
        v-model="snack"
        :timeout="3000"
        :color="snackColor"
        :bottom="true"
      >
        {{ snackText }}
        <v-btn flat @click="snack = false">
          <v-icon>close</v-icon>
        </v-btn>
      </v-snackbar>

      <v-dialog v-model="dialogImg" width="fit-content">
        <v-card>
          <v-card-title>
            <span class="headline image-modal">{{
              imgSliderName
            }}</span>
            <v-spacer />
            <v-flex xs1 sm1>
              <v-btn flat icon color="" @click="dialogImg = false">
                <v-icon>close</v-icon>
              </v-btn>
            </v-flex>
          </v-card-title>
          <div class="silerModal">
            <!--<el-carousel-->
            <!--:arrow="imgSlider.length <= 1 ? 'never' : 'hover'"-->
            <!--height="250px"-->
            <!--&gt;-->
            <!--<el-carousel-item v-for="(src, i) in imgSlider" :key="i">-->
            <img v-if="imgSlider[0]" :src="imgSlider[0].url" class="img__slider" />
            <!--</el-carousel-item>-->
            <!--</el-carousel>-->
          </div>
        </v-card>
      </v-dialog>
      <my-dialog
        :model="myDialog"
        :button-one="btnClose"
        :button-two="btnApprove"
        :item="dialogItem"
        :text="dialogText"
        :headline="dialogHeadline"
        @buttonOne="buttonOne"
        @buttonTwo="buttonTwo"
      >
        <p slot="text">{{ dialogText }}</p>
      </my-dialog>
    </div>
    <ModalExceeds :item="itemExceeds" :close="itemExceedsClose" />
  </div>
</template>

<script>
  import { mapGetters, mapActions } from "vuex"
  import CardLoad from "../../components/CardLoad"
  import ModalExceeds from "../../components/modalExceeds"
  import moment from "moment"
  import 'lazysizes'

  export default {
    name: "CatalogTile",
    components: { CardLoad, ModalExceeds },
    props: [
      "search",
      "isActive",
      "filterUuid",
      "listUpdate",
      "id",
      "locationId",
      "canLoad",
      "radiosSpecification",
      "deliveryDate",
      "dateFilterWithNoDate",
      "dataTable",
      "urlLink",
      "isTop",
      "total"
    ],
    data: () => ({
      slide: 0,
      carouselKey: 0,
      viewportWidth: 0,
      showCarousel: true,
      hoverCatalog: -1,
      noResult: false,
      pagination: {
        sortBy: "sort",
        rowsPerPage: 60,
        page: 1
      },
      itemExceeds: null,
      total_items: 0,
      total_pages: 0,
      loading: false,
      showImg: false,
      showImgDefault: true,
      selectedChild: [],
      dialogInput: false,
      summ__prod: [],
      snack: false,
      snackColor: "",
      snackText: "",
      quantity: "",
      idProd: -1,
      valProd: "",
      indexProd: -1,
      dialogImg: false,
      imgSlider: [],
      imgSliderName: "Зображення",
      loadingProduct: false,
      myDialog: false,
      dialogText: "",
      dialogItem: {},
      dialogHeadline: "",
      btnClose: {name: "Скасувати", class: "button__blue"},
      btnApprove: {name: "Підтвердити", class: "button__yellow"},
    }),
    computed: {
      ...mapGetters("basket", ["newBasketProduct", "idProduct"]),
      ...mapGetters("user", ["currentUser"]),
      perSlide() {
        const w = this.viewportWidth
        console.log(w, 'w')
        if (w < 500) return 2
        if (w < 800) return 3
        if (w < 1200) return 4
        if (w < 1960) return 5
        if (w < 2500) return 6
        if (w < 3000) return 7
        if (w < 3500) return 8
        if (w < 4000) return 9
        if (w < 4500) return 10
        return 11
      },
      carouselItems() {
        const size = this.perSlide
        const res = []

        for (let i = 0; i < this.dataTable.length; i += size) {
          res.push(this.dataTable.slice(i, i + size))
        }

        const lastItem = { is_empty: true }

        if (this.total && this.urlLink) {
          if (!res.length) {
            // если вообще нет данных
            res.push([lastItem])
          } else {
            const lastChunk = res[res.length - 1]

            if (lastChunk.length < size) {
              // есть место — добавляем в последний чанк
              lastChunk.push(lastItem)
            } else {
              // места нет — отдельным слайдом
              res.push([lastItem])
            }
          }
        }

        return res
      }
    },
    watch: {
      dataTable() {
        this.$emit("productData", this.dataTable)
      },
      dialogInput() {
        this.keymonitor()
      },
      newBasketProduct() {

        this.qantityFunc()
        this.checkMap()

        setTimeout(() => {
          if (this.dataTable.length > 0) {
            for(let i = 0; this.dataTable.length > i; i++) {
              if(this.newBasketProduct.length) {
                console.log(this.newBasketProduct)
                this.newBasketProduct.find(product => {
                  if(product.id === this.dataTable[i].id) {
                    this.dataTable[i].multiplicity_switch = product.is_strict_multiplicity
                  };
                });
              }
            }
          }
        }, 0)
      },
      pagination: {
        handler() {
          if (this.canLoad) {
            this.getDataFromApi(true, true);
          }
        },
        deep: true
      },
      canLoad() {
        this.pagination.page = 0
      },
      listUpdate(e) {
        if (e) {
          // this.getDataFromApi(true)
        }
      },
      total_items() {
        this.totalPages()
      },
      search(e) {
        this.$nextTick(() => {
          // this.getDataFromApi(true)
        })
      },
      // loading(e) {
      //   this.$loadingBus.$emit("loading", e)
      // },
      id(e) {
        this.getDataFromApi()
      },
      radiosSpecification() {
        this.pagination.page = 1;
        this.getDataFromApi(true)
      },
      deliveryDate() {
        this.getDataFromApi(true)
      },
      dateFilterWithNoDate() {
        this.getDataFromApi(true)
      },
      locationId(e) {
        this.getDataFromApi()
      },
      $route(to, from) {
        // if (to != from) {
        //   this.pagination.page = 1;
        //   this.getDataFromApi(true);
        // }
      },
    },

    created() {
      this.checkMap()
    },
    mounted() {
      this.viewportWidth = window.innerWidth
      window.addEventListener('resize', this.onResize)
      window.visualViewport.addEventListener('resize', this.onResize)

      // тест
      console.log('listener added')

      if (this.canLoad) {
        this.getDataFromApi(true)
        // if (this.$store.getters["category/searchCatalog"] === "") {
        //   this.getDataFromApi(true)
        // } else {
        //   return false
        // }
      }
    },
    beforeDestroy() {
      window.removeEventListener('resize', this.onResize)
      window.visualViewport.removeEventListener('resize', this.onResize)
    },

    methods: {
      setImageError(item) {
        this.$set(item, "imageError", true);
      },

      onImageLoad(event) {
        event.target.classList.add("finishLoad");
      },
      onResize() {
        this.viewportWidth = window.innerWidth
        this.slide = 0
      },
      nextSlide () {
        if (this.slide < this.carouselItems.length - 1) {
          this.slide++
        }
      },
      prevSlide () {
        if (this.slide > 0) {
          this.slide--
        }
      },
      getDeliveryInfo(item, count, first = false) {
        if ((item.strict_multiplicity && first) || (item.multiplicity_switch && first)) {
          count = item.multiplicity;
        } else if (first) {
          count = 1;
        }
        const now = new Date();
        // const now = new Date(new Date().getTime() + 24 * 5 * 60 * 60 * 1000);
        const nowTime = now.getHours() * 60 + now.getMinutes();
        const dayNumber = moment(now).day();
        let devDate;

        if (+item.leftovers_salvi >= count) {
          if (nowTime < 900) {
            if (dayNumber === 5) {
              devDate = new Date(now.getTime() + 72 * 60 * 60 * 1000);
            } else if (dayNumber === 6) {
              devDate = new Date(now.getTime() + 72 * 60 * 60 * 1000);
            } else if (dayNumber === 0) {
              devDate = new Date(now.getTime() + 48 * 60 * 60 * 1000);
            } else {
              return 'Доставка на наступний робочий день';
            }
          } else {
            if (dayNumber === 4) {
              devDate = new Date(now.getTime() + 96 * 60 * 60 * 1000);
            } else if (dayNumber === 5) {
              devDate = new Date(now.getTime() + 96 * 60 * 60 * 1000);
            } else if (dayNumber === 6) {
              devDate = new Date(now.getTime() + 72 * 60 * 60 * 1000);
            } else {
              devDate = new Date(now.getTime() + 48 * 60 * 60 * 1000);
            }
          }
        } else if (+item.leftovers_salvi + item.leftovers_supplier >= count) {
          if (item.supplier_delivery_postpone < 2) {
            if (nowTime < 900) {
              if (dayNumber === 5) {
                devDate = new Date(now.getTime() + 72 * 60 * 60 * 1000);
              } else if (dayNumber === 6) {
                devDate = new Date(now.getTime() + 72 * 60 * 60 * 1000);
              } else if (dayNumber === 0) {
                devDate = new Date(now.getTime() + 48 * 60 * 60 * 1000);
              } else {
                return 'Доставка на наступний робочий день';
              }
            } else {
              if (dayNumber === 4) {
                devDate = new Date(now.getTime() + 96 * 60 * 60 * 1000);
              } else if (dayNumber === 5) {
                devDate = new Date(now.getTime() + 96 * 60 * 60 * 1000);
              } else if (dayNumber === 6) {
                devDate = new Date(now.getTime() + 72 * 60 * 60 * 1000);
              } else {
                devDate = new Date(now.getTime() + 48 * 60 * 60 * 1000);
              }
            }
          } else {
            const dateSup = new Date(now.getTime() + 24 * (item.supplier_delivery_postpone - 1) * 60 * 60 * 1000);
            const dayNumberSup = moment(dateSup).day();

            if (nowTime < 900) {
              if (dayNumberSup === 5) {
                devDate = new Date(dateSup.getTime() + 72 * 60 * 60 * 1000);
              } else if (dayNumberSup === 6) {
                devDate = new Date(dateSup.getTime() + 72 * 60 * 60 * 1000);
              } else if (dayNumberSup === 0) {
                devDate = new Date(dateSup.getTime() + 72 * 60 * 60 * 1000);
              } else if (dayNumberSup === 1) {
                devDate = new Date(dateSup.getTime() + 48 * 60 * 60 * 1000);
              } else {
                devDate = new Date(dateSup.getTime() + 24 * 60 * 60 * 1000);
              }
            } else {
              if (dayNumberSup === 4) {
                devDate = new Date(dateSup.getTime() + 96 * 60 * 60 * 1000);
              }else if (dayNumberSup === 5) {
                devDate = new Date(dateSup.getTime() + 96 * 60 * 60 * 1000);
              } else if (dayNumberSup === 6) {
                devDate = new Date(dateSup.getTime() + 96 * 60 * 60 * 1000);
              } else if (dayNumberSup === 0) {
                devDate = new Date(dateSup.getTime() + 72 * 60 * 60 * 1000);
              } else {
                devDate = new Date(dateSup.getTime() + 48 * 60 * 60 * 1000);
              }
            }
          }
        } else {
          return 'повідомимо додатково';
        }

        return `Доступно на ${moment(devDate).format("DD.MM.YYYY")}`;
      },


      buttonOne() {
        if (this.myDialogAction == "deleteItemCardProduct") {
          this.myDialog = false
          // this.getDataFromApi();
          this.myDialogAction = ""
        }
      },
      buttonTwo(e, i) {
        if (this.myDialogAction == "deleteItemCardProduct") {
          let dellete
          this.newBasketProduct.filter(e => {
            if (e.product.id == this.dialogItem.id) return (dellete = e)
          })
          this.arrDelete.push(dellete)
          this.deleteItemNewBasket(e, i)
          this.myDialog = false
          this.myDialogAction = ""
        }
      },
      deleteItemCardProduct(item) {
        this.myDialog = true
        this.myDialog = true
        this.dialogHeadline = "Підтвердіть дію"
        this.dialogText = "Ви впевнені, що хочете видалити товар з кошика?"
        this.myDialogAction = "deleteItemCardProduct"
        this.dialogItem = item
      },
      deleteItemNewBasket(e, i) {
        this.socketEmitFreez(true)
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
          // eslint-disable-next-line no-unused-vars
          .then(response => {
            // if(response.data.success){
            this.socketEmit()
            // }
          })
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
      setImage(url) {
        return url.replace('https://api.salvi.ua', 'https://salvi.ua/')
      },
      itemExceedsClose() {
        this.itemExceeds = null;
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
              discount_price: item.discount_price
            })
            // eslint-disable-next-line no-unused-vars
            .then(response => {
              // this.socketEmitFreez(false);
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
                      is_temperature_conditions : item.is_temperature_conditions,
                      discount_price: item.discount_price
                    }
                  })
                })
              }
            });


          this.snack = true;
          this.snackColor = "#19B200";
          this.snackText = "Зміни збережені";
          // } else if(sum <= 0) {
          //     this.snack = true;
          //     this.snackColor = "#ff2525";
          //     this.snackText = "число больше 0 !";
          // }
        }

      },
      changeItemQty(qty, item) {
        item.quantity = qty;
      },
      updateCategory(item) {
        this.$store.dispatch("category/setUUID", { ctx: item.category.uuid })
        this.$loadingBus.$emit("updateBreadcrum", item.category.name)
      },
      ...mapActions("basket", ["setNewBasketProduct", "setValueSelect"]),
      closeDialogInput() {
        this.dialogInput = false
        this.summ__prod = [""]
      },
      openImg(item, name) {
        if (item.length > 0) {
          this.dialogImg = true
          this.imgSlider = item
          this.imgSliderName = name
        }
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
      btnId(e) {
        let s = this.selectedChild
        let visible = false
        for (let i = 0; i < s.length; i++) {
          if (this.selectedChild[i] == e.id) {
            visible = true
          }
        }
        if (visible == true) {
          return true
        }
      },
      checkMap() {
        this.qantityFunc()
        this.selectedChild = this.newBasketProduct.map(ctx => {
          return ctx.id
        })
      },
      changeCheckbox(e, index) {
        this.socketEmitFreez(true)
        let $false = false
        let s = this.selectedChild
        for (let i = 0; i < s.length; i++) {
          if (this.selectedChild[i] == e.id) {
            $false = true
          }
        }
        this.setNewBasketProduct({
          ctx: {
            index: index,
            id: e.id,
            quantity: e.quantity,
            val: $false,
            price: e.price
          }
        })
        this.$api
          .post("/cart/delete-product", {
            order_id: this.idProduct.order_id,
            product_id: e.id
          })
          // eslint-disable-next-line no-unused-vars
          .then(response => {
            this.socketEmit()
          })
      },
      dialogQuantity(id, quantity, e, index) {
        this.idProd = e.id
        this.valProd = e
        this.dialogInput = true
        this.indexProd = index
      },
      qantityFunc() {
        let e = this.newBasketProduct
        this.dataTable.forEach(i => {
          e.forEach(n => {
            if (i.id == n.id) {
              i.quantity = n.quantity
            } else {
              i.quantity
            }
          })
        })
      },
      num__input(e) {
        this.summ__prod.push(e)
      },
      saveQuality() {
        this.socketEmitFreez(true)
        let sum = this.summ__prod.reduce((a, b) => a + b, 0)
        if (this.idProd == this.valProd.id) {
          if (sum > 0) {
            this.valProd.quantity = +this.summ__prod.join("")
            this.summ__prod = []
            let e = this.valProd
            let $false = false
            let s = this.selectedChild

            this.selectedChild.push(this.idProd)
            for (let i = 0; i < s.length; i++) {
              if (this.selectedChild[i] == e.id) {
                $false = true
              }
            }
            let newProduct = true
            let changeQuantity = false
            let index = undefined
            this.newBasketProduct.forEach(i => {
              if (i.id == e.id) {
                i.newProduct ? (newProduct = true) : (newProduct = false)
                index = i.index
              }
            })
            if (!e.newProduct) {
              changeQuantity = true
            }
            let price = e.price
            price = price.replace(/[\s,%]/g, "")
            let total_sum = +price * +e.quantity
            this.$api
              .post("/cart/add-product", {
                id: this.idProduct.id,
                order_id: this.idProduct.order_id,
                product_id: e.id,
                quantity: e.quantity,
                price: e.price
              })
              // eslint-disable-next-line no-unused-vars
              .then(response => {
                // this.socketEmitFreez(false);
                if (response.data.success) {
                  this.socketEmit()
                  this.$nextTick(() => {
                    this.setNewBasketProduct({
                      ctx: {
                        index: index,
                        id: e.id,
                        addId: undefined,
                        lastUpdate: true,
                        quantity: e.quantity,
                        val: $false,
                        total_sum: total_sum.toFixed(2),
                        price: e.price,
                        img: e.img,
                        name: e.name,
                        newProduct: newProduct,
                        changeQuantity: changeQuantity
                      }
                    })
                  })
                }
              })
            this.dialogInput = false

            this.snack = true
            this.snackColor = "#19B200"
            this.snackText = "Зміни збережені"
          } else if (sum <= 0) {
            this.snack = true
            this.snackColor = "#ff2525"
            this.snackText = "число больше 0 !"
          }
        }
      },
      socketEmit() {
        this.$socket.emit("userCartAction", {
          order_id: this.idProduct.order_id,
          user_id: this.currentUser.id,
          update: true
        })
      },
      socketEmitFreez(freez) {
        this.$socket.emit("userCartAction", {
          order_id: this.idProduct.order_id,
          user_id: this.currentUser.id,
          update: false,
          freez: freez
        })
      },
      keyOn(e) {
        if (
          e.key == 1 ||
          e.key == 2 ||
          e.key == 3 ||
          e.key == 4 ||
          e.key == 5 ||
          e.key == 6 ||
          e.key == 7 ||
          e.key == 8 ||
          e.key == 9 ||
          e.key == 0
        ) {
          this.dataKey = e.key
          this.summ__prod.push(this.dataKey)
        }
        if (e.key == "Enter") {
          this.saveQuality()
        }
        if (e.key == "Backspace") {
          this.summ__prod.splice(-1, 1)
        }
      },
      keymonitor() {
        if (this.dialogInput) {
          document.addEventListener("keydown", this.keyOn)
        } else {
          document.removeEventListener("keydown", this.keyOn)
        }
      },

      totalPages() {
        if (this.total_items > 0) {
          this.pagination.page = 1
          this.total_pages = Math.ceil(
            this.total_items / this.pagination.rowsPerPage
          )
        } else {
          this.total_pages = 0
        }
      },
      hoverItem(index) {
        this.hoverCatalog = index
      },
      handleChangeMultiplicity(id) {
        const index = this.dataTable.findIndex(item => item.id === id)
        if (index === -1) return

        const el = this.dataTable[index]

        if (!this.canAddToCart(el)) {
          el.multiplicity_switch = !el.multiplicity_switch
          this.changeQuantity(
            el,
            this.getProductCartQty(el.id),
            index,
            el.id
          )
        } else {
          this.$set(this.dataTable, index, {
            ...el,
            multiplicity_switch: !el.multiplicity_switch
          })
        }

        this.socketEmit()
      },
      async getDataFromApi(loadCard, scroll = false) {
        if (loadCard) {
          this.loadingProduct = true
        } else {
          this.loading = true
        }

        // let url = "/graphql"
        let order = "ASC"
        if (this.pagination.descending) {
          order = "DESC"
        }
        let order_id = ""
        if (this.locationId) {
          order_id = "location_id: " + this.locationId
        } else if (this.id != undefined) {
          order_id = "order_id: " + this.id
        }
        let add_product = false
        if (this.$route.name == "order-add-product") {
          add_product = true
        }

        await this.$api
          .post("/search/search", {
            query: this.search,
            order: order,
            order_id: order_id,
            pagination: this.pagination,
            specification_only: this.radiosSpecification,
            add_product: add_product,
            location_id: this.locationId,
            category: this.filterUuid,
            delivery_date: this.deliveryDate,
            with_no_date_product: this.dateFilterWithNoDate,
          })
          .then(response => {
            const data = response.data.model

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

            this.dataTable = data

            this.total_items = response.data.total
            if (this.search.length > 0) {
              this.total_pages = Math.ceil(
                this.total_items / 60
              )
            }
            this.noResult = response.data.is_search_empty
            this.showImg = false
            this.showImgDefault = true
            setTimeout(() => {
              this.showImg = true
              this.loadingProduct = false
            }, 300)
            this.loading = false
            setTimeout(() => (this.showImgDefault = false), 10000);
            if (scroll) {
              this.$nextTick(() => {
                console.log('scroll')
                window.scrollTo({ top: 0, behavior: 'smooth' });
              });
            }
          })
        this.$emit("listUpdated", false)
      }
    }
  }
</script>

<style scoped lang="scss">
  .price {
    flex-wrap: wrap;
  }
  .price .old {
    font-size: 14px !important;
    font-weight: 400 !important;
    color: gray !important;
    text-decoration: line-through !important;
    padding-left: 10px;
  }
  .item__last {
    min-height: 350px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    font-size: 18px;
  }
  .slider {

    &__col {
      flex: 0 0 calc(100% / var(--per-slide, 4));
      max-width: calc(100% / var(--per-slide, 4));
      padding: 5px 10px;
    }

    /* если хочешь ограничить на мобилке */
    @media (max-width: 959px) {
      &__col {
        flex-basis: calc(100% / var(--per-slide-mobile, 2));
        max-width:  calc(100% / var(--per-slide-mobile, 2));
      }
    }

    &__row {
      display: flex;
    }
  }
  .item__top {
    position: absolute;
    top: 10px;
    left: 10px;
    z-index: 10;
    padding: 5px 10px;
    background: #269447;
    border-radius: 10px;
    color: #fff;
    text-transform: uppercase;
    font-size: 13px;
    font-weight: 700;
  }
  .slider__header-nav {
    margin: 0 5px;
    cursor: pointer;
    height: 40px;
    width: 40px;
    background: #F6F6F8;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all ease-in-out .3s;

    &:hover {
      background: #dadadc;
      transition: all ease-in-out .3s;
    }

    &.prev {
      transform: rotate(180deg);
    }

    &.disabled {
      opacity: 0.5;
      cursor: auto;
    }
  }
  .slider__header-button {
    margin-right: 10px;
    color: #38AB5B;
    font-size: 14px;
    cursor: pointer;
    padding: 5px 10px;
    height: 40px;
    display: flex;
    align-items: center;
    background: #F6F6F8;
    border-radius: 8px;
    transition: all ease-in-out .3s;

    &:hover {
      background: #dadadc;
      transition: all ease-in-out .3s;
    }
  }
  .slider__header {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding-bottom: 10px;
  }
  .catalog__tile {
    display: flex;
    justify-content: space-between;
    padding-bottom: 30px;

    .item {
      width: 100%;
      height: 100%;
    }
  }
  .v-carousel {
    box-shadow: none;
  }
  .icon__isTemp {
    position: absolute;
    z-index: 9;
    top: 10px;
    left: 10px;
    color: #3d4465;

    svg {
      width: 25px;
      height: 25px;
    }
  }

  .icon__isSpec {
    color: #3d4465 !important;
    margin-left: 15px;

    svg {
      width: 20px;
      height: 20px;
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
    flex-wrap: wrap;
  }
  .catalog__tile .item__body .price span.new-price {
    color: #e10000;
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
    margin-right: 10px;
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
  .silerModal {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .silerModal .img__slider {
    width: fit-content;
    height: fit-content;
    max-width: 90vw;
    max-height: 90vh;
  }
  .image-modal {
    width: fit-content;
  }
  .scaleBtn-enter-active,
  .scaleBtn-leave-active,
  .scaleBtn-move {
    transition: 600ms;
    transition-property: opacity, transform;
  }

  .price .name {
    display: flex;
    align-items: center;
  }

  .search__no-result-text {
    font-size: 20px;
    text-align: center;
  }

  .search__no-result-buttons {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
  }

  .search__no-result-button {
    margin: 0 10px 20px;
  }

  .chip a {
    color: #3181ff;
  }

  .chip__item {
    cursor: pointer;
  }

  .chip__item:hover {
    text-decoration: underline;
  }

  .scaleBtn-enter {
    transition: 100ms;
    opacity: 0;
    transform: rotateX(180deg);
  }

  .scaleBtn-enter-to {
    opacity: 1;
    transition: 0.5s;
    transform: rotateX(0deg) scale(0.9);
  }

  .scaleBtn-leave-active {
    transform: rotateX(0deg);
    opacity: 0;
    position: absolute;
    transition: 0.3s;
  }

  .scaleBtn-leave-to {
    opacity: 0;
    transform-origin: center top;
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

  .removeItem i {
    color: #CCCCCC;
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

</style>

<template>
  <div v-on-click-outside="hide" class="categoryBox">
    <button
      v-if="
        $root.rbac.viewCatalog &&
          $store.getters['user/currentUser'].company_id !== 0
      "
      class="button__category"
      :class="{ active: $store.getters['category/modalCategory'] }"
      @click="$store.dispatch('category/setModalCategory', { ctx: true })"
    >
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4.47369 0C5.06118 0 5.64292 0.115715 6.18569 0.340539C6.72846 0.565363 7.22164 0.894892 7.63706 1.31031C8.05248 1.72573 8.38201 2.21891 8.60683 2.76168C8.83165 3.30445 8.94737 3.88619 8.94737 4.47368V8.94737H4.47369C3.28719 8.94737 2.14929 8.47603 1.31031 7.63706C0.471335 6.79808 1.91204e-06 5.66018 1.91204e-06 4.47368C1.91204e-06 3.28719 0.471335 2.14929 1.31031 1.31031C2.14929 0.471333 3.28719 0 4.47369 0ZM6.84211 6.8421V4.47368C6.84211 4.00525 6.7032 3.54734 6.44296 3.15786C6.18271 2.76838 5.81281 2.46481 5.38004 2.28555C4.94727 2.10629 4.47106 2.05939 4.01163 2.15077C3.5522 2.24216 3.13019 2.46773 2.79896 2.79896C2.46773 3.13019 2.24216 3.5522 2.15077 4.01163C2.05939 4.47106 2.10629 4.94727 2.28555 5.38004C2.46481 5.81281 2.76838 6.18271 3.15786 6.44295C3.54735 6.7032 4.00526 6.8421 4.47369 6.8421H6.84211ZM4.47369 11.0526H8.94737V15.5263C8.94737 16.4111 8.68499 17.2761 8.19342 18.0118C7.70184 18.7475 7.00315 19.3209 6.18569 19.6595C5.36823 19.9981 4.46872 20.0867 3.60091 19.914C2.7331 19.7414 1.93597 19.3153 1.31031 18.6897C0.684658 18.064 0.258581 17.2669 0.0859626 16.3991C-0.0866555 15.5313 0.00193837 14.6318 0.340541 13.8143C0.679143 12.9969 1.25255 12.2982 1.98824 11.8066C2.72393 11.315 3.58887 11.0526 4.47369 11.0526ZM4.47369 13.1579C4.00526 13.1579 3.54735 13.2968 3.15786 13.557C2.76838 13.8173 2.46481 14.1872 2.28555 14.62C2.10629 15.0527 2.05939 15.5289 2.15077 15.9884C2.24216 16.4478 2.46773 16.8698 2.79896 17.201C3.13019 17.5323 3.5522 17.7578 4.01163 17.8492C4.47106 17.9406 4.94727 17.8937 5.38004 17.7145C5.81281 17.5352 6.18271 17.2316 6.44296 16.8421C6.7032 16.4527 6.84211 15.9947 6.84211 15.5263V13.1579H4.47369ZM15.5263 0C16.7128 0 17.8507 0.471333 18.6897 1.31031C19.5287 2.14929 20 3.28719 20 4.47368C20 5.66018 19.5287 6.79808 18.6897 7.63706C17.8507 8.47603 16.7128 8.94737 15.5263 8.94737H11.0526V4.47368C11.0526 3.28719 11.524 2.14929 12.3629 1.31031C13.2019 0.471333 14.3398 0 15.5263 0ZM15.5263 6.8421C15.9947 6.8421 16.4527 6.7032 16.8421 6.44295C17.2316 6.18271 17.5352 5.81281 17.7145 5.38004C17.8937 4.94727 17.9406 4.47106 17.8492 4.01163C17.7578 3.5522 17.5323 3.13019 17.201 2.79896C16.8698 2.46773 16.4478 2.24216 15.9884 2.15077C15.5289 2.05939 15.0527 2.10629 14.62 2.28555C14.1872 2.46481 13.8173 2.76838 13.557 3.15786C13.2968 3.54734 13.1579 4.00525 13.1579 4.47368V6.8421H15.5263ZM11.0526 11.0526H15.5263C16.4111 11.0526 17.2761 11.315 18.0118 11.8066C18.7475 12.2982 19.3209 12.9969 19.6595 13.8143C19.9981 14.6318 20.0867 15.5313 19.914 16.3991C19.7414 17.2669 19.3153 18.064 18.6897 18.6897C18.064 19.3153 17.2669 19.7414 16.3991 19.914C15.5313 20.0867 14.6318 19.9981 13.8143 19.6595C12.9969 19.3209 12.2982 18.7475 11.8066 18.0118C11.315 17.2761 11.0526 16.4111 11.0526 15.5263V11.0526ZM13.1579 13.1579V15.5263C13.1579 15.9947 13.2968 16.4527 13.557 16.8421C13.8173 17.2316 14.1872 17.5352 14.62 17.7145C15.0527 17.8937 15.5289 17.9406 15.9884 17.8492C16.4478 17.7578 16.8698 17.5323 17.201 17.201C17.5323 16.8698 17.7578 16.4478 17.8492 15.9884C17.9406 15.5289 17.8937 15.0527 17.7145 14.62C17.5352 14.1872 17.2316 13.8173 16.8421 13.557C16.4527 13.2968 15.9947 13.1579 15.5263 13.1579H13.1579Z" fill="white"/>
      </svg>
      Каталог Товарів
    </button>
    <button v-else class="button__category disabled">
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4.47369 0C5.06118 0 5.64292 0.115715 6.18569 0.340539C6.72846 0.565363 7.22164 0.894892 7.63706 1.31031C8.05248 1.72573 8.38201 2.21891 8.60683 2.76168C8.83165 3.30445 8.94737 3.88619 8.94737 4.47368V8.94737H4.47369C3.28719 8.94737 2.14929 8.47603 1.31031 7.63706C0.471335 6.79808 1.91204e-06 5.66018 1.91204e-06 4.47368C1.91204e-06 3.28719 0.471335 2.14929 1.31031 1.31031C2.14929 0.471333 3.28719 0 4.47369 0ZM6.84211 6.8421V4.47368C6.84211 4.00525 6.7032 3.54734 6.44296 3.15786C6.18271 2.76838 5.81281 2.46481 5.38004 2.28555C4.94727 2.10629 4.47106 2.05939 4.01163 2.15077C3.5522 2.24216 3.13019 2.46773 2.79896 2.79896C2.46773 3.13019 2.24216 3.5522 2.15077 4.01163C2.05939 4.47106 2.10629 4.94727 2.28555 5.38004C2.46481 5.81281 2.76838 6.18271 3.15786 6.44295C3.54735 6.7032 4.00526 6.8421 4.47369 6.8421H6.84211ZM4.47369 11.0526H8.94737V15.5263C8.94737 16.4111 8.68499 17.2761 8.19342 18.0118C7.70184 18.7475 7.00315 19.3209 6.18569 19.6595C5.36823 19.9981 4.46872 20.0867 3.60091 19.914C2.7331 19.7414 1.93597 19.3153 1.31031 18.6897C0.684658 18.064 0.258581 17.2669 0.0859626 16.3991C-0.0866555 15.5313 0.00193837 14.6318 0.340541 13.8143C0.679143 12.9969 1.25255 12.2982 1.98824 11.8066C2.72393 11.315 3.58887 11.0526 4.47369 11.0526ZM4.47369 13.1579C4.00526 13.1579 3.54735 13.2968 3.15786 13.557C2.76838 13.8173 2.46481 14.1872 2.28555 14.62C2.10629 15.0527 2.05939 15.5289 2.15077 15.9884C2.24216 16.4478 2.46773 16.8698 2.79896 17.201C3.13019 17.5323 3.5522 17.7578 4.01163 17.8492C4.47106 17.9406 4.94727 17.8937 5.38004 17.7145C5.81281 17.5352 6.18271 17.2316 6.44296 16.8421C6.7032 16.4527 6.84211 15.9947 6.84211 15.5263V13.1579H4.47369ZM15.5263 0C16.7128 0 17.8507 0.471333 18.6897 1.31031C19.5287 2.14929 20 3.28719 20 4.47368C20 5.66018 19.5287 6.79808 18.6897 7.63706C17.8507 8.47603 16.7128 8.94737 15.5263 8.94737H11.0526V4.47368C11.0526 3.28719 11.524 2.14929 12.3629 1.31031C13.2019 0.471333 14.3398 0 15.5263 0ZM15.5263 6.8421C15.9947 6.8421 16.4527 6.7032 16.8421 6.44295C17.2316 6.18271 17.5352 5.81281 17.7145 5.38004C17.8937 4.94727 17.9406 4.47106 17.8492 4.01163C17.7578 3.5522 17.5323 3.13019 17.201 2.79896C16.8698 2.46773 16.4478 2.24216 15.9884 2.15077C15.5289 2.05939 15.0527 2.10629 14.62 2.28555C14.1872 2.46481 13.8173 2.76838 13.557 3.15786C13.2968 3.54734 13.1579 4.00525 13.1579 4.47368V6.8421H15.5263ZM11.0526 11.0526H15.5263C16.4111 11.0526 17.2761 11.315 18.0118 11.8066C18.7475 12.2982 19.3209 12.9969 19.6595 13.8143C19.9981 14.6318 20.0867 15.5313 19.914 16.3991C19.7414 17.2669 19.3153 18.064 18.6897 18.6897C18.064 19.3153 17.2669 19.7414 16.3991 19.914C15.5313 20.0867 14.6318 19.9981 13.8143 19.6595C12.9969 19.3209 12.2982 18.7475 11.8066 18.0118C11.315 17.2761 11.0526 16.4111 11.0526 15.5263V11.0526ZM13.1579 13.1579V15.5263C13.1579 15.9947 13.2968 16.4527 13.557 16.8421C13.8173 17.2316 14.1872 17.5352 14.62 17.7145C15.0527 17.8937 15.5289 17.9406 15.9884 17.8492C16.4478 17.7578 16.8698 17.5323 17.201 17.201C17.5323 16.8698 17.7578 16.4478 17.8492 15.9884C17.9406 15.5289 17.8937 15.0527 17.7145 14.62C17.5352 14.1872 17.2316 13.8173 16.8421 13.557C16.4527 13.2968 15.9947 13.1579 15.5263 13.1579H13.1579Z" fill="white"/>
      </svg>
      Каталог Товарів
    </button>
    <div
      v-if="!$store.getters['params/mobileView']"
      class="filterCatalog"
      :class="{ open: $store.getters['category/modalCategory'] }"
    >
      <div v-if="categoryData.length" class="parent">
        <div
          v-for="(item, index) of categoryData"
          :key="index"
          class="item"
          :class="{ open: isOpenCategory === index, 'hot-category': item.name === 'ANTI COVID19' }"
          @mouseover="getChildren(item.children, index, false, item.code, item.name)"
        >
          <div class="image">
            <img
              v-if="item.img_path && !item.imageError"
              :src="item.img_path"
              @error="setImageError(item)"
              :alt="item.name"
            />
            <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M97.5 400l50-160 379.4 0-50 160-379.4 0zm190.7 48L477 448c21 0 39.6-13.6 45.8-33.7l50-160c9.7-30.9-13.4-62.3-45.8-62.3l-379.4 0c-21 0-39.6 13.6-45.8 33.7L80.2 294.4 80.2 96c0-8.8 7.2-16 16-16l138.7 0c3.5 0 6.8 1.1 9.6 3.2L282.9 112c13.8 10.4 30.7 16 48 16l117.3 0c8.8 0 16 7.2 16 16l48 0c0-35.3-28.7-64-64-64L330.9 80c-6.9 0-13.7-2.2-19.2-6.4L273.3 44.8C262.2 36.5 248.8 32 234.9 32L96.2 32c-35.3 0-64 28.7-64 64l0 288c0 35.3 28.7 64 64 64l192 0z"/></svg>
          </div>
          <router-link
            class="name ellipsis"
            :title="item.name"
            :to="`/catalog/${item.code}`"
          >
            {{ item.name }}
          </router-link>
          <v-icon
            v-if="item.has_child"
            @click="getChildren(item.children, index, false, item.code, item.name)"
          >
            keyboard_arrow_right
          </v-icon>
        </div>
      </div>
      <div
        v-if="categoryData.length"
        class="children"
      >
        <div class="children title">
          {{parentName}}
        </div>
        <div
          v-masonry
          transition-duration="0s"
          item-selector=".item"
        >
          <div
            v-for="(item, index) in children"
            :key="index"
            v-masonry-tile
            class="item"
          >
            <div class="parent-child">
              <tree-item :item="item" :main="true" :parent="parentCode" @getItem="getItem" />
            </div>
          </div>
        </div>
      </div>
      <div v-if="!categoryData.length" class="noCategory">
        <span>немає доступних категорій</span>
      </div>
    </div>
    <div
      v-else
      class="filterCatalogMobile"
      :class="{ open: $store.getters['category/modalCategory'] }"
    >
      <v-btn
        v-if="!categoryData.length"
        flat
        icon
        color="#F24949"
        class="close"
        @click="$store.dispatch('category/setModalCategory', { ctx: true })"
      >
        <v-icon>close</v-icon>
      </v-btn>
      <div
        v-for="(item, index) of categoryData"
        :key="index"
        class="item item-parent"
        :class="{ open: isOpenCategory === index }"
      >
        <div class="item-top">
          <router-link class="name" :to="`/catalog/${item.code}`">
            {{ item.name }}
          </router-link>
          <v-icon
            v-if="item.has_child"
            @click="getChildren(item.children, index, true)"
          >
            keyboard_arrow_right
          </v-icon>
        </div>
        <div v-if="isOpenCategory === index" class="child">
          <div v-for="(i, index) in children" :key="index" class="item">
            <div class="parent-child">
              <tree-item :item="i" :main="true" :parent="item.code" @getItem="getItem" />
            </div>
          </div>
        </div>
      </div>
      <div v-if="!categoryData.length" class="noCategory">
        <span>немає доступних категорій</span>
      </div>
    </div>
  </div>
</template>

<style>
  .hot-category {
    color: red;
    font-weight: bold;
  }
</style>

<script>
import TreeItem from "./tree-item"
export default {
  name: "Category",
  components: { TreeItem },
  data: () => ({
    isOpenCategory: -1,
    categoryData: [],
    children: [],
    uuid: "",
    parentCode: "",
    parentName: "",
  }),
  computed: {
    companyChange() {
      return this.$store.getters["user/currentUser"].company_id
    }
  },
  watch: {
    companyChange() {
      this.getCategory()
    },
    uuid(e) {
      this.$store.dispatch("category/setUUID", { ctx: e })
    },
    $route(to, from) {
      if (to.fullPath !== "/catalog") {
        this.$store.dispatch("category/setSearchCatalog", {
          ctx: "",
          update: false
        })
        this.$store.dispatch("category/setModalCategory", { ctx: false })
      }
    }
  },
  created() {
    this.$loadingBus.$on("updateBreadcrum", this.categoryProduct)
  },
  mounted() {
    this.getCategory()
  },
  methods: {
    setImageError(item) {
      this.$set(item, "imageError", true);
    },
    hide() {
      if (!this.$store.getters["params/mobileView"]) {
        this.$store.dispatch("category/setModalCategory", { ctx: false })
      }
    },
    categoryProduct(item) {
      this.$store.dispatch("category/setBreadcrumb", { ctx: false })
      this.categoryData.forEach(e => {
        this.treeCategotyID(e, item.category_id)
      })
    },
    treeCategotyID(ctx, id) {
      if (ctx.has_child == "1" && ctx.children !== undefined) {
        ctx.children.forEach(i => {
          if (i.id == id) {
            this.goToCatalog(i)
          } else {
            this.treeCategotyID(i, id)
          }
        })
      }
    },
    treeCategory(ctx, parentId) {
      if (ctx.id == parentId) {
        this.$store.dispatch("category/setBreadcrumb", { ctx: ctx })
      }
      if (ctx.has_child == "1" && ctx.children !== undefined) {
        ctx.children.forEach(item => {
          if (item.id == parentId) {
            this.$store.dispatch("category/setBreadcrumb", { ctx: item })
            this.categoryData.forEach(e => {
              this.treeCategory(e, item.parent_id)
            })
          } else if (item.has_child == "1") {
            this.treeCategory(item, parentId)
          }
        })
      }
    },
    goToCatalog(item) {
      this.$store.dispatch("category/setBreadcrumb", { ctx: false })
      this.$store.dispatch("category/setBreadcrumb", { ctx: item })
      this.categoryData.forEach(e => {
        this.treeCategory(e, item.parent_id)
      })
      // this.uuid = item.uuid
      this.$store.dispatch("category/setUUID", { ctx: item.uuid })
      this.$store.dispatch("category/setModalCategory", { ctx: false })
      if (this.$route.fullPath !== "/catalog") {
        this.$router.push("/catalog")
      }
    },
    getItem(item) {
      this.goToCatalog(item)
    },
    getCategory() {
      let obj = {}
      if (this.location_id && this.order_id !== undefined) {
        obj = { location_id: this.location_id, order_id: this.order_id }
      } else if (this.order_id !== undefined) {
        obj = { order_id: this.order_id }
      } else if (this.location_id) {
        obj = { location_id: this.location_id }
      }
      obj.add_product = false
      if (this.$route.name === "order-add-product") {
        obj.add_product = true
      }
      this.$api.post("/categories", obj).then(response => {
        this.categoryData = response.data.category.tree
      })
    },
    getChildren(child, index, toggle, parentCode, parentName) {
      this.parentName = parentName
      this.parentCode = parentCode
      this.children = child
      if (index === this.isOpenCategory && toggle) {
        this.isOpenCategory = -1
      } else {
        this.isOpenCategory = index
      }
      this.$nextTick(() => this.$redrawVueMasonry())
    }
  }
}
</script>

<style type="scss">
  .catalog-enter-active,
  .catalog-leave-active {
    transition: all 0.3s ease;
  }

  .catalog-enter,
  .catalog-leave-to {
    opacity: 0;
    transform: translateY(-10px);
  }
  .item a {
    color: inherit;
  }
  .filterCatalog div.children {
    display: block;

    .title {
      padding: 10px 10px 30px;
      font-size: 24px;
      font-weight: 700;
    }
  }
  div.filterCatalog {
    grid-template-columns: 300px 1fr;
  }
  .filterCatalog .parent div.item {
    grid-template-columns: 40px 1fr 16px;
  }
  .filterCatalog .parent .item .image {
    width: 30px;
    height: 30px;
    min-width: 30px;
    min-height: 30px;
    overflow: hidden;
    border-radius: 50px;
    margin-right: 10px;
    background: #e9e9e9;
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    svg {
      width: 20px;
      height: 20px;
      min-width: 20px;
      min-height: 20px;
      margin: 0;

      path {
        fill: #434343!important;
      }
    }
  }
</style>

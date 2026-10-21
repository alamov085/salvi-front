<template>
  <div
    class="v-sidebar-menu"
    :class="[
      !isCollapsed ? 'vsm-default' : 'vsm-collapsed',
      theme,
      rtl ? 'rtl' : ''
    ]"
    :style="{ width: sidebarWidth, opacity: opacity }"
    @mobilebar="mobileBar"
  >
    <perfect-scrollbar
      ref="scrollSiteBar"
      class="custom__ps"
      :options="perfectOptions"
    >
      <div class="vsm-list">
        <div class="sitebar-header">
          <template v-for="(item, index) in header">
            <template v-if="item.header">
              <template
                v-if="
                  (item.visibleOnCollapse || !isCollapsed) && item.component
                "
              >
                <component
                  :is="item.component"
                  :key="index"
                  :hover-menu="hoverMenu"
                  :is-collapsed="isCollapsed"
                  :notification="item.notification"
                  @onFull="onFull()"
                />
              </template>
              <template v-else-if="item.visibleOnCollapse || !isCollapsed">
                <div
                  :key="index"
                  class="vsm-header"
                  :class="item.class"
                  v-bind="item.attributes"
                >
                  {{ item.title }}
                </div>
              </template>
            </template>
          </template>
        </div>
        <div
          class="sitebar-body"
          @mouseleave="mouseLeave"
          @mouseover="mouseOver"
        >
          <template v-for="(item, index) in menu">
            <item
              :key="index"
              :item="item"
              :first-item="true"
              :is-collapsed="isCollapsed"
            />
          </template>
        </div>
      </div>
      <div
        v-if="isCollapsed"
        :style="[
          { position: 'absolute' },
          { top: `${mobileItemPos}px` },
          rtl ? { right: '0px' } : { left: '0px' },
          { 'z-index': 30 },
          { width: width }
        ]"
      >
        <mobile-item :item="mobileItem" />
        <transition name="slide-animation">
          <div
            v-if="mobileItem"
            class="vsm-mobile-bg"
            :style="[
              { position: 'absolute' },
              { left: '0px' },
              { right: '0px' },
              { top: '0px' },
              { height: `${mobileItemHeight}px` }
            ]"
          ></div>
        </transition>
        <div
          class="vsm-dropdown"
          :style="[
            { position: 'absolute' },
            { top: `${mobileItemHeight}px` },
            { left: rtl ? '0px' : sidebarWidth },
            { right: rtl ? sidebarWidth : '0px' },
            {
              'max-height': `calc(100vh - ${mobileItemPos +
                mobileItemHeight}px)`
            },
            { 'overflow-y': 'auto' }
          ]"
        >
          <transition
            name="expand"
            @enter="expandEnter"
            @afterEnter="expandAfterEnter"
            @beforeLeave="expandBeforeLeave"
          >
            <div v-if="mobileItem && mobileItem.child" class="vsm-list">
              <sub-item
                v-for="(subItem, index) in mobileItem.child"
                :key="index"
                :item="subItem"
              />
            </div>
          </transition>
        </div>
      </div>
    </perfect-scrollbar>
  </div>
</template>

<script>
import Item from "./Item.vue"
import SubItem from "./SubItem.vue"
import MobileItem from "./MobileItem.vue"
import { animationMixin } from "../mixin"
import { mapGetters, mapActions } from "vuex"

export default {
  name: "SidebarMenu",
  components: {
    Item,
    SubItem,
    MobileItem
  },
  mixins: [animationMixin],
  props: {
    menu: {
      type: Array,
      required: true
    },
    header: {
      type: Array,
      required: true
    },
    collapsed: {
      type: Boolean,
      default: false
    },
    width: {
      type: String,
      default: "350px"
    },
    widthCollapsed: {
      type: String,
      default: "50px"
    },
    showChild: {
      type: Boolean,
      default: false
    },
    theme: {
      type: String,
      default: ""
    },
    showOneChild: {
      type: Boolean,
      default: true
    },
    rtl: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isCollapsed: true,
      mobileItem: null,
      mobileItemPos: 0,
      mobileItemHeight: 0,
      closeTimeout: null,
      activeShow: null,
      opacity: 1,
      hoverMenu: false,
      perfectOptions: {
        suppressScrollX: false,
        wheelPropagation: false,
        swipeEasing: true
      }
    }
  },
  computed: {
    ...mapGetters("params", ["bodyMin"]),
    sidebarWidth() {
      return this.isCollapsed ? this.widthCollapsed : this.width
    }
  },
  watch: {
    bodyMin(ctx) {
      if (
        this.$store.getters["params/mobileView"] &&
        this.isCollapsed == true
      ) {
        this.isCollapsed = false
      } else {
        this.isCollapsed = !ctx
      }
    },
    collapsed(val) {
      this.isCollapsed = val
    }
  },
  created() {
    this.$loadingBus.$on("mobileBar", this.mobileBar)
    this.isCollapsed = !this.bodyMin
    // this.$on('mouseEnterItem', (val) => {
    //   this.mobileItem = null;
    //   this.$nextTick(() => {
    //     this.mobileItem = val.item;
    //     this.mobileItemPos = val.pos;
    //     this.mobileItemHeight = val.height
    //   })
    // });

    this.$on("touchClickItem", clearCloseTimeout => {
      if (clearCloseTimeout) {
        clearTimeout(this.closeTimeout)
        return
      }
      if (this.closeTimeout) clearTimeout(this.closeTimeout)
      this.closeTimeout = setTimeout(() => {
        this.mouseLeave()
      }, 600)
    })
  },
  methods: {
    mobileBar() {
      // this.isCollapsed = !this.isCollapsed
    },
    ...mapActions("params", ["setCollaps"]),
    onFull() {
      if (this.isCollapsed) {
        window.localStorage.setItem("bodyMin", true)
      } else {
        window.localStorage.setItem("bodyMin", false)
      }
      this.setCollaps({
        ctx: this.isCollapsed
      })
      // this.isCollapsed = !this.isCollapsed
    },
    mouseOver() {
      if (this.bodyMin == false && !this.$store.getters["params/mobileView"]) {
        this.opacity = 0.8
        this.isCollapsed = false
        this.hoverMenu = true
        this.$el.nextElementSibling.classList.add("sitebar-opacity-open")
        this.$loadingBus.$emit("updateRoutTransition", true)
      }
    },
    mouseLeave() {
      if (this.bodyMin == false && !this.$store.getters["params/mobileView"]) {
        this.opacity = 1
        this.mobileItem = null
        this.isCollapsed = true
        this.hoverMenu = false
        this.$el.nextElementSibling.classList.remove("sitebar-opacity-open")
        this.$loadingBus.$emit("updateRoutTransition", false)
      }
    },
    toggleCollapse() {
      this.isCollapsed = !this.isCollapsed
      this.setCollaps({
        ctx: this.isCollapsed
      })
      this.$emit("collapse", this.isCollapsed)
    },
    onActiveShow(uid) {
      this.activeShow = uid
    },
    onItemClick(event, item) {
      this.$emit("itemClick", event, item)
    }
  },
  provide() {
    const activeShow = {}
    Object.defineProperty(activeShow, "uid", {
      enumerable: true,
      get: () => this.activeShow
    })
    return {
      showChild: this.showChild,
      showOneChild: this.showOneChild,
      emitActiveShow: this.onActiveShow,
      activeShow,
      emitItemClick: this.onItemClick,
      rtl: this.rtl
    }
  }
}
</script>

<style lang="scss">
/*@import '../scss/vue-sidebar-menu.scss';*/
</style>

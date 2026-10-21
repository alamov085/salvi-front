<template>
  <div>
    <div
      id="theme__bg"
      v-on-click-outside="hide"
      class="theme__bg"
      :class="{
        active: activeTheme && !activeAllTheme,
        activeAll: activeAllTheme
      }"
      @mouseover="themeVisible"
      @mouseout="themeHidden"
    >
      <v-btn class="icon-theme" flat icon @click="activeItemTheme">
        <v-icon>palette</v-icon>
      </v-btn>
      <div class="theme__bg__box">
        <v-radio-group v-model="radios" column @click="editTheme">
          <v-radio color="#FAFAFA" label="light green" value="green" />
          <v-radio color="#EDFAF5" label="light silver" value="silver" />
          <v-radio color="#F79FC0" label="Pink" value="Pink" />
          <v-radio color="#865EAE" label="Violet" value="Violet" />
          <v-radio color="#79A9C7" label="Blue" value="Blue" />
          <v-radio color="#FFE862" label="Yellow" value="Yellow" />
          <v-radio color="#66D697" label="Green" value="Green" />
          <v-radio color="#414B4D" label="DarkShade" value="DarkShade" />
        </v-radio-group>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ThemeBG",
  data: () => ({
    activeTheme: false,
    activeAllTheme: false,
    radios: "silver"
  }),
  created() {
    this.editTheme()
  },
  methods: {
    editTheme() {
      this.$loadingBus.$emit("themeBG", this.radios)
    },
    themeVisible() {
      this.activeTheme = true
    },
    themeHidden() {
      this.activeTheme = false
    },
    activeItemTheme() {
      this.activeAllTheme = true
      let i = this
      if (this.activeTheme == false) {
        setTimeout(function() {
          i.activeAllTheme = false
        }, 9000)
      }
    },
    hide() {
      this.activeAllTheme = false
      this.activeTheme = false
    }
  }
}
</script>

<style lang="sass">
#theme__bg
    cursor: pointer
    z-index: 99
    transition: 0.3s
    transition-delay: 1s
    position: fixed
    height: 365px
    bottom: -335px
    padding-top: 20px
    right: 0
    display: flex
    align-items: center
    justify-content: center
    flex-direction: column
    &.active
        bottom: -300px
        transition-delay: 2s
    &.activeAll
        transition-delay: 0.3s
        bottom: 0px
    .v-btn.icon-theme
        .v-btn__content .v-icon
            color: #00b0ff
    .theme__bg__box
        background-color: #212121
        border-radius: 5px
        padding: 5px
        .v-input__slot
            margin: 0px
        .v-label
            color: #fafafa
            font-size: 14px
    .v-input__control
       color: #787878
    .v-input--selection-controls .v-icon
        color: inherit!important
</style>

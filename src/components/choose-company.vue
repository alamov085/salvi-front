<template>
  <div class="choose-company">
    <div class="choose-company__title">
      Дані цього розділу стануть доступними після переходу на конкретне
      підприємство
    </div>
    <button
      class="openModalCompany button__yellow button"
      data-aos="fade-up"
      data-aos-delay="250"
      data-aos-duration="800"
      @click="openModalCompany"
    >
      Перейти в підприємство
    </button>
    <div class="animate__eye">
      <div class="leftEye"></div>
      <div class="rightEye"></div>
      <div class="mouth"></div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex"
export default {
  name: "ChooseCompany",
  data() {
    return {
      isActive: false
    }
  },
  methods: {
    ...mapActions("params", ["setCollaps"]),
    openModalCompany() {
      if (this.$store.getters["params/mobileView"]) {
        this.setCollaps({
          ctx: true
        })
      }
      this.$loadingBus.$emit("openCompany")
    }
  }
}
</script>

<style scoped lang="sass">
.openModalCompany
    transition: 0.3s
    opacity: 1
    margin-top: 50px
    transform: translateY(0px)
    transition-delay: 2s
.yellow_text
    color: #C7A500!important

.choose-company
    display: flex
    flex-direction: column
    flex: 1
    height: 100%
    align-items: center
    &__title
        padding-top: 30px
        font-size: 18px
        color: #646C9A
        width: 100%
        text-align: center
    &__select
        background-color: #4D4D4D
        width: 100%
        max-width: 375px
        border-radius: 4px
        padding:  15px 0px
        margin-top: 20px
        .setting__company__body__input
            margin-bottom: 10px
        &__box
            .listCompany
                max-height: 225px
                .item
                    cursor: pointer
                    transition: 0.3s
                    padding: 0 15px
                    span
                        color: white
                        font-size: 14px
                    &:hover
                        background-color: #797979
</style>
<style scoped>
body .leftEye,
body .rightEye {
  width: 5vh;
  height: 5vh;
  border-radius: 50%;
  background: #19b200;
  position: absolute;
  top: 50%;
  left: 50%;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  -webkit-animation: leftEyeAnimation 3s forwards
    cubic-bezier(0.455, 0.03, 0.515, 0.955);
  animation: leftEyeAnimation 3s forwards
    cubic-bezier(0.455, 0.03, 0.515, 0.955);
}

body .rightEye {
  -webkit-animation: rightEyeAnimation 3s forwards
    cubic-bezier(0.455, 0.03, 0.515, 0.955);
  animation: rightEyeAnimation 3s forwards
    cubic-bezier(0.455, 0.03, 0.515, 0.955);
}

body .mouth {
  opacity: 0;
  width: 10vh;
  height: 10vh;
  border-radius: 50%;
  border: solid 1.3vh #19b200;
  border-right: solid 1.3vh rgba(223, 223, 194, 0);
  border-left: solid 1.3vh rgba(223, 223, 194, 0);
  border-bottom: solid 1.3vh rgba(223, 223, 194, 0);
  position: absolute;
  top: 50%;
  left: 50%;
  -webkit-transform: translate(-50%, -50%) rotate(360deg);
  transform: translate(-50%, -50%) rotate(360deg);
  -webkit-animation: mouthAnimation 3s forwards
    cubic-bezier(0.455, 0.03, 0.515, 0.955);
  animation: mouthAnimation 3s forwards cubic-bezier(0.455, 0.03, 0.515, 0.955);
}

@keyframes mouthAnimation {
  0% {
    opacity: 1;
    -webkit-transform: translate(-50%, -50%) rotateX(180deg);
    transform: translate(-50%, -50%) rotateX(180deg);
  }
  10% {
    opacity: 1;
    -webkit-transform: translate(-50%, -50%) rotateZ(360deg);
    transform: translate(-50%, -50%) rotateZ(360deg);
  }
  40% {
    opacity: 1;
    -webkit-transform: translate(-50%, -50%) rotateZ(320deg);
    transform: translate(-50%, -50%) rotateZ(320deg);
  }
  60% {
    opacity: 1;
    -webkit-transform: translate(-50%, -50%) rotateZ(900deg);
    transform: translate(-50%, -50%) rotateZ(900deg);
  }
  100% {
    opacity: 0;
    -webkit-transform: translate(-50%, -50%) rotateZ(900deg);
    transform: translate(-50%, -50%) rotateZ(900deg);
  }
}

@keyframes leftEyeAnimation {
  0% {
    opacity: 1;
    width: 5vh;
    height: 5vh;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
  }
  50% {
    opacity: 1;
    width: 5vh;
    height: 5vh;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
  }
  60% {
    opacity: 1;
    width: 2vh;
    height: 2vh;
    -webkit-transform: translate(-150%, -50%);
    transform: translate(-150%, -50%);
  }
  90% {
    opacity: 1;
    width: 2vh;
    height: 2vh;
    -webkit-transform: translate(-150%, -50%);
    transform: translate(-150%, -50%);
  }
  100% {
    opacity: 0;
    width: 5vh;
    height: 5vh;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
  }
}

@keyframes rightEyeAnimation {
  0% {
    opacity: 1;
    width: 5vh;
    height: 5vh;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
  }
  50% {
    opacity: 1;
    width: 5vh;
    height: 5vh;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
  }
  60% {
    opacity: 1;
    width: 2vh;
    height: 2vh;
    -webkit-transform: translate(50%, -50%);
    transform: translate(50%, -50%);
  }
  70% {
    opacity: 1;
    width: 2vh;
    height: 2vh;
    -webkit-transform: translate(50%, -50%);
    transform: translate(50%, -50%);
  }
  75% {
    opacity: 1;
    width: 2vh;
    height: 2px;
    -webkit-transform: translate(50%, -50%);
    transform: translate(50%, -50%);
  }
  80% {
    opacity: 1;
    width: 2vh;
    height: 2vh;
    -webkit-transform: translate(50%, -50%);
    transform: translate(50%, -50%);
  }
  90% {
    opacity: 1;
    width: 2vh;
    height: 2vh;
    -webkit-transform: translate(50%, -50%);
    transform: translate(50%, -50%);
  }
  100% {
    opacity: 0;
    width: 5vh;
    height: 5vh;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
  }
}
</style>

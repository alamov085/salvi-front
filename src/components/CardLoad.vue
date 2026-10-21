<template>
  <div class="load-card">
    <img src="/images/loadImg/loadCard.jpg" alt="loading" />
    <div class="after"></div>
  </div>
</template>

<script>
export default {
  name: "CardLoad"
}
</script>

<style lang="sass" scoped>
.load-card
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    display: flex
    img
        width: 100%
        height: 100%
    .after
        transition: all .3s ease-in
        content: ''
        animation: loadCard 1.3s infinite
        background-color: white
        box-shadow: 0px 0px 40px 15px white
        width: 0px
        height: 200%
        position: absolute
        top: -100%
        left: 0
        transform: rotate(45deg)
    @keyframes loadCard
        from
            top: 0
            left: 50%
</style>

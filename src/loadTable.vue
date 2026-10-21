<template>
  <div class="loadTable">
    <div v-for="item in 9" :key="item" class="item">
      <img src="/images/loadImg/loadRow.jpg" alt="loading" />
      <div class="after"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "LoadTable"
}
</script>

<style lang="sass" scoped>
.loadTable
    width: 100%
    overflow: auto
    .item
        min-width: 1200px
        position: relative
        width: 100%
        height: 100%
        overflow: hidden
        display: flex
        margin: 5px 0px
        img
            height: 100%
            width: 100%
        .after
            transition: all .3s ease-in
            content: ''
            animation: loadRow 1.3s infinite
            background-color: white
            box-shadow: 0px 0px 40px 15px white
            width: 0px
            height: 200%
            position: absolute
            top: -100%
            left: 0
            transform: rotate(45deg)
    @keyframes loadRow
        from
            top: 0
            left: 100%
</style>

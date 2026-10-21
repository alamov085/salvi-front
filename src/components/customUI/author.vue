<template>
  <v-flex v-if="update && history != null" xs12 sm12 class="author__box">
    <span> Автор: {{ history.email }} </span>
    <span v-if="history.role != null"> ({{ history.role }}) </span>
  </v-flex>
</template>

<script>
export default {
  name: "Author",
  // eslint-disable-next-line vue/require-prop-types
  props: ["update", "history"]
}
</script>

<style scoped lang="sass">
.author__box
    span
        color: #646C9A
        margin-bottom: 0px
        line-height: 150%
        font-size: 13px
</style>

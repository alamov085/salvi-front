<template>
  <div class="section__content">
    <div class="section__content__head">
      <div class="caption">Коментарі до замовлення</div>
    </div>

    <div class="section__box comments">
      <perfect-scrollbar
        v-for="(item, index) in comments"
        :key="index"
        wheel-speed="0.5"
        swipe-easing="true"
        style="max-height: 500px"
      >
        <div class="section__box__item comments__item">
          <div class="comments__item__head">
            <span class="user__name">
              {{ item.user.first_name }} {{ item.user.last_name }}
            </span>
            <span class="date__comment">{{
              item.created_at | formatDateDotWithTime
            }}</span>
          </div>
          <div class="comments__item__body">
            <p class="text__comment">
              {{ item.text }}
            </p>
          </div>
        </div>
      </perfect-scrollbar>
      <div class="send__comments">
        <textarea
          id=""
          v-model="textComment"
          class="textarea-default"
          name=""
          cols="30"
          rows="10"
          placeholder="Почніть писати тут"
          @keyup.ctrl.enter="sendComment"
        ></textarea>
        <v-btn flat icon class="" @click="sendComment">
          <v-icon>send</v-icon>
        </v-btn>
      </div>
    </div>
    <v-snackbar
      v-model="alert"
      dismissible
      type="success"
      :bottom="true"
      color="#FCBD00"
      :right="false"
      :timeout="6000"
    >
      Напишіть щось
      <v-btn color="pink" flat icon @click="alert = false">
        <v-icon> close</v-icon>
      </v-btn>
    </v-snackbar>
  </div>
</template>

<script>
export default {
  name: "Comments",
  props: ["id"],
  data: () => ({
    textComment: "",
    alert: false,
    comments: []
  }),
  created() {
    this.getComments()
    this.sockets.subscribe("newMessage", data => {
      if (data.order_id == this.id) {
        this.getComments()
      }
    })
  },
  methods: {
    sendComment() {
      if (this.textComment.length > 0) {
        this.$api
          .post("/order/add-comment", {
            text: this.textComment,
            order_id: this.id
          })
          .then(response => {
            if (response.data.success) {
              this.textComment = ""
              this.add()
              // this.getComments();
            }
          })
      } else {
        this.alert = true
      }
    },
    getComments() {
      this.$api
        .post("/graphql", {
          query:
            `
                        query{
                          orderComment(order_id: ` +
            this.id +
            `){
                          id
                          order_id
                          user_id
                          text
                          created_at
                          user{
                            first_name
                            last_name
                          }
                        }
                        }`
        })
        .then(response => {
          this.comments = response.data.data.orderComment
        })
    },
    add() {
      this.$socket.emit("sendMessage", { order_id: this.id })
    }
  }
}
</script>

<style scoped></style>

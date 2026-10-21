<template>
  <div class="section__content notification" data-app>
    <div class="notification__dialog__wrap">
      <v-dialog
        v-model="dialog"
        attach
        fullscreen
        hide-overlay
        transition="dialog-bottom-transition"
        persistent
      >
        <v-card class="dialog__notification">
          <v-card-title>
            <div v-if="currentUser.manager" class="card__title__box">
              <span class="headline">Діалог з користувачем:</span>
              <span class="user__dialog">
                <span class="mr-1">{{ chatInfo.name }}</span>
                <span v-if="chatInfo.phone" class="user__dialog__info">
                  (
                  <v-tooltip
                    v-if="chatInfo.email.length >= 20"
                    right
                    max-width="200px"
                  >
                    <span slot="activator" class=" user__dialog">{{
                      chatInfo.email | truncate(20, "...")
                    }}</span>
                    <span>{{ chatInfo.email }}</span>
                  </v-tooltip>
                  <span v-else>{{ chatInfo.email }}</span>
                  ,
                  <span>{{ chatInfo.phone }}</span>
                  )
                </span>
                <b :class="chatInfo.is_guest ? 'no' : 'saccess'">
                  -
                  {{ chatInfo.is_guest ? "Не авторизований" : "Авторизований" }}
                </b>
              </span>
            </div>
            <div v-else class="card__title__box">
              <span class="headline">Діалог з підтримкою</span>
              <span class="user__dialog"></span>
            </div>
            <v-spacer />
            <button class="button button__red " @click="exitDialog">
              Завершити діалог
            </button>
            <v-btn flat icon color="" @click="dialog = !dialog">
              <v-icon>close</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text>
            <div class="notification__dialog">
              <div
                v-for="(item, index) in dataDialogMessage"
                :key="index"
                class="item"
                :class="{ silver: item.typeId == 1 }"
              >
                <div class="item__head">
                  <span class="name">
                    {{ item.user }}
                  </span>
                </div>
                <div class="item__body">
                  <p class="text">
                    {{ item.text }}
                  </p>
                  <span class="date">{{
                    item.created_at | formatDateDotWithTime
                  }}</span>
                </div>
              </div>
            </div>
          </v-card-text>
          <v-card-actions class="send__message__wrap">
            <textarea
              v-model="message"
              class="textarea-default"
              placeholder="Ваше повідомлення"
              @keyup.enter="sendMessage(chatInfo.id)"
            ></textarea>
            <button
              class="button button__yellow ml-2"
              flat
              @click="sendMessage(chatInfo.id)"
            >
              Надіслати
            </button>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>

    <v-dialog
      v-model="dialog2"
      persistent
      transition="slide-y-transition"
      max-width="400px"
    >
      <v-card>
        <v-card-title>
          <span class="headline">Завершення діалогу:</span>

          <v-spacer />
          <v-btn flat icon color="" @click="dialog2 = !dialog2">
            <v-icon>close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <div class="dialog__text__default">
            Ви впевнені, що хочете завершити діалог? Цю дію не можна буде
            скасувати
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <button
            class="button button__blue ml-2"
            flat
            @click="dialog2 = !dialog2"
          >
            Скасувати
          </button>
          <button
            class="button button__yellow ml-2"
            flat
            @click="closeDialog()"
          >
            Підтвердити
          </button>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="dialog3"
      persistent
      transition="slide-y-transition"
      max-width="400px"
    >
      <v-card>
        <v-card-title>
          <span class="headline">Видалення сповіщення:</span>

          <v-spacer />
          <v-btn flat icon color="" @click="dialog3 = !dialog3">
            <v-icon>close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <div class="dialog__text__default">
            Ви впевнені, що хочете видалити сповіщення? Цю дію не можна буде
            скасувати
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <button
            class="button button__blue ml-2"
            flat
            @click="dialog3 = !dialog3"
          >
            Скасувати
          </button>
          <button
            class="button button__yellow ml-2"
            flat
            @click="deleteNotification()"
          >
            Підтвердити
          </button>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <div class="section__content__head">
      <div v-show="currentUser.manager" class="caption">
        {{ dataTabs[isActive].text }}
      </div>
      <div v-show="currentUser.manager" class="notification__tabs">
        <div
          v-for="(item, index) in dataTabs"
          :key="index"
          class="button button__yellow no-plus "
          :class="{ active: isActive == index }"
          @click="toggleFilter(index, item)"
        >
          {{ item.text }}
          <span v-show="countNotification[item.name] > 0">
            ({{ countNotification[item.name] }})
          </span>
        </div>
      </div>
    </div>
    <v-tooltip
      v-if="dataTabs[0].count"
      v-show="isActive !== 1"
      left
      tag="div"
      class="readAllBtn__box"
    >
      <v-btn slot="activator" class="readAllBtn" flat icon @click="readAll()">
        <v-icon>remove_red_eye</v-icon>
      </v-btn>
      <span>Прочитати всi</span>
    </v-tooltip>

    <div class="notification__body">
      <div
        v-if="!dataTabs[isActive].totalCount && !loading"
        class="default-title__card"
      >
        <span>
          Немає даних
        </span>
        <!--<div id="global">-->
        <!--<div class="mask" id="top">-->
        <!--<div class="plane"></div>-->
        <!--</div>-->
        <!--<div class="mask" id="middle-top">-->
        <!--<div class="plane"></div>-->
        <!--</div>-->
        <!--<div class="mask" id="middle-down">-->
        <!--<div class="plane"></div>-->
        <!--</div>-->
        <!---->
        <!--</div>-->
      </div>
      <div
        v-for="(item, index) in dataMessage"
        v-show="item.type == filterMessege || filterMessege == null"
        :key="index"
        class="messege__item"
        :class="{ white: item.type == 1, no__read: !item.is_read }"
        @mouseover="mouseoverNotification(item)"
        @mouseout="mouseleaveNotification"
      >
        <v-btn
          class="del__messege"
          color="#F24949"
          flat
          icon
          @click="deleteItem(item)"
        >
          <v-icon>close</v-icon>
        </v-btn>

        <div class="messege__item__head">
          <span v-if="item.type == 1" class="name">{{ item.user }}</span>
          <span v-else class="name">
            <span v-if="item.is_read">Прочитано</span>
            <span v-else>Не прочитано</span>
          </span>
          <span class="date">{{ item.date | formatDateDotWithTime }}</span>
        </div>
        <div class="messege__item__body">
          <p class="text">
            {{ item.text }}
          </p>
          <div
            v-if="item.type == 1"
            class="button button__yellow"
            @click="getMessagesOpen(item)"
          >
            Відкрити діалог
          </div>
        </div>
      </div>
      <v-pagination
        v-if="dataMessage.length > 0 && !loading"
        v-model="pagination.page"
        :length="totalCount"
        :total-visible="$store.getters['params/mobileView'] ? 4 : 7"
        color="#2a8b1a"
        class="mt-5"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex"

export default {
  name: "Notification",
  data: () => ({
    activeDialog: 0,
    filterMessege: null,
    isActive: 0,
    dialog: false,
    dialog2: false,
    dialog3: false,
    dialogModel: true,
    countSlotMessege: 0,
    dataTabs: [
      {
        text: "Сповіщення",
        type: 0,
        count: 0,
        totalCount: 0,
        name: "notification",
        chat: false
      },
      // {
      //   text: "Діалоги",
      //   type: 1,
      //   count: 0,
      //   totalCount: 0,
      //   name: "chat",
      //   chat: true
      // }
    ],
    pagination: {
      sortBy: "id",
      rowsPerPage: 50,
      page: 1
    },
    chatInfo: {},
    dataMessage: [],
    dataDialogMessage: [],
    message: "",
    time: 0,
    isRunning: false,
    interval: null,
    currentNotify: {},
    totalCount: 0,
    countNotification: {
      chat: 0,
      count: 0,
      notification: 0
    },
    chat: false,
    loading: false
  }),
  created() {
    this.sockets.subscribe("newChatMessage", () => {
      this.getMessagesSocket()
      this.getDataFromApi()
    })
    this.sockets.subscribe("notification_" + this.currentUser.id, () => {
      this.getDataFromApi()
    })
    this.getDataFromApi()
  },
  methods: {
    exitDialog() {
      this.dialog2 = true
      this.dialogModel = this.chatInfo.id
    },
    scrollMessege() {
      let objDiv = document.querySelector(".dialog__notification .v-card__text")
      objDiv.scrollTop = objDiv.scrollHeight
    },
    mouseoverNotification: function(e) {
      this.startTimer()
      this.currentNotify = e
    },
    mouseleaveNotification: function() {
      clearInterval(this.interval)
      this.time = 0
    },
    startTimer() {
      this.interval = setInterval(this.incrementTime, 1000)
    },
    incrementTime() {
      this.time = parseInt(this.time) + 1
      if (this.time == 1) {
        this.setAsRead()
        this.currentNotify.is_read = 1
      }
    },
    setAsRead() {
      if (!this.currentNotify.is_read && this.currentNotify.type == 0) {
        this.$api
          .post("/notification/set-read-notification", {
            id: this.currentNotify.id
          })
          .then(response => {
            if (response.data.success) {
              this.$emit("notification", true)
              setTimeout(() => {
                this.$emit("notification", false)
              }, 100)
              this.countNotification.notification -= 1
              this.countNotification.count -= 1
            }
          })
      }
    },
    readAll() {
      // eslint-disable-next-line no-unused-vars
      this.$api.post("/notification/read-all", {}).then(response => {
        this.$emit("notification", true)
        setTimeout(() => {
          this.$emit("notification", false)
        }, 100)
        this.getDataFromApi()
      })
    },
    toggleFilter(e, type) {
      this.isActive = e
      this.filterMessege = type.type
      this.countSlotMessege = document.querySelectorAll(
        ".notification__body .messege__item"
      ).length
      this.chat = type.chat
      this.pagination.page = 1
    },
    getDataFromApi() {
      this.loading = true
      this.$api
        .post("/graphql", {
          query:
            `
                        query{
                              notification(perPage:` +
            this.pagination.rowsPerPage +
            ` page: ` +
            this.pagination.page +
            ` chat: ` +
            this.chat +
            `){
                                totalCount
                                items{
                                    id
                                    type
                                    user
                                    date
                                    text
                                    is_read
                                }
                              }
                              countNotification{
                                count
                                chat
                                notification
                              }
                            }`
        })
        .then(response => {
          this.dataMessage = response.data.data.notification.items
          this.totalCount = response.data.data.notification.totalCount
          this.countNotification = response.data.data.countNotification
          this.loading = false
          this.$emit("notification", true)
          setTimeout(() => {
            this.$emit("notification", false)
          }, 1000)
        })
    },
    getMessagesOpen(item) {
      this.activeDialog = item.id
      this.getMessages(item.id)
      this.dialog = !this.dialog
      if (item.is_read == 0) {
        this.countNotification.chat -= 1
        this.countNotification.count -= 1
      }
      item.is_read = 1
    },
    getMessagesSocket() {
      this.getMessages(this.activeDialog)
    },
    getMessages(id) {
      this.$api
        .post("/public-graphql", {
          query:
            `
                        query{
                              message(chat_id: ` +
            id +
            `){
                                id
                                typeId
                                user
                                text,
                                created_at
                              }
                              chatInfo(id:` +
            id +
            `){
                                id
                                is_guest
                                name
                                email
                                phone
                              }
                            }`
        })
        .then(response => {
          this.dataDialogMessage = response.data.data.message
          this.chatInfo = response.data.data.chatInfo
          this.countMessage()
          this.$nextTick(function() {
            this.scrollMessege()
          })
          this.$emit("notification", true)
          setTimeout(() => {
            this.$emit("notification", false)
          }, 1000)
        })
    },
    closeDialog() {
      this.$api
        .post("/chat/close-chat", { id: this.dialogModel })
        .then(response => {
          if (response.data.success) {
            this.dialog2 = false
            this.dialog = false
            this.getDataFromApi()
            this.$socket.emit("chatMessage", {})
          }
        })
    },
    sendMessage(id) {
      if (this.message.length > 0) {
        this.$api
          .post("/chat/send-message", {
            message: this.message,
            chat_id: id
          })
          .then(response => {
            if (response.data.success) {
              this.$socket.emit("chatMessage", {})
              this.getMessages(id)
              this.message = ""
            }
          })
      }
    },
    deleteItem(item) {
      if (item.type == 0) {
        this.dialog3 = true
        this.dialogModel = item.id
      } else {
        this.dialog2 = true
        this.dialogModel = item.id
      }
    },
    deleteNotification() {
      this.$api
        .post("/chat/close-notification", { id: this.dialogModel })
        .then(response => {
          if (response.data.success) {
            this.dialog3 = false
            this.getDataFromApi()
          }
        })
    },
    countMessage() {
      if (this.dataMessage.length > 0) {
        let message = 0
        let notification = 0
        let TotalMessage = 0
        let TotalNotification = 0
        this.dataMessage.forEach(item => {
          if (item.type == 1) {
            if (!item.is_read) {
              message += 1
            }
            TotalMessage += 1
          } else {
            if (!item.is_read) {
              notification += 1
            }
            TotalNotification += 1
          }
        })
        //this.dataTabs[0].count = message + notification;
        this.dataTabs[0].count = notification
        this.dataTabs[1].count = message
        // this.dataTabs[0].totalCount = TotalMessage + TotalNotification;
        this.dataTabs[0].totalCount = TotalNotification
        this.dataTabs[1].totalCount = TotalMessage
      }
    }
  },
  // eslint-disable-next-line vue/order-in-components
  computed: {
    ...mapGetters("user", ["currentUser"])
  },
  // eslint-disable-next-line vue/order-in-components
  watch: {
    chat() {
      this.getDataFromApi()
    },
    dataMessage: {
      handler() {
        this.countMessage()
      },
      deep: true
    },
    pagination: {
      handler() {
        this.getDataFromApi()
      },
      deep: true
    },
    loading(e) {
      this.$loadingBus.$emit("loading", e)
    }
  }
}
</script>

<style scoped>
.readAllBtn__box {
  display: flex;
  width: 36px;
  margin-left: auto;
}
.readAllBtn {
  display: flex;
  margin: 0px;
}
.readAllBtn i {
  color: #0093fc !important;
}
</style>

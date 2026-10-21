<template>
  <div v-on-click-outside="closeChat" data-app>
    <beautiful-chat
      :participants="participants"
      :title-image-url="titleImageUrl"
      :on-message-was-sent="onMessageWasSent"
      :message-list="messageList"
      :new-messages-count="newMessagesCount"
      :is-open="isChatOpen"
      :close="closeChat"
      :icons="icons"
      :open="openChat"
      :show-emoji="false"
      :show-file="false"
      :show-typing-indicator="showTypingIndicator"
      :colors="colors"
      :always-scroll-to-bottom="alwaysScrollToBottom"
      :message-styling="messageStyling"
      :first-guest-message="firstGuestMessage"
      :validation-error="validationError"
      placeholder="Введіть повідомлення"
      @onType="handleOnType"
      @edit="editMessage"
    />
  </div>
</template>

<script>
import CloseIcon from "./src/assets/close-icon.png"
import OpenIcon from "./src/assets/logo-no-bg.svg"
import FileIcon from "./src/assets/file.svg"
import CloseIconSvg from "./src/assets/close.svg"
import chatUser from "./src/assets/chatUser.svg"
import { mapActions, mapGetters } from "vuex"

export default {
  name: "Chat",
  data() {
    return {
      icons: {
        open: {
          img: OpenIcon,
          name: "default"
        },
        close: {
          img: CloseIcon,
          name: "default"
        },
        file: {
          img: FileIcon,
          name: "default"
        },
        closeSvg: {
          img: CloseIconSvg,
          name: "default"
        }
      },
      participants: [
        {
          id: "user2",
          name: "Support",
          imageUrl: ""
        }
      ], // the list of all the participant of the conversation. `name` is the user name, `id` is used to establish the author of a message, `imageUrl` is supposed to be the user avatar.
      titleImageUrl: chatUser,
      messageList: [], // the list of the messages to show, can be paginated and adjusted dynamically
      newMessagesCount: 0,
      isChatOpen: false, // to determine whether the chat window should be open or closed
      showTypingIndicator: "", // when set to a value matching the participant.id it shows the typing indicator for the specific user
      colors: {
        header: {
          bg: "#6D6D6F",
          text: "#ffffff"
        },
        launcher: {
          bg: "#2A8B1A"
        },
        messageList: {
          bg: "#ffffff"
        },
        sentMessage: {
          bg: "#2A8B1A",
          text: "#ffffff"
        },
        receivedMessage: {
          bg: "#eaeaea",
          text: "#222222"
        },
        userInput: {
          bg: "#f4f7f9",
          text: "#565867"
        }
      }, // specifies the color scheme for the component
      alwaysScrollToBottom: true, // when set to true always scrolls the chat to the bottom when new events are in (new message, user starts typing...)
      messageStyling: true, // enables *bold* /emph/ _underline_ and such (more info at github.com/mattezza/msgdown)
      validationError: []
    }
  },
  methods: {
    ...mapActions("chat", ["setData"]),
    firstGuestMessage(e) {
      this.$api.post("/chat/send-message", e).then(response => {
        var errors = []
        if (response.data.success) {
          this.validationError = errors
          this.setData({ ctx: response.data.chat })
          this.$socket.emit("chatMessage", {})
          // this.getMessages();
        } else {
          response.data.errors.forEach(function(value) {
            errors[value.field] = value.message
          })
          this.validationError = errors
        }
      })
    },
    sendMessage(text) {
      if (text.length > 0) {
        this.newMessagesCount = this.isChatOpen
          ? this.newMessagesCount
          : this.newMessagesCount + 1
        this.onMessageWasSent({
          author: "support",
          type: "text",
          data: { text }
        })
      }
    },
    onMessageWasSent(message) {
      // called when the user sends a message
      this.messageList = [...this.messageList, message]
      this.$api
        .post("/chat/send-message", {
          message: message.data.text,
          chat_id: this.currentChatId,
          user_id: this.currentChatUser
        })
        .then(response => {
          if (response.data.success) {
            this.setData({ ctx: response.data.chat })
            this.$socket.emit("chatMessage", {})
            // this.getMessages();
          }
        })
    },
    openChat() {
      // called when the user clicks on the fab button to open the chat
      this.isChatOpen = true
      this.readMessages()
      // this.newMessagesCount = 0
    },
    closeChat() {
      // called when the user clicks on the botton to close the chat
      this.isChatOpen = false
    },
    handleScrollToTop() {
      // called when the user scrolls message list to top
      // leverage pagination for loading another page of messages
    },
    handleOnType() {
      // console.log('Emit typing event')
    },
    editMessage(message) {
      const m = this.messageList.find(m => m.id === message.id)
      m.isEdited = true
      m.data.text = message.data.text
    },
    readMessages() {
      if (this.currentChatId > 0 && this.currentChatUser > 0) {
        this.$api
          .post("/chat/read-message", {
            chat_id: this.currentChatId,
            user_id: this.currentChatUser
          })
          .then(response => {
            if (response.data.success) {
              this.newMessagesCount = 0
            }
          })
      }
    },
    getMessages() {
      this.$api
        .post("/public-graphql", {
          query:
            `
                        query{
                              message(chat_id: ` +
            this.currentChatId +
            `){
                                id
                                type
                                author
                                data{
                                  text
                                }
                              }
                              unreadMessage(chat_id: ` +
            this.currentChatId +
            ` user_id: ` +
            this.currentChatUser +
            `){
                                count
                              }
                            }`
        })
        .then(response => {
          this.messageList = response.data.data.message
          this.newMessagesCount = response.data.data.unreadMessage.count
        })
    }
  },
  computed: {
    ...mapGetters("chat", ["currentChatId", "currentChatUser"])
  },
  created() {
    this.sockets.subscribe("newChatMessage", () => {
      this.getMessages()

      // let time = Math.floor(Math.random() * Math.floor(10) * 1000 + 3000);
      // setTimeout(this.getMessages(), time);
    })
    this.getMessages()
  }
}
</script>

<style scoped></style>

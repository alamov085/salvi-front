<template>
  <div class="section__content">
    <div class="section__content__head">
      <div class="caption">Прикріплені документи</div>
    </div>
    <div class="section__box upload__file">
      <div v-for="item in fileList" :key="item.шв" class="section__box__item">
        <v-icon class="doc_icon">insert_drive_file</v-icon>
        <div class="upload__file__desc">
          <span class="name">{{ item.old_name }}</span>
          <span class="size">{{ item.size }}</span>
        </div>
        <div class="upload__file__desc__setting">
          <v-btn class="icon-delete" icon flat>
            <i class="icon icon-delete" @click="deleteFileModal(item)"></i>
          </v-btn>
          <v-btn icon flat class="icon__download" @click="downloadFile(item)">
            <v-icon>get_app</v-icon>
          </v-btn>
        </div>
      </div>
      <div class="load__file">
        <v-btn flat>
          <input
            ref="files"
            type="file"
            multiple
            @change="handleFileUpload()"
          />
          <v-icon>cloud_upload</v-icon>
        </v-btn>

        <span>Перетягніть файл сюди</span>
      </div>
    </div>

    <!--load new test drag-->

    <!-- File Drop Zone -->
    <div id="dropzone" style="visibility: hidden; opacity:0">
      <div id="textnode">Перетягніть файл.</div>
    </div>

    <!---------------------------------end-->

    <my-dialog
      :model="myDialog"
      :button-one="btnClose"
      :button-two="btnApprove"
      :item="dialogItem"
      :text="dialogText"
      :headline="dialogHeadline"
      @buttonOne="buttonOne"
      @buttonTwo="deleteFile(dialogItem)"
    />
  </div>
</template>

<script>
import { saveAs } from "file-saver"
import axios from "axios"

export default {
  name: "UpFiles",
  // eslint-disable-next-line vue/require-prop-types
  props: ["id", "initFile"],
  data() {
    return {
      files: "",
      fileList: this.initFile,
      myDialog: false,
      btnClose: { name: "Скасувати", class: "button__blue" },
      btnApprove: { name: "Підтвердити", class: "button__yellow" },
      dialogText: "",
      dialogItem: {},
      dialogHeadline: ""
      // uploadedFiles: []
    }
  },
  mounted() {
    this.getDataFromApi()
    window.addEventListener("dragenter", function() {
      document.querySelector("#dropzone").style.visibility = ""
      document.querySelector("#dropzone").style.opacity = 1
      document.querySelector("#textnode").style.fontSize = "48px"
    })

    window.addEventListener("dragleave", function(e) {
      e.preventDefault()

      document.querySelector("#dropzone").style.visibility = "hidden"
      document.querySelector("#dropzone").style.opacity = 0
      document.querySelector("#textnode").style.fontSize = "42px"
    })

    window.addEventListener("dragover", function(e) {
      e.preventDefault()
      document.querySelector("#dropzone").style.visibility = ""
      document.querySelector("#dropzone").style.opacity = 1
      document.querySelector("#textnode").style.fontSize = "48px"
    })
    var handl = this
    window.addEventListener("drop", function(e) {
      e.preventDefault()
      document.querySelector("#dropzone").style.visibility = "hidden"
      document.querySelector("#dropzone").style.opacity = 0
      document.querySelector("#textnode").style.fontSize = "42px"

      var files = e.dataTransfer.files
      handl.handleFileUpload2(files)
    })
  },
  methods: {
    deleteFileModal(item) {
      this.dialogItem = item
      this.myDialog = true
      this.dialogText = "Ви впевнені, що хочете вилучити файл?"
      this.dialogHeadline = "Підтвердження вилучення"
    },
    buttonOne() {
      this.myDialog = false
    },
    handleFileUpload() {
      this.files = this.$refs.files.files
      let formData = new FormData()
      formData.append("order_id", this.id)
      for (var i = 0; i < this.files.length; i++) {
        let file = this.files[i]

        formData.append("files[" + i + "]", file)
      }
      this.$api
        .post("/order/upload-files", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        })
        .then(response => {
          if (response.data.success) {
            this.getDataFromApi()
          }
        })
    },
    handleFileUpload2(e) {
      this.files = e
      // this.files = this.$refs.files.files;
      let formData = new FormData()
      formData.append("order_id", this.id)
      for (var i = 0; i < this.files.length; i++) {
        let file = this.files[i]

        formData.append("files[" + i + "]", file)
      }
      this.$api
        .post("/order/upload-files", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        })
        .then(response => {
          if (response.data.success) {
            this.getDataFromApi()
          }
        })
    },
    downloadFile(item) {
      axios
        .get(item.link, {
          responseType: "arraybuffer"
        })
        .then(response => {
          let blob = new Blob([response.data], {
            type: response.headers["content-type"]
          })
          saveAs(blob, item.old_name)
        })
      // this.$api
      //     .post('/file/download?id='  +item.id, {
      //         data: {},
      //         responseType: 'arraybuffer',
      //     })
      //     .then(response => {
      //         let blob = new Blob([response.data], { type: response.headers['content-type'] });
      //         saveAs(blob, item.old_name);
      //     })
    },
    deleteFile(item) {
      this.$api
        .post("/order/delete-file", item)
        .then(response => {
          if (response.data.success) {
            this.getDataFromApi()
          }
        })
        .finally(() => {
          this.myDialog = false
        })
    },
    getDataFromApi() {
      this.$api
        .post("/graphql", {
          query:
            `
                        query{
                          orderFile(order_id: ` +
            this.id +
            `){
                              id
                              old_name
                              size
                              link
                            }
                        }`
        })
        .then(response => {
          this.fileList = response.data.data.orderFile
        })
    }
  }
}
</script>

<style scoped>
#dropzone {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999999999;
  width: 100%;
  height: 100%;
  transition: visibility 175ms, opacity 175ms;
  display: table;
  text-shadow: 1px 1px 2px #000;
  color: #fff;
  background: rgba(0, 0, 0, 0.45);
  font: bold 42px Oswald, DejaVu Sans, Tahoma, sans-serif;
}
#textnode {
  display: table-cell;
  text-align: center;
  vertical-align: middle;
  transition: font-size 175ms;
}
</style>

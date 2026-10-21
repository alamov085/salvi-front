<template>
  <div>
    <div class="section__content">
      <div class="section__content__head">
        <div class="caption">Імпорт каталогу з 1С</div>
      </div>
      <div class="section__box">
        <div v-if="inProgress">Процес імпорту в процесі</div>
        <button v-else class="button button__red" @click="startImport">
          Запустити
        </button>
      </div>
    </div>
    <div class="section__content">
      <div class="section__content__head">
        <div class="caption">Імпорт файлів</div>
      </div>
      <div class="section__box upload__file">
        <div class="load__file">
          <v-btn flat>
            <input ref="files1" type="file" @change="handleFileUpload(1)" />
            <v-icon>cloud_upload</v-icon>
          </v-btn>

          <span>Завантаження локацій</span>
        </div>
        <div class="load__file">
          <v-btn flat>
            <input ref="files2" type="file" @change="handleFileUpload(2)" />
            <v-icon>cloud_upload</v-icon>
          </v-btn>

          <span>Завантаження кост-центрів</span>
        </div>
        <div class="load__file">
          <v-btn flat>
            <input ref="files3" type="file" @change="handleFileUpload(3)" />
            <v-icon>cloud_upload</v-icon>
          </v-btn>

          <span>Завантаження бюджетів</span>
        </div>
        <div class="load__file">
          <v-btn flat>
            <input ref="files4" type="file" @change="handleFileUpload(4)" />
            <v-icon>cloud_upload</v-icon>
          </v-btn>

          <span>Завантаження користувачів</span>
        </div>
        <div class="load__file">
          <v-btn flat>
            <input ref="files5" type="file" @change="handleFileUpload(5)" />
            <v-icon>cloud_upload</v-icon>
          </v-btn>

          <span>Завантаження специфікацій</span>
        </div>
      </div>
      <v-snackbar
        v-model="snack"
        :bottom="true"
        :color="snackColor"
        :timeout="6000"
      >
        <span v-html="snackMsg"></span>
        <v-btn color="pink" flat icon @click="snack = false">
          <v-icon> close</v-icon>
        </v-btn>
      </v-snackbar>
    </div>
  </div>
</template>

<script>
export default {
  name: "ImportEntity",
  data() {
    return {
      files: "",
      fileList: this.initFile,
      snack: false,
      snackMsg: "",
      snackColor: "",
      inProgress: false,
      loading: false
    }
  },
  watch: {
    loading(e) {
      this.$loadingBus.$emit("loading", e)
    }
  },
  created() {
    this.getDataFromApi()
  },
  methods: {
    startImport() {
      this.loading = true
      this.$socket.emit("updateOneS", { start: true })
      setTimeout(() => {
        this.loading = false
      }, 2000)
    },
    getDataFromApi() {
      this.loading = true
      this.$api
        .post("/graphql", {
          query: `
                        query{
                          oneSCheck{
                                in_progress
                          }
                        }`
        })
        .then(response => {
          this.inProgress = response.data.data.oneSCheck.in_progress
          this.loading = false
        })
    },
    handleFileUpload(id) {
      this.files = this.$refs["files" + id].files
      let formData = new FormData()
      formData.append("id", id)
      for (let i = 0; i < this.files.length; i++) {
        let file = this.files[i]
        formData.append("files", file)
      }
      this.$api
        .post("/import", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        })
        .then(response => {
          if (response.data.success) {
            this.snack = true
            this.snackColor = "#FCBD00"
            this.snackMsg =
              "Завдання поставлено в чергу. По закінченню вам буде відправленно сповіщення"
          } else {
            this.snack = true
            this.snackColor = "#FCBD00"
            this.snackMsg = "Помилка!"
          }
        })
    }
  }
}
</script>

<style scoped></style>

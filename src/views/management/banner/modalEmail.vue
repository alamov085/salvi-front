<template>
  <v-dialog
    v-model="dialog"
    :fullscreen="$store.getters['params/mobileView']"
    persistent
    max-width="705px"
  >
    <template v-slot:activator="{ on }">
      <button
        v-show="$root.rbac.managementEmail && !hideButton"
        class="button button__yellow"
        @click="openDialog"
      >
        Додати банер
      </button>
    </template>
    <v-card>
      <v-card-title>
        <span v-if="!update" class="headline">Створення нового Банера</span>
        <span v-else class="headline">
          <span>Редагування Банера</span>
        </span>
        <v-spacer />
        <v-flex xs1 sm1>
          <v-btn flat icon color="" @click="cancel">
            <v-icon>close</v-icon>
          </v-btn>
        </v-flex>
      </v-card-title>
      <v-container
        grid-list-md
      >
        <v-layout wrap>
          <v-flex xs12 sm12 md12 class="box--newEmail">
            <v-flex xs7 sm7 md12 class="input-box">
              <label>Name</label>
              <input
                v-model="itemEmail.name"
                type="name"
                class="input-default"
                placeholder="Введіть Name"
              />
              <div class="error__box">
                <span>{{ errors.name }}</span>
              </div>
            </v-flex>
          </v-flex>

          <v-flex xs12 sm12 md12 class="box--newEmail">
            <v-flex xs7 sm7 md12 class="input-box">
              <label>Url</label>
              <input
                v-model="itemEmail.url"
                type="url"
                class="input-default"
                placeholder="Введіть Url"
              />
              <div class="error__box">
                <span>{{ errors.url }}</span>
              </div>
            </v-flex>
          </v-flex>

          <v-flex xs12 sm12 md12 class="box--newEmail">
            <v-flex xs7 sm7 md12 class="input-box">
              <label>Text</label>
              <input
                v-model="itemEmail.text"
                type="text"
                class="input-default"
                placeholder="Введіть Text"
              />
              <div class="error__box">
                <span>{{ errors.text }}</span>
              </div>
            </v-flex>
          </v-flex>

          <v-flex xs12 sm12 md12 class="box--newEmail">
            <v-flex xs7 sm7 md12 class="input-box">
              <label>Time Swap</label>
              <input
                v-model="itemEmail.time_swap"
                type="text"
                class="input-default"
                placeholder="Введіть Time Swap"
              />
              <div class="error__box">
                <span>{{ errors.time_swap }}</span>
              </div>
            </v-flex>
          </v-flex>

          <v-flex xs12 sm12 md12 class="box--newEmail">
            <v-flex xs7 sm7 md12 class="input-box">
              <label>Sort</label>
              <input
                v-model="itemEmail.sort"
                type="text"
                class="input-default"
                placeholder="Введіть Sort"
              />
<!--              <div class="error__box">-->
<!--                <span>{{ errors.sort }}</span>-->
<!--              </div>-->
            </v-flex>
          </v-flex>

          <v-flex xs12 sm12 md12 class="box--newEmail">
            <v-flex xs7 sm7 md12 class="input-box">
              <v-checkbox v-model="itemEmail.active" label="Active"></v-checkbox>
              <div class="error__box">
                <span>{{ errors.time_swap }}</span>
              </div>
            </v-flex>
          </v-flex>

          <v-flex xs12 sm12 md12 class="box--newEmail">
            <v-flex xs7 sm7 md12 class="input-box">
              <label>Картинка</label>

              <!-- Поле выбора файла -->
              <input
                ref="imageInput"
                id="image-load"
                type="file"
                accept="image/*"
                class="input-download"
                @change="onImageChange"
              />

              <label v-if="!itemEmail.img_path" for="image-load" class="input-download-button">Загрузить картинку</label>

              <!-- Превью (для создания и редактирования) -->
              <div v-if="itemEmail.img_path" class="image-preview">
                <img :src="itemEmail.img_path" alt="Превью" class="preview-img" />
                <button type="button" @click="removeImage" class="input-download-button">
                  Удалить картинку
                </button>
              </div>

              <!-- Ошибка, если нужна -->
              <div class="error__box">
                <span>{{ errors.image }}</span>
              </div>
            </v-flex>
          </v-flex>



        </v-layout>
      </v-container>
      <v-card-actions>
        <v-spacer />
        <button class="button button__blue" flat @click="cancel">
          Скасувати
        </button>
        <button
          v-if="!update"
          class="button button__yellow"
          flat
          @click="create"
        >
          Створити
        </button>
        <button
          v-else
          v-show="!viewOnly"
          class="button button__yellow"
          flat
          @click="updateDataModal"
        >
          Застосувати
        </button>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from "vuex"

export default {
  name: "DialogCreateCostCenter",
  props: {
    // eslint-disable-next-line vue/require-default-prop
    itemEmail: { type: Object },
    dialog: { type: Boolean },
    update: { type: Boolean },
    // eslint-disable-next-line vue/require-default-prop
    companyEntities: { type: Array },
    viewOnly: {
      type: Boolean,
      default: false
    },
    hideButton: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    errors: [],
    preventAction: false,
    switch1: true
  }),
  watch: {
    dialog() {
      this.errors = []
    }
  },
  methods: {
    create() {
      if (this.preventAction) {
        return true
      }
      this.preventAction = true
      let formData = new FormData()
      formData.append('name', this.itemEmail.name);
      formData.append('url', this.itemEmail.url);
      formData.append('text', this.itemEmail.text);
      formData.append('time_swap', this.itemEmail.time_swap);
      formData.append('sort', this.itemEmail.sort);
      formData.append('active', this.itemEmail.active ? 1 : 0);

      if(this.itemEmail.img) {
        formData.append('img', this.itemEmail.img);
      }

      console.log(formData, 'data')

      this.$api.post("/banner/create", formData).then(response => {
        this.preventAction = false
        let errors = []
        if (response.data.success) {
          this.cancel()
        } else {
          response.data.errors.forEach(function(value) {
            errors[value.field] = value.message
          })
          this.errors = errors
        }
      })
    },
    updateDataModal() {
      if (this.preventAction) {
        return true
      }
      this.preventAction = true
      let formData = new FormData()
      formData.append('name', this.itemEmail.name);
      formData.append('url', this.itemEmail.url);
      formData.append('text', this.itemEmail.text);
      formData.append('time_swap', this.itemEmail.time_swap);
      formData.append('sort', this.itemEmail.sort);
      formData.append('active', this.itemEmail.active ? 1 : 0);
      formData.append('id', this.itemEmail.id);
      console.log(this.itemEmail.img, 'img update')

      if(this.itemEmail.img) {
        formData.append('img', this.itemEmail.img);
      }

      console.log(formData, 'data')

      this.preventAction = true
      this.$api.post("/banner/update", formData).then(response => {
        this.preventAction = false
        let errors = []
        if (response.data.success) {
          this.cancel()
        } else {
          response.data.errors.forEach(function(value) {
            errors[value.field] = value.message
          })
          this.errors = errors
        }
      })
    },
    cancel() {
      this.$refs.imageInput.value = null
      this.$emit("closeDialog", false)
      this.listUpdated()
    },
    listUpdated() {
      this.$emit("listUpdated", true)
      setTimeout(() => {
        this.$emit("listUpdated", false)
      }, 100)
    },
    openDialog() {
      this.$emit("closeDialog", true)
      this.errors = []
    },
    onImageChange(event) {
      const file = event.target.files[0];

      if (!file) return;

      // Простая проверка типа
      if (!file.type.startsWith('image/')) {
        this.errors.img = 'Допускаются только файлы изображений.';
        return;
      }

      this.errors.img = '';
      this.itemEmail.img = file;

      // Превью через FileReader
      const reader = new FileReader();
      reader.onload = e => {
        this.itemEmail.img_path = e.target.result;
      };
      reader.readAsDataURL(file);
    },

    removeImage() {
      this.itemEmail.img = null;
      this.itemEmail.img_path = null;
      this.$refs.imageInput && (this.$refs.imageInput.value = '');
    },
  },
  computed: {
    ...mapGetters("user", ["currentUser"])
  }
}
</script>

<style lang="scss">
  .input-download {
    visibility: hidden;
    width: 0;
    height: 0;
    position: absolute;
  }
  .input-download-button {
    width: fit-content;
    padding: 10px 20px;
    color: #5578eb !important;
    border: #5578eb 1px solid;
    border-radius: 5px;
    cursor: pointer;
  }
  .image-preview {
    margin-top: 10px;
  }

  .preview-img {
    max-width: 200px;
    max-height: 200px;
    display: block;
    margin-bottom: 8px;
    object-fit: cover;
  }

  .btn-remove {
    border: none;
    padding: 6px 12px;
    cursor: pointer;
  }
</style>

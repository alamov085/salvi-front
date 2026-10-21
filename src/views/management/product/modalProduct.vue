<template>
  <v-dialog
    v-model="dialog"
    :fullscreen="$store.getters['params/mobileView']"
    persistent
    max-width="1050px"
  >
    <template v-slot:activator="{ on }">
      <div
        v-show="$root.rbac.managementProductCreate && !hideButton"
        class="button button__blueBG"
        @click="openDialog"
      >
        <v-icon color="#fff" class="mr-2">add_circle_outline</v-icon>
        Додати товар
      </div>
    </template>
    <v-card>
      <v-card-title>
        <span v-if="!update" class="headline">Створити товар</span>
        <span v-else class="headline">
          <span v-show="!viewOnly && $root.rbac.managementProductUpdate">
            Деталi товару
          </span>
        </span>
        <v-spacer />
        <div
          v-if="!$store.getters['params/mobileView']"
          class="modal--head--action"
        >
          <div class="button button__red" @click="cancel">Закрити</div>
          <div
            v-if="!modelChange || model.buffer_status == 1"
            class="button button__purple"
            :class="{ 'is-disabled': !modelChange }"
          >
            Зберегти товар
          </div>
          <div
            v-if="update && !model.is_buffer && modelChange"
            class="button button__blueBG"
            @click="updateDataModal(0)"
          >
            Зберегти товар
          </div>
          <div
            v-show="!$root.rbac.managementProductBuffer"
            v-if="
              update &&
                model.is_buffer &&
                model.buffer_status !== 1 &&
                modelChange
            "
            class="button button__blueBG"
            @click="updateDataModal(0)"
          >
            Зберегти товар
          </div>
          <div
            v-show="!$root.rbac.managementProductBuffer"
            v-if="!update && model.buffer_status !== 1 && modelChange"
            class="button button__blueBG"
            @click="create(0)"
          >
            Зберегти товар
          </div>
          <v-menu
            v-if="model.is_buffer && model.buffer_status !== 1 && modelChange"
            v-show="$root.rbac.managementProductBuffer"
            offset-y
            content-class="menu-default"
          >
            <template v-slot:activator="{ on }">
              <div
                v-show="$root.rbac.managementProductBuffer"
                v-if="model.is_buffer"
                class="button button__blueBG iconBtn"
                v-on="on"
              >
                Зберегти товар
                <v-icon class="pos-right">more_horiz</v-icon>
              </div>
            </template>
            <v-list v-if="model.is_buffer">
              <v-list-tile v-if="!update" @click="create(0)">
                Зберегти товар i не передавати 1С
              </v-list-tile>
              <v-list-tile
                v-show="$root.rbac.managementProductBuffer"
                v-if="!update"
                @click="create(1)"
              >
                Зберегти товар i передати в 1С
              </v-list-tile>
              <v-list-tile v-if="update" @click="updateDataModal(0)">
                Зберегти товар i не передавати 1С
              </v-list-tile>
              <v-list-tile
                v-show="$root.rbac.managementProductBuffer"
                v-if="update"
                @click="updateDataModal(1)"
              >
                Зберегти товар i передати в 1С
              </v-list-tile>
            </v-list>
          </v-menu>
        </div>
      </v-card-title>
      <v-container
        v-disable-all="!$root.rbac.managementProductUpdate && viewOnly"
        grid-list-md
      >
        <v-layout wrap>
          <v-flex xs12 sm6 md6 class="input-box">
            <label>Найменування</label>
            <input
              v-model="model.name"
              type="text"
              class="input-default"
              placeholder="Найменування"
            />
            <div class="error__box">
              <span>{{ errors.name }}</span>
            </div>
          </v-flex>
          <v-flex xs12 sm3 md3 class="input-box">
            <label>Ціна з ПДВ</label>
            <input
              v-model.number="model.buy_price"
              type="number"
              class="input-default"
              placeholder="Ціна з ПДВ"
            />
            <div class="error__box">
              <span>{{ errors.buy_price }}</span>
            </div>
          </v-flex>
          <v-flex xs12 sm3 md3 class="input-box">
            <label>Ставка ПДВ</label>
            <v-select
              v-model="model.vat"
              hide-details
              solo
              :items="vat"
              :clearable="false"
              :searchable="false"
              label="Виберіть ставку"
            />
            <div class="error__box">
              <span>{{ errors.vat }}</span>
            </div>
          </v-flex>
        </v-layout>
        <v-layout wrap>
          <v-flex xs12 sm3 md3 class="input-box">
            <label>Код</label>
            <input
              v-model="model.uuid"
              type="text"
              readonly
              class="input-default disabled"
              placeholder="Код з 1С"
            />
            <div class="error__box">
              <span>{{ errors.uuid }}</span>
            </div>
          </v-flex>
          <v-flex xs12 sm3 md3 class="input-box">
            <label>Артикул</label>
            <input
              v-model="model.sku"
              type="text"
              class="input-default"
              placeholder="Артикул"
            />
            <div class="error__box">
              <span>{{ errors.sku }}</span>
            </div>
          </v-flex>
          <v-flex xs12 sm3 md3 class="input-box">
            <label>Одиниця вимірювання</label>
            <v-select
              v-model="model.unit_uuid"
              hide-details
              solo
              :items="unit"
              :clearable="false"
              :searchable="false"
              item-text="name"
              item-value="uuid"
              label="Виберіть одиницю"
            />
            <div class="error__box">
              <span>{{ errors.unit_uuid }}</span>
            </div>
          </v-flex>
          <v-flex xs12 sm3 md3 class="input-box">
            <label>Категорія</label>
            <!--                        <el-cascader :options="managementCategory" :show-all-levels="false"></el-cascader>-->
            <v-select
              ref="selectCategory"
              v-model="model.category_uuid"
              class="focus-state"
              hide-details
              solo
              :items="managementCategory"
              :clearable="false"
              :searchable="false"
              item-text="name"
              item-value="uuid"
              return-object
              label="Виберіть категорію"
            />
            <div class="error__box">
              <span>{{ errors.category_uuid }}</span>
            </div>
          </v-flex>
        </v-layout>
        <v-layout wrap>
          <v-flex xs12 sm3 md3 class="input-box">
            <label>Постачальник</label>
            <v-select
              v-model="model.vendor_id"
              hide-details
              solo
              :items="vendor"
              :clearable="false"
              :searchable="false"
              item-text="name"
              item-value="id"
              label="Виберіть постачальника"
            />
            <div class="error__box">
              <span>{{ errors.vendor_id }}</span>
            </div>
          </v-flex>
          <v-flex xs12 sm3 md3 class="input-box">
            <label>Марка/бренд</label>
            <v-select
              v-model="model.brand_id"
              hide-details
              solo
              :items="brand"
              :clearable="false"
              :searchable="false"
              item-text="name"
              item-value="id"
              label="Виберіть марку"
            />
            <div class="error__box">
              <span>{{ errors.brand_id }}</span>
            </div>
          </v-flex>
          <v-flex xs12 sm3 md3 class="input-box">
            <label>Тип номенклатури</label>
            <v-select
              v-model="
                model.category_uuid.type === undefined
                  ? model.category_type
                  : model.category_uuid.type
              "
              disabled
              readonly
              hide-details
              solo
              :items="categoryTypes"
              :clearable="false"
              :searchable="false"
              item-text="name"
              item-value="id"
              label="Виберіть тип"
            />
            <div class="error__box">
              <span></span>
            </div>
          </v-flex>
          <v-flex xs12 sm3 md3 class="input-box">
            <label>Код УКТЗЕД</label>
            <v-select
              v-model="model.uktzed"
              hide-details
              solo
              :items="uktzed"
              :clearable="false"
              :searchable="false"
              item-text="short_name"
              item-value="uuid"
              label="Виберіть код"
            />
            <div class="error__box">
              <span>{{ errors.uktzed }}</span>
            </div>
          </v-flex>
        </v-layout>
        <v-layout wrap class="mt-2">
          <el-upload
            action="#"
            accept="image/png, image/jpeg, image/jpg"
            list-type="picture-card"
            :on-remove="handleRemove"
            multiple
            :limit="30"
            :on-change="fileListFunc"
            :file-list="filelistModelImg"
            :auto-upload="false"
          >
            <i slot="default" class="el-icon-plus"></i>
            <div slot="file" slot-scope="{ file }">
              <img
                class="el-upload-list__item-thumbnail"
                :src="file.url"
                alt=""
              />
              <span class="el-upload-list__item-actions">
                <span
                  v-if="!disabled"
                  class="el-upload-list__item-delete"
                  @click="handleRemove(file, fileList)"
                >
                  <i class="el-icon-delete"></i>
                </span>
              </span>
            </div>
          </el-upload>
        </v-layout>
        <div class="error__box">
          <span>{{ errors.files }}</span>
        </div>
        <v-layout class="mt-4">
          <addAttr
            :attr-item="attrItem"
            :clear-attr="clearAttr"
            :add-attr-bul="addAttrBul"
            :data-attr="dataAttr"
            @changeAttrItem="changeAttrItem"
            @addAttrFunc="addAttrFunc"
            @deleteAttr="deleteAttr"
            @dataArrChange="dataArrChange"
            @loadAttr="apiAttr"
            @closeAdd="closeAdd"
          />
        </v-layout>
        <v-layout class="mt-4">
          <div class="input-box">
            <label>Опис</label>
            <textarea
              v-model="model.description"
              class="textarea-default"
              type="text"
              placeholder="Додайте опис"
            ></textarea>
            <div class="error__box">
              <span>{{ errors.description }}</span>
            </div>
          </div>
        </v-layout>
      </v-container>
      <v-card-actions v-if="$store.getters['params/mobileView']">
        <v-spacer />
        <div class="button button__red" @click="cancel">Закрити</div>
        <div
          v-if="!modelChange || model.buffer_status == 1"
          class="button button__purple"
          :class="{ 'is-disabled': !modelChange }"
        >
          Зберегти товар
        </div>
        <div
          v-if="update && !model.is_buffer && modelChange"
          class="button button__blueBG"
          @click="updateDataModal(0)"
        >
          Зберегти товар
        </div>
        <div
          v-show="!$root.rbac.managementProductBuffer"
          v-if="
            update &&
              model.is_buffer &&
              model.buffer_status !== 1 &&
              modelChange
          "
          class="button button__blueBG"
          @click="updateDataModal(0)"
        >
          Зберегти товар
        </div>
        <div
          v-show="!$root.rbac.managementProductBuffer"
          v-if="!update && model.buffer_status !== 1 && modelChange"
          class="button button__blueBG"
          @click="create(0)"
        >
          Зберегти товар
        </div>
        <v-menu
          v-if="model.is_buffer && model.buffer_status !== 1 && modelChange"
          v-show="$root.rbac.managementProductBuffer"
          offset-y
          content-class="menu-default"
        >
          <template v-slot:activator="{ on }">
            <div
              v-show="$root.rbac.managementProductBuffer"
              v-if="model.is_buffer"
              class="button button__blueBG iconBtn"
              v-on="on"
            >
              Зберегти товар
              <v-icon class="pos-right">more_horiz</v-icon>
            </div>
          </template>
          <v-list v-if="model.is_buffer">
            <v-list-tile v-if="!update" @click="create(0)">
              Зберегти товар i не передавати 1С
            </v-list-tile>
            <v-list-tile
              v-show="$root.rbac.managementProductBuffer"
              v-if="!update"
              @click="create(1)"
            >
              Зберегти товар i передати в 1С
            </v-list-tile>
            <v-list-tile v-if="update" @click="updateDataModal(0)">
              Зберегти товар i не передавати 1С
            </v-list-tile>
            <v-list-tile
              v-show="$root.rbac.managementProductBuffer"
              v-if="update"
              @click="updateDataModal(1)"
            >
              Зберегти товар i передати в 1С
            </v-list-tile>
          </v-list>
        </v-menu>
      </v-card-actions>
    </v-card>
    <v-snackbar
      v-model="alertAttr"
      fixed
      dismissible
      type="error"
      color="#F24949"
    >
      <span>Немає доступних атрибутів</span>
      <v-btn color="pink" flat icon @click="alertAttr = false">
        <v-icon>close</v-icon>
      </v-btn>
    </v-snackbar>
  </v-dialog>
</template>

<script>
import { mapGetters } from "vuex"
import addAttr from "./addAttr"

export default {
  name: "DialogCreateCostCenter",
  components: { addAttr },
  props: {
    model: { type: Object },
    categoryTypes: { type: Array },
    managementCategory: { type: Array },
    brand: { type: Array },
    vendor: { type: Array },
    unit: { type: Array },
    uktzed: { type: Array },
    vat: { type: Array },
    dialog: { type: Boolean },
    update: { type: Boolean },
    companyEntities: { type: Array },
    modelChange: { type: Boolean },
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
    attr: [],
    dataAttr: [],
    attrItem: [],
    preventAction: false,
    dialogVisible: false,
    disabled: false,
    addAttrBul: true,
    selectCategory: false,
    alertAttr: false,
    clearAttr: false,
    fileList: [],
    filelistModelImg: []
  }),
  watch: {
    dialog(e) {
      if (!e) {
        this.fileList = []
        this.model.images = []
      }
      this.filelistModelImg = this.model.images
      this.errors = []
    },
    update(e) {
      if (e) {
        this.selectCategory = true
        this.clearAttr = true
        this.apiAttr(true)
      }
    },
    "model.category_uuid": function() {
      this.selectCategory = true
      this.clearAttr = true
      this.apiAttr()
    },
    "model.buy_price": function(e) {
      if (e < 0) {
        this.model.buy_price = e * -1
      }
      this.model.buy_price = Math.floor(e * 100) / 100
    },

    model: {
      handler() {
        this.$emit("changeOn", true)
      },
      deep: true
    },
    fileList() {
      this.$emit("changeOn", true)
    },
    attrItem(e) {
      this.model.props = e
    }
  },
  mounted() {
    this.apiAttr()
  },
  methods: {
    changeAttrItem(e, clear) {
      if (!e) {
        this.attrItem = []
      } else {
        if (clear) {
          this.attrItem.forEach((item, index) => {
            if (item.id == e.id) this.attrItem.splice(index, 1)
          })
        } else {
          this.attrItem.push(e)
        }
      }
    },
    addAttrFunc(e) {
      if (e) {
        this.addAttrBul = e
      } else {
        if (this.selectCategory) {
          if (this.dataAttr.length > 0) {
            this.addAttrBul = !this.addAttrBul
          } else {
            this.alertAttr = true
          }
        } else {
          this.$refs.selectCategory.$el.classList.add("focus-active")
          setTimeout(
            () =>
              this.$refs.selectCategory.$el.classList.remove("focus-active"),
            500
          )
        }
      }
    },
    deleteAttr(e) {
      this.dataAttr.push(e)
    },
    closeAdd() {
      this.addAttrBul = !this.addAttrBul
    },
    dataArrChange(e) {
      this.dataAttr.forEach((i, index) => {
        if (i.id == e) this.dataAttr.splice(index, 1)
      })
    },
    getPropsFromApi(e) {
      this.loading = true
      this.$api
        .post("/product/props-by-product", {
          uuid: e
        })
        .then(response => {
          if (response.data.props !== undefined) {
            this.attrItem = response.data.props
          }
          this.loading = false
        })
      this.listUpdated(false)
    },
    apiAttr(apiAttr) {
      var url = "/graphql"
      // eslint-disable-next-line no-unused-vars
      let order = "DESC"
      let uuid = this.model.category_uuid.uuid
      if (uuid === undefined) {
        uuid = this.model.category_uuid
      }
      this.$api
        .post(url, {
          query:
            `
                        query{
                              attribute(uuid: "` +
            uuid +
            `"){
                                  id
                                  name
                                  values{
                                    id
                                    name
                                  }
                                }
                            }`
        })
        .then(response => {
          this.dataAttr = response.data.data.attribute
          this.clearAttr = false
          if (apiAttr !== undefined && apiAttr) {
            this.getPropsFromApi(this.model.uuid)
          }
        })
    },
    fileListFunc(file, fileList) {
      if (
        file.raw.type == "image/png" ||
        file.raw.type == "image/jpeg" ||
        file.raw.type == "image/jpg"
      ) {
        this.fileList = fileList
      } else {
        fileList.forEach((e, index) => {
          if (e.uid == file.uid) {
            fileList.splice(index, 1)
          }
        })
      }
    },
    fileListForm(fileList) {
      let arrImg = []
      let modelImg = []
      fileList.forEach(e => {
        if (e.status == "ready") {
          arrImg.push(e)
        } else {
          modelImg.push(e)
        }
      })
      this.model.images = modelImg
      this.fileList = arrImg
    },
    handleRemove(file, fileList) {
      if (fileList.length) {
        this.filelistModelImg.forEach((img, index) => {
          if (file.status == "success" && file.id == img.id) {
            fileList.splice(index, 1)
          }
        })
        fileList.forEach((img, index) => {
          if (file.status == "ready" && file.uid == img.uid) {
            fileList.splice(index, 1)
          }
        })
      } else {
        this.filelistModelImg.forEach((img, index) => {
          if (file.status == "success" && file.id == img.id) {
            this.filelistModelImg.splice(index, 1)
          }
        })
      }
    },
    create(send1c) {
      if (this.preventAction) {
        return true
      }
      this.preventAction = true
      let data = this.model
      data.buffer = send1c
      data.imagesModel = JSON.stringify(data.images)
      if (data.category_uuid.uuid !== undefined) {
        data.category_uuid = data.category_uuid.uuid
      }
      let formData = new FormData()
      for (const key of Object.keys(data)) {
        formData.append(key, data[key])
      }
      formData.delete("files")
      if (this.fileList.length > 0) {
        this.fileListForm(this.fileList)
        this.fileList.forEach((data, i) => {
          formData.append("files[" + i + "]", data.raw)
        })
      }
      this.$api.post("/product/create", formData).then(response => {
        this.preventAction = false
        let errors = []
        if (response.data.success) {
          this.$emit("closeDialog", false)
          this.listUpdated()
          if (send1c) {
            this.$loadingBus.$emit("snackbar", {
              title: "товар переведено до буферу на статус “оброблюється“",
              color: "#4caf50"
            })
          } else {
            this.$loadingBus.$emit("snackbar", {
              title: "товар переведено до буферу на статус “редагується“",
              color: "#4caf50"
            })
          }
        } else {
          response.data.errors.forEach(function(value) {
            errors[value.field] = value.message
          })
          this.errors = errors
        }
      })
    },
    updateDataModal(send1c) {
      if (this.preventAction) {
        return true
      }
      this.preventAction = true
      let data = this.model
      data.buffer = send1c
      data.imagesModel = JSON.stringify(data.images)
      if (data.category_uuid.uuid !== undefined) {
        data.category_uuid = data.category_uuid.uuid
      }
      let formData = new FormData()
      for (const key of Object.keys(data)) {
        formData.append(key, data[key])
      }
      formData.delete("files")
      if (this.fileList.length > 0) {
        this.fileListForm(this.fileList)
        this.fileList.forEach((data, i) => {
          formData.append("files[" + i + "]", data.raw)
        })
      }
      this.$api.post("/product/update", formData).then(response => {
        this.preventAction = false
        let errors = []
        if (response.data.success) {
          if (send1c && this.model.is_buffer) {
            this.$loadingBus.$emit("snackbar", {
              title: "товар переведено до буферу на статус “редагується“",
              color: "#4caf50"
            })
          } else if (!send1c && this.model.is_buffer) {
            this.$loadingBus.$emit("snackbar", {
              title: "товар переведено до буферу на статус “оброблюється“",
              color: "#4caf50"
            })
          }
          this.$emit("closeDialog", false)
          this.listUpdated()
        } else {
          response.data.errors.forEach(function(value) {
            errors[value.field] = value.message
          })
          this.errors = errors
        }
      })
    },
    cancel() {
      this.listUpdated()
      this.$emit("closeDialog", false)
    },
    listUpdated() {
      this.$nextTick(() => {
        this.$emit("listUpdated", true)
        setTimeout(() => {
          this.$emit("listUpdated", false)
        }, 100)
      })
    },
    openDialog() {
      if (this.model.category_uuid === "") {
        this.selectCategory = false
      }
      this.$emit("closeDialog", true)
      this.errors = []
    }
  },
  // eslint-disable-next-line vue/order-in-components
  computed: {
    ...mapGetters("user", ["currentUser"])
  }
}
</script>

<style lang="sass"></style>

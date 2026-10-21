<template>
  <div class="attrPlus plus__modal__box">
    <div class="attrPlus-wrap">
      <div
        v-for="(item, index) in attrItem"
        :key="index"
        class="attrItem input-box"
      >
        <v-select
          v-model="item.id"
          class="no-arrow"
          :append-icon="false"
          hide-details
          solo
          :items="attrItem"
          return-object
          :clearable="false"
          :searchable="false"
          item-text="name"
          item-value="id"
          readonly
          label="Назва"
        />
        <v-select
          v-model="item.value_uuid"
          :append-icon="false"
          class="no-arrow"
          hide-details
          solo
          :items="item.values"
          return-object
          :clearable="false"
          :searchable="false"
          item-text="name"
          readonly
          item-value="id"
          label="Значення"
        />
        <div class="action">
          <v-btn flat icon @click="deleteAttr(item)">
            <i class="icon icon-delete"></i>
          </v-btn>
        </div>
      </div>
      <label v-if="addAttrBul" style="cursor: pointer">
        <v-btn class="btn__plus" small flat @click="addAttrFunc">
          <v-icon>add</v-icon>
        </v-btn>
        Додатковий атрибут
      </label>
      <label v-else style="cursor: pointer">
        <v-btn class="btn__plus" small flat>
          <v-icon>add</v-icon>
        </v-btn>
        Додатковий атрибут
      </label>
      <div v-if="!addAttrBul" class="attrItem input-box">
        <v-select
          v-model="selectModel.id"
          hide-details
          solo
          :items="dataAttr"
          return-object
          :clearable="false"
          :searchable="false"
          item-text="name"
          item-value="id"
          label="Назва"
          @change="itemName"
        />
        <v-select
          hide-details
          solo
          :items="dataValues.values"
          return-object
          :clearable="false"
          :searchable="false"
          item-text="name"
          item-value="id"
          label="Значення"
          @change="itemValues"
        />
        <div class="action">
          <v-btn flat small icon color="#A1A8C3" @click="closeAttrAdd">
            <v-icon>close</v-icon>
          </v-btn>
          <v-btn
            v-if="modelAttr.value_uuid"
            small
            flat
            icon
            color="#A1A8C3"
            @click="addAttrArr"
          >
            <v-icon>done</v-icon>
          </v-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AddAttr",
  // eslint-disable-next-line vue/require-prop-types
  props: ["dataAttr", "addAttrBul", "clearAttr", "attrItem"],
  data: () => ({
    pushArr: false,
    modelAttr: {
      id: 0,
      name: "",
      values: []
    },
    dataValues: {
      id: -1,
      name: "",
      values: []
    },
    selectModel: {
      name: "",
      id: -1
    }
  }),
  watch: {
    attrItem(e) {
      if (e !== undefined) {
        e.forEach(i => {
          this.$emit("dataArrChange", i.id)
        })
      }
    },
    clearAttr(e) {
      if (e) {
        this.attr = []
        this.$emit("changeAttrItem", false)
        this.dataValues = {}
        this.selectModel = {}
        this.$emit("addAttrFunc", true)
      }
    }
  },
  methods: {
    addAttrFunc() {
      this.$emit("addAttrFunc")
    },
    itemName(e) {
      this.dataValues = e
    },
    itemValues(e) {
      this.modelAttr = {
        id: this.dataValues.id,
        name: this.dataValues.name,
        value_uuid: e.id,
        values: this.dataValues.values
      }
    },
    closeAttrAdd() {
      this.$emit("closeAdd", false)
    },
    addAttrArr() {
      if (this.modelAttr.value_uuid) {
        this.$emit("dataArrChange", this.dataValues.id)
        this.attr.push(this.modelAttr)
        this.$emit("changeAttrItem", this.modelAttr)
        this.modelAttr = {}
        this.selectModel = {
          id: -1
        }
        this.dataValues = {
          id: -1,
          name: "",
          values: []
        }
        this.$emit("addAttrFunc", true)
        this.pushArr = true
      }
    },
    deleteAttr(e) {
      this.$emit("changeAttrItem", e, true)
      this.$emit("deleteAttr", e)
    }
  }
}
</script>

<style scoped></style>

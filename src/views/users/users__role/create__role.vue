<template>
  <v-dialog
    v-model="dialog"
    :fullscreen="$store.getters['params/mobileView']"
    persistent
    max-width="705px"
  >
    <template v-slot:activator="{ on }">
      <button
        v-show="$root.rbac.createRoles"
        class="button button__yellow"
        @click="openDialog"
      >
        Створити роль
      </button>
    </template>
    <v-card>
      <v-card-title>
        <span v-if="!update" class="headline">Створення ролі</span>
        <span v-else class="headline">Редагування ролі</span>
        <v-spacer />
        <v-flex xs1 sm1>
          <v-btn flat icon color="" @click="cancel">
            <v-icon>close</v-icon>
          </v-btn>
        </v-flex>
      </v-card-title>

      <v-container
        v-disable-all="!$root.rbac.updateRoles && update"
        grid-list-md
      >
        <v-layout wrap>
          <v-flex xs12 sm6 md6 class="input-box">
            <label>Назва</label>
            <input
              v-model="model.description"
              type="text"
              class="input-default"
              placeholder="Придумайте назву ролі"
            />
            <div class="error__box">
              <span>{{ errors.description }}</span>
            </div>
          </v-flex>

          <v-flex xs12 sm12 class="role__tree">
            <label>Доступи до розділів:</label>
            <el-tree
              ref="tree"
              :data="rules"
              show-checkbox
              node-key="name"
              :props="label"
              @check-change="checkPermission"
            >
              <span slot-scope="{ node, data }" class="custom-tree-node">
                {{ data.description }}
                <v-tooltip
                  v-if="
                    data.name == 'viewDashboardOrder' ||
                      data.name == 'viewOrder' ||
                      data.name == 'orderShowBtn' ||
                      data.name == 'catalogShowBtn'
                  "
                  z-index="9999"
                  bottom
                >
                  <v-icon
                    slot="activator"
                    style="font-size: 16px; color: #a1a8c3; cursor: pointer"
                  >
                    info
                  </v-icon>
                  <span v-if="data.name == 'viewDashboardOrder'">
                    Щоб повністю обмежити список замовлень потрібно прибрати
                    права доступу в замовленнях.
                  </span>
                  <span v-if="data.name == 'viewOrder'">
                    Щоб повністю обмежити список замовлень потрібно прибрати
                    права доступу в розділі дошка.
                  </span>
                  <span v-if="data.name == 'orderShowBtn'">
                    Аналогічне право є в розділі каталог.
                  </span>
                  <span v-if="data.name == 'catalogShowBtn'">
                    Аналогічне право є в розділі замовлення.
                  </span>
                </v-tooltip>
              </span>
            </el-tree>
            <!--<div v-for="item in rules" :key="item.id">-->
            <!--<div class="checkbox__custom">-->
            <!--<v-checkbox v-model="model[item.id]" :label="item.description" :name="item.name"></v-checkbox>-->
            <!--</div>-->
            <!--<div class="checkbox__wrap" v-if="model[item.id]">-->
            <!--<div class="checkbox__custom pl-4" v-for="child in item.children" :key="child.name">-->
            <!--<v-checkbox v-model="selectedRules[child.name]"  :label="child.description"></v-checkbox>-->
            <!--</div>-->
            <!--</div>-->
            <!--</div>-->
          </v-flex>
          <author :update="update" :history="model.history" />
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
          :disabled="disableButton"
          :class="{ button__gray: disableButton }"
          @click="createUser"
        >
          Створити
        </button>
        <button
          v-else
          v-show="$root.rbac.updateRoles"
          class="button button__yellow"
          flat
          @click="updateUser"
        >
          Застосувати
        </button>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "CreateUser",
  // eslint-disable-next-line vue/require-prop-types
  props: ["model", "dialog", "update", "rules", "selectedRules"],
  data: () => ({
    date: new Date().toISOString().substr(0, 10),
    modal: false,
    costCenters: [],
    errors: [],
    disableButton: true,
    label: {
      label: "description"
    },
    preventAction: false
  }),
  watch: {
    model: {
      handler(e) {
        // if (this.selectedRules.length > 0) {
        this.$refs.tree.setCheckedKeys(this.selectedRules)
        // }
        if (e.description != "") {
          this.disableButton = false
        } else {
          this.disableButton = true
        }
      },
      deep: true
    }
  },
  methods: {
    checkPermission(a, b, c) {
      if (typeof a.children == "undefined") {
        let key = this.selectedRules.indexOf(a.name)
        if (b && key == -1) {
          this.selectedRules.push(a.name)
        } else if (!b && key > -1) {
          this.selectedRules.splice(key, 1)
        }
      } else {
        if (!c) {
          a.children.forEach(i => {
            let key = this.selectedRules.indexOf(i.name)
            if (b && key == -1) {
              this.selectedRules.push(i.name)
            } else if (!b && key > -1) {
              this.selectedRules.splice(key, 1)
            }
          })
        }
      }
    },
    createUser() {
      if (this.preventAction) {
        return true
      }
      this.preventAction = true
      this.$api
        .post("roles/create", {
          description: this.model.description,
          rules: this.selectedRules
        })
        .then(response => {
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
    updateUser() {
      if (this.preventAction) {
        return true
      }
      this.preventAction = true
      this.$api
        .post("roles/update", {
          name: this.model.name,
          description: this.model.description,
          rules: this.selectedRules
        })
        .then(response => {
          this.preventAction = false
          let errors = []
          if (response.data.success) {
            this.cancel()
            this.$socket.emit("setPermissions", {})
          } else {
            response.data.errors.forEach(function(value) {
              errors[value.field] = value.message
            })
            this.errors = errors
          }
        })
    },
    cancel() {
      this.errors = []
      this.$emit("closeDialog", false)
      this.updateList()
    },
    updateList() {
      this.$emit("updateList", true)
      setTimeout(() => {
        this.$emit("updateList", false)
      }, 100)
    },
    openDialog() {
      this.$emit("openDialog", true)
    }
  }
}
</script>

<style scoped></style>

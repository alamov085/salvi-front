<template>
  <div class="section__content">
    <div class="section__content__head">
      <div class="caption">Призначення черговості кроків</div>

      <create__matching
        :dialog="dialog"
        :update="update"
        :model="model"
        :roles="roles"
        @closeDialog="closeDialog"
      />
    </div>
    <div>
      <draggable
        v-model="matching"
        class="step__wrap pl-3 pr-3 transition__wrap"
        tag="transition-group"
        :component-data="componentData"
        :animation="100"
        draggable=".card__step__drag"
        :disabled="!$root.rbac.changeOrderCoordination"
        @start="drag = true"
        @change="onMove"
        @end="drag = false"
      >
        <v-flex
          v-for="element in matching"
          ref="step__wrap"
          :key="element.id"
          class="card__step card__step__drag"
          :class="{ not__active: element.status == 0 }"
        >
          <v-toolbar color="#19B200" style="z-index: 99">
            <v-toolbar-title>{{ element.name }}</v-toolbar-title>
            <v-spacer />
            <v-menu
              z-index="99"
              offset-x
              bottom
              nudge-bottom="40"
              nudge-left="-40"
              left
              content-class="action__td__drop"
              @click.native.prevent="test"
            >
              <v-btn slot="activator" icon>
                <v-icon>more_horiz</v-icon>
              </v-btn>
              <v-list v-hide-empty>
                <span>Дії</span>
                <v-list-tile
                  v-show="
                    $root.rbac.updateCoordination ||
                      $root.rbac.viewOnlyCoordination
                  "
                >
                  <v-list-tile-title @click="editItem(element)">
                    Деталі
                  </v-list-tile-title>
                </v-list-tile>
                <v-list-tile
                  v-if="element.status == 0"
                  v-show="$root.rbac.changeStatusCoordination"
                >
                  <v-list-tile-title @click="activateElement(element)">
                    Активувати
                  </v-list-tile-title>
                </v-list-tile>
                <v-list-tile
                  v-else-if="element.status == 1"
                  v-show="$root.rbac.changeStatusCoordination"
                >
                  <v-list-tile-title @click="deactivateElement(element)">
                    Деактивувати
                  </v-list-tile-title>
                </v-list-tile>

                <v-list-tile v-show="$root.rbac.deleteCoordination">
                  <v-list-tile-title @click="deleteOpenDialog(element)">
                    Видалити
                  </v-list-tile-title>
                </v-list-tile>
              </v-list>
            </v-menu>
          </v-toolbar>
          <v-card>
            <v-container fluid grid-list-md>
              <div>
                Статус:
                <span
                  class="status"
                  :class="{
                    green: element.status == 1,
                    red: element.status == 0
                  }"
                >
                  {{ element.statusName }}
                </span>
              </div>
              <label>Ролі:</label>
              <div class="box__role">
                <span
                  v-for="(item, index) in itemRole(element.roles)"
                  :key="index"
                >
                  {{ item.name }}
                </span>
              </div>
              <v-tooltip
                v-if="element.roles.length > 3"
                content-class="hint__role"
                bottom
                nudge-right="0"
                min-width="300"
                max-width="300"
                z-index="999"
              >
                <template v-slot:activator="{ on }">
                  <span class="card__step__btn" v-on="on">Всі ролі</span>
                </template>
                <span v-for="(item, index) in element.roles" :key="index">
                  {{ item.name }}</span>
              </v-tooltip>
            </v-container>
          </v-card>
        </v-flex>
        <div
          v-show="$root.rbac.createCoordination"
          slot="footer"
          key="footer"
          role="group"
          class="card__step card__step__plus"
          style="background-color: transparent"
          @click="dialog = true"
        >
          <i></i>
          <i></i>
        </div>
        <!--<div-->
        <!--slot="footer"-->
        <!--class="btn-group list-group-item"-->
        <!--role="group"-->
        <!--aria-label="Basic example"-->
        <!--key="footer"-->
        <!--&gt;-->
        <!--<button class="btn btn-secondary">Add</button>-->
        <!--<button class="btn btn-secondary" >Replace</button>-->
        <!--</div>-->
      </draggable>
    </div>
    <v-dialog v-model="dialogDelete" max-width="400">
      <v-card>
        <v-card-title class="headline">Видалити крок?</v-card-title>
        <v-card-text>
          Ви впевнені що хочете видалити даний крок?
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <button class="button button__blue" @click="closeDialogDelete">
            Скасувати
          </button>
          <button class="button button__yellow" @click="deleteElement">
            Підтвердити
          </button>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import draggable from "vuedraggable"
import create__matching from "./create__matching"
import { mapGetters } from "vuex"

export default {
  name: "Matching",
  display: "Transitions",
  components: {
    draggable,
    create__matching
  },
  data: () => ({
    dataTable: [],
    loading: false,
    drag: false,
    dialog: false,
    update: false,
    roles: [],
    model: {
      history: {
        email: "",
        role: ""
      }
    },
    matching: [],
    dialogDelete: false,
    deleteItem: {},
    componentData: {
      props: {
        type: "transition",
        name: "flip-list"
      }
    }
  }),
  watch: {
    loading(e) {
      this.$loadingBus.$emit("loading", e)
    },
    search() {
      this.getDataFromApi()
    }
  },

  created() {
    this.defaultData()
    this.getDataFromApi()
  },
  methods: {
    test() {},
    closeDialogDelete() {
      this.dialogDelete = false
    },
    deleteOpenDialog(item) {
      this.deleteItem = item
      this.dialogDelete = true
    },
    deleteElement() {
      this.$api.post("/coordination/delete", this.deleteItem).then(response => {
        if (response.data.success) {
          this.getDataFromApi()
          this.closeDialogDelete()
        }
      })
    },
    defaultData() {
      this.model = {
        name: "",
        sum: "",
        type: 1,
        additional_type: 1,
        all_roles: true,
        enable_notification: false,
        roles: [],
        users: []
      }
    },
    onMove() {
      if (this.$root.rbac.changeOrderCoordination) {
        let data = this.matching
        this.matching = this.matching.map((name, index) => {
          data[index].order = index + 1
          return data[index]
        })
        this.saveOrderToDb()
      }
    },
    itemRole(roleArr) {
      let result = []
      let length = roleArr.length
      for (let i = 0; i < length; i++) {
        if (i < 4) {
          result[i] = roleArr[i]
        }
      }
      return result
    },
    getDataFromApi() {
      this.loading = true
      let url = "/graphql"
      this.$api
        .post(url, {
          query:
            `query{
                            coordination(search: "` +
            this.search +
            `"){
                                id
                                company_id
                                name
                                sum
                                type
                                additional_type
                                status
                                all_roles
                                roles{
                                  id
                                  coordination_id
                                  role
                                  name
                                }
                                users{
                                  id
                                  coordination_id
                                  user_id
                                }
                                statusName
                                history{
                                    email
                                    role
                                }
                                enable_notification
                              }
                            authItem(type:1 status: 1){
                                name
                                description
                        }}`
        })
        .then(response => {
          this.dataTable = response.data.data.authItem
          this.roles = response.data.data.authItem
          this.matching = response.data.data.coordination
          this.loading = false
        })
    },
    saveOrderToDb() {
      this.$api
        .post("/coordination/update-order", { data: this.matching })
        // eslint-disable-next-line no-unused-vars
        .then(response => {
          // console.log(response.data);
        })
    },
    editItem(item) {
      // this.$emit('editItem', item);
      item.roles = item.roles.map(name => {
        return name["role"]
      })
      item.users = item.users.map(name => {
        return "" + name["user_id"]
      })
      this.model = item
      this.dialog = true
      this.update = true
    },
    closeDialog(e) {
      this.dialog = e
      this.update = false
      this.defaultData()
      if (!e) {
        this.getDataFromApi()
      }
    },
    updateList() {
      this.getDataFromApi()
    },
    activateElement(e) {
      this.$api
        .post("/coordination/change-status", { id: e.id, status: 1 })
        .then(response => {
          if (response.data.success) {
            this.getDataFromApi()
          }
        })
    },
    deactivateElement(e) {
      this.$api
        .post("/coordination/change-status", { id: e.id, status: 0 })
        .then(response => {
          if (response.data.success) {
            this.getDataFromApi()
          }
        })
    }
  },
  computed: {
    ...mapGetters("params", ["search"])
  }
}
</script>

<style scoped>
.flip-list-move {
  transition: transform 0.5s;
}

.no-move {
  transition: transform 0.5s;
}

.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}

.list-group {
  min-height: 20px;
}

.list-group-item {
  cursor: move;
}

.list-group-item i {
  cursor: pointer;
}
</style>

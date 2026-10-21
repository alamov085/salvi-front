<template>
    <div>
        <v-data-table
                :headers="headers"
                :items="dataTable"
                :pagination.sync="pagination"
                :total-items="total_items"
                :loading="loading"
                class="table__tamplate-2 theme--light table__users trPointer"
                no-data-text="Немає даних"
        >
            <template v-slot:items="props">
                <tr @click="editItem(props.item)">
                    <td class="icon">
                        <div>
                            <v-tooltip top max-width="320px">
                                <div v-if="props.item.status == 20">
                                    Активний
                                </div>
                                <div v-else>Не активний</div>
                                <v-icon
                                        v-if="props.item.status == 20"
                                        slot="activator"
                                        style="color: white; background-color: #19B200;"
                                        class="pointer"
                                >
                                    done
                                </v-icon>
                                <v-icon
                                        v-else
                                        slot="activator"
                                        style="color: white; background-color: #F24949;"
                                        class="pointer"
                                >
                                    priority_high
                                </v-icon>
                            </v-tooltip>
                        </div>
                    </td>
                    <td>{{ props.item.email }}</td>
                    <td class="text-xs-left">
                        <span v-if="props.item.phone_number != null">
                          +380{{ props.item.phone_number }}
                        </span>
                    </td>

                    <td class="text-xs-left">
                        <span v-if="props.item.full_name != null">
                          {{ props.item.full_name }}
                        </span>
                    </td>
                    <td>
                        <span v-if="props.item.company_name != null">
                          {{ props.item.company_name }}
                        </span>
                    </td>
                    <td class="justify-center action__td" @click.stop>
                        <v-menu
                                offset-x
                                bottom
                                nudge-bottom="40"
                                nudge-left="-40"
                                left
                                content-class="action__td__drop"
                        >
                            <v-btn slot="activator" icon>
                                <v-icon>more_horiz</v-icon>
                            </v-btn>
                            <v-list v-hide-empty>
                                <span>Дії</span>
                                <v-list-tile
                                        v-show="
                    $root.rbac.updateManager || $root.rbac.viewOnlyManager
                  "
                                >
                                    <v-list-tile-title @click="editItem(props.item)">
                                        Деталі
                                    </v-list-tile-title>
                                </v-list-tile>
                                <v-list-tile
                                        v-if="props.item.status == 20"
                                        v-show="$root.rbac.updateManagerStatus"
                                >
                                    <v-list-tile-title
                                            @click="statusDeactivateBtn(props.item.id)"
                                    >
                                        Деактивувати
                                    </v-list-tile-title>
                                </v-list-tile>
                                <v-list-tile
                                        v-else-if="props.item.status != 20"
                                        v-show="$root.rbac.updateManagerStatus"
                                >
                                    <v-list-tile-title @click="statusActivateBtn(props.item.id)">
                                        Активувати
                                    </v-list-tile-title>
                                </v-list-tile>
                                <v-list-tile
                                        v-show="$root.rbac.updateManager && currentUser.company_id"
                                >
                                    <v-list-tile-title
                                            v-if="!props.item.all_company"
                                            @click="removeDialogOpen(props.item)"
                                    >
                                        Прибрати менеджера
                                    </v-list-tile-title>
                                    <v-list-tile-title v-else>
                                        <div class="d-flex align-center">
                                            <div style="opacity: 0.5">Прибрати менеджера</div>
                                            <v-tooltip tag="div" top>
                                                <i slot="activator" class="vsm-icon icon-info"></i>
                                                <div>
                                                    Менеджер має доступ до всіх існуючих підприємств, дану
                                                    дію можливо виконати в загальному режимі
                                                </div>
                                            </v-tooltip>
                                        </div>
                                    </v-list-tile-title>
                                </v-list-tile>
                            </v-list>
                        </v-menu>
                    </td>
                </tr>
            </template>
        </v-data-table>
        <v-dialog v-model="dialogStatus" max-width="400px">
            <v-card>
                <v-card-title class="headline">{{ dialogStatusHead }}</v-card-title>
                <v-card-text>
                    {{ dialogStatusText }}
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <button class="button button__blue" @click="dialogStatus = false">
                        Скасувати
                    </button>
                    <button class="button button__yellow" @click="dialogStatusAction()">
                        Підтвердити
                    </button>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="dialogRemove" max-width="400px">
            <v-card>
                <v-card-title class="headline">Підтвердіть дію</v-card-title>
                <v-card-text>
                    Ви впевнені, що хочете зняти з цього підприємства менеджера?
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <button class="button button__blue" @click="dialogRemove = false">
                        Скасувати
                    </button>
                    <button class="button button__yellow" @click="removeManager()">
                        Підтвердити
                    </button>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
    import { mapGetters } from "vuex"

    export default {
        name: "Table__users",
        props: ["updateList"],
        data: () => ({
            loading: false,
            total_items: 0,
            pagination: {
                sortBy: "email",
                rowsPerPage: 100,
                page: 1
            },
            headers: [
                { text: "", value: "icon", sortable: false, class: "icon" },
                { text: "E-mail", value: "email", align: "left", sortable: false },
                { text: "Телефон", value: "email", align: "left", sortable: false },
                { text: "ПІБ", value: "full_name", align: "left", label: "ПІБ", sortable: false },
                { text: "Підприємство", value: "company_name", align: "left", sortable: true, label: "Підприємство" },
                { text: "", value: "actions", sortable: false }
            ],
            dataTable: [],
            roles: [],
            company: [],
            editedIndex: -1,
            dialogStatus: false,
            dialogStatusHead: "",
            dialogStatusText: "",
            dialogStatusAct: 1,
            dialogStatusModel: 1,
            removeDialogData: {},
            dialogRemove: false
        }),
        watch: {
            pagination: {
                handler() {
                    this.getDataFromApi()
                },
                deep: true
            },
            updateList(e) {
                if (e) {
                    this.getDataFromApi()
                }
            },
            roles() {
                this.$emit("rolesList", { roles: this.roles, company: this.company })
            },
            search() {
                this.getDataFromApi()
            },
            loading(e) {
                this.$loadingBus.$emit("loading", e)
            }
        },
        computed: {
            ...mapGetters("params", ["search"]),
            ...mapGetters("user", ["currentUser"])
        },
        created() {
            if (this.currentUser.company_id) {
                // this.headers.splice(2,1);
                this.headers[2].text = "Телефон"
            }
        },
        methods: {
            removeManager() {
                this.$api
                    .post("/managers/remove-from-company", { id: this.removeDialogData.id })
                    .then(response => {
                        if (response.data.success) {
                            this.dialogRemove = false
                            this.getDataFromApi()
                        }
                    })
            },
            removeDialogOpen(e) {
                this.removeDialogData = e
                this.dialogRemove = true
            },
            statusActivateBtn(id) {
                this.dialogStatusModel = id
                this.dialogStatusHead = "Активувати менеджера?"
                this.dialogStatusText = "Ви впевнені, що хочете активувати менеджера?"
                this.dialogStatusAct = 1
                this.dialogStatus = true
            },
            statusDeactivateBtn(id) {
                this.dialogStatusModel = id
                this.dialogStatusHead = "Деактивувати менеджера?"
                this.dialogStatusText = "Ви впевнені, що хочете деактивувати менеджера?"
                this.dialogStatusAct = 0
                this.dialogStatus = true
            },
            dialogStatusAction() {
                if (this.dialogStatusAct) {
                    this.statusActivate(this.dialogStatusModel)
                } else {
                    this.statusDeactivate(this.dialogStatusModel)
                }
                this.dialogStatus = false
            },
            getDataFromApi() {
                this.loading = true
                var url = "/graphql"
                let order = "ASC"
                if (this.pagination.descending) {
                    order = "DESC"
                }
                this.$api
                    .post(url, {
                        query:
                        `
                        query{
                              user(page: ` +
                        this.pagination.page +
                        ` perPage: ` +
                        this.pagination.rowsPerPage +
                        ` order: "` +
                        order +
                        `" orderBy: "` +
                        this.pagination.sortBy +
                        `"  search: "` +
                        this.search +
                        `"){
                                 totalCount
                                 items{
                                  id
                                  first_name
                                  last_name
                                  email
                                  status
                                  currency_id
                                  company_id
                                  password_difficult
                                  username
                                  reason
                                  position
                                  role_name
                                  phone_number
                                  role_description
                                  currency{
                                    id
                                    code
                                    name
                                  }
                                  created_at
                                  all_location
                                  all_cost
                                  locations{
                                    id
                                    user_id
                                    location_id
                                  }
                                  company_name
                                  costCenters{
                                    id
                                    cost_center_id
                                  }
                                  history{
                                    email
                                    role
                                  }
                                }
                              }
                              authItem(type: 1 status: 1){
                                name
                                company_id
                                description
                                status
                                company_id
                              }
                              location(perPage: 1000 status: 1 list:true){
                                items{
                                  id
                                  name
                                }
                              }
                              costCenter( perPage: 1000 ){
                                totalCount
                                items{
                                  name
                                  id
                                }
                              }
                            }`
                    })
                    .then(response => {
                        this.locations = response.data.data.location.items
                        let data = response.data.data.user.items
                        let allLocation = []
                        allLocation = this.locations.map(function(val) {
                            return val.id
                        })
                        data.forEach(function(value, index) {
                            if (value.all_location) {
                                data[index].locations = allLocation
                            } else {
                                data[index].locations = value.locations.map(function(value) {
                                    return value.location_id
                                })
                            }
                            data[index].full_name = value.first_name + ' ' + value.last_name;

                            data[index].cost_centers = value.costCenters.map(function(value) {
                                return value.cost_center_id
                            })
                        })
                        this.dataTable = data
                        this.total_items = response.data.data.user.totalCount
                        this.statuses = response.data.statuses
                        this.roles = response.data.data.authItem
                        this.costCenter = response.data.data.costCenter.items
                        this.loading = false
                    })
                this.$emit("listUpdated", false)
            },
            editItem(item) {
                this.$emit("editItem", item)
            },
            statusDeactivate(id) {
                this.$api.post("users/deactivate", { id: id }).then(response => {
                    if (response.data.success) {
                        this.$emit("listUpdated", true)
                    }
                })
            },
            statusActivate(id) {
                this.$api.post("users/activate", { id: id }).then(response => {
                    if (response.data.success) {
                        this.$emit("listUpdated", true)
                    }
                })
            }
        }
    }
</script>

<style scoped></style>

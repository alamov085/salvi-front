<template>
    <div class="section__content">
        <div class="section__content__head">
            <div class="caption">Управління користувачами</div>
            <v-spacer/>
            <Create__user
            :user="user"
            :dialog="dialog"
            :update="update"
            :roles="roles"
            :company="company"
            @closeDialog="closeDialog"
            @updateList="updateList"
            @openDialog="openDialog"
            />
            <add__user
            :dialog="dialogAdd"
            :update="update"
            :companies="company"
            @closeDialog="closeDialogAdd"
            @updateList="updateList"
            />
            </div>
        <Table__users
                :update-list="updateListVal"
                @editItem="editItem"
                @rolesList="rolesList"
                @listUpdated="listUpdated"
        />
    </div>
</template>

<script>
    import Create__user from "../../users/create__user"
    import add__user from "../../users/users__manager/add__managers"
    import Table__users from "./table__users"

    export default {
        name: "UserManagement",
        components: {Table__users, Create__user, add__user},
        data() {
            return {
                user: {
                    history: {
                        email: "",
                        role: ""
                    }
                },
                dialog: false,
                dialogAdd: false,
                update: false,
                updateListVal: false,
                roles: [],
                company: []
            }
        },
        methods: {
            closeDialogAdd(e) {
                this.dialogAdd = e
                this.update = false
            },
            editItem(e) {
                this.user = e
                this.dialog = true
                this.update = true
            },
            closeDialog(e) {
                this.dialog = e
                this.initialize()
                this.update = false
            },
            openDialog(e) {
                this.dialog = e
            },
            updateList(e) {
                this.updateListVal = e
            },
            listUpdated(e) {
                this.updateListVal = e
            },
            initialize() {
                this.user = {
                    email: "",
                    phone_number: "",
                    first_name: "",
                    last_name: "",
                    password: "",
                    repeatPassword: "",
                    role_name: "",
                    all_company: false,
                    companies: [],
                    history: {
                        email: "",
                        role: ""
                    }
                }
            },
            rolesList(e) {
                this.roles = e.roles
                this.company = e.company
            }
        }
    }
</script>

<style scoped></style>

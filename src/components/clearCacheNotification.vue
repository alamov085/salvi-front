<template>
    <v-alert
            dismissible
            type="warning"
            :value="alert"
            color="orange"
    >
        Для нормальної роботи необхідно видалити кеш браузера
        <a href="https://support.google.com/accounts/answer/32050" target="_blank"> за посиланням</a>
    </v-alert>
</template>
<script>
    import moment from "moment"
export default {
    name: "clearCacheNotification",
    data() {
        return {
            alert: false
        }
    },
    computed: {

    },
    mounted() {
        this.compareHash()
        this.compareReload()
    },
    watch:{
        $route (to, from){
            this.compareHash()
            this.compareReload()
        }
    },
    methods: {
        appSrc() {
            let appHash = false
                document.querySelectorAll('script').forEach((elem) => {
                    if (elem.src.match("app")) {
                        let hash = elem.src.split('app.')[1]
                        hash = hash.split('.')[0]
                        appHash = hash
                    }
                })
            return appHash
        },
        compareHash() {
            const oldHash = localStorage.getItem('appHash')
            if (oldHash != null && oldHash != undefined) {
                if (oldHash != this.appSrc()) {
                    this.alert = true
                    localStorage.setItem('appHash', this.appSrc())
                }
            } else {
                localStorage.setItem('appHash', this.appSrc())
            }
        },
        compareReload() {
            const dateToday = moment().unix();
            const oldReload = localStorage.getItem('reloadTime');
            if (oldReload != null && oldReload != undefined) {
                if ((+dateToday - +oldReload) > 86400) {
                    localStorage.setItem('reloadTime', dateToday)
                    location.reload()
                }
            } else  {
                localStorage.setItem('reloadTime', dateToday)
                location.reload()
            }
        }
    }
}
</script>

<style lang="scss">
    .v-alert {
        position: fixed !important;
        right: 10px;
        top: 0;
        z-index: 1000;
    }
</style>
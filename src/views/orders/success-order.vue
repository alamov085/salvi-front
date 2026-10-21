<template>
    <v-container v-if="data != null" grid-list-md class="success-order">
        <v-layout row class="create-order__delivery-row">
            <v-layout column class="create-order__delivery-col">
                <v-flex>
                    <span class="success-order__title">Дякуємо за замовлення</span>
                </v-flex>
                <div class="success-order__text">
                    Якщо за вашим замовленням будуть будь-які зміни, ми зв’яжемося з Вами для уточнення деталей. <br>
                    Для зміни статуса замовлення Ви можете перейти до деталей замовлення
                </div>
                <div class="success-order__social">
                    <div class="success-order__social-text">
                        Ми в соціальних мережах
                    </div>
                    <div>
                        <div class="success-order__media">
                            <div class="success-order__media-item">
                                <a target="_blank" href="https://www.facebook.com/salvigroup.serv">
                                    <svg
                                            width="11"
                                            height="20"
                                            viewBox="0 0 11 20"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                                d="M7 11.5H9.5L10.5 7.5H7V5.5C7 4.47 7 3.5 9 3.5H10.5V0.14C10.174 0.0970001 8.943 0 7.643 0C4.928 0 3 1.657 3 4.7V7.5H0V11.5H3V20H7V11.5Z"
                                                fill="white"
                                        />
                                    </svg>
                                </a>
                            </div>
                            <div class="success-order__media-item">
                                <a target="_blank" href="https://www.instagram.com/salvi.ua/">
                                    <svg
                                            width="20"
                                            height="20"
                                            viewBox="0 0 20 20"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                                d="M10 7C9.20435 7 8.44129 7.31607 7.87868 7.87868C7.31607 8.44129 7 9.20435 7 10C7 10.7956 7.31607 11.5587 7.87868 12.1213C8.44129 12.6839 9.20435 13 10 13C10.7956 13 11.5587 12.6839 12.1213 12.1213C12.6839 11.5587 13 10.7956 13 10C13 9.20435 12.6839 8.44129 12.1213 7.87868C11.5587 7.31607 10.7956 7 10 7ZM10 5C11.3261 5 12.5979 5.52678 13.5355 6.46447C14.4732 7.40215 15 8.67392 15 10C15 11.3261 14.4732 12.5979 13.5355 13.5355C12.5979 14.4732 11.3261 15 10 15C8.67392 15 7.40215 14.4732 6.46447 13.5355C5.52678 12.5979 5 11.3261 5 10C5 8.67392 5.52678 7.40215 6.46447 6.46447C7.40215 5.52678 8.67392 5 10 5V5ZM16.5 4.75C16.5 5.08152 16.3683 5.39946 16.1339 5.63388C15.8995 5.8683 15.5815 6 15.25 6C14.9185 6 14.6005 5.8683 14.3661 5.63388C14.1317 5.39946 14 5.08152 14 4.75C14 4.41848 14.1317 4.10054 14.3661 3.86612C14.6005 3.6317 14.9185 3.5 15.25 3.5C15.5815 3.5 15.8995 3.6317 16.1339 3.86612C16.3683 4.10054 16.5 4.41848 16.5 4.75V4.75ZM10 2C7.526 2 7.122 2.007 5.971 2.058C5.187 2.095 4.661 2.2 4.173 2.39C3.739 2.558 3.426 2.759 3.093 3.093C2.78001 3.3954 2.53935 3.76458 2.389 4.173C2.199 4.663 2.094 5.188 2.058 5.971C2.006 7.075 2 7.461 2 10C2 12.474 2.007 12.878 2.058 14.029C2.095 14.812 2.2 15.339 2.389 15.826C2.559 16.261 2.759 16.574 3.091 16.906C3.428 17.242 3.741 17.443 4.171 17.609C4.665 17.8 5.191 17.906 5.971 17.942C7.075 17.994 7.461 18 10 18C12.474 18 12.878 17.993 14.029 17.942C14.811 17.905 15.338 17.8 15.826 17.611C16.259 17.442 16.574 17.241 16.906 16.909C17.243 16.572 17.444 16.259 17.61 15.829C17.8 15.336 17.906 14.809 17.942 14.029C17.994 12.925 18 12.539 18 10C18 7.526 17.993 7.122 17.942 5.971C17.905 5.189 17.8 4.661 17.61 4.173C17.4593 3.765 17.2191 3.39596 16.907 3.093C16.6047 2.77985 16.2355 2.53917 15.827 2.389C15.337 2.199 14.811 2.094 14.029 2.058C12.925 2.006 12.539 2 10 2ZM10 0C12.717 0 13.056 0.00999994 14.122 0.0599999C15.187 0.11 15.912 0.277 16.55 0.525C17.21 0.779 17.766 1.123 18.322 1.678C18.8305 2.1779 19.224 2.78259 19.475 3.45C19.722 4.087 19.89 4.813 19.94 5.878C19.987 6.944 20 7.283 20 10C20 12.717 19.99 13.056 19.94 14.122C19.89 15.187 19.722 15.912 19.475 16.55C19.2247 17.2178 18.8311 17.8226 18.322 18.322C17.822 18.8303 17.2173 19.2238 16.55 19.475C15.913 19.722 15.187 19.89 14.122 19.94C13.056 19.987 12.717 20 10 20C7.283 20 6.944 19.99 5.878 19.94C4.813 19.89 4.088 19.722 3.45 19.475C2.78233 19.2245 2.17753 18.8309 1.678 18.322C1.16941 17.8222 0.775931 17.2175 0.525 16.55C0.277 15.913 0.11 15.187 0.0599999 14.122C0.0129999 13.056 0 12.717 0 10C0 7.283 0.00999994 6.944 0.0599999 5.878C0.11 4.812 0.277 4.088 0.525 3.45C0.775236 2.78218 1.1688 2.17732 1.678 1.678C2.17767 1.16923 2.78243 0.775729 3.45 0.525C4.088 0.277 4.812 0.11 5.878 0.0599999C6.944 0.0129999 7.283 0 10 0Z"
                                                fill="white"
                                        />
                                    </svg>
                                </a>
                            </div>
                            <div class="success-order__media-item">
                                <a target="_blank" href="https://t.me/My_new_salvi_bot">
                                    <svg
                                            width="20"
                                            height="20"
                                            viewBox="0 0 20 20"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                                d="M10 18C12.1217 18 14.1566 17.1571 15.6569 15.6569C17.1571 14.1566 18 12.1217 18 10C18 7.87827 17.1571 5.84344 15.6569 4.34315C14.1566 2.84285 12.1217 2 10 2C7.87827 2 5.84344 2.84285 4.34315 4.34315C2.84285 5.84344 2 7.87827 2 10C2 12.1217 2.84285 14.1566 4.34315 15.6569C5.84344 17.1571 7.87827 18 10 18ZM10 20C4.477 20 0 15.523 0 10C0 4.477 4.477 0 10 0C15.523 0 20 4.477 20 10C20 15.523 15.523 20 10 20ZM6.89 11.17L4.392 10.391C3.852 10.226 3.849 9.854 4.513 9.587L14.246 5.827C14.811 5.597 15.131 5.888 14.948 6.617L13.291 14.437C13.175 14.994 12.84 15.127 12.375 14.87L9.824 12.982L8.635 14.13C8.513 14.248 8.414 14.349 8.226 14.374C8.039 14.4 7.885 14.344 7.772 14.034L6.902 11.163L6.89 11.171V11.17Z"
                                                fill="white"
                                        />
                                    </svg>
                                </a>
                            </div>
                            <div class="success-order__media-item">
                                <a target="_blank" href="viber://pa?chatURI=salvi">
                                    <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24px"
                                            height="24px"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                    >
                                        <path
                                                d="M7.96472 6.2019C7.77897 6.17476 7.58952 6.21205 7.42791 6.30756H7.41413C7.03892 6.52749 6.70092 6.80547 6.41269 7.13115C6.17316 7.40809 6.04322 7.68831 6.0091 7.95803C5.98875 8.11881 6.00253 8.27959 6.05044 8.43315L6.0675 8.44365C6.33722 9.2364 6.68963 9.99896 7.12013 10.7169C7.67467 11.7255 8.35713 12.6583 9.15057 13.4922L9.17419 13.5263L9.2116 13.5539L9.23522 13.5814L9.26278 13.6051C10.0997 14.4008 11.0347 15.0865 12.0453 15.6453C13.2003 16.274 13.9012 16.5713 14.3218 16.6947V16.7012C14.4452 16.7387 14.5574 16.7557 14.6703 16.7557C15.0288 16.7294 15.3682 16.5839 15.6343 16.3423C15.9585 16.054 16.2334 15.7146 16.4481 15.3376V15.331C16.6495 14.9517 16.5813 14.5927 16.2906 14.3499C15.7083 13.841 15.0788 13.389 14.4104 13C13.9628 12.7572 13.5081 12.9042 13.3237 13.1503L12.9306 13.6457C12.7291 13.8918 12.3629 13.8577 12.3629 13.8577L12.3524 13.8643C9.62175 13.1667 8.89332 10.4019 8.89332 10.4019C8.89332 10.4019 8.85919 10.0259 9.11185 9.83425L9.60403 9.43787C9.83963 9.24625 10.0037 8.79212 9.75103 8.3439C9.36477 7.67463 8.91373 7.04489 8.40441 6.46375C8.29306 6.32674 8.13685 6.23353 7.96341 6.20059L7.96472 6.2019Z"
                                                fill="white"
                                        />
                                        <path
                                                d="M12.5792 5.00009C12.3031 5.00009 12.0792 5.22395 12.0792 5.50009C12.0792 5.77623 12.3031 6.00009 12.5792 6.00009C13.8437 6.00009 14.8944 6.41341 15.7245 7.20484C16.1518 7.63824 16.4844 8.15124 16.7028 8.71263C16.922 9.27613 17.0217 9.877 16.9961 10.4789C16.9844 10.7547 17.1985 10.9879 17.4744 10.9996C17.7503 11.0114 17.9835 10.7972 17.9952 10.5213C18.0267 9.7809 17.9039 9.04214 17.6347 8.35009C17.3655 7.65807 16.9558 7.02746 16.4307 6.49657L16.4207 6.48696C15.3907 5.50193 14.0851 5.00009 12.5792 5.00009Z"
                                                fill="white"
                                        />
                                        <path
                                                d="M12.5452 6.64442C12.2691 6.64442 12.0452 6.86828 12.0452 7.14442C12.0452 7.42056 12.2691 7.64442 12.5452 7.64442H12.5615C13.474 7.70872 14.1379 8.01286 14.6034 8.5121C15.0799 9.02626 15.3267 9.66489 15.3084 10.4551C15.302 10.7311 15.5207 10.9601 15.7967 10.9665C16.0728 10.9729 16.3018 10.7543 16.3082 10.4782C16.3322 9.44071 15.9985 8.54607 15.3363 7.83174L15.3354 7.8308C14.6588 7.10472 13.7305 6.72061 12.6122 6.64554L12.5955 6.64442H12.5452Z"
                                                fill="white"
                                        />
                                        <path
                                                d="M12.5263 8.31877C12.2505 8.30426 12.0152 8.51604 12.0007 8.7918C11.9862 9.06756 12.198 9.30287 12.4737 9.31739C12.8924 9.33943 13.1592 9.46499 13.327 9.63443C13.4956 9.8046 13.6216 10.0771 13.6446 10.5043C13.6595 10.7801 13.895 10.9916 14.1708 10.9767C14.4465 10.9619 14.658 10.7264 14.6432 10.4506C14.6109 9.85058 14.4231 9.32011 14.0376 8.93078C13.6513 8.54072 13.1238 8.35022 12.5263 8.31877Z"
                                                fill="white"
                                        />
                                        <path
                                                fill-rule="evenodd"
                                                clip-rule="evenodd"
                                                d="M7.06673 2.38357C10.2488 1.67227 13.5487 1.67227 16.7308 2.38357L17.0699 2.45935C18.9667 2.88334 20.4637 4.33816 20.9418 6.22204C21.7495 9.40488 21.7495 12.7391 20.9418 15.9219C20.4637 17.8058 18.9666 19.2606 17.0699 19.6846L16.7308 19.7604C14.732 20.2072 12.6867 20.3733 10.6533 20.2588L8.0001 22.6327C7.79637 22.815 7.50959 22.872 7.25164 22.7815C6.99369 22.691 6.80543 22.4673 6.76029 22.1976L6.32148 19.5763C4.61909 19.0473 3.29919 17.6691 2.85579 15.9219C2.04807 12.7391 2.04807 9.40488 2.85579 6.22204C3.33386 4.33816 4.83092 2.88334 6.7277 2.45935L7.06673 2.38357ZM16.4036 3.84744C13.437 3.18432 10.3606 3.18432 7.39395 3.84744L7.05492 3.92323C5.71009 4.22383 4.64866 5.25532 4.3097 6.591C3.56343 9.53171 3.56343 12.6122 4.3097 15.5529C4.64866 16.8886 5.71008 17.9201 7.05492 18.2207L7.14448 18.2407C7.44237 18.3073 7.67018 18.5478 7.72058 18.8488L8.01485 20.6068L9.88722 18.9315C10.0384 18.7962 10.2379 18.7279 10.4403 18.7423C12.4338 18.8834 14.4427 18.7348 16.4036 18.2965L16.7426 18.2207C18.0875 17.9201 19.1489 16.8886 19.4879 15.5529C20.2341 12.6122 20.2341 9.53171 19.4879 6.591C19.1489 5.25532 18.0875 4.22384 16.7426 3.92323L16.4036 3.84744Z"
                                                fill="white"
                                        />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </v-layout>

            <v-layout column class="create-order__delivery-col create-order__delivery-col_right">
                <v-card variant="outlined">
                    <div class="success-order__data">
                        <div class="success-order__data-title">
                            Замовлення №{{id}}
                        </div>
                        <div class="success-order__list">
                            <div class="success-order__list-items">
                                <div class="success-order__list-item">
                                    <div class="success-order__list-item-text">
                                        Статус:
                                    </div>
                                    <div class="success-order__list-items-value">
                                        {{status.name}}
                                    </div>
                                </div>

                                <div class="success-order__list-item">
                                    <div class="success-order__list-item-text">
                                        Товарів:
                                    </div>
                                    <div class="success-order__list-items-value">
                                        {{total_items}}
                                    </div>
                                </div>

                                <div class="success-order__list-item">
                                    <div class="success-order__list-item-text">
                                        Орієнтовна дата доставки:
                                    </div>
                                    <div v-if="data.one_day_shipment" class="success-order__list-items-value">
                                        {{getDate(data.delivery_date)}}
                                    </div>
                                    <div v-else>
                                        Погодимо додатково
                                    </div>
                                </div>

                                <div class="success-order__list-item">
                                    <div class="success-order__list-item-text">
                                        Локація:
                                    </div>
                                    <div class="success-order__list-items-value">
                                        {{showFullAdress(location)}}
                                    </div>
                                </div>

                                <div v-if="data.comment.length" class="success-order__list-item">
                                    <div class="success-order__list-item-text">
                                        Коментар:
                                    </div>
                                    <div class="success-order__list-items-value">
                                        {{data.comment}}
                                    </div>
                                </div>

                                <div class="success-order__list-item">
                                    <div class="success-order__list-item-text">
                                        Загальна сума:
                                    </div>
                                    <div class="success-order__list-items-value">
                                        <b>
                                            {{this.data.total_sum | price-break}}₴
                                        </b>
                                    </div>
                                </div>
                            </div>
                            <router-link :to="`/orders?order=${id}`" class="success-order__data-detail">
                                Деталі замовлення
                            </router-link>

                            <router-link to="/orders" class="success-order__data-to-orders">
                                <svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M4 4V1C4 0.734784 4.10536 0.48043 4.29289 0.292893C4.48043 0.105357 4.73478 0 5 0H17C17.2652 0 17.5196 0.105357 17.7071 0.292893C17.8946 0.48043 18 0.734784 18 1V15C18 15.2652 17.8946 15.5196 17.7071 15.7071C17.5196 15.8946 17.2652 16 17 16H14V19C14 19.552 13.55 20 12.993 20H1.007C0.875127 20.0008 0.744397 19.9755 0.622322 19.9256C0.500247 19.8757 0.389233 19.8022 0.295659 19.7093C0.202084 19.6164 0.127793 19.5059 0.0770543 19.3841C0.0263156 19.2624 0.000129374 19.1319 0 19L0.00300002 5C0.00300002 4.448 0.453 4 1.009 4H4ZM2.002 6L2 18H12V6H2.002ZM6 4H14V14H16V2H6V4ZM4 9H10V11H4V9ZM4 13H10V15H4V13Z" fill="#269447"/>
                                </svg>
                                До списку замовлень
                            </router-link>
                        </div>
                    </div>
                </v-card>
            </v-layout>
        </v-layout>
    </v-container>
</template>

<script>
    import moment from "moment";

    export default {
        name: "success-order",
        data() {
            return {
                total_items: 0,
                statuses: null,
                dataTable: null,
                data: null,
                id: null,
                locations: [],
                location: null,
                status: null,
            };
        },
        mounted() {
            this.id = this.$route.query.id
            console.log(this.id)
            if (this.id) {
                this.getDataFromApi()
            } else {
                this.$router.push('/orders')
            }
        },
        methods: {
            getDate(date) {
                return moment(date * 1000).format('DD.MM.YYYY')
            },
            loading(e) {
                this.$emit("loading", e)
            },
            getLocations() {
                this.$api
                    .post("/graphql", {
                        query: `
                        query{
                              location(perPage: 1000 list: true){
                                items{
                                  id
                                  name
                                  isActive
                                  city
                                  street
                                  building
                                  office
                                  floor
                                }
                              }
                              myCompany{
                                non_budget_order
                              }
                            }`
                    })
                    .then(response => {
                        const locations = response.data.data.location.items
                        const locationsActive = []
                        for(let i = 0; locations.length > i; i++) {
                            if (locations[i].isActive) {
                                locationsActive.push(locations[i])
                            }
                        }
                        this.locations = locationsActive
                        const location = this.locations.find(r => r.id === this.data.location_id)
                        this.location = location

                        this.status = this.statuses.find(r => r.id === this.data.status)
                    })
            },
            showFullAdress(item) {
                let address = ""
                if (item.city != "") {
                    address += item.city
                }
                if (item.street != "") {
                    address += ", " + item.street
                }
                if (item.building != "") {
                    address += ", б." + item.building
                }
                if (item.office != "") {
                    address += ", оф." + item.office
                }
                if (item.floor) {
                    address += ", поверх " + item.floor
                }
                return address
            },
            getDataFromApi() {
                this.$api
                    .post("/graphql", {
                        query:
                        `
                        query{
                          orderInfo(id:` +
                        this.id +
                        `){
                            id
                            order_id
                            delivery_date
                            one_day_shipment
                            location_id
                            comment
                            created_by_user
                            status
                            total_sum
                            total
                            created_by{
                                first_name
                                last_name
                            }
                          }
                          orderStatus{
                                id
                                name
                                class
                          }

                          orderProduct(order_id: ` +
                        this.id +
                        `){
                              totalCount
                          }
                        }`
                    })
                    .then(response => {
                        this.data = response.data.data.orderInfo
                        this.statuses = response.data.data.orderStatus
                        this.dataTable = response.data.data.orderProduct.items
                        this.total_items = response.data.data.orderProduct.totalCount
                        this.getLocations()
                    })
            },
        }
    };
</script>

<style lang="sass" scoped>
    .success-order *:not(.v-icon)
        font-family: "Montserrat", sans-serif
    .container
        margin-top: 60px
        @media (min-width: 1904px)
            max-width: 1100px
    .success-order__title
        font-size: 26px
        font-weight: 700
    .success-order__data-to-orders
        display: flex
        justify-content: center
        align-items: center
        font-size: 14px
        padding: 10px
        cursor: pointer
        background: #F6F6F8
        border-radius: 5px
        color: #269447 !important
        svg
            margin-right: 10px
    .success-order__data-detail
        color: #269447
        cursor: pointer
        font-size: 14px
        margin: 10px 0 10px auto
    .success-order__list
        display: flex
        flex-direction: column
    .success-order__data
        padding: 20px
    .success-order__list-item
        display: flex
        align-items: center
        padding-bottom: 5px

    .success-order__list-item-text
        max-width: 100px
        min-width: 100px
        margin-right: 20px
        font-size: 14px
        color: #3f3f3f

    .success-order__list-item-value
        font-size: 14px
        color: #707070 !important
        text-decoration: none

        &:hover, a
            text-decoration: none
            color: #707070 !important

    .success-order__data-title
        padding-bottom: 20px
        font-size: 16px
        font-weight: 700
    .success-order__media-item
        width: 30px
        height: 30px
        margin: 5px
        a
            display: flex
            justify-content: center
            align-items: center
            width: 100%
            height: 100%
            background: #269447
            border-radius: 50px

            svg
                width: 20px
                height: 20px
    .success-order__media
        display: flex
    .success-order__social-text
        font-size: 14px
        font-weight: 700
    .success-order__social
        display: flex
        justify-content: space-between
        align-items: center
        flex-wrap: wrap
    .success-order__text
        font-size: 14px
        color: grey
        padding: 20px 0
        margin-bottom: 20px
        border-bottom: 1px solid #b7b7b7
</style>

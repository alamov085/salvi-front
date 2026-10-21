<template>
    <v-container class="unsubscribe">
        <v-layout v-if="success" column class="unsubscribe__container">
            <h1>Ви відписалися від нашої розсилки!</h1>
            <p>
                Ми підтверджуємо, що ви більше не будете отримувати наші електронні листи.
                Якщо ви передумали або хочете змінити налаштування підписки, ви завжди можете змінити їх у налаштуваннях вашого кабінету.
            </p>
            <p>
                Для цього перейдіть за посиланням: <router-link to="/lk-base-info">Налаштування вашого кабінету.</router-link>
            </p>
            <p>
                Дякуємо, що ви з нами!
            </p>
        </v-layout>
    </v-container>
</template>

<script>
    export default {
        name: "unsubscribe-mails",
        data() {
            return {
                success: false,
            };
        },
        mounted() {
            this.$api
                .get("/users/unsubscribe-mails")
                .then(res => {
                    if(res.data.status) {
                        this.success = true
                    }
                })
        },
    };
</script>

<style lang="scss" scoped>
    .unsubscribe {
        &__container {
            h1, p {
                text-align: center;
            }

            h1 {
                padding-bottom: 100px;
            }
        }
    }
</style>

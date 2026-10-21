<template>
    <div v-if="item" @click="close" class="modal-e">
        <div class="modal-e__container">
            <div class="modal-e__image">
                <img
                    :src="item.img"
                />
            </div>
            <div class="modal-e__content">
                <div class="modal-e__name">{{item.name}}</div>
                <div class="modal-e__text">Товар не доступний в обраній кількості.
                    <br> Будь ласка оберіть меншу кількість
                    <br> Доступна кількість: {{ Math.floor(item.leftovers / item.multiplicity) * item.multiplicity }} шт
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "ModalExceeds",
        props: {
            item: {},
            close: {
                type: [Function, Boolean],
                default: false,
            }
        },
    }
</script>

<style lang="scss" scoped>
    .modal-e {
        position: fixed;
        top: 5px;
        z-index: 1000;
        right: 5px;
        background: rgba(162, 0, 8, 0.7);
        border-radius: 10px;
        width: fit-content;
        cursor: pointer;

        &__container {
            padding: 10px 20px;
            display: flex;
            align-items: center;
        }

        &__image {
            padding-right: 20px;
            img {
                width: 70px;
            }
        }

        &__name {
             font-size: 14px;
             font-weight: 700;
             color: #ffffff;
            padding-bottom: 5px;
        }

        &__text {
            font-size: 14px;
            font-weight: 700;
            color: #ffffff;
            text-align: center;
        }
    }
</style>

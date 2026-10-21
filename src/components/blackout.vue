<template>
    <div v-if="open" class="blackout">
        <div class="blackout__text">
            Шановні партнери! Не зважаючи на масові відключення світла, ми працюємо в безперебійному режимі та продовжуємо виконувати ваші замовлення!
        </div>
        <div @click="handldeClose" class="blackout__close">
            <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
            >
                <rect
                        x="-0.131836"
                        y="14.0104"
                        width="20"
                        height="3"
                        rx="1.5"
                        transform="rotate(-45 -0.131836 14.0104)"
                        fill="#ffffff"
                />
                <rect
                        x="1.98926"
                        y="-0.131714"
                        width="20"
                        height="3"
                        rx="1.5"
                        transform="rotate(45 1.98926 -0.131714)"
                        fill="#ffffff"
                />
            </svg>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Blackout",
        data() {
            return {
                open: false,
            };
        },
        mounted() {
            const blackoutIsClose = localStorage.getItem('blackoutIsClose')
            if (blackoutIsClose) {
                this.open = false
            }
        },
        methods: {
            handldeClose() {
                this.open = false
                localStorage.setItem('blackoutIsClose', true)
            }
        }
    };
</script>

<style lang="scss" scoped>
    .blackout {
        position: relative;
        padding: 10px 20px;
        background: #c28300;
        display: flex;
        justify-content: center;

        &__text {
            color: #fff;
            font-size: 18px;
        }

        &__close {
            position: absolute;
            right: 10px;
            top: 11px;
            cursor: pointer;
        }
    }
</style>
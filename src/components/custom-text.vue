<template>
    <div>
        <div
                class="text-box"
                :class="{ overflow: isOverflow }"
                ref="textContainer"
        >
            {{ text }}
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            text: String,
        },
        data() {
            return {
                isOverflow: false,
            };
        },
        mounted() {
            this.checkOverflow();
        },
        methods: {
            checkOverflow() {
                const textContainer = this.$refs.textContainer;
                if (textContainer.scrollHeight > textContainer.clientHeight) {
                    this.isOverflow = true;
                }
            },
        },
    };
</script>

<style scoped>
    .text-box {
        display: -webkit-box;
        -webkit-line-clamp: 3; /* Ограничение до трех строк */
        -webkit-box-orient: vertical;
        overflow: hidden;
        position: relative;
        font-size: 12px;
        font-weight: 500;
    }

    .text-box.overflow:after {
        content: "...";
    }
</style>
<template>
    <button @click="clickEvent">
        <icon-Base width="32" height="32">
            <strokeIcon />
        </icon-Base>
    </button>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import IconBase from '@/components/Atomics/icons/IconBase.vue';
import StrokeIcon from '@/components/Atomics/icons/StrokeIcon.vue';

export default defineComponent({
    name:"EraserButton",
    components: {
        IconBase,
        StrokeIcon,
    },
    props: {
        clickEvent: {
        type: Function,
        required: true
        }
    }
})
</script>
<style lang="scss" scoped>
/* */
</style>

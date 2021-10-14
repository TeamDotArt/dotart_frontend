<template>
    <button @click="clickEvent">
        <icon-Base width="32" height="32">
            <eraserIcon />
        </icon-Base>
    </button>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import IconBase from '@/components/Atomics/icons/IconBase.vue';
import EraserIcon from '@/components/Atomics/icons/EraserIcon.vue';

export default defineComponent({
    name:"EraserButton",
    components: {
        IconBase,
        EraserIcon,
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

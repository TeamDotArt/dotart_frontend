<template>
    <button @click="clickEvent">
        <icon-Base width="36" height="36" icon-name="undoIcon"
            ><undoIcon
        /></icon-Base>
    </button>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import IconBase from '@/components/Atomics/icons/IconBase.vue';
import UndoIcon from '@/components/Atomics/icons/UndoIcon.vue';

export default defineComponent({
    components: {
        IconBase,
        UndoIcon,
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

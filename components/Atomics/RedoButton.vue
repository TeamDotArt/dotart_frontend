<template>
    <button @click="clickEvent">
        <icon-Base width="36" height="36" icon-name="redoIcon"
            ><redoIcon
        /></icon-Base>
    </button>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import IconBase from '@/components/Atomics/icons/IconBase.vue';
import RedoIcon from '@/components/Atomics/icons/RedoIcon.vue';

export default defineComponent({
    name:"RedoButton",
    components: {
        IconBase,
        RedoIcon,
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

<template>
    <button @click="clickEvent">
        <icon-Base width="32" height="32">
            <layerIcon />
        </icon-Base>
    </button>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import IconBase from '@/components/Atomics/icons/IconBase.vue';
import LayerIcon from '@/components/Atomics/icons/LayerIcon.vue';

export default defineComponent({
    name:"LayerButton",
    components: {
        IconBase,
        LayerIcon,
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

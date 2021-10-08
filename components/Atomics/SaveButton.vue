<template>
    <button @click="clickEvent">
        <icon-Base width="32" height="32">
            <saveIcon />
        </icon-Base>
    </button>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import IconBase from '@/components/Atomics/icons/IconBase.vue';
import SaveIcon from '@/components/Atomics/icons/SaveIcon.vue';

export default defineComponent({
    components: {
        IconBase,
        SaveIcon,
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

<template>
    <button @click="clickEvent">
        <icon-Base width="32" height="32">
            <gridIcon />
        </icon-Base>
    </button>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import IconBase from '@/components/Atomics/icons/IconBase.vue';
import GridIcon from '@/components/Atomics/icons/GridIcon.vue';

export default defineComponent({
    components: {
        IconBase,
        GridIcon,
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

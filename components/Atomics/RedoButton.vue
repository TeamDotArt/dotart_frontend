<template>
    <button-base :click="clickEvent">
        <icon-Base width="30" height="30" icon-name="redoIcon"
            ><redoIcon
        /></icon-Base>
    </button-base>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api';
import IconBase from '@/components/Atomics/icons/IconBase.vue';
import ButtonBase from '@/components/Atomics/ButtonBase.vue';
import RedoIcon from '@/components/Atomics/icons/RedoIcon.vue';

export default defineComponent({
    name: 'RedoButton',
    components: {
        IconBase,
        RedoIcon,
        ButtonBase,
    },
    props: {
        clickEvent: {
            type: Function,
            required: true,
        },
    },
});
</script>
<style lang="scss" scoped>
/* */
</style>

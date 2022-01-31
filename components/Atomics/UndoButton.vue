<template>
    <button-base :click="clickEvent">
        <icon-Base width="30" height="30" icon-name="undoIcon"
            ><undoIcon
        /></icon-Base>
    </button-base>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api';
import IconBase from '@/components/Atomics/icons/IconBase.vue';
import ButtonBase from '@/components/Atomics/ButtonBase.vue';
import UndoIcon from '@/components/Atomics/icons/UndoIcon.vue';

export default defineComponent({
    name: 'UndoButton',
    components: {
        IconBase,
        UndoIcon,
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

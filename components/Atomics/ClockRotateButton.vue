<template>
    <button-base :click="clickEvent">
        <icon-Base width="32" height="32">
            <clockRotateIcon />
        </icon-Base>
    </button-base>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api';
import IconBase from '@/components/Atomics/icons/IconBase.vue';
import ButtonBase from '@/components/Atomics/ButtonBase.vue';
import ClockRotateIcon from '@/components/Atomics/icons/ClockRotateIcon.vue';

export default defineComponent({
    name: 'ClockRotateButton',
    components: {
        IconBase,
        ClockRotateIcon,
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
/*  */
</style>

<template>
    <button-base :click="clickEvent">
        <icon-Base width="32" height="32">
            <antiClockRotateIcon />
        </icon-Base>
    </button-base>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api';
import IconBase from '@/components/Atomics/icons/IconBase.vue';
import ButtonBase from '@/components/Atomics/ButtonBase.vue';
import AntiClockRotateIcon from '@/components/Atomics/icons/AntiClockRotateIcon.vue';

export default defineComponent({
    name: 'AntiClockRotateButton',
    components: {
        IconBase,
        AntiClockRotateIcon,
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

<template>
    <button-base
        v-if="penMode === modeState.mode"
        :click="clickEvent.bind(this, modeState.mode)"
        :color="modeState.activeColor"
    >
        <icon-Base width="32" height="32">
            <penIcon />
        </icon-Base>
    </button-base>

    <button-base v-else :click="clickEvent.bind(this, modeState.mode)">
        <icon-Base width="32" height="32">
            <penIcon />
        </icon-Base>
    </button-base>
</template>

<script lang="ts">
import { defineComponent, reactive } from '@nuxtjs/composition-api';
import IconBase from '@/components/Atomics/icons/IconBase.vue';
import ButtonBase from '@/components/Atomics/ButtonBase.vue';
import PenIcon from '@/components/Atomics/icons/PenIcon.vue';
// constants
import { constants } from '@/common/constants';

export default defineComponent({
    name: 'PenButton',
    components: {
        IconBase,
        PenIcon,
        ButtonBase,
    },
    props: {
        clickEvent: {
            type: Function,
            required: true,
        },
        penMode: {
            type: String,
            default: 'pen',
        },
    },
    setup() {
        const modeState = reactive<{ mode: string; activeColor: string }>({
            mode: constants.PEN_MODE.pen,
            activeColor: '#ba55d3',
        });
        return { modeState };
    },
    watch: {
        penMode() {
            // propsの変化の通知を受け取るために必要
        },
    },
});
</script>
<style lang="scss" scoped>
/* */
</style>

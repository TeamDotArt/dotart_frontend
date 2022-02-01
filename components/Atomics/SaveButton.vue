<template>
    <button-base :click="clickEvent">
        <icon-Base width="32" height="32">
            <saveIcon />
        </icon-Base>
    </button-base>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api';
import IconBase from '@/components/Atomics/icons/IconBase.vue';
import ButtonBase from '@/components/Atomics/ButtonBase.vue';
import SaveIcon from '@/components/Atomics/icons/SaveIcon.vue';

export default defineComponent({
    name: 'SaveButton',
    components: {
        IconBase,
        SaveIcon,
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

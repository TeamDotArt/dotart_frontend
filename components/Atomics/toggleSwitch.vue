<template>
    <div class="toggle-switch">
        <div class="toggle-switch__switch" @click="switchEvent">
            <input type="checkbox" class="toggle-switch__switch__checkbox" />
            <div
                class="toggle-switch__switch__slider"
                :class="{
                    'toggle-switch__switch__slider--enabled': switchFlg,
                    'toggle-switch__switch__slider--disabled': !switchFlg,
                }"
            ></div>
        </div>
        <label class="toggle-switch__label"><slot></slot></label>
    </div>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api';

export default defineComponent({
    name: 'ToggleSwitch',
    components: {},
    props: {
        switchFlg: {
            type: Boolean,
            default: true,
        },
        switchEvent: {
            type: Function,
            required: true,
            default: () => {},
        },
    },
    setup() {},
});
</script>

<style lang="scss" scoped></style>

<template>
    <div
        v-if="index == selectedIndex"
        class="pallet"
        :style="{
            background: color,
            margin: '1px',
            border: '4px solid purple',
            width: '38px',
            height: '38px',
        }"
        @mousedown="getPalletColor(color, index)"
    ></div>
    <div
        v-else
        class="pallet"
        :style="{
            background: color,
            margin: '2px',
            border: '3px solid rgb(87, 56, 84)',
            width: '37px',
            height: '37px',
        }"
        @mousedown="getPalletColor(color, index)"
    ></div>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api';

export default defineComponent({
    name: 'PalletItem',
    props: {
        color: {
            type: String,
            default: '',
        },
        index: {
            type: Number,
            default: 0,
        },
        selectedIndex: {
            type: Number,
            default: 0,
        },
        getPalletColor: {
            type: Function,
            required: true,
        },
    },
});
</script>

<style lang="scss" scoped>
.pallet {
    display: inline-block;
    border-radius: 35%;
}
.checked {
    margin: 2px;
    width: 37px;
    height: 37px;
    border: 3px solid rgb(87, 56, 84);
}
</style>

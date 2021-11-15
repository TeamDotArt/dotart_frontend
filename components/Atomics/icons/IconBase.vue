<template>
    <svg
        xmlns="http://www.w3.org/2000/svg"
        :width="width"
        :height="height"
        viewBox="0 0 16 16"
        :aria-labelledby="iconName"
        role="presentation"
    >
        <title :id="iconName" lang="en">{{ iconName }} icon</title>
        <g :fill="iconColor" :stroke="iconColor">
            <slot />
        </g>
    </svg>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api';
export default defineComponent({
    name: '',
    props: {
        iconName: {
            type: String,
            default: '',
        },
        width: {
            type: String,
            default: '32',
        },
        height: {
            type: String,
            default: '32',
        },
        iconColor: {
            type: String,
            default: 'currentColor',
        },
    },
});
</script>

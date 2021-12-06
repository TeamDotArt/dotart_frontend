<template>
    <div class="canvasButtonWrapper">
        <v-btn class="toolButton" :color="color" depressed fab @click="click">
            <slot />
        </v-btn>
    </div>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api';

export default defineComponent({
    name: 'ButtonBase',
    props: {
        click: {
            type: Function,
            required: true,
        },
        color: {
            type: String,
            default: '#E1BEE7',
        },
    },
});
</script>
<style lang="scss" scoped>
.canvasButtonWrapper {
    border: 2px solid rgb(60, 25, 80);
    display: inline-block;
    border-radius: 50%;
    box-shadow: 0 3px 3px 0 rgba(0, 0, 0, 0.5);
}
.theme--light.toolButton:focus::before {
    opacity: 0;
}
</style>

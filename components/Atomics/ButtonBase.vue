<template>
    <div class="canvas-button-wrapper">
        <v-btn color="#E1BEE7" depressed fab @click="clickEvent">
            <slot />
        </v-btn>
    </div>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api';

export default defineComponent({
    name: 'LayerButton',
    props: {
        clickEvent: {
            type: Function,
            required: true,
        },
    },
});
</script>
<style lang="scss" scoped>
.canvas-button-wrapper {
    border: 2px solid rgb(60, 25, 80);
    display: inline-block;
    border-radius: 50%;
    box-shadow: 0 3px 3px 0 rgba(0, 0, 0, 0.5);
}
</style>

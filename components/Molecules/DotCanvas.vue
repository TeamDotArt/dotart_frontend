<template>
    <div id="canvasWrapper" class="canvas-wrapper">
        <canvas
            id="drowcanvas"
            class="drow-canvas"
            width="384px"
            height="384px"
        ></canvas>
        <canvas
            id="gridcanvas"
            class="drow-canvas"
            width="383px"
            height="383px"
            @mousedown="click"
            @mouseup="dragEnd"
            @mouseout="dragEnd"
            @mousemove="drag"
            @touchstart="touch"
            @touchmove="swipe"
            @touchend="dragEnd"
        ></canvas>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
@Component
export default class DotCanvas extends Vue {
    @Prop({ type: String })
    color!: String;

    selectedflg: boolean = false;
    getColor(e: any): void {
        this.$emit('getColor', this.color);
    }
}
</script>
<style>
.canvas-wrapper {
    max-width: 100%;
    position: relative;
    padding: 0;
    top: -15px;
    box-sizing: content-box;
}
.canvas-wrapper:before {
    content: '';
    display: block;
}
.drow-canvas {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
}
.grid-canvas {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    opacity: 0.5;
}
</style>

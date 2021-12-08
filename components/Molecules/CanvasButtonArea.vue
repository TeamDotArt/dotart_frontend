<template>
    <div class="canvasButtonAreaWrapper">
        <div class="buttonAreaWrapper">
            <undo-button :click-event="undoEvent"></undo-button>
            <div>アンドゥ</div>
        </div>
        <div class="buttonAreaWrapper">
            <redo-button :click-event="redoEvent"></redo-button>
            <div>リドゥ</div>
        </div>
        <div class="buttonAreaWrapper">
            <grid-button :click-event="gridEvent"></grid-button>
            <div>グリッド</div>
        </div>
        <div class="buttonAreaWrapper">
            <setting-button :click-event="settingEvent"></setting-button>
            <div>設定</div>
        </div>
        <div class="buttonAreaWrapper">
            <save-button :click-event="saveEvent"></save-button>
            <div>保存</div>
        </div>
        <div class="buttonAreaWrapper">
            <pen-button
                :click-event="penModeChangeEvent"
                :pen-mode="penMode"
            ></pen-button>
            <div>ペン</div>
        </div>
        <div class="buttonAreaWrapper">
            <bucket-button
                :click-event="penModeChangeEvent"
                :pen-mode="penMode"
            ></bucket-button>
            <div>バケツ</div>
        </div>
        <div class="buttonAreaWrapper">
            <eraser-button
                :click-event="penModeChangeEvent"
                :pen-mode="penMode"
            ></eraser-button>
            <div>消しゴム</div>
        </div>
        <div class="buttonAreaWrapper">
            <stroke-button
                :click-event="penModeChangeEvent"
                :pen-mode="penMode"
            ></stroke-button>
            <div>直線</div>
        </div>
        <div class="buttonAreaWrapper">
            <v-btn outlined fab><v-icon>mdi-grid</v-icon> </v-btn>
            <div>部分選択</div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api';
// import ClockRotateButton from '@/components/Atomics/ClockRotateButton.vue';
// import AntiClockRotateButton from '@/components/Atomics/AntiClockRotateButton.vue';
import PenButton from '@/components/Atomics/PenButton.vue';
import BucketButton from '@/components/Atomics/BucketButton.vue';
import StrokeButton from '@/components/Atomics/StrokeButton.vue';
import EraserButton from '@/components/Atomics/EraserButton.vue';
import UndoButton from '@/components/Atomics/UndoButton.vue';
import RedoButton from '@/components/Atomics/RedoButton.vue';
import GridButton from '@/components/Atomics/GridButton.vue';
// import LayerButton from '@/components/Atomics/LayerButton.vue';
import SettingButton from '@/components/Atomics/SettingButton.vue';
import SaveButton from '@/components/Atomics/SaveButton.vue';

export default defineComponent({
    name: 'CanvasButtonArea',
    components: {
        // ClockRotateButton,
        // AntiClockRotateButton,
        PenButton,
        BucketButton,
        StrokeButton,
        EraserButton,
        UndoButton,
        RedoButton,
        GridButton,
        // LayerButton,
        SettingButton,
        SaveButton,
    },
    props: {
        penModeChangeEvent: {
            type: Function,
            required: true,
            default: () => {},
        },
        undoEvent: {
            type: Function,
            required: true,
            default: () => {},
        },
        redoEvent: {
            type: Function,
            required: true,
            default: () => {},
        },
        gridEvent: {
            type: Function,
            required: true,
            default: () => {},
        },
        settingEvent: {
            type: Function,
            required: true,
            default: () => {},
        },
        saveEvent: {
            type: Function,
            required: true,
            default: () => {},
        },
        penMode: {
            type: String,
            default: 'pen',
        },
    },
});
</script>
<style lang="scss" scoped>
.canvasButtonAreaWrapper {
    display: flex;
    flex-wrap: wrap;
    margin-left: auto;
    margin-right: auto;
    width: 400px;
    min-width: 480px;
    max-width: 600px;
    justify-content: center;
}
.buttonAreaWrapper {
    margin: 10px;
    text-align: center;
}
</style>

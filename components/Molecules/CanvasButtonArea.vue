<template>
    <div>
        <div class="canvasButtonAreaWrapper_PC_Tab">
            <div class="buttonAreaWrapper">
                <undo-button :click-event="undoEvent"></undo-button>
                <div class="buttonText">アンドゥ</div>
            </div>
            <div class="buttonAreaWrapper">
                <redo-button :click-event="redoEvent"></redo-button>
                <div class="buttonText">リドゥ</div>
            </div>
            <div class="buttonAreaWrapper">
                <grid-button :click-event="gridEvent"></grid-button>
                <div class="buttonText">グリッド</div>
            </div>
            <!-- <div class="buttonAreaWrapper">
                <setting-button :click-event="settingEvent"></setting-button>
                <div class="buttonText">設定</div>
            </div> -->
            <div class="buttonAreaWrapper">
                <save-button :click-event="saveEvent"></save-button>
                <div class="buttonText">保存</div>
            </div>
            <div class="buttonAreaWrapper">
                <pen-button
                    :click-event="penModeChangeEvent"
                    :pen-mode="penMode"
                ></pen-button>
                <div class="buttonText">ペン</div>
            </div>
            <div class="buttonAreaWrapper">
                <bucket-button
                    :click-event="penModeChangeEvent"
                    :pen-mode="penMode"
                ></bucket-button>
                <div class="buttonText">バケツ</div>
            </div>
            <div class="buttonAreaWrapper">
                <eraser-button
                    :click-event="penModeChangeEvent"
                    :pen-mode="penMode"
                ></eraser-button>
                <div class="buttonText">消しゴム</div>
            </div>
            <div class="buttonAreaWrapper">
                <stroke-button
                    :click-event="penModeChangeEvent"
                    :pen-mode="penMode"
                ></stroke-button>
                <div class="buttonText">直線</div>
            </div>
            <!-- <div class="buttonAreaWrapper">
                <v-btn outlined fab><v-icon>mdi-grid</v-icon> </v-btn>
                <div class="buttonText">部分選択</div>
            </div> -->
        </div>
        <div class="canvasButtonAreaWrapper_sm">
            <!-- <div style="padding-left: 0px" class="drawButtonWrapper">
                <v-btn color="purple" width="80px" height="215px">push!</v-btn>
            </div> -->
            <div class="toolButtonWrapper">
                <div class="buttonAreaWrapper">
                    <undo-button :click-event="undoEvent"></undo-button>
                    <div class="buttonText">アンドゥ</div>
                </div>
                <div class="buttonAreaWrapper">
                    <redo-button :click-event="redoEvent"></redo-button>
                    <div class="buttonText">リドゥ</div>
                </div>
                <div class="buttonAreaWrapper">
                    <setting-button
                        :click-event="settingDrawerTransrate"
                    ></setting-button>
                    <div class="buttonText">設定</div>
                </div>
                <div class="buttonAreaWrapper">
                    <save-button :click-event="saveEvent"></save-button>
                    <div class="buttonText">保存</div>
                </div>
                <div class="buttonAreaWrapper">
                    <grid-button :click-event="gridEvent"></grid-button>
                    <div class="buttonText">グリッド</div>
                </div>
                <div class="buttonAreaWrapper">
                    <layer-button
                        :click-event="layerDrawerTransrate"
                    ></layer-button>
                    <div class="buttonText">レイヤー</div>
                </div>
                <div class="buttonAreaWrapper">
                    <bucket-button
                        :click-event="penModeChangeEvent"
                        :pen-mode="penMode"
                    ></bucket-button>
                    <div class="buttonText">バケツ</div>
                </div>
                <div class="buttonAreaWrapper">
                    <stroke-button
                        :click-event="penModeChangeEvent"
                        :pen-mode="penMode"
                    ></stroke-button>
                    <div class="buttonText">直線</div>
                </div>
                <div class="buttonAreaWrapper">
                    <pen-button
                        :click-event="penModeChangeEvent"
                        :pen-mode="penMode"
                    ></pen-button>
                    <div class="buttonText">ペン</div>
                </div>
                <div class="buttonAreaWrapper">
                    <eraser-button
                        :click-event="penModeChangeEvent"
                        :pen-mode="penMode"
                    ></eraser-button>
                    <div class="buttonText">消しゴム</div>
                </div>
                <div class="buttonAreaWrapper">
                    <div
                        class="selectPallet"
                        :style="{
                            background: selectingColor,
                        }"
                        @mousedown="palletDrawerTransrate"
                    ></div>
                </div>
            </div>
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
import LayerButton from '@/components/Atomics/LayerButton.vue';
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
        LayerButton,
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
        saveEvent: {
            type: Function,
            required: true,
            default: () => {},
        },
        penMode: {
            type: String,
            default: 'pen',
        },
        palletDrawerTransrate: {
            type: Function,
            required: true,
            default: () => {},
        },
        layerDrawerTransrate: {
            type: Function,
            required: true,
            default: () => {},
        },
        settingDrawerTransrate: {
            type: Function,
            required: true,
            default: () => {},
        },
        touchPenMode: {
            type: Boolean,
            default: false,
        },
        selectingColor: {
            type: String,
            default: '',
        },
    },
    setup() {
        // method
    },
});
</script>
<style lang="scss" scoped>
.canvasButtonAreaWrapper_PC_Tab {
    display: flex;
    flex-wrap: wrap;
    margin-left: auto;
    margin-right: auto;
    width: 400px;
    min-width: 480px;
    max-width: 600px;
    justify-content: center;
    @media screen and (min-width: 960px) {
    }
    @media screen and (min-width: 600px) and (max-width: 960px) {
    }
    @media screen and (max-width: 600px) {
        display: none;
    }
}
.canvasButtonAreaWrapper_sm {
    display: flex;
    flex-wrap: wrap;
    margin-left: auto;
    margin-right: auto;
    justify-content: center;
    @media screen and (min-width: 960px) {
        display: none;
    }
    @media screen and (min-width: 600px) and (max-width: 960px) {
        display: none;
    }
    @media screen and (max-width: 600px) {
        display: flex;
    }
    @media screen and (min-height: 600px) {
        margin-bottom: 5vh;
    }
}
.toolButtonWrapper {
    display: flex;
    flex-wrap: wrap;
    width: 240px;
    height: 235px;
}
.buttonAreaWrapper {
    text-align: center;
    @media screen and (min-width: 960px) {
        margin: 12px;
    }
    @media screen and (min-width: 600px) and (max-width: 960px) {
        margin: 12px;
        margin-top: 0;
    }
    @media screen and (max-width: 600px) {
        width: 50px;
        height: 68px;
        margin-left: 5px;
        margin-right: 5px;
    }
}
.buttonText {
    font-size: 75%;
}
.drawButtonWrapper {
    height: 235px;
    padding-top: 12px;
    padding-left: 10px;
    padding-right: 10px;
}
.selectPallet {
    height: 50px;
    width: 50px;
    margin: 1px;
    border: 4px solid rgb(247, 90, 247);
    border-radius: 35%;
}
</style>

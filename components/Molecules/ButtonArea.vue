<template>
    <v-row dense>
        <v-col cols="2">
            <div>
                <v-btn outlined fab @click="modeChange">
                    <div v-if="penMode === 'pen'">
                        <v-icon>mdi-pencil</v-icon>
                    </div>
                    <div v-if="penMode === 'bucket'">
                        <v-icon>mdi-format-color-fill</v-icon>
                    </div>
                    <div v-if="penMode === 'stroke'">
                        <v-icon>mdi-arrow-top-left-bottom-right</v-icon>
                    </div>
                </v-btn>
                <!-- <div>{{ penMode === 'pen' ? 'ペン' : 'バケツ' }}</div> -->
                <div v-if="penMode === 'pen'">ペン</div>
                <div v-if="penMode === 'bucket'">バケツ</div>
                <div v-if="penMode === 'stroke'">直線</div>
            </div>
        </v-col>
        <v-col cols="2">
            <div>
                <v-btn outlined fab @click="undo"
                    ><v-icon>mdi-undo</v-icon>
                </v-btn>
                <div>戻る</div>
            </div>
        </v-col>
        <v-col cols="2">
            <div>
                <v-btn outlined fab @click="redo"
                    ><v-icon>mdi-redo</v-icon>
                </v-btn>
                <div>進む</div>
            </div>
        </v-col>
        <v-col cols="2">
            <div>
                <v-btn outlined fab @click="clockRotate"
                    ><v-icon>mdi-rotate-right</v-icon>
                </v-btn>
                <div>右回り</div>
            </div>
        </v-col>
        <v-col cols="2">
            <div>
                <v-btn outlined fab @click="anticlockRotate"
                    ><v-icon>mdi-rotate-left</v-icon>
                </v-btn>
                <div>左回り</div>
            </div>
        </v-col>
        <v-col cols="2">
            <div>
                <v-btn outlined fab @click="drawGrid"
                    ><v-icon>mdi-grid</v-icon>
                </v-btn>
                <div>グリッド</div>
            </div>
        </v-col>
        <v-col cols="12">
            <div class="saveButton">
                <v-btn color="primary" @click="save">保存</v-btn>
            </div>
        </v-col>
    </v-row>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api';

export default defineComponent({
    name: 'ButtonArea',
    props: {
        penMode: {
            type: String,
            required: true,
        },
        modeChange: {
            type: Function,
            required: true,
        },
        undo: {
            type: Function,
            required: true,
        },
        redo: {
            type: Function,
            required: true,
        },
        drawGrid: {
            type: Function,
            required: true,
        },
        save: {
            type: Function,
            required: true,
        },
        clockRotate: {
            type: Function,
            required: true,
        },
        anticlockRotate: {
            type: Function,
            required: true,
        },
    },
    setup() {},
});
</script>

<style lang="scss" scoped>
.saveButton {
    text-align: center;
    margin-top: 2%;
}
</style>

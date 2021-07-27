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
                </v-btn>
                <div>{{ penMode === 'pen' ? 'ペン' : 'バケツ' }}</div>
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
                <v-btn color="primary" @click="Save">保存</v-btn>
            </div>
        </v-col>
    </v-row>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
// import undoButton from '@/components/Atomics/undoButton.vue';
// import redoButton from '@/components/Atomics/redoButton.vue';

@Component({
    middleware: 'auth',
    components: {
        // undoButton,
        // redoButton,
    },
})
export default class ButtonArea extends Vue {
    @Prop({ type: String })
    penMode!: string; // 最初に選択しているパレットの位置

    @Prop({ type: Function })
    modeChange!: Function;

    @Prop({ type: Function })
    undo!: Function;

    @Prop({ type: Function })
    redo!: Function;

    @Prop({ type: Function })
    drawGrid!: Function;

    @Prop({ type: Function })
    Save!: Function;

    @Prop({ type: Function })
    clockRotate!: Function;

    @Prop({ type: Function })
    anticlockRotate!: Function;
}
</script>
<style lang="scss" scoped>
.saveButton {
    text-align: center;
    margin-top: 2%;
}
</style>

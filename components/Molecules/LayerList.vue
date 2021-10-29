<template>
    <div class="layerList">
        <div v-for="item in canvasesData" :key="item.layerIndex">
            {{ item.layerName }}
            <button
                v-if="item.layerIndex != 0"
                @click="layerSwap(true, item.layerIndex)"
            >
                ↑
            </button>
            <button
                v-if="item.layerIndex != canvasesData.length - 1"
                @click="layerSwap(false, item.layerIndex)"
            >
                ↓
            </button>
            <button @click="layerChange(item.layerIndex)">select</button>
            <button
                v-if="canvasesData.length != 1"
                @click="layerDelete(item.layerIndex)"
            >
                del
            </button>
            <button v-if="item.active" @click="layerActivate(item.layerIndex)">
                activated
            </button>
            <button v-if="!item.active" @click="layerActivate(item.layerIndex)">
                disabled
            </button>
            {{ item.layerIndex }}
        </div>
        <button @click="layerAdd">add</button>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator';
import { layerdCanvasData } from '@/types/Canvas/LayerdCanvasDataType';
// import { canvasDataModule } from '../../store/modules/canvasData';

@Component({})
export default class LayerList extends Vue {
    @Prop({ type: Array })
    canvasesData!: layerdCanvasData[];

    @Prop({ type: Function })
    layerSwap!: Function;

    @Prop({ type: Function })
    layerChange!: Function;

    @Prop({ type: Function })
    layerDelete!: Function;

    @Prop({ type: Function })
    layerActivate!: Function;

    @Prop({ type: Function })
    layerAdd!: Function;

    getPalletColor(newColor: string, newIndex: number): void {
        this.$emit('getPalletColor', newColor, newIndex);
    }
}
</script>
<style lang="scss" scoped>
.palletarea {
    display: inline-block;
    white-space: nowrap;
    justify-content: space-between;
}
.colorPallet {
    margin-bottom: 5%;
    width: 330px;
    // @media screen and (min-width: 480px) {
    //     /* 画面サイズが480pxからはここを読み込む*/
    //     width: 300px;
    // }
    @media screen and (min-width: 768px) and (max-width: 1024px) {
        /*画面サイズが768pxから1024pxまではここを読み込む*/
        width: 700px;
    }
    @media screen and (min-width: 1024px) {
        /*画面サイズが1024pxからはここを読み込む*/
        width: 700px;
    }
}
</style>

<template>
    <div class="layerWindow">
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
                <button
                    v-if="item.active"
                    @click="layerActivate(item.layerIndex)"
                >
                    activated
                </button>
                <button
                    v-if="!item.active"
                    @click="layerActivate(item.layerIndex)"
                >
                    disabled
                </button>
                {{ item.layerIndex }}
            </div>
            <button @click="layerAdd">add</button>
        </div>
    </div>
</template>

<script lang="ts">
import { layerdCanvasData } from '@/types/Canvas/LayerdCanvasDataType';
import { defineComponent } from '@nuxtjs/composition-api';

export default defineComponent({
    name: 'LayerList',
    components: {},
    props: {
        canvasesData: {
            type: Array as () => layerdCanvasData[],
            default: () => [], // なぜか配列は関数で渡す必要があるらしい
        },
        firstPalletIndex: {
            type: Number,
            default: 0,
        },
        layerSwap: {
            type: Function,
            required: true,
            default: () => {},
        },
        layerChange: {
            type: Function,
            required: true,
            default: () => {},
        },
        layerDelete: {
            type: Function,
            required: true,
            default: () => {},
        },
        layerActivate: {
            type: Function,
            required: true,
            default: () => {},
        },
        layerAdd: {
            type: Function,
            required: true,
            default: () => {},
        },
        canvasTarget: {
            type: Number,
            default: 0,
        },
    },
});
</script>

<style lang="scss" scoped>
.layerWindow {
    position: relative;
    text-align: center;
    background-color: plum;
    @media screen and (min-width: 960px) {
        width: 230px;
        height: 330px;
    }
    @media screen and (min-width: 600px) and (max-width: 960px) {
        width: 320px;
        height: 250px;
    }
    @media screen and (max-width: 600px) {
        display: none;
    }
}
.palletWindowTitle {
    padding-top: 10px;
}

.palletArea {
    margin: 15px;
}
.palletWindowTitle {
    text-align: center;
}
.pallet {
    display: inline-block;
    border-radius: 35%;
}
.palletWrapper {
    text-align: center;
}
.palletSettingButtonAreaWrapper {
    position: absolute;
    width: 100%;
    bottom: 10px;
}
.palletSettingButtonArea {
    display: flex;
    margin-left: 20px;
    margin-right: 20px;
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

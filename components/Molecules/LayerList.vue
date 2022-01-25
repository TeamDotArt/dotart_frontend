<template>
    <div class="layerArea">
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
                    <button @click="layerChange(item.layerIndex)">
                        select
                    </button>
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
    border-radius: 8px;
    @media screen and (min-width: 959px) {
        width: 230px;
        height: 330px;
    }
    @media screen and (min-width: 600px) and (max-width: 959px) {
        width: 320px;
        height: 250px;
    }
    @media screen and (max-width: 599px) {
        display: none;
    }
}
</style>

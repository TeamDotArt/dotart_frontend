<template>
    <div class="layerArea">
        <div class="layerWindow">
            <div id="layerList" class="layerList canScroll">
                <div class="layerScroll canScroll">
                    <div v-for="item in canvasesData" :key="item.layerIndex">
                        <div class="input-container canScroll">
                            <input
                                :id="item.id"
                                class="radio-button canScroll"
                                type="radio"
                                name="radio"
                                @click="layerChange(item.layerIndex)"
                            />
                            <div class="radio-tile canScroll">
                                <div class="layerChanged canScroll">
                                    <button
                                        v-if="item.active"
                                        class="canScroll"
                                        @click="layerActivate(item.layerIndex)"
                                    >
                                        <v-icon class="canScroll"
                                            >mdi-eye-outline</v-icon
                                        >
                                    </button>
                                    <button
                                        v-if="!item.active"
                                        class="canScroll"
                                        @click="layerActivate(item.layerIndex)"
                                    >
                                        <v-icon class="canScroll"
                                            >mdi-eye-off-outline</v-icon
                                        >
                                    </button>
                                    {{ item.layerIndex }}
                                </div>
                                {{ item.layerName }}
                                <!-- <button @click="layerChange(item.layerIndex)">
                                select
                            </button> -->
                                <button
                                    v-if="canvasesData.length != 1"
                                    class="canScroll"
                                    @click="layerDelete(item.layerIndex)"
                                >
                                    <v-icon>mdi-trash-can-outline</v-icon>
                                </button>
                                <div class="layerChanged canScroll">
                                    <button
                                        v-if="item.layerIndex != 0"
                                        @click="
                                            layerSwap(true, item.layerIndex)
                                        "
                                    >
                                        <v-icon>mdi-arrow-up</v-icon>
                                    </button>
                                    <button
                                        v-if="
                                            item.layerIndex !=
                                            canvasesData.length - 1
                                        "
                                        @click="
                                            layerSwap(false, item.layerIndex)
                                        "
                                    >
                                        <v-icon>mdi-arrow-down</v-icon>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <button
                        class="buttonBackground canScroll"
                        @click="layerAdd"
                    >
                        <v-icon class="canScroll">mdi-layers-plus</v-icon>
                    </button>
                </div>
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
.buttonBackground {
    background-color: aliceblue;
    border: 1px solid #000;
    border-radius: 50px;
    padding: 5px;
}
.layerChanged {
    display: flex;
    flex-direction: column;
}
.layerWindow {
    position: relative;
    text-align: center;
    background-color: plum;
    border-radius: 8px;
    @media screen and (min-width: 960px) {
        width: 230px;
        height: 330px;
    }
    @media screen and (min-width: 600px) and (max-width: 960px) {
        width: 320px;
        height: 230px;
    }
    @media screen and (max-width: 600px) {
        display: none;
    }
}
.layerList {
    overflow-y: scroll;
    // スクロールバーをIE、Firefoxで非表示にする
    -ms-overflow-style: none;
    scrollbar-width: none;
    padding: 5px 0;
    @media screen and (min-width: 960px) {
        height: 330px;
    }
    @media screen and (min-width: 600px) and (max-width: 960px) {
        height: 230px;
    }
    @media screen and (max-width: 600px) {
    }
}

.layerList::-webkit-scrollbar {
    display: none;
}
.layerList::-webkit-scrollbar-track {
    background-color: rgba(0, 0, 0, 0);
}
.layerList::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0);
}

.layerScroll {
    @media screen and (min-width: 600px) and (max-width: 960px) {
        min-height: 221px;
    }
}
$primary-color: plum;

.input-container {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: aliceblue;
    border: 1px solid #ccc;
    border-radius: 10px;
    margin: 0.5rem;
    padding: 4px;

    .radio-button {
        opacity: 0;
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        margin: 0;
        cursor: pointer;
    }

    .radio-tile {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        height: 100%;
        border: 2px solid $primary-color;
        border-radius: 5px;
        padding: 0.3rem;
        transition: transform 300ms ease;
    }

    .radio-button:checked + .radio-tile {
        background-color: $primary-color;
        border: 2px solid $primary-color;
        color: white;
    }
}
</style>

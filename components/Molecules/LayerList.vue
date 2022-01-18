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
        <transition name="popupMenu">
            <div v-show="layerDrawerFlg" class="layerDrawerMenuArea__Wrapper">
                <div class="layerDrawerMenu">
                    <!-- ここにメニューの内容を書いていく -->
                    <div class="layerDrawerdefault">
                        <button class="switch" @click="translate">▼</button>
                        <div class="layerList">
                            <div
                                v-for="item in canvasesData"
                                :key="item.layerIndex"
                            >
                                {{ item.layerName }}
                                <button
                                    v-if="item.layerIndex != 0"
                                    @click="layerSwap(true, item.layerIndex)"
                                >
                                    ↑
                                </button>
                                <button
                                    v-if="
                                        item.layerIndex !=
                                        canvasesData.length - 1
                                    "
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
            </div>
        </transition>
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
        layerDrawerFlg: {
            type: Boolean,
            default: false,
        },
    },
    setup() {
        // method
        const transrate = (layerDrawerFlg: boolean): void => {
            const change = !layerDrawerFlg;
            layerDrawerFlg = change;
        };

        return {
            transrate,
        };
    },
});
</script>

<style lang="scss" scoped>
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

$defaultHeight: 0px; //格納状態でのメニューのheight
$movedHeight: 230px; //展開状態でのメニューのheight
$movePercentage: 100% * (1 - $defaultHeight/$movedHeight); //transformの割合
//@debug $movePercentage;
.drawerdefault {
    display: ruby;
    vertical-align: top;
    justify-content: space-between;
}
.switch {
    vertical-align: top;
    margin-top: 6px;
}
.popupMenu {
    @media screen and (min-width: 960px) {
        display: none;
    }
    @media screen and (min-width: 600px) and (max-width: 960px) {
        display: none;
    }
    @media screen and (max-width: 600px) {
    }
}
.popupMenu-enter-active,
.popupMenu-leave-active {
    transform: translate(0px, 0px);
    transition: transform 225ms cubic-bezier(0, 0, 0.2, 1) 0ms;
}
.popupMenu-enter,
.popupMenu-leave-to {
    transform: translateY($movePercentage);
}

.layerDrawerMenuArea {
    position: absolute;
    text-align: center;
    margin-left: auto;
    margin-right: auto;
    z-index: 1;
    right: 0;
    left: 0;
    bottom: 0;
    width: 100%;
    height: $defaultHeight;
    background-color: rgba(233, 95, 192);
}
.layerDrawerMenuArea__Wrapper {
    position: absolute;
    text-align: center;
    margin-left: auto;
    margin-right: auto;
    z-index: 2;
    right: 0;
    left: 0;
    bottom: 0;
    width: 100%;
    height: $movedHeight;
    background-color: rgba(233, 95, 192);
}
</style>

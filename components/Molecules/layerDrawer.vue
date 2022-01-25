<template>
    <div class="layerMenu">
        <transition name="popupMenu">
            <div v-show="layerDrawerFlg" class="layerDrawerMenuArea__Wrapper">
                <div class="layerDrawerMenu">
                    <!-- ここにメニューの内容を書いていく -->
                    <div class="layerDrawerdefault">
                        <button class="switch" @click="layerDrawerTransrate">
                            ▼
                        </button>
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
    name: 'LayerDrawer',
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
            default: true,
        },
        layerDrawerTransrate: {
            type: Function,
            required: true,
            default: () => {},
        },
    },
    setup() {},
});
</script>

<style lang="scss" scoped>
$defaultHeight: 30px; //格納状態でのメニューのheight
$movedHeight: 230px; //展開状態でのメニューのheight
$movePercentage: 100% * (1 - $defaultHeight/$movedHeight); //transformの割合
//@debug $movePercentage;
.layerMenu {
    position: fixed;
    width: 100%;
    bottom: 0;
    right: 0px;
    @media screen and (min-width: 959px) {
        display: none;
    }
    @media screen and (min-width: 600px) and (max-width: 959px) {
        display: none;
    }
    @media screen and (max-width: 599px) {
    }
}
.layerDrawerdefault {
    vertical-align: top;
    justify-content: space-between;
}
.switch {
    vertical-align: top;
    margin-top: 6px;
}
.popupMenu {
    @media screen and (min-width: 959px) {
    }
    @media screen and (min-width: 600px) and (max-width: 959px) {
    }
    @media screen and (max-width: 599px) {
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

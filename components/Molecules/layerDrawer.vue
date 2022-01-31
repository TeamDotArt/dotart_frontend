<template>
    <div class="layerMenu">
        <transition name="popupMenu" @after-enter="animationEnd">
            <div v-show="layerDrawerFlg" class="layerDrawerMenuArea__Wrapper">
                <div class="layerDrawerMenu">
                    <!-- ここにメニューの内容を書いていく -->
                    <button class="switch" @click="layerDrawerTransrate">
                        ▼
                    </button>
                    <div class="layerDrawerdefault">
                        <div id="layerDrawer" class="layerList canScroll">
                            <div class="layerScroll canScroll">
                                <div
                                    v-for="item in canvasesData"
                                    :key="item.layerIndex"
                                >
                                    <div class="input-container canScroll">
                                        <input
                                            :id="item.id"
                                            class="radio-button canScroll"
                                            type="radio"
                                            name="radio"
                                            @click="
                                                layerChange(item.layerIndex)
                                            "
                                        />
                                        <div class="radio-tile canScroll">
                                            <div class="layerChanged canScroll">
                                                <button
                                                    v-if="item.active"
                                                    class="canScroll"
                                                    @click="
                                                        layerActivate(
                                                            item.layerIndex
                                                        )
                                                    "
                                                >
                                                    <v-icon
                                                        >mdi-eye-outline</v-icon
                                                    >
                                                </button>
                                                <button
                                                    v-if="!item.active"
                                                    class="canScroll"
                                                    @click="
                                                        layerActivate(
                                                            item.layerIndex
                                                        )
                                                    "
                                                >
                                                    <v-icon class="canScroll"
                                                        >mdi-eye-off-outline</v-icon
                                                    >
                                                </button>
                                                {{ item.layerIndex }}
                                            </div>
                                            {{ item.layerName }}
                                            <button
                                                v-if="canvasesData.length != 1"
                                                class="canScroll"
                                                @click="
                                                    layerDelete(item.layerIndex)
                                                "
                                            >
                                                <v-icon class="canScroll"
                                                    >mdi-trash-can-outline</v-icon
                                                >
                                            </button>
                                            <div class="layerChanged canScroll">
                                                <button
                                                    v-if="item.layerIndex != 0"
                                                    class="canScroll"
                                                    @click="
                                                        layerSwap(
                                                            true,
                                                            item.layerIndex
                                                        )
                                                    "
                                                >
                                                    <v-icon class="canScroll"
                                                        >mdi-arrow-up</v-icon
                                                    >
                                                </button>
                                                <button
                                                    v-if="
                                                        item.layerIndex !=
                                                        canvasesData.length - 1
                                                    "
                                                    class="canScroll"
                                                    @click="
                                                        layerSwap(
                                                            false,
                                                            item.layerIndex
                                                        )
                                                    "
                                                >
                                                    <v-icon class="canScroll"
                                                        >mdi-arrow-down</v-icon
                                                    >
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    class="buttonBackground canScroll"
                                    @click="layerAdd"
                                >
                                    <v-icon class="canScroll"
                                        >mdi-layers-plus</v-icon
                                    >
                                </button>
                            </div>
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
    setup() {
        // スクロール対策
        const animationEnd = (): void => {
            const layerDrawer = document.querySelector('#layerDrawer')!;
            if (layerDrawer.scrollTop === 0) {
                layerDrawer.scrollTop = 1;
            }
        };
        return {
            animationEnd,
        };
    },
});
</script>

<style lang="scss" scoped>
$defaultHeight: 0px; //格納状態でのメニューのheight
$movedHeight: 230px; //展開状態でのメニューのheight
$movePercentage: 100% * (1 - $defaultHeight/$movedHeight); //transformの割合
//@debug $movePercentage;
.layerMenu {
    display: flex;
    position: fixed;
    width: 100%;
    bottom: 0;
    right: 0px;
    @media screen and (min-width: 960px) {
        display: none;
    }
    @media screen and (min-width: 600px) and (max-width: 960px) {
        display: none;
    }
    @media screen and (max-width: 600px) {
    }
}
.layerDrawerdefault {
    vertical-align: top;
    justify-content: space-between;
    height: 190px;
}
.layerList {
    overflow-y: scroll;
    height: 190px;
}
.layerScroll {
    min-height: 191px;
}
.switch {
    vertical-align: top;
    margin-top: 6px;
    height: 25px;
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

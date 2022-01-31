<template>
    <div class="palletMenu">
        <transition name="popupMenu" @after-enter="animationEnd">
            <div v-show="palletDrawerFlg" class="palletDrawerMenuArea__Wrapper">
                <div class="palletDrawerMenu">
                    <!-- ここにメニューの内容を書いていく -->
                    <button class="switch" @click="palletDrawerTransrate">
                        ▼
                    </button>
                    <div class="palletWindowTitle">パレット</div>
                    <div id="palletDrawer" class="palletScroll">
                        <v-row class="palletArea canScroll" dense>
                            <v-col
                                v-for="(item, index) in colorPallet"
                                :key="item"
                                class="palletWrapper canScroll"
                                cols="3"
                            >
                                <pallet-item
                                    :color="item"
                                    :index="index"
                                    :selected-index="palletIndex"
                                    :get-pallet-color="getPalletColor"
                                ></pallet-item>
                            </v-col>
                        </v-row>
                    </div>
                    <!-- パレット編集機能実装予定 -->
                    <!-- <div class="palletSettingButtonAreaWrapper">
                        <div class="palletSettingButtonArea">
                            <button class="palletSettingButton">
                                パレット追加
                            </button>
                            <button class="palletSettingButton">
                                色の変更
                            </button>
                        </div>
                    </div> -->
                </div>
                <div class="palletDrawerdefault"></div>
            </div>
        </transition>
    </div>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api';
import PalletItem from '@/components/Atomics/PalletItem.vue';
export default defineComponent({
    name: 'PalletDrawer',
    components: {
        PalletItem,
    },
    props: {
        colorPallet: {
            type: Array as () => String[],
            default: () => [], // なぜか配列は関数で渡す必要があるらしい
        },
        firstPalletIndex: {
            type: Number,
            default: 0,
        },
        palletIndex: {
            type: Number,
            default: 0,
        },
        getPalletColor: {
            type: Function,
            required: true,
        },
        selectingColor: {
            type: String,
            default: '255,255,255',
        },
        palletDrawerFlg: {
            type: Boolean,
            default: true,
        },
        palletDrawerTransrate: {
            type: Function,
            required: true,
            default: () => {},
        },
    },
    setup() {
        // スクロール対策
        const animationEnd = (): void => {
            const palletDrawer = document.querySelector('#palletDrawer')!;
            if (palletDrawer.scrollTop === 0) {
                palletDrawer.scrollTop = 1;
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
$movedHeight: 330px; //展開状態でのメニューのheight
$movePercentage: 100% * (1 - $defaultHeight/$movedHeight); //transformの割合
//@debug $movePercentage;
.palletMenu {
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
.palletDrawerdefault {
    vertical-align: top;
    justify-content: space-between;
}
.switch {
    vertical-align: top;
    margin-top: 6px;
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

.palletDrawerMenuArea__Wrapper {
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

.palletWindow {
    position: relative;
    background-color: plum;
    border-radius: 8px;
    width: 230px;
    height: 300px;
}
.palletWindowTitle {
    padding-top: 10px;
    height: 30px;
}
.palletScroll {
    overflow-y: scroll;
    margin: 0 auto;
    margin-top: 15px;
    margin-bottom: 15px;
    height: 250px;
    width: 300px;
}
.palletArea {
    margin: 0 auto;
    width: 300px;
    min-height: 255px;
    text-align: center;
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
</style>

<template>
    <div class="palletWindowWrapper">
        <div class="palletWindow">
            <div class="palletWindowTitle">パレット</div>
            <div id="palletArea" class="palletScroll">
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
            <!-- TODO: パレット編集機能実装予定 -->
            <div class="palletSettingButtonAreaWrapper">
                <div class="palletSettingButtonArea">
                    <button class="palletSettingButton" @click="Transrate">
                        パレット追加
                    </button>
                    <button class="palletSettingButton">色の変更</button>
                </div>
            </div>
        </div>
        <div class="poppupWrapper">
            <transition name="popupMenu">
                <div v-show="PalletWindowState.editFlg" class="editWindow">
                    <div id="editArea" class="editArea">
                        <Sketch
                            class="sketch"
                            :value="selectingColor"
                            :disable-alpha="true"
                            :preset-colors="PalletWindowState.presetColors"
                        ></Sketch>
                    </div>
                    <div class="palletSettingButtonAreaWrapper">
                        <div class="editButtonArea">
                            <button
                                class="palletSettingButton"
                                @click="Transrate"
                            >
                                追加
                            </button>
                            <button class="palletSettingButton">
                                取り消し
                            </button>
                        </div>
                    </div>
                </div>
            </transition>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent, reactive } from '@nuxtjs/composition-api';
import PalletItem from '@/components/Atomics/PalletItem.vue';
import { Sketch } from 'vue-color';

export default defineComponent({
    name: 'PalletWindow',
    components: {
        PalletItem,
        Sketch,
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
    },
    setup(props) {
        const PalletWindowState = reactive<{
            editFlg: boolean;
            selectingColor: string;
            presetColors: string[];
        }>({
            editFlg: false, // レイヤー数の上限
            selectingColor: props.selectingColor.toString(), // レイヤーごとのcanvasの描画内容
            presetColors: [
                // サンプルとして表示しておく色
                '#D0021B',
                '#F5A623',
                '#F8E71C',
                '#8B572A',
                '#7ED321',
                '#417505',
                '#BD10E0',
                '#9013FE',
                '#4A90E2',
                '#50E3C2',
                '#B8E986',
                '#000000',
                '#4A4A4A',
                '#9B9B9B',
                '#FFFFFF',
            ],
        });
        const Transrate = (): void => {
            PalletWindowState.editFlg = !PalletWindowState.editFlg;
        };
        return { PalletWindowState, Transrate };
    },
});
</script>
<style lang="scss" scoped>
.palletWindow {
    position: relative;
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
.palletWindowTitle {
    padding-top: 10px;
}

.palletScroll {
    margin: 10px;
    overflow-y: scroll;
    // スクロールバーをIE、Firefoxで非表示にする
    -ms-overflow-style: none;
    scrollbar-width: none;
    @media screen and (min-width: 960px) {
        height: 240px;
    }
    @media screen and (min-width: 600px) and (max-width: 960px) {
        height: 130px;
    }
}
.palletArea {
    @media screen and (min-width: 960px) {
        margin: auto;
        height: 239px;
    }
    @media screen and (min-width: 600px) and (max-width: 960px) {
        margin-right: 15px;
        height: 131px;
    }
    @media screen and (max-width: 600px) {
        display: none;
    }
}

.palletScroll::-webkit-scrollbar {
    display: none;
}
.palletScroll::-webkit-scrollbar-track {
    background-color: rgba(0, 0, 0, 0);
}
.palletScroll::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0);
}

.editWindow {
    position: relative;
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
.editArea {
    overflow-y: scroll;
    text-align: center;
    // スクロールバーをIE、Firefoxで非表示にする
    -ms-overflow-style: none;
    scrollbar-width: none;
    @media screen and (min-width: 960px) {
        height: 300px;
    }
    @media screen and (min-width: 600px) and (max-width: 960px) {
        height: 160px;
    }
    @media screen and (max-width: 600px) {
        display: none;
    }
}
.sketch {
    margin: auto;
    margin-top: 5px;
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
    bottom: 5px;
}
.palletSettingButtonArea {
    display: flex;
    margin-left: 20px;
    margin-right: 20px;
    justify-content: space-between;
}
.editButtonArea {
    display: flex;
    margin-left: 40px;
    margin-right: 40px;
    justify-content: space-between;
}

.poppupWrapper {
    position: absolute;
    top: 0;
}
.popupMenu-enter-active,
.popupMenu-leave-active {
    will-change: opacity;
    transition: opacity 225ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
}
.popupMenu-enter,
.popupMenu-leave-to {
    opacity: 0;
}
</style>

<template>
    <div class="mainMenu">
        <div v-show="!drawerFlg" class="drawerMenuArea">
            <div class="drawerdefault">
                <div id="beforeScrollArea" class="scroll" @scroll="onScroll">
                    <pallet-area
                        class="palletArea"
                        :color-pallet="colorPallet"
                        :first-pallet-index="firstPalletIndex"
                        :pallet-index="palletIndex"
                        @getPalletColor="getPalletColorMethod"
                    ></pallet-area>
                </div>
                <button class="switch" @click="translate">▲</button>
            </div>
        </div>

        <transition name="popupMenu">
            <div v-show="drawerFlg" class="drawerMenuArea__Wrapper">
                <div class="drawerMenu">
                    <!-- ここにメニューの内容を書いていく -->
                    <div class="drawerdefault">
                        <div id="afterScrollArea" class="scroll">
                            <pallet-area
                                class="palletArea"
                                :color-pallet="colorPallet"
                                :first-pallet-index="firstPalletIndex"
                                @getPalletColor="getPalletColorMethod"
                            ></pallet-area>
                        </div>
                        <button class="switch" @click="translate">▼</button>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator';
import PalletArea from '@/components/Molecules/PalletArea.vue';

@Component({
    // middleware: 'auth',
    components: {
        PalletArea,
    },
})
export default class MainMenu extends Vue {
    @Prop({ type: Array })
    colorPallet!: string[]; // ページから渡されるパレットの色の配列

    @Prop({ type: Number })
    firstPalletIndex!: number; // 最初に選択しているパレットの位置

    @Prop({ type: Function })
    getPalletColor!: Function;

    palletIndex: number = this.firstPalletIndex;
    selectingColor: string = this.colorPallet[this.palletIndex];

    scrollArea: HTMLDivElement | null = null;
    drawerFlg: boolean = false;
    scrolled: number = 0;

    public created(): void {}

    public mounted(): void {
        this.scrollArea = document.querySelector('#beforeScrollArea');
        this.scrollArea!.addEventListener('scroll', this.onScroll);
    }

    public translate(): void {
        this.drawerFlg = !this.drawerFlg;
    }

    public onScroll(_e: any): void {}

    public getScrollArea(): void {
        if (!this.drawerFlg) {
            this.scrollArea = document.querySelector('#beforeScrollArea');
        } else {
            this.scrollArea = document.querySelector('#afterScrollArea');
        }
    }

    public getPalletColorMethod(newColor: string, newIndex: number): void {
        this.selectingColor = newColor;
        this.palletIndex = newIndex;
        this.getPalletColor(this.selectingColor, this.palletIndex);
    }
}
</script>
<style lang="scss" scoped>
$defaultHeight: 45px; //格納状態でのメニューのheight
$movedHeight: 230px; //展開状態でのメニューのheight
$movePercentage: 100% * (1 - $defaultHeight/$movedHeight); //transformの割合
//@debug $movePercentage;
.mainMenu {
    display: grid;
}
.drawerdefault {
    display: ruby;
    vertical-align: top;
    justify-content: space-between;
}
.scroll {
    overflow-x: scroll;
    max-width: 90%;
}
.palletArea {
    margin: auto;
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

.drawerMenuArea {
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
.drawerMenuArea__Wrapper {
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

<template>
    <v-row dense class="palletarea">
        <v-layout justify-center>
            <!-- <div>
                <pallet
                    v-for="(item, index) in colorPallet"
                    :key="item"
                    :color="item"
                    :index="index"
                    :selected-index="palletIndex"
                    @getColor="getPalletColor"
                ></pallet>
            </div> -->
            <div>
                <v-sheet class="colorPallet" elevation="1">
                    <v-slide-group
                        v-model="model"
                        mandatory
                        show-arrows
                        center-active
                    >
                        <v-slide-item
                            v-for="(item, index) in colorPallet"
                            :key="index"
                            v-slot="{ active, toggle }"
                        >
                            <pallet
                                :color="item"
                                :index="index"
                                :selected-index="palletIndex"
                                :active="active"
                                :toggle="toggle"
                                @getColor="getPalletColor"
                            >
                            </pallet>
                        </v-slide-item>
                    </v-slide-group>
                </v-sheet>
            </div>
        </v-layout>
    </v-row>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator';
// import { canvasDataModule } from '../../store/modules/canvasData';
import Pallet from '@/components/Atomics/Pallet.vue';

@Component({
    components: {
        Pallet,
    },
})
export default class PalletArea extends Vue {
    @Prop({ type: Array })
    colorPallet!: string[]; // ページから渡されるパレットの色の配列

    @Prop({ type: Number })
    firstPalletIndex!: number; // 最初に選択しているパレットの位置

    @Prop({ type: Number })
    palletIndex!: number; // 最初に選択しているパレットの位置

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

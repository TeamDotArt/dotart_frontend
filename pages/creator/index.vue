<template>
    <v-layout column justify-center align-center>
        <v-flex xs12 sm8 md6>
            <v-container fluid>
                <v-row dense class="card_container">
                    <v-col cols="12">
                        <v-card light hover max-width="1000" class="card">
                            <v-form ref="form" lazy-validation>
                                <v-card-title class="card">ドット絵作成</v-card-title>
                            </v-form>
                        </v-card>
                    </v-col>

                    <v-col cols="12">
                        <v-card light hover max-width="1000" class="card">
                            <v-form ref="form" lazy-validation>
                                <v-card-title class="headline">キャンバス名</v-card-title>
                                <v-card-subtitle>保存するときの名前です</v-card-subtitle>
                                <v-text-field v-model="palletState.canvasName" label="キャンバス名" />
                            </v-form>
                        </v-card>
                    </v-col>

                    <v-col cols="12">
                        <v-card light hover max-width="1000" class="card">
                            <v-form ref="form" lazy-validation>
                                <v-card-title class="headline">パレット選択</v-card-title>
                                <v-card-subtitle>使うパレットを選びましょう</v-card-subtitle>
                                <v-select
                                    v-model="palletState.selectedPallet"
                                    :items="itemState.palletListItems"
                                    label="パレット"
                                    return-object
                                ></v-select>
                                <small>
                                    {{
                                    palletState.selectedPallet['summary']
                                    }}
                                </small>
                                <div class="palletPreview">
                                    <div
                                        v-for="item in palletState
                                            .selectedPallet['pallet']"
                                        :key="item"
                                        class="palletPreview__Color"
                                        :style="{ background: item }"
                                    ></div>
                                </div>
                            </v-form>
                        </v-card>
                    </v-col>

                    <v-col cols="12">
                        <v-card light hover max-width="1000" class="card">
                            <v-form ref="form" lazy-validation>
                                <v-card-title class="headline">キャンバスサイズ指定</v-card-title>
                                <v-card-subtitle>キャンバスサイズを決めましょう</v-card-subtitle>
                                <v-select
                                    v-model="palletState.selectedSize"
                                    :items="itemState.sizeListItems"
                                    label="キャンバスサイズ"
                                    return-object
                                ></v-select>
                                <!-- <v-card-actions>
                                    <v-spacer />
                                    <v-btn color="primary" @click="startDraw"
                                        >作成する</v-btn
                                    >
                                </v-card-actions>-->
                            </v-form>
                        </v-card>
                    </v-col>
                    <v-col cols="12" style="text-align: center">
                        <v-btn color="primary" class="createButton" @click="startDraw">作成する</v-btn>
                    </v-col>
                </v-row>
            </v-container>
        </v-flex>
    </v-layout>
</template>

<script lang="ts">
import { defineComponent, reactive, useRouter } from '@nuxtjs/composition-api';
// import { Vue, Component } from 'nuxt-property-decorator';
import { CanvasDataModule } from '@/store/modules/canvasData';

type SelectedSize = {
    text: string;
    range: number;
    magnification: number;
};

type SizeListItems = {
    text: string;
    range: number;
    magnification: number;
};

type SelectedPallet = {
    text: string;
    summary: string;
    pallet: string[];
};

export default defineComponent({
    name: 'creatorPage',
    setup() {
        const router = useRouter();
        const itemState = reactive<{
            sizeListItems: SizeListItems[];
            palletListItems: SelectedPallet[];
        }>({
            sizeListItems: [
                { text: '16×16', range: 16, magnification: 24 },
                { text: '32×32', range: 32, magnification: 12 },
                { text: '48×48', range: 48, magnification: 8 },
                { text: '64×64', range: 64, magnification: 6 },
                { text: '96×96', range: 96, magnification: 4 },
            ],
            palletListItems: [
                {
                    text: 'スタンダード',
                    summary: '使いやすそうな色をまとめてみました。',
                    pallet: [
                        'rgb(255, 255, 255)',
                        'rgb(125, 125, 125)',
                        'rgb(0, 0, 0)',
                        'rgb(108, 57, 0)',
                        'rgb(243, 55, 55)',
                        'rgb(212, 110, 229)',
                        'rgb(180, 27, 235)',
                        'rgb(189, 137, 207)',
                        'rgb(150, 150, 215)',
                        'rgb(90, 90, 180)',
                        'rgb(82, 226, 226)',
                        'rgb(137, 255, 146)',
                        'rgb(199, 243, 118)',
                        'rgb(255, 245, 70)',
                        'rgb(255, 195, 100)',
                        'rgb(255, 228, 175)',
                    ],
                },
                {
                    text: 'モノクロ',
                    summary: '白黒のグラデーションです。',
                    pallet: [
                        'rgb(255, 255, 255)',
                        'rgb(235, 235, 235)',
                        'rgb(220, 220, 220)',
                        'rgb(205, 205, 205)',
                        'rgb(190, 190, 190)',
                        'rgb(175, 175, 175)',
                        'rgb(160, 160, 160)',
                        'rgb(145, 145, 145)',
                        'rgb(130, 130, 130)',
                        'rgb(115, 115, 115)',
                        'rgb(100, 100, 100)',
                        'rgb(85, 85, 85)',
                        'rgb(70, 70, 70)',
                        'rgb(55, 55, 55)',
                        'rgb(40, 40, 40)',
                        'rgb(0, 0, 0)',
                    ],
                },
                {
                    text: 'レトロゲーム4色',
                    summary: '当時の4色ディスプレイ風味。',
                    pallet: [
                        'rgb(238, 238, 162)',
                        'rgb(238, 238, 162)',
                        'rgb(238, 238, 162)',
                        'rgb(238, 238, 162)',
                        'rgb(186, 200, 112)',
                        'rgb(186, 200, 112)',
                        'rgb(186, 200, 112)',
                        'rgb(186, 200, 112)',
                        'rgb(107, 131, 56)',
                        'rgb(107, 131, 56)',
                        'rgb(107, 131, 56)',
                        'rgb(107, 131, 56)',
                        'rgb(38, 55, 0)',
                        'rgb(38, 55, 0)',
                        'rgb(38, 55, 0)',
                        'rgb(38, 55, 0)',
                    ],
                },
            ],
        });
        const palletState = reactive<{
            canvasName: string;
            selectedSize: SelectedSize;
            selectedPallet: SelectedPallet;
        }>({
            canvasName: 'キャンバス',
            selectedSize: {
                text: '16×16',
                range: 16,
                magnification: 24,
            },
            selectedPallet: itemState.palletListItems[0],
        });

        const startDraw = (): void => {
            //セッションストレージ全消し
            //一部消すようにしたかったら↓使ってね
            //sessionStorage.removeItem("")
            sessionStorage.clear();
            //セッションストレージに各種項目を設定
            CanvasDataModule.setReset();
            CanvasDataModule.setCanvasName(palletState.canvasName);
            CanvasDataModule.setCanvasRange(palletState.selectedSize.range);
            CanvasDataModule.setCanvasMagnification(
                palletState.selectedSize.magnification
            );
            CanvasDataModule.setPalletName(palletState.selectedPallet.text);
            CanvasDataModule.setPalletColor(palletState.selectedPallet.pallet);
            // お絵描きページへ遷移
            router.push('/creator/canvas');
            // this.$router.push('/creator/canvas');
        };
        return { itemState, palletState, startDraw };
    },
});
</script>

<style lang="scss" scoped>
.card_container {
    text-align: -webkit-center;
}
.card {
    justify-content: center;
    padding-left: 20px;
    padding-right: 20px;
}
.palletPreview {
    display: flex;
    pointer-events: none;
    padding-bottom: 10px;
    &__Color {
        display: flex;
        width: 20px;
        height: 20px;
        border: 2px solid rgb(50, 50, 50);
        pointer-events: none;
        border-radius: 30%;
    }
}
.createButton {
    margin: 5%;
}
</style>

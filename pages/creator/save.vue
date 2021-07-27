<template>
    <v-layout column justify-center align-center>
        <v-flex xs12 sm12 md12>
            <v-container fluid>
                <v-row dense>
                    <v-col cols="12">
                        <v-card light hover max-width="1000" class="card">
                            <v-form ref="form" lazy-validation>
                                <v-card-title class="card">
                                    画像保存
                                </v-card-title>
                            </v-form>
                        </v-card>
                    </v-col>
                    <v-col cols="12">
                        <div class="ResultCanvas">
                            <canvas
                                id="resultcanvas"
                                class="resultcanvas"
                                width="384px"
                                height="384px"
                            ></canvas>
                        </div>
                    </v-col>
                </v-row>
                <v-row dense>
                    <v-col cols="12">
                        <div class="SaveCanvas">
                            <canvas id="savecanvas"></canvas>
                        </div>
                    </v-col>
                </v-row>
                <v-row dense>
                    <v-col cols="12">
                        <v-card light hover max-width="1000" class="card">
                            <v-form ref="form" lazy-validation>
                                <v-card-title class="headline"
                                    >画像サイズ指定</v-card-title
                                >
                                <v-card-subtitle
                                    >保存するサイズを指定できます</v-card-subtitle
                                >
                                <v-select
                                    v-model="setCanvasState.selectedSize"
                                    :items="setCanvasState.sizeListItems"
                                    label="画像サイズ"
                                    return-object
                                ></v-select>
                                <v-card-actions style="justify-content: center">
                                    <v-btn color="primary" @click="saveImage"
                                        >保存</v-btn
                                    >
                                </v-card-actions>
                            </v-form>
                        </v-card>
                    </v-col>
                </v-row>
            </v-container>
        </v-flex>
    </v-layout>
</template>

<script lang="ts">
import {
    defineComponent,
    reactive,
    computed,
    ComputedRef,
    onMounted,
} from '@nuxtjs/composition-api';

type SelectedSize = {
    text: string;
    magnification: number;
};

type SizeListItems = {
    text: string;
    magnification: number;
};

export default defineComponent({
    name: 'SavePage',
    setup() {
        const session = JSON.parse(sessionStorage.getItem('dotArtStore')!);
        const getCanvasName = computed((): string => {
            return session.canvasData.canvasName;
        });
        const getRange = computed((): number => {
            return session.canvasData.canvasRange;
        });
        const getMagnification = computed((): number => {
            return session.canvasData.canvasMagnification;
        });
        const getColorPallet = computed((): string[] => {
            return session.canvasData.palletColor;
        });
        const getCanvasIndexData = computed((): number[] => {
            return session.canvasData.canvasIndexData;
        });
        const canvasState = reactive<{
            canvasName: ComputedRef<string>;
            canvasRange: ComputedRef<number>;
            canvasMagnification: ComputedRef<number>;
            colorPallet: ComputedRef<string[]>;
            canvasIndexData: ComputedRef<number[]>;
            previewCanvas: HTMLCanvasElement | null;
            previewCanvasCtx: CanvasRenderingContext2D | null;
            saveCanvas: HTMLCanvasElement | null;
            saveCanvasCtx: CanvasRenderingContext2D | null;
        }>({
            canvasName: getCanvasName, // キャンバスの名前
            canvasRange: getRange, // ドット絵のサイズ
            canvasMagnification: getMagnification, // 元の倍率
            colorPallet: getColorPallet,
            canvasIndexData: getCanvasIndexData,
            previewCanvas: null, // イラストを表示するキャンバス
            previewCanvasCtx: null, // ↑のコンテキスト
            saveCanvas: null, // 画像サイズ変更のためのキャンバス
            saveCanvasCtx: null, // ↑のコンテキスト
        });
        const setCanvasState = reactive<{
            maxMagnification: number;
            canvasStyleSize: number;
            selectedSize: SelectedSize;
            sizeListItems: SizeListItems[];
        }>({
            maxMagnification: (384 / canvasState.canvasRange) * 2, // 画像サイズ変更の際の最大サイズを指定
            canvasStyleSize: 334, // キャンバスの外見上のサイズ
            selectedSize: {
                text:
                    canvasState.canvasRange * canvasState.canvasMagnification +
                    '×' +
                    canvasState.canvasRange * canvasState.canvasMagnification,
                magnification: canvasState.canvasMagnification,
            },

            // 画像サイズと、その画像サイズにするための倍率のリスト
            sizeListItems: [
                {
                    text:
                        canvasState.canvasRange + '×' + canvasState.canvasRange,
                    magnification: 1,
                },
            ],
        });

        // ドット絵のサイズ、表示倍率、キャンバスのデータ、パレットのデータから対象のcanvasにドット絵の描画
        const draw = (
            range: number,
            magnification: number,
            context: any
        ): void => {
            for (let i = 0; i < range; i++) {
                for (let j = 0; j < range; j++) {
                    context.fillStyle =
                        canvasState.colorPallet[
                            canvasState.canvasIndexData[j * range + i]
                        ];
                    context.fillRect(
                        i * magnification,
                        j * magnification,
                        magnification,
                        magnification
                    );
                }
            }
        };

        onMounted(() => {
            canvasState.previewCanvas = document.querySelector('#resultcanvas');
            canvasState.previewCanvasCtx = canvasState.previewCanvas!.getContext(
                '2d'
            );
            canvasState.previewCanvas!.style.width =
                setCanvasState.canvasStyleSize + 'px';
            canvasState.previewCanvas!.style.height =
                setCanvasState.canvasStyleSize + 'px';
            canvasState.previewCanvas!.style.border = '1px solid rgb(0,0,0)';
            canvasState.saveCanvas = document.querySelector('#savecanvas');
            canvasState.saveCanvasCtx = canvasState.saveCanvas!.getContext(
                '2d'
            )!;

            draw(
                canvasState.canvasRange,
                canvasState.canvasMagnification,
                canvasState.previewCanvasCtx
            );

            // 画像サイズのリスト生成
            // TODO: i = i * 2
            for (let i = 2; i <= 32; i = i * 2) {
                setCanvasState.sizeListItems.push({
                    text:
                        canvasState.canvasRange * i +
                        '×' +
                        canvasState.canvasRange * i,
                    magnification: i,
                });
            }
            setCanvasState.sizeListItems.push({
                text:
                    canvasState.canvasRange * canvasState.canvasMagnification +
                    '×' +
                    canvasState.canvasRange * canvasState.canvasMagnification,
                magnification: canvasState.canvasMagnification,
            });

            // 並べ替え
            setCanvasState.sizeListItems.sort(function (
                a: SizeListItems,
                b: SizeListItems
            ): number {
                if (a.magnification < b.magnification) {
                    return -1;
                }
                if (a.magnification > b.magnification) {
                    return 1;
                }
                return 0;
            });
        });

        // 選んだ倍率からドット絵を描画し、画像として保存する
        const saveImage = (): void => {
            canvasState.saveCanvas!.width =
                canvasState.canvasRange *
                setCanvasState.selectedSize.magnification;
            canvasState.saveCanvas!.height =
                canvasState.canvasRange *
                setCanvasState.selectedSize.magnification;
            // 画像を拡大するのではなく倍率を変えて再描画してるので画質の劣化はないと思う
            draw(
                canvasState.canvasRange,
                setCanvasState.selectedSize.magnification,
                canvasState.saveCanvasCtx
            );
            // if (this.saveCanvas.msToBlob) {
            // なんかIE11だとこれないと困るらしいけどHTMLCanvasElementだと書き方変わるみたいで困っちゃったねえ～
            // ぶっちゃけこれから消される運命のブラウザなんて無視していいと思うんだけどおまえどう？
            // IE11は滅びるべきなので対応しなくてOK
            //  const blob = this.saveCanvas.msToBlob()
            //  window.navigator.msSaveBlob(blob, this.canvasName + '.png')
            // } else {
            // 画像データを対象にしたリンクを生成し、クリックしたことにする
            const link = document.createElement('a');
            link.href = canvasState.saveCanvas!.toDataURL('image/png')!;
            link.download =
                canvasState.canvasName +
                ':' +
                setCanvasState.selectedSize.text +
                '.png';
            link.click();
            // }
        };

        return {
            getCanvasName,
            getRange,
            getMagnification,
            getColorPallet,
            getCanvasIndexData,
            canvasState,
            setCanvasState,
            saveImage,
        };
    },
});
</script>

<style lang="scss" scoped>
.card {
    justify-content: center;
    padding: 5%;
}
.ResultCanvas {
    position: relative;
    top: -15px;
    text-align: center;
}

.ResultCanvas::before {
    content: '';
    display: block;
    padding-top: 10%;
}

.SaveCanvas {
    display: none;
}
</style>

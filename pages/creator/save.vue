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
        <!-- アップロード待機 -->
        <div v-if="imgurState.isLoading" class="loaderContainer">
            <div class="loaderContainer__loader">読込中....</div>
        </div>
        <!-- シェアメニュー -->
        <aside class="snsContainer">
            <div class="snsContainer__sns_button_group__container">
                <span
                    className="snsContainer__sns_button_group__container__title"
                    >共有</span
                >
                <span class="snsContainer__sns_button_group__container__icon">
                    <a
                        :href="getTwitterShare"
                        target="_blank"
                        className="snsContainer__sns_button_group__container__button"
                    >
                        <v-icon>mdi-twitter</v-icon>
                    </a>
                </span>

                <span class="snsContainer__sns_button_group__container__icon">
                    <a
                        :href="getLINEShare"
                        target="_blank"
                        className="snsContainer__sns_button_group__container__button"
                    >
                        <img
                            alt="line"
                            width="25"
                            height="25"
                            src="https://developers.line.biz/media/line-social-plugins/round-grey.png"
                        />
                    </a>
                </span>
            </div>
        </aside>
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

import { layerdCanvasData } from '@/types/Canvas/LayerdCanvasDataType';
import useReDraw from '@/composables/useReDraw';
import useImgurUpload from '@/composables/useImgurUpload';
// constants
import { constants } from '@/common/constants';
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
        const getLayerdCanvasIndexData = computed((): layerdCanvasData[] => {
            return session.canvasData.canvasesIndexData;
        });
        const getTwitterShare = computed((): string => {
            const textAndHashTag = encodeURIComponent(
                `ドット絵を描いたよ！\n${imgurState.imgurLink} #dotArt\n`
            );
            return `https://twitter.com/intent/tweet?url=https://dotart.riml.work&text=${textAndHashTag}`;
        });
        const getLINEShare = computed((): string => {
            const content = encodeURIComponent(
                `ドット絵を描いたよ！\n${imgurState.imgurLink}\nDotArtはこちらから！\n`
            );
            return `https://social-plugins.line.me/lineit/share?url=https://dotart.riml.work&text=${content}`;
        });
        const canvasState = reactive<{
            canvasName: ComputedRef<string>;
            canvasRange: ComputedRef<number>;
            canvasMagnification: ComputedRef<number>;
            colorPallet: ComputedRef<string[]>;
            canvasIndexData: ComputedRef<layerdCanvasData[]>;
            previewCanvas: HTMLCanvasElement | null;
            previewCanvasCtx: CanvasRenderingContext2D | null;
            saveCanvas: HTMLCanvasElement | null;
            saveCanvasCtx: CanvasRenderingContext2D | null;
            topLayerData: number[];
            layerMaxNum: number;
        }>({
            canvasName: getCanvasName, // キャンバスの名前
            canvasRange: getRange, // ドット絵のサイズ
            canvasMagnification: getMagnification, // 元の倍率
            colorPallet: getColorPallet,
            canvasIndexData: getLayerdCanvasIndexData,
            previewCanvas: null, // イラストを表示するキャンバス
            previewCanvasCtx: null, // ↑のコンテキスト
            saveCanvas: null, // 画像サイズ変更のためのキャンバス
            saveCanvasCtx: null, // ↑のコンテキスト
            topLayerData: [], // 現在表示されている中で最も上のレイヤーを保存する
            layerMaxNum: constants.LAYER_MAX_NUM, // レイヤー数の上限
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
        const imgurState = reactive<{
            imgurId: string;
            imgurLink: string;
            imgurDeleteHash: string;
            isLoading: boolean;
        }>({
            imgurId: '',
            imgurLink: '',
            imgurDeleteHash: '',
            isLoading: true,
        });

        const layerdDraw = (
            range: number,
            magnification: number,
            context: any
        ): void => {
            const redrawData = {
                canvasCtx: context,
                canvasRange: range,
                canvasIndexData: canvasState.canvasIndexData,
                canvasMagnification: magnification,
                colorPallet: canvasState.colorPallet,
                backGroundColorIndex: constants.BACKGROUND_COLOR_INDEX,
                topLayerData: canvasState.topLayerData,
                layerMaxNum: canvasState.layerMaxNum,
            };
            useReDraw(redrawData);
        };

        onMounted(() => {
            canvasState.previewCanvas = document.querySelector('#resultcanvas');
            canvasState.previewCanvasCtx =
                canvasState.previewCanvas!.getContext('2d');
            canvasState.previewCanvas!.style.width =
                setCanvasState.canvasStyleSize + 'px';
            canvasState.previewCanvas!.style.height =
                setCanvasState.canvasStyleSize + 'px';
            canvasState.previewCanvas!.style.border = '1px solid rgb(0,0,0)';
            canvasState.saveCanvas = document.querySelector('#savecanvas');
            canvasState.saveCanvasCtx =
                canvasState.saveCanvas!.getContext('2d')!;

            // topLayerData初期化
            for (let x = 0; x < canvasState.canvasRange; x++) {
                for (let y = 0; y < canvasState.canvasRange; y++) {
                    canvasState.topLayerData[y * canvasState.canvasRange + x] =
                        canvasState.layerMaxNum + 10; // 存在しうるレイヤーより大きく設定
                }
            }

            layerdDraw(
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

            setImgur();
        });

        const setImgur = async (): Promise<void> => {
            canvasState.saveCanvas!.width =
                canvasState.canvasRange *
                setCanvasState.selectedSize.magnification;
            canvasState.saveCanvas!.height =
                canvasState.canvasRange *
                setCanvasState.selectedSize.magnification;
            // 画像を拡大するのではなく倍率を変えて再描画してるので画質の劣化はないと思う
            layerdDraw(
                canvasState.canvasRange,
                setCanvasState.selectedSize.magnification,
                canvasState.saveCanvasCtx
            );
            const img = canvasState.saveCanvas!.toDataURL('image/png')!;
            try {
                const res = await useImgurUpload(img);
                imgurState.imgurId = res.id;
                imgurState.imgurLink = res.link;
                imgurState.imgurDeleteHash = res.deletehash;
            } catch (e) {
                alert('画像のアップロードに失敗しました。');
            }
            imgurState.isLoading = false;
        };

        // 選んだ倍率からドット絵を描画し、画像として保存する
        const saveImage = (): void => {
            canvasState.saveCanvas!.width =
                canvasState.canvasRange *
                setCanvasState.selectedSize.magnification;
            canvasState.saveCanvas!.height =
                canvasState.canvasRange *
                setCanvasState.selectedSize.magnification;
            // 画像を拡大するのではなく倍率を変えて再描画してるので画質の劣化はないと思う
            layerdDraw(
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
            getTwitterShare,
            getLINEShare,
            canvasState,
            setCanvasState,
            imgurState,
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
    display: block;
    padding-top: 10%;
    content: '';
}

.SaveCanvas {
    display: none;
}

.snsContainer {
    position: fixed;
    background-color: #ce93d8;
    border-radius: 5px;
    right: 0;
    bottom: 0%;
    width: 3rem;
    transform: translateY(-50%);
    z-index: 50;
    &__sns_button_group__container {
        align-items: center;
        border-radius: 5px;
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
        justify-content: center;
        padding: 8px;
        width: 2em;
        color: white;
        &__title {
            font-size: 12px;
            margin-bottom: 10px;
            margin-top: 5px;
            -ms-writing-mode: tb-rl;
            writing-mode: vertical-rl;
        }

        &__icon {
            color: white;
            margin-bottom: 5px;
            margin-top: 5px;
            padding: 5px;
        }
        &__button {
            background-color: transparent;
            //width: 30px;
            //height: 30px;
            cursor: pointer;
            line-height: 1;

            &__primary {
                color: white;
            }

            &__secondary {
                color: white;
            }

            &__small {
                font-size: 12px;
            }

            &__medium {
                font-size: 14px;
            }

            &__large {
                font-size: 16px;
            }
        }
    }
}

.loaderContainer {
    position: fixed;
    display: flex;
    align-items: center;
    justify-content: center;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: #000;
    opacity: 0.5;

    &__loader {
        color: #ce93d8;
        font-size: 90px;
        text-indent: -9999em;
        overflow: hidden;
        width: 1em;
        height: 1em;
        border-radius: 50%;
        margin: 72px auto;
        position: relative;
        -webkit-transform: translateZ(0);
        -ms-transform: translateZ(0);
        transform: translateZ(0);
        -webkit-animation: load6 1.7s infinite ease, round 1.7s infinite ease;
        animation: load6 1.7s infinite ease, round 1.7s infinite ease;
    }
    @-webkit-keyframes load6 {
        0% {
            box-shadow: 0 -0.83em 0 -0.4em, 0 -0.83em 0 -0.42em,
                0 -0.83em 0 -0.44em, 0 -0.83em 0 -0.46em, 0 -0.83em 0 -0.477em;
        }
        5%,
        95% {
            box-shadow: 0 -0.83em 0 -0.4em, 0 -0.83em 0 -0.42em,
                0 -0.83em 0 -0.44em, 0 -0.83em 0 -0.46em, 0 -0.83em 0 -0.477em;
        }
        10%,
        59% {
            box-shadow: 0 -0.83em 0 -0.4em, -0.087em -0.825em 0 -0.42em,
                -0.173em -0.812em 0 -0.44em, -0.256em -0.789em 0 -0.46em,
                -0.297em -0.775em 0 -0.477em;
        }
        20% {
            box-shadow: 0 -0.83em 0 -0.4em, -0.338em -0.758em 0 -0.42em,
                -0.555em -0.617em 0 -0.44em, -0.671em -0.488em 0 -0.46em,
                -0.749em -0.34em 0 -0.477em;
        }
        38% {
            box-shadow: 0 -0.83em 0 -0.4em, -0.377em -0.74em 0 -0.42em,
                -0.645em -0.522em 0 -0.44em, -0.775em -0.297em 0 -0.46em,
                -0.82em -0.09em 0 -0.477em;
        }
        100% {
            box-shadow: 0 -0.83em 0 -0.4em, 0 -0.83em 0 -0.42em,
                0 -0.83em 0 -0.44em, 0 -0.83em 0 -0.46em, 0 -0.83em 0 -0.477em;
        }
    }
    @keyframes load6 {
        0% {
            box-shadow: 0 -0.83em 0 -0.4em, 0 -0.83em 0 -0.42em,
                0 -0.83em 0 -0.44em, 0 -0.83em 0 -0.46em, 0 -0.83em 0 -0.477em;
        }
        5%,
        95% {
            box-shadow: 0 -0.83em 0 -0.4em, 0 -0.83em 0 -0.42em,
                0 -0.83em 0 -0.44em, 0 -0.83em 0 -0.46em, 0 -0.83em 0 -0.477em;
        }
        10%,
        59% {
            box-shadow: 0 -0.83em 0 -0.4em, -0.087em -0.825em 0 -0.42em,
                -0.173em -0.812em 0 -0.44em, -0.256em -0.789em 0 -0.46em,
                -0.297em -0.775em 0 -0.477em;
        }
        20% {
            box-shadow: 0 -0.83em 0 -0.4em, -0.338em -0.758em 0 -0.42em,
                -0.555em -0.617em 0 -0.44em, -0.671em -0.488em 0 -0.46em,
                -0.749em -0.34em 0 -0.477em;
        }
        38% {
            box-shadow: 0 -0.83em 0 -0.4em, -0.377em -0.74em 0 -0.42em,
                -0.645em -0.522em 0 -0.44em, -0.775em -0.297em 0 -0.46em,
                -0.82em -0.09em 0 -0.477em;
        }
        100% {
            box-shadow: 0 -0.83em 0 -0.4em, 0 -0.83em 0 -0.42em,
                0 -0.83em 0 -0.44em, 0 -0.83em 0 -0.46em, 0 -0.83em 0 -0.477em;
        }
    }
    @-webkit-keyframes round {
        0% {
            -webkit-transform: rotate(0deg);
            transform: rotate(0deg);
        }
        100% {
            -webkit-transform: rotate(360deg);
            transform: rotate(360deg);
        }
    }
    @keyframes round {
        0% {
            -webkit-transform: rotate(0deg);
            transform: rotate(0deg);
        }
        100% {
            -webkit-transform: rotate(360deg);
            transform: rotate(360deg);
        }
    }
}
</style>

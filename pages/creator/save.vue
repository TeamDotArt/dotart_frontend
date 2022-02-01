<template>
    <v-layout fill-height fluid>
        <div class="container">
            <!-- CanvasGroup -->
            <div class="container__column">
                <div class="ResultCanvas">
                    <canvas
                        id="resultcanvas"
                        class="resultcanvas"
                        width="384px"
                        height="384px"
                    ></canvas>
                </div>
                <div>
                    <div class="SaveCanvas">
                        <canvas id="savecanvas"></canvas>
                    </div>
                </div>
            </div>
            <!-- menuGroup -->
            <div class="container__column menuContainer">
                <!-- TODO: 画像名を変更できるようにする -->
                <!-- <div class="container__column__group">
                    <label>画像名</label>
                    <input
                        v-model="setCanvasState.sizeListItems.text"
                        type="text"
                        placeholder="キャンバス"
                    />
                </div> -->
                <div class="container__column__group">
                    <label
                        ><v-icon>mdi-image-size-select-large</v-icon>
                        画像サイズ指定
                    </label>
                    <select v-model="setCanvasState.selectedSize">
                        <option
                            v-for="(
                                item, index
                            ) in setCanvasState.sizeListItems"
                            :key="index"
                            :value="item"
                        >
                            {{ item['text'] }}
                        </option>
                    </select>
                </div>

                <div class="container__column__buttongroup">
                    <button
                        class="container__column__buttongroup__button"
                        @click="saveImage"
                    >
                        <div
                            class="
                                container__column__buttongroup__button__layout
                            "
                        >
                            <v-icon>mdi-download</v-icon>
                            <span>保存</span>
                        </div>
                    </button>
                </div>
            </div>
        </div>
        <!-- アップロード待機 -->
        <ActiveIndicator :is-loading="imgurState.isLoading" />
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
// compornent
import ActiveIndicator from '@/components/Atomics/ActiveIndicator.vue';
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
    components: {
        ActiveIndicator,
    },
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
            const defaultText =
                canvasState.canvasRange * canvasState.canvasMagnification +
                '×' +
                canvasState.canvasRange * canvasState.canvasMagnification;
            if (
                !setCanvasState.sizeListItems.some(
                    (u) => u.text === defaultText
                )
            ) {
                setCanvasState.sizeListItems.push({
                    text:
                        canvasState.canvasRange *
                            canvasState.canvasMagnification +
                        '×' +
                        canvasState.canvasRange *
                            canvasState.canvasMagnification,
                    magnification: canvasState.canvasMagnification,
                });
            }

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
$over_pc: 'only screen and (min-width:820px)';

.container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    &__column {
        width: 100%;
        &__group {
            display: flex;
            flex-direction: column;
            padding: 1rem;
        }
        &__buttongroup {
            display: flex;
            justify-content: center;
            align-items: center;
            &__button {
                width: 40%;
                background-color: #ce93d8;
                border-radius: 10px;
                color: white;
                padding: 0.5rem;
            }
            &__layout {
                display: flex;
                justify-content: center;
                align-items: center;
            }
        }
    }
    @media (min-width: 1024px) {
        &__column {
            width: 50%;
        }
    }
}

.menuContainer {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 1em;
    font-weight: bold;
    border: solid 3px #ce93d8;
    border-radius: 10px;
}

input,
select {
    -webkit-appearance: none;
    -moz-appearance: none;
    -ms-appearance: none;
    appearance: none;
    box-sizing: border-box;
    max-width: 100%;
    color: inherit;
    font-family: inherit;
    font-size: 1.3rem;
    line-height: 1.6;
    border-radius: 6px;
    border: 1px solid #ced1d2;
    background: #f9fafa;
    outline: none;
}
input[type='text'] {
    padding: 0.3rem 1.2rem;
    width: 14em;
}
select {
    cursor: pointer;
    padding: 0.3rem 3.6rem 0.3rem 1.2rem;
    background-image: url('data:image/svg+xml;charset=utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2225.532%22%20height%3D%2214%22%20viewBox%3D%220%200%2025.532%2014%22%3E%3Cpath%20d%3D%22M82.249%2C82.431l.875.851%2C12.25-11.915h0l.875-.851-.875-.851h0L83.124%2C57.75l-.875.851L94.5%2C70.516Z%22%20transform%3D%22translate(83.282%20-82.249)%20rotate(90)%22%20fill%3D%22%23999%22%20fill-rule%3D%22evenodd%22%2F%3E%3C%2Fsvg%3E');
    background-repeat: no-repeat;
    background-position: calc(100% - 8px) center;
    background-size: 14px 8px;
}

select::-ms-expand {
    display: none;
}

input::-ms-clear {
    visibility: hidden;
}

:-ms-input-placeholder {
    color: #9ea3a5;
}

::-webkit-input-placeholder {
    color: #9ea3a5;
}

label {
    font-size: 1.5em;
    margin-bottom: 0.2em;
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
    top: 20%;
    width: 2rem;
    transform: translateY(-50%);
    z-index: 50;
    @media #{$over_pc} {
        width: 3rem;
    }
    &__sns_button_group__container {
        align-items: center;
        border-radius: 5px;
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
        justify-content: center;
        padding-top: 8px;
        padding-bottom: 8px;
        padding-right: 1rem;
        width: 2em;
        color: white;
        @media #{$over_pc} {
            padding: 9px;
        }
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
</style>

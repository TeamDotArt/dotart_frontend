<template>
    <v-layout column justify-center align-center>
        <dl class="container">
            <dt>
                <span class="container__icon"
                    ><v-icon>mdi-form-textbox</v-icon></span
                >
                キャンバス名
            </dt>
            <dd>
                <input
                    v-model="palletState.canvasName"
                    type="text"
                    placeholder="キャンバス"
                />
            </dd>
            <dt>
                <span class="container__icon"
                    ><v-icon>mdi-format-color-fill</v-icon></span
                >
                使うパレット
            </dt>
            <dd>
                <select v-model="palletState.selectedPallet">
                    <option
                        v-for="item in itemState.palletListItems"
                        :key="item.id"
                        :value="item"
                    >
                        {{ item['text'] }}
                    </option>
                </select>
            </dd>
            <small>
                {{ palletState.selectedPallet['summary'] }}
            </small>
            <div class="palletPreview">
                <div
                    v-for="item in palletState.selectedPallet['pallet']"
                    :key="item.id"
                    class="palletPreview__Color"
                    :style="{ background: item }"
                ></div>
            </div>

            <dt>
                <span class="container__icon"><v-icon>mdi-grid</v-icon></span>
                キャンバスサイズ
            </dt>
            <dd>
                <ul class="container__radiolist">
                    <li
                        v-for="(item, index) in itemState.sizeListItems"
                        :key="index"
                    >
                        <label
                            ><input
                                :id="index"
                                v-model="palletState.selectedSize"
                                type="radio"
                                name="radio"
                                :value="item"
                                checked
                            /><span class="radioButton">{{
                                item['text']
                            }}</span></label
                        >
                    </li>
                </ul>
            </dd>
        </dl>
        <div class="buttonCenter">
            <v-btn color="primary" class="createButton" @click="startDraw"
                >作成する</v-btn
            >
        </div>
    </v-layout>
</template>

<script lang="ts">
import { defineComponent, reactive, useRouter } from '@nuxtjs/composition-api';
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
    name: 'CreatorPage',
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
            // セッションストレージ全消し
            // 一部消すようにしたかったら↓使ってね
            // sessionStorage.removeItem("")
            sessionStorage.clear();
            // セッションストレージに各種項目を設定
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
$over_pc: 'only screen and (min-width:820px)';
$space_s: 1.3rem;
$space: 1.8rem;
$lh_s: 1.8;

.buttonCenter {
    text-align: center;
}
.container {
    dt {
        font-weight: bold;
        padding-top: $space;
        margin-bottom: $space_s;
        line-height: 1.4;
        display: flex;
        align-items: center;
    }
    dd {
        padding-bottom: $space;
        line-height: 1.4;
    }
    &__icon {
        display: inline-block;
        font-weight: normal;
        font-size: 1.2rem;
        width: 3em;
        padding: 0.3em;
        text-align: center;
        background: #ce93d8;
        color: #fff;
        margin-right: $space_s;
        border-radius: 10px;
    }
    &__radiolist {
        list-style: none;
        margin-top: 2rem;
        li:not(:last-child) {
            margin-bottom: $space;
        }
        @media #{$over_pc} {
            display: flex;
            flex-wrap: wrap;
            li {
                margin-right: 3.2rem;
                &:not(:last-child) {
                    margin-bottom: 0;
                }
            }
        }
    }
}

input,
select,
textarea {
    // ブラウザデフォルト表示のクリア
    -webkit-appearance: none;
    -moz-appearance: none;
    -ms-appearance: none;
    appearance: none;
    box-sizing: border-box;
    max-width: 100%;
    color: inherit;
    font-family: inherit;
    // iOSでフォームパーツが拡大するのを防ぐ。
    font-size: 1.6rem;
    // Mac/iOS Safariでplaceholderが上にずれるのを防ぐ。
    line-height: 1.6;
    border-radius: 6px;
    border: 1px solid #ced1d2;
    background: #f9fafa;
    outline: none;
}
input[type='text'] {
    padding: 1rem 1.2rem;
    //  デフォルト幅を設定。
    width: 14em;
}
textarea {
    padding: 1rem 1.2rem;
    width: 100%;
    height: 10em;
}
select {
    //  オリジナルの矢印画像を表示するためpadding-rightを広くあけておく。
    padding: 1rem 3.6rem 1rem 1.2rem;
    background-image: url('data:image/svg+xml;charset=utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2225.532%22%20height%3D%2214%22%20viewBox%3D%220%200%2025.532%2014%22%3E%3Cpath%20d%3D%22M82.249%2C82.431l.875.851%2C12.25-11.915h0l.875-.851-.875-.851h0L83.124%2C57.75l-.875.851L94.5%2C70.516Z%22%20transform%3D%22translate(83.282%20-82.249)%20rotate(90)%22%20fill%3D%22%23999%22%20fill-rule%3D%22evenodd%22%2F%3E%3C%2Fsvg%3E');
    background-repeat: no-repeat;
    background-position: calc(100% - 8px) center;
    background-size: 14px 8px;
}
// ブラウザデフォルト表示のクリア
// IE11のselect矢印を非表示にする。
select::-ms-expand {
    display: none;
}
// ブラウザデフォルト表示のクリア
// IE11/Edgeの☓印クリアボタンを非表示にする。
input::-ms-clear {
    visibility: hidden;
}
//  IE11のplaceholderテキスト色を設定する。
:-ms-input-placeholder {
    color: #9ea3a5;
}
//  その他のブラウザのplaceholderテキスト色を設定する。
::-webkit-input-placeholder {
    color: #9ea3a5;
}
input[type='checkbox'],
input[type='radio'] {
    //  checkboxとradioを非表示にする。
    display: none;
}
label {
    cursor: pointer;
}

.radioButton {
    // radioの後ろにlabelまたはspanなどを配置する。
    display: inline-flex;
    align-items: center;
    text-align: left;
    line-height: 1.2;
    cursor: pointer;
    &:before {
        content: '';
        display: block;
        margin-right: 0.6rem;
        border: 1px solid #ced1d2;
        border-radius: 50%;
        background: #f9fafa;
        width: 22px;
        height: 22px;
        // IE11でbeforeコンテンツ幅を保持する。
        flex: 1 0 auto;
    }
}
:checked + .radioButton {
    position: relative;
    &:after {
        content: '';
        display: block;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: #ce93d8;
        position: absolute;
        left: 7px;
        top: 0;
        bottom: 0;
        margin: auto;
    }
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

<template>
    <v-layout column justify-center align-center>
        <v-flex xs12 sm12 md12 style="text-align: center">
            <v-container fluid>
                <v-row dense>
                    <v-col cols="12">
                        <!-- <div class="DrowCanvas">
                            <canvas
                                id="drowcanvas"
                                width="384px"
                                height="384px"
                            ></canvas>
                            <div class="DrowCanvas__Grid">
                                <canvas
                                    id="gridcanvas"
                                    width="383px"
                                    height="383px"
                                    @mousedown="onClick"
                                    @mouseup="onDragEnd"
                                    @mouseout="onDragEnd"
                                    @mousemove="onMouseMove"
                                    @touchstart="onTouch"
                                    @touchmove="onSwipe"
                                    @touchend="onDragEnd"
                                ></canvas>
                            </div>
                        </div>-->
                        <div class="DrowCanvas">
                            <div class="DrowCanvas__Draw">
                                <canvas
                                    id="drowcanvas"
                                    width="384px"
                                    height="384px"
                                ></canvas>
                            </div>
                            <div class="DrowCanvas__Grid">
                                <canvas
                                    id="gridcanvas"
                                    width="383px"
                                    height="383px"
                                    @mousedown="onClick"
                                    @mouseup="onDragEnd"
                                    @mouseout="onDragEnd"
                                    @mousemove="onMouseMove"
                                    @touchstart="onTouch"
                                    @touchmove="onSwipe"
                                    @touchend="onDragEnd"
                                ></canvas>
                            </div>
                        </div>
                    </v-col>
                </v-row>

                <pallet-area
                    class="palletArea"
                    :color-pallet="palletState.colorPallet"
                    :first-pallet-index="palletState.palletIndex"
                    @getPalletColor="getPalletColor"
                ></pallet-area>

                <button-area
                    :pen-mode="canvasSettingState.penMode"
                    :mode-change="penModeChange"
                    :undo="undo"
                    :redo="redo"
                    :draw-grid="drawGrid"
                    :save="imageSave"
                    :clock-rotate="clockRotate"
                    :anticlock-rotate="antiClockRotate"
                ></button-area>

                <div class="layerListTest">
                    <div
                        v-for="item in canvasColorState.canvasesData"
                        :key="item.layerIndex"
                    >
                        {{ item.layerName }}
                        <button @click="layerSwap(true, item.layerIndex)">
                            ↑
                        </button>
                        <button @click="layerSwap(false, item.layerIndex)">
                            ↓
                        </button>
                        <button @click="layerChange(item.layerIndex)">
                            select
                        </button>
                        <button @click="layerDelete(item.layerIndex)">
                            del
                        </button>
                        <button
                            v-if="item.active"
                            @click="layerActivate(item.layerIndex)"
                        >
                            activated
                        </button>
                        <button
                            v-if="!item.active"
                            @click="layerActivate(item.layerIndex)"
                        >
                            disabled
                        </button>
                        {{ item.layerIndex }}
                    </div>
                    <button @click="layerAdd">add</button>
                </div>

                <!-- <main-menu
                    :color-pallet="palletState.colorPallet"
                    :first-pallet-index="palletState.palletIndex"
                    :get-pallet-color="getPalletColor"
                ></main-menu>-->
            </v-container>
        </v-flex>
    </v-layout>
</template>

<script lang="ts">
import {
    computed,
    ComputedRef,
    defineComponent,
    onBeforeUnmount,
    onMounted,
    reactive,
    useRouter,
} from '@nuxtjs/composition-api';
// import { Vue, Component } from 'nuxt-property-decorator';
import { Point } from '@/types/Canvas/PointType';
import { layerdCanvasData } from '@/types/Canvas/LayerdCanvasDataType';
import { UndoRedoLayer } from '@/types/Canvas/UndoRedoLayerType';
// import { CanvasDataModule } from '@/store/modules/canvasData';

// composables
import useSaveCanvasData from '@/composables/useSaveCanvasData';
import useClockRotate from '@/composables/useClockRotate';
import useDrawDot from '@/composables/useDrawDot';
import useAfterDraw from '@/composables/useAfterDraw';
import useDrawFill from '@/composables/useDrawFill';
import useReDraw from '@/composables/useReDraw';
import useLayerReDraw from '@/composables/useLayerReDraw';
import useActiveDrawGrid from '@/composables/useActiveDrawGrid';

// components
import ButtonArea from '@/components/Molecules/ButtonArea.vue';
import PalletArea from '@/components/Molecules/PalletArea.vue';
// import MainMenu from '@/components/Organisms/MainMenu.vue';

export default defineComponent({
    name: 'CanvasPage',
    components: {
        ButtonArea,
        PalletArea,
        // MainMenu,
    },
    setup() {
        const router = useRouter();

        // セッションストレージから設定項目を取得
        const session = JSON.parse(sessionStorage.getItem('dotArtStore')!);

        const getRange = computed((): number => {
            return session.canvasData.canvasRange;
        });

        const getMagnification = computed((): number => {
            return session.canvasData.canvasMagnification;
        });

        const getColorPallet = computed((): string[] => {
            return session.canvasData.palletColor;
        });

        const getCanvasesIndexData = computed((): layerdCanvasData[] => {
            return session.canvasData.canvasesIndexData;
        });

        const getUndoRedoDataStack = computed((): UndoRedoLayer[] => {
            return session.canvasData.undoRedoDataStack;
        });

        /* TODO: canvasColorState.getCanvasIndexDataに代入処理を行う場合はこちらも検討する
         *  こちらはcomputedをgetter/setterとして利用できる記法
         *  ただし呼び出す側の型もWritableComputedRefに代わっていくので注意
         */
        // const _canvasIndexData = reactive({
        //     value: CanvasDataModule.canvasIndexData,
        // });
        // const getCanvasIndexData = computed({
        //     get: () => _canvasIndexData.value,
        //     set: () => {
        //         _canvasIndexData.value = CanvasDataModule.canvasIndexData;
        //     },
        // });

        const pointState = reactive<{ pointed: Point; beforePointed: Point }>({
            pointed: { X: 0, Y: 0 }, // 現在のグリッド座標
            beforePointed: { X: 0, Y: 0 }, // 一個前のグリッド座標
        });

        const palletState = reactive<{
            colorPallet: ComputedRef<string[]>;
            palletIndex: number;
        }>({
            colorPallet: getColorPallet, // パレットの色
            palletIndex: 1, // 選択中の色のパレットにおける順番 初期値は2番目
        });

        const selectingPalletState = reactive<{ selectingColor: string }>({
            selectingColor: palletState.colorPallet[palletState.palletIndex], // 選択中の色
        });

        // キャンバスに塗られている色の保存領域
        const canvasColorState = reactive<{
            layerMaxNum: number;
            canvasesData: layerdCanvasData[];
        }>({
            layerMaxNum: 3, // レイヤー数の上限
            canvasesData: getCanvasesIndexData.value, // レイヤーごとのcanvasの描画内容
        });

        // アンドゥ、リドゥに使うキャンバスデータ配列の保存領域
        const undoRedoStackState = reactive<{
            stackMaxSize: number;
            layer: UndoRedoLayer[];
        }>({
            stackMaxSize: 100, // 巻き戻し可能な最大回数の設定
            layer: getUndoRedoDataStack.value,
        });

        const canvasState = reactive<{
            canvas: HTMLCanvasElement | null;
            canvasCtx: CanvasRenderingContext2D | null;
        }>({
            canvas: null, // イラストを描くキャンバス
            canvasCtx: null, // ↑のコンテキスト
        });

        const gridCanvasState = reactive<{
            gridCanvas: HTMLCanvasElement | null;
            gridCanvasCtx: CanvasRenderingContext2D | null;
        }>({
            gridCanvas: null, // グリッド線が描かれたキャンバス
            gridCanvasCtx: null, // ↑のコンテキスト
        });

        const canvasSettingState = reactive<{
            canvasMagnification: ComputedRef<number>;
            canvasRange: ComputedRef<number>;
            canvasStyleSize: number;
            canvasSizeMagnification: number;
            rect: DOMRect | null;
            penMode: string;
            targetLayer: number;
            backGroundColorIndex: number;
            topLayerData: number[];
        }>({
            canvasMagnification: getMagnification, // 表示倍率
            canvasRange: getRange, // キャンバス横幅.縦幅
            canvasStyleSize: 334, // キャンバスの外見上のサイズ
            canvasSizeMagnification: 0.87, // キャンパスの表示倍率 外見上のサイズと整合性つけるため必要
            rect: null, // 要素の寸法とそのビューポートに対する位置
            penMode: 'pen', // ペンのモード
            targetLayer: 0, // 現在どのレイヤーを対象にしているか
            backGroundColorIndex: 0, // 背景色のインデックス
            topLayerData: [], // 各セルで現在表示されている中で最も上のレイヤーを保存する
        });

        // 現在指定しているレイヤーの情報の保存領域
        const canvasTargetLayerState = reactive<{
            canvasTarget: layerdCanvasData;
            undoRedoStackTarget: UndoRedoLayer;
        }>({
            canvasTarget: canvasColorState.canvasesData.find(
                (layer) => layer.layerIndex === canvasSettingState.targetLayer
            )!, // 現在のレイヤーのキャンバス
            undoRedoStackTarget: undoRedoStackState.layer.find(
                (layer) => layer.layerIndex === canvasSettingState.targetLayer
            )!, // 現在のレイヤーのアンドゥ、リドゥ用キャンバスデータ
        });

        const FraggerState = reactive<{
            isDrag: boolean;
            isGrid: boolean;
            pageActive: boolean;
        }>({
            isDrag: false, // ドラッグしているかのフラグ
            isGrid: true, // グリッドの表示の有無のフラグ
            pageActive: false, // 画面が読み込まれたかどうかのフラグ
        });

        const handleTouchMove = (e: UIEvent): void => {
            e.preventDefault();
        };

        onMounted((): void => {
            // ページが立ち上がる時の処理
            // canvasのコンテキスト取得(絵を描く領域)
            canvasState.canvas = document.querySelector('#drowcanvas');
            canvasState.canvasCtx = canvasState.canvas!.getContext('2d');
            // サイズ変更、枠線の追加
            canvasState.canvas!.style.width =
                canvasSettingState.canvasStyleSize + 'px';
            canvasState.canvas!.style.height =
                canvasSettingState.canvasStyleSize + 'px';
            canvasState.canvas!.style.border = '1px solid rgb(0,0,0)';
            // canvasのコンテキスト取得(グリッドの領域)
            gridCanvasState.gridCanvas = document.querySelector('#gridcanvas');
            gridCanvasState.gridCanvasCtx =
                gridCanvasState.gridCanvas!.getContext('2d');
            // サイズの変更、枠線の追加
            gridCanvasState.gridCanvas!.style.width =
                canvasSettingState.canvasStyleSize + 'px';
            gridCanvasState.gridCanvas!.style.height =
                canvasSettingState.canvasStyleSize + 'px';
            gridCanvasState.gridCanvas!.style.border = '1px solid rgb(0, 0, 0)';

            // topLayerData初期化
            for (let x = 0; x < canvasSettingState.canvasRange; x++) {
                for (let y = 0; y < canvasSettingState.canvasRange; y++) {
                    canvasSettingState.topLayerData[
                        y * canvasSettingState.canvasRange + x
                    ] = 999; // 存在しうるレイヤーより大きく設定
                }
            }
            // 初期色での塗りつぶし、グリッドの描画、undo,redo用配列に追加
            redraw();
            drawGrid();
            afterDraw(canvasSettingState.targetLayer);

            // スマホでのタッチ操作でのスクロール禁止
            document.addEventListener('touchmove', handleTouchMove, {
                passive: false,
            });
            FraggerState.pageActive = true;
        });

        // beforeDestory
        onBeforeUnmount((): void => {
            // コンポーネントが破棄される直前の処理
            // スマホでのタッチ操作でのスクロール禁止を解除
            document.removeEventListener('touchmove', handleTouchMove);
        });

        // ペンのモードチェンジ
        const penModeChange = (): void => {
            if (canvasSettingState.penMode === 'pen') {
                canvasSettingState.penMode = 'bucket';
            } else {
                canvasSettingState.penMode = 'pen';
            }
        };

        // クリックしたパレットの色を取得
        const getPalletColor = (newColor: string, newIndex: number): void => {
            selectingPalletState.selectingColor = newColor;
            palletState.palletIndex = newIndex;
        };

        // クリック、タッチした位置のキャンパスにおけるXY座標を返す
        // 引数はマウスの座標
        const getMousePoint = (wholeCoor: Point): Point => {
            canvasSettingState.rect =
                canvasState.canvas!.getBoundingClientRect();
            const coor: Point = {
                X:
                    (wholeCoor.X -
                        (canvasSettingState.rect.x + window.pageXOffset)) /
                    canvasSettingState.canvasSizeMagnification,
                Y:
                    (wholeCoor.Y -
                        (canvasSettingState.rect.y + window.pageYOffset)) /
                    canvasSettingState.canvasSizeMagnification,
            };
            return coor;
        };

        // クリックした位置でドットのグリッドでの現在地を更新する
        // 引数はキャンバスにおけるマウスの座標
        const getCanvasCell = (coor: Point): void => {
            pointState.beforePointed.X = pointState.pointed.X;
            pointState.beforePointed.Y = pointState.pointed.Y;
            pointState.pointed.X = Math.floor(
                coor.X / canvasSettingState.canvasMagnification
            );
            pointState.pointed.Y = Math.floor(
                coor.Y / canvasSettingState.canvasMagnification
            );
        };

        // クリックしたとき（mousedown）
        const onClick = (): void => {
            if (
                !FraggerState.pageActive ||
                !canvasTargetLayerState.canvasTarget.active
            ) {
                return;
            }
            FraggerState.isDrag = true;
            // ペンモードによって処理の変更
            switch (canvasSettingState.penMode) {
                case 'pen':
                    drawDot(pointState.pointed);
                    break;
                case 'bucket':
                    drawFill(pointState.pointed);
            }
        };

        // タッチしたとき（touchstart）
        const onTouch = (e: TouchEvent): void => {
            if (
                !FraggerState.pageActive ||
                !canvasTargetLayerState.canvasTarget.active
            ) {
                return;
            }
            FraggerState.isDrag = true;
            // タッチした座標の取得
            const coor: Point = getMousePoint({
                X: e.touches[0].pageX,
                Y: e.touches[0].pageY,
            });
            // マウスムーブによる座標の獲得がないので、ここでpointed等を更新する
            getCanvasCell(coor);
            // ペンモードによって処理の変更
            switch (canvasSettingState.penMode) {
                case 'pen':
                    drawDot(pointState.pointed);
                    break;
                case 'bucket':
                    drawFill(pointState.pointed);
            }
        };

        // マウス移動時の座標取得(mousemove)
        const onMouseMove = (e: MouseEvent): void => {
            if (
                !FraggerState.pageActive ||
                !canvasTargetLayerState.canvasTarget.active
            ) {
                return;
            }
            // キャンバス内におけるXY座標を取得
            const coor: Point = getMousePoint({ X: e.pageX, Y: e.pageY });
            // ドットのグリッド座標を更新
            getCanvasCell(coor);
            // 描画
            drowing();
        };

        // スワイプ時の座標取得(touchmove)
        const onSwipe = (e: TouchEvent): void => {
            if (
                !FraggerState.pageActive ||
                !canvasTargetLayerState.canvasTarget.active
            ) {
                return;
            }
            // キャンバス内におけるXY座標を取得
            const coor: Point = getMousePoint({
                X: e.touches[0].pageX,
                Y: e.touches[0].pageY,
            });
            // ドットのグリッド座標を更新
            getCanvasCell(coor);
            // 描画
            drowing();
        };

        // 描画終了（mouseup, mouseout, touchend）
        const onDragEnd = (): void => {
            if (
                !FraggerState.pageActive ||
                !canvasTargetLayerState.canvasTarget.active
            ) {
                return;
            }
            // 描画を行っていたときのみ動かす
            if (!FraggerState.isDrag) return;
            afterDraw(canvasSettingState.targetLayer); // undo,redo用配列を追加
            canvasState.canvasCtx!.closePath();
            FraggerState.isDrag = false;
        };

        // 取得した座標から描画を行う
        const drowing = (): void => {
            if (
                !FraggerState.pageActive ||
                !FraggerState.isDrag ||
                !canvasTargetLayerState.canvasTarget.active
            ) {
                return;
            }
            switch (canvasSettingState.penMode) {
                case 'pen':
                    // なめらかな線を描画するためドラッグ時は直線で描く
                    drawLine(pointState.beforePointed, pointState.pointed);
                    break;
                case 'bucket':
                    // FIXME: バケツ中にドラッグしても何も起きない
                    break;
            }
        };

        // 直線を描画する
        // coor1 = 始点のXY座標 coor2 = 終点のXY座標
        const drawLine = (coor1: Point, coor2: Point): void => {
            const xdiff = Math.abs(coor1.X - coor2.X); // X方向の移動距離の絶対値
            const ydiff = Math.abs(coor1.Y - coor2.Y); // Y方向の移動距離の絶対値
            const xdiff2 = xdiff * 2;
            const ydiff2 = ydiff * 2;
            const Xvek = coor2.X > coor1.X ? 1 : -1; // X方向のベクトル
            const Yvek = coor2.Y > coor1.Y ? 1 : -1; // Y方向のベクトル
            const cell: Point = { X: coor1.X, Y: coor1.Y }; // 塗り始めの初期位置
            if (xdiff >= ydiff) {
                // Xに何マス進んだらY方向に1進むか計算し、そこから直線を描画する
                let e = -xdiff;
                for (let i = 0; i <= xdiff; i++) {
                    if (
                        cell.X < 0 ||
                        cell.X >= canvasSettingState.canvasRange ||
                        cell.Y < 0 ||
                        cell.Y >= canvasSettingState.canvasRange
                    )
                        break;
                    drawDot(cell);
                    cell.X += Xvek; // Xが1進む
                    e += ydiff2;
                    if (e >= 0) {
                        cell.Y += Yvek; // Yが1進む
                        e -= xdiff2; // 割り切れない場合を考え端数は切り捨てない
                    }
                }
            } else {
                // 上と同様
                let e = -ydiff;
                for (let i = 0; i <= ydiff; i++) {
                    if (
                        cell.X < 0 ||
                        cell.X >= canvasSettingState.canvasRange ||
                        cell.Y < 0 ||
                        cell.Y >= canvasSettingState.canvasRange
                    )
                        break;
                    drawDot(cell);
                    cell.Y += Yvek;
                    e += xdiff2;
                    if (e >= 0) {
                        cell.X += Xvek;
                        e -= ydiff2;
                    }
                }
            }
        };

        // 指定の座標にドットを1個描画
        const drawDot = (cell: Point): void => {
            const drawDotData = {
                canvasCtx: canvasState.canvasCtx!,
                canvasRange: canvasSettingState.canvasRange,
                canvasIndexData: canvasColorState.canvasesData,
                canvasMagnification: canvasSettingState.canvasMagnification,
                colorPallet: palletState.colorPallet,
                isDrag: FraggerState.isDrag,
                palletIndex: palletState.palletIndex,
                backGroundColorIndex: canvasSettingState.backGroundColorIndex,
                targetLayer: canvasSettingState.targetLayer,
                topLayerData: canvasSettingState.topLayerData,
                targetLayerData: canvasTargetLayerState.canvasTarget,
            };
            useDrawDot(cell, drawDotData);
        };

        // 塗りつぶし
        // 引数は座標から出したドットのマス目の位置
        const drawFill = (cell: Point): void => {
            const fillData = {
                canvasRange: canvasSettingState.canvasRange,
                canvasIndexData: canvasColorState.canvasesData,
                palletIndex: palletState.palletIndex,
                targetLayer: canvasSettingState.targetLayer,
                targetLayerData: canvasTargetLayerState.canvasTarget,
            };
            const color = useDrawFill(cell, fillData);
            fill(cell, color!, canvasTargetLayerState.canvasTarget);
        };

        // 塗りつぶしの再帰処理
        const fill = (
            cell: Point,
            color: number,
            target: layerdCanvasData
        ): void => {
            // 今の選択中の色と同じならキャンセル
            if (color === palletState.palletIndex) {
                return;
            }
            // クリックした場所と違う色に当たるか画面端に到達するまで上下左右に走査し続ける
            if (cell.X >= canvasSettingState.canvasRange || cell.X < 0) return;
            if (cell.Y >= canvasSettingState.canvasRange || cell.Y < 0) return;
            if (
                target!.canvasIndexData[
                    cell.Y * canvasSettingState.canvasRange + cell.X
                ] === color
            ) {
                drawDot({ X: cell.X, Y: cell.Y });
                fill({ X: cell.X - 1, Y: cell.Y }, color, target);
                fill({ X: cell.X + 1, Y: cell.Y }, color, target);
                fill({ X: cell.X, Y: cell.Y - 1 }, color, target);
                fill({ X: cell.X, Y: cell.Y + 1 }, color, target);
            }
        };

        // クリック時に最初に行う処理 クリック前の画面の状態をundo,redo用の配列に格納
        // 引数は対象となるレイヤーの番号
        const afterDraw = (targetLayerNum: number): void => {
            // レイヤー番号から対象レイヤー情報を取得
            const targetLayerData = canvasColorState.canvasesData.find(
                (layer) => layer.layerIndex === targetLayerNum
            )!;
            const undoRedoData = undoRedoStackState.layer.find(
                (layer) => layer.layerIndex === targetLayerNum
            )!;
            const afterDrawData = {
                targetLayerData,
                undoRedoData,
                stackMaxSize: undoRedoStackState.stackMaxSize,
            };
            useAfterDraw(afterDrawData);
        };

        // やり直し(undo)
        const undo = (): void => {
            if (!canvasTargetLayerState.canvasTarget.active) return;
            // 現在の表示内容が配列の先頭であれば処理を終了する
            if (
                canvasTargetLayerState.undoRedoStackTarget.undoRedoDataIndex <=
                0
            ) {
                return;
            }
            // 現在の表示内容の添え字をデクリメントし、それをもとにindexDataを取得して再描画
            layerReDraw(
                canvasTargetLayerState.undoRedoStackTarget.undoRedoDataStack[
                    --canvasTargetLayerState.undoRedoStackTarget
                        .undoRedoDataIndex
                ].indexData
            );
        };

        // やり直しの取り消し(redo)
        const redo = (): void => {
            if (!canvasTargetLayerState.canvasTarget.active) return;
            // 現在の表示内容が配列の末尾であれば処理を終了する
            if (
                canvasTargetLayerState.undoRedoStackTarget.undoRedoDataIndex >=
                canvasTargetLayerState.undoRedoStackTarget.undoRedoDataStack
                    .length -
                    1
            ) {
                return;
            }
            // 現在の表示内容の添え字をインクリメントし、それをもとにindexDataを取得して再描画
            layerReDraw(
                canvasTargetLayerState.undoRedoStackTarget.undoRedoDataStack[
                    ++canvasTargetLayerState.undoRedoStackTarget
                        .undoRedoDataIndex
                ].indexData
            );
        };

        // canvas全体の再描画を行う
        const redraw = (): void => {
            const redrawData = {
                canvasCtx: canvasState.canvasCtx,
                canvasRange: canvasSettingState.canvasRange,
                canvasIndexData: canvasColorState.canvasesData,
                canvasMagnification: canvasSettingState.canvasMagnification,
                colorPallet: palletState.colorPallet,
                backGroundColorIndex: canvasSettingState.backGroundColorIndex,
                topLayerData: canvasSettingState.topLayerData,
            };
            useReDraw(redrawData);
        };
        // 渡されたcanvasのindexdataからレイヤーを変更し、ドット絵を再描画する
        const layerReDraw = (indexData: number[]): void => {
            const redrawData = {
                canvasCtx: canvasState.canvasCtx,
                canvasRange: canvasSettingState.canvasRange,
                canvasIndexData: canvasColorState.canvasesData,
                canvasMagnification: canvasSettingState.canvasMagnification,
                colorPallet: palletState.colorPallet,
                backGroundColorIndex: canvasSettingState.backGroundColorIndex,
                targetLayer: canvasSettingState.targetLayer,
                topLayerData: canvasSettingState.topLayerData,
                targetLayerData: canvasTargetLayerState.canvasTarget,
            };
            useLayerReDraw(redrawData, indexData);
            // FIXME: layerReDrawの中でやっていることはdrawDotの中でやっていることをループしているのとたいしてかわらない
            // drawDotの仕様を変更してここで呼ぶようにした方がいいかも
        };

        // グリッドのON、OFF
        const drawGrid = (): void => {
            FraggerState.isGrid = !FraggerState.isGrid;
            const gridData = {
                gridCanvasCtx: gridCanvasState.gridCanvasCtx!,
                canvasRange: canvasSettingState.canvasRange,
                canvasMagnification: canvasSettingState.canvasMagnification,
                isGrid: FraggerState.isGrid,
            };
            useActiveDrawGrid(gridData);
            // TODO: 単に表示非表示ではなく、パースを整えるための複数パターンのグリッドを出せるようにしたい
        };

        const clockRotateData = {
            canvasRange: canvasSettingState.canvasRange,
            layerData: canvasTargetLayerState.canvasTarget,
        };

        // 時計回り
        const clockRotate = (): void => {
            if (!canvasTargetLayerState.canvasTarget.active) return;
            // FIXME: ここで定義し直さないとレイヤー変更が反映されない いい書き方がわからなかった
            clockRotateData.layerData = canvasTargetLayerState.canvasTarget;
            const { resultIndexData } = useClockRotate(true, clockRotateData);
            // canvasColorState.canvasIndexData = resultIndexData.slice();
            layerReDraw(resultIndexData.slice());
            afterDraw(canvasSettingState.targetLayer);
        };
        // 反時計回り
        const antiClockRotate = (): void => {
            if (!canvasTargetLayerState.canvasTarget.active) return;
            // FIXME: ここで定義し直さないとレイヤー変更が反映されない
            clockRotateData.layerData = canvasTargetLayerState.canvasTarget;
            const { resultIndexData } = useClockRotate(false, clockRotateData);
            // canvasColorState.canvasIndexData = resultIndexData.slice();
            layerReDraw(resultIndexData.slice());
            afterDraw(canvasSettingState.targetLayer);
        };

        // 対象レイヤーの変更
        const layerChange = (target: number): void => {
            if (target >= canvasColorState.canvasesData.length) {
                return;
            } // 存在しないレイヤーに変更される場合中止
            // TODO: activeがfalseのレイヤーに変更される際も中止するべき？
            canvasSettingState.targetLayer = target; // 現在のレイヤーを更新
            canvasTargetLayerState.canvasTarget =
                canvasColorState.canvasesData.find(
                    (layer) =>
                        layer.layerIndex === canvasSettingState.targetLayer
                )!;
            canvasTargetLayerState.undoRedoStackTarget =
                undoRedoStackState.layer.find(
                    (layer) =>
                        layer.layerIndex === canvasSettingState.targetLayer
                )!;
        };
        // レイヤーの追加
        const layerAdd = (): void => {
            if (
                canvasColorState.canvasesData.length >=
                canvasColorState.layerMaxNum
            ) {
                return; // レイヤー数が上限に達している場合、追加をを無効に
                // TODO: アラートを出すかそもそも選択できなくするか
            }
            // 新しいレイヤーを一番下に生成
            const newLayerCanvas: layerdCanvasData = {
                layerName:
                    'レイヤー' + (canvasColorState.canvasesData.length + 1),
                canvasIndexData: [],
                layerIndex: canvasColorState.canvasesData.length,
                active: true,
            };
            // 初期状態は背景色で染める
            for (
                let i = 0;
                i <
                canvasSettingState.canvasRange * canvasSettingState.canvasRange;
                i++
            ) {
                newLayerCanvas.canvasIndexData[i] =
                    canvasSettingState.backGroundColorIndex;
            }
            // レイヤー追加
            canvasColorState.canvasesData.push(newLayerCanvas);
            undoRedoStackState.layer.push({
                undoRedoDataStack: [],
                undoRedoDataIndex: -1,
                layerIndex: canvasColorState.canvasesData.length - 1,
            });
            // アンドゥ、リドゥ用配列の更新
            afterDraw(newLayerCanvas.layerIndex);
            // 全体の再描画
            redraw();
        };
        // 対象レイヤーの削除
        const layerDelete = (target: number): void => {
            if (
                canvasColorState.canvasesData.length === 1 ||
                target >= canvasColorState.canvasesData.length
            ) {
                return; // レイヤーが一個の場合、または存在しない数値が指定された場合削除を無効に
                // TODO: アラートを出すかそもそも選択できなくするか
            }
            // 対象のレイヤーを削除
            canvasColorState.canvasesData =
                canvasColorState.canvasesData.filter(
                    (layer) => layer.layerIndex !== target
                )!;
            undoRedoStackState.layer = undoRedoStackState.layer.filter(
                (layer) => layer.layerIndex !== target
            )!;
            // 消したレイヤーが一番下ではない場合、空いたレイヤー番号を詰める必要がある
            // 消した番号の一個上からループし、一個ずつデクリメントしていく
            if (target! <= canvasColorState.canvasesData.length) {
                for (
                    let i = target + 1;
                    i <= canvasColorState.canvasesData.length;
                    i++
                ) {
                    --canvasColorState.canvasesData.find(
                        (layer) => layer.layerIndex === i
                    )!.layerIndex;
                }
            }
            if (canvasSettingState.targetLayer === target) {
                // 現在のレイヤーを削除する場合、参照先が消えるので現在のレイヤーを変更しておく
                // 対象のレイヤーが一番下だった場合は上のレイヤーに、それ以外なら下に
                if (target >= canvasColorState.canvasesData.length - 1) {
                    layerChange(target - 1);
                } else {
                    layerChange(target);
                }
            }
            // 全体の再描画
            redraw();
        };
        // 対象レイヤーの位置入れ替え
        const layerSwap = (up: boolean, target: number): void => {
            if (
                (up && target === 0) ||
                (!up && target >= canvasColorState.canvasesData.length - 1)
            ) {
                return; // 一番上で上げようとするか、一番下で下げようとしたら無効に
                // TODO: アラートを出すかそもそも選択できなくするか
            }
            // 対象レイヤー
            const targetLayer = canvasColorState.canvasesData.find(
                (layer) => layer.layerIndex === target
            )!;
            // 入れ替えの対象となるレイヤーの番号
            let subTarget = -1;
            // 上げる時は上のレイヤーを下げ、下げるときは上のレイヤーを上げる
            if (up) {
                subTarget = target - 1;
                ++canvasColorState.canvasesData.find(
                    (layer) => layer.layerIndex === subTarget
                )!.layerIndex;
                --targetLayer.layerIndex;
                layerChange(target - 1);
            } else {
                subTarget = target + 1;
                --canvasColorState.canvasesData.find(
                    (layer) => layer.layerIndex === subTarget
                )!.layerIndex;
                ++targetLayer.layerIndex;
                layerChange(target + 1);
                // FIXME: もうちょっとコンパクトに出来そう・・・？
            }
            // 全体の再描画
            redraw();
        };
        // レイヤーの有効化、無効化
        const layerActivate = (target: number): void => {
            if (
                canvasColorState.canvasesData.length === 1 ||
                target >= canvasColorState.canvasesData.length
            ) {
                return; // レイヤーが一個の場合、または存在しない数値が指定された場合削除を無効に
                // TODO: アラートを出すかそもそも選択できなくするか
            }
            // 対象レイヤー
            const targetLayer = canvasColorState.canvasesData.find(
                (layer) => layer.layerIndex === target
            )!;
            // activeを変更
            targetLayer.active = !targetLayer.active;
            // 全体の再描画
            redraw();
        };

        // 画像保存ページへの遷移
        const imageSave = (): void => {
            const saveData = {
                palletName: session.canvasData.palletName,
                colorPallet: palletState.colorPallet,
                canvasName: session.canvasData.canvasName,
                canvasRange: session.canvasData.canvasRange,
                canvasIndexData: canvasColorState.canvasesData,
                canvasMagnification: session.canvasData.canvasMagnification,
                undoRedoDataStack: undoRedoStackState.layer,
            };
            useSaveCanvasData(saveData);
            router.push('/creator/save');
        };

        return {
            // State
            pointState,
            palletState,
            selectingPalletState,
            canvasColorState,
            undoRedoStackState,
            canvasState,
            gridCanvasState,
            canvasSettingState,
            FraggerState,
            // function
            handleTouchMove,
            penModeChange,
            getPalletColor,
            // Event
            onClick,
            onTouch,
            onMouseMove,
            onSwipe,
            onDragEnd,
            // Re
            undo,
            redo,
            drawGrid,
            redraw,
            layerReDraw,
            clockRotate,
            antiClockRotate,
            layerChange,
            layerAdd,
            layerDelete,
            layerSwap,
            layerActivate,
            // End
            imageSave,
        };
    },
});
</script>

<style lang="scss" scoped>
.DrowCanvas {
    position: relative;
    // top: -15px;
    &__Grid {
        position: absolute;
        top: 0;
        // left: 0px;
        left: 50%;
        opacity: 0.5;
        -webkit-transform: translateX(-50%);
        -ms-transform: translateX(-50%);
        transform: translateX(-50%);
    }
    &__Draw {
        position: absolute;
        top: 0;
        left: 50%;
        -webkit-transform: translateX(-50%);
        -ms-transform: translateX(-50%);
        transform: translateX(-50%);
    }
}
.DrowCanvas::before {
    display: block;
    padding-top: 100%;
    content: '';
    @media screen and (min-width: 768px) and (max-width: 1024px) {
        padding-top: 50%;
    }
    @media screen and (min-width: 1024px) {
        padding-top: 50%;
    }
}
</style>

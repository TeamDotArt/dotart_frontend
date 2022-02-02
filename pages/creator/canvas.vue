<template>
    <v-main class="pa-0 content">
        <v-layout style="height: 90vh" column justify-center fluid>
            <v-flex xs12 sm12 md12>
                <div id="layout" class="Layout">
                    <div class="canvasArea">
                        <div class="DrowCanvas">
                            <div class="DrowCanvas__Draw">
                                <canvas
                                    id="drowcanvas"
                                    class="drowCanvas"
                                    width="384px"
                                    height="384px"
                                ></canvas>
                            </div>
                            <div class="DrowCanvas__Grid">
                                <canvas
                                    id="gridcanvas"
                                    class="gridCanvas"
                                    width="383px"
                                    height="383px"
                                ></canvas>
                            </div>
                            <div class="DrowCanvas__Draw">
                                <canvas
                                    id="canvasDummy"
                                    class="canvasDummy"
                                    @mousedown="onClick"
                                    @mouseup="onDragEnd"
                                    @mouseout="onDragEnd"
                                    @mousemove="onMouseMove"
                                    @touchstart="onTouch"
                                    @touchmove="onSwipe"
                                    @touchend="onDragEnd"
                                ></canvas>
                                <img
                                    v-if="smartModeToggle"
                                    id="cursor"
                                    :src="require('@/assets/cursor.svg')"
                                    class="cursor"
                                />
                            </div>
                        </div>
                    </div>
                    <div class="toolArea">
                        <div class="toolWrapper">
                            <canvas-button-area
                                class="canvasButtonArea"
                                :undo-event="undo"
                                :redo-event="redo"
                                :grid-event="drawGrid"
                                :save-event="imageSave"
                                :pen-mode-change-event="penModeChange"
                                :pen-mode="canvasSettingState.penMode"
                                :setting-drawer-transrate="
                                    settingDrawerTransrate
                                "
                                :pallet-drawer-transrate="palletDrawerTransrate"
                                :layer-drawer-transrate="layerDrawerTransrate"
                                :smart-mode="smartModeToggle"
                                :selecting-color="
                                    selectingPalletState.selectingColor
                                "
                                :smart-draw-start="smartDrawStart"
                                :smart-draw-end="smartDrawEnd"
                            />
                            <div class="windowArea">
                                <pallet-window
                                    class="palletWindow"
                                    :color-pallet="palletState.colorPallet"
                                    :first-pallet-index="
                                        palletState.palletIndex
                                    "
                                    :pallet-index="palletState.palletIndex"
                                    :get-pallet-color="getPalletColor"
                                    :pallet-drawer-flg="
                                        mobileState.palletDrawerFlg
                                    "
                                    :selected-index="palletState.palletIndex"
                                >
                                </pallet-window>
                                <layer-list
                                    class="layerWindow"
                                    :layer-swap="layerSwap"
                                    :layer-change="layerChange"
                                    :layer-delete="layerDelete"
                                    :layer-activate="layerActivate"
                                    :layer-add="layerAdd"
                                    :canvases-data="
                                        canvasColorState.canvasesData
                                    "
                                    :canvas-target="
                                        canvasTargetLayerState.canvasTarget
                                            .layerIndex
                                    "
                                ></layer-list>
                            </div>
                        </div>
                    </div>
                </div>
                <layer-drawer
                    :layer-swap="layerSwap"
                    :layer-change="layerChange"
                    :layer-delete="layerDelete"
                    :layer-activate="layerActivate"
                    :layer-add="layerAdd"
                    :canvases-data="canvasColorState.canvasesData"
                    :canvas-target="
                        canvasTargetLayerState.canvasTarget.layerIndex
                    "
                    :layer-drawer-flg="mobileState.layerDrawerFlg"
                    :layer-drawer-transrate="layerDrawerTransrate"
                ></layer-drawer>
                <pallet-drawer
                    :color-pallet="palletState.colorPallet"
                    :first-pallet-index="palletState.palletIndex"
                    :pallet-index="palletState.palletIndex"
                    :get-pallet-color="getPalletColor"
                    :pallet-drawer-flg="mobileState.palletDrawerFlg"
                    :pallet-drawer-transrate="palletDrawerTransrate"
                    :selected-index="palletState.palletIndex"
                ></pallet-drawer>
                <setting-drawer
                    :setting-drawer-flg="mobileState.settingDrawerFlg"
                    :setting-drawer-transrate="settingDrawerTransrate"
                ></setting-drawer>
            </v-flex>
        </v-layout>
    </v-main>
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
import useMakeLine from '@/composables/useMakeLine';
import useScrollBan from '@/composables/useScrollBan';
import usePageMove from '@/composables/usePageMove';
import usePenModeChange from '@/composables/usePenModeChange';

// components
import LayerList from '@/components/Molecules/LayerList.vue';
import PalletWindow from '@/components/Molecules/PalletWindow.vue';
import layerDrawer from '@/components/Molecules/layerDrawer.vue';
import palletDrawer from '@/components/Molecules/palletDrawer.vue';
import settingDrawer from '@/components/Molecules/settingDrawer.vue';
import CanvasButtonArea from '@/components/Molecules/CanvasButtonArea.vue';
import { SettingModule } from '@/store/modules/setting';

// constants
import { constants } from '@/common/constants';

// TODO: 設定のtoggleSwitchの取得用
// import { SettingModule } from '~/store/modules/setting';

const statingArray: number[] = [];
export default defineComponent({
    name: 'CanvasPage',
    components: {
        LayerList,
        PalletWindow,
        CanvasButtonArea,
        layerDrawer,
        palletDrawer,
        settingDrawer,
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

        const smartModeToggle = computed((): boolean => {
            return SettingModule.smartphoneMode;
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
            layerMaxNum: constants.LAYER_MAX_NUM, // レイヤー数の上限
            canvasesData: getCanvasesIndexData.value, // レイヤーごとのcanvasの描画内容
        });

        // アンドゥ、リドゥに使うキャンバスデータ配列の保存領域
        const undoRedoStackState = reactive<{
            stackMaxSize: number;
            layer: UndoRedoLayer[];
        }>({
            stackMaxSize: constants.STACK_MAX_SIZE_NUM, // 巻き戻し可能な最大回数の設定
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
            rect: DOMRect | null;
            penMode: string;
            targetLayer: number;
            backGroundColorIndex: number;
            topLayerData: number[];
        }>({
            canvasMagnification: getMagnification, // 表示倍率
            canvasRange: getRange, // キャンバス横幅.縦幅
            rect: null, // 要素の寸法とそのビューポートに対する位置
            penMode: constants.PEN_MODE.pen, // ペンのモード
            targetLayer: constants.DEFAULT_TARGET_LAYER, // 現在どのレイヤーを対象にしているか 初期値0
            backGroundColorIndex: constants.BACKGROUND_COLOR_INDEX, // 背景色のインデックス TODO:可変になる予定
            topLayerData: statingArray, // 各セルで現在表示されている中で最も上のレイヤーを保存する
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

        //
        const figureToolsState = reactive<{
            drawingFigure: Point[];
            figureToolsStart: Point;
        }>({
            drawingFigure: [], // 図形描画ツールで描画している図形の一時保存領域
            figureToolsStart: constants.FIGURE_TOOLS_START, // 図形描画の開始位置
        });

        const FraggerState = reactive<{
            isDrag: boolean;
            isGrid: boolean;
            pageActive: boolean;
        }>({
            isDrag: false, // ドラッグしているかのフラグ
            isGrid: false, // グリッドの表示の有無のフラグ
            pageActive: false, // 画面が読み込まれたかどうかのフラグ
        });

        const mobileState = reactive<{
            palletDrawerFlg: boolean;
            layerDrawerFlg: boolean;
            settingDrawerFlg: boolean;
            smartMode: boolean;
            mobileView: boolean;
            windowWidth: number;
            SwipingFlg: boolean;
            beforetouch: Point;
            cursorPoint: Point;
        }>({
            palletDrawerFlg: false, // スマホ画面でのパレットメニュー開閉フラグ
            layerDrawerFlg: false, // スマホ画面でのレイヤーメニュー開閉フラグ
            settingDrawerFlg: false,
            smartMode: SettingModule.smartphoneMode, // スマホモードのフラグ
            mobileView: false,
            windowWidth: 0,
            SwipingFlg: false,
            beforetouch: { X: 0, Y: 0 },
            cursorPoint: { X: 0, Y: 0 },
        });

        // クリックした場所のクラス名を配列で取得
        const getClassNames = (element: any): string[] => {
            if (typeof element.className === 'string') {
                return element ? element.className.split(' ') : [];
            } else {
                return [];
            }
        };
        // スクロール規制
        const handleTouchMove = (e: UIEvent): void => {
            if (getClassNames(e.target).includes('canScroll')) {
                e.stopPropagation();
            } else {
                e.preventDefault();
            }
        };
        // タッチスクリーン有無判定
        const isTouchDevice = (): boolean => {
            return 'ontouchstart' in window;
        };
        // セーフティ タブレット以下の端末でスクロールが発生したら強制的に元に戻す
        // これが動いている状態はバグであるということを留意！
        const scrollCancel = (_e: Event): void => {
            if (mobileState.windowWidth < 960) {
                window.scrollTo({ top: 0 });
            }
        };

        const scrollControl = (target: Element): void => {
            if (target.scrollTop === 0) {
                target.scrollTop = 1;
            } else if (
                target.scrollTop + target.clientHeight ===
                target.scrollHeight
            ) {
                target.scrollTop = target.scrollTop - 1;
            }
        };

        // スマホモード時に画面内をタップしたとき
        const smartModeTouchStart = (e: TouchEvent): void => {
            if (smartModeToggle.value) {
                if (!mobileState.SwipingFlg) {
                    mobileState.SwipingFlg = !(
                        getClassNames(e.target).includes('canScroll') ||
                        getClassNames(e.target).includes('smartButton')
                    );
                    if (mobileState.SwipingFlg) {
                        mobileState.beforetouch = {
                            X: e.changedTouches[0].pageX,
                            Y: e.changedTouches[0].pageY,
                        };
                    }
                }
            }
        };
        // スマホモード時に画面内をスワイプしたとき
        const smartModeTouchMove = (e: TouchEvent): void => {
            if (smartModeToggle.value) {
                if (!getClassNames(e.target).includes('smartButton')) {
                    // カーソルとキャンバスのrect取得
                    const cursor =
                        document.querySelector<HTMLElement>('#cursor')!;
                    canvasSettingState.rect =
                        canvasState.canvas!.getBoundingClientRect();
                    if (smartModeToggle.value && mobileState.SwipingFlg) {
                        // 移動量を取得
                        const moveValue: Point = {
                            X:
                                e.changedTouches[0].pageX -
                                mobileState.beforetouch.X,
                            Y:
                                e.changedTouches[0].pageY -
                                mobileState.beforetouch.Y,
                        };
                        // はみ出していたら範囲内に強制
                        if (mobileState.cursorPoint.X + moveValue.X < 1) {
                            mobileState.cursorPoint.X = 1;
                        } else if (
                            mobileState.cursorPoint.X + moveValue.X >
                            canvasSettingState.rect.width - 1
                        ) {
                            mobileState.cursorPoint.X =
                                canvasSettingState.rect.width - 1;
                        } else {
                            mobileState.cursorPoint.X += moveValue.X;
                        }
                        // Y座標も同様
                        if (mobileState.cursorPoint.Y + moveValue.Y < 1) {
                            mobileState.cursorPoint.Y = 1;
                        } else if (
                            mobileState.cursorPoint.Y + moveValue.Y >
                            canvasSettingState.rect.height - 1
                        ) {
                            mobileState.cursorPoint.Y =
                                canvasSettingState.rect.height - 1;
                        } else {
                            mobileState.cursorPoint.Y += moveValue.Y;
                        }
                        // カーソルを移動
                        cursor.style.marginLeft =
                            mobileState.cursorPoint.X + 'px';
                        cursor.style.marginTop =
                            mobileState.cursorPoint.Y + 'px';
                        // 前の位置として保存
                        mobileState.beforetouch = {
                            X: e.changedTouches[0].pageX,
                            Y: e.changedTouches[0].pageY,
                        };
                        // ドットのグリッド座標を更新
                        canvasSettingState.rect =
                            canvasState.canvas!.getBoundingClientRect();
                        const coor: Point = getMousePoint({
                            X:
                                mobileState.cursorPoint.X +
                                (canvasSettingState.rect.x +
                                    window.pageXOffset),
                            Y:
                                mobileState.cursorPoint.Y +
                                (canvasSettingState.rect.y +
                                    window.pageYOffset),
                        });
                        getCanvasCell(coor);
                        // 描画
                        drowing();
                    }
                }
            }
        };
        // スマホモード時に手を離したとき
        const smartModeTouchEnd = (e: TouchEvent): void => {
            if (
                !getClassNames(e.target).includes('smartButton') &&
                smartModeToggle.value
            ) {
                mobileState.SwipingFlg = false;
            }
        };
        // スマホモードの描画ボタンを推したとき
        const smartDrawStart = (): void => {
            if (smartModeToggle.value) {
                FraggerState.isDrag = true;
                canvasSettingState.rect =
                    canvasState.canvas!.getBoundingClientRect();
                const coor: Point = getMousePoint({
                    X:
                        mobileState.cursorPoint.X +
                        (canvasSettingState.rect.x + window.pageXOffset),
                    Y:
                        mobileState.cursorPoint.Y +
                        (canvasSettingState.rect.y + window.pageYOffset),
                });
                getCanvasCell(coor);
                // ペンモードによって処理の変更
                switch (canvasSettingState.penMode) {
                    case constants.PEN_MODE.pen:
                        drawDot(pointState.pointed);
                        break;
                    case constants.PEN_MODE.bucket:
                        drawFill(pointState.pointed);
                        break;
                    case constants.PEN_MODE.stroke:
                        // 直線ツールの初期位置を設定
                        figureToolsState.figureToolsStart = Object.assign(
                            {},
                            pointState.pointed
                        );
                        makeLine(
                            figureToolsState.figureToolsStart,
                            pointState.pointed
                        );
                        break;
                    case constants.PEN_MODE.eraser:
                        drawDot(pointState.pointed);
                        break;
                }
            }
        };
        // スマホモードの描画ボタンを離したとき
        const smartDrawEnd = (): void => {
            if (smartModeToggle.value) {
                // 描画を行っていたときのみ動かす
                if (!FraggerState.isDrag) return;
                // 直線ツール描画
                if (canvasSettingState.penMode === constants.PEN_MODE.stroke) {
                    drawLine(
                        figureToolsState.figureToolsStart,
                        pointState.pointed
                    );
                    resetGrid();
                }
                afterDraw(canvasSettingState.targetLayer); // undo,redo用配列を追加
                canvasState.canvasCtx!.closePath();
                FraggerState.isDrag = false;
            }
        };
        // 現在モバイル表示かどうかを判別する関数
        const calculateWindowWidth = () => {
            mobileState.windowWidth = window.innerWidth;
            mobileState.mobileView = mobileState.windowWidth < 601;
            if (!mobileState.mobileView) {
                SettingModule.setReverseSmartPhoneMode(false);
            }
            // タブレットの縦横が変わったときスクロール位置がリセットされてバグるため再設定
            const palletArea = document.querySelector('#palletArea')!;
            const layerWindow = document.querySelector('#layerList')!;
            const palletDrawer = document.querySelector('#palletArea')!;
            const layerDrawer = document.querySelector('#layerDrawer')!;
            palletArea.scrollTop = 1;
            layerWindow.scrollTop = 1;
            palletDrawer.scrollTop = 1;
            layerDrawer.scrollTop = 1;
            return mobileState.mobileView;
        };

        onMounted((): void => {
            // ページが立ち上がる時の処理
            // canvasのコンテキスト取得(絵を描く領域)
            canvasState.canvas = document.querySelector('#drowcanvas');
            canvasState.canvasCtx = canvasState.canvas!.getContext('2d');
            canvasState.canvas!.style.border = '1px solid rgb(0,0,0)';
            // canvasのコンテキスト取得(グリッドの領域)
            gridCanvasState.gridCanvas = document.querySelector('#gridcanvas');
            gridCanvasState.gridCanvasCtx =
                gridCanvasState.gridCanvas!.getContext('2d');
            gridCanvasState.gridCanvas!.style.border = '1px solid rgb(0, 0, 0)';

            // topLayerData初期化
            for (let x = 0; x < canvasSettingState.canvasRange; x++) {
                for (let y = 0; y < canvasSettingState.canvasRange; y++) {
                    canvasSettingState.topLayerData[
                        y * canvasSettingState.canvasRange + x
                    ] = canvasColorState.layerMaxNum + 10; // 存在しうるレイヤーより大きく設定
                }
            }
            // 初期色での塗りつぶし、グリッドの描画、undo,redo用配列に追加
            redraw();
            drawGrid();
            if (
                canvasTargetLayerState.undoRedoStackTarget.undoRedoDataStack
                    .length === 0
            ) {
                afterDraw(canvasSettingState.targetLayer);
            }
            mobileState.windowWidth = window.innerWidth;

            // スマホでのタッチ操作でのスクロール禁止
            // スクロールを行う部分の取得
            const palletArea = document.querySelector('#palletArea')!;
            const layerWindow = document.querySelector('#layerList')!;
            const palletDrawer = document.querySelector('#palletDrawer')!;
            const layerDrawer = document.querySelector('#layerDrawer')!;
            const scrollBanStatus = {
                palletArea,
                layerWindow,
                palletDrawer,
                layerDrawer,
                handleTouchMove,
                scrollControl,
                scrollCancel,
                smartModeTouchStart,
                smartModeTouchMove,
                smartModeTouchEnd,
                windowWidth: mobileState.windowWidth,
            };
            useScrollBan(scrollBanStatus);
            document.addEventListener('touchstart', smartModeTouchStart, {
                passive: false,
            });
            document.addEventListener('touchmove', smartModeTouchMove, {
                passive: false,
            });
            document.addEventListener('touchend', smartModeTouchEnd, {
                passive: false,
            });

            // ページのアクティブ化
            FraggerState.pageActive = true;
            // 画面サイズ変更時にスマホ表示かどうかを判別する
            window.addEventListener('resize', calculateWindowWidth);
        });

        // beforeDestory
        onBeforeUnmount((): void => {
            // コンポーネントが破棄される直前の処理
            // スマホでのタッチ操作でのスクロール禁止を解除
            const palletArea = document.querySelector('#palletArea')!;
            const layerWindow = document.querySelector('#layerList')!;
            const palletDrawer = document.querySelector('#palletDrawer')!;
            const layerDrawer = document.querySelector('#layerDrawer')!;
            const pageMoveStatus = {
                palletArea,
                layerWindow,
                palletDrawer,
                layerDrawer,
                handleTouchMove,
                scrollControl,
                scrollCancel,
                smartModeTouchStart,
                smartModeTouchMove,
                smartModeTouchEnd,
                windowWidth: mobileState.windowWidth,
            };
            usePageMove(pageMoveStatus);
            // TODO:ファイル分け
        });

        // ペンのモードチェンジ
        const penModeChange = (mode: string): void => {
            const penModeChange = {
                selectMode: mode,
                nowMode: canvasSettingState.penMode,
                penMode: constants.PEN_MODE,
            };
            canvasSettingState.penMode = usePenModeChange(penModeChange)!;
        };

        // クリックしたパレットの色を取得
        const getPalletColor = (newColor: string, newIndex: number): void => {
            selectingPalletState.selectingColor = newColor;
            palletState.palletIndex = newIndex;
            // 消しゴムだったときはペンに変更させる
            if (canvasSettingState.penMode === constants.PEN_MODE.eraser) {
                canvasSettingState.penMode = constants.PEN_MODE.pen;
            }
        };

        // クリック、タッチした位置のキャンパスにおけるXY座標を返す
        // 引数はマウスの座標
        const getMousePoint = (wholeCoor: Point): Point => {
            // キャンバスのサイズと表示サイズとの差を計算
            const canvasSizeMagnification =
                canvasState.canvas!.clientWidth / canvasState.canvas!.width;
            canvasSettingState.rect =
                canvasState.canvas!.getBoundingClientRect();
            const coor: Point = {
                X:
                    (wholeCoor.X -
                        (canvasSettingState.rect.x + window.pageXOffset)) /
                    canvasSizeMagnification,
                Y:
                    (wholeCoor.Y -
                        (canvasSettingState.rect.y + window.pageYOffset)) /
                    canvasSizeMagnification,
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
            if (isTouchDevice()) {
                return;
            }
            if (isTouchDevice() && smartModeToggle.value) {
                return;
            }
            FraggerState.isDrag = true;
            // ペンモードによって処理の変更
            switch (canvasSettingState.penMode) {
                case constants.PEN_MODE.pen:
                    drawDot(pointState.pointed);
                    break;
                case constants.PEN_MODE.bucket:
                    drawFill(pointState.pointed);
                    break;
                case constants.PEN_MODE.stroke:
                    // 直線ツールの初期位置を設定
                    figureToolsState.figureToolsStart = Object.assign(
                        {},
                        pointState.pointed
                    );
                    makeLine(
                        figureToolsState.figureToolsStart,
                        pointState.pointed
                    );
                    break;
                case constants.PEN_MODE.eraser:
                    drawDot(pointState.pointed);
                    break;
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
            if (isTouchDevice() && smartModeToggle.value) {
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
                case constants.PEN_MODE.pen:
                    drawDot(pointState.pointed);
                    break;
                case constants.PEN_MODE.bucket:
                    drawFill(pointState.pointed);
                    break;
                case constants.PEN_MODE.stroke:
                    // 直線ツールの初期位置を設定
                    figureToolsState.figureToolsStart = Object.assign(
                        {},
                        pointState.pointed
                    );
                    // makeLine(
                    //     figureToolsState.figureToolsStart,
                    //     pointState.pointed
                    // );
                    break;
                case constants.PEN_MODE.eraser:
                    // drawDot(pointState.pointed);
                    break;
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
            if (isTouchDevice() && smartModeToggle.value) {
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
        const onDragEnd = (e: Event): void => {
            if (
                !FraggerState.pageActive ||
                !canvasTargetLayerState.canvasTarget.active
            ) {
                return;
            }
            if (isTouchDevice() && e.type === 'mouseup') {
                return;
            }
            if (isTouchDevice() && smartModeToggle.value) {
                return;
            }

            // 描画を行っていたときのみ動かす
            if (!FraggerState.isDrag) return;
            // 直線ツール描画
            if (canvasSettingState.penMode === constants.PEN_MODE.stroke) {
                drawLine(figureToolsState.figureToolsStart, pointState.pointed);
                resetGrid();
            }
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
                case constants.PEN_MODE.pen:
                    // なめらかな線を描画するためドラッグ時は直線で描く
                    drawLine(pointState.beforePointed, pointState.pointed);
                    break;
                case constants.PEN_MODE.bucket:
                    // FIXME: バケツ中にドラッグしても何も起きない
                    break;
                case constants.PEN_MODE.stroke:
                    makeLine(
                        figureToolsState.figureToolsStart,
                        pointState.pointed
                    );
                    break;
                case constants.PEN_MODE.eraser:
                    // なめらかな線を描画するためドラッグ時は直線で描く
                    drawLine(pointState.beforePointed, pointState.pointed);
                    break;
            }
        };

        // 二点間を結ぶ直線を描画する
        // coor1 = 始点のXY座標 coor2 = 終点のXY座標
        const drawLine = (coor1: Point, coor2: Point): void => {
            const drawLineData = {
                startCell: coor1,
                endCell: coor2,
                canvasRange: canvasSettingState.canvasRange,
            };
            drawFigure(useMakeLine(drawLineData)); // 直線生成
        };

        // 直線ツールでの描画時に見た目上だけの直線を表示するための関数
        // startCell = 始点のXY座標 endCell = 終点のXY座標
        const makeLine = (startCell: Point, endCell: Point): void => {
            const drawLineData = {
                startCell,
                endCell,
                canvasRange: canvasSettingState.canvasRange,
            };
            resetGrid(); // グリッドのリセット
            // 直線を生成し、描画中の図形として保存
            figureToolsState.drawingFigure = useMakeLine(drawLineData);
            // グリッドのキャンバスのパスをリセット
            gridCanvasState.gridCanvasCtx!.beginPath();
            gridCanvasState.gridCanvasCtx!.globalCompositeOperation =
                'source-over';
            // 色の取得
            gridCanvasState.gridCanvasCtx!.fillStyle =
                palletState.colorPallet[palletState.palletIndex];
            figureToolsState.drawingFigure.map((value) => {
                // グリッドのキャンバスに描画
                return gridCanvasState.gridCanvasCtx!.fillRect(
                    value.X * canvasSettingState.canvasMagnification,
                    value.Y * canvasSettingState.canvasMagnification,
                    canvasSettingState.canvasMagnification,
                    canvasSettingState.canvasMagnification
                );
            });
        };

        // 指定された図形を現在のパレットカラーで描画する関数
        // figure = 対象の図形
        const drawFigure = (figure: Point[]): void => {
            figure.map((value) => {
                return drawDot(value);
            });
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
            // 消しゴムツールの時は背景色で描くようにする
            if (canvasSettingState.penMode === constants.PEN_MODE.eraser) {
                drawDotData.palletIndex =
                    canvasSettingState.backGroundColorIndex;
            }

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
                layerMaxNum: canvasColorState.layerMaxNum,
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

        // グリッドのリセット
        // gridCanvasに一時的に表示する処理はおそらく使うので処理を別にする
        const resetGrid = (): void => {
            // いったんgridcanvasの削除
            let gridData = {
                gridCanvasCtx: gridCanvasState.gridCanvasCtx!,
                canvasRange: canvasSettingState.canvasRange,
                canvasMagnification: canvasSettingState.canvasMagnification,
                isGrid: false,
            };
            useActiveDrawGrid(gridData);
            // グリッドがオンならグリッドを再描画
            if (FraggerState.isGrid) {
                gridData = {
                    gridCanvasCtx: gridCanvasState.gridCanvasCtx!,
                    canvasRange: canvasSettingState.canvasRange,
                    canvasMagnification: canvasSettingState.canvasMagnification,
                    isGrid: true,
                };
                useActiveDrawGrid(gridData);
            }
        };

        const clockRotateData = {
            canvasRange: canvasSettingState.canvasRange,
            layerData: canvasTargetLayerState.canvasTarget,
        };

        // 時計回り
        const clockRotate = (): void => {
            if (!canvasTargetLayerState.canvasTarget.active) return;
            // ここで定義し直さないとレイヤー変更が反映されない
            clockRotateData.layerData = canvasTargetLayerState.canvasTarget;
            const { resultIndexData } = useClockRotate(true, clockRotateData);
            // canvasColorState.canvasIndexData = resultIndexData.slice();
            layerReDraw(resultIndexData.slice());
            afterDraw(canvasSettingState.targetLayer);
        };
        // 反時計回り
        const antiClockRotate = (): void => {
            if (!canvasTargetLayerState.canvasTarget.active) return;
            // ここで定義し直さないとレイヤー変更が反映されない
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
            // スクロール対策
            const layerDrawer = document.querySelector('#layerDrawer')!;
            if (layerDrawer.scrollTop === 0) {
                layerDrawer.scrollTop = 1;
            }
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
                    --undoRedoStackState.layer.find(
                        (layer) => layer.layerIndex === i
                    )!.layerIndex;
                }
            }
            // 消したのが選択中のレイヤーより下なら対象レイヤーのインデックスをデクリメント
            if (canvasSettingState.targetLayer > target) {
                --canvasSettingState.targetLayer;
            }
            if (canvasSettingState.targetLayer === target) {
                // 現在のレイヤーを削除する場合、参照先が消えるので現在のレイヤーを変更しておく
                // 対象のレイヤーが一番下だった場合は上のレイヤーに、それ以外なら下に
                if (target > canvasColorState.canvasesData.length - 1) {
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
            const targetLayerUndoRedo = undoRedoStackState.layer.find(
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
                ++undoRedoStackState.layer.find(
                    (layer) => layer.layerIndex === subTarget
                )!.layerIndex;
                --targetLayer.layerIndex;
                --targetLayerUndoRedo.layerIndex;
                layerChange(target - 1);
            } else {
                subTarget = target + 1;
                --canvasColorState.canvasesData.find(
                    (layer) => layer.layerIndex === subTarget
                )!.layerIndex;
                --undoRedoStackState.layer.find(
                    (layer) => layer.layerIndex === subTarget
                )!.layerIndex;
                ++targetLayer.layerIndex;
                ++targetLayerUndoRedo.layerIndex;
                layerChange(target + 1);
            }
            // 全体の再描画
            redraw();
            layerSort();
        };
        // レイヤーの有効化、無効化
        const layerActivate = (target: number): void => {
            if (target >= canvasColorState.canvasesData.length) {
                return; // 存在しない数値が指定された場合削除を無効に
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
        // レイヤーを重ねた順に並び変える関数
        const layerSort = (): void => {
            canvasColorState.canvasesData = canvasColorState.canvasesData.sort(
                (a, b) => {
                    return a.layerIndex - b.layerIndex;
                }
            );
        };

        // ドロワー関連のメソッド群
        const palletDrawerTransrate = (): void => {
            mobileState.palletDrawerFlg = !mobileState.palletDrawerFlg;
        };
        const layerDrawerTransrate = (): void => {
            mobileState.layerDrawerFlg = !mobileState.layerDrawerFlg;
        };
        const settingDrawerTransrate = (): void => {
            mobileState.settingDrawerFlg = !mobileState.settingDrawerFlg;
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
            canvasTargetLayerState,
            mobileState,
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
            smartDrawStart,
            smartDrawEnd,
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
            layerSort,
            palletDrawerTransrate,
            layerDrawerTransrate,
            settingDrawerTransrate,
            // End
            imageSave,
            smartModeToggle,
        };
    },
});
</script>

<style lang="scss" scoped>
@import 'canvas.scss';
</style>

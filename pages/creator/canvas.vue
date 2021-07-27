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
                                <canvas id="drowcanvas" width="384px" height="384px"></canvas>
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
import { Stack } from '@/types/Canvas/StackType';
import { CanvasDataModule } from '@/store/modules/canvasData';
import ButtonArea from '@/components/Molecules/ButtonArea.vue';
import PalletArea from '@/components/Molecules/PalletArea.vue';
// import MainMenu from '@/components/Organisms/MainMenu.vue';

export default defineComponent({
    name: 'canvasPage',
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

        const getCanvasIndexData = computed((): number[] => {
            return session.canvasData.canvasIndexData;
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
            canvasIndexData: ComputedRef<number[]>;
        }>({
            canvasIndexData: getCanvasIndexData, // 選択中の色
        });

        const undoRedoStackState = reactive<{
            stackMaxSize: number;
            undoRedoDataStack: Stack[];
            undoRedoDataIndex: number;
        }>({
            stackMaxSize: 100, // 巻き戻し可能な最大回数の設定
            undoRedoDataStack: [], // undo,redoに使う画面データの配列
            undoRedoDataIndex: -1, // ↑の、「現在表示している画面のデータ」が格納されている部分の添え字を示す
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
        }>({
            canvasMagnification: getMagnification, // 表示倍率
            canvasRange: getRange, // キャンバス横幅.縦幅
            canvasStyleSize: 334, // キャンバスの外見上のサイズ
            canvasSizeMagnification: 0.87, // キャンパスの表示倍率 外見上のサイズと整合性つけるため必要
            rect: null, // 要素の寸法とそのビューポートに対する位置
            penMode: 'pen', // ペンのモード
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

            // 初期色での塗りつぶし、グリッドの描画、undo,redo用配列に追加
            redraw(canvasColorState.canvasIndexData);
            drawGrid();
            afterDraw();

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
            if (!FraggerState.pageActive) {
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
            if (!FraggerState.pageActive) {
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
            if (!FraggerState.pageActive) {
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
            if (!FraggerState.pageActive) {
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
            if (!FraggerState.pageActive) {
                return;
            }
            // 描画を行っていたときのみ動かす
            if (!FraggerState.isDrag) return;
            afterDraw(); // undo,redo用配列を追加
            canvasState.canvasCtx!.closePath();
            FraggerState.isDrag = false;
        };

        // 取得した座標から描画を行う
        const drowing = (): void => {
            if (!FraggerState.pageActive || !FraggerState.isDrag) {
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
            canvasState.canvasCtx!.beginPath();
            if (!FraggerState.isDrag) {
                return;
            }
            // 該当の座標に色を塗るだけ
            canvasState.canvasCtx!.fillStyle =
                selectingPalletState.selectingColor;
            canvasState.canvasCtx!.fillRect(
                cell.X * canvasSettingState.canvasMagnification,
                cell.Y * canvasSettingState.canvasMagnification,
                canvasSettingState.canvasMagnification,
                canvasSettingState.canvasMagnification
            );
            // 塗った色のデータを反映させる
            canvasColorState.canvasIndexData[
                cell.Y * canvasSettingState.canvasRange + cell.X
            ] = palletState.palletIndex;
        };

        // 塗りつぶし
        // 引数は座標から出したドットのマス目の位置
        const drawFill = (cell: Point): void => {
            // クリックした位置の色のindexを取得
            const color =
                canvasColorState.canvasIndexData[
                    cell.Y * canvasSettingState.canvasRange + cell.X
                ];
            // 今の選択中の色と同じならキャンセル
            if (color === palletState.palletIndex) {
                return;
            }
            // 再帰処理を読んで走査
            fill(cell, color);
        };

        // 塗りつぶしの再帰処理
        const fill = (cell: Point, color: number): void => {
            // 今の選択中の色と同じならキャンセル
            if (color === palletState.palletIndex) {
                return;
            }
            // クリックした場所と違う色に当たるか画面端に到達するまで上下左右に走査し続ける
            if (cell.X >= canvasSettingState.canvasRange || cell.X < 0) return;
            if (cell.Y >= canvasSettingState.canvasRange || cell.Y < 0) return;
            if (
                canvasColorState.canvasIndexData[
                    cell.Y * canvasSettingState.canvasRange + cell.X
                ] === color
            ) {
                drawDot({ X: cell.X, Y: cell.Y });
                fill({ X: cell.X - 1, Y: cell.Y }, color);
                fill({ X: cell.X + 1, Y: cell.Y }, color);
                fill({ X: cell.X, Y: cell.Y - 1 }, color);
                fill({ X: cell.X, Y: cell.Y + 1 }, color);
            }
        };

        // クリック時に最初に行う処理 やり直しのためのデータを処理する
        const afterDraw = (): void => {
            // やり直しをした後だった場合、現在の表示内容以降のデータは削除
            if (
                undoRedoStackState.undoRedoDataIndex <
                undoRedoStackState.undoRedoDataStack.length - 1
            ) {
                undoRedoStackState.undoRedoDataStack.splice(
                    undoRedoStackState.undoRedoDataIndex + 1
                );
            }
            // 巻き戻し最大回数より多かったら先頭を削除、そうでなければ追加
            if (
                undoRedoStackState.undoRedoDataIndex >=
                undoRedoStackState.stackMaxSize
            ) {
                undoRedoStackState.undoRedoDataStack.shift();
            } else {
                ++undoRedoStackState.undoRedoDataIndex;
            }
            // データのプッシュ
            undoRedoStackState.undoRedoDataStack.push({
                indexData: canvasColorState.canvasIndexData.slice(),
            });
        };

        // やり直し(undo)
        const undo = (): void => {
            // 現在の表示内容が配列の先頭であれば処理を終了する
            if (undoRedoStackState.undoRedoDataIndex <= 0) {
                return;
            }
            // 現在の表示内容の添え字をデクリメントし、それをもとにindexDataを取得して再描画
            redraw(
                undoRedoStackState.undoRedoDataStack[
                    --undoRedoStackState.undoRedoDataIndex
                ].indexData
            );
        };

        // やり直しの取り消し(redo)
        const redo = (): void => {
            // 現在の表示内容が配列の末尾であれば処理を終了する
            if (
                undoRedoStackState.undoRedoDataIndex >=
                undoRedoStackState.undoRedoDataStack.length - 1
            ) {
                return;
            }
            // 現在の表示内容の添え字をインクリメントし、それをもとにindexDataを取得して再描画
            redraw(
                undoRedoStackState.undoRedoDataStack[
                    ++undoRedoStackState.undoRedoDataIndex
                ].indexData
            );
        };

        // 渡されたcanvasのindexdataからドット絵を再描画するforループ
        const redraw = (indexData: number[]): void => {
            for (let x = 0; x < canvasSettingState.canvasRange; x++) {
                for (let y = 0; y < canvasSettingState.canvasRange; y++) {
                    canvasState.canvasCtx!.fillStyle =
                        palletState.colorPallet[
                            indexData[y * canvasSettingState.canvasRange + x]
                        ];
                    canvasState.canvasCtx!.fillRect(
                        x * canvasSettingState.canvasMagnification,
                        y * canvasSettingState.canvasMagnification,
                        canvasSettingState.canvasMagnification,
                        canvasSettingState.canvasMagnification
                    );
                    canvasColorState.canvasIndexData[
                        y * canvasSettingState.canvasRange + x
                    ] = indexData[y * canvasSettingState.canvasRange + x];
                }
            }
        };

        // グリッドのON、OFF
        const drawGrid = (): void => {
            gridCanvasState.gridCanvasCtx!.beginPath();
            gridCanvasState.gridCanvasCtx!.globalCompositeOperation =
                'source-over';
            // 線の色・幅
            gridCanvasState.gridCanvasCtx!.strokeStyle = 'rgb(0, 0, 0)';
            gridCanvasState.gridCanvasCtx!.lineWidth = 1;

            if (FraggerState.isGrid === false) {
                // グリッドの描画
                // 縦線
                for (let i = 1; i < canvasSettingState.canvasRange + 1; i++) {
                    gridCanvasState.gridCanvasCtx!.moveTo(
                        i * canvasSettingState.canvasMagnification - 0.5,
                        -0.5
                    );
                    gridCanvasState.gridCanvasCtx!.lineTo(
                        i * canvasSettingState.canvasMagnification - 0.5,
                        canvasSettingState.canvasRange *
                            canvasSettingState.canvasMagnification -
                            0.5
                    );
                }
                // 横線
                for (let i = 1; i < canvasSettingState.canvasRange + 1; i++) {
                    gridCanvasState.gridCanvasCtx!.moveTo(
                        -0.5,
                        i * canvasSettingState.canvasMagnification - 0.5
                    );
                    gridCanvasState.gridCanvasCtx!.lineTo(
                        canvasSettingState.canvasRange *
                            canvasSettingState.canvasMagnification -
                            0.5,
                        i * canvasSettingState.canvasMagnification - 0.5
                    );
                }
                // 描画
                gridCanvasState.gridCanvasCtx!.stroke();
                FraggerState.isGrid = true;
            } else {
                // 削除する
                gridCanvasState.gridCanvasCtx!.beginPath();
                gridCanvasState.gridCanvasCtx!.clearRect(
                    0,
                    0,
                    canvasSettingState.canvasRange *
                        canvasSettingState.canvasMagnification,
                    canvasSettingState.canvasRange *
                        canvasSettingState.canvasMagnification
                );
                FraggerState.isGrid = false;
            }
        };

        // 時計回り
        const clockRotate = (): void => {
            const resultIndexData: number[] = [];
            for (let i = 0; i < canvasColorState.canvasIndexData.length; i++) {
                const x = i % canvasSettingState.canvasRange;
                const y = (i - x) / canvasSettingState.canvasRange;
                const xy =
                    canvasSettingState.canvasRange -
                    y -
                    1 +
                    x * canvasSettingState.canvasRange;
                resultIndexData[xy] = canvasColorState.canvasIndexData[i];
            }
            // canvasColorState.canvasIndexData = resultIndexData.slice();
            redraw(resultIndexData.slice());
            afterDraw();
        };

        // 反時計回り
        const antiClockRotate = (): void => {
            const resultIndexData: number[] = [];
            for (let i = 0; i < canvasColorState.canvasIndexData.length; i++) {
                const x = i % canvasSettingState.canvasRange;
                const y = (i - x) / canvasSettingState.canvasRange;
                const xy =
                    y +
                    (canvasSettingState.canvasRange - x - 1) *
                        canvasSettingState.canvasRange;
                resultIndexData[xy] = canvasColorState.canvasIndexData[i];
            }
            // canvasColorState.canvasIndexData = resultIndexData.slice();
            redraw(resultIndexData.slice());
            afterDraw();
        };

        // 画像保存ページへの遷移
        const imageSave = (): void => {
            // canvasのインデックスデータとパレットデータ、ストアの諸データをストアへ入れなおす
            // Rangeを入れるとIndexDataを初期化してしまうのでRangeの後にIndexDataを入れること
            CanvasDataModule.setPalletColor(palletState.colorPallet);
            CanvasDataModule.setCanvasName(session.canvasData.canvasName);
            CanvasDataModule.setCanvasRange(session.canvasData.canvasRange);
            CanvasDataModule.setCanvasIndexData(
                canvasColorState.canvasIndexData
            );
            CanvasDataModule.setCanvasMagnification(
                session.canvasData.canvasMagnification
            );
            CanvasDataModule.setPalletName(session.canvasData.palletName);
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
            clockRotate,
            antiClockRotate,
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
        opacity: 0.5;
        top: 0px;
        // left: 0px;
        left: 50%;
        transform: translateX(-50%);
        -webkit-transform: translateX(-50%);
        -ms-transform: translateX(-50%);
    }
    &__Draw {
        position: absolute;
        top: 0px;
        left: 50%;
        transform: translateX(-50%);
        -webkit-transform: translateX(-50%);
        -ms-transform: translateX(-50%);
    }
}
.DrowCanvas::before {
    content: '';
    display: block;
    padding-top: 100%;
    @media screen and (min-width: 768px) and (max-width: 1024px) {
        padding-top: 50%;
    }
    @media screen and (min-width: 1024px) {
        padding-top: 50%;
    }
}
</style>

import { layerdCanvasData } from '@/types/Canvas/LayerdCanvasDataType';
type CanvasType = {
    canvasCtx: CanvasRenderingContext2D | null;
    canvasRange: number;
    canvasIndexData: layerdCanvasData[];
    canvasMagnification: number;
    colorPallet: string[];
    backGroundColorIndex: number;
    topLayerData: number[];
};

/**
 * 渡された全てのレイヤーのデータからドット絵を再描画するロジック
 */
const useReDraw = (canvasData: CanvasType): void => {
    for (const item in canvasData.topLayerData) {
        canvasData.topLayerData[item] = 999; // キャンバスの一番上のレイヤーの情報を初期化
    }
    canvasData.canvasIndexData.forEach((_, i) => {
        // 一番上のレイヤーから順番に処理していく 0から開始
        const target = canvasData.canvasIndexData.find(
            (layer) => layer.layerIndex === i
        )!;
        for (let x = 0; x < canvasData.canvasRange; x++) {
            for (let y = 0; y < canvasData.canvasRange; y++) {
                // キャンバスに描画するかどうかを判定
                if (checkCanvas(x, y, target, canvasData)) {
                    if (target.active === true) {
                        // 色の取得
                        canvasData.canvasCtx!.fillStyle =
                            canvasData.colorPallet[
                                target.canvasIndexData[
                                    y * canvasData.canvasRange + x
                                ]
                            ];
                        // 一番上のレイヤーの情報を更新
                        canvasData.topLayerData[
                            y * canvasData.canvasRange + x
                        ] = i;
                    } else {
                        // 無効化されたレイヤーなら背景色の取得
                        canvasData.canvasCtx!.fillStyle =
                            canvasData.colorPallet[
                                target.canvasIndexData[
                                    canvasData.backGroundColorIndex
                                ]
                            ];
                    }
                    // 取得された色で上書き
                    canvasData.canvasCtx!.fillRect(
                        x * canvasData.canvasMagnification,
                        y * canvasData.canvasMagnification,
                        canvasData.canvasMagnification,
                        canvasData.canvasMagnification
                    );
                } else {
                    continue;
                }
            }
        }
    });
};

// 与えられたデータからキャンバスに描画するかどうかを判定する関数
function checkCanvas(
    x: number,
    y: number,
    target: layerdCanvasData,
    canvasData: CanvasType
) {
    // 現在のレイヤーが描画されている中で一番上でないなら終了
    if (
        canvasData.topLayerData[y * canvasData.canvasRange + x] <
        target.layerIndex
    ) {
        return false;
    }
    // 現在のレイヤーが一番下でなく、該当位置が背景色なら終了
    // 背景色を描画するのは一番下の時のみ
    if (
        target.layerIndex !== canvasData.canvasIndexData.length - 1 &&
        target.canvasIndexData[y * canvasData.canvasRange + x] ===
            canvasData.backGroundColorIndex
    ) {
        return false;
    }
    // 条件が合えば1を返す
    return true;
}
export default useReDraw;

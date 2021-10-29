import { Point } from '@/types/Canvas/PointType';
import { layerdCanvasData } from '@/types/Canvas/LayerdCanvasDataType';
// constants
import { constants } from '@/common/constants';

type CanvasType = {
    canvasCtx: CanvasRenderingContext2D | null;
    canvasRange: number;
    canvasIndexData: layerdCanvasData[];
    canvasMagnification: number;
    colorPallet: string[];
    backGroundColorIndex: number;
    targetLayer: number;
    targetLayerData: layerdCanvasData;
    topLayerData: number[];
};

/**
 * 渡されたcanvasのindexdataから一つのレイヤーを再描画するロジック
 */
const useLayerReDraw = (canvasData: CanvasType, indexData: number[]): void => {
    // 現在のレイヤーが無効の場合何もしない
    if (!canvasData.targetLayerData.active) {
        return;
    }
    for (let x = 0; x < canvasData.canvasRange; x++) {
        for (let y = 0; y < canvasData.canvasRange; y++) {
            const cell = {
                X: x,
                Y: y,
            };
            const check = checkCanvas(
                cell,
                canvasData,
                indexData[y * canvasData.canvasRange + x]
            );
            if (check === constants.DRAW_LAYER_CHECK_STATUS.drawBackground) {
                // 背景色を塗り、topLayerDataを最も下のレイヤーで更新
                canvasData.canvasCtx!.fillStyle =
                    canvasData.colorPallet[
                        indexData[y * canvasData.canvasRange + x]
                    ];
                // topLayerDataを更新
                canvasData.topLayerData[y * canvasData.canvasRange + x] =
                    canvasData.canvasIndexData.length - 1;
                // キャンバスに描画
                canvasData.canvasCtx!.fillRect(
                    x * canvasData.canvasMagnification,
                    y * canvasData.canvasMagnification,
                    canvasData.canvasMagnification,
                    canvasData.canvasMagnification
                );
            } else if (check === constants.DRAW_LAYER_CHECK_STATUS.elaser) {
                // すでに描画されているレイヤーの中で最も上にある物の情報で描画
                const layernums = canvasData.canvasIndexData
                    .filter(
                        (layer) =>
                            layer.canvasIndexData[
                                y * canvasData.canvasRange + x
                            ] !== canvasData.backGroundColorIndex &&
                            layer.layerIndex > canvasData.targetLayer &&
                            layer.active
                    )
                    .map((item) => {
                        return item.layerIndex;
                    });
                const underLayer = canvasData.canvasIndexData.find(
                    (layer) =>
                        layer.layerIndex ===
                        Math.min.apply(undefined, layernums)
                );
                // 該当レイヤーの色を取得
                canvasData.canvasCtx!.fillStyle =
                    canvasData.colorPallet[
                        underLayer!.canvasIndexData[
                            y * canvasData.canvasRange + x
                        ]
                    ];
                // topLayerDataを更新
                canvasData.topLayerData[y * canvasData.canvasRange + x] =
                    underLayer!.layerIndex;
                // キャンバスに描画
                canvasData.canvasCtx!.fillRect(
                    x * canvasData.canvasMagnification,
                    y * canvasData.canvasMagnification,
                    canvasData.canvasMagnification,
                    canvasData.canvasMagnification
                );
            } else if (check === constants.DRAW_LAYER_CHECK_STATUS.draw) {
                // そのまま描画
                // 色の取得
                canvasData.canvasCtx!.fillStyle =
                    canvasData.colorPallet[
                        indexData[y * canvasData.canvasRange + x]
                    ];
                // キャンバスに描画
                canvasData.canvasCtx!.fillRect(
                    x * canvasData.canvasMagnification,
                    y * canvasData.canvasMagnification,
                    canvasData.canvasMagnification,
                    canvasData.canvasMagnification
                );
                // topLayerDataを更新
                canvasData.topLayerData[y * canvasData.canvasRange + x] =
                    canvasData.targetLayerData.layerIndex;
            }
            // 塗った色のデータを反映させる
            canvasData.targetLayerData.canvasIndexData[
                y * canvasData.canvasRange + x
            ] = indexData[y * canvasData.canvasRange + x];
        }
    }
};

// 対象のセルへの描画の判定を行う関数
function checkCanvas(
    cell: Point,
    canvasData: CanvasType,
    palletNumber: number
): string {
    if (
        canvasData.topLayerData[cell.Y * canvasData.canvasRange + cell.X] >=
        canvasData.targetLayer
    ) {
        // 現在描画されている中で一番上のレイヤーだった場合

        if (
            palletNumber === canvasData.backGroundColorIndex &&
            canvasData.targetLayer !== canvasData.canvasIndexData.length - 1
        ) {
            // 一番下のレイヤーではなく、かつ背景色だった場合
            // 現在のレイヤーより下で背景色以外が塗られているレイヤーがあるか探す
            const layernums = canvasData.canvasIndexData
                .filter(
                    (layer) =>
                        layer.canvasIndexData[
                            cell.Y * canvasData.canvasRange + cell.X
                        ] !== canvasData.backGroundColorIndex &&
                        layer.layerIndex > canvasData.targetLayer &&
                        layer.active
                )
                .map(function (item) {
                    return item.layerIndex;
                });
            if (layernums.length === 0) {
                // 描画済みのドットの中で最も上にあり、かつ一番下ではなく、今から塗る色が背景色であり、
                // その下に背景色以外で塗られたレイヤーがない場合
                // その地点で背景色以外で塗られたレイヤーがない＝何も書かれていない状態
                return constants.DRAW_LAYER_CHECK_STATUS.drawBackground;
            } else {
                // 描画済みのドットの中で最も上にあり、かつ一番下ではなく、今から塗る色が背景色であり、
                // その下に背景色以外で塗られたレイヤーがある場合
                // 消しゴムとしての動作を行う
                return constants.DRAW_LAYER_CHECK_STATUS.elaser;
            }
        } else {
            // 描画済みのドットの中で最も上にあり、かつ背景色ではない
            // または一番下のレイヤーである場合
            // そのまま描画する
            return constants.DRAW_LAYER_CHECK_STATUS.draw;
        }
    } else {
        // 現在描画されている中で一番上のレイヤーではない場合
        // 描画等を行わず、該当レイヤーのcanvasDataを更新
        return constants.DRAW_LAYER_CHECK_STATUS.nothing;
    }
}

export default useLayerReDraw;

import { Point } from '@/types/Canvas/PointType';
import { layerdCanvasData } from '@/types/Canvas/LayerdCanvasDataType';

type CanvasType = {
    canvasCtx: CanvasRenderingContext2D | null;
    canvasRange: number;
    canvasIndexData: layerdCanvasData[];
    canvasMagnification: number;
    colorPallet: string[];
    isDrag: boolean;
    palletIndex: number;
    backGroundColorIndex: number;
    targetLayer: number;
    targetLayerData: layerdCanvasData;
    topLayerData: number[];
};

/**
 * ドットを描画するロジック
 */
const useDrawDot = (cell: Point, canvasData: CanvasType): void => {
    canvasData.canvasCtx!.beginPath();
    // 現在のレイヤーが無効の場合何もしない
    if (!canvasData.isDrag || canvasData.targetLayerData.active === false) {
        return;
    }
    const check = checkCanvas(cell, canvasData);
    if (check === 1) {
        // 背景色を塗り、topLayerDataを最も下のレイヤーで更新
        canvasData.canvasCtx!.fillStyle =
            canvasData.colorPallet[canvasData.palletIndex];
        // topLayerDataを更新
        canvasData.topLayerData[cell.Y * canvasData.canvasRange + cell.X] =
            canvasData.canvasIndexData.length - 1;
        // キャンバスに描画
        canvasData.canvasCtx!.fillRect(
            cell.X * canvasData.canvasMagnification,
            cell.Y * canvasData.canvasMagnification,
            canvasData.canvasMagnification,
            canvasData.canvasMagnification
        );
    } else if (check === 2) {
        // すでに描画されているレイヤーの中で最も上にある物の情報で描画
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
        const underLayer = canvasData.canvasIndexData.find(
            (layer) => layer.layerIndex === Math.min.apply(null, layernums)
        );
        // 該当レイヤーの色を取得
        canvasData.canvasCtx!.fillStyle =
            canvasData.colorPallet[
                underLayer!.canvasIndexData[
                    cell.Y * canvasData.canvasRange + cell.X
                ]
            ];
        // topLayerDataを更新
        canvasData.topLayerData[cell.Y * canvasData.canvasRange + cell.X] =
            underLayer!.layerIndex;
        // キャンバスに描画
        canvasData.canvasCtx!.fillRect(
            cell.X * canvasData.canvasMagnification,
            cell.Y * canvasData.canvasMagnification,
            canvasData.canvasMagnification,
            canvasData.canvasMagnification
        );
    } else if (check === 3) {
        // そのまま描画
        // 色の取得
        canvasData.canvasCtx!.fillStyle =
            canvasData.colorPallet[canvasData.palletIndex];
        // キャンバスに描画
        canvasData.canvasCtx!.fillRect(
            cell.X * canvasData.canvasMagnification,
            cell.Y * canvasData.canvasMagnification,
            canvasData.canvasMagnification,
            canvasData.canvasMagnification
        );
        // topLayerDataを更新
        canvasData.topLayerData[cell.Y * canvasData.canvasRange + cell.X] =
            canvasData.targetLayerData.layerIndex;
    }
    // 塗った色のデータを反映させる
    canvasData.targetLayerData.canvasIndexData[
        cell.Y * canvasData.canvasRange + cell.X
    ] = canvasData.palletIndex;
};

// 対象のセルへの描画の判定を行う関数
function checkCanvas(cell: Point, canvasData: CanvasType) {
    if (
        canvasData.topLayerData[cell.Y * canvasData.canvasRange + cell.X] >=
        canvasData.targetLayer
    ) {
        // 現在描画されている中で一番上のレイヤーだった場合

        if (
            canvasData.palletIndex === canvasData.backGroundColorIndex &&
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
                return 1;
            } else {
                // 描画済みのドットの中で最も上にあり、かつ一番下ではなく、今から塗る色が背景色であり、
                // その下に背景色以外で塗られたレイヤーがある場合
                // 消しゴムとしての動作を行う
                return 2;
            }
        } else {
            // 描画済みのドットの中で最も上にあり、かつ背景色ではない
            // または一番下のレイヤーである場合
            // そのまま描画する
            return 3;
        }
    } else {
        // 現在描画されている中で一番上のレイヤーではない場合
        // 描画等を行わず、該当レイヤーのcanvasDataを更新
        return 0;
    }
}

export default useDrawDot;

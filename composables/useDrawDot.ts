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
    if (!canvasData.isDrag) {
        return;
    }

    // 現在のレイヤーが無効の場合何もしない(セーフティ)
    if (canvasData.targetLayerData.active === false) {
        return;
    }
    // 現在描画されている中で一番上のレイヤーだった場合
    if (
        canvasData.topLayerData[cell.Y * canvasData.canvasRange + cell.X] >=
        canvasData.targetLayer
    ) {
        // 一番下のレイヤーではなく、かつ背景色だった場合
        if (
            canvasData.targetLayerData!.canvasIndexData[
                cell.Y * canvasData.canvasRange + cell.X
            ] === canvasData.backGroundColorIndex &&
            canvasData.targetLayer === canvasData.canvasIndexData.length - 1
        ) {
            // 現在のレイヤーより下で背景色以外が塗られているレイヤーがあるか探す
            const layernums = canvasData.canvasIndexData
                .filter(
                    (layer) =>
                        layer.canvasIndexData[
                            cell.Y * canvasData.canvasRange + cell.X
                        ] !== canvasData.backGroundColorIndex || layer.active
                )
                .map(function (item) {
                    return item.layerIndex;
                });

            if (layernums === []) {
                // なかった場合そのまま背景色を塗り、topLayerDataを最も下のレイヤーで更新
                canvasData.canvasCtx!.fillStyle =
                    canvasData.colorPallet[canvasData.backGroundColorIndex];
                // topLayerDataを更新
                canvasData.topLayerData[
                    cell.Y * canvasData.canvasRange + cell.X
                ] = canvasData.canvasIndexData.length - 1;
                // キャンバスに描画
                canvasData.canvasCtx!.fillRect(
                    cell.X * canvasData.canvasMagnification,
                    cell.Y * canvasData.canvasMagnification,
                    canvasData.canvasMagnification,
                    canvasData.canvasMagnification
                );
            } else {
                // あった場合、そのレイヤーの中で最も上にある物の情報で描画
                const underLayer = canvasData.canvasIndexData.find(
                    (layer) =>
                        layer.layerIndex === Math.min.apply(null, layernums)
                );
                // 該当レイヤーの色を取得
                canvasData.canvasCtx!.fillStyle =
                    canvasData.colorPallet[
                        underLayer!.canvasIndexData[
                            cell.Y * canvasData.canvasRange + cell.X
                        ]
                    ];
                // topLayerDataを更新
                canvasData.topLayerData[
                    cell.Y * canvasData.canvasRange + cell.X
                ] = underLayer!.layerIndex;
                // キャンバスに描画
                canvasData.canvasCtx!.fillRect(
                    cell.X * canvasData.canvasMagnification,
                    cell.Y * canvasData.canvasMagnification,
                    canvasData.canvasMagnification,
                    canvasData.canvasMagnification
                );
            }
        } else {
            // 背景色ではないか一番下のレイヤーである場合、そのまま描画
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
    }
    // 塗った色のデータを反映させる
    canvasData.targetLayerData.canvasIndexData[
        cell.Y * canvasData.canvasRange + cell.X
    ] = canvasData.palletIndex;
};
export default useDrawDot;

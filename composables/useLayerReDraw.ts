import { layerdCanvasData } from '@/types/Canvas/LayerdCanvasDataType';
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
    // 現在描画しているレイヤーを取得
    // 現在のレイヤーが無効の場合何もしない(セーフティ)
    if (canvasData.targetLayerData.active === false) {
        return;
    }
    for (let x = 0; x < canvasData.canvasRange; x++) {
        for (let y = 0; y < canvasData.canvasRange; y++) {
            // 現在描画されている中で一番上のレイヤーだった場合
            if (
                canvasData.topLayerData[y * canvasData.canvasRange + x] >=
                canvasData.targetLayer
            ) {
                // 一番下のレイヤーではなく、かつ背景色だった場合
                if (
                    canvasData.targetLayerData.canvasIndexData[
                        y * canvasData.canvasRange + x
                    ] === canvasData.backGroundColorIndex &&
                    canvasData.targetLayer ===
                        canvasData.canvasIndexData.length - 1
                ) {
                    // 現在のレイヤーより下で背景色以外が塗られているレイヤーがあるか探す
                    const layernums = canvasData.canvasIndexData
                        .filter(
                            (layer) =>
                                layer.canvasIndexData[
                                    y * canvasData.canvasRange + x
                                ] !== canvasData.backGroundColorIndex ||
                                layer.active
                        )
                        .map(function (item) {
                            return item.layerIndex;
                        });

                    if (layernums === undefined) {
                        // なかった場合背景色を塗り、topLayerDataを最も下のレイヤーで更新
                        canvasData.canvasCtx!.fillStyle =
                            canvasData.colorPallet[
                                canvasData.backGroundColorIndex
                            ];
                        canvasData.topLayerData[
                            y * canvasData.canvasRange + x
                        ] = canvasData.canvasIndexData.length - 1;
                        // キャンバスに描画
                        canvasData.canvasCtx!.fillRect(
                            x * canvasData.canvasMagnification,
                            y * canvasData.canvasMagnification,
                            canvasData.canvasMagnification,
                            canvasData.canvasMagnification
                        );
                    } else {
                        // あった場合、そのレイヤーの中で最も上にある物の情報で描画
                        const underLayer = canvasData.canvasIndexData.find(
                            (layer) =>
                                layer.layerIndex ===
                                Math.min.apply(null, layernums)
                        );
                        canvasData.canvasCtx!.fillStyle =
                            canvasData.colorPallet[
                                underLayer!.canvasIndexData[
                                    y * canvasData.canvasRange + x
                                ]
                            ];
                        // topLayerDataを更新
                        canvasData.topLayerData[
                            y * canvasData.canvasRange + x
                        ] = underLayer!.layerIndex;
                        // キャンバスに描画
                        canvasData.canvasCtx!.fillRect(
                            x * canvasData.canvasMagnification,
                            y * canvasData.canvasMagnification,
                            canvasData.canvasMagnification,
                            canvasData.canvasMagnification
                        );
                    }
                } else {
                    // 背景色ではないか一番下のレイヤーである場合、そのまま描画
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
            }
            // インデックスデータを書き換え
            canvasData.targetLayerData.canvasIndexData[
                y * canvasData.canvasRange + x
            ] = indexData[y * canvasData.canvasRange + x];
        }
    }
};
export default useLayerReDraw;

import { layerdCanvasData } from '@/types/Canvas/LayerdCanvasDataType';
type CanvasType = {
    canvasCtx: CanvasRenderingContext2D | null;
    canvasRange: number;
    canvasIndexData: layerdCanvasData[];
    canvasMagnification: number;
    colorPallet: string[];
    backGroundColorIndex: number;
    targetLayer: number;
};

/**
 * 渡されたcanvasのindexdataから一つのレイヤーを再描画するロジック
 */
const useLayerReDraw = (
    canvasData: CanvasType,
    indexData: layerdCanvasData
): void => {
    // 現在描画しているレイヤーを取得
    const target = canvasData.canvasIndexData.find(
        (layer) => layer.layerIndex === canvasData.targetLayer
    );
    // 重なってる部分の判別用
    const layer0 = canvasData.canvasIndexData.find(
        (layer) => layer.layerIndex === 0
    );
    const layer1 = canvasData.canvasIndexData.find(
        (layer) => layer.layerIndex === 1
    );
    for (let x = 0; x < canvasData.canvasRange; x++) {
        for (let y = 0; y < canvasData.canvasRange; y++) {
            // 色の取得
            canvasData.canvasCtx!.fillStyle =
                canvasData.colorPallet[
                    indexData.canvasIndexData[y * canvasData.canvasRange + x]
                ];
            // 現在のレイヤーが有効化されており、現在のレイヤーが0か、
            // 現在のレイヤーが1かつレイヤー0の該当箇所が背景色か、
            // 現在のレイヤーが2かつレイヤー0と1の該当箇所がどちらも背景色の場合
            if (
                !(
                    (canvasData.targetLayer === 1 &&
                        layer0?.active === true &&
                        layer0!.canvasIndexData[
                            y * canvasData.canvasRange + x
                        ] !== canvasData.backGroundColorIndex) ||
                    (canvasData.targetLayer === 2 &&
                        ((layer0?.active === true &&
                            layer0!.canvasIndexData[
                                y * canvasData.canvasRange + x
                            ] !== canvasData.backGroundColorIndex) ||
                            (layer1?.active === true &&
                                layer1!.canvasIndexData[
                                    y * canvasData.canvasRange + x
                                ] !== canvasData.backGroundColorIndex))) ||
                    target!.active === false
                )
            ) {
                // キャンバスに描画
                canvasData.canvasCtx!.fillRect(
                    x * canvasData.canvasMagnification,
                    y * canvasData.canvasMagnification,
                    canvasData.canvasMagnification,
                    canvasData.canvasMagnification
                );
            }
            // インデックスデータを書き換え
            target!.canvasIndexData[y * canvasData.canvasRange + x] =
                indexData.canvasIndexData[y * canvasData.canvasRange + x];
        }
    }
};
export default useLayerReDraw;

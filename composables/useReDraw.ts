import { layerdCanvasData } from '@/types/Canvas/LayerdCanvasDataType';
type CanvasType = {
    canvasCtx: CanvasRenderingContext2D | null;
    canvasRange: number;
    canvasIndexData: layerdCanvasData[];
    canvasMagnification: number;
    colorPallet: string[];
    backGroundColorIndex: number;
};

/**
 * 渡された全てのレイヤーのデータからドット絵を再描画するロジック
 */
const useReDraw = (canvasData: CanvasType): void => {
    canvasData.canvasIndexData.forEach((_, i) => {
        // 一番下のレイヤーから順番に処理していく
        const target = canvasData.canvasIndexData.find(
            (layer) => layer.layerIndex === 2 - i
        );
        for (let x = 0; x < canvasData.canvasRange; x++) {
            // 現在のレイヤーが無効の場合何もしない
            if (target!.active === false) {
                continue;
            }
            for (let y = 0; y < canvasData.canvasRange; y++) {
                // 現在のレイヤーが一番下ではなく、該当位置が背景色の場合何もしない
                if (
                    2 - i <= 1 &&
                    target!.canvasIndexData[y * canvasData.canvasRange + x] ===
                        canvasData.backGroundColorIndex
                ) {
                    continue;
                }
                // 色の取得
                canvasData.canvasCtx!.fillStyle =
                    canvasData.colorPallet[
                        target!.canvasIndexData[y * canvasData.canvasRange + x]
                    ];
                // 現在のレイヤーの色で上書きする
                canvasData.canvasCtx!.fillRect(
                    x * canvasData.canvasMagnification,
                    y * canvasData.canvasMagnification,
                    canvasData.canvasMagnification,
                    canvasData.canvasMagnification
                );
            }
        }
    });
};
export default useReDraw;

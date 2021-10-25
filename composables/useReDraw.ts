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
    // キャンバスの一番上のレイヤーの情報を初期化
    for (const item in canvasData.topLayerData) {
        canvasData.topLayerData[item] = 999;
    }
    canvasData.canvasIndexData.forEach((_, i) => {
        console.log(i);
        // 一番上のレイヤーから順番に処理していく 0から開始
        const target = canvasData.canvasIndexData.find(
            (layer) => layer.layerIndex === i
        )!;
        for (let x = 0; x < canvasData.canvasRange; x++) {
            // 現在のレイヤーが無効の場合何もしない
            if (target.active === false) {
                continue;
            }
            for (let y = 0; y < canvasData.canvasRange; y++) {
                // 現在のレイヤーが描画されている中で一番上でないなら終了
                if (
                    canvasData.topLayerData[y * canvasData.canvasRange + x] <
                    target.layerIndex
                ) {
                    continue;
                }
                // 色の取得
                canvasData.canvasCtx!.fillStyle =
                    canvasData.colorPallet[
                        target.canvasIndexData[y * canvasData.canvasRange + x]
                    ];
                // 現在のレイヤーが一番下でなく、該当位置が背景色なら終了
                // 背景色を描画するのは一番下の時のみ
                if (
                    i !== canvasData.canvasIndexData.length - 1 &&
                    target.canvasIndexData[y * canvasData.canvasRange + x] ===
                        canvasData.backGroundColorIndex
                ) {
                    continue;
                }
                // 現在のレイヤーの色で上書きする
                canvasData.canvasCtx!.fillRect(
                    x * canvasData.canvasMagnification,
                    y * canvasData.canvasMagnification,
                    canvasData.canvasMagnification,
                    canvasData.canvasMagnification
                );
                // 一番上のレイヤーの情報を更新
                canvasData.topLayerData[y * canvasData.canvasRange + x] = i;
            }
        }
    });
};
export default useReDraw;

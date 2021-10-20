import { Point } from '@/types/Canvas/PointType';
import { layerdCanvasData } from '@/types/Canvas/LayerdCanvasDataType';

type CanvasType = {
    canvasCtx: CanvasRenderingContext2D | null;
    canvasRange: number;
    canvasIndexData: layerdCanvasData[];
    canvasMagnification: number;
    isDrag: boolean;
    selectingColor: string;
    palletIndex: number;
    backGroundColorIndex: number;
    targetLayer: number;
};

/**
 * ドットを描画するロジック
 */
const useDrawDot = (cell: Point, canvasData: CanvasType): void => {
    canvasData.canvasCtx!.beginPath();
    if (!canvasData.isDrag) {
        return;
    }
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
    // 現在のレイヤーが0か、
    // 現在のレイヤーが1かつレイヤー0の該当箇所が背景色か、
    // 現在のレイヤーが2かつレイヤー0と1の該当箇所がどちらも背景色の場合
    if (
        !(
            (canvasData.targetLayer === 1 &&
                layer0?.active === true &&
                layer0?.canvasIndexData[
                    cell.Y * canvasData.canvasRange + cell.X
                ] !== canvasData.backGroundColorIndex) ||
            (canvasData.targetLayer === 2 &&
                ((layer0?.active === true &&
                    layer0?.canvasIndexData[
                        cell.Y * canvasData.canvasRange + cell.X
                    ] !== canvasData.backGroundColorIndex) ||
                    (layer1?.active === true &&
                        layer1?.canvasIndexData[
                            cell.Y * canvasData.canvasRange + cell.X
                        ] !== canvasData.backGroundColorIndex)))
        )
    ) {
        // 該当の座標に色を塗るだけ
        canvasData.canvasCtx!.fillStyle = canvasData.selectingColor;
        canvasData.canvasCtx!.fillRect(
            cell.X * canvasData.canvasMagnification,
            cell.Y * canvasData.canvasMagnification,
            canvasData.canvasMagnification,
            canvasData.canvasMagnification
        );
    }
    // 塗った色のデータを反映させる
    target!.canvasIndexData[cell.Y * canvasData.canvasRange + cell.X] =
        canvasData.palletIndex;
};
export default useDrawDot;

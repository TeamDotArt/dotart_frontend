import { Point } from '@/types/Canvas/PointType';

type CanvasType = {
    canvasCtx: CanvasRenderingContext2D | null;
    canvasRange: number;
    canvasIndexData: number[];
    canvasMagnification: number;
    isDrag: boolean;
    selectingColor: string;
    palletIndex: number;
};

/**
 * ドットを描画するロジック
 */
const useDrawDot = (cell: Point, canvasData: CanvasType): void => {
    canvasData.canvasCtx!.beginPath();
    if (!canvasData.isDrag) {
        return;
    }
    // 該当の座標に色を塗るだけ
    canvasData.canvasCtx!.fillStyle = canvasData.selectingColor;
    canvasData.canvasCtx!.fillRect(
        cell.X * canvasData.canvasMagnification,
        cell.Y * canvasData.canvasMagnification,
        canvasData.canvasMagnification,
        canvasData.canvasMagnification
    );
    // 塗った色のデータを反映させる
    canvasData.canvasIndexData[cell.Y * canvasData.canvasRange + cell.X] =
        canvasData.palletIndex;
};
export default useDrawDot;

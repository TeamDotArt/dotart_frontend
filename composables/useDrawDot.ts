// ホーム画面へ遷移するロジック
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

const useDrawDot = (cell: Point, palletData: CanvasType): void => {
    palletData.canvasCtx!.beginPath();
    if (!palletData.isDrag) {
        return;
    }
    // 該当の座標に色を塗るだけ
    palletData.canvasCtx!.fillStyle = palletData.selectingColor;
    palletData.canvasCtx!.fillRect(
        cell.X * palletData.canvasMagnification,
        cell.Y * palletData.canvasMagnification,
        palletData.canvasMagnification,
        palletData.canvasMagnification
    );
    // 塗った色のデータを反映させる
    palletData.canvasIndexData[cell.Y * palletData.canvasRange + cell.X] =
        palletData.palletIndex;
};
export default useDrawDot;

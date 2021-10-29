import { Point } from '@/types/Canvas/PointType';
import { layerdCanvasData } from '@/types/Canvas/LayerdCanvasDataType';

type FillType = {
    canvasRange: number;
    canvasIndexData: layerdCanvasData[];
    palletIndex: number;
    targetLayer: number;
    targetLayerData: layerdCanvasData;
};

/**
 * 塗りつぶしするロジック
 */
const useDrawFill = (cell: Point, fillData: FillType) => {
    // クリックした位置の色のindexを取得
    const color =
        fillData.targetLayerData.canvasIndexData[
            cell.Y * fillData.canvasRange + cell.X
        ];
    // 今の選択中の色と同じならキャンセル
    if (color === fillData.palletIndex) {
        return;
    }
    return color;
};
export default useDrawFill;

import { Point } from '@/types/Canvas/PointType';

type FillType = {
    canvasRange: number;
    canvasIndexData: number[];
    palletIndex: number;
};

/**
 * 塗りつぶしするロジック
 */
const useDrawFill = (cell: Point, fillData: FillType) => {
    // クリックした位置の色のindexを取得
    const color =
        fillData.canvasIndexData[cell.Y * fillData.canvasRange + cell.X];
    // 今の選択中の色と同じならキャンセル
    if (color === fillData.palletIndex) {
        return;
    }
    return color;
};
export default useDrawFill;

import { layerdCanvasData } from '@/types/Canvas/LayerdCanvasDataType';
// 回転を制御するロジック
type RotateType = {
    canvasRange: number;
    layerData: layerdCanvasData;
};

/**
 * 回転を制御するロジック
 * rotate -> 時計回り: true、反時計回り: false
 */
const useClockRotate = (rotate: boolean = true, rotateData: RotateType) => {
    const resultIndexData: number[] = [];
    if (rotate) {
        for (let i = 0; i < rotateData.layerData.canvasIndexData.length; i++) {
            const x = i % rotateData.canvasRange;
            const y = (i - x) / rotateData.canvasRange;
            const xy =
                rotateData.canvasRange - y - 1 + x * rotateData.canvasRange;
            resultIndexData[xy] = rotateData.layerData.canvasIndexData[i];
        }
    } else {
        for (let i = 0; i < rotateData.layerData.canvasIndexData.length; i++) {
            const x = i % rotateData.canvasRange;
            const y = (i - x) / rotateData.canvasRange;
            const xy =
                y + (rotateData.canvasRange - x - 1) * rotateData.canvasRange;
            resultIndexData[xy] = rotateData.layerData.canvasIndexData[i];
        }
    }
    return { resultIndexData };
};
export default useClockRotate;

// 回転を制御するロジック
type RotateType = {
    canvasRange: number;
    canvasIndexData: number[];
};

/**
 * 回転を制御するロジック
 * rotate -> 時計回り: true、反時計回り: false
 */
const useClockRotate = (rotate: boolean = true, rotateData: RotateType) => {
    const resultIndexData: number[] = [];
    if (rotate) {
        for (let i = 0; i < rotateData.canvasIndexData.length; i++) {
            const x = i % rotateData.canvasRange;
            const y = (i - x) / rotateData.canvasRange;
            const xy =
                rotateData.canvasRange - y - 1 + x * rotateData.canvasRange;
            resultIndexData[xy] = rotateData.canvasIndexData[i];
        }
    } else {
        for (let i = 0; i < rotateData.canvasIndexData.length; i++) {
            const x = i % rotateData.canvasRange;
            const y = (i - x) / rotateData.canvasRange;
            const xy =
                y + (rotateData.canvasRange - x - 1) * rotateData.canvasRange;
            resultIndexData[xy] = rotateData.canvasIndexData[i];
        }
    }
    return { resultIndexData };
};
export default useClockRotate;

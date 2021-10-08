// 反回転ロジック
type ClockType = {
    canvasRange: number;
    canvasIndexData: number[];
};

/// rotate -> 時計回り: true、反時計回り: false
const useClockRotate = (rotate: boolean = true, palletData: ClockType) => {
    const resultIndexData: number[] = [];
    if (rotate) {
        for (let i = 0; i < palletData.canvasIndexData.length; i++) {
            const x = i % palletData.canvasRange;
            const y = (i - x) / palletData.canvasRange;
            const xy =
                palletData.canvasRange - y - 1 + x * palletData.canvasRange;
            resultIndexData[xy] = palletData.canvasIndexData[i];
        }
    } else {
        for (let i = 0; i < palletData.canvasIndexData.length; i++) {
            const x = i % palletData.canvasRange;
            const y = (i - x) / palletData.canvasRange;
            const xy =
                y + (palletData.canvasRange - x - 1) * palletData.canvasRange;
            resultIndexData[xy] = palletData.canvasIndexData[i];
        }
    }
    return { resultIndexData };
};
export default useClockRotate;

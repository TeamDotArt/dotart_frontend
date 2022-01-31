type penModeType = {
    selectMode: string;
    penMode: {
        pen: string;
        bucket: string;
        stroke: string;
        eraser: string;
    };
};
/**
 * ペンモードの変更
 */
const usePenModeChange = (penModeData: penModeType): string => {
    switch (penModeData.selectMode) {
        case penModeData.penMode.pen:
            return penModeData.penMode.pen;
        case penModeData.penMode.bucket:
            return penModeData.penMode.bucket;
        case penModeData.penMode.stroke:
            return penModeData.penMode.stroke;
        case penModeData.penMode.eraser:
            return penModeData.penMode.eraser;
    }
};
export default usePenModeChange;

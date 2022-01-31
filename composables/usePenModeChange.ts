type penModeType = {
    selectMode: string;
    nowMode: string;
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
const usePenModeChange = (penModeData: penModeType): void => {
    switch (penModeData.selectMode) {
        case penModeData.penMode.pen:
            penModeData.nowMode = penModeData.penMode.pen;
            break;
        case penModeData.penMode.bucket:
            penModeData.nowMode = penModeData.penMode.bucket;
            break;
        case penModeData.penMode.stroke:
            penModeData.nowMode = penModeData.penMode.stroke;
            break;
        case penModeData.penMode.eraser:
            penModeData.nowMode = penModeData.penMode.eraser;
            break;
    }
};
export default usePenModeChange;

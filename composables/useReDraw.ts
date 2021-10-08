type CanvasType = {
    canvasCtx: CanvasRenderingContext2D | null;
    canvasRange: number;
    canvasIndexData: number[];
    canvasMagnification: number;
    colorPallet: string[];
};

/**
 * 渡されたcanvasのindexdataからドット絵を再描画するロジック
 */
const useReDraw = (canvasData: CanvasType, indexData: number[]): void => {
    for (let x = 0; x < canvasData.canvasRange; x++) {
        for (let y = 0; y < canvasData.canvasRange; y++) {
            canvasData.canvasCtx!.fillStyle =
                canvasData.colorPallet[
                    indexData[y * canvasData.canvasRange + x]
                ];
            canvasData.canvasCtx!.fillRect(
                x * canvasData.canvasMagnification,
                y * canvasData.canvasMagnification,
                canvasData.canvasMagnification,
                canvasData.canvasMagnification
            );
            canvasData.canvasIndexData[y * canvasData.canvasRange + x] =
                indexData[y * canvasData.canvasRange + x];
        }
    }
};
export default useReDraw;

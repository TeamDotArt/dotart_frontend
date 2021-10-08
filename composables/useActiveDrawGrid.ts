// ホーム画面へ遷移するロジック

type GridType = {
    gridCanvasCtx: CanvasRenderingContext2D | null;
    canvasRange: number;
    canvasMagnification: number;
    isGrid: boolean;
};

const useActiveDrawGrid = (gridData: GridType): void => {
    gridData.gridCanvasCtx!.beginPath();
    gridData.gridCanvasCtx!.globalCompositeOperation = 'source-over';
    // 線の色・幅
    gridData.gridCanvasCtx!.strokeStyle = 'rgb(0, 0, 0)';
    gridData.gridCanvasCtx!.lineWidth = 1;

    if (gridData.isGrid === false) {
        // グリッドの描画
        // 縦線
        for (let i = 1; i < gridData.canvasRange + 1; i++) {
            gridData.gridCanvasCtx!.moveTo(
                i * gridData.canvasMagnification - 0.5,
                -0.5
            );
            gridData.gridCanvasCtx!.lineTo(
                i * gridData.canvasMagnification - 0.5,
                gridData.canvasRange * gridData.canvasMagnification - 0.5
            );
        }
        // 横線
        for (let i = 1; i < gridData.canvasRange + 1; i++) {
            gridData.gridCanvasCtx!.moveTo(
                -0.5,
                i * gridData.canvasMagnification - 0.5
            );
            gridData.gridCanvasCtx!.lineTo(
                gridData.canvasRange * gridData.canvasMagnification - 0.5,
                i * gridData.canvasMagnification - 0.5
            );
        }
        // 描画
        gridData.gridCanvasCtx!.stroke();
        gridData.isGrid = true;
    } else {
        // 削除する
        gridData.gridCanvasCtx!.beginPath();
        gridData.gridCanvasCtx!.clearRect(
            0,
            0,
            gridData.canvasRange * gridData.canvasMagnification,
            gridData.canvasRange * gridData.canvasMagnification
        );
        gridData.isGrid = false;
    }
};
export default useActiveDrawGrid;

// import { Stack } from '@/types/Canvas/StackType';
import { UndoRedoLayer } from '@/types/Canvas/UndoRedoLayerType';
import { layerdCanvasData } from '@/types/Canvas/LayerdCanvasDataType';

type StackType = {
    targetLayerData: layerdCanvasData;
    undoRedoData: UndoRedoLayer;
    stackMaxSize: number;
};

/**
 * クリック時に最初に行う処理、やり直しのためのデータを処理するするロジック
 */
const useAfterDraw = (stackData: StackType): void => {
    // やり直しをした後だった場合、現在の表示内容以降のデータは削除
    if (
        stackData.undoRedoData.undoRedoDataIndex <
        stackData.undoRedoData.undoRedoDataStack.length - 1
    ) {
        stackData.undoRedoData.undoRedoDataStack.splice(
            stackData.undoRedoData.undoRedoDataIndex + 1
        );
    }
    // 巻き戻し最大回数より多かったら先頭を削除、そうでなければ追加
    if (stackData.undoRedoData.undoRedoDataIndex >= stackData.stackMaxSize) {
        stackData.undoRedoData.undoRedoDataStack.shift();
    } else {
        ++stackData.undoRedoData.undoRedoDataIndex;
    }
    // データのプッシュ
    stackData.undoRedoData.undoRedoDataStack.push({
        indexData: stackData.targetLayerData.canvasIndexData.slice(), // 値渡し
    });
};
export default useAfterDraw;

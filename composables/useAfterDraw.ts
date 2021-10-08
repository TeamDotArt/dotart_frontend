import { Stack } from '@/types/Canvas/StackType';

type StackType = {
    undoRedoDataIndex: number;
    undoRedoDataStack: Stack[];
    stackMaxSize: number;
    canvasIndexData: number[];
};

/**
 * クリック時に最初に行う処理、やり直しのためのデータを処理するするロジック
 */
const useAfterDraw = (stackData: StackType): void => {
    // やり直しをした後だった場合、現在の表示内容以降のデータは削除
    if (stackData.undoRedoDataIndex < stackData.undoRedoDataStack.length - 1) {
        stackData.undoRedoDataStack.splice(stackData.undoRedoDataIndex + 1);
    }
    // 巻き戻し最大回数より多かったら先頭を削除、そうでなければ追加
    if (stackData.undoRedoDataIndex >= stackData.stackMaxSize) {
        stackData.undoRedoDataStack.shift();
    } else {
        ++stackData.undoRedoDataIndex;
    }
    // データのプッシュ
    stackData.undoRedoDataStack.push({
        indexData: stackData.canvasIndexData.slice(),
    });
};
export default useAfterDraw;

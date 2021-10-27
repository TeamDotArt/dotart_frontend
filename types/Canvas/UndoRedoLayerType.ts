// undo、redoの情報をレイヤー別に保存するType
import { Stack } from '@/types/Canvas/StackType';
export type UndoRedoLayer = {
    undoRedoDataStack: Stack[]; // undo,redoに使う画面データの配列
    undoRedoDataIndex: number; // ↑の、「現在表示している画面のデータ」が格納されている部分の添え字を示す
    layerIndex: number; // レイヤーの位置
};

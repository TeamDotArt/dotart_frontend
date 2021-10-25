// undo、redoの情報をレイヤー別に保存するType
import { Stack } from '@/types/Canvas/StackType';
export type UndoRedoLayer = {
    undoRedoDataStack: Stack[];
    undoRedoDataIndex: number;
    layerIndex: number;
};

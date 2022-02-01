import { layerdCanvasData } from '@/types/Canvas/LayerdCanvasDataType';
import { UndoRedoLayer } from '@/types/Canvas/UndoRedoLayerType';
export type CanvasDataState = {
    canvasRange: number;
    canvasMagnification: number;
    canvasName: string;
    palletName: string;
    palletColor: string[];
    canvasesIndexData: layerdCanvasData[];
    undoRedoDataStack: UndoRedoLayer[];
};

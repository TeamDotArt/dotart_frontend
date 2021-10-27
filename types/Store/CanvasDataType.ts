import { layerdCanvasData } from '@/types/Canvas/LayerdCanvasDataType';
export type CanvasDataState = {
    canvasRange: number;
    canvasMagnification: number;
    canvasName: string;
    palletName: string;
    palletColor: string[];
    canvasesIndexData: layerdCanvasData[];
};

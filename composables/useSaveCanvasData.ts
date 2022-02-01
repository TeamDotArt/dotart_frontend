import { layerdCanvasData } from '@/types/Canvas/LayerdCanvasDataType';
import { UndoRedoLayer } from '@/types/Canvas/UndoRedoLayerType';
import { CanvasDataModule } from '~/store/modules/canvasData';
type PalletType = {
    palletName: string;
    colorPallet: string[];
    canvasName: string;
    canvasRange: number;
    canvasIndexData: layerdCanvasData[];
    canvasMagnification: number;
    undoRedoDataStack: UndoRedoLayer[];
};

/**
 * キャンバスデータを保存するするロジック
 */
const useSaveCanvasData = (palletData: PalletType): void => {
    // canvasのインデックスデータとパレットデータ、ストアの諸データをストアへ入れなおす
    // Rangeを入れるとIndexDataを初期化してしまうのでRangeの後にIndexDataを入れること
    CanvasDataModule.setPalletColor(palletData.colorPallet);
    CanvasDataModule.setCanvasName(palletData.canvasName);
    CanvasDataModule.setCanvasRange(palletData.canvasRange);
    CanvasDataModule.setCanvasesIndexData(palletData.canvasIndexData);
    CanvasDataModule.setCanvasMagnification(palletData.canvasMagnification);
    CanvasDataModule.setPalletName(palletData.palletName);
    CanvasDataModule.setUndoRedoDataStack(palletData.undoRedoDataStack);
};
export default useSaveCanvasData;

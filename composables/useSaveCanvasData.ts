import { layerdCanvasData } from '@/types/Canvas/LayerdCanvasDataType';
import { CanvasDataModule } from '~/store/modules/canvasData';
type PalletType = {
    palletName: string;
    colorPallet: string[];
    canvasName: string;
    canvasRange: number;
    canvasIndexData: layerdCanvasData[];
    canvasMagnification: number;
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
    CanvasDataModule.setLayerdCanvasIndexData(palletData.canvasIndexData);
    CanvasDataModule.setCanvasMagnification(palletData.canvasMagnification);
    CanvasDataModule.setPalletName(palletData.palletName);
};
export default useSaveCanvasData;

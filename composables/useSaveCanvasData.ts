// ホーム画面へ遷移するロジック
import { CanvasDataModule } from '~/store/modules/canvasData';

type PalletType = {
    palletName: string;
    colorPallet: string[];
    canvasName: string;
    canvasRange: number;
    canvasIndexData: number[];
    canvasMagnification: number;
};

const useSaveCanvasData = (palletData: PalletType): void => {
    // canvasのインデックスデータとパレットデータ、ストアの諸データをストアへ入れなおす
    // Rangeを入れるとIndexDataを初期化してしまうのでRangeの後にIndexDataを入れること
    CanvasDataModule.setPalletColor(palletData.colorPallet);
    CanvasDataModule.setCanvasName(palletData.canvasName);
    CanvasDataModule.setCanvasRange(palletData.canvasRange);
    CanvasDataModule.setCanvasIndexData(palletData.canvasIndexData);
    CanvasDataModule.setCanvasMagnification(palletData.canvasMagnification);
    CanvasDataModule.setPalletName(palletData.palletName);
};
export default useSaveCanvasData;
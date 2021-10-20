// canvasにおける画面上のXY座標を示すtype
// レイヤーの位置関係は0が一番上、次いで2、1とする
export type layerdCanvasData = {
    layerName: string;
    canvasIndexData: number[];
    layerIndex: number;
    active: boolean;
};

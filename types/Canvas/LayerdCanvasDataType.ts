// canvasにおける画面上のXY座標を示すtype
// レイヤーの位置関係は0が一番上、次いで1、2...とする
export type layerdCanvasData = {
    layerName: string; // レイヤーの名前
    canvasIndexData: number[]; // レイヤーごとの描画内容
    layerIndex: number; // レイヤーの位置
    active: boolean; // レイヤーが有効かどうか
};

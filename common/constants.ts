export class constants {
    public static readonly LAYER_MAX_NUM: number = 3; // レイヤーの最大数
    public static readonly STACK_MAX_SIZE_NUM: number = 100; // 巻き戻しの限界数
    public static readonly DEFAULT_TARGET_LAYER: number = 0; // 現在どのレイヤーを対象にしているかの初期値
    public static readonly BACKGROUND_COLOR_INDEX: number = 0; // 背景色のインデックスの初期値

    public static readonly PEN_MODE = {
        // ペンモードのリスト
        pen: 'pen',
        bucket: 'bucket',
        stroke: 'stroke',
        eraser: 'eraser',
    };

    public static readonly DRAW_LAYER_CHECK_STATUS = {
        // レイヤーごとの描画の際の判定のステータス
        draw: 'status.draw',
        drawBackground: 'status.drawBackground',
        nothing: 'status.nothing',
        elaser: 'status.elaser',
    };

    public static readonly FIGURE_TOOLS_START = {
        // 図形描画の開始位置の初期値
        X: 0,
        Y: 0,
    };
}

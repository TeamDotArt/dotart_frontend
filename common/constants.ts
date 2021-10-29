export class constants {
    public static readonly CANVAS_STYLE_SIZE: number = 334; // キャンバスの表示サイズ
    public static readonly CANVAS_SIZE_MAGNIFICATION: number = 0.87; // キャンパスの表示倍率 外見上のサイズとrectの整合性をつけるため必要
    public static readonly LAYER_MAX_NUM: number = 3; // レイヤーの最大数
    public static readonly STACK_MAX_SIZE_NUM: number = 100; // 巻き戻しの限界数
    public static readonly DEFAULT_TARGET_LAYER: number = 0; // 現在どのレイヤーを対象にしているかの初期値
    public static readonly BACKGROUND_COLOR_INDEX: number = 0; // 背景色のインデックスの初期値
    public static readonly PEN_MODE = {
        //
        pen: 'pen',
        bucket: 'bucket',
    };

    public static readonly DRAW_LAYER_CHECK_STATUS = {
        draw: 'status.draw',
        drawBackground: 'status.drawBackground',
        nothing: 'status.nothing',
        elaser: 'status.elaser',
    };
}
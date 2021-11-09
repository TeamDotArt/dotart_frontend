import { Point } from '@/types/Canvas/PointType';

type lineType = {
    startCell: Point;
    endCell: Point;
    canvasRange: number;
};

/**
 * 二点を結ぶ直線の座標の配列を作る関数
 * startCell = 始点のXY座標 endCell = 終点のXY座標
 */
const useMakeLine = (lineData: lineType): Point[] => {
    const xdiff = Math.abs(lineData.startCell.X - lineData.endCell.X); // X方向の移動距離の絶対値
    const ydiff = Math.abs(lineData.startCell.Y - lineData.endCell.Y); // Y方向の移動距離の絶対値
    const xdiff2 = xdiff * 2;
    const ydiff2 = ydiff * 2;
    const Xvek = lineData.endCell.X > lineData.startCell.X ? 1 : -1; // X方向のベクトル
    const Yvek = lineData.endCell.Y > lineData.startCell.Y ? 1 : -1; // Y方向のベクトル
    // FIXME:ここの変数をこっちに書かないのを試してみる
    const cell: Point = { X: lineData.startCell.X, Y: lineData.startCell.Y }; // 塗り始めの初期位置
    const line = [];
    if (xdiff >= ydiff) {
        // Xに何マス進んだらY方向に1進むか計算し、そこから直線を描画する
        let e = -xdiff;
        for (let i = 0; i <= xdiff; i++) {
            if (
                cell.X < 0 ||
                cell.X >= lineData.canvasRange ||
                cell.Y < 0 ||
                cell.Y >= lineData.canvasRange
            )
                break;
            line.push(Object.assign({}, cell));
            cell.X += Xvek; // Xが1進む
            e += ydiff2;
            if (e >= 0) {
                cell.Y += Yvek; // Yが1進む
                e -= xdiff2; // 割り切れない場合を考え端数は切り捨てない
            }
        }
    } else {
        // 上と同様
        let e = -ydiff;
        for (let i = 0; i <= ydiff; i++) {
            if (
                cell.X < 0 ||
                cell.X >= lineData.canvasRange ||
                cell.Y < 0 ||
                cell.Y >= lineData.canvasRange
            )
                break;
            line.push(Object.assign({}, cell));
            cell.Y += Yvek;
            e += xdiff2;
            if (e >= 0) {
                cell.X += Xvek;
                e -= ydiff2;
            }
        }
    }
    return line;
};

export default useMakeLine;

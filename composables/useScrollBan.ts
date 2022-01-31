type ElementType = {
    palletArea: Element;
    layerWindow: Element;
    palletDrawer: Element;
    layerDrawer: Element;
    handleTouchMove: (e: UIEvent) => void;
    scrollControl: (target: Element) => void;
    scrollCancel: (_e: Event) => void;
    windowWidth: number;
};

/**
 * スクロールの禁止等
 */
const useScrollBan = (elementData: ElementType): void => {
    // スマホでのタッチ操作でのスクロール禁止
    // 一番上だと親要素をスクロールしてしまうので少し下に
    elementData.palletArea.scrollTop = 1;
    elementData.layerWindow.scrollTop = 1;
    elementData.palletDrawer.scrollTop = 1;
    elementData.layerDrawer.scrollTop = 1;
    // 許可した所でだけスクロールイベントを発火
    document.addEventListener('touchmove', elementData.handleTouchMove, {
        passive: false,
    });
    // スクロールした際、一番上か一番下なら少し戻す
    // スクロールする部分全部でやる
    elementData.palletArea.addEventListener('scroll', function (_event) {
        if (elementData.palletArea.scrollTop === 0) {
            elementData.palletArea.scrollTop = 1;
        } else if (
            elementData.palletArea.scrollTop +
                elementData.palletArea.clientHeight ===
            elementData.palletArea.scrollHeight
        ) {
            elementData.palletArea.scrollTop =
                elementData.palletArea.scrollTop - 1;
        }
    });
    elementData.layerWindow.addEventListener('scroll', function (_event) {
        if (elementData.layerWindow.scrollTop === 0) {
            elementData.layerWindow.scrollTop = 1;
        } else if (
            elementData.layerWindow.scrollTop +
                elementData.layerWindow.clientHeight ===
            elementData.layerWindow.scrollHeight
        ) {
            elementData.layerWindow.scrollTop =
                elementData.layerWindow.scrollTop - 1;
        }
    });
    elementData.palletDrawer.addEventListener('scroll', function (_event) {
        if (elementData.palletDrawer.scrollTop === 0) {
            elementData.palletDrawer.scrollTop = 1;
        } else if (
            elementData.palletDrawer.scrollTop +
                elementData.palletDrawer.clientHeight ===
            elementData.palletDrawer.scrollHeight
        ) {
            elementData.palletDrawer.scrollTop =
                elementData.palletDrawer.scrollTop - 1;
        }
    });
    elementData.layerDrawer.addEventListener('scroll', function (_event) {
        if (elementData.layerDrawer.scrollTop === 0) {
            elementData.layerDrawer.scrollTop = 1;
        } else if (
            elementData.layerDrawer.scrollTop +
                elementData.layerDrawer.clientHeight ===
            elementData.layerDrawer.scrollHeight
        ) {
            elementData.layerDrawer.scrollTop =
                elementData.layerDrawer.scrollTop - 1;
        }
    });
    // PC以外でwindowがスクロールしたときは戻す(念のため)
    window.addEventListener('scroll', elementData.scrollCancel, {
        passive: false,
    });
};
export default useScrollBan;

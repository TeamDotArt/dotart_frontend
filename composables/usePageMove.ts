type ElementType = {
    palletArea: Element;
    layerWindow: Element;
    palletDrawer: Element;
    layerDrawer: Element;
    handleTouchMove: (e: UIEvent) => void;
    scrollControl: (target: Element) => void;
    scrollCancel: (_e: Event) => void;
    smartModeTouchStart: (e: TouchEvent) => void;
    smartModeTouchMove: (e: TouchEvent) => void;
    smartModeTouchEnd: (e: TouchEvent) => void;
    windowWidth: number;
};

/**
 * スクロールの禁止等の解除
 */
const usePageMove = (elementData: ElementType): void => {
    // TODO: スクロールのイベントが消せてない
    // addEventListenerに直接関数を書くと消せない
    document.removeEventListener('touchmove', elementData.handleTouchMove);
    elementData.palletArea.removeEventListener('scroll', function (_event) {
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
    elementData.layerWindow.removeEventListener('scroll', function (_event) {
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
    elementData.palletDrawer.removeEventListener('scroll', function (_event) {
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
    elementData.layerDrawer.removeEventListener('scroll', function (_event) {
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
    window.removeEventListener('scroll', elementData.scrollCancel);
    document.removeEventListener('touchstart', elementData.smartModeTouchStart);
    document.removeEventListener('touchmove', elementData.smartModeTouchMove);
    document.removeEventListener('touchend', elementData.smartModeTouchEnd);
};
export default usePageMove;

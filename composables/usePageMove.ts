type ElementType = {
    palletArea: Element;
    layerWindow: Element;
    palletDrawer: Element;
    layerDrawer: Element;
    handleTouchMove: (e: UIEvent) => void;
    windowWidth: number;
};

/**
 * キャンバスデータを保存するするロジック
 */
const usePageMove = (elementData: ElementType): void => {
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
    window.removeEventListener('scroll', function (_event) {
        if (elementData.windowWidth < 960) {
            window.scrollTo({ top: 0 });
        }
    });
};
export default usePageMove;

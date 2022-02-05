import {
    Mutation,
    Action,
    VuexModule,
    getModule,
    Module,
} from 'vuex-module-decorators';
import store from '@/store/store';
import { layerdCanvasData } from '@/types/Canvas/LayerdCanvasDataType';
import { UndoRedoLayer } from '@/types/Canvas/UndoRedoLayerType';
import { CanvasDataState } from '~/types/Store/CanvasDataType';
const initCanvases = {
    layerName: 'レイヤー1',
    canvasIndexData: [],
    layerIndex: 0,
    active: true,
};
@Module({ dynamic: true, store, name: 'canvasData', namespaced: true })
class CanvasData extends VuexModule implements CanvasDataState {
    // state
    canvasRange: number = 0;
    canvasMagnification: number = 0;
    canvasName: string = 'newcanvas';
    palletName: string = 'スタンダード';
    palletColor: string[] = [
        'rgb(255, 255, 255)',
        'rgb(125, 125, 125)',
        'rgb(0, 0, 0)',
        'rgb(108, 57, 0)',
        'rgb(249, 137, 137)',
        'rgb(243, 55, 55)',
        'rgb(212, 110, 229)',
        'rgb(180, 27, 235)',
        'rgb(189, 137, 207)',
        'rgb(150, 150, 215)',
        'rgb(90, 90, 180)',
        'rgb(82, 226, 226)',
        'rgb(199, 243, 118)',
        'rgb(255, 245, 70)',
        'rgb(255, 195, 100)',
        'rgb(255, 228, 175)',
    ];

    canvasesIndexData: layerdCanvasData[] = [{ ...initCanvases }];

    undoRedoDataStack: UndoRedoLayer[] = [
        {
            undoRedoDataStack: [],
            undoRedoDataIndex: -1,
            layerIndex: 0,
        },
    ];

    // 値をセットする mutation
    @Mutation
    public setCanvasRange(num: number) {
        this.canvasRange = num;
        const indexData = [];
        // なんか知らんけど直接やったらえらいことになったので配列作ってslice()
        for (let i = 0; i < this.canvasRange * this.canvasRange; i++) {
            indexData[i] = 0;
        }
        this.canvasesIndexData[0].canvasIndexData = indexData.slice();
    }

    @Mutation
    public setCanvasMagnification(num: number) {
        this.canvasMagnification = num;
    }

    @Mutation
    public setCanvasName(str: string) {
        this.canvasName = str;
    }

    @Mutation
    public setPalletName(str: string) {
        this.palletName = str;
    }

    @Mutation
    public setPalletColor(strarr: string[]) {
        this.palletColor = strarr;
    }

    @Mutation
    public setCanvasesIndexData(data: layerdCanvasData[]) {
        this.canvasesIndexData = data;
    }

    @Mutation
    public setUndoRedoDataStack(data: UndoRedoLayer[]) {
        this.undoRedoDataStack = data;
    }

    @Mutation
    public setReset() {
        this.canvasMagnification = 0;
        this.canvasRange = 0;
        this.canvasName = 'newcanvas';
        this.canvasesIndexData = [{ ...initCanvases }];
        this.undoRedoDataStack = [
            {
                undoRedoDataStack: [],
                undoRedoDataIndex: -1,
                layerIndex: 0,
            },
        ];
    }

    // stateに向けての値の処理
    @Action({})
    public resetName() {
        this.setCanvasName('newcanvas');
    }

    @Action({})
    public reset() {
        this.setReset();
    }

    // // Mutation,Action両方を実行する 型推論がうまく働かなくなるためあんまり使わないほうがいいけど例なので一応残しとく
    // @MutationAction({
    //     mutate: ['canvasMagnification', 'canvasRange', 'canvasName'],
    // })
    // reset() {
    //     return {
    //         canvasMagnification: 0,
    //         canvasRange: 0,
    //         canvasName: 'newcanvas',
    //     };
    // }
}

// モジュール化
export const CanvasDataModule = getModule(CanvasData);

import {
    Mutation,
    Action,
    VuexModule,
    getModule,
    Module,
} from 'vuex-module-decorators';
import store from '@/store/store';
import { CanvasDataState } from '~/types/Store/CanvasDataType';

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
        'rgb(253, 192, 192)',
        'rgb(245, 82, 82)',
        'rgb(212, 110, 229)',
        'rgb(90, 90, 180)',
        'rgb(82, 226, 226)',
        'rgb(82, 195, 122)',
        'rgb(255, 245, 70)',
        'rgb(255, 195, 100)',
        'rgb(255, 228, 175)',
    ];

    canvasIndexData: number[] = [];

    // 値をセットする mutation
    @Mutation
    public setCanvasRange(num: number) {
        this.canvasRange = num;
        for (let i = 0; i < this.canvasRange * this.canvasRange; i++) {
            this.canvasIndexData[i] = 0;
        }
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
    public setCanvasIndexData(data: number[]) {
        this.canvasIndexData = data;
    }

    @Mutation
    public setReset() {
        this.canvasMagnification = 0;
        this.canvasRange = 0;
        this.canvasName = 'newcanvas';
        this.canvasIndexData = [];
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

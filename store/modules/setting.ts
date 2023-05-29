import {
    Mutation,
    VuexModule,
    getModule,
    Module,
} from 'vuex-module-decorators';
import store from '@/store/store';
import { SettingState } from '~/types/Store/SettingType';

@Module({ dynamic: true, store, name: 'setting', namespaced: true })
class Setting extends VuexModule implements SettingState {
    // state
    smartphoneMode: boolean = false;
    positionChange: boolean = false;

    // フラグを反転する
    @Mutation
    public setReverseSmartPhoneMode(flg: boolean) {
        this.smartphoneMode = flg;
    }

    @Mutation
    public setReversePotisionChange(flg: boolean) {
        this.positionChange = flg;
    }
}

// モジュール化
export const SettingModule = getModule(Setting);

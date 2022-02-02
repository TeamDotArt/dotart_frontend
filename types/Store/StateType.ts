import { CounterState } from '~/types/Store/CounterType';
import { RegisterState } from '~/types/Store/RegisterType';
import { CanvasDataState } from '~/types/Store/CanvasDataType';
import { SettingState } from '~/types/Store/SettingType';

export type State = {
    Counter: CounterState;
    Register: RegisterState;
    CanvasData: CanvasDataState;
    Setting: SettingState;
};

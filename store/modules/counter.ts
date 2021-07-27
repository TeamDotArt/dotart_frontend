import {
    Mutation,
    Action,
    VuexModule,
    getModule,
    Module,
} from 'vuex-module-decorators';
import store from '@/store/store';
import { CounterState } from '~/types/Store/CounterType';

@Module({ dynamic: true, store, name: 'counter', namespaced: true })
class Counter extends VuexModule implements CounterState {
    // state
    incrementCounter: number = 0;
    decrementCounter: number = 1000;

    // カウンタに値をセットする mutation
    @Mutation
    public SetIncrementCounter(num: number) {
        this.incrementCounter = num;
    }

    @Mutation
    public setDecrementCounter(num: number) {
        this.decrementCounter = num;
    }

    @Mutation
    public setReset() {
        this.incrementCounter = 0;
        this.decrementCounter = 1000;
    }

    // stateに向けての値の処理
    @Action({})
    public incrementHundred() {
        this.SetIncrementCounter(this.incrementCounter + 100);
    }

    @Action({})
    public decrementHundred() {
        this.setDecrementCounter(this.decrementCounter - 100);
    }

    @Action({})
    public resetCounter() {
        this.setReset();
    }
}

// モジュール化
export const CounterModule = getModule(Counter);

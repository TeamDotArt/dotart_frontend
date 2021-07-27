import {
    Mutation,
    Action,
    VuexModule,
    getModule,
    Module,
} from 'vuex-module-decorators';
import store from '@/store/store';
import { RegisterState } from '~/types/Store/RegisterType';

@Module({ dynamic: true, store, name: 'register', namespaced: true })
class Register extends VuexModule implements RegisterState {
    // state
    userId: string = '';
    password: string = '';
    mail: string = '';

    @Mutation
    public setUserId(userid: string) {
        this.userId = userid;
    }

    @Mutation
    public setPassword(password: string) {
        this.password = password;
    }

    @Mutation
    public setMail(mail: string) {
        this.mail = mail;
    }

    @Action({})
    public userIdAction(userid: string) {
        if (userid.length > 1) {
            this.setUserId(userid);
        } else {
            this.setUserId('error');
        }
    }

    @Action({})
    public passwordAction(password: string) {
        if (password.length >= 3) {
            this.setPassword(password);
        } else {
            this.setPassword('error');
        }
    }

    @Action({})
    public mailAction(mail: string) {
        if (mail.includes('@')) {
            this.setMail(mail);
        } else {
            this.setMail('error');
        }
    }
}

// モジュール化
export const RegisterModule = getModule(Register);

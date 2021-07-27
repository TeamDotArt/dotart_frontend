import { Middleware } from '@nuxt/types';

const userAuth: Middleware = ({ store, redirect }) => {
    if (!store.state.auth.loggedIn) {
        redirect('/');
    }
};
export default userAuth;

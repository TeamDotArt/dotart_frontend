<template>
    <v-app dark class="dot">
        <!-- appbar  :clipped-left="clipped"-->
        <v-app-bar color="primary" fixed app>
            <v-toolbar-title
                class="cousor"
                @click="homerouting"
                v-text="state.title"
            />
            <!--<v-img src="/logo.svg" aspect-ratio="1.7" @></v-img>-->
            <v-spacer />
            <!-- <div v-if="(this as any).$auth.loggedIn">test</div> -->

            <!-- staging環境ではログインを動かさない -->
            <!-- <div v-if="!this.$store.state.auth.loggedIn">
                <LoginMenu />
            </div>
            <div v-else>
                <LogoutMenu />
            </div> -->
        </v-app-bar>
        <!-- main -->
        <v-main>
            <v-container>
                <nuxt />
            </v-container>
        </v-main>
        <!-- footer -->
        <v-footer v-if="isCreator" :fixed="state.fixed" color="primary" app>
            <v-spacer />
            <span>{{ state.title }}</span>
            <span>{{ copyRightYear }}</span>
        </v-footer>
    </v-app>
</template>

<script lang="ts">
import {
    computed,
    defineComponent,
    reactive,
    useRouter,
    useContext,
} from '@nuxtjs/composition-api';
export default defineComponent({
    name: 'DefaultPage',
    components: {},
    setup(_) {
        const router = useRouter();
        const { route } = useContext();

        const state = reactive({
            fixed: false,
            title: process.env.APP_NAME,
        });

        const isCreator = computed((): boolean => {
            const path = route.value.path;
            if (path === '/creator/canvas') {
                return false;
            } else {
                return true;
            }
        });

        const copyRightYear = computed((): string | number => {
            const start: number = 2019;
            const now: number = new Date().getFullYear();
            return start === now ? start : `${start} - ${now}`;
        });

        const homerouting = (): void => {
            router.push('/');
        };

        return { state, isCreator, copyRightYear, homerouting };
    },
});
</script>

<style lang="scss" scoped>
.cousor {
    cursor: pointer;
}
.dot {
    font-family: 'Dot Font';
}
</style>

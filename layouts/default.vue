<template>
    <v-app dark class="dot">
        <!-- appbar  :clipped-left="clipped"-->
        <v-app-bar color="primary" fixed app>
            <v-toolbar-title
                class="cousor"
                @click="homerouting"
                v-text="title"
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
        <v-content>
            <v-container>
                <nuxt />
            </v-container>
        </v-content>
        <!-- footer -->
        <v-footer v-if="isCreator" :fixed="fixed" color="primary" app>
            <v-spacer />
            <span>{{ title }}</span>
            <span>{{ copyRightYear }}</span>
        </v-footer>
    </v-app>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';
// import LogoutMenu from '@/components/Organisms/LogoutMenu.vue';
// import LoginMenu from '@/components/Organisms/LoginMenu.vue';

@Component({
    components: {
        // LoginMenu,
        // LogoutMenu,
    },
})
export default class DefaultPage extends Vue {
    // data()
    fixed: boolean = false;
    title: string | undefined = process.env.APP_NAME;

    get isCreator() {
        const path = this.$route.path;
        if (path === '/creator/canvas') {
            return false;
        } else {
            return true;
        }
    }

    homerouting(): void {
        this.$router.push('/');
    }

    // computed
    get copyRightYear(): string | number {
        const start: number = 2019;
        const now: number = new Date().getFullYear();
        return start === now ? start : `${start} - ${now}`;
    }
}
</script>

<style lang="scss" scoped>
.cousor {
    cursor: pointer;
}
.dot {
    font-family: 'Dot Font';
}
</style>

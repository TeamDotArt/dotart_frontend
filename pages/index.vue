<template>
    <section class="home">
        <Hero />
        <About />
        <Info />
        <transition name="fade">
            <v-btn
                v-show="scrollState.isShowUp"
                fixed
                fab
                bottom
                right
                color="#CE93E8"
                style="bottom: 50px"
                @click="topScroll"
            >
                <v-icon color="white">mdi-chevron-up</v-icon>
            </v-btn>
        </transition>
    </section>
</template>

<script lang="ts">
import {
    computed,
    defineComponent,
    onMounted,
    reactive,
} from '@nuxtjs/composition-api';
import Hero from '../components/Home/Hero.vue';
import About from '../components/Home/About.vue';
import Info from '../components/Home/Info.vue';

type Cards = {
    title: string;
    subtitle: string;
    link: string;
    infomation: string | null;
    flex: number;
};

export default defineComponent({
    name: 'index',
    layout: 'homeLayout',
    components: {
        Hero,
        About,
        Info,
    },
    setup(_, context) {
        const minHeight = computed((): string => {
            const height = context.root.$vuetify.breakpoint.mdAndUp
                ? '100vh'
                : '50vh';
            return `calc(${height} - ${context.root.$vuetify.application.top}px)`;
        });
        const cardState = reactive<{ links: string[]; cards: Cards[] }>({
            links: ['Dashboard', 'Messages', 'Profile', 'Updates'],
            cards: [
                {
                    title: 'ドット絵クリエイター',
                    subtitle: 'ドット絵を作ってみよう！',
                    link: '/creator/',
                    infomation: null,
                    flex: 12,
                },
                {
                    title: 'お知らせ',
                    subtitle: 'version 0.0.8β',
                    link: '/',
                    infomation:
                        '現在テスト環境です。\nバグ等あるかもしれませんがご了承ください。',
                    flex: 12,
                },
            ],
        });
        const scrollState = reactive({
            isShowUp: false,
        });
        const onScreenEvent = () => {
            scrollState.isShowUp = window.pageYOffset >= 23;
        };

        const topScroll = () => {
            window.scrollTo(0, 0);
        };

        onMounted(() => {
            window.addEventListener('scroll', onScreenEvent);
            window.addEventListener('resize', onScreenEvent);
            window.addEventListener('load', onScreenEvent);
        });

        return { cardState, scrollState, minHeight, topScroll };
    },
});
</script>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
    opacity: 0;
}
.home {
    padding-bottom: 50px;
}
</style>

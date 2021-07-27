<template>
    <section class="home-hero">
        <v-parallax :src="require('@/assets/light.png')" style="height: 100vh">
            <v-container fluid fill-height class="home-hero__content">
                <v-row>
                    <v-col class="home-hero__content-text">
                        <div class="home-hero__card">
                            <v-card hover color="rgba(255, 255, 255, 0.7)">
                                <p>Welcome to DotArt.</p>
                                <p>
                                    ドット絵をWeb上で描けるクリエイターアプリケーション.
                                </p>
                                <p>
                                    下のボタンから早速ドット絵を描き始めてみよう！
                                </p>
                            </v-card>
                        </div>
                        <div>
                            <v-btn
                                x-large
                                class="ma-2"
                                color="primary"
                                to="/creator/"
                            >
                                ドット絵を作成する
                            </v-btn>
                        </div>
                    </v-col>
                </v-row>
            </v-container>
        </v-parallax>
    </section>
</template>

<script lang="ts">
import { defineComponent, reactive } from '@nuxtjs/composition-api';

type Cards = {
    title: string;
    subtitle: string;
    link: string;
    infomation: string | null;
    flex: number;
};

export default defineComponent({
    name: 'Hero',
    setup() {
        const cardState = reactive<{ links: string[]; cards: Cards[] }>({
            links: ['Dashboard', 'Messages', 'Profile', 'Updates'],
            cards: [
                // {
                //     title: 'ログイン',
                //     subtitle: 'ログイン、新規登録はこちらから出来ます。',
                //     link: '/login/',
                //     flex: 12,
                // },
                {
                    title: 'ドット絵クリエイター',
                    subtitle: 'ドット絵を作ってみよう！',
                    link: '/creator/',
                    infomation: null,
                    flex: 12,
                },
                // {
                //     title: '投稿ページ',
                //     subtitle: 'ドット絵の投稿ページ',
                //     link: '/sns/',
                //     flex: 6,
                // },
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

        return {
            cardState,
        };
    },
});
</script>

<style lang="scss" scoped>
.home-hero__content {
    width: 100%;
    height: 100vh;

    &-text {
        color: aliceblue;
        text-align: center;
        font-size: 28px;
        font-weight: bold;
    }
}
.home-hero__card {
    margin: 5vw;
    padding: 10px;
}

.home-hero__infomation {
    margin-top: 5vw;
    margin-left: 20vw;
    margin-right: 20vw;
}
</style>

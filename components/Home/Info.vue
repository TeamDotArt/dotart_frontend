<template>
    <section class="home-about">
        <div class="section__title">
            <div class="section__title-text">Infomation</div>
        </div>
        <v-container>
            <div class="home-about__contents">
                <div class="font-weight-bold mb-2">開発開始</div>
                <v-timeline align-top :dense="$vuetify.breakpoint.smAndDown">
                    <v-timeline-item
                        v-for="(item, i) in cardState.items"
                        :key="i"
                        :color="item.color"
                        :icon="item.icon"
                        fill-dot
                    >
                        <v-card :color="item.color" elevation="5" dark>
                            <v-card-title class="text-h6">
                                {{ item.title }}
                            </v-card-title>
                            <v-card-text class="white text--primary top pt-5">
                                <p>
                                    {{ item.message }}
                                </p>
                                <p>
                                    {{ item.created_at }}
                                    <span>{{ item.version }}</span>
                                </p>
                            </v-card-text>
                        </v-card>
                    </v-timeline-item>
                </v-timeline>
            </div>
        </v-container>
    </section>
</template>

<script lang="ts">
import { defineComponent, reactive } from '@nuxtjs/composition-api';

type Card = {
    color: string;
    icon: string;
    title: string;
    createdAt: string;
    message: string;
    version: string;
};

type Items = {
    items: Card[];
};

export default defineComponent({
    name: 'Info',
    setup() {
        const cardState = reactive<Items>({
            items: [
                {
                    color: 'red lighten-2',
                    icon: 'mdi-star',
                    title: 'ドット絵が描けるように',
                    createdAt: '2021/05/10',
                    message: 'ドット絵が描けるように実装',
                    version: '0.0.1β',
                },
                {
                    color: 'indigo lighten-2',
                    icon: 'mdi-star',
                    title: 'テストデプロイ',
                    createdAt: '2021/05/13',
                    message:
                        '現在テスト環境です。バグ等あるかもしれませんがご了承ください。',
                    version: '0.0.8β',
                },
                {
                    color: 'green lighten-1',
                    icon: 'mdi-book-variant',
                    title: 'ホーム画面の見た目を一掃',
                    createdAt: '2021/06/29',
                    message: '見やすい画面に修正しました！',
                    version: '0.1.0β',
                },
                {
                    color: 'pink lighten-1',
                    icon: 'mdi-access-point',
                    title: '全体的なレイアウトを見やすくした',
                    createdAt: '2022/01/31',
                    message: '見やすい画面に修正しました！',
                    version: '0.1.5β',
                },
                {
                    color: 'yellow lighten-1',
                    icon: 'mdi-application-edit-outline',
                    title: 'スマホモード実装',
                    createdAt: '2022/02/02',
                    message: 'スマホで扱いやすいモードを実装しました！',
                    version: '0.1.8β',
                },
                {
                    color: 'purple lighten-1',
                    icon: 'mdi-draw',
                    title: 'リリースしました！',
                    createdAt: '2022/02/02',
                    message: 'バグ修正などをし、リリースしました！',
                    version: '0.2.0',
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
.home-about__contents {
    margin-top: 20px;
    justify-content: center;
    text-align: center;

    &-img {
        text-align: center;
    }

    &-text {
        word-wrap: break-word;
    }
}
.section__title {
    padding-top: 120px;
    text-align: center;

    &-text {
        font-weight: 700;
        font-size: 40px;
        color: #e65f78;
    }
}
.section__title {
    padding-top: 120px;
    text-align: center;

    &-text {
        font-weight: 700;
        font-size: 40px;
        color: #e65f78;
    }
}

.img-fluid {
    max-width: 100%;
    height: auto;
}
</style>

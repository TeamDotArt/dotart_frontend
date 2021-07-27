<template>
    <section class="home-about">
        <div class="section__title">
            <div class="section__title-text">About Me</div>
        </div>
        <v-container>
            <v-row class="home-about__contents">
                <v-col md="5" class="home-about__contents-img">
                    <img
                        :src="require('@/assets/dotart_ios.jpg')"
                        alt="dotart_ios"
                        class="img-fluid"
                    />
                </v-col>
                <v-col md="5" class="home-about__contents-text">
                    <div class="section__title-text">01. DotArtとは</div>
                    <p>
                        Web上でドット絵を描くことができるアプリケーションです。
                    </p>
                    <p>
                        WebアプリなのでPCや携帯端末、タブレット問わずにブラウザにアクセスできる端末であればどのプラットフォームでも使用が可能です。
                    </p>
                </v-col>
            </v-row>
            <v-row class="home-about__contents">
                <v-col md="5" class="home-about__contents-img">
                    <img
                        :src="require('@/assets/canvas.png')"
                        alt="canvas"
                        class="img-fluid"
                    />
                </v-col>
                <v-col md="5" class="home-about__contents-text">
                    <div class="section__title-text">02. 使用方法</div>
                    <p>
                        上記のドット絵作成ボタンを押すことでキャンバスや使うパレットの設定が行えます。
                    </p>
                    <p>
                        キャンバス名、使用したいパレット、キャンバスサイズの選択を選びましょう！
                    </p>
                </v-col>
            </v-row>
            <v-row class="home-about__contents">
                <v-col md="5" class="home-about__contents-img">
                    <img
                        :src="require('@/assets/dotart.png')"
                        alt="dotart"
                        class="img-fluid"
                    />
                </v-col>
                <v-col md="5" class="home-about__contents-text">
                    <div class="section__title-text">03. 楽しみましょう！</div>
                    <p>DotArtで作成したドット絵は自由に使用可能です！</p>
                    <p>
                        SNSのアイコンを作成したりマウスポインタの画像を描いたり素材を作ったり楽しみ方は無限大です！
                    </p>
                </v-col>
            </v-row>
        </v-container>
    </section>
</template>

<style lang="scss" scoped>
.home-about__contents {
    margin-top: 20px;
    justify-content: center;

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

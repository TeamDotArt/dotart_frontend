import { NuxtConfig } from '@nuxt/types';
import colors from 'vuetify/es5/util/colors';
import { Auth } from 'nuxtjs__auth';

declare module 'vue/types/vue' {
    interface Vue {
        $auth: Auth;
    }
}

const manifestIcon = 'static/icon.png';
const nuxtConfig: NuxtConfig = {
    target: 'static',
    ssr: false,
    /*
     ** Headers of the page
     */
    head: {
        titleTemplate: '%s - ' + process.env.npm_package_name,
        title: process.env.npm_package_name || '',
        meta: [
            { charset: 'utf-8' },
            {
                name: 'viewport',
                content: 'width=device-width, initial-scale=1',
            },
            {
                hid: 'description',
                name: 'description',
                content: process.env.npm_package_description || '',
            },
            {
                hid: 'og:site_name',
                property: 'og:site_name',
                content: 'DotArt',
            },
            { hid: 'og:type', property: 'og:type', content: 'website' },
            {
                hid: 'og:url',
                property: 'og:url',
                content: 'https://dotart.riml.work',
            },
            {
                hid: 'og:title',
                property: 'og:title',
                content: process.env.npm_package_name || '',
            },
            {
                hid: 'og:description',
                property: 'og:description',
                content: process.env.npm_package_description || '',
            },
            { hid: 'og:image', property: 'og:image', content: '/icon.png' },
            // SEO関連
            // Twitter
            { name: 'twitter:card', content: 'summary' },
            {
                hid: 'twitter:image',
                name: 'twitter:image',
                content: '/icon.png',
            },
            // Google
            {
                name: 'google-site-verification',
                content: 'S21KcYa2yOT-Sk8_QFZJq_H6UuhkIGPm9C-ZP0J__nU',
            },
            { name: 'apple-mobile-web-app-capable', content: 'yes' },
            {
                name: 'apple-mobile-web-app-status-bar-style',
                content: 'black-translucent',
            },
        ],
        link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    },
    icon: {
        iconFileName: manifestIcon,
    },
    /*
     ** Customize the progress-bar color
     */
    // loading: { color: '#fff' },
    // loading: '~/components/loading.vue',
    /*
     ** Global CSS
     */
    css: ['@/assets/main.scss'],
    /*
     ** Plugins to load before mounting the App
     */
    plugins: [{ src: '~/plugins/axios.ts', ssr: false }],
    /*
     ** Nuxt.js dev-modules
     */
    buildModules: [
        '@nuxt/typescript-build',
        '@nuxtjs/vuetify',
        '@nuxtjs/pwa',
        '@nuxtjs/composition-api/module',
        [
            '@nuxtjs/google-analytics',
            {
                id: 'UA-200790484-2',
            },
        ],
    ],

    /*
     ** Nuxt.js modules
     */
    modules: [
        // Doc: https://axios.nuxtjs.org/usage
        '@nuxtjs/axios',
        '@nuxtjs/pwa',
        '@nuxtjs/auth',
        '@nuxtjs/proxy',
    ],
    /* storybook */
    storybook: {
        addons: [
            '@storybook/addon-actions/register',
            '@storybook/addon-backgrounds/register',
            '@storybook/addon-controls/register',
            '@storybook/addon-docs/register',
            '@storybook/addon-toolbars/register',
            '@storybook/addon-viewport/register',
        ],
    },
    manifest: {
        name: 'DotArt',
        title: 'DotArt',
        'og:title': 'DotArt',
        description: 'ドット絵を作るWebアプリです！',
        'og:description': 'ドット絵を作るWebアプリです！',
        display: 'standalone',
        lang: 'ja',
        theme_color: '#CE93D8',
        background_color: '#CE93D8',
        icons: [
            {
                src: '/icon.png',
                sizes: '512x512',
                type: 'image/png',
            },
        ],
    },
    // workbox: {
    //     swDest: '/sw.js',
    //     dev: true,
    // },
    // workbox: {
    //   dev: true // 開発時にもPWAを有効化
    // },
    /*
     ** Axios module configuration
     ** See https://axios.nuxtjs.org/options
     */
    axios: {
        // endpoint
        // host: 'localhost',
        // port: 8080,
        // withCredentials: true
        proxy: true,
    },
    proxy: {
        '/api/v1/': {
            target: 'http://127.0.0.1:8080',
            changeOrigin: true,
            secure: false,
        },
    },
    auth: {
        // リダイレクト
        redirect: {
            login: '/login', // 未ログイン時に認証ルートへアクセスした際のリダイレクトURL
            logout: '/login', // ログアウト時のリダイレクトURL
            callback: false, // Oauth認証等で必要となる コールバックルート
            home: '/', // ログイン後のリダイレクトURL
        },
        // Auth Moduleのどの認証ロジックを使うか
        strategies: {
            local: {
                endpoints: {
                    // ログイン処理
                    login: {
                        url: '/api/v1/login',
                        method: 'post',
                        propertyName: 'token',
                    },
                    // ログアウト処理
                    logout: { url: '/api/v1/logout', method: 'post' },
                    // Userデータ取得
                    user: {
                        url: '/api/v1/me',
                        method: 'get',
                        propertyName: false,
                    },
                    // user: false
                },
            },
        },
    },
    // router: {
    //   middleware: ['auth']
    // },
    /*
     ** vuetify module configuration
     ** https://github.com/nuxt-community/vuetify-module
     */
    vuetify: {
        customVariables: ['~/assets/variables.scss'],
        theme: {
            // テーマの切り替えフラグ
            dark: false,
            light: true,
            themes: {
                light: {
                    primary: '#CE93D8',
                    secondary: colors.grey.darken1,
                    accent: colors.shades.black,
                    error: colors.red.accent3,
                },
                dark: {
                    primary: colors.blue.darken2,
                    accent: colors.grey.darken3,
                    secondary: colors.amber.darken3,
                    info: colors.teal.lighten1,
                    warning: colors.amber.base,
                    error: colors.deepOrange.accent4,
                    success: colors.green.accent3,
                },
            },
        },
    },
    env: {
        APP_NAME: String(process.env.npm_package_name),
    },
    /*
     ** Build configuration
     */
    build: {
        /*
         ** You can extend webpack config here
         */
        extend(_config: any, _ctx: any) {},
    },
};
module.exports = nuxtConfig;

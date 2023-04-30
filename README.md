# dotart

https://dotart.riml.work

dotartとはWeb上でドット絵を簡単に描くことができるサービスになっています。
スマートフォンデバイスからアクセスすることでモバイルモードを利用することができます。

※モバイルモードとは、指で描く際にタップした箇所に直接描かれてしまうと細い描画が難しいためマウスカーソルのようなポインタを表示し、それを片手で操作、もう片手で描画ボタンをタッチすることで絵を描くことができるモードになっています。

## 環境

### 開発環境
- Nuxtjs(Vue.js)
- TypeScript
- Vuex
- Nuxt-vite

### インフラ環境
- Netlify
- sentry
- google analyics

## インフラ構成図

<img alt="インフラ構成図" src="./dotart.drawio.svg"/>

## 実行方法

開発環境
```bash
yarn dev
```

ビルド
```bash
yarn build
```

本番実行
```bash
yarn start
```

静的生成
```bash
yarn generate
```

Lint
```bash
yarn lint
```

サーバサイドは [バックエンドリポジトリ](https://github.com/TeamDotArt/dotart_backend) を確認してください。

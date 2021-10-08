module.exports = {
    root: true,
    env: {
        browser: true,
        node: true,
    },
    extends: [
        '@nuxtjs/eslint-config-typescript',
        'prettier',
        'plugin:nuxt/recommended',
    ],
    plugins: [],
    // add your custom rules here
    rules: {},
};

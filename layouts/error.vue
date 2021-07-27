<template>
    <v-app dark>
        <h1 v-if="error.statusCode === 404">{{ pageNotFound }}</h1>
        <h1 v-else>{{ otherError }}</h1>
        <NuxtLink to="/">Home page</NuxtLink>
    </v-app>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator';

// Componentの読み込み
@Component({ layout: 'empty' })

// TypeScriptの処理
export default class ErrorPage extends Vue {
    pageNotFound: string = '404 Not Found';
    otherError: string = 'An error occurred';

    @Prop({ type: Object, default: null })
    error: any;

    head(): string | { title: string } {
        const title =
            this.error.statusCode === 404 ? this.pageNotFound : this.otherError;
        return {
            title,
        };
    }
}
</script>

<style lang="scss" scoped>
h1 {
    font-size: 20px;
}
</style>

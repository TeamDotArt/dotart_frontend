<template>
    <v-app dark>
        <h1 v-if="error.statusCode === 404">{{ pageState.pageNotFound }}</h1>
        <h1 v-else>{{ pageState.otherError }}</h1>
        <NuxtLink to="/">Home page</NuxtLink>
    </v-app>
</template>

<script lang="ts">
import {
    defineComponent,
    reactive,
    toRefs,
    useMeta,
} from '@nuxtjs/composition-api';

export default defineComponent({
    name: 'ErrorPage',
    layout: 'empty',
    props: {
        error: {
            type: Object,
            default: null,
        },
    },
    setup(props) {
        const { error } = toRefs(props);
        const pageState = reactive({
            pageNotFound: '404 Not Found',
            otherError: 'An error occurred',
        });

        useMeta({
            title:
                error.value.statusCode === 404
                    ? pageState.pageNotFound
                    : pageState.otherError,
        });

        return {
            pageState,
        };
    },
    head: {},
});
</script>

<style lang="scss" scoped>
h1 {
    font-size: 20px;
}
</style>

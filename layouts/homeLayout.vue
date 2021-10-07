<template>
    <v-app class="dot">
        <v-app-bar color="primary" fixed app>
            <v-toolbar-title
                class="cousor"
                @click="toHome"
                v-text="headerState.title"
            />
            <v-spacer />
        </v-app-bar>

        <v-main>
            <nuxt />
        </v-main>

        <v-footer
            v-if="isCreator"
            :fixed="headerState.fixed"
            color="primary"
            app
        >
            <v-spacer />
            <span>{{ headerState.title }}</span>
            <span>{{ copyRightYear }}</span>
        </v-footer>
    </v-app>
</template>

<script lang="ts">
import {
    computed,
    defineComponent,
    reactive,
    useContext,
} from '@nuxtjs/composition-api';

import useHomeRouting from '@/composables/useHomeRouting';

export default defineComponent({
    name: 'HomeLayout',
    setup(_) {
        const { route } = useContext();
        const toHome = useHomeRouting();

        const headerState = reactive({
            fixed: false,
            title: process.env.APP_NAME,
        });

        const isCreator = computed((): boolean => {
            const path = route.value.path;
            if (path === '/creator/canvas') {
                return false;
            } else {
                return true;
            }
        });

        const copyRightYear = computed((): string | number => {
            const start: number = 2019;
            const now: number = new Date().getFullYear();
            return start === now ? start : `${start} - ${now}`;
        });
        return { isCreator, headerState, toHome, copyRightYear };
    },
});
</script>

<style lang="scss" scoped>
.dot {
    font-family: 'Dot Font';
}
</style>

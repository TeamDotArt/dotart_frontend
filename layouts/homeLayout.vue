<template>
    <v-app class="dot">
        <v-app-bar color="primary" fixed app>
            <v-toolbar-title
                class="cousor"
                @click="homerouting"
                v-text="headerState.title"
            />
            <v-spacer />
        </v-app-bar>

        <v-content>
            <nuxt />
        </v-content>

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
import { computed, defineComponent, reactive } from '@nuxtjs/composition-api';

export default defineComponent({
    name: 'homeLayout',
    setup(_, context) {
        const headerState = reactive({
            fixed: false,
            title: process.env.APP_NAME,
        });

        const isCreator = computed((): boolean => {
            const path = context.root.$route.path;
            if (path === '/creator/canvas') {
                return false;
            } else {
                return true;
            }
        });

        const homerouting = (): void => {
            context.root.$router.push('/');
        };

        const copyRightYear = computed((): string | number => {
            const start: number = 2019;
            const now: number = new Date().getFullYear();
            return start === now ? start : `${start} - ${now}`;
        });
        return { isCreator, headerState, homerouting, copyRightYear };
    },
});
</script>

<style lang="scss" scoped>
.dot {
    font-family: 'Dot Font';
}
</style>

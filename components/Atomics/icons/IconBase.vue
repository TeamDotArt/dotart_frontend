<template>
    <svg
        xmlns="http://www.w3.org/2000/svg"
        :width="width"
        :height="height"
        viewBox="0 0 18 18"
        :aria-labelledby="iconName"
        role="presentation"
    >
        <title :id="iconName" lang="en">{{ iconName }} icon</title>
        <g :fill="iconColor" :stroke="iconColor">
            <slot />
        </g>
    </svg>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator';
@Component
export default class IconBase extends Vue {
    @Prop({ default: '' }) iconName!: string;
    @Prop({ default: '32' }) width!: string;
    @Prop({ default: '32' }) height!: string;
    @Prop({ default: 'currentColor' }) iconColor!: string;
}
</script>

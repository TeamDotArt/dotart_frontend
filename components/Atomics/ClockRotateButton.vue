<template>
    <button @click="clickEvent">
        <icon-Base width="32" height="32">
            <clockRotateIcon />
        </icon-Base>
    </button>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator';
// import { canvasDataModule } from '../../store/modules/canvasData';
import IconBase from '@/components/Atomics/icons/IconBase.vue';
import ClockRotateIcon from '@/components/Atomics/icons/ClockRotateIcon.vue';

@Component({
    components: {
        IconBase,
        ClockRotateIcon,
    },
})
export default class ClockRotateButton extends Vue {
    @Prop({ type: Function })
    clickEvent!: Function;
}
</script>
<style lang="scss" scoped>
/* */
</style>

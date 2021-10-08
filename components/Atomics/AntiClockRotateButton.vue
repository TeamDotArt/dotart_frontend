<template>
    <button @click="clickEvent">
        <icon-Base width="32" height="32">
            <antiClockRotateIcon />
        </icon-Base>
    </button>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator';
// import { canvasDataModule } from '../../store/modules/canvasData';
import IconBase from '@/components/Atomics/icons/IconBase.vue';
import AntiClockRotateIcon from '@/components/Atomics/icons/AntiClockRotateIcon.vue';

@Component({
    components: {
        IconBase,
        AntiClockRotateIcon,
    },
})
export default class AntiClockRotateButton extends Vue {
    @Prop({ type: Function })
    clickEvent!: Function;
}
</script>
<style lang="scss" scoped>
/* */
</style>

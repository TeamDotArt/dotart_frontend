<template>
    <button @click="clickEvent">
        <icon-Base width="36" height="36" icon-name="redoIcon"
            ><redoIcon
        /></icon-Base>
    </button>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator';
// import { canvasDataModule } from '../../store/modules/canvasData';
import IconBase from '@/components/Atomics/Icons/IconBase.vue';
import RedoIcon from '@/components/Atomics/Icons/RedoIcon.vue';

@Component({
    components: {
        IconBase,
        RedoIcon,
    },
})
export default class RedoButton extends Vue {
    @Prop({ type: Function })
    clickEvent!: Function;
}
</script>
<style lang="scss" scoped>
/* */
</style>

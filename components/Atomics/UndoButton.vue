<template>
    <button @click="clickEvent">
        <icon-Base width="36" height="36" icon-name="undoIcon"
            ><undoIcon
        /></icon-Base>
    </button>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator';
// import { canvasDataModule } from '../../store/modules/canvasData';
import IconBase from '@/components/Atomics/Icons/IconBase.vue';
import UndoIcon from '@/components/Atomics/Icons/UndoIcon.vue';

@Component({
    components: {
        IconBase,
        UndoIcon,
    },
})
export default class UndoButton extends Vue {
    @Prop({ type: Function })
    clickEvent!: Function;
}
</script>
<style lang="scss" scoped>
/* */
</style>

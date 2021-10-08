<template>
    <button @click="clickEvent">
        <icon-Base width="32" height="32">
            <gridIcon />
        </icon-Base>
    </button>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator';
// import { canvasDataModule } from '../../store/modules/canvasData';
import IconBase from '@/components/Atomics/icons/IconBase.vue';
import GridIcon from '@/components/Atomics/icons/GridIcon.vue';

@Component({
    components: {
        IconBase,
        GridIcon,
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

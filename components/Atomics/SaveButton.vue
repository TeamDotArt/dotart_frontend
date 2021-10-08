<template>
    <button @click="clickEvent">
        <icon-Base width="32" height="32">
            <saveIcon />
        </icon-Base>
    </button>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator';
// import { canvasDataModule } from '../../store/modules/canvasData';
import IconBase from '@/components/Atomics/icons/IconBase.vue';
import SaveIcon from '@/components/Atomics/icons/SaveIcon.vue';

@Component({
    components: {
        IconBase,
        SaveIcon,
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

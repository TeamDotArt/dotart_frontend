<template>
    <button @click="clickEvent">
        <icon-Base width="32" height="32">
            <settingIcon />
        </icon-Base>
    </button>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import IconBase from '@/components/Atomics/icons/IconBase.vue';
import SettingIcon from '@/components/Atomics/icons/SettingIcon.vue';

export default defineComponent({
    name:"SettingButton",
    components: {
        IconBase,
        SettingIcon,
    },
    props: {
        clickEvent: {
        type: Function,
        required: true
        }
    }
})
</script>
<style lang="scss" scoped>
/* */
</style>

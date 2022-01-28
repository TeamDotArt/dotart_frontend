<template>
    <div class="settingMenu">
        <transition name="popupMenu">
            <div
                v-show="settingDrawerFlg"
                class="settingDrawerMenuArea__Wrapper"
            >
                <div class="settingDrawerMenu">
                    <!-- ここにメニューの内容を書いていく -->
                    <button class="switch" @click="settingDrawerTransrate">
                        ▼
                    </button>
                    <div class="settingDrawerdefault"></div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api';
import ToggleSwitch from '@/components/Atomics/toggleSwitch.vue';

export default defineComponent({
    name: 'SettingDrawer',
    components: { ToggleSwitch },
    props: {
        settingDrawerFlg: {
            type: Boolean,
            default: true,
        },
        settingDrawerTransrate: {
            type: Function,
            required: true,
            default: () => {},
        },
    },
    setup() {},
});
</script>

<style lang="scss" scoped>
$defaultHeight: 30px; //格納状態でのメニューのheight
$movedHeight: 230px; //展開状態でのメニューのheight
$movePercentage: 100% * (1 - $defaultHeight/$movedHeight); //transformの割合
//@debug $movePercentage;
.settingMenu {
    display: flex;
    position: fixed;
    width: 100%;
    bottom: 0;
    right: 0px;
    @media screen and (min-width: 960px) {
        display: none;
    }
    @media screen and (min-width: 600px) and (max-width: 960px) {
        display: none;
    }
    @media screen and (max-width: 600px) {
    }
}
.settingDrawerdefault {
    vertical-align: top;
    justify-content: space-between;
}
.switch {
    vertical-align: top;
    margin-top: 6px;
}
.popupMenu {
    @media screen and (min-width: 960px) {
    }
    @media screen and (min-width: 600px) and (max-width: 960px) {
    }
    @media screen and (max-width: 600px) {
    }
}
.popupMenu-enter-active,
.popupMenu-leave-active {
    transform: translate(0px, 0px);
    transition: transform 225ms cubic-bezier(0, 0, 0.2, 1) 0ms;
}
.popupMenu-enter,
.popupMenu-leave-to {
    transform: translateY($movePercentage);
}
.settingDrawerMenuArea__Wrapper {
    position: absolute;
    text-align: center;
    margin-left: auto;
    margin-right: auto;
    z-index: 2;
    right: 0;
    left: 0;
    bottom: 0;
    width: 100%;
    height: $movedHeight;
    background-color: rgba(233, 95, 192);
}
</style>

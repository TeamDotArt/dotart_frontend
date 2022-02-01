<template>
    <div class="switchArea">
        <input id="switch" type="checkbox" @change="changeFlag" />
        <label for="switch"></label>
        <div id="circle"></div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api';
import { SettingModule } from '~/store/modules/setting';

export default defineComponent({
    name: 'ToggleSwitch',
    components: {},
    setup() {
        const changeFlag = () => {
            SettingModule.setReverseSmartPhoneMode();
        };

        return { changeFlag };
    },
});
</script>

<style lang="scss" scoped>
.switchArea {
    line-height: 44px;
    letter-spacing: 0;
    text-align: center;
    font-size: 19px;
    position: relative;
    width: 100px;
    input[type='checkbox'] {
        display: none;
    }
    label {
        display: block;
        box-sizing: border-box;
        height: 44px;
        border: 2px solid #fff;
        border-radius: 22px;
    }
    input[type='checkbox']:checked + label {
        border-color: #fff;
    }
    label span:after {
        content: 'OFF';
        padding: 0 0 0 26px;
        color: #fff;
    }
    input[type='checkbox']:checked + label span:after {
        content: 'ON';
        padding: 0 26px 0 0;
        color: #fff;
    }
    #circle {
        position: absolute;
        width: 26px;
        height: 26px;
        background: #fff;
        top: 9px;
        left: 8px;
        border-radius: 18px;
        transition: 0.2s;
    }
    input[type='checkbox']:checked ~ #circle {
        transform: translateX(57px);
        background: #84fabf;
    }
}
</style>

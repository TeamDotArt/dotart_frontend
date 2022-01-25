<template>
    <div class="palletWindow">
        <div class="palletWindowTitle">パレット</div>
        <v-row class="palletArea" dense>
            <v-col
                v-for="(item, index) in colorPallet"
                :key="item"
                class="palletWrapper"
                cols="3"
            >
                <pallet-item
                    :color="item"
                    :index="index"
                    :selected-index="palletIndex"
                    :get-pallet-color="getPalletColor"
                ></pallet-item>
            </v-col>
        </v-row>
        <div class="palletSettingButtonAreaWrapper">
            <div class="palletSettingButtonArea">
                <button class="palletSettingButton">パレット追加</button>
                <button class="palletSettingButton">色の変更</button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api';
import PalletItem from '@/components/Atomics/PalletItem.vue';

export default defineComponent({
    name: 'PalletWindow',
    components: {
        PalletItem,
    },
    props: {
        colorPallet: {
            type: Array as () => String[],
            default: () => [], // なぜか配列は関数で渡す必要があるらしい
        },
        firstPalletIndex: {
            type: Number,
            default: 0,
        },
        palletIndex: {
            type: Number,
            default: 0,
        },
        getPalletColor: {
            type: Function,
            required: true,
        },
        selectingColor: {
            type: String,
            default: '255,255,255',
        },
    },
});
</script>
<style lang="scss" scoped>
.palletWindow {
    position: relative;
    background-color: plum;
    border-radius: 8px;
    @media screen and (min-width: 960px) {
        width: 230px;
        height: 330px;
    }
    @media screen and (min-width: 600px) and (max-width: 960px) {
        width: 320px;
        height: 250px;
    }
    @media screen and (max-width: 600px) {
        display: none;
    }
}
.palletWindowTitle {
    padding-top: 10px;
}

.palletArea {
    margin-left: 15px;
    margin-top: 15px;
    margin-bottom: 15px;
    overflow-y: scroll;
    @media screen and (min-width: 960px) {
        margin-right: 3px;
        height: 240px;
    }
    @media screen and (min-width: 600px) and (max-width: 960px) {
        margin-right: 15px;
        overflow-y: scroll;
        height: 150px;
    }
    @media screen and (max-width: 600px) {
        display: none;
    }
}
.palletWindowTitle {
    text-align: center;
}
.pallet {
    display: inline-block;
    border-radius: 35%;
}
.palletWrapper {
    text-align: center;
}
.palletSettingButtonAreaWrapper {
    position: absolute;
    width: 100%;
    bottom: 10px;
}
.palletSettingButtonArea {
    display: flex;
    margin-left: 20px;
    margin-right: 20px;
    justify-content: space-between;
}
</style>

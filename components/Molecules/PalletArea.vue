<template>
    <v-row dense class="palletarea">
        <v-layout justify-center>
            <!-- <div>
                <pallet
                    v-for="(item, index) in colorPallet"
                    :key="item"
                    :color="item"
                    :index="index"
                    :selected-index="palletIndex"
                    @getColor="getPalletColor"
                ></pallet>
            </div> -->
            <div>
                <v-sheet class="colorPallet" elevation="1">
                    <!-- v-model="model" -->
                    <v-slide-group mandatory show-arrows center-active>
                        <v-slide-item
                            v-for="(item, index) in colorPallet"
                            :key="index"
                            v-slot="{ active, toggle }"
                        >
                            <pallet
                                :color="item"
                                :index="index"
                                :selected-index="palletIndex"
                                :active="active"
                                :toggle="toggle"
                                @getColor="getPalletColor"
                            >
                            </pallet>
                        </v-slide-item>
                    </v-slide-group>
                </v-sheet>
            </div>
        </v-layout>
    </v-row>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api';
import Pallet from '@/components/Atomics/Pallet.vue';

export default defineComponent({
    name: 'PalletArea',
    components: {
        Pallet,
    },
    props: {
        colorPallet: {
            type: Array,
            required: true,
        },
        firstPalletIndex: {
            type: Number,
            required: true,
        },
        palletIndex: {
            type: Number,
            required: true,
        },
    },
    setup(_props, context) {
        const getPalletColor = (newColor: string, newIndex: number) => {
            context.emit('getPalletColor', newColor, newIndex);
        };

        return {
            getPalletColor,
        };
    },
});
</script>

<style lang="scss" scoped>
.palletarea {
    display: inline-block;
    white-space: nowrap;
    justify-content: space-between;
}
.colorPallet {
    margin-bottom: 5%;
    width: 330px;
    // @media screen and (min-width: 480px) {
    //     /* 画面サイズが480pxからはここを読み込む*/
    //     width: 300px;
    // }
    @media screen and (min-width: 768px) and (max-width: 1024px) {
        /*画面サイズが768pxから1024pxまではここを読み込む*/
        width: 700px;
    }
    @media screen and (min-width: 1024px) {
        /*画面サイズが1024pxからはここを読み込む*/
        width: 700px;
    }
}
</style>

<template>
    <v-card
        :color="color"
        class="ma-4"
        height="50"
        width="50"
        @click="toggle"
        @mousedown="getColor"
    >
        <v-row class="fill-height ma-0" align="center" justify="center">
            <v-scale-transition>
                <v-icon
                    v-if="active"
                    color="white"
                    size="25"
                    v-text="'mdi-palette'"
                ></v-icon>
            </v-scale-transition>
        </v-row>
    </v-card>
    <!-- <div
        class="pallet"
        :style="{
            background: color,
            margin: margin,
            border: border,
            width: width,
            height: height,
        }"
        @mousedown="getColor"
    ></div> -->
</template>

<script lang="ts">
import {
    defineComponent,
    onMounted,
    reactive,
    toRefs,
    watch,
} from '@nuxtjs/composition-api';

export default defineComponent({
    name: 'Pallet',
    props: {
        color: {
            type: String,
            required: true,
        },
        index: {
            type: Number,
            required: true,
        },
        selectedIndex: {
            type: Number,
            required: true,
        },
        toggle: {
            type: Boolean,
            required: true,
        },
        active: {
            type: Boolean,
            required: true,
        },
    },
    setup(props, context) {
        const { selectedIndex, index, color } = toRefs(props);
        const palletState = reactive({
            margin: '2px',
            width: '23px',
            height: '23px',
            border: '2px solid rgb(87, 56, 84)',
        });
        // const flgState = reactive({
        //     selectedflg: false,
        // });

        onMounted((): void => {
            if (selectedIndex === index) {
                palletState.margin = '1px';
                palletState.width = '25px';
                palletState.height = '25px';
                palletState.border = '3px solid rgb(235, 146, 227)';
            }
        });

        watch(selectedIndex, (newIndex: number, _oldIndex: number) => {
            if (newIndex === index.value) {
                palletState.margin = '1px';
                palletState.width = '25px';
                palletState.height = '25px';
                palletState.border = '3px solid rgb(235, 146, 227)';
            } else {
                palletState.margin = '2px';
                palletState.width = '23px';
                palletState.height = '23px';
                palletState.border = '2px solid rgb(87, 56, 84)';
            }
        });

        const getColor = () => {
            context.emit('getColor', color, index);
        };

        return {
            getColor,
        };
    },
});
</script>

<style lang="scss" scoped>
.pallet {
    display: inline-block;
    border-radius: 35%;
}
</style>

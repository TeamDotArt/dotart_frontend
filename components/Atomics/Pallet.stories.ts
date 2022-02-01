import Pallet from '@/components/Atomics/Pallet.vue';

export default {
    title: 'Atomics/Pallet',
};

export const Default = () => ({
    components: { Pallet },
    template:
        '<Pallet color="rgb(255, 255, 255)" index=0 selectedIndex=0 toggle=true active="true"  />',
});

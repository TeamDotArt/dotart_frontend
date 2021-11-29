import AntiClockRotateButton from '@/components/Atomics/AntiClockRotateButton.vue';

export const Default = () => ({
    components: { AntiClockRotateButton },
    template: '<AntiClockRotateButton />',
});

export const Primary = Default.bind({});

export default {
  title: 'Atomics/AntiClockRotateButton',
  component: AntiClockRotateButton,
};
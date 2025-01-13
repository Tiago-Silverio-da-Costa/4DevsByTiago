import { defineStore } from 'pinia';

export const useForgotPasswordStore = defineStore('forgotPassword', {
    state: () => ({
        step: 1,
    }),
    actions: {
        nextStep(step) {
            console.log("step", step)
                this.step = step;
        },
        resetStep() {
            this.step = 1;
        },
    },
});

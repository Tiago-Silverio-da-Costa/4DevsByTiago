import {defineStore} from "pinia";

export const useForgotPasswordStore = defineStore("forgotPassword", {
    state: () => ({
        step: 1,
    }),
    actions: {
        nextStep(step) {
            this.step = step;
        },
        resetStep() {
            this.step = 1;
        },
    },
});

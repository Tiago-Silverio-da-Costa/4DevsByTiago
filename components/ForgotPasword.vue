<template>
    <section class="bg-[#181C14]">
        <div class="flex flex-col justify-center items-center gap-4 mx-auto w-5/6 max-w-xs py-8 h-screen">
            <NuxtImg src="/logo-no-name.svg" alt="image" width="100" height="200" />

            <!-- Cabeçalhos Dinâmicos -->
            <h1 v-if="step === 1" class="text-white text-3xl font-bold">Forgot Password</h1>
            <h1 v-else-if="step === 2" class="text-white text-3xl font-bold">Verify Code</h1>
            <h1 v-else-if="step === 3" class="text-white text-3xl font-bold">Reset Password</h1>

            <!-- Conteúdo Dinâmico -->
            <div>
                <!-- Etapa 1 -->
                <div v-if="step === 1">
                    <p class="text-white font-medium text-sm text-center">Insert your email for the code verification.</p>
                    <div class="w-full flex flex-col justify-center items-center mt-8">
                        <input class="w-full placeholder:pl-4 mt-4" placeholder="Email" />
                        <button @click="goToNextStep" type="submit" class="w-full px-4 py-2 rounded-md bg-[#FF8200] font-bold mt-4">Send</button>
                    </div>
                </div>

                <!-- Etapa 2 -->
                <div v-else-if="step === 2">
                    <p class="text-white font-medium text-sm text-center">Insert the verification code sent to your email.</p>
                    <div class="w-full flex flex-col justify-center items-center mt-8">
                        <input class="w-full placeholder:pl-4 mt-4" placeholder="Verification Code" />
                        <button @click="goToNextStep" type="submit" class="w-full px-4 py-2 rounded-md bg-[#FF8200] font-bold mt-4">Verify</button>
                    </div>
                </div>

                <!-- Etapa 3 -->
                <div v-else-if="step === 3">
                    <p class="text-white font-medium text-sm text-center">Create a new password for your account.</p>
                    <div class="w-full flex flex-col justify-center items-center mt-8">
                        <input class="w-full placeholder:pl-4 mt-4" placeholder="New Password" type="password" />
                        <input class="w-full placeholder:pl-4 mt-4" placeholder="Confirm New Password" type="password" />
                        <button @click="resetSteps" type="submit" class="w-full px-4 py-2 rounded-md bg-[#FF8200] font-bold mt-4">Reset Password</button>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import {useForgotPasswordStore} from "~/stores/useForgotPasswordStore";

export default {
    setup() {
        const forgotPasswordStore = useForgotPasswordStore();

        const step = computed(() => forgotPasswordStore.step);

        const goToNextStep = () => {
            forgotPasswordStore.nextStep(forgotPasswordStore.step + 1); // Vai para o próximo passo
        };

        const resetSteps = () => {
            forgotPasswordStore.resetStep(); // Reseta para o passo 1
        };

        return {
            step,
            goToNextStep,
            resetSteps,
        };
    },
};
</script>

<style scoped>
input {
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
}
input:focus {
    outline: none;
    border-color: #ff8200;
}
</style>

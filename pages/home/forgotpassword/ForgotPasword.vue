<script setup>
import {ref} from "vue";
import {useForm, useField} from "vee-validate";
import * as yup from "yup";
import axios from "axios";
import {useToast} from "vue-toastification";
import "vue-toastification/dist/index.css";
import {useForgotPasswordStore} from "~/stores/useForgotPasswordStore";

const forgotPasswordStore = useForgotPasswordStore();
const toast = useToast();

const emailSchema = yup.object({
    email: yup.string().email("email inválido").required("Campo obrigatório"),
});

const codeSchema = yup.object({
    code: yup
        .string()
        .matches(/^[A-Z0-9]{5}$/, "O código deve ter 5 caracteres alfanuméricos")
        .required("O código de verificação é obrigatório"),
});

const passwordSchema = yup.object({
    password: yup.string().min(6, "Mínimo de 6 caracteres").required("Campo obrigatório"),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref("password"), null], "senhas não são iguais")
        .required("Confirmação é um campo obrigatório"),
});

const {handleSubmit: handleEmailSubmit} = useForm({
    validationSchema: emailSchema,
});
const {value: email, errorMessage: emailError} = useField("email");

const {handleSubmit: handleCodeSubmit} = useForm({
    validationSchema: codeSchema,
});
const {value: code, errorMessage: codeError} = useField("code");

const {handleSubmit: handlePasswordSubmit} = useForm({
    validationSchema: passwordSchema,
});
const {value: password, errorMessage: passwordError} = useField("password");
const {value: confirmPassword, errorMessage: confirmPasswordError} = useField("confirmPassword");

const isLoading = ref(false);
const showPassword = ref(false);

const togglePassword = () => {
    showPassword.value = !showPassword.value;
};

const onSubmitEmail = handleEmailSubmit(async (values) => {
    isLoading.value = true;
    try {
        const runtimeConfig = useRuntimeConfig();
        await axios.post(`${runtimeConfig.public.apiBase}/user/fg/send/email`, {email: values.email});
        sessionStorage.setItem("fg-email", values.email);
        forgotPasswordStore.nextStep(2);
    } catch (error) {
        const errorMessage = error.response?.data?.message || "Algo deu errado. Tente novamente.";
        toast.error(errorMessage);
    } finally {
        isLoading.value = false;
    }
});

const onSubmitCode = handleCodeSubmit(async (values) => {
    isLoading.value = true;
    try {
        const runtimeConfig = useRuntimeConfig();
        const fgEmail = sessionStorage.getItem("fg-email");
        const response = await axios.post(`${runtimeConfig.public.apiBase}/user/fg/check/code`, {email: fgEmail, code: values.code});
        const tokenExpiration = Date.now() + 15 * 60 * 1000;
        sessionStorage.setItem("fg-token-expiration", tokenExpiration);
        sessionStorage.setItem("fg-token", response.data.results);
        toast.success("Code verified successfully.");
        forgotPasswordStore.nextStep(3);
    } catch (error) {
        const errorMessage = error.response?.data?.message || "Algo deu errado. Tente novamente.";
        toast.error(errorMessage);
    } finally {
        isLoading.value = false;
    }
});

const onSubmitPassword = handlePasswordSubmit(async (values) => {
    isLoading.value = true;
    try {
        const expiration = sessionStorage.getItem("fg-token-expiration");
        if (Date.now() > expiration) {
            toast.error("Token expirado. Por favor, solicite um novo código.");
            return;
        }
        const runtimeConfig = useRuntimeConfig();
        const fgtoken = sessionStorage.getItem("fg-token");

        await axios.post(
            `${runtimeConfig.public.apiBase}/user/fg/update/password`,
            {password: values.password},
            {
                headers: {
                    Authorization: `Bearer ${fgtoken}`,
                },
            }
        );
        toast.success("Password reset successfully.");
        forgotPasswordStore.resetStep();
        sessionStorage.removeItem("fg-token");
        sessionStorage.removeItem("fg-email");
        sessionStorage.removeItem("fg-token-expiration");
        navigateTo("/home/login");
    } catch (error) {
        const errorMessage = error.response?.data?.message || "Algo deu errado. Tente novamente.";
        toast.error(errorMessage);
    } finally {
        isLoading.value = false;
    }
});
useHead(() => {
    return {
        title: "Esqueci a senha - 4devsbyTiagoSC",
        meta: [
            {
                name: "description",
                content: "Área de esquecia a senha no 4devsbyTiagoSC.",
            },
            {
                name: "keywords",
                content: `programação, tecnologia, desenvolvimento`,
            },
        ],
    };
});
</script>

<template>
    <section class="bg-[#181C14]">
        <div class="flex flex-col justify-center items-center gap-4 mx-auto w-5/6 max-w-xs py-8 h-screen">
            <NuxtImg src="/logo-no-name.svg" alt="image" width="100" height="200" />

            <!-- Cabeçalhos Dinâmicos -->
            <h1 v-if="forgotPasswordStore.step === 1" class="text-white text-3xl font-bold">Forgot Password</h1>
            <h1 v-else-if="forgotPasswordStore.step === 2" class="text-white text-3xl font-bold">Verify Code</h1>
            <h1 v-else-if="forgotPasswordStore.step === 3" class="text-white text-3xl font-bold">Reset Password</h1>

            <!-- Conteúdo Dinâmico -->
            <div class="w-full">
                <!-- Etapa 1 -->
                <div v-if="forgotPasswordStore.step === 1">
                    <p class="text-white font-medium text-sm text-center">Insert your email for the code verification.</p>
                    <div class="w-full flex flex-col justify-center items-center mt-8">
                        <form @submit="onSubmitEmail" class="w-full flex flex-col justify-center items-center">
                            <div class="flex flex-col w-full">
                                <input
                                    v-model="email"
                                    v-bind="emailAttrs"
                                    class="w-full placeholder:pl-4 rounded p-2 bg-white border-2 focus:outline-none"
                                    :class="emailError ? 'border-red-500' : 'border-gray-300 focus:border-[#ff8200]'"
                                    placeholder="Email"
                                />
                                <p v-if="emailError" class="text-red-500 text-sm mt-1">{{ emailError }}</p>
                            </div>
                            <button
                                :disabled="isLoading"
                                :class="{
                                    'bg-[#FF8200] text-black': !isLoading,
                                    'bg-gray-400 cursor-not-allowed': isLoading,
                                }"
                                class="w-full px-4 py-2 rounded-md font-bold mt-4"
                            >
                                <Icon v-if="isLoading" name="mdi:loading" class="animate-spin text-2xl" />
                                <span v-else>Send</span>
                            </button>
                        </form>
                    </div>
                </div>

                <!-- Etapa 2 -->
                <div v-else-if="forgotPasswordStore.step === 2">
                    <p class="text-white font-medium text-sm text-center">Insert the verification code sent to your email.</p>
                    <form @submit="onSubmitCode" class="w-full flex flex-col justify-center items-center mt-8">
                        <div class="flex flex-col w-full">
                            <input
                                v-model="code"
                                class="w-full placeholder:pl-4 rounded p-2 bg-white border-2 focus:outline-none"
                                :class="codeError ? 'border-red-500' : 'border-gray-300 focus:border-[#ff8200]'"
                                placeholder="Verification Code"
                            />
                            <p v-if="codeError" class="text-red-500 text-sm mt-1">{{ codeError }}</p>
                        </div>
                        <button
                            :disabled="isLoading"
                            :class="{
                                'bg-[#FF8200] text-black': !isLoading,
                                'bg-gray-400 cursor-not-allowed': isLoading,
                            }"
                            class="w-full px-4 py-2 rounded-md font-bold mt-4"
                        >
                            <Icon v-if="isLoading" name="mdi:loading" class="animate-spin text-2xl" />
                            <span v-else>Verify</span>
                        </button>
                    </form>
                </div>

                <!-- Etapa 3 -->
                <div v-else-if="forgotPasswordStore.step === 3">
                    <p class="text-white font-medium text-sm text-center">Create a new password for your account.</p>
                    <form @submit="onSubmitPassword" class="w-full flex flex-col justify-center items-center mt-8">
                        <div class="flex flex-col gap-4 w-full">
                            <div class="flex flex-col">
                                <div
                                    class="flex items-center gap-3 w-full rounded p-2 bg-white border-2 focus-within:outline-none"
                                    :class="confirmPasswordError ? 'border-red-500' : 'border-gray-300 focus-within:border-[#ff8200]'"
                                >
                                    <input
                                        v-model="password"
                                        :type="showPassword ? 'text' : 'password'"
                                        class="w-full outline-none placeholder-gray-400 bg-transparent"
                                        :class="passwordError ? 'border-red-500' : 'border-gray-300 focus:border-[#ff8200]'"
                                        placeholder="New Password"
                                    />
                                    <Icon v-if="!showPassword" @click="togglePassword" name="mdi:eye-outline" class="w-6 h-6 text-[#ff8200] cursor-pointer" />
                                    <Icon v-if="showPassword" @click="togglePassword" name="mdi:eye-off-outline" class="w-6 h-6 text-[#ff8200] cursor-pointer" />
                                </div>
                                <p v-if="passwordError" class="text-red-500 text-sm mt-1">{{ passwordError }}</p>
                            </div>
                            <div class="flex flex-col">
                                <div
                                    class="flex items-center gap-3 w-full rounded p-2 bg-white border-2 focus-within:outline-none"
                                    :class="confirmPasswordError ? 'border-red-500' : 'border-gray-300 focus-within:border-[#ff8200]'"
                                >
                                    <input
                                        v-model="confirmPassword"
                                        :type="showPassword ? 'text' : 'password'"
                                        class="w-full outline-none placeholder-gray-400 bg-transparent"
                                        :class="confirmPasswordError ? 'border-red-500' : 'border-gray-300 focus:border-[#ff8200]'"
                                        placeholder="Confirm New Password"
                                    />
                                    <Icon v-if="!showPassword" @click="togglePassword" name="mdi:eye-outline" class="w-6 h-6 text-[#ff8200] cursor-pointer" />
                                    <Icon v-if="showPassword" @click="togglePassword" name="mdi:eye-off-outline" class="w-6 h-6 text-[#ff8200] cursor-pointer" />
                                </div>
                                <p v-if="confirmPasswordError" class="text-red-500 text-sm mt-1">{{ confirmPasswordError }}</p>
                            </div>
                        </div>
                        <button
                            :disabled="isLoading"
                            :class="{
                                'bg-[#FF8200] text-black': !isLoading,
                                'bg-gray-400 cursor-not-allowed': isLoading,
                            }"
                            class="w-full px-4 py-2 rounded-md font-bold mt-4"
                        >
                            <Icon v-if="isLoading" name="mdi:loading" class="animate-spin text-2xl" />
                            <span v-else>Reset Password</span>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </section>
</template>

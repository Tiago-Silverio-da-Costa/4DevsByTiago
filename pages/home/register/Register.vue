<script setup>
import {ref} from "vue";
import axios from "axios";
import {useForm, defineRule, configure} from "vee-validate";
import * as yup from "yup";
import {useToast} from "vue-toastification";
import "vue-toastification/dist/index.css";

const registerSchema = yup.object({
    name: yup.string().required("Name is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    password: yup.string().min(6, "At least 6 characters").required("Password is required"),
});

const {defineField, handleSubmit, errors} = useForm({validationSchema: registerSchema});

const [name, nameAttrs] = defineField("name");
const [email, emailAttrs] = defineField("email");
const [password, passwordAttrs] = defineField("password");

const isLoading = ref(false);
const showPassword = ref(false);
const toast = useToast();

const togglePassword = () => {
    showPassword.value = !showPassword.value;
};

const onSubmit = handleSubmit(async (values) => {
    isLoading.value = true;

    const dataSend = {
        user: {
            name: values.name,
            email: values.email,
            password: values.password,
        },
    };

    try {
        const runtimeConfig = useRuntimeConfig();
        const response = await axios.post(`${runtimeConfig.public.apiBase}/user/register`, dataSend);

        if (response.status === 200 || response.status === 201) {
            toast.success("Cadastro realizado com sucesso!");
            navigateTo("/home/login");
        }
    } catch (error) {
        const errorMessage = error.response?.data?.message || "An error occured while logging in";
        toast.error(errorMessage);
    } finally {
        isLoading.value = false;
    }
});

useHead(() => {
    return {
        title: "Cadastro - 4devsbyTiagoSC",
        meta: [
            {
                name: "description",
                content: "Área de cadastro no 4devsbyTiagoSC.",
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
            <h1 class="text-white text-3xl font-bold">Register</h1>
            <form @submit.prevent="onSubmit" class="w-full flex flex-col justify-center items-center mt-8">
                <div class="flex flex-col gap-4 w-full">
                    <div class="flex flex-col">
                        <input
                            v-model="name"
                            v-bind="nameAttrs"
                            class="w-full placeholder:pl-4 rounded p-2 bg-white border-2 focus:outline-none"
                            :class="errors.name ? 'border-red-500' : 'border-gray-300 focus:border-[#ff8200]'"
                            placeholder="Name"
                        />
                        <p v-if="errors.name" class="text-red-500 text-sm mt-1">{{ errors.name }}</p>
                    </div>
                    <div class="flex flex-col">
                        <input
                            v-model="email"
                            v-bind="emailAttrs"
                            class="w-full placeholder:pl-4 rounded p-2 bg-white border-2 focus:outline-none"
                            :class="errors.email ? 'border-red-500' : 'border-gray-300 focus:border-[#ff8200]'"
                            placeholder="Email"
                        />
                        <p v-if="errors.email" class="text-red-500 text-sm mt-1">{{ errors.email }}</p>
                    </div>
                    <div class="flex flex-col">
                        <div
                            class="flex items-center gap-3 w-full rounded p-2 bg-white border-2 focus-within:outline-none"
                            :class="errors.password ? 'border-red-500' : 'border-gray-300 focus-within:border-[#ff8200]'"
                        >
                            <input
                                v-model="password"
                                v-bind="passwordAttrs"
                                :type="showPassword ? 'text' : 'password'"
                                class="w-full outline-none placeholder-gray-400 bg-transparent"
                                placeholder="Password"
                            />

                            <Icon v-if="!showPassword" @click="togglePassword" name="mdi:eye-outline" class="w-6 h-6 text-[#ff8200] cursor-pointer" />
                            <Icon v-if="showPassword" @click="togglePassword" name="mdi:eye-off-outline" class="w-6 h-6 text-[#ff8200] cursor-pointer" />
                        </div>
                        <p v-if="errors.password" class="text-red-500 text-sm mt-1">{{ errors.password }}</p>
                    </div>
                </div>

                <button
                    :disabled="isLoading"
                    :class="{
                        'bg-[#FF8200] text-black': !isLoading,
                        'bg-gray-400 cursor-not-allowed': isLoading,
                    }"
                    class="w-full px-4 py-2 rounded-md bg-[#FF8200] font-bold mt-4"
                >
                    <Icon v-if="isLoading" name="mdi:loading" class="animate-spin text-2xl" />
                    <span v-else>Register</span>
                </button>
                <NuxtLink :to="`/home/login`" class="text-[#FF8200] font-semibold text-sm mt-2">already have an account? </NuxtLink>
            </form>
        </div>
    </section>
</template>

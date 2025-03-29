<template>
    <section class="bg-[#181C14]">
        <div class="flex flex-col justify-center items-center gap-4 mx-auto w-5/6 max-w-xs py-8 h-screen">
            <NuxtImg src="/logo-no-name.svg" alt="image" width="100" height="200" />
            <h1 class="text-white text-3xl font-bold">Register</h1>
            <form @submit.prevent="handleSubmit" class="w-full flex flex-col justify-center items-center mt-8">
                <div class="flex flex-col gap-4 w-full">
                    <input
                        v-model="name"
                        class="w-full placeholder:pl-4 rounded p-2 bg-white border-2 border-gray-300 focus-within:border-[#ff8200] outline-none"
                        placeholder="Name"
                    />
                    <input
                        v-model="email"
                        type="email"
                        class="w-full placeholder:pl-4 rounded p-2 bg-white border-2 border-gray-300 focus-within:border-[#ff8200] outline-none"
                        placeholder="Email"
                    />
                    <div class="flex items-center gap-3 w-full rounded p-2 bg-white border-2 border-gray-300 focus-within:border-[#ff8200]">
                        <input
                            v-model="password"
                            :type="showPassword ? 'text' : 'password'"
                            class="w-full outline-none placeholder-gray-400 bg-transparent"
                            placeholder="Password"
                            required
                        />

                        <Icon v-if="!showPassword" @click="togglePassword" name="mdi:eye-outline" class="w-6 h-6 text-[#ff8200] cursor-pointer" />
                        <Icon v-if="showPassword" @click="togglePassword" name="mdi:eye-off-outline" class="w-6 h-6 text-[#ff8200] cursor-pointer" />
                    </div>
                </div>
                <button class="w-full px-4 py-2 rounded-md bg-[#FF8200] font-bold mt-4">Register</button>
                <NuxtLink :to="`/home/login`" class="text-[#FF8200] font-semibold text-sm mt-2">already have an account? </NuxtLink>
            </form>
        </div>
    </section>
</template>

<script>
import axios from "axios";

export default {
    data() {
        return {
            name: "",
            email: "",
            password: "",
            showPassword: false,
        };
    },
    methods: {
        togglePassword() {
            this.showPassword = !this.showPassword;
        },
        async handleSubmit() {
            try {
                const runtimeConfig = useRuntimeConfig();

                const response = await axios.post(`${runtimeConfig.public.apiBase}/api/register`, {
                    name: this.name,
                    email: this.email,
                    password: this.password,
                });
                if (response.status === 201) {
                    this.$router.push("/login");
                }
            } catch (error) {
                console.error("Erro ao criar o usuário", error.response || error.message);
                alert("Ocorreu um erro ao tentar criar o usuário.");
            }
        },
    },
};
</script>

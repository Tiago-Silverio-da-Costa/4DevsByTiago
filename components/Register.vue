<template>
    <section class="bg-[#181C14]">
        <div class="flex flex-col justify-center items-center gap-4 mx-auto w-5/6 max-w-xs py-8 h-screen">
            <NuxtImg src="/logo-no-name.svg" alt="image" width="100" height="200" />
            <h1 class="text-white text-3xl font-bold">Register</h1>
            <form @submit.prevent="handleSubmit" class="w-full flex flex-col justify-center items-center mt-8">
                <input v-model="name" class="w-full placeholder:pl-4 mt-4" placeholder="Name" />
                <input v-model="email" type="email" class="w-full placeholder:pl-4 mt-4" placeholder="Email" />
                <input v-model="password" type="password" class="w-full placeholder:pl-4 mt-4" placeholder="Password" />
                <button class="w-full px-4 py-2 rounded-md bg-[#FF8200] font-bold mt-4">Register</button>
                <NuxtLink :to="`/login`" class="text-[#FF8200] font-semibold text-sm mt-2">already have an account? </NuxtLink>
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
        };
    },
    methods: {
        async handleSubmit() {
            try {
                const response = await axios.post("http://127.0.0.1:8080/api/register", {
                    name: this.name,
                    email: this.email,
                    password: this.password,
                });
                console.log("response", response);
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

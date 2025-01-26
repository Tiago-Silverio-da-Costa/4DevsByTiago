<template>
    <section class="bg-[#181C14]">
        <div class=" flex flex-col justify-center items-center gap-4 mx-auto w-5/6 max-w-xs py-8 h-screen">
            <NuxtImg src="/logo-no-name.svg" alt="image" width="100" height="200" />
            <h1 class="text-white text-3xl font-bold">Login</h1>
            <form @submit.prevent="handleLogin" class="w-full flex flex-col justify-center items-center mt-8">
                <input v-model="email" type="email" class="w-full placeholder:pl-4 mt-4" placeholder="Email" required />
                <input v-model="password" type="password" class="w-full placeholder:pl-4 mt-4" placeholder="Password"
                    required />
                <NuxtLink :to="`/forgotpassword`" class="text-[#FF8200] font-semibold text-sm mt-2">forgot password?
                </NuxtLink>
                <button type="submit" class="w-full px-4 py-2 rounded-md bg-[#FF8200] font-bold mt-4"
                    :disabled="isLoading">{{ isLoading ? "Loading..." : "Enter" }}</button>
                <NuxtLink :to="`/register`" class="text-[#FF8200] font-semibold text-sm mt-2">don't have an account?
                </NuxtLink>
            </form>
            <p v-if="errorMessage" class="text-red-500 mt-4">{{ errorMessage }}</p>
        </div>
    </section>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            email: "",
            password: "",
            isLoading: false,
            errorMessage: ""
        };
    },
    methods: {
        async handleLogin() {
            this.isLoading = true;
            this.errorMessage = "";

            const dataSend = {
                user: {
                    email: this.email,
                    password: this.password
                }
            }

            try {
                const response = await axios.post("http://127.0.0.1:8080/user/login", dataSend);
                console.log("Login successful:", response.data);
                localStorage.setItem("token", response.data.results.token);
                localStorage.setItem("userId", response.data.results.userId);

                this.$router.push("/");
            } catch (error) {
                console.error("Error logging in:", error);
                this.errorMessage = error.response?.data?.message || "An error occured while logging in."
            } finally {
                this.isLoading = false;
            }
        }

    }
}
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
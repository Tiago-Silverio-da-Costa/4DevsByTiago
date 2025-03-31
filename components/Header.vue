<template>
    <header class="flex items-center bg-[#181C14]">
        <div class="flex md:row items-center justify-between gap-2 py-4 w-5/6 max-w-4xl mx-auto text-black">
            <NuxtLink :to="`/`" class="flex items-center justify-center gap-2">
                <NuxtImg src="/logo-no-name.svg" alt="image" width="40" height="40" />
                <NuxtImg src="/logo-name.svg" alt="image" width="200" height="200" class="hidden md:block" />
            </NuxtLink>
            <div v-if="!isAuthenticated" class="md:flex items-center gap-2 hidden">
                <NuxtLink :to="`/home/login`" class="flex items-center gap-1 px-4 py-2 rounded-md bg-[#FF8200] font-bold">
                    <Icon name="material-symbols:home-outline-rounded" class="bg-black w-6 h-6" />
                    <span class="text-black">Log in</span>
                </NuxtLink>
                <NuxtLink :to="`/home/register`" class="flex items-center gap-1 px-4 py-2 rounded-md bg-[#FF8200] font-bold">
                    <Icon name="mdi:register-outline" class="bg-black w-6 h-6" />
                    <spas class="text-black">Sign up</spas>
                </NuxtLink>
            </div>
            <div v-else class="md:flex items-center gap-2 hidden">
                <button @click="logOut" class="flex items-center gap-1 px-4 py-2 rounded-md bg-[#FF8200] font-bold">
                    <Icon name="material-symbols:logout-rounded" class="bg-black w-6 h-6" />
                    <span class="text-black">Log out</span>
                </button>
            </div>
            <div class="block md:hidden">
                <button @click="modalOpen = true" class="flex items-end justify-center px-2 py-2 rounded-md bg-[#FF8200] font-bold">
                    <Icon name="material-symbols:menu-rounded" class="w-6 h-6" />
                </button>
            </div>
        </div>
    </header>

    <div v-if="modalOpen" class="fixed inset-0 flex items-center justify-center bg-black z-50 px-4" @click.self="modalOpen = false">
        <div class="bg-white p-6 rounded-md shadow-lg w-80 relative">
            <h2 class="text-xl font-bold mb-4">Acesse sua conta</h2>
            <div class="flex flex-col gap-4">
                <NuxtLink :to="`/home/login`" class="px-4 py-2 rounded-md bg-[#FF8200] text-white text-center font-bold">Log in</NuxtLink>
                <NuxtLink :to="`/home/register`" class="px-4 py-2 rounded-md bg-[#FF8200] text-white text-center font-bold">Sign up</NuxtLink>
            </div>
            <button @click="modalOpen = false" class="flex justify-center items-center absolute top-2 right-2 bg-black px-2 py-2 rounded-full">
                <Icon name="material-symbols:close-rounded" class="bg-black w-6 h-6" />
            </button>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            isAuthenticated: false,
            modalOpen: false,
        };
    },
    mounted() {
        this.checkAuthentication();
    },
    methods: {
        checkAuthentication() {
            const token = sessionStorage.getItem("token");
            this.isAuthenticated = !!token;
        },
        logOut() {
            sessionStorage.removeItem("token");
            sessionStorage.removeItem("userId");
            this.$router.push("/").then(() => {
                location.reload();
            });
        },
    },
};
</script>

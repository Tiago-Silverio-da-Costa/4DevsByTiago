<template>
    <header class="bg-[#181C14]">
        <div class="flex md:row items-center justify-between gap-2 py-4 w-5/6 max-w-4xl mx-auto text-white">
            <NuxtLink :to="`/`">
                <NuxtImg src="/logo-no-name.svg" alt="image" width="40" height="40" />
            </NuxtLink>
            <NuxtImg src="/logo-name.svg" alt="image" width="200" height="200" />
            <div v-if="!isAuthenticated" class="md:flex items-center gap-2 hidden ">
                <NuxtLink :to="`/login`" class="px-4 py-2 rounded-md bg-[#FF8200] font-bold">Log in</NuxtLink>
                <NuxtLink :to="`/register`" class="px-4 py-2 rounded-md bg-[#FF8200] font-bold">Sign up</NuxtLink>
            </div>
            <div class="block md:hidden">
                <NuxtImg src="/menuIcons.svg" alt="image" width="40" height="40" />
            </div>
        </div>

    </header>
</template>

<script>
export default {
    data() {
        return {
            isAuthenticated: false
        }
    },
    mounted() {
        this.checkAuthentication();
    },
    methods: {
        checkAuthentication() {
            const token = localStorage.getItem("token");
            this.isAuthenticated = !!token;
        }
    }
}

</script>
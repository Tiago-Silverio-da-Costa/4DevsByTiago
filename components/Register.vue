<template>
    <section class="bg-[#181C14]">
        <div class=" flex flex-col justify-center items-center gap-4 mx-auto w-5/6 max-w-xs py-8 h-screen">
            <NuxtImg src="/logo-no-name.svg" alt="image" width="100" height="200" />
            <h1 class="text-white text-3xl font-bold">Register</h1>
            <form class="w-full flex flex-col justify-center items-center mt-8">
                <input class="w-full placeholder:pl-4 mt-4" placeholder="username" />
                <input class="w-full placeholder:pl-4 mt-4" placeholder="email" />
                <input class="w-full placeholder:pl-4 mt-4" placeholder="password" />
                <button class="w-full px-4 py-2 rounded-md bg-[#FF8200] font-bold mt-4">Entrar</button>
                <NuxtLink :to="`/login`" class="text-[#FF8200] font-semibold text-sm mt-2">already have an account?</NuxtLink>
            </form>
        </div>
    </section>
</template>
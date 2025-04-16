<template>
    <div>
        <NuxtLayout>
            <NuxtPage />
        </NuxtLayout>
    </div>
</template>

<script setup>
useHead({
    title: "My App",
    meta: [{name: "description", content: "Blog para desenvolvedores, programadores e curiosos da área tech. Dicas, tutoriais e mais!"}],
    bodyAttrs: {
        class: "test",
    },
});
useSeoMeta({
    title: "4devsbyTiagoSC - Blog para Desenvolvedores",
    ogTitle: "4devsbyTiagoSC - Blog para Desenvolvedores",
    description: "Blog para desenvolvedores, programadores e curiosos da área tech. Dicas, tutoriais e mais!",
    ogDescription: "Blog para desenvolvedores, programadores e curiosos da área tech. Dicas, tutoriais e mais!",
    ogImage: "https://4devsbytiagosc.com/image.png",
    twitterCard: "summary_large_image",
});
</script>

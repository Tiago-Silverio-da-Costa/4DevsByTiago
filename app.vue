<template>
    <div>
        <NuxtLayout>
            <NuxtPage />
        </NuxtLayout>
    </div>
</template>

<script>
export default {
    head() {
        return {
            title: "4devsbyTiagoSC - Blog para Desenvolvedores",
            meta: [
                {
                    hid: "description",
                    name: "description",
                    content: "Blog para desenvolvedores, programadores e curiosos da área tech. Dicas, tutoriais e mais!",
                },
                {
                    hid: "keywords",
                    name: "keywords",
                    content: "programação, desenvolvimento, tecnologia, tutoriais",
                },
            ],
        };
    },
};
</script>

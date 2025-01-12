<template>
    <div v-if="post" class="bg-[#3C3D37] text-white">
        <div class="mx-auto w-5/6 max-w-4xl py-4">
            <NuxtImg v-if="post.post_image_url" :src="post.post_image_url" alt="image" width="100%" height="200" />
            <h1 class="font-bold text-4xl mt-4">{{ post.title }}</h1>
            <p class="mt-4">{{ post.content }}</p>
            <div class="mt-4 text-[#FF8200]">
                <span>{{ post.publication_date }}</span> | <span>{{ post.category }}</span>
            </div>
        </div>
    </div>
    <div v-else>
        <p class="text-center text-white">Post não encontrado.</p>
    </div>
</template>


<script>
export default {
    data() {
        return {
            post: null,
        };
    },
    created() {
        const id = Number(this.$route.params.id);
        const posts = [
            {
                id: 1,
                title: 'Dicas para Desenvolvedores',
                description: 'Descubra como novas ferramentas e frameworks estão revolucionando o desenvolvimento web e ajudando a criar soluções mais eficientes.',
                content: 'Descubra como novas ferramentas e frameworks estão revolucionando o desenvolvimento web e ajudando a criar soluções mais eficientes. Descubra como novas ferramentas e frameworks estão revolucionando o desenvolvimento web e ajudando a criar soluções mais eficientes. Descubra como novas ferramentas e frameworks estão revolucionando o desenvolvimento web e ajudando a criar soluções mais eficientes. Descubra como novas ferramentas e frameworks estão revolucionando o desenvolvimento web e ajudando a criar soluções mais eficientes.',
                post_image_url: 'https://i.imgur.com/4WsRhkB.jpeg',
                publication_date: '2025-01-12',
                category: 'Tecnologia',
            },
            {
                id: 2,
                title: 'Dicas para Desenvolvedores',
                description: 'Descubra como novas ferramentas e frameworks estão revolucionando o desenvolvimento web e ajudando a criar soluções mais eficientes.',
                content: 'Descubra como novas ferramentas e frameworks estão revolucionando o desenvolvimento web e ajudando a criar soluções mais eficientes. Descubra como novas ferramentas e frameworks estão revolucionando o desenvolvimento web e ajudando a criar soluções mais eficientes. Descubra como novas ferramentas e frameworks estão revolucionando o desenvolvimento web e ajudando a criar soluções mais eficientes. Descubra como novas ferramentas e frameworks estão revolucionando o desenvolvimento web e ajudando a criar soluções mais eficientes.',
                post_image_url: 'https://i.imgur.com/4WsRhkB.jpeg',
                publication_date: '2025-01-10',
                category: 'Desenvolvimento',
            },
            {
                id: 3,
                title: 'Tendências de Design 2025',
                description: 'Saiba o que está em alta no design este ano e como aplicar essas tendências para criar interfaces modernas e intuitivas.',
                content: 'Descubra como novas ferramentas e frameworks estão revolucionando o desenvolvimento web e ajudando a criar soluções mais eficientes. Descubra como novas ferramentas e frameworks estão revolucionando o desenvolvimento web e ajudando a criar soluções mais eficientes. Descubra como novas ferramentas e frameworks estão revolucionando o desenvolvimento web e ajudando a criar soluções mais eficientes. Descubra como novas ferramentas e frameworks estão revolucionando o desenvolvimento web e ajudando a criar soluções mais eficientes.',
                post_image_url: 'https://i.imgur.com/4WsRhkB.jpeg',
                publication_date: '2025-01-08',
                category: 'Design',
            },
        ];

        this.post = posts.find((p) => p.id === id);

        if (!this.post) {
            console.error("Post não encontrado!");
        } else {
            console.log("Post encontrado:", this.post);
        }

    },
};
</script>
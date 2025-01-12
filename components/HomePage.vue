<template>
    <div class="bg-[#3C3D37] text-white">
        <div class="mx-auto w-5/6 max-w-4xl py-4">
            <Search />
            <div class="flex flex-wrap gap-5 justify-center">
                <div v-for="post in posts" :key="post.id" class="mt-4 w-96 border-2 border-[#FF8200] rounded-md">
                    <!-- image -->
                    <div class="flex-1 bg-[#181C14] border-b-2 border-b-[#FF8200]">
                        <NuxtImg :src="post.post_image_url" alt="image" width="400" height="200" />
                    </div>
                    <!-- body -->
                    <div class="flex flex-col gap-4 px-8 py-4">
                        <h2 class="font-bold text-2xl"> {{ post.title }}</h2>
                        <p class=" text-md flex max-w-md ">{{ post.description }}</p>
                    </div>
                    <!-- footer -->
                    <div class="flex px-8 py-4 items-center justify-between border-t-2 border-t-[#FF8200] text-[#FF8200]">
                        <div class="flex items-center gap-2"> 
                            <NuxtImg src="watchIcon.svg" alt="image" width="20" height="20" />
                            <span>{{ post.publication_date }}</span>
                        </div>
                        <span>{{ post.category }}</span>
                     </div>
                </div>
            </div>
        </div>
    </div>
</template>


<script>
import Search from '@/components/Search.vue';

export default {
    components: {
        Search,
    },
    data() {
        return {
            posts: [
                {
                    id: 1,
                    title: 'Dicas para Desenvolvedores',
                    description: 'Descubra como novas ferramentas e frameworks estão revolucionando o desenvolvimento web e ajudando a criar soluções mais eficientes.',
                    content: '',
                    post_image_url: 'https://i.imgur.com/4WsRhkB.jpeg',
                    publication_date: '2025-01-12',
                    category: 'Tecnologia'
                },
                {
                    id: 2,
                    title: 'Dicas para Desenvolvedores',
                    description: 'Descubra como novas ferramentas e frameworks estão revolucionando o desenvolvimento web e ajudando a criar soluções mais eficientes.',
                    content: '',
                    post_image_url: 'https://i.imgur.com/4WsRhkB.jpeg',
                    publication_date: '2025-01-10',
                    category: 'Desenvolvimento'
                },
                {
                    id: 3,
                    title: 'Tendências de Design 2025',
                    description: 'Saiba o que está em alta no design este ano e como aplicar essas tendências para criar interfaces modernas e intuitivas.',
                    content: '',
                    post_image_url: 'https://i.imgur.com/4WsRhkB.jpeg',
                    publication_date: '2025-01-08',
                    category: 'Design'
                },
            ],
        };
    },
};
</script>

<style scoped>
ul {
    list-style: none;
    padding: 0;
}
</style>

<template>
    <div class="bg-[#3C3D37] text-white h-screen">
        <div class="mx-auto w-5/6 max-w-4xl py-4">
            <Search />
            <div class="mt-4">
                <ul>
                    <li v-for="post in posts" :key="post.id" class="border-b py-2">
                        {{ post.title }}
                    </li>
                </ul>
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
                { id: 1, title: 'Post 1' },
                { id: 2, title: 'Post 2' },
                { id: 3, title: 'Post 3' },
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

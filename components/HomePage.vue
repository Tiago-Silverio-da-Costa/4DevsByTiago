<template>
    <div class="bg-[#3C3D37] text-white">
        <div class="mx-auto w-5/6 max-w-[49.5rem] py-4">
            <Search @search="updateSearchQuery" :intialQuery="searchQuery" />
            <div :class="{ 'min-h-[100vh]': searchQuery.length > 0 }">
                <div class="flex flex-wrap gap-5 justify-center items-stretch w-full">

                    <div v-if="searchQuery && filteredPosts.length === 0"
                        class="flex justify-center self-center items-center text-center text-xl font-bold bg-[#FF8200] text-white px-8 py-4 h-fit rounded-md mt-8">
                        Nenhum resultado encontrado.
                    </div>


                    <NuxtLink :to="`/${post.id}`" v-for="post in paginationPosts" :key="post.id"
                        class="bg-[#181C14] mt-4 w-96 border-2 border-[#FF8200] rounded-md overflow-hidden">
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
                        <div
                            class="flex px-8 py-4 items-center justify-between border-t-2 border-t-[#FF8200] text-[#FF8200]">
                            <div class="flex items-center gap-2">
                                <NuxtImg src="watchIcon.svg" alt="image" width="20" height="20" />
                                <span>{{ post.publication_date }}</span>
                            </div>
                            <span>{{ post.category }}</span>
                        </div>
                    </NuxtLink>
                </div>
            </div>

            <div v-if="filteredPosts.length > postsPerPage" class="flex justify-center items-center gap-4 mt-8">
                <button @click="prevPage" :disabled="current === 1"
                    class="px-4 py-2 bg-[#FF8200] text-white rounded-md font-bold">
                    <NuxtImg src="/left-arrow.svg" alt="image" width="20" height="40" />

                </button>

                <span>Página {{ currentPage }} de {{ totalPages }}</span>

                <button @click="nextPage" :disabled="currentPage === totalPages"
                    class="px-4 py-2 bg-[#FF8200] text-white rounded-md font-bold">
                    <NuxtImg src="/right-arrow.svg" alt="image" width="20" height="40" />

                </button>
            </div>
        </div>
    </div>
</template>


<script>
import Search from '@/components/Search.vue';
import axios from 'axios';

export default {
    components: {
        Search,
    },
    data() {
        return {
            posts: [],
            searchQuery: "",
            currentPage: 1,
            postsPerPage: 5,
        };
    },
    computed: {
        filteredPosts() {
            return this.posts.filter((post) =>
                post.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                post.description.toLowerCase().includes(this.searchQuery.toLowerCase())
            );
        },
        paginationPosts() {
            const start = (this.currentPage - 1) * this.postsPerPage;
            const end = start + this.postsPerPage;
            return this.filteredPosts.slice(start, end)
        },
        totalPages() {
            return Math.ceil(this.filteredPosts.length / this.postsPerPage);
        }
    },
    methods: {
        updateSearchQuery(query) {
            this.searchQuery = query
        },
        prevPage() {
            if (this.currentPage > 1) {
                this.currentPage--;
            }
        },
        nextPage() {
            if (this.currentPage < this.totalPages) {
                this.currentPage++;
            }
        }
    },
    mounted() {
        axios.get("http://127.0.0.1:8080/post/post")
            .then(response => {
                console.log("Posts fetched:", response.data.data);
                this.posts = response.data.data;
            })
            .catch(error => {
                console.error("Error fetching posts", error)
            })
    }
}
</script>

<style scoped>
ul {
    list-style: none;
    padding: 0;
}
</style>

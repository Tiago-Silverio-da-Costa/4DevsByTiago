<template>
    <div class="bg-[#3C3D37] text-white">
        <div class="mx-auto w-5/6 max-w-[49.5rem] py-4">
            <Search @search="updateSearchQuery" :intialQuery="searchQuery" />
            <div :class="{'min-h-[100vh] flex flex-col justify-start h-fit': paginationPosts.length <= 2}">
                <div class="flex flex-wrap gap-5 justify-center items-stretch w-full">
                    <div
                        v-if="searchQuery && filteredPosts.length === 0"
                        class="flex justify-center self-center items-center text-center text-xl font-bold bg-[#FF8200] text-white px-8 py-4 h-fit rounded-md mt-8"
                    >
                        Nenhum resultado encontrado.
                    </div>

                    <NuxtLink
                        :to="`/post/${post.id}`"
                        v-for="post in paginationPosts"
                        :key="post.id"
                        class="flex flex-col bg-[#181C14] hover:scale-105 transition-all duration-300 mt-4 w-96 border-2 border-[#FF8200] rounded-md overflow-hidden"
                    >
                        <!-- image -->
                        <div class="bg-[#181C14] border-b-2 border-b-[#FF8200]">
                            <NuxtImg :src="post.post_image_url" alt="image" width="400" height="200" />
                        </div>

                        <!-- body -->
                        <div class="flex flex-col gap-4 px-8 py-4 min-h-[11.5rem]">
                            <h2 class="font-bold text-2xl">{{ post.title }}</h2>
                            <p class="text-md flex max-w-md">{{ post.description }}</p>
                        </div>
                        <!-- footer -->
                        <div class="flex px-8 py-4 items-center justify-between border-t-2 border-t-[#FF8200] text-[#FF8200]">
                            <div class="flex items-center gap-2">
                                <Icon name="formkit:date" class="text-black w-4 h-4" />
                                <span>{{ post.publication_date }}</span>
                            </div>
                            <span>{{ post.category_name }}</span>
                        </div>
                    </NuxtLink>
                </div>
            </div>

            <div v-if="filteredPosts.length > postsPerPage" class="flex justify-center items-center gap-4 mt-8">
                <button @click="prevPage" :disabled="current === 1" class="flex items-center justify-center px-2 py-1 bg-[#FF8200] text-white rounded-md font-bold">
                    <Icon name="iconamoon:arrow-left-2" class="text-black w-6 h-6" />
                </button>
                <span>Página {{ currentPage }} de {{ totalPages }}</span>
                <button @click="nextPage" :disabled="currentPage === totalPages" class="flex items-center justify-center px-2 py-1 bg-[#FF8200] text-white rounded-md font-bold">
                    <Icon name="iconamoon:arrow-right-2" class="text-black w-6 h-6" />
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import Search from "~/components/Search.vue";
import axios from "axios";

export default {
    components: {
        Search,
    },
    data() {
        return {
            posts: [],
            searchQuery: "",
            currentPage: 1,
            postsPerPage: 4,
        };
    },
    computed: {
        filteredPosts() {
            return this.posts.filter((post) => {
                const query = this.searchQuery.toLocaleLowerCase();
                return post.title.toLocaleLowerCase().includes(query) || post.description.toLocaleLowerCase().includes(query);
            });
        },
        paginationPosts() {
            const start = (this.currentPage - 1) * this.postsPerPage;
            const end = start + this.postsPerPage;
            console.log("start", start);
            console.log("end", end);
            console.log("this.filteredPosts.slice(start, end)", this.filteredPosts.slice(start, end));
            return this.filteredPosts.slice(start, end);
        },
        totalPages() {
            return Math.ceil(this.filteredPosts.length / this.postsPerPage);
        },
    },
    methods: {
        updateSearchQuery(query) {
            console.log("query", query);
            this.searchQuery = query;
            this.currentPage = 1;
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
        },
    },
    mounted() {
        const runtimeConfig = useRuntimeConfig();

        axios
            .get(`${runtimeConfig.public.apiBase}/post/post`)
            .then((response) => {
                this.posts = response.data.data;
                console.log("postg", response.data.data);
            })
            .catch((error) => {
                console.error("Error fetching posts", error);
            });
    },
};
</script>

<style scoped>
ul {
    list-style: none;
    padding: 0;
}
</style>

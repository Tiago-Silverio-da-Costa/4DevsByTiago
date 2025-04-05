<script>
import Search from "~/components/Search.vue";
import axios from "axios";
import {useAuthStore} from "~/stores/useAuth";

export default {
    components: {
        Search,
    },
    setup() {
        const authStore = useAuthStore();
        return {authStore};
    },
    data() {
        return {
            posts: [],
            searchQuery: "",
            currentPage: 1,
            postsPerPage: 4,
            sortOrder: "newest",
            selectedCategory: "",
            isUserAdmin: "",
        };
    },
    computed: {
        categories() {
            return [...new Set(this.posts.map((post) => post.category_name))];
        },
        filteredPosts() {
            let filtered = this.posts.filter((post) => {
                const query = this.searchQuery.toLowerCase();
                const matchesSearch = post.title.toLowerCase().includes(query) || post.description.toLowerCase().includes(query);
                const matchesCategory = !this.selectedCategory || post.category_name === this.selectedCategory;
                return matchesSearch && matchesCategory;
            });

            if (this.sortOrder === "oldest") {
                filtered.sort((a, b) => new Date(a.publication_date) - new Date(b.publication_date));
            } else {
                filtered.sort((a, b) => new Date(b.publication_date) - new Date(a.publication_date));
            }

            return filtered;
        },
        paginationPosts() {
            const start = (this.currentPage - 1) * this.postsPerPage;
            const end = start + this.postsPerPage;
            return this.filteredPosts.slice(start, end);
        },
        totalPages() {
            return Math.ceil(this.filteredPosts.length / this.postsPerPage);
        },
        isAdmin() {
            return this.authStore.isAdmin;
        },
    },
    methods: {
        updateSearchQuery(query) {
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
            .get(`${runtimeConfig.public.apiBase}/post`)
            .then((response) => {
                this.posts = response.data.data;
                this.posts = response.data.data.map((post) => ({
                    ...post,
                    formattedPublicationDate:
                        new Date(post.publication_date).toLocaleDateString("pt-BR", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                        }) +
                        " às " +
                        new Date(post.publication_date).toLocaleTimeString("pt-BR", {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: false,
                        }),
                }));
            })
            .catch((error) => {
                console.error("Error fetching posts", error);
            });
    },
};
</script>

<template>
    <div class="bg-[#2c2f31] text-white">
        <div class="mx-auto w-5/6 max-w-[49.5rem] py-4">
            <Search @search="updateSearchQuery" :intialQuery="searchQuery" />

            <div class="flex flex-wrap gap-4 mt-4">
                <select v-model="sortOrder" @change="currentPage = 1" class="bg-[#181C14] border-2 border-[#FF8200] outline-none text-white px-4 py-2 rounded-md">
                    <option value="newest">Mais recente</option>
                    <option value="oldest">Mais antigo</option>
                </select>

                <select v-model="selectedCategory" @change="currentPage = 1" class="bg-[#181C14] border-2 border-[#FF8200] outline-none text-white px-4 py-2 rounded-md">
                    <option value="">Todas as categorias</option>
                    <option v-for="category in categories" :key="category" :value="category">
                        {{ category }}
                    </option>
                </select>
                <!-- @click="openCreateModal" -->
                <button v-if="isAdmin" class="flex items-center justify-center gap-1 px-4 py-2 rounded-md bg-[#FF8200] transition-all active:bg-[#ff84009d] font-bold">
                    <Icon name="material-symbols:post-add" class="bg-black w-5 h-5" />
                    <span class="text-black">novo post</span>
                </button>
            </div>

            <div :class="{'min-h-[100vh] flex flex-col justify-start h-fit': paginationPosts.length <= 2}">
                <div class="flex flex-wrap gap-5 justify-center items-stretch w-full">
                    <div
                        v-if="searchQuery && filteredPosts.length === 0"
                        class="flex justify-center self-center items-center text-black text-center text-xl font-bold bg-[#FF8200] px-8 py-4 h-fit rounded-md mt-8"
                    >
                        Nenhum resultado encontrado.
                    </div>

                    <div
                        v-for="post in paginationPosts"
                        :key="post.id"
                        class="flex flex-col bg-[#181C14] hover:scale-105 transition-all duration-300 mt-4 w-96 border-2 border-[#FF8200] rounded-md overflow-hidden"
                    >
                        <div class="relative bg-[#181C14] border-b-2 border-b-[#FF8200]">
                            <NuxtImg :src="post.post_image_url" alt="image" width="400" height="200" />
                            <div v-if="isAdmin" class="flex items-center gap-4 absolute top-4 right-4">
                                <button class="flex items-center gap-1 px-4 py-2 rounded-md bg-[#FF8200] transition-all active:bg-[#ff84009d] font-bold">
                                    <Icon name="material-symbols:edit-outline-rounded" class="bg-black w-6 h-6" />
                                </button>
                                <button class="flex items-center gap-1 px-4 py-2 rounded-md bg-[#FF8200] transition-all active:bg-[#ff84009d] font-bold">
                                    <Icon name="material-symbols:delete-outline-rounded" class="bg-black w-6 h-6" />
                                </button>
                            </div>
                        </div>

                        <NuxtLink :to="`/post/${post.slug}`" class="flex flex-col">
                            <div class="flex flex-col gap-4 px-8 py-4 min-h-[11.5rem]">
                                <h2 class="font-bold text-2xl">{{ post.title }}</h2>
                                <p class="text-md flex max-w-md">{{ post.description }}</p>
                            </div>

                            <div class="flex px-8 py-4 items-center justify-between border-t-2 border-t-[#FF8200] text-[#FF8200]">
                                <div class="flex items-center gap-2">
                                    <Icon name="formkit:date" class="w-4 h-4" />
                                    <span>{{ post.formattedPublicationDate }}</span>
                                </div>
                                <span>{{ post.category_name }}</span>
                            </div>
                        </NuxtLink>
                    </div>
                </div>
            </div>

            <div v-if="filteredPosts.length > postsPerPage" class="flex justify-center items-center gap-4 mt-8">
                <button @click="prevPage" :disabled="current === 1" class="flex items-center justify-center px-2 py-1 bg-[#FF8200] text-white rounded-md font-bold">
                    <Icon name="iconamoon:arrow-left-2" class="bg-black w-6 h-6" />
                </button>
                <span>Página {{ currentPage }} de {{ totalPages }}</span>
                <button @click="nextPage" :disabled="currentPage === totalPages" class="flex items-center justify-center px-2 py-1 bg-[#FF8200] text-white rounded-md font-bold">
                    <Icon name="iconamoon:arrow-right-2" class="bg-black w-6 h-6" />
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
ul {
    list-style: none;
    padding: 0;
}
</style>

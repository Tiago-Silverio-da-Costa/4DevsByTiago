<script>
import axios from "axios";

export default {
    props: {
        isOpen: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            // isModalOpen: false,
            isAuthorModalOpen: false,
            isCategoryModalOpen: false,
            authors: [],
            categories: [],
            formData: {
                author_id: "",
                category: "",
                title: "",
                slug: "",
                description: "",
                post_image_url: "",
                content: "",
            },
            newAuthor: {
                name: "",
            },
            newCategory: {
                name: "",
            },
        };
    },
    methods: {
        openModal() {
            this.isModalOpen = true;
            this.fetchAuthors();
            this.fetchCategories();
        },
        closeModal() {
            this.isModalOpen = false;
            this.resetForm();
        },
        fetchAuthors() {
            const runtimeConfig = useRuntimeConfig();
            axios
                .get(`${runtimeConfig.public.apiBase}/post/author`)
                .then((response) => {
                    this.authors = response.data.results;
                })
                .catch((error) => {
                    console.error("Error fetching authors", error);
                });
        },
        fetchCategories() {
            const runtimeConfig = useRuntimeConfig();
            axios
                .get(`${runtimeConfig.public.apiBase}/post/category`)
                .then((response) => {
                    this.categories = response.data.results;
                })
                .catch((error) => {
                    console.error("Error fetching categories", error);
                });
        },
        resetForm() {
            this.formData = {
                author_id: "",
                category: "",
                title: "",
                slug: "",
                description: "",
                post_image_url: "",
                content: "",
            };
        },
        createPost() {
            const runtimeConfig = useRuntimeConfig();
            axios
                .post(`${runtimeConfig.public.apiBase}/post`, this.formData)
                .then((response) => {
                    this.$emit("post-created");
                    this.$emit("close");
                    this.resetForm();
                })
                .catch((error) => {
                    console.error("Error creating post", error);
                });
        },
        openAuthorModal() {
            this.isAuthorModalOpen = true;
        },
        closeAuthorModal() {
            this.isAuthorModalOpen = false;
            this.newAuthor.name = "";
        },
        saveNewAuthor() {
            if (!this.newAuthor.name.trim()) {
                return;
            }

            const runtimeConfig = useRuntimeConfig();
            axios
                .post(`${runtimeConfig.public.apiBase}/post/author`, this.newAuthor)
                .then((response) => {
                    this.fetchAuthors();
                    this.closeAuthorModal();
                })
                .catch((error) => {
                    console.error("Error creating author", error);
                });
        },
        openCategoryModal() {
            this.isCategoryModalOpen = true;
        },
        closeCategoryModal() {
            this.isCategoryModalOpen = false;
            this.newCategory.name = "";
        },
        saveNewCategory() {
            if (!this.newCategory.name.trim()) {
                return;
            }
            const runtimeConfig = useRuntimeConfig();
            axios
                .post(`${runtimeConfig.public.apiBase}/post/category`, this.newCategory)
                .then((response) => {
                    this.fetchCategories();
                    this.closeCategoryModal();
                })
                .catch((error) => {
                    console.error("Error creating category", error);
                });
        },
        overlayClick(e) {
            if (e.target.classList.contains("modal-overlay")) {
                this.$emit("close");
            }
        },
    },
};
</script>

<template>
    <div v-if="isOpen" class="fixed inset-0 flex items-center justify-center z-50">
        <div class="absolute inset-0 bg-black bg-opacity-70" @click="$emit('close')"></div>

        <div class="overflow-y-scroll h-[80vh] bg-[#181C14] border-2 border-[#FF8200] rounded-md w-full max-w-2xl z-10 p-6 text-white">
            <h2 class="text-2xl font-bold mb-6 text-center">Criação de post</h2>

            <form @submit.prevent="createPost" class="spacey-y-4">
                <!-- Author selection -->
                <div class="flex flex-col">
                    <label for="author_id" class="mb-1">Autor</label>
                    <div class="flex gap-2">
                        <select id="author_id" v-model="formData.author_id" class="flex-grow bg-[#2c2f31] border-2 border-[#ff8200] outline-noe text-white px-4 py-2 rounded-md">
                            <option value="" disabled selected>Selecione um author</option>
                            <option v-for="author in authors" :key="author.id" :value="author.id">
                                {{ author.name }}
                            </option>
                        </select>
                        <button type="button" @click="openAuthorModal" class="bg-[#ff8200] text-black font-bold px-3 py-2 rounded-md flex items-center">
                            <Icon name="material-symbols:add" class="bg-black w-5 h-5" />
                        </button>
                    </div>
                </div>

                <!-- Category selection -->
                <div class="flex flex-col">
                    <label for="category" class="mb-1">Categoria</label>
                    <div class="flex gap-2">
                        <select id="category" v-model="formData.category" class="flex-grow bg-[#2c2f31] border-2 border-[#ff8200] outline-none text-white px-4 py-2 rounded-md">
                            <option value="" disabled selected>Selecione uma categoria</option>
                            <option v-for="category in categories" :key="category.id" :value="category.id">
                                {{ category.name }}
                            </option>
                        </select>
                        <button type="button" @click="openCategoryModal" class="bg-[#ff8200] text-black font-bold px-3 py-2 rounded-md flex items-center">
                            <Icon name="material-symbols:add" class="bg-black w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div class="flex flex-col">
                    <label for="title" class="mb-1">Título</label>
                    <input id="title" v-model="formData.title" type="text" class="bg-[#2c2f31] border-2 border-[#ff8200] outline-none text-white px-4 py-2 rounded-md" />
                </div>

                <div class="flex flex-col">
                    <label for="slug" class="mb-1">Slug</label>
                    <input id="slug" v-model="formData.slug" type="text" class="bg-[#2c2f31] border-2 border-[#FF8200] outline-none text-white px-4 py-2 rounded-md" required />
                </div>

                <div class="flex flex-col">
                    <label for="description" class="mb-1">Descrição</label>
                    <input
                        id="description"
                        v-model="formData.description"
                        type="text"
                        class="bg-[#2c2f31] border-2 border-[#FF8200] outline-none text-white px-4 py-2 rounded-md"
                        required
                    />
                </div>

                <div class="flex flex-col">
                    <label for="post_image_url" class="mb-1">URL da imagem</label>
                    <input
                        id="post_image_url"
                        v-model="formData.post_image_url"
                        type="text"
                        class="bg-[#2c2f31] border-2 border-[#FF8200] outline-none text-white px-4 py-2 rounded-md"
                        required
                    />
                </div>

                <div class="flex flex-col">
                    <label for="content" class="mb-1">Conteúdo</label>
                    <textarea
                        id="content"
                        v-model="formData.content"
                        rows="6"
                        class="bg-[#2c2f31] border-2 border-[#FF8200] outline-none text-white px-4 py-2 rounded-md resize-none"
                        required
                    ></textarea>
                </div>
                <div class="flex justify-end gap-4 mt-6">
                    <button type="button" @click="$emit('close')" class="bg-[#2c2f31] border-2 border-[#ff8200] text-white px-6 py-2 rounded-md">Cancelar</button>
                    <button type="submit" class="bg-[#FF8200] text-black font-bold px-6 py-2 rounded-md">Salvar</button>
                </div>
            </form>
        </div>
    </div>

    <div v-if="isAuthorModalOpen" class="fixed inset-0 flex items-center justify-center z-50">
        <div class="absolute inset-0 bg-black bg-opacity-70" @click="closeAuthorModal"></div>
        <div class="bg-[#181c14] border-2 border-[#ff8200] rounded-md w-full max-w-md z-10 p-6 text-white">
            <h3 class="text-xl font-bold mb-4">Adicionar novo autor</h3>
            <div class="space-y-4">
                <div class="flex flex-col">
                    <label for="author_name" class="mb-1">Nome</label>
                    <input id="author_name" v-model="newAuthor.name" type="text" class="bg-[#2c2f31] border-2 bordee-[#ff8200] outline-none text-white px-4 py-2 rounded-md" />
                </div>
                <div class="flex justify-end gap-4 mt-4">
                    <button @click="closeAuthorModal" class="bg-[#2c2f31] border-2 border-[#FF8200] text-white px-4 py-2 rounded-md">Cancelar</button>
                    <button @click="saveNewAuthor" class="bg-[#FF8200] text-black font-bold px-4 py-2 rounded-md">Adicionar</button>
                </div>
            </div>
        </div>
    </div>

    <div v-if="isCategoryModalOpen" class="fixed inset-0 flex items-center justify-center z-50">
        <div class="absolute inset-0 bg-black bg-opacity-70" @click="closeCategoryModal"></div>
        <div class="bg-[#181c14] border-2 border-[#ff8200] rounded-md w-full max-w-md z-10 p-6 text-white">
            <h3 class="text-xl font-bold mb-4">Adicoonar nova categoria</h3>
            <div class="space-y-4">
                <div class="flex flex-col">
                    <label for="category_name" class="mb-1">Nome</label>
                    <input id="category_name" v-model="newCategory.name" type="text" class="bg-[#2c2f31] border-2 border-[#ff8200] outline-none text-white px-4 py-2 rounded-md" />
                </div>
                <div class="flex justify-end gap-4 mt-4">
                    <button @click="closeCategoryModal" class="bg-[#2c2f31] border-2 border-[#FF8200] text-white px-4 py-2 rounded-md">Cancelar</button>
                    <button @click="saveNewCategory" class="bg-[#FF8200] text-black font-bold px-4 py-2 rounded-md">Adicionar</button>
                </div>
            </div>
        </div>
    </div>
</template>

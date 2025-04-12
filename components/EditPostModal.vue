<script setup>
import axios from "axios";
import {ref, defineEmits} from "vue";
import * as yup from "yup";
import {useToast} from "vue-toastification";
import "vue-toastification/dist/index.css";
import {useForm} from "vee-validate";

const toast = useToast();

const props = defineProps({
    isOpen: {
        type: Boolean,
        default: false,
    },
    postToEdit: {
        type: Object,
        default: null,
    },
});

const emit = defineEmits(["close", "post-created"]);

const postSchema = yup.object().shape({
    author_id: yup.string().required("Autor é obrigatório"),
    category_id: yup.string().required("Categoria é obrigatória"),
    title: yup.string().trim().required("Título é obrigatório"),
    slug: yup.string().trim().required("Slug é obrigatório"),
    description: yup.string().trim().required("Descrição é obrigatória"),
    post_image_url: yup.string().url("URL inválida").required("URL da imagem é obrigatória"),
    content: yup.string().trim().required("Conteúdo é obrigatório"),
});

const {defineField, handleSubmit, errors, resetForm} = useForm({
    validationSchema: postSchema,
});

const [author_id] = defineField("author_id");
const [category_id] = defineField("category_id");
const [title] = defineField("title");
const [slug] = defineField("slug");
const [description] = defineField("description");
const [post_image_url] = defineField("post_image_url");
const [content] = defineField("content");

const authors = ref([]);
const categories = ref([]);

const fetchAuthors = async () => {
    const runtimeConfig = useRuntimeConfig();
    try {
        const token = sessionStorage.getItem("token");
        const response = await axios.get(`${runtimeConfig.public.apiBase}/post/author`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        authors.value = response.data.data;
    } catch (error) {
        toast.error("Erro ao carregar autores");
    }
};

const fetchCategories = async () => {
    const runtimeConfig = useRuntimeConfig();
    try {
        const token = sessionStorage.getItem("token");
        const response = await axios.get(`${runtimeConfig.public.apiBase}/post/category`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        categories.value = response.data.data;
    } catch (error) {
        toast.error("Erro ao carregar categorias");
    }
};

const onSubmit = handleSubmit(async (values) => {
    const runtimeConfig = useRuntimeConfig();
    try {
        const sendData = {
            post: {
                id: props.postToEdit.id,
                author_id: values.author_id,
                category_id: values.category_id,
                content: values.content,
                description: values.description,
                post_image_url: values.post_image_url,
                slug: values.slug,
                title: values.title,
            },
        };
        const token = sessionStorage.getItem("token");

        await axios.put(`${runtimeConfig.public.apiBase}/post/edit`, sendData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        emit("post-created");
        emit("close");
        resetForm();
        toast.success("Post editado com sucesso!");
    } catch (error) {
        toast.error("Erro ao editar post");
    }
});

watch(
    () => props.isOpen,
    (newVal) => {
        if (newVal && props.postToEdit) {
            author_id.value = props.postToEdit.author_id;
            category_id.value = props.postToEdit.category_id;
            title.value = props.postToEdit.title;
            slug.value = props.postToEdit.slug;
            description.value = props.postToEdit.description;
            post_image_url.value = props.postToEdit.post_image_url;
            content.value = props.postToEdit.content;
            fetchAuthors();
            fetchCategories();
        }
    }
);
</script>

<template>
    <div v-if="isOpen" class="fixed inset-0 flex items-center justify-center z-50">
        <div class="absolute inset-0 bg-black bg-opacity-70" @click="$emit('close')"></div>

        <div class="overflow-y-scroll h-[80vh] bg-[#181C14] border-2 border-[#FF8200] rounded-md w-full max-w-2xl z-10 p-6 text-white">
            <h2 class="text-2xl font-bold mb-6 text-center">Criação de post</h2>

            <form @submit.prevent="onSubmit" class="space-y-4">
                <div class="flex flex-col">
                    <label for="author_id" class="mb-1">Autor</label>
                    <div class="flex gap-2">
                        <select id="author_id" v-model="author_id" class="flex-grow bg-[#2c2f31] border-2 border-[#ff8200] outline-none text-white px-4 py-2 rounded-md">
                            <option value="" disabled>Selecione um autor</option>
                            <option v-for="author in authors" :key="author.id" :value="author.id">
                                {{ author.name }}
                            </option>
                        </select>
                    </div>
                    <p v-if="errors.author_id" class="text-red-500 text-sm mt-1">{{ errors.author_id }}</p>
                </div>

                <div class="flex flex-col">
                    <label for="category_id" class="mb-1">Categoria</label>
                    <div class="flex gap-2">
                        <select id="category_id" v-model="category_id" class="flex-grow bg-[#2c2f31] border-2 border-[#ff8200] outline-none text-white px-4 py-2 rounded-md">
                            <option value="" disabled>Selecione uma categoria</option>
                            <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                                {{ cat.name }}
                            </option>
                        </select>
                    </div>
                    <p v-if="errors.category_id" class="text-red-500 text-sm mt-1">{{ errors.category_id }}</p>
                </div>

                <div class="flex flex-col">
                    <label for="title" class="mb-1">Título</label>
                    <input id="title" v-model="title" type="text" class="bg-[#2c2f31] border-2 border-[#ff8200] outline-none text-white px-4 py-2 rounded-md" />
                    <p v-if="errors.title" class="text-red-500 text-sm mt-1">{{ errors.title }}</p>
                </div>

                <div class="flex flex-col">
                    <label for="slug" class="mb-1">Slug</label>
                    <input id="slug" v-model="slug" type="text" class="bg-[#2c2f31] border-2 border-[#FF8200] outline-none text-white px-4 py-2 rounded-md" />
                    <p v-if="errors.slug" class="text-red-500 text-sm mt-1">{{ errors.slug }}</p>
                </div>

                <div class="flex flex-col">
                    <label for="description" class="mb-1">Descrição</label>
                    <input id="description" v-model="description" type="text" class="bg-[#2c2f31] border-2 border-[#FF8200] outline-none text-white px-4 py-2 rounded-md" />
                    <p v-if="errors.description" class="text-red-500 text-sm mt-1">{{ errors.description }}</p>
                </div>

                <div class="flex flex-col">
                    <label for="post_image_url" class="mb-1">URL da imagem</label>
                    <input id="post_image_url" v-model="post_image_url" type="text" class="bg-[#2c2f31] border-2 border-[#FF8200] outline-none text-white px-4 py-2 rounded-md" />
                    <p v-if="errors.post_image_url" class="text-red-500 text-sm mt-1">{{ errors.post_image_url }}</p>
                </div>

                <div class="flex flex-col">
                    <label for="content" class="mb-1">Conteúdo</label>
                    <textarea
                        id="content"
                        v-model="content"
                        rows="6"
                        class="bg-[#2c2f31] border-2 border-[#FF8200] outline-none text-white px-4 py-2 rounded-md resize-none"
                    ></textarea>
                    <p v-if="errors.content" class="text-red-500 text-sm mt-1">{{ errors.content }}</p>
                </div>

                <div class="flex justify-end gap-4 mt-6">
                    <button type="button" @click="$emit('close')" class="bg-[#2c2f31] border-2 border-[#ff8200] text-white px-6 py-2 rounded-md">Cancelar</button>
                    <button type="submit" class="bg-[#FF8200] text-black font-bold px-6 py-2 rounded-md">Salvar</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import axios from "axios";
import {ref} from "vue";
import {useForm} from "vee-validate";
import * as yup from "yup";
import {useToast} from "vue-toastification";
import "vue-toastification/dist/index.css";
import CommentItem from "./CommentItem.vue";

const toast = useToast();

const commentSchema = yup.object().shape({
    comment: yup.string().trim().max(200, "Máximo de 200 caracteres"),
});

const {defineField, handleSubmit, errors, resetForm} = useForm({
    validationSchema: commentSchema,
});

const [commentValidation, commentValidationAttrs] = defineField("comment");

const props = defineProps({
    postId: {
        type: Number,
        required: true,
    },
});

const comments = ref([]);
const loading = ref(true);
const addingComment = ref(false);
const isAuthenticated = ref(false);
const textareaRows = ref(1);
const showSubmitButton = ref(false);
const sortOrder = ref("recent");

const buildCommentTree = (comments, parentId = null) => {
    return comments
        .filter((comment) => comment.parent_id === parentId)
        .map((comment) => ({
            ...comment,
            replies: buildCommentTree(comments, comment.id),
        }));
};

const commentTree = computed(() => {
    const sorted = [...comments.value].sort((a, b) => {
        const dateA = new Date(a.created_at);
        const dateB = new Date(b.created_at);
        return sortOrder.value === "recent" ? dateB - dateA : dateA - dateB;
    });
    return buildCommentTree(sorted);
});

const onSubmit = handleSubmit(async (values) => {
    if (!isAuthenticated.value) return;

    if (!values.comment || values.comment.trim().length === 0) {
        toast.error("O comentário não pode estar vazio");
        return;
    }

    const token = sessionStorage.getItem("token");
    const runtimeConfig = useRuntimeConfig();

    addingComment.value = true;

    try {
        await axios.post(
            `${runtimeConfig.public.apiBase}/comments`,
            {
                comment: {
                    post_id: props.postId,
                    content: values.comment,
                    parent_id: null,
                },
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        resetForm();
        textareaRows.value = 1;
        showSubmitButton.value = false;
        await fetchComments();
        toast.success("Comentário adicionado com sucesso!");
    } catch (error) {
        toast.error("Erro ao adicionar comentário");
    } finally {
        addingComment.value = false;
    }
});

const adjustRows = () => {
    const charPerRow = 78;
    const minRows = 1;
    const maxRows = 5;
    const charCount = commentValidation.value?.length || 0;
    textareaRows.value = Math.max(minRows, Math.min(maxRows, Math.ceil(charCount / charPerRow)));
};

const checkSubmitButtonVisibility = () => {
    showSubmitButton.value = !!commentValidation.value?.trim().length > 0;
};

const sortComments = (order) => {
    sortOrder.value = order;
};

const fetchComments = async () => {
    try {
        const runtimeConfig = useRuntimeConfig();
        const response = await axios.get(`${runtimeConfig.public.apiBase}/comments/${props.postId}`);
        comments.value = response.data.data.comments;
    } catch (error) {
        toast.error("Erro ao carregar comentários");
    } finally {
        loading.value = false;
    }
};

const checkAuthentication = () => {
    const token = sessionStorage.getItem("token");
    isAuthenticated.value = !!token;
};

onMounted(() => {
    checkAuthentication();
    fetchComments();
});
</script>

<template>
    <div class="flex flex-col items-start w-full justify-center mt-8">
        <h2 class="text-2xl font-bold mb-4">{{ comments.length }} Comments</h2>
        <div v-if="!isAuthenticated" class="flex items-center self-center gap-4 bg-[#FF8200] rounded-md px-8 py-4 my-4">
            <Icon name="material-symbols:link-rounded" class="bg-black w-6 h-6" />
            <NuxtLink :to="`/home/login`" class="flex justify-center self-center items-center text-black text-center text-md font-bold h-fit"> Log in to add a comment </NuxtLink>
            <Icon name="material-symbols:link-rounded" class="bg-black w-6 h-6" />
        </div>

        <form v-if="isAuthenticated" @submit.prevent="onSubmit" class="w-full mt-4">
            <div class="flex items-center px-3 py-2 rounded-lg bg-[#1e2022]">
                <textarea
                    id="comments"
                    v-model="commentValidation"
                    v-bind="commentValidationAttrs"
                    :rows="textareaRows"
                    @input="adjustRows"
                    @focus="showSubmitButton = true"
                    @blur="checkSubmitButtonVisibility"
                    class="overflow-hidden resize-none block mr-2 p-2.5 w-full text-sm rounded-lg border outline-none text-gray-900 bg-[#27292b] border-[#1e2022] focus:ring-[#FF8200] focus:border-[#FF8200] dark:border-gray-600 dark:placeholder-white dark:text-white"
                    placeholder="Add a comment..."
                ></textarea>
                <button
                    type="submit"
                    class="flex items-center justify-center p-2 text-blue-[#FF8200] rounded-full cursor-pointer hover:bg-blue-100 dark:text-[#FF8200] transition-all dark:hover:bg-gray-600"
                    :disabled="addingComment"
                >
                    <Icon name="ic:round-send" class="bg-[#FF8200] w-6 h-6" />
                </button>
            </div>
            <p v-if="errors.comment" class="text-red-500 text-sm mt-1">{{ errors.comment }}</p>
        </form>

        <div v-if="comments.length" class="w-full mt-4">
            <div class="flex gap-2 mb-4">
                <button @click="sortComments('recent')" class="px-3 py-1 rounded bg-[#27292b] text-white hover:bg-[#FF8200]">Newest comments</button>
                <button @click="sortComments('oldest')" class="px-3 py-1 rounded bg-[#27292b] text-white hover:bg-[#FF8200]">Oldest comments</button>
            </div>
            <div>
                <CommentItem v-for="comment in commentTree" :key="comment.id" :comment="comment" :is-response="false" :post-id="postId" @refresh-comments="fetchComments" />
            </div>
        </div>

        <div v-else class="flex justify-center self-center items-center text-black text-center text-md font-bold bg-[#FF8200] px-8 py-4 h-fit rounded-md my-8">
            No comments yet. Be the first to comment!
        </div>
    </div>
</template>

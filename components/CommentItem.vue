<script setup>
import {ref} from "vue";
import axios from "axios";
import {useToast} from "vue-toastification";
import "vue-toastification/dist/index.css";

const props = defineProps({
    comment: {
        type: Object,
        required: true,
    },
    level: {
        type: Number,
        default: 0,
    },
    postId: {
        type: Number,
        required: true,
    },
});

const showReplyForm = ref(false);
const replyContent = ref("");
const addingReply = ref(false);
const toast = useToast();

const timeAgo = (createdAt) => {
    const now = new Date();
    const past = new Date(createdAt);
    const diffMs = now - past;

    const diffSeconds = Math.floor(diffMs / 1000);
    if (diffSeconds < 60) return "agora mesmo";
    const diffMinutes = Math.floor(diffSeconds / 60);
    if (diffMinutes < 60) return `há ${diffMinutes} minuto${diffMinutes !== 1 ? "s" : ""}`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `há ${diffHours} hora${diffHours !== 1 ? "s" : ""}`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 30) return `há ${diffDays} dia${diffDays !== 1 ? "s" : ""}`;
    const diffMonths = Math.floor(diffDays / 30);
    if (diffMonths < 12) return `há ${diffMonths} mês${diffMonths !== 1 ? "es" : ""}`;
    const diffYears = Math.floor(diffDays / 365);
    return `há ${diffYears} ano${diffYears !== 1 ? "s" : ""}`;
};

const submitReply = async () => {
    if (!replyContent.value.trim()) {
        toast.error("A resposta não pode estar vázia");
        return;
    }

    const emit = defineEmits(["refresh-comments"]);
    const token = sessionStorage.getItem("token");
    const user_id = sessionStorage.getItem("userId");
    const runtimeConfig = useRuntimeConfig();

    addingReply.value = true;

    try {
        await axios.post(
            `${runtimeConfig.public.apiBase}/comments`,
            {
                comment: {
                    post_id: props.postId,
                    content: replyContent.value,
                    user_id: Number(user_id),
                    parent_id: props.comment.id, // Define o parent_id para a resposta
                },
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        toast.success("Resposta adicionada com sucesso!");
        replyContent.value = "";
        showReplyForm.value = false;
        emit("refresh-comments");
    } catch (error) {
        toast.error("Erro ao adicionar resposta");
    } finally {
        addingReply.value = false;
    }
};
</script>

<template>
    <div :style="{marginLeft: `${level * 20}px`}" class="p-4 border border-[#3c4143] rounded-md bg-[#1e2022] mt-2">
        <div class="flex items-center gap-2">
            <p class="font-semibold">@{{ comment.user_name.replace(/\s/g, "_") }}</p>
            <p class="text-sm text-gray-500 mt-1">{{ timeAgo(comment.created_at) }}</p>
        </div>
        <p class="mt-2 break-words">{{ comment.content }}</p>
        <button @click="showReplyForm = !showReplyForm" class="text-[#FF8200] mt-2">Responder</button>
        <div v-if="showReplyForm" class="mt-2">
            <textarea
                v-model="replyContent"
                class="w-full p-2 border rounded bg-[#27292b] text-white border-[#1e2022] focus:ring-[#FF8200]"
                placeholder="Escreva sua resposta..."
            ></textarea>
            <button @click.prevent="submitReply" class="mt-2 bg-[#FF8200] text-white px-4 py-2 rounded" :disabled="addingReply">Enviar Resposta</button>
        </div>
        <div v-if="comment.replies && comment.replies.length > 0" class="mt-2">
            <CommentItem v-for="reply in comment.replies" :key="reply.id" :comment="reply" :level="level + 1" :post-id="postId" @refresh-comments="$emit('refresh-comments')" />
        </div>
    </div>
</template>

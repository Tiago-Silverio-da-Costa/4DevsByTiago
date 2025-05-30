<script setup>
import {ref, defineEmits} from "vue";
import axios from "axios";
import {useToast} from "vue-toastification";
import "vue-toastification/dist/index.css";

const props = defineProps({
    comment: {
        type: Object,
        required: true,
    },
    isResponse: {
        type: Boolean,
        default: false,
    },
    postId: {
        type: Number,
        required: true,
    },
});

const emit = defineEmits(["refresh-comments"]);
const showReplyForm = ref(false);
const replyContent = ref("");
const addingReply = ref(false);
const toast = useToast();

const timeAgo = (createdAt) => {
    const now = new Date();
    const past = new Date(createdAt);
    const diffMs = now - past;

    const diffSeconds = Math.floor(diffMs / 1000);
    if (diffSeconds < 60) return "just now";
    const diffMinutes = Math.floor(diffSeconds / 60);
    if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes !== 1 ? "s" : ""} ago`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 30) return `${diffDays} days${diffDays !== 1 ? "s" : ""} ago`;
    const diffMonths = Math.floor(diffDays / 30);
    if (diffMonths < 12) return `${diffMonths} month${diffMonths !== 1 ? "es" : ""} ago`;
    const diffYears = Math.floor(diffDays / 365);
    return `${diffYears} year${diffYears !== 1 ? "s" : ""} ago`;
};

const submitReply = async () => {
    if (!replyContent.value.trim()) {
        toast.error("The reply cannot be empty!");
        return;
    }

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
                    parent_id: props.comment.id,
                },
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        toast.success("Reply added!");
        replyContent.value = "";
        showReplyForm.value = false;
        emit("refresh-comments");
    } catch (error) {
        toast.error("Error when trying to add reply!");
    } finally {
        addingReply.value = false;
    }
};
</script>

<template>
    <div :class="{'ml-5': isResponse}" class="p-4 border border-[#3c4143] rounded-md bg-[#1e2022] mt-2">
        <div class="flex items-center gap-2">
            <p class="font-semibold">@{{ comment.user_name.replace(/\s/g, "_") }}</p>
            <p class="text-sm text-gray-500 mt-1">{{ timeAgo(comment.created_at) }}</p>
        </div>
        <p class="mt-2 break-words">{{ comment.content }}</p>
        <button @click="showReplyForm = !showReplyForm" class="text-[#FF8200] mt-2">Reply</button>
        <div v-if="showReplyForm" class="mt-2">
            <textarea
                v-model="replyContent"
                class="overflow-hidden resize-none block mr-2 p-2.5 w-full text-sm rounded-lg border outline-none text-gray-900 bg-[#27292b] border-[#1e2022] focus:ring-[#FF8200] focus:border-[#FF8200] dark:border-gray-600 dark:placeholder-white dark:text-white"
                placeholder="Write your reply..."
            ></textarea>
            <button @click.prevent="submitReply" class="mt-2 bg-[#FF8200] text-white px-4 py-2 rounded" :disabled="addingReply">Send</button>
        </div>
    </div>
    <div v-if="comment.replies && comment.replies.length > 0" class="mt-2">
        <CommentItem v-for="reply in comment.replies" :key="reply.id" :comment="reply" :is-response="true" :post-id="postId" @refresh-comments="$emit('refresh-comments')" />
    </div>
</template>

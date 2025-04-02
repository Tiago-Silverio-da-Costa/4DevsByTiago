<template>
    <div class="flex flex-col items-start w-full justify-center mt-8">
        <h2 class="text-2xl font-bold mb-4">{{ comments.length }} Comentários</h2>

        <form v-if="isAuthenticated" @submit.prevent="addComment" class="w-full mt-4">
            <div class="flex items-center px-3 py-2 rounded-lg bg-[#1e2022]">
                <!-- <button
                    type="button"
                    class="p-2 text-gray-500 rounded-lg cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
                >
                    <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                        <path
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M13.408 7.5h.01m-6.876 0h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM4.6 11a5.5 5.5 0 0 0 10.81 0H4.6Z"
                        />
                    </svg>
                    <span class="sr-only">Add emoji</span>
                </button> -->
                <textarea
                    v-model="newComment"
                    :rows="textareaRows"
                    @input="adjustRows"
                    @focus="showSubmitButton = true"
                    @blur="checkSubmitButtonVisibility"
                    class="overflow-hidden resize-none block mr-2 p-2.5 w-full text-sm rounded-lg border outline-none text-gray-900 bg-[#27292b] border-[#1e2022] focus:ring-[#FF8200] focus:border-[#FF8200] dark:border-gray-600 dark:placeholder-white dark:text-white"
                    placeholder="Adicionar um comentário..."
                ></textarea>
                <button
                    v-if="showSubmitButton"
                    type="submit"
                    class="inline-flex justify-center p-2 text-blue-[#FF8200] rounded-full cursor-pointer hover:bg-blue-100 dark:text-[#FF8200] dark:hover:bg-gray-600"
                    :disabled="addingComment"
                >
                    <svg class="w-5 h-5 rotate-90 rtl:-rotate-90" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 20">
                        <path d="m17.914 18.594-8-18a1 1 0 0 0-1.828 0l-8 18a1 1 0 0 0 1.157 1.376L8 18.281V9a1 1 0 0 1 2 0v9.281l6.758 1.689a1 1 0 0 0 1.156-1.376Z" />
                    </svg>
                    <span class="sr-only">Send message</span>
                </button>
            </div>
        </form>

        <div v-if="comments.length" class="w-full mt-4">
            <div class="flex gap-2 mb-4">
                <button @click="sortComments('recent')" class="px-3 py-1 rounded bg-[#27292b] text-white hover:bg-[#FF8200]">Mais recentes</button>
                <button @click="sortComments('oldest')" class="px-3 py-1 rounded bg-[#27292b] text-white hover:bg-[#FF8200]">Mais antigos</button>
            </div>
            <div v-if="comments.length">
                <div v-for="comment in sortedComments" :key="comment.id" class="p-4 border border-[#3c4143] rounded-md bg-[#1e2022]">
                    <div class="flex items-center gap-2">
                        <p class="font-semibold">@{{ comment.user_name.replace(/\s/g, "_") }}</p>
                        <p class="text-sm text-gray-500 mt-1">{{ timeAgo(comment.created_at) }}</p>
                    </div>
                    <p class="mt-2">{{ comment.content }}</p>
                </div>
            </div>
        </div>
        <div v-else class="text-gray-500">Ainda não há comentários. Seja o primeiro a comentar!</div>

        <NuxtLink v-if="!isAuthenticated" :to="`/login`" class="text-gray-500 mt-2"> Faça login para adicionar um comentário </NuxtLink>
    </div>
</template>

<script>
import axios from "axios";

export default {
    props: {
        postId: {
            type: Number,
            required: true,
        },
    },
    data() {
        return {
            comments: [],
            newComment: "",
            loading: true,
            addingComment: false,
            isAuthenticated: false,
            textareaRows: 1,
            showSubmitButton: false,
            sortOrder: "recent",
        };
    },
    computed: {
        sortedComments() {
            return [...this.comments].sort((a, b) => {
                const dateA = new Date(a.created_at);
                const dateB = new Date(b.created_at);
                console.log("dateB", dateB);
                return this.sortOrder === "recent" ? dateB - dateA : dateA - dateB;
            });
        },
    },
    created() {
        this.checkAuthentication();
        this.fetchComments();
    },
    methods: {
        adjustRows() {
            const charPerRow = 114;
            const minRows = 1;
            const maxRows = 5;
            const charCount = this.newComment.length;
            const calculatedRows = Math.max(minRows, Math.min(maxRows, Math.ceil(charCount / charPerRow)));
            this.textareaRows = calculatedRows;
        },
        checkSubmitButtonVisibility() {
            this.showSubmitButton = false;
            if (this.newComment.trim()) {
                this.showSubmitButton = false;
            }
        },
        sortComments(order) {
            this.sortOrder = order;
        },
        async fetchComments() {
            try {
                const runtimeConfig = useRuntimeConfig();
                const response = await axios.get(`${runtimeConfig.public.apiBase}/comments/${this.postId}`);
                this.comments = response.data.data.comments.reverse();
            } catch (error) {
                // console.log("Erro ao carregar comentários:", error);
            } finally {
                this.loading = false;
            }
        },
        async addComment() {
            if (!this.newComment.trim()) return;

            const token = sessionStorage.getItem("token");
            const user_id = sessionStorage.getItem("userId");

            this.addingComment = true;
            const runtimeConfig = useRuntimeConfig();

            try {
                await axios.post(
                    `${runtimeConfig.public.apiBase}/comments`,
                    {
                        comment: {
                            post_id: this.postId,
                            content: this.newComment,
                            user_id: Number(user_id),
                        },
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                this.newComment = "";
                this.textareaRows = 1;
                this.showSubmitButton = false;
                this.fetchComments();
            } catch (error) {
                // console.error("Erro ao adicionar comentário:", error);
            } finally {
                this.addingComment = false;
            }
        },
        checkAuthentication() {
            const token = sessionStorage.getItem("token");
            this.isAuthenticated = !!token;
        },
        timeAgo(createdAt) {
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
        },
    },
};
</script>

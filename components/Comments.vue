<template>
    <div class="flex flex-col items-start w-full justify-center mt-8">
        <h2 class="text-2xl font-bold mb-4">{{ comments.length }} Comentários</h2>
        <form v-if="isAuthenticated" @submit.prevent="addComment" class="w-full mt-4">
            <textarea v-model="newComment" rows="1" placeholder="Adicionar um comentário..." class="w-full p-2 border border-[#3c4143] bg-[#1e2022] outline-none rounded-md">
            </textarea>
            <button type="submit" class="mt-2 px-4 py-2 bg-[#FF8200] text-white rounded-md" :disabled="addingComment">
                {{ addingComment ? "Enviando..." : "Comentar" }}
            </button>
        </form>
        <div v-if="comments.length" class="w-full mt-4">
            <div v-for="comment in comments" :key="comment.id" class="p-4 border border-[#3c4143] rounded-md bg-[#1e2022]">
                <div class="flex items-center gap-2">
                    <p class="font-semibold">@{{ comment.user_name.replace(/\s/g, "_") }}</p>
                    <p class="text-sm text-gray-500 mt-1">{{ timeAgo(comment.created_at) }}</p>
                </div>
                <p class="mt-2">{{ comment.content }}</p>
            </div>
        </div>
        <div v-else class="text-gray-500">Ainda não há comentários. Seja o primeiro a comentar!</div>

        <NuxtLink v-else :to="`/login`" class="text-gray-500 mt-2"> Faça login para adicionar um comentário </NuxtLink>
    </div>
</template>

<script>
import axios from "axios";
import moment from "moment-timezone";

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
        };
    },
    created() {
        this.checkAuthentication();
        this.fetchComments();
    },
    methods: {
        async fetchComments() {
            try {
                const runtimeConfig = useRuntimeConfig();

                const response = await axios.get(`${runtimeConfig.public.apiBase}/comments/${this.postId}`);
                this.comments = response.data.data.comments;
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
            const now = moment().tz("America/Sao_Paulo");
            const past = moment(createdAt).tz("America/Sao_Paulo");
            const diffSeconds = now.diff(past, "seconds");

            if (diffSeconds < 60) return "agora mesmo";
            const diffMinutes = now.diff(past, "minutes");
            if (diffMinutes < 60) return `há ${diffMinutes} minuto${diffMinutes !== 1 ? "s" : ""}`;
            const diffHours = now.diff(past, "hours");
            if (diffHours < 24) return `há ${diffHours} hora${diffHours !== 1 ? "s" : ""}`;
            const diffDays = now.diff(past, "days");
            if (diffDays < 30) return `há ${diffDays} dia${diffDays !== 1 ? "s" : ""}`;
            const diffMonths = now.diff(past, "months");
            if (diffMonths < 12) return `há ${diffMonths} mês${diffMonths !== 1 ? "es" : ""}`;
            const diffYears = now.diff(past, "years");
            return `há ${diffYears} ano${diffYears !== 1 ? "s" : ""}`;
        },
    },
};
</script>

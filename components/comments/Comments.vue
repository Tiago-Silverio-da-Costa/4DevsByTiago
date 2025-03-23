<template>
    <div class="flex flex-col items-center w-full justify-center mt-8">
        <h2 class="text-2xl font-bold mb-4">Comentários</h2>
        <div v-if="comments.length" class="w-full">
            <div v-for="comment in comments" :key="comment.id" class="p-4 border border-gray-300 rounded-md bg-gray-100">
                <p class="font-semibold">{{ comment.user_name }}</p>
                <p class="mt-2">{{ comment.content }}</p>
                <p class="text-sm text-gray-500 mt-1">{{ new Date(comment.created_at).toLocaleDateString("pt-BR") }}</p>
            </div>
        </div>
        <div v-else class="text-gray-500">Ainda não há comentários. Seja o primeiro a comentar!</div>

        <form v-if="isAuthenticated" @submit.prevent="addComment" class="w-full mt-4">
            <textarea v-model="newComment" rows="3" placeholder="Escreva seu comentário" class="w-full p-2 border border-gray-300 rounded-md"> </textarea>
            <button type="submit" class="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700" :disabled="addingComment">
                {{ addingComment ? "Enviando..." : "Adicionar Comentário" }}
            </button>
        </form>
        <NuxtLink v-else :to="`/login`" class="text-gray-500 mt-2"> Faça login para adicionar um comentário </NuxtLink>
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
        };
    },
    created() {
        this.checkAuthentication();
        this.fetchComments();
    },
    methods: {
        async fetchComments() {
            try {
                const response = await axios.get(`http://127.0.0.1:8080/comments/comments/${this.postId}`);
                this.comments = response.data.data.comments;
            } catch (error) {
                // console.log("Erro ao carregar comentários:", error);
            } finally {
                this.loading = false;
            }
        },
        async addComment() {
            if (!this.newComment.trim()) return;

            const token = localStorage.getItem("token");
            const user_id = localStorage.getItem("userId");

            this.addingComment = true;

            try {
                await axios.post(
                    `http://127.0.0.1:8080/comments/comments`,
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
            const token = localStorage.getItem("token");
            this.isAuthenticated = !!token;
        },
    },
};
</script>

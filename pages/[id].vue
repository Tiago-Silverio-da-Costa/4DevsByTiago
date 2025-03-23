<template>
    <div v-if="post" class="bg-[#3C3D37] text-white">
        <div class="mx-auto w-5/6 max-w-4xl py-4">
            <NuxtImg v-if="post.post_image_url" :src="post.post_image_url" alt="image" width="100%" height="200" />
            <!-- <span class="font-bold text-xl mt-2">Autor: {{ post.author_name }}</span> -->
            <h1 class="font-bold text-4xl mt-4">{{ post.title }}</h1>
            <p class="mt-4">{{ post.content }}</p>
            <div class="mt-4 text-[#FF8200]">
                <span>{{ post.publication_date }}</span> | <span>{{ post.category_name }}</span>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios";

export default {
    data() {
        return {
            post: [],
        };
    },
    created() {
        const id = Number(this.$route.params.id);
        axios
            .get(`http://127.0.0.1:8080/post/post/${id}`)
            .then((response) => {
                this.post = response.data.data;

                const publicationDate = new Date(response.data.publication_date);
                this.formattedPublicationDate = publicationDate;
            })
            .catch((error) => {
                console.error("Error fetching posts", error);
            });
    },
};
</script>

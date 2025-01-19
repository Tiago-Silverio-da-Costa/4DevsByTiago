<template>
    <div class="bg-[#3C3D37] text-white">
        <div class="mx-auto w-5/6 max-w-[49.5rem] py-4">
            <Search />
            <div class="flex flex-wrap gap-5 justify-center w-full">
                <NuxtLink :to="`/${post.id}`" v-for="post in posts" :key="post.id"
                    class="bg-[#181C14] mt-4 w-96 border-2 border-[#FF8200] rounded-md overflow-hidden">
                    <!-- image -->
                    <div class="flex-1 bg-[#181C14] border-b-2 border-b-[#FF8200]">
                        <NuxtImg :src="post.post_image_url" alt="image" width="400" height="200" />
                    </div>
                    <!-- body -->
                    <div class="flex flex-col gap-4 px-8 py-4">
                        <h2 class="font-bold text-2xl"> {{ post.title }}</h2>
                        <p class=" text-md flex max-w-md ">{{ post.description }}</p>
                    </div>
                    <!-- footer -->
                    <div
                        class="flex px-8 py-4 items-center justify-between border-t-2 border-t-[#FF8200] text-[#FF8200]">
                        <div class="flex items-center gap-2">
                            <NuxtImg src="watchIcon.svg" alt="image" width="20" height="20" />
                            <span>{{ post.publication_date }}</span>
                        </div>
                        <span>{{ post.category }}</span>
                    </div>
                </NuxtLink>
            </div>
        </div>
    </div>
</template>


<script>
import Search from '@/components/Search.vue';
import axios from 'axios';
import { onMounted } from 'vue';

export default {
    data() {
        return {
            posts: [],
        };
    },
    mounted() {

        axios.get("http://127.0.0.1:8080/post/post")
            .then(response => {
                console.log("Posts fetched:", response.data);
                this.posts = response.data.data;
            })
            .catch(error => {
                console.error("Error fetching posts", error)
            })

    }
}
</script>

<style scoped>
ul {
    list-style: none;
    padding: 0;
}
</style>

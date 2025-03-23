<template>
    <div v-if="post" class="bg-[#3C3D37] text-white">
        <Header />
        <div class="overflow-hidden h-80 flex items-center mb-20">
            <NuxtImg v-if="post.post_image_url" :src="post.post_image_url" alt="image" width="100%" height="200" />
        </div>

        <div class="mx-auto w-5/6 max-w-3xl py-4">
            <!-- <span class="font-bold text-xl mt-2">Autor: {{ post.author_name }}</span> -->
            <h1 class="font-bold text-4xl mt-4">{{ post.title }}</h1>
            <div class="mt-4" v-html="introductionContent"></div>
            <ul class="mt-4 list-disc list-inside text-[#FF8200]" v-if="summary.length">
                <li v-for="(item, index) in summary" :key="index">
                    <nuxt-link :to="`#${item.formattedTitle}`">{{ item.title }}</nuxt-link>
                </li>
            </ul>
            <div class="mt-4" v-html="processedContent"></div>
            <div class="mt-4 text-[#FF8200]">
                <span>{{ post.publication_date }}</span> | <span>{{ post.category_name }}</span>
            </div>

            <Comments :postId="post.id" />
        </div>
        <Footer />
    </div>
</template>

<script>

import axios from 'axios'
import Comments from "@/components/comments/Comments.vue";


export default {
    components: {
        Comments,
    },
    data() {
        return {
            post: null,
            introductionContent: '',
            processedContent: '',
            summary: [],
            formattedPublicationDate: ''
        };
    },
    created() {
        const id = Number(this.$route.params.id);

        axios.get(`http://127.0.0.1:8080/post/post/${id}`)
            .then(response => {
                const post = response.data.data;
                this.post = post;

                const publicationDate = new Date(response.data.publication_date)
                this.formattedPublicationDate = publicationDate.toLocaleDateString("Pt-BR", {
                    timeZone: "America/Sao_Paulo",
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                });

                this.parseContent(post.content)
            })
            .catch(error => {
                console.error("Error fetching posts", error)

            })
            .catch((error) => {
                console.error("Error fetching posts", error);
            });
    },
    methods: {
        parseContent(content) {
            const lines = content.split('\n');
            const newContent = [];
            const introductionContent = [];
            const titles = [];
            let isInCodeBlock = false;
            let codeBlockContent = [];
            let isFirstTitleFound = false;

            lines.forEach((line, index) => {
                const isTitle = line.startsWith('<title>');
                const isImage = line.includes('<image>') && line.includes('</image>');
                const isCodeStart = line.startsWith('<code>')
                const isCodeEnd = line.endsWith('</code>');
                const IsList = line.startsWith('-');


                if (!content) return;


                if (isTitle) {
                    isFirstTitleFound = true;
                    const title = line.replace(/<\/?title>/g, '').trim();
                    const formattedTitle = title.replace(/\s+/g, '-');
                    titles.push({ title, formattedTitle });

                    newContent.push(`<h2 id="${formattedTitle}" class="text-3xl font-bold text-primary">${title}</h2>`)
                    return
                }

                if (!isFirstTitleFound) {
                    if (isImage) {
                        const imgSrc = line.replace(/<image>|<\/image>/g, '').trim();
                        introductionContent.push(`<img class="w-full" src="${imgSrc}" alt="Introduction Image" />`);
                        return
                    }

                    introductionContent.push(`<p>${line}</p><br />`)
                    return
                }

                if (isImage) {
                    const imgSrc = line.replace(/<image>|<\/image>/g, '').trim();
                    newContent.push(`<img class="w-full mt-4" src="${imgSrc}" alt="Post Image" />`);
                    return;
                }

                if (isCodeStart) {
                    isInCodeBlock = true;

                    codeBlockContent.push(line.replace(/<code>/, ''))
                    return
                }

                if (isInCodeBlock) {
                    if (isCodeEnd) {
                        isInCodeBlock = false
                        codeBlockContent.push(line.replace(/<\/code>/, ''))
                        newContent.push(
                            `<pre class="border border-primary p-4 rounded-lg bg-[#1E1E1E] text-white overflow-auto"><code>${codeBlockContent
                                .join('\n')
                                .replace(/</g, '&lt;')
                                .replace(/>/g, '&gt;')}</code></pre>`
                        );
                        codeBlockContent = []
                    } else {
                        codeBlockContent.push(line)
                    }

                    return
                }

                if (IsList) {
                    const listItem = line.slice(1).trim()
                    newContent.push(`<li>${listItem}</li>`)
                    return
                }

                newContent.push(`<p>${line}</p><br />`)
            })

            this.introductionContent = introductionContent.join('')
            this.processedContent = newContent.join('')
            this.summary = titles
        }
    }
};
</script>

<template>
    <div v-if="post" class="flex flex-col justify-between flex-wrap bg-[#3C3D37] text-white min-h-screen">
        <Header />
        <div class="overflow-hidden h-80 flex items-center mb-20">
            <img class="w-full" v-if="post.post_image_url" :src="post.post_image_url" alt="image" width="100%" height="200" />
        </div>

        <div class="mx-auto w-5/6 max-w-3xl py-4">
            <div class="mt-4">
                <span>{{ formattedPublicationDate }}</span>
                <!-- | <span>{{ post.category_name }}</span> -->
            </div>
            <h1 class="font-bold text-4xl mt-4">{{ post.title }}</h1>
            <div class="mt-4" v-html="introductionContent"></div>
            <ul class="mt-4 list-disc list-inside text-[#FF8200]" v-if="summary.length">
                <li v-for="(item, index) in summary" :key="index">
                    <nuxt-link :to="`#${item.formattedTitle}`">{{ item.title }}</nuxt-link>
                </li>
            </ul>
            <div class="mt-4" v-html="processedContent"></div>

            <Comments :postId="post.id" />
        </div>
        <Footer />
    </div>
</template>

<script setup>
import {ref, onMounted, useRoute, useHead, useRuntimeConfig} from "#imports";
import {useToast} from "vue-toastification";
import "vue-toastification/dist/index.css";
import axios from "axios";
import Comments from "@/components/Comments.vue";

const post = ref(null);
const introductionContent = ref("");
const processedContent = ref("");
const summary = ref([]);
const formattedPublicationDate = ref("");

const route = useRoute();
const toast = useToast();
const config = useRuntimeConfig();

function parseContent(content) {
    if (!content) return;

    const lines = content.split("\n");
    const newContent = [];
    const intro = [];
    const titles = [];
    let isFirstTitleFound = false;
    let isInCodeBlock = false;
    let codeBlockContent = [];
    let isInBlockQuote = false;
    let blockQuoteContent = [];

    lines.forEach((line) => {
        console.log("Linha atual:", line);
        const trimmedLine = line.trim();
        if (!trimmedLine) return;

        const isTitle = trimmedLine.startsWith("<title>");
        const isImage = trimmedLine.includes("<image>") && trimmedLine.includes("</image>");
        const isCodeStart = trimmedLine.startsWith("<code>");
        const isCodeEnd = trimmedLine.endsWith("</code>");
        const isList = trimmedLine.startsWith("-");
        const isBlockQuoteStart = trimmedLine.startsWith("<blockquote>");
        const isBlockQuoteEnd = trimmedLine.endsWith("</blockquote>");

        if (isTitle) {
            isFirstTitleFound = true;
            const title = trimmedLine.replace(/<\/?title>/g, "").trim();
            const formattedTitle = title.replace(/\s+/g, "-");
            titles.push({title, formattedTitle});
            newContent.push(`<h2 id="${formattedTitle}" class="text-3xl font-bold text-primary">${title}</h2></br>`);
            return;
        }

        if (!isFirstTitleFound) {
            if (isImage) {
                const imgSrc = trimmedLine.replace(/<image>|<\/image>/g, "").trim();
                intro.push(`<img class="w-full" src="${imgSrc}" alt="Introduction Image" />`);
            } else {
                intro.push(`<p>${trimmedLine}</p>`);
            }
            return;
        }

        if (isBlockQuoteStart) {
            isInBlockQuote = true;
            blockQuoteContent.push(trimmedLine.replace("<blockquote>", "").trim());
            return;
        }

        if (isInBlockQuote) {
            if (isBlockQuoteEnd) {
                isInBlockQuote = false;
                blockQuoteContent.push(trimmedLine.replace("</blockquote>", "").trim());
                const quote = blockQuoteContent.join(" ").trim();
                newContent.push(
                    `<blockquote class="border-l-4 border-l-white" cite="https://4devsbytiagosc.com.br">
                        <p class="px-4 italic leading-[1.625]">"${quote}"</p>
                        <footer class="px-4">— Franklin D. Roosevelt</footer>
                    </blockquote></br>`
                );
                blockQuoteContent = [];
            } else {
                blockQuoteContent.push(trimmedLine);
            }
            return;
        }

        if (isImage) {
            const imgSrc = trimmedLine.replace(/<image>|<\/image>/g, "").trim();
            newContent.push(`<img class="w-full mt-4" src="${imgSrc}" alt="Post Image" />`);
            return;
        }

        if (isCodeStart) {
            isInCodeBlock = true;
            codeBlockContent.push(trimmedLine.replace("<code>", ""));
            return;
        }

        if (isInCodeBlock) {
            if (isCodeEnd) {
                isInCodeBlock = false;
                codeBlockContent.push(trimmedLine.replace("</code>", ""));
                newContent.push(
                    `<pre class="border border-primary p-4 rounded-lg bg-[#1E1E1E] text-[#FF8200] overflow-auto"><code>${codeBlockContent
                        .join("\n")
                        .replace(/</g, "<")
                        .replace(/>/g, ">")}</code></pre>`
                );
                codeBlockContent = [];
            } else {
                codeBlockContent.push(trimmedLine);
            }
            return;
        }

        if (isList) {
            const listItem = trimmedLine.slice(1).trim();
            newContent.push(`<li>${listItem}</li>`);
            return;
        }

        newContent.push(`<p>${trimmedLine}</p>`);
    });

    introductionContent.value = intro.join("");
    processedContent.value = newContent.join("");
    summary.value = titles;
}

onMounted(async () => {
    const slug = route.params.slug;
    try {
        const response = await axios.get(`${config.public.apiBase}/post/slug/${slug}`);
        post.value = response.data.data;

        const publicationDate = new Date(post.value.publication_date);
        formattedPublicationDate.value = `Published ${publicationDate.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        })} at ${publicationDate.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        })} `;

        parseContent(post.value.content);
    } catch (error) {
        toast.error("Error when trying to find post!");
    }
});

useHead(() => {
    if (post.value) {
        return {
            title: post.value.title + " - 4devsbyTiagoSC",
            meta: [
                {
                    name: "description",
                    content: introductionContent.value.replace(/<[^>]+>/g, "").substring(0, 160) || "Leia mais sobre programação e tecnologia no 4devsbyTiagoSC.",
                },
                {
                    name: "keywords",
                    content: `${post.value.category_name}, programação, tecnologia, desenvolvimento`,
                },
                {
                    name: "author",
                    content: "Tiago SC",
                },
            ],
        };
    } else {
        return {
            title: "Carregando... - 4devsbyTiagoSC",
            meta: [
                {
                    name: "description",
                    content: "Carregando um post do blog 4devsbyTiagoSC...",
                },
            ],
        };
    }
});
</script>

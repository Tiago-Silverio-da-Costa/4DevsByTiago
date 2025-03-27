<template>
    <form class="flex justify-center items-center text-black w-full" @submit.prevent>
        <input placeholder="Pesquisar" class="border px-3 py-2 rounded-tl-md rounded-bl-md w-full h-full outline-none" v-model="localQuery" @input="emitSearch" />

        <button type="button" class="flex items-center justify-center text-xl bg-[#FF8200] rounded-tr-md rounded-br-md px-6 py-2 h-full flex-shrink-0" @click="emitSearch">
            <Icon name="ic:baseline-search" class="w-6 h-6" />
        </button>
    </form>
</template>

<script>
export default {
    props: {
        intialQuery: {
            type: String,
            default: "",
        },
    },
    data() {
        return {
            localQuery: this.intialQuery,
        };
    },
    methods: {
        emitSearch() {
            this.$emit("search", this.localQuery);
            console.log("localQuery", this.localQuery);
        },
    },
};
</script>

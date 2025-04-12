<template>
    <form class="flex justify-center items-center bg-[#121212] rounded-md text-black w-full" @submit.prevent>
        <input placeholder="Pesquisar" class="bg-[#121212] text-white px-3 py-2 rounded-tl-md rounded-bl-md w-full h-full outline-none" v-model="localQuery" @input="emitSearch" />

        <button
            type="button"
            class="flex items-center justify-center text-xl bg-[#FF8200] rounded-tr-md rounded-br-md px-6 min-h-[2.55rem] outline-none active:bg-[#FF8200] h-full flex-shrink-0"
            @click="emitSearch"
        >
            <Icon name="ic:baseline-search" class="bg-black w-6 h-6" />
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
        },
    },
};
</script>

<template>
    <form class="flex justify-center items-center text-black w-full" @submit.prevent>
        <input placeholder="Pesquisar" class="border px-3 py-[0.58rem] rounded-tl-md rounded-bl-md w-full"
            v-model="localQuery" @input="emitSearch" />

        <button type="button" class="text-xl bg-[#FF8200] rounded-tr-md rounded-br-md px-6 py-[0.40rem]" @click="emitSearch">
            <NuxtImg src="/serchbar.svg" alt="Pesquisar" width="30" height="40" />
        </button>
    </form>
</template>


<script>
export default {
    props: {
        intialQuery: {
            type: String,
            default: ""
        }
    },
    data() {
        return {
            localQuery: this.intialQuery,
        }
    },
    methods: {
        emitSearch() {
            this.$emit("search", this.localQuery);
        },
    }
}

</script>

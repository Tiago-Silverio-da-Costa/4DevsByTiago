<script>
const props = defineProps({
    isOpen: {
        type: Boolean,
        default: false,
    },
});
watch(() => props.isOpen);
</script>

<template>
    <div class="fixed inset-0 flex items-center justify-center z-50">
        <div class="absolute inset-0 bg-black bg-opacity-70" @click="$emit('close')"></div>
        <div class="bg-[#181C14] border-2 border-[#FF8200] rounded-md w-full max-w-md z-10 p-6 text-white">
            <h3 class="text-xl font-bold mb-4">Confirmar Exclusão</h3>
            <p class="mb-4">Você realmente deseja excluir o post "{{ postToDelete?.title }}"?</p>
            <div class="flex justify-end gap-4">
                <button @click="$emit('close')" class="bg-[#2c2f31] border-2 border-[#FF8200] text-white px-4 py-2 rounded-md">Cancelar</button>
                <button @click="confirmDelete" class="bg-[#FF8200] text-black font-bold px-4 py-2 rounded-md">Excluir</button>
            </div>
        </div>
    </div>
</template>

<template>
    <footer class="bg-[#181C14]">
        <div class="flex justify-center py-4 w-5/6 max-w-4xl mx-auto text-white">
            <p class="font-semibold">4DevsByTiagoSC {{ currentYear }} | All rights reserved</p>
        </div>
    </footer>
</template>

<script>
export default {
    data() {
        return {
            currentYear: new Date().getFullYear(),
        };
    },
};
</script>

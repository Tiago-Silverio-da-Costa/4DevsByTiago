import {defineStore} from "pinia";
import axios from "axios";

export const useAuthStore = defineStore("auth", {
    state: () => ({
        token: null,
        user: null,
    }),
    getters: {
        isAdmin: (state) => state.user?.role === "admin",
        isAuthenticated: (state) => !!state.token,
    },
    actions: {
        async loadUser() {
            if (import.meta.client) {
                this.token = sessionStorage.getItem("token");
                if (this.token) {
                    try {
                        const runtimeConfig = useRuntimeConfig();
                        const response = await axios.get(`${runtimeConfig.public.apiBase}/user/session`, {
                            headers: {Authorization: `Bearer ${this.token}`},
                        });
                        this.user = response.data.results;
                    } catch (error) {
                        this.logout();
                    }
                }
            }
        },
        logout() {
            this.token = null;
            this.user = null;
            if (import.meta.client) {
                sessionStorage.removeItem("token");
            }
            navigateTo("/home/login");
        },
    },
});

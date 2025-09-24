import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import Cookies from 'js-cookie';
import { useCartStore } from './cartStore';

interface User {
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    gender: string;
    image: string;
}

interface AuthState {
    user: User | null;
    token: string | null;
    login: (userData: User, token: string) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            login: (userData, token) => {
                Cookies.set('auth_token', token, { expires: 1, secure: true });
                set({ user: userData, token });
            },
            logout: () => {
                Cookies.remove('auth_token');
                set({ user: null, token: null });
                useCartStore.getState().clearCart();
            },
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
import { useState, useEffect, useCallback } from 'react';
import {
    loginUser,
    logoutUser,
    listenAuthState
} from './backend/fire-base/controllers/auth.controller.ts'; // Ajusta la ruta si es necesario

// Tipado:
import type { User } from './backend/fire-base/interfaces.ts';

// Interfaces:
export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    isError: boolean;
    message: string | null;
}

// ---------------------------------------------

export function useAuth() {

    // -----------------
    // AUTH STATES
    // -----------------
    const [authState, setAuthState] = useState<AuthState>({
        user: null,
        isAuthenticated: false,
        isLoading: true,
        isError: false,
        message: null,
    });

    const [loginStatus, setLoginStatus] = useState<{
        isLoading: boolean;
        isError: boolean;
        message: string | null;
    }>({
        isLoading: false,
        isError: false,
        message: null,
    });

    const [logoutStatus, setLogoutStatus] = useState<{
        isLoading: boolean;
        isError: boolean;
        message: string | null;
    }>({
        isLoading: false,
        isError: false,
        message: null,
    });


    // -----------------
    // LOGIN
    // -----------------


    const handleLogin = async (email: string, pass: string) => {
        setLoginStatus({ isLoading: true, isError: false, message: null });
        try {
            const response = await loginUser(email, pass);
            if (response.success) {
                setLoginStatus({ isLoading: false, isError: false, message: response.message });
                setAuthState(prev => ({
                    ...prev,
                    user: response.data,
                    isAuthenticated: true,
                }));
                return true;
            } else {
                setLoginStatus({ isLoading: false, isError: true, message: response.message });
                return false;
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
            setLoginStatus({ isLoading: false, isError: true, message: errorMessage });
            return false;
        }
    };


    // -----------------
    // LOGOUT
    // -----------------


    const handleLogout = async () => {
        setLogoutStatus({ isLoading: true, isError: false, message: null });
        try {
            const response = await logoutUser();
            if (response.success) {
                setLogoutStatus({ isLoading: false, isError: false, message: response.message });
                setAuthState(prev => ({
                    ...prev,
                    user: null,
                    isAuthenticated: false,
                }));
                return true;
            } else {
                setLogoutStatus({ isLoading: false, isError: true, message: response.message });
                return false;
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
            setLogoutStatus({ isLoading: false, isError: true, message: errorMessage });
            return false;
        }
    };


    // -----------------
    // AUTH STATE LISTENER (EFFECT)
    // -----------------


    useEffect(() => {
        setAuthState(prev => ({ ...prev, isLoading: true }));

        const unsubscribe = listenAuthState((response) => {
            if (response.success) {
                setAuthState({
                    user: response.data,
                    isAuthenticated: true,
                    isLoading: false,
                    isError: false,
                    message: response.message,
                });
            } else {
                setAuthState({
                    user: null,
                    isAuthenticated: false,
                    isLoading: false,
                    isError: false, // O true según prefieras manejar cuando no hay sesión activa
                    message: response.message,
                });
            }
        });

        // Limpiar el observer al desmontar el componente
        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, []);


    return {
        authState,

        loginStatus,
        handleLogin,

        logoutStatus,
        handleLogout,
    };
}
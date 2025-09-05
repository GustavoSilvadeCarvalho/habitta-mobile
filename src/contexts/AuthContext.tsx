import React, { createContext, useState, ReactNode } from 'react';
import * as authService from '../data/services/authService';

interface User {
    id: string;
    name: string;
    email: string;
}

interface AuthContextData {
    user: User | null;
    isLoading: boolean;
    isTransitioning: boolean;
    login: (email, password) => Promise<void>;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);

    const login = async (email, password) => {
        setIsLoading(true);
        try {
            const userData = await authService.login(email, password);
            setUser(userData as User);

            // Inicia a transição com loading screen
            setIsTransitioning(true);

            // Simula um tempo de loading para mostrar a tela de loading
            setTimeout(() => {
                setIsTransitioning(false);
            }, 2000); // 2 segundos de loading

        } catch (error) {
            console.error(error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, isTransitioning, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
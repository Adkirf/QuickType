'use client';

import { auth } from "@/lib/firebase/config";
import { User } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { ensureUserProfile } from "@/lib/firebase/auth";
import { UserProfile } from "@/lib/projectTypes";

interface ContextType {
    user: User | null;
    userProfile: UserProfile | null;
    loading: boolean;
    setUser: (user: User | null) => void;
    setUserProfile: (userProfile: UserProfile | null) => void;
}

const AuthContext = createContext<ContextType>({
    user: null,
    userProfile: null,
    loading: true,
    setUser: () => { },
    setUserProfile: () => { },
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            setUser(user);
            if (user) {
                try {
                    const profile = await ensureUserProfile(user);
                    setUserProfile(profile);
                } catch (error) {
                    console.error("Error fetching user profile:", error);
                }
            } else {
                setUserProfile(null);
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const value = {
        user,
        userProfile,
        loading,
        setUser,
        setUserProfile,
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

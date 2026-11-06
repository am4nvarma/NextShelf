import React, {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";

type AuthContextType = {
    session : Session | null;
    user : User | null;
    isLoading : boolean;

    signUp : (
        email: string,
        password : string 
    ) => Promise<{ error: string | null}>;

    signIn: (
        email : string,
        password : string
    ) => Promise<{ error: string | null}>;

    signOut: () => Promise<{ error: string | null }>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [session, setSession] = useState<Session | null> (null);
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        let authEventRecieved = false;
        
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, currentSession) => {
            authEventRecieved = true;

            if (isMounted) {
                setSession(currentSession);
                setUser(currentSession?.user ?? null);
                setIsLoading(false);
            }
        });

     // To Check for an existing saved session
     supabase.auth.getSession().then(({ data, error}) => {
        if (!isMounted || authEventRecieved) return;

        if (error) {
            console.error("Session loading error", error);
        }

        setSession(data.session);
        setUser(data.session?.user ?? null);
        setIsLoading(false);
     }).catch((error) => {
        console.error("Unexpected session loading error", error)

        if(isMounted && !authEventRecieved) {
            setIsLoading(false);
        }
     });

     return () => {
        isMounted = false;
        subscription.unsubscribe();
     };
    }, []);

    // register new user 

    const signUp = async (email: string, password: string) => {
        try {
            const {error} = await supabase.auth.signUp({
                email: email.trim(),
                password,
            });

            if (error) {
                return {error: error.message};
            }

            return {error: null};
        } catch (error) {
            return {
                error:
                error instanceof Error
                ? error.message
                : "Something went wrong during signUp",
            };
        }
    };

    // Log in an existing user
    const signIn = async (email:string, password:string) => {
        try {
            const { error } = await supabase.auth.signInWithPassword({
               email :email.trim(),
               password,
            });

            if (error) {
                return {error : error.message};
            }

            return {error:null};
        } catch ( error ) {
            return {
                error:
                error instanceof Error
                ? error.message
                : "Something went wrong during login.",
            };
        }
    };

    // logOut the current user
    const signOut = async () => {
        try {
            const {error} = await supabase.auth.signOut();

            if (error) {
                return { error: error.message};
            }

            return {error : null};
        } catch (error) {
            return {
                error:
                error instanceof Error
                ? error.message
                : "Something went wrong during logout.",
            };
        }
    };

    return (
        <AuthContext.Provider
         value={{ 
            session, 
            user, 
            isLoading,
            signUp,
            signIn,
            signOut,
            }}
            >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used inside AuthProvider")
    }

    return context;
}

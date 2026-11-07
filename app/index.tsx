
import { useEffect } from "react";
import { Alert } from "react-native";

import DiscoveryScreen from "../screens/DiscoveryScreen";
import { testSupabaseConnection } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";
import { Redirect } from "expo-router";

export default function HomeScreen() {
  const { user, session, isLoading } = useAuth();

  useEffect(() => {
    console.log("AUTH DIAGNOSTIC MOUNTED");

    let isMounted = true;

    async function checkConnection() {
      try {
        await testSupabaseConnection();

        if (isMounted) {
          Alert.alert(
            "Supabase Connected!",
            "Your NextShelf app can communicate with Supabase."
          );
        }
      } catch (error) {
        console.error("Supabase connection test failed:", error);

        if (isMounted) {
          Alert.alert(
            "Supabase Connection Failed",
            error instanceof Error
              ? error.message
              : "Unexpected error."
          );
        }
      }
    }

    checkConnection();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    console.log("NEXTSHELF AUTH STATE:", {
      isLoggedIn: !!user,
      userId: user?.id ?? null,
      hasSession: !!session,
      isLoading,
    });
  }, [user, session, isLoading]);

  return <DiscoveryScreen />
}


import { useEffect } from "react";
import { Alert } from "react-native";

import DiscoveryScreen from "../screens/DiscoveryScreen";
import { testSupabaseConnection } from "../lib/supabase";

export default function HomeScreen() {
  useEffect(() => {
    let isMounted = true;

    async function checkConnection() {
      try {
        await testSupabaseConnection();

        if (isMounted) {
          Alert.alert(
            "Supabase Connected!",
            "Your NextShelf app can communicate with Supabase, and secure session storage is accessible."
          );
        }
      } catch (error) {
        console.error("Supabase connection test failed:", error);

        if (isMounted) {
          Alert.alert(
            "Supabase Connection Failed",
            error instanceof Error
              ? error.message
              : "An unexpected error occurred."
          );
        }
      }
    }

    checkConnection();

    return () => {
      isMounted = false;
    };
  }, []);

  return <DiscoveryScreen />;
}

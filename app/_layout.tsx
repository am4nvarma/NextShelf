import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { AuthProvider, useAuth } from "../contexts/AuthContext";

function RootNavigator() {
  const { session, isLoading } = useAuth();

  const router = useRouter();
  const segments = useSegments();

  const inAuthGroup = segments[0] === "(auth)";

  useEffect(() => {
    if (isLoading) return;

    if (!session && !inAuthGroup) {
      router.replace("/signup");
    } else if (session && inAuthGroup) {
      router.replace("/");
    }
  }, [session, isLoading, inAuthGroup, router]);

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: "#0b0000",
        },
        headerTintColor: "#40C4AA",
        headerTitleStyle: {
          color: "#FFFFFF",
          fontSize: 18,
          fontWeight: "600",
        },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      
      <Stack.Screen
        name="(auth)/signup"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen name="(auth)/login" options={{ headerShown: false }} />
      <Stack.Screen
        name="book/[id]"
        options={{
          title: "Book Details",
        }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}

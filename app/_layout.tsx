import { Stack } from "expo-router";
import { AuthProvider } from "../contexts/AuthContext";

export default function RootLayout() {
  return (
    <AuthProvider>
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

        <Stack.Screen
          name="book/[id]"
          options={{
            title: "Book Details",
          }}
        />
      </Stack>
    </AuthProvider>
  );
}

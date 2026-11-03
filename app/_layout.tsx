import { Stack } from "expo-router";

export default function RootLayout() {
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
          headerShown:false
        }}
      />

      <Stack.Screen
        name="book/[id]"
        options={{
          title: "Book Details",
        }}
      />
    </Stack>
  );
}
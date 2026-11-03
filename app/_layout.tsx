import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />

      <Stack initialRouteName="index">
        <Stack.Screen
          name="index"
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="book/[id]"
          options={{
            headerTransparent: false,
            headerShown: true,
            title: "Book Details",
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
        />
      </Stack>
    </>
  );
}
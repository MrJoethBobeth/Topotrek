import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      {/* This configures the main screen (index.tsx) to have no header */}
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}
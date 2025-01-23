import { Stack } from "expo-router";

const MessagesLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Messages" }} />
      <Stack.Screen name="[chatId]" options={{ title: "Chat" }} />
    </Stack>
  );
};

export default MessagesLayout;

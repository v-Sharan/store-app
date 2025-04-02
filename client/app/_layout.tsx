import { Stack } from "expo-router";
import "react-native-reanimated";

export { ErrorBoundary } from "expo-router";

const RootLayoutNav = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
};

export default RootLayoutNav;

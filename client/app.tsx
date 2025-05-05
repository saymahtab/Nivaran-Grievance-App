import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import SplashScreen from "./app/index";
import LoginScreen from "./app/(public)/login";
import SignupScreen from "./app/(public)/signup";
import HomeScreen from "./app/(auth)/home";
import useAuthStore from "./store/authStore";

const Stack = createNativeStackNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated, checkAuth } = useAuthStore();

  useEffect(() => {
    const initialize = async () => {
      await checkAuth();
      setIsLoading(false);
    };

    initialize();
  }, []);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <Stack.Screen name="Home" component={HomeScreen} />
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// babel.config.js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: ["expo-router/babel"],
  };
};

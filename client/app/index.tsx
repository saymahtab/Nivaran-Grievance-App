import { useEffect } from "react";
import { useRouter } from "expo-router";
import useAuthStore from "../store/authStore";
import { ROUTES } from "../utils/constants";
import Splash from "../components/screens/Splash";

const SplashScreen = () => {
  const router = useRouter();
  const { isAuthenticated, checkAuth } = useAuthStore();

  useEffect(() => {
    const checkAuthAndNavigate = async () => {
      await new Promise((resolve) => setTimeout(resolve, 4000));

      const isAuth = await checkAuth();

      // Navigate based on auth status
      // if (isAuth) {
      if (false) {
        router.replace(ROUTES.HOME);
      } else {
        router.replace(ROUTES.LOGIN);
      }
    };

    checkAuthAndNavigate();
  }, []);

  return <Splash />;
};

export default SplashScreen;

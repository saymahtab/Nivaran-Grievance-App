import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StatusBar,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Modal,
} from "react-native";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { translations } from "../../../utils/translations";
import { useRouter } from "expo-router";

export default function Login() {
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginMethod, setLoginMethod] = useState("otp"); // "otp" or "password"
  const [language, setLanguage] = useState("english"); // "english" or "hindi"
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);

  const router = useRouter();

  const handleNavigation = (screen: any) => {
    if (screen === "signup") {
      router.push("/signup");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleLoginMethod = (method) => {
    setLoginMethod(method);
    setShowPassword(false);
    setPassword("");
  };

  const toggleLanguageDropdown = () => {
    setShowLanguageDropdown(!showLanguageDropdown);
  };

  const changeLanguage = (selectedLanguage) => {
    setLanguage(selectedLanguage);
    setShowLanguageDropdown(false);
  };

  // Get translated text based on current language
  const t = translations[language];

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#ffffff"
        translucent
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <View className="flex-1 justify-between mt-4">
          {/* Header with logo and language selector */}
          <View className="flex-row justify-between items-center px-5 pt-2">
            {/* Logo */}
            <View>
              <Image
                source={require("../../../assets/images/nivaran-login-page.png")}
                className="w-32 h-32"
                resizeMode="contain"
              />
            </View>

            {/* Language Dropdown */}
            <View className="relative">
              <TouchableOpacity
                className="flex-row items-center px-4 py-1 border border-gray-200 rounded-full bg-white"
                onPress={toggleLanguageDropdown}
              >
                <Text className="mr-2 text-gray-700">
                  {language === "english" ? "English" : "हिंदी"}
                </Text>
                <Feather name="chevron-down" size={16} color="#6B7280" />
              </TouchableOpacity>

              {/* Language Dropdown Menu */}
              {showLanguageDropdown && (
                <View className="absolute right-0 top-11 bg-white border border-gray-200 rounded-lg z-10 shadow-md w-32">
                  <TouchableOpacity
                    className={`px-4 py-2 ${
                      language === "english" ? "bg-gray-100" : ""
                    }`}
                    onPress={() => changeLanguage("english")}
                  >
                    <Text>English</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className={`px-4 py-2 ${
                      language === "hindi" ? "bg-gray-100" : ""
                    }`}
                    onPress={() => changeLanguage("hindi")}
                  >
                    <Text>हिंदी</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>

          {/* Scrollable content */}
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
            className="px-6 pb-4"
          >
            <View className="flex-1">
              {/* Main Content */}
              <View className="mb-6 items-start">
                {/* Welcome text */}
                <Text className="text-lg font-semibold text-foreground mb-1">
                  {t.login}
                </Text>
                <Text className="text-sm text-gray-600 mb-6">{t.welcome}</Text>

                {/* Mobile input field */}
                <View className="mb-4 w-full">
                  <Text className="text-sm font-medium text-foreground mb-2.5">
                    {t.mobileNumber}
                  </Text>
                  <View className="flex-row items-center px-3 border border-accent rounded-2xl bg-white">
                    <TextInput
                      placeholder={t.mobileNumberPlaceholder}
                      keyboardType="phone-pad"
                      className="flex-1 py-4 placeholder:text-gray-400"
                      value={mobile}
                      onChangeText={setMobile}
                      maxLength={10}
                    />
                    <MaterialIcons
                      name="call"
                      size={18}
                      style={{ marginLeft: 8, color: "gray" }}
                    />
                  </View>
                </View>

                {/* Password input field - only shown when loginMethod is password */}
                {loginMethod === "password" && (
                  <View className="mb-4 w-full">
                    <Text className="text-sm font-medium text-foreground mb-2.5">
                      {t.password}
                    </Text>
                    <View className="flex-row items-center px-3 border border-accent rounded-2xl bg-white">
                      <TextInput
                        placeholder={t.passwordPlaceholder}
                        secureTextEntry={!showPassword}
                        className="flex-1 py-4 placeholder:text-gray-400"
                        value={password}
                        onChangeText={setPassword}
                      />
                      <TouchableOpacity onPress={togglePasswordVisibility}>
                        <Feather
                          name={showPassword ? "eye" : "eye-off"}
                          size={18}
                          style={{ marginLeft: 8, color: "gray" }}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                )}

                {/* Login button - text changes based on login method */}
                <TouchableOpacity className="bg-primary w-full rounded-2xl py-3.5 items-center mb-4 shadow-sm">
                  <Text className="text-white font-semibold text-base">
                    {loginMethod === "otp" ? t.sendOTP : t.loginButton}
                  </Text>
                </TouchableOpacity>

                {/* Divider */}
                <View className="flex-row items-center my-5 w-full">
                  <View className="flex-1 h-px bg-gray-200" />
                  <Text className="mx-3 text-gray-400 text-sm">{t.or}</Text>
                  <View className="flex-1 h-px bg-gray-200" />
                </View>

                {/* Toggle login method button */}
                <View className="space-y-3 w-full">
                  <TouchableOpacity
                    className="flex-row items-center mb-4 justify-center border border-primary py-4 rounded-2xl bg-white shadow-sm"
                    onPress={() =>
                      toggleLoginMethod(
                        loginMethod === "otp" ? "password" : "otp"
                      )
                    }
                  >
                    <Feather
                      name={loginMethod === "otp" ? "lock" : "message-circle"}
                      size={16}
                      color={"#1D76DB"}
                      style={{ marginRight: 8 }}
                    />
                    <Text className="font-medium text-primary">
                      {loginMethod === "otp"
                        ? t.loginWithPassword
                        : t.loginWithOTP}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="flex-row items-center mb-4 justify-center border border-primary py-4 rounded-2xl bg-white shadow-sm"
                    onPress={() => handleNavigation("activate")}
                  >
                    <Feather
                      name="user-plus"
                      size={16}
                      color={"#1D76DB"}
                      style={{ marginRight: 8 }}
                    />
                    <Text className="font-medium text-primary">
                      {t.activateAccount}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Create account */}
              <View className="flex-row justify-center items-center mt-2">
                <Text className="text-gray-600 text-sm">{t.newToNivaran} </Text>
                <TouchableOpacity onPress={() => handleNavigation("signup")}>
                  <Text className="text-secondary text-sm font-semibold">
                    {t.registerNow}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
          {/* Footer */}
          <View className="bg-background py-3 px-6 mt-4">
            <Text className="text-xs text-gray-500 text-center">
              {t.copyright}
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

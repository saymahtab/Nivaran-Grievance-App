import React, { useState, useEffect, useRef } from "react";
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
  Animated,
} from "react-native";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { translations } from "../../../utils/translations";
import { useRouter } from "expo-router";

export default function Signup() {
  const [step, setStep] = useState(1); // Current step (1, 2, or 3)
  const [language, setLanguage] = useState("english");
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [errors, setErrors] = useState({}); // Store validation errors
  const [attemptedNext, setAttemptedNext] = useState(false); // Track if user attempted to move to next step

  // Animation values
  const progressAnim1 = useRef(new Animated.Value(0)).current;
  const progressAnim2 = useRef(new Animated.Value(0)).current;

  // Error message animation values
  const errorAnimations = useRef({}).current;

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [gender, setGender] = useState("");
  const [showGenderDropdown, setShowGenderDropdown] = useState(false);

  const [address, setAddress] = useState("");
  const [country, setCountry] = useState("India");
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [pincode, setPincode] = useState("");
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [showStateDropdown, setShowStateDropdown] = useState(false);
  const [showDistrictDropdown, setShowDistrictDropdown] = useState(false);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Get translated text based on current language
  const t = translations[language];

  const router = useRouter();

  // Initialize error animations when errors object changes
  useEffect(() => {
    Object.keys(errors).forEach((key) => {
      if (!errorAnimations[key]) {
        errorAnimations[key] = new Animated.Value(0);
      }
      if (errors[key]) {
        Animated.timing(errorAnimations[key], {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      } else {
        Animated.timing(errorAnimations[key], {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }
    });
  }, [errors]);

  // Update progress animations when step changes
  useEffect(() => {
    // Handle first progress bar (between steps 1 and 2)
    if (step >= 2) {
      Animated.timing(progressAnim1, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(progressAnim1, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }

    // Handle second progress bar (between steps 2 and 3)
    if (step >= 3) {
      Animated.timing(progressAnim2, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(progressAnim2, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  }, [step]);

  // Validate form fields for each step
  const validateStep = (currentStep) => {
    const newErrors = {};
    let isValid = true;

    if (currentStep === 1) {
      if (!name.trim()) {
        newErrors.name = "Please enter name";
        isValid = false;
      }

      if (!email.trim()) {
        newErrors.email = "Please enter email";
        isValid = false;
      } else if (!/\S+@\S+\.\S+/.test(email)) {
        newErrors.email = "Please enter a valid email";
        isValid = false;
      }

      if (!mobile.trim()) {
        newErrors.mobile = "Please enter mobile number";
        isValid = false;
      } else if (!/^\d{10}$/.test(mobile)) {
        newErrors.mobile = "Please enter a valid 10-digit mobile number";
        isValid = false;
      }

      if (!gender) {
        newErrors.gender = "Please select gender";
        isValid = false;
      }
    } else if (currentStep === 2) {
      if (!address.trim()) {
        newErrors.address = "Please enter address";
        isValid = false;
      }

      if (!state) {
        newErrors.state = "Please select state";
        isValid = false;
      }

      if (!district) {
        newErrors.district = "Please select district";
        isValid = false;
      }

      if (pincode && !/^\d{6}$/.test(pincode)) {
        newErrors.pincode = "Please enter a valid 6-digit pincode";
        isValid = false;
      }
    } else if (currentStep === 3) {
      if (!password) {
        newErrors.password = "Please enter password";
        isValid = false;
      } else if (password.length < 8) {
        newErrors.password = "Password must be at least 8 characters";
        isValid = false;
      }

      if (!confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password";
        isValid = false;
      } else if (password !== confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleNavigation = (screen) => {
    router.back();
  };

  const toggleLanguageDropdown = () => {
    setShowLanguageDropdown(!showLanguageDropdown);
  };

  const toggleGenderDropdown = () => {
    setShowGenderDropdown(!showGenderDropdown);
  };

  const toggleCountryDropdown = () => {
    setShowCountryDropdown(!showCountryDropdown);
  };

  const toggleStateDropdown = () => {
    setShowStateDropdown(!showStateDropdown);
  };

  const toggleDistrictDropdown = () => {
    setShowDistrictDropdown(!showDistrictDropdown);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const changeLanguage = (selectedLanguage) => {
    setLanguage(selectedLanguage);
    setShowLanguageDropdown(false);
  };

  const nextStep = () => {
    setAttemptedNext(true);

    if (validateStep(step)) {
      if (step < 3) {
        setStep(step + 1);
        setAttemptedNext(false); // Reset for the next step
      } else {
        // Submit form
        console.log("Form submitted");
      }
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      handleNavigation("login");
    }
  };

  // Navigate directly to a specific step (only if previous steps are valid)
  const goToStep = (targetStep) => {
    // Can only go to steps we've already completed or the immediate next step
    if (targetStep <= step) {
      setStep(targetStep);
    } else if (targetStep === step + 1 && validateStep(step)) {
      setStep(targetStep);
      setAttemptedNext(false);
    }
  };

  // Function to render animated error messages
  const renderErrorMessage = (errorKey) => {
    if (!errors[errorKey]) return null;

    if (!errorAnimations[errorKey]) {
      errorAnimations[errorKey] = new Animated.Value(0);
      Animated.timing(errorAnimations[errorKey], {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }

    return (
      <Animated.Text
        style={{
          color: "#ef4444", // text-red-500
          marginLeft: 12,
          marginTop: 4,
          fontSize: 12,
          opacity: errorAnimations[errorKey],
          transform: [
            {
              translateY: errorAnimations[errorKey].interpolate({
                inputRange: [0, 1],
                outputRange: [-10, 0],
              }),
            },
          ],
        }}
      >
        {errors[errorKey]}
      </Animated.Text>
    );
  };

  const renderStepIndicator = () => {
    return (
      <View className="flex-row items-center justify-center mb-6">
        {/* Step 1 indicator */}
        <TouchableOpacity onPress={() => goToStep(1)} className="z-10">
          <View
            className={`h-8 w-8 rounded-full ${
              step >= 1 ? "bg-primary" : "border border-gray-300"
            } flex items-center justify-center`}
          >
            <Text
              className={`font-semibold ${
                step >= 1 ? "text-white" : "text-gray-400"
              }`}
            >
              1
            </Text>
          </View>
        </TouchableOpacity>

        {/* Progress line 1-2 */}
        <View
          style={{
            height: 2,
            width: 64,
            backgroundColor: "#e5e7eb", // gray-300
            position: "relative",
          }}
        >
          <Animated.View
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              height: 2,
              width: progressAnim1.interpolate({
                inputRange: [0, 1],
                outputRange: ["0%", "100%"],
              }),
              backgroundColor: "#1D76DB", // primary color
            }}
          />
        </View>

        {/* Step 2 indicator */}
        <TouchableOpacity onPress={() => goToStep(2)} className="z-10">
          <View
            className={`h-8 w-8 rounded-full ${
              step >= 2 ? "bg-primary" : "border border-gray-300"
            } flex items-center justify-center`}
          >
            <Text
              className={`font-semibold ${
                step >= 2 ? "text-white" : "text-gray-400"
              }`}
            >
              2
            </Text>
          </View>
        </TouchableOpacity>

        {/* Progress line 2-3 */}
        <View
          style={{
            height: 2,
            width: 64,
            backgroundColor: "#e5e7eb", // gray-300
            position: "relative",
          }}
        >
          <Animated.View
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              height: 2,
              width: progressAnim2.interpolate({
                inputRange: [0, 1],
                outputRange: ["0%", "100%"],
              }),
              backgroundColor: "#1D76DB", // primary color
            }}
          />
        </View>

        {/* Step 3 indicator */}
        <TouchableOpacity onPress={() => goToStep(3)} className="z-10">
          <View
            className={`h-8 w-8 rounded-full ${
              step >= 3 ? "bg-primary" : "border border-gray-300"
            } flex items-center justify-center`}
          >
            <Text
              className={`font-semibold ${
                step >= 3 ? "text-white" : "text-gray-400"
              }`}
            >
              3
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const renderStepTitle = () => {
    const titles = {
      1: {
        main: t.basicInfo || "Basic Info",
        sub: "Enter your personal details",
      },
      2: {
        main: t.address || "Address",
        sub: "Enter your residential details",
      },
      3: { main: t.password || "Password", sub: "Create a secure password" },
    };

    return (
      <View className="mb-6">
        <View className="flex-row items-center mb-1">
          <Text className="text-xl font-bold text-foreground">
            {t.signUp || "Sign UP"}
          </Text>
        </View>
        <Text className="text-sm text-gray-600">{titles[step].sub}</Text>
      </View>
    );
  };

  const renderStep1 = () => {
    return (
      <>
        {/* Name input */}
        <View className="mb-2 w-full">
          <Text className="text-sm font-medium text-foreground mb-2">
            {t.name || "Name"} <Text className="text-red-500">*</Text>
          </Text>
          <View
            className={`flex-row items-center px-3 border ${
              errors.name ? "border-red-500" : "border-accent"
            } rounded-2xl bg-white`}
          >
            <TextInput
              placeholder={t.namePlaceholder || "Enter your name"}
              className="flex-1 py-4 placeholder:text-gray-400"
              value={name}
              onChangeText={(text) => {
                setName(text);
                if (attemptedNext) {
                  validateStep(1);
                }
              }}
            />
            <Feather
              name="user"
              size={18}
              style={{ marginLeft: 8, color: "gray" }}
            />
          </View>
          {renderErrorMessage("name")}
        </View>

        {/* Email input */}
        <View className="mb-4 w-full">
          <Text className="text-sm font-medium text-foreground mb-2">
            {t.email || "Email"} <Text className="text-red-500">*</Text>
          </Text>
          <View
            className={`flex-row items-center px-3 border ${
              errors.email ? "border-red-500" : "border-accent"
            } rounded-2xl bg-white`}
          >
            <TextInput
              placeholder={t.emailPlaceholder || "Enter your email address"}
              keyboardType="email-address"
              className="flex-1 py-4 placeholder:text-gray-400"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (attemptedNext) {
                  validateStep(1);
                }
              }}
              autoCapitalize="none"
            />
            <MaterialIcons
              name="email"
              size={18}
              style={{ marginLeft: 8, color: "gray" }}
            />
          </View>
          {renderErrorMessage("email")}
        </View>

        {/* Mobile input */}
        <View className="mb-4 w-full">
          <Text className="text-sm font-medium text-foreground mb-2">
            {t.mobileNumber || "Mobile Number"}{" "}
            <Text className="text-red-500">*</Text>
          </Text>
          <View
            className={`flex-row items-center px-3 border ${
              errors.mobile ? "border-red-500" : "border-accent"
            } rounded-2xl bg-white`}
          >
            <TextInput
              placeholder={
                t.mobileNumberPlaceholder || "Enter your mobile number"
              }
              keyboardType="phone-pad"
              className="flex-1 py-4 placeholder:text-gray-400"
              value={mobile}
              onChangeText={(text) => {
                setMobile(text);
                if (attemptedNext) {
                  validateStep(1);
                }
              }}
              maxLength={10}
            />
            <MaterialIcons
              name="call"
              size={18}
              style={{ marginLeft: 8, color: "gray" }}
            />
          </View>
          {renderErrorMessage("mobile")}
        </View>

        {/* Gender dropdown */}
        <View className="mb-4 w-full">
          <Text className="text-sm font-medium text-foreground mb-2">
            {t.gender || "Gender"} <Text className="text-red-500">*</Text>
          </Text>
          <View className="relative">
            <TouchableOpacity
              className={`flex-row items-center justify-between px-3 py-4 border ${
                errors.gender ? "border-red-500" : "border-accent"
              } rounded-2xl bg-white`}
              onPress={toggleGenderDropdown}
            >
              <Text className={gender ? "text-black" : "text-gray-400"}>
                {gender || t.genderPlaceholder || "Select your gender"}
              </Text>
              <Feather name="chevron-down" size={18} color="gray" />
            </TouchableOpacity>

            {showGenderDropdown && (
              <View className="absolute left-0 right-0 top-14 bg-white border border-gray-200 rounded-lg z-10 shadow-md">
                {["Male", "Female", "Other"].map((item) => (
                  <TouchableOpacity
                    key={item}
                    className={`px-4 py-3 ${
                      gender === item ? "bg-gray-100" : ""
                    }`}
                    onPress={() => {
                      setGender(item);
                      setShowGenderDropdown(false);
                      if (attemptedNext) {
                        validateStep(1);
                      }
                    }}
                  >
                    <Text>{item}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
          {renderErrorMessage("gender")}
        </View>
      </>
    );
  };

  const renderStep2 = () => {
    return (
      <>
        {/* Address input */}
        <View className="mb-4 w-full">
          <Text className="text-sm font-medium text-foreground mb-2">
            {t.address || "Address"} <Text className="text-red-500">*</Text>
          </Text>
          <View
            className={`flex-row items-center px-3 border ${
              errors.address ? "border-red-500" : "border-accent"
            } rounded-2xl bg-white`}
          >
            <TextInput
              placeholder={t.addressPlaceholder || "Enter Address"}
              className="flex-1 py-4 placeholder:text-gray-400"
              value={address}
              onChangeText={(text) => {
                setAddress(text);
                if (attemptedNext) {
                  validateStep(2);
                }
              }}
              multiline
            />
            <Feather
              name="map-pin"
              size={18}
              style={{ marginLeft: 8, color: "gray" }}
            />
          </View>
          {renderErrorMessage("address")}
        </View>

        {/* Country dropdown */}
        <View className="mb-4 w-full">
          <Text className="text-sm font-medium text-foreground mb-2">
            {t.country || "Country"} <Text className="text-red-500">*</Text>
          </Text>
          <View className="relative">
            <TouchableOpacity
              className="flex-row items-center justify-between px-3 py-4 border border-accent rounded-2xl bg-white"
              onPress={toggleCountryDropdown}
            >
              <Text className="text-black">{country}</Text>
              <Feather name="chevron-down" size={18} color="gray" />
            </TouchableOpacity>

            {showCountryDropdown && (
              <View className="absolute left-0 right-0 top-14 bg-white border border-gray-200 rounded-lg z-10 shadow-md">
                <TouchableOpacity
                  className="px-4 py-3 bg-gray-100"
                  onPress={() => {
                    setCountry("India");
                    setShowCountryDropdown(false);
                  }}
                >
                  <Text>India</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        {/* State dropdown */}
        <View className="mb-4 w-full">
          <Text className="text-sm font-medium text-foreground mb-2">
            {t.state || "State"} <Text className="text-red-500">*</Text>
          </Text>
          <View className="relative">
            <TouchableOpacity
              className={`flex-row items-center justify-between px-3 py-4 border ${
                errors.state ? "border-red-500" : "border-accent"
              } rounded-2xl bg-white`}
              onPress={toggleStateDropdown}
            >
              <Text className={state ? "text-black" : "text-gray-400"}>
                {state || t.statePlaceholder || "Select State"}
              </Text>
              <Feather name="chevron-down" size={18} color="gray" />
            </TouchableOpacity>

            {showStateDropdown && (
              <View className="absolute left-0 right-0 top-14 bg-white border border-gray-200 rounded-lg z-10 shadow-md max-h-60">
                <ScrollView>
                  {[
                    "Delhi",
                    "Maharashtra",
                    "Karnataka",
                    "Tamil Nadu",
                    "Uttar Pradesh",
                  ].map((item) => (
                    <TouchableOpacity
                      key={item}
                      className={`px-4 py-3 ${
                        state === item ? "bg-gray-100" : ""
                      }`}
                      onPress={() => {
                        setState(item);
                        setShowStateDropdown(false);
                        if (attemptedNext) {
                          validateStep(2);
                        }
                      }}
                    >
                      <Text>{item}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>
          {renderErrorMessage("state")}
        </View>

        {/* District dropdown */}
        <View className="mb-4 w-full">
          <Text className="text-sm font-medium text-foreground mb-2">
            {t.district || "District"} <Text className="text-red-500">*</Text>
          </Text>
          <View className="relative">
            <TouchableOpacity
              className={`flex-row items-center justify-between px-3 py-4 border ${
                errors.district ? "border-red-500" : "border-accent"
              } rounded-2xl bg-white`}
              onPress={toggleDistrictDropdown}
            >
              <Text className={district ? "text-black" : "text-gray-400"}>
                {district || t.districtPlaceholder || "District"}
              </Text>
              <Feather name="chevron-down" size={18} color="gray" />
            </TouchableOpacity>

            {showDistrictDropdown && (
              <View className="absolute left-0 right-0 top-14 bg-white border border-gray-200 rounded-lg z-10 shadow-md">
                {["Central Delhi", "South Delhi", "North Delhi"].map((item) => (
                  <TouchableOpacity
                    key={item}
                    className={`px-4 py-3 ${
                      district === item ? "bg-gray-100" : ""
                    }`}
                    onPress={() => {
                      setDistrict(item);
                      setShowDistrictDropdown(false);
                      if (attemptedNext) {
                        validateStep(2);
                      }
                    }}
                  >
                    <Text>{item}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
          {renderErrorMessage("district")}
        </View>

        {/* Pincode input */}
        <View className="mb-4 w-full">
          <Text className="text-sm font-medium text-foreground mb-2">
            {t.pincode || "Pincode"}
          </Text>
          <View
            className={`flex-row items-center px-3 border ${
              errors.pincode ? "border-red-500" : "border-accent"
            } rounded-2xl bg-white`}
          >
            <TextInput
              placeholder={t.pincodePlaceholder || "Enter Pincode"}
              keyboardType="number-pad"
              className="flex-1 py-4 placeholder:text-gray-400"
              value={pincode}
              onChangeText={(text) => {
                setPincode(text);
                if (attemptedNext) {
                  validateStep(2);
                }
              }}
              maxLength={6}
            />
            <Feather
              name="map"
              size={18}
              style={{ marginLeft: 8, color: "gray" }}
            />
          </View>
          {renderErrorMessage("pincode")}
        </View>
      </>
    );
  };

  const renderStep3 = () => {
    return (
      <>
        {/* Password input */}
        <View className="mb-4 w-full">
          <Text className="text-sm font-medium text-foreground mb-2">
            {t.password || "Password"} <Text className="text-red-500">*</Text>
          </Text>
          <View
            className={`flex-row items-center px-3 border ${
              errors.password ? "border-red-500" : "border-accent"
            } rounded-2xl bg-white`}
          >
            <TextInput
              placeholder={t.passwordPlaceholder || "Password"}
              secureTextEntry={!showPassword}
              className="flex-1 py-4 placeholder:text-gray-400"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (attemptedNext) {
                  validateStep(3);
                }
              }}
            />
            <TouchableOpacity onPress={togglePasswordVisibility}>
              <Feather
                name={showPassword ? "eye" : "eye-off"}
                size={18}
                style={{
                  marginLeft: 8,
                  color: "gray",
                }}
              />
            </TouchableOpacity>
          </View>
          {renderErrorMessage("password")}
        </View>

        {/* Confirm Password input */}
        <View className="mb-4 w-full">
          <Text className="text-sm font-medium text-foreground mb-2">
            {t.confirmPassword || "Confirm Password"}{" "}
            <Text className="text-red-500">*</Text>
          </Text>
          <View
            className={`flex-row items-center px-3 border ${
              errors.confirmPassword ? "border-red-500" : "border-accent"
            } rounded-2xl bg-white`}
          >
            <TextInput
              placeholder={
                t.confirmPasswordPlaceholder || "Enter Confirm Password"
              }
              secureTextEntry={!showConfirmPassword}
              className="flex-1 py-4 placeholder:text-gray-400"
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                if (attemptedNext) {
                  validateStep(3);
                }
              }}
            />
            <TouchableOpacity onPress={toggleConfirmPasswordVisibility}>
              <Feather
                name={showConfirmPassword ? "eye" : "eye-off"}
                size={18}
                style={{
                  marginLeft: 8,
                  color: "gray",
                }}
              />
            </TouchableOpacity>
          </View>
          {renderErrorMessage("confirmPassword")}
        </View>

        {/* Password strength indicators could be added here */}
      </>
    );
  };

  const renderCurrentStep = () => {
    switch (step) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      default:
        return renderStep1();
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <View className="flex-1 justify-between mt-16">
          {/* Scrollable content */}
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
            className="px-6 pb-4"
          >
            {/* Step indicator */}
            {renderStepIndicator()}
            <View className="flex-1">
              {/* Main Content */}
              <View className="mb-6 items-start">
                {/* Title text */}
                {renderStepTitle()}

                {/* Card container with glass effect */}
                <View className="w-full">
                  {/* Form fields based on current step */}
                  {renderCurrentStep()}
                </View>
              </View>

              {/* Next Button */}
              <TouchableOpacity
                className="bg-primary flex-row items-center justify-center w-full rounded-2xl py-4 mt-4 shadow-sm"
                onPress={nextStep}
              >
                <Text className="text-white font-semibold text-base mr-2">
                  {step === 3 ? t.submit || "Submit" : t.next || "Next"}
                </Text>
                <Feather name="arrow-right" size={20} color="white" />
              </TouchableOpacity>

              {/* Login link */}
              {step === 1 && (
                <View className="flex-row justify-center items-center mt-4">
                  <Text className="text-gray-500 text-sm">
                    {t.alreadyHaveAccount || "Already have an account?"}{" "}
                  </Text>
                  <TouchableOpacity onPress={() => handleNavigation("login")}>
                    <Text className="text-secondary text-sm font-semibold">
                      {t.login || "Login"}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </ScrollView>
          {/* Footer */}
          <View className="bg-background py-3 px-6 mt-4">
            <Text className="text-xs text-gray-500 text-center">
              {t.copyright || "© 2025 Nivaran | Government of India"}
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

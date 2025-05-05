import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  StatusBar,
  Image,
  Platform,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Svg, {
  Path,
  Circle,
  G,
  Defs,
  LinearGradient as SvgGradient,
  Stop,
} from "react-native-svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import { useFonts } from "expo-font";

const { width, height } = Dimensions.get("window");
const PRIMARY = "#1D76DB";
const SECONDARY = "#228B22";
const ACCENT = "#FF9933";
const LIGHT_BG = "#F6F9FC";

const Splash = ({ navigation }) => {
  const [fontsLoaded] = useFonts({
    "GT-CANARY-MorebiRounded-Regular": require("../../assets/fonts/GT-CANARY-MorebiRounded-Regular.ttf"),
  });

  const insets = useSafeAreaInsets();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const slideUpAnim = useRef(new Animated.Value(50)).current;
  const radiusAnim = useRef(new Animated.Value(0)).current;
  const wavesOpacity = useRef(new Animated.Value(0)).current;
  const particlesOpacity = useRef(new Animated.Value(0)).current;
  const emblemOpacity = useRef(new Animated.Value(0)).current;
  const ashokChakraRotate = useRef(new Animated.Value(0)).current;

  // Particles animation references
  const particles = Array(8)
    .fill()
    .map(() => ({
      opacity: useRef(new Animated.Value(0)).current,
      translateY: useRef(new Animated.Value(0)).current,
      size: useRef(new Animated.Value(0)).current,
    }));

  // Wave animation - using translateX which is supported by native driver
  const wave1TranslateX = useRef(new Animated.Value(0)).current;
  const wave2TranslateX = useRef(new Animated.Value(0)).current;

  // Rotate animation for Ashoka Chakra
  const ashokChakraRotation = ashokChakraRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  useEffect(() => {
    // Main animation sequence
    Animated.sequence([
      // Logo animation
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(slideUpAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),

      // Background elements animation
      Animated.parallel([
        Animated.timing(wavesOpacity, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(particlesOpacity, {
          toValue: 0.8,
          duration: 1500,
          useNativeDriver: true,
        }),
      ]),

      // Footer animation
      Animated.timing(emblemOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Using radiusAnim with non-native driver since it's not used in transform
    Animated.timing(radiusAnim, {
      toValue: 1,
      duration: 1200,
      useNativeDriver: false,
    }).start();

    // Continuous wave animation - using translateX which works with native driver
    Animated.loop(
      Animated.sequence([
        Animated.timing(wave1TranslateX, {
          toValue: width * 0.2,
          duration: 7000,
          useNativeDriver: true,
        }),
        Animated.timing(wave1TranslateX, {
          toValue: -width * 0.2,
          duration: 7000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(wave2TranslateX, {
          toValue: -width * 0.2,
          duration: 10000,
          useNativeDriver: true,
        }),
        Animated.timing(wave2TranslateX, {
          toValue: width * 0.2,
          duration: 10000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Particles animations using translateY
    particles.forEach((particle, index) => {
      const delay = index * 200;

      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(particle.opacity, {
            toValue: 0.7,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(particle.size, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]),
        Animated.loop(
          Animated.sequence([
            Animated.timing(particle.translateY, {
              toValue: -100 - index * 10,
              duration: 3000 + index * 500,
              useNativeDriver: true,
            }),
            Animated.timing(particle.translateY, {
              toValue: 0,
              duration: 3000 + index * 500,
              useNativeDriver: true,
            }),
          ])
        ),
      ]).start();
    });

    const timer = setTimeout(() => {
      if (navigation) navigation.replace("Home");
    }, 5500);

    return () => clearTimeout(timer);
  }, []);

  const backgroundRadius = radiusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, width * 1.5],
  });

  // Render floating particles
  const renderParticles = () => {
    return particles.map((particle, index) => {
      // Calculate random positions for particles
      const startX = ((index % 4) * width) / 4 + Math.random() * 50 - 25;
      const startY =
        (Math.floor(index / 4) * height) / 4 + Math.random() * 50 + 150;

      const scale = particle.size.interpolate({
        inputRange: [0, 1],
        outputRange: [0.3, 0.8 + (index % 3) * 0.3],
      });

      return (
        <Animated.View
          key={index}
          style={[
            styles.particle,
            {
              left: startX,
              // Using fixed positioning instead of animated top
              top: startY,
              opacity: particle.opacity,
              transform: [
                { translateY: particle.translateY },
                { scale: scale },
              ],
              backgroundColor:
                index % 3 === 0
                  ? PRIMARY
                  : index % 3 === 1
                  ? SECONDARY
                  : ACCENT,
            },
          ]}
        />
      );
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />

      {/* Background */}
      <LinearGradient
        colors={[LIGHT_BG, "#FFFFFF"]}
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* Animated waves background */}
      <Animated.View style={[styles.wavesContainer, { opacity: wavesOpacity }]}>
        <Animated.View
          style={[
            styles.wave,
            {
              top: 0,
              transform: [{ translateX: wave1TranslateX }, { scaleX: 1.5 }],
              backgroundColor: `${PRIMARY}10`,
            },
          ]}
        />
        <Animated.View
          style={[
            styles.wave,
            {
              top: 70,
              transform: [{ translateX: wave2TranslateX }, { scaleX: 1.5 }],
              backgroundColor: `${SECONDARY}10`,
            },
          ]}
        />
      </Animated.View>

      {/* Circular gradient background */}
      <Animated.View
        style={[
          styles.circleBackground,
          {
            width: backgroundRadius,
            height: backgroundRadius,
            borderRadius: backgroundRadius,
            // Static transform values with non-animated properties
            transform: [
              { translateX: -width / 2 },
              { translateY: -height / 3 },
            ],
          },
        ]}
      >
        <LinearGradient
          colors={[`${PRIMARY}10`, `${SECONDARY}05`]}
          style={styles.circleGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
      </Animated.View>

      {/* Floating particles */}
      <Animated.View
        style={[styles.particlesContainer, { opacity: particlesOpacity }]}
      >
        {renderParticles()}
      </Animated.View>

      {/* App Logo */}
      <View style={styles.logoWrapper}>
        {Platform.OS === "ios" ? (
          <BlurView intensity={40} style={styles.logoBlur} tint="light">
            <Image
              source={require("../../assets/images/nivaran-app-logo.jpg")}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </BlurView>
        ) : (
          <View style={styles.logoAndroid}>
            <Image
              source={require("../../assets/images/nivaran-app-logo.jpg")}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>
        )}
      </View>

      {/* App Name - FIXED FONT USAGE */}
      <Text style={[styles.appName, { includeFontPadding: false }]}>
        Nivaran
      </Text>

      {/* Tagline - FIXED FONT USAGE */}
      <Text style={[styles.tagline, { includeFontPadding: false }]}>
        YOUR VOICE, A BETTER INDIA
      </Text>

      {/* City Buildings Silhouette with gradients */}
      <View style={styles.buildingsContainer}>
        <LinearGradient
          colors={[`${PRIMARY}00`, `${PRIMARY}25`]}
          style={styles.buildingGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        >
          <Svg height="180" width={width} viewBox={`0 0 ${width} 180`}>
            <Defs>
              <SvgGradient id="buildingGrad1" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor={PRIMARY} stopOpacity="0.2" />
                <Stop offset="1" stopColor={PRIMARY} stopOpacity="0.4" />
              </SvgGradient>
              <SvgGradient id="buildingGrad2" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor={SECONDARY} stopOpacity="0.2" />
                <Stop offset="1" stopColor={SECONDARY} stopOpacity="0.4" />
              </SvgGradient>
            </Defs>

            {/* Modern city skyline */}
            <Path
              d="M0,180 L0,100 L30,100 L30,60 L60,60 L60,80 L90,80 L90,40 L110,40 L110,90 L140,90 L140,110 L170,110 L170,50 L190,50 L190,70 L210,70 L210,30 L240,30 L240,85 L270,85 L270,65 L300,65 L300,80 L320,80 L320,60 L350,60 L350,100 L380,100 L380,70 L400,70 L420,40 L450,40 L450,90 L480,90 L480,60 L500,60 L500,120 L530,120 L530,60 L560,60 L560,90 L600,90 L600,180 Z"
              fill="url(#buildingGrad1)"
            />

            {/* Windows and details */}
            <Path
              d="M40,100 L50,100 L50,110 L40,110 Z M40,120 L50,120 L50,130 L40,130 Z M40,140 L50,140 L50,150 L40,150 Z M70,80 L80,80 L80,90 L70,90 Z M70,100 L80,100 L80,110 L70,110 Z M70,120 L80,120 L80,130 L70,130 Z M100,40 L105,40 L105,50 L100,50 Z M120,90 L130,90 L130,100 L120,100 Z M120,110 L130,110 L130,120 L120,120 Z M180,50 L185,50 L185,60 L180,60 Z M180,70 L185,70 L185,80 L180,80 Z M220,30 L225,30 L225,40 L220,40 Z M220,50 L225,50 L225,60 L220,60 Z M250,85 L260,85 L260,95 L250,95 Z M280,65 L290,65 L290,75 L280,75 Z M330,60 L340,60 L340,70 L330,70 Z M330,80 L340,80 L340,90 L330,90 Z M390,70 L395,70 L395,80 L390,80 Z M430,40 L440,40 L440,50 L430,50 Z M460,90 L470,90 L470,100 L460,100 Z M510,120 L520,120 L520,130 L510,130 Z M540,60 L550,60 L550,70 L540,70 Z"
              fill="#FFFFFF"
              opacity="0.6"
            />
          </Svg>
        </LinearGradient>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  background: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  wavesContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: height,
    overflow: "hidden",
  },
  wave: {
    position: "absolute",
    left: -width * 0.5,
    width: width * 2,
    height: 400,
    borderRadius: 200,
  },
  circleBackground: {
    position: "absolute",
    top: 0,
    left: width / 2,
    overflow: "hidden",
  },
  circleGradient: {
    width: "100%",
    height: "100%",
    borderRadius: width * 1.5,
  },
  particlesContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  particle: {
    position: "absolute",
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 80,
    zIndex: 2,
  },
  logoWrapper: {
    width: 120,
    height: 120,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 28,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 10,
  },
  logoBlur: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 28,
  },
  logoAndroid: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 28,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    overflow: "hidden",
  },
  logoImage: {
    width: 80,
    height: 80,
    borderRadius: 20,
  },
  appName: {
    fontSize: 40,
    color: PRIMARY,
    marginTop: 24,
    letterSpacing: 2,
    fontFamily: 'GT-CANARY-MorebiRounded-Regular', // Ensure exact match
    fontWeight: 'normal', // Remove 'bold' as it may conflict with custom font
    textAlignVertical: 'center' // Android-specific fix
  },
  tagline: {
    fontSize: 14,
    color: SECONDARY,
    marginTop: 12,
    letterSpacing: 3,
    fontFamily: 'GT-CANARY-MorebiRounded-Regular', // Added font family
    textAlign: "center",
    textAlignVertical: 'center' // Android-specific fix
  },
  descriptionContainer: {
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  descriptionText: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    fontWeight: "500",
  },
  buildingsContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 180,
    zIndex: 1,
  },
  buildingGradient: {
    flex: 1,
  },
  footerContainer: {
    position: "absolute",
    bottom: 0,
    alignItems: "center",
    width: width,
    paddingHorizontal: 20,
    zIndex: 10,
  },
  footerCard: {
    width: "90%",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  footerBlur: {
    padding: 16,
    borderRadius: 16,
  },
  footerAndroid: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
  },
  footerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  emblemContainer: {
    alignItems: "center",
    flex: 1,
  },
  emblem: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: PRIMARY,
    alignItems: "center",
    justifyContent: "center",
  },
  ashokChakra: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  chakraSpoke: {
    position: "absolute",
    width: 2,
    height: 12,
    backgroundColor: PRIMARY,
    top: 0,
    left: "50%",
    marginLeft: -1,
    transformOrigin: "bottom",
  },
  govtText: {
    fontSize: 14,
    color: SECONDARY,
    marginTop: 6,
    fontWeight: "600",
    textAlign: "center",
  },
  digitalIndiaContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    justifyContent: "flex-end",
  },
  tricolorFlag: {
    width: 24,
    height: 16,
    borderRadius: 2,
    overflow: "hidden",
    marginRight: 8,
  },
  orangeStripe: {
    flex: 1,
    backgroundColor: "#FF9933",
  },
  whiteStripe: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  flagChakra: {
    width: 8,
    height: 8,
    position: "relative",
  },
  flagChakraSpoke: {
    position: "absolute",
    width: 1,
    height: 4,
    backgroundColor: "#000080",
    top: 0,
    left: "50%",
    marginLeft: -0.5,
    transformOrigin: "bottom",
  },
  greenStripe: {
    flex: 1,
    backgroundColor: "#138808",
  },
  digitalTextContainer: {
    alignItems: "flex-start",
  },
  digitalIndiaText: {
    fontSize: 14,
    color: PRIMARY,
    fontWeight: "600",
  },
  empowerText: {
    fontSize: 10,
    color: "#666",
  },
});

export default Splash;

import React, { useEffect, useState } from 'react';
import { View, Text, Dimensions } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Path, Circle } from 'react-native-svg';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing } from 'react-native-reanimated';
import {
   
  useNavigation,
} from '@react-navigation/native';
import { checkAuth } from '../lib/utils';
import { getItem } from '../asyncStorage';
const SplashScreen = () => {
  const isDarkMode = true;
  const { width } = Dimensions.get('window');
  const logoSize = Math.min(width * 0.8, 240);

  // Example: Pulse animation
  const scale = useSharedValue(1);
  useEffect(() => {
    scale.value = withRepeat(
      withTiming(1.1, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const navigation :any = useNavigation();

  // Progress bar logic
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    let frame: any;
    let start: number | null = null;
    const duration = 2500;
    const animate = (timestamp: number) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const percent = Math.min(100, (elapsed / duration) * 100);
      setProgress(percent);
      if (percent < 100) {
        frame = requestAnimationFrame(animate);
      }
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const doAuthCheck = async () => {
      // Wait for splash animation duration
      await new Promise(res => setTimeout(res, 2500));
      
      // Check if OTP is required
      const otpRequired = await getItem<boolean>('otp_required');
      const loginEmail = await getItem<string>('login_email');
      
      if (otpRequired && loginEmail) {
        // Navigate to OTP screen if OTP is required
        navigation.replace('OTP', { email: loginEmail, name: loginEmail.split('@')[0] });
      } else {
        // Check regular authentication
        const isAuth = await checkAuth();
        if (isAuth) {
          navigation.replace('Main');
        } else {
          navigation.replace('Login');
        }
      }
    };
    doAuthCheck();
  }, []);

  return (
    <View className="flex-1 bg-gray-900 justify-center items-center">
      <View className="items-center">
        <Animated.View style={animatedStyle}>
          <Svg width={logoSize} height={logoSize} viewBox="0 0 50 50">
            <Defs>
              <LinearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <Stop offset="0%" stopColor="#FFD600" />
                <Stop offset="100%" stopColor="#FFD600" />
              </LinearGradient>
            </Defs>
            {/* S shape */}
            <Path
              d="M15 20C15 15 20 15 25 15C30 15 35 15 35 20C35 30 15 25 15 35C15 40 20 40 25 40C30 40 35 40 35 35"
              stroke="url(#logoGradient)"
              strokeWidth={4}
              strokeLinecap="round"
              fill="none"
            />
            {/* Q Circle */}
            <Circle
              cx="25"
              cy="25"
              r="20"
              stroke="url(#logoGradient)"
              strokeWidth={4}
              fill="none"
            />
            {/* A shape */}
            <Path
              d="M20 35L25 15L30 35M22 28H28"
              stroke="url(#logoGradient)"
              strokeWidth={4}
              strokeLinecap="round"
              fill="none"
            />
          </Svg>
        </Animated.View>
        <Text
          className="text-3xl font-bold mt-6 text-yellow-400"
        >
          SQA
        </Text>
        {/* Progress Bar */}
        <View className="w-64 max-w-full mt-10">
          <Text className="text-center text-gray-400 mb-1">{Math.round(progress)}%</Text>
          <View className="h-3 bg-gray-800 rounded-full overflow-hidden">
            <View
              className="h-3 bg-yellow-400 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

export default SplashScreen;

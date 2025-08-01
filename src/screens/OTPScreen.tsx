import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, StatusBar, ToastAndroid, Alert } from 'react-native';
import { ArrowLeft, CheckCircle, AlertCircle, Loader } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import OTPInput from '../components/OTPInput';
import { API_CALL } from '../lib/api';
import { setItem, removeItem, getItem } from '../asyncStorage';
import ErrorScreen from '../components/ErrorScreen';

interface OTPScreenProps {
  navigation: any;
  route: {
    params: {
      email: string;
      name: string;
    };
  };
}

export default function OTPScreen({ navigation, route }: OTPScreenProps) {
  const { email, name } = route.params;
  const [otpCode, setOtpCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const showToast = (message: string) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      Alert.alert(message);
    }
  };

  const showErrorScreen = (message: string) => {
    setErrorMessage(message);
    setShowError(true);
  };

  useEffect(() => {
    // Start resend timer
    const timer = setInterval(() => {
      setResendTimer(prev => prev > 0 ? prev - 1 : 0);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleOtpVerification = async () => {
    if (otpCode.length !== 6) {
      showErrorScreen('Please enter the complete 6-digit code');
      return;
    }

    setIsLoading(true);
   const token = await getItem('token')
    try {
      const { response ,  status } = await API_CALL({
        apiVersionUrl: 'barong',
        url: '/api/mobile/verify-otp',
        method: 'POST',
        body: {
          token,
          otp: otpCode,
        }
      });
     console.log(response)

       if(response && status === 200){
        showToast(response.message.success);
         // Clear OTP flags
         await removeItem('otp_required');
         await removeItem('login_email');
         return navigation.replace('Main');
       }
 
    } catch (error: any) {
      showErrorScreen(error.message || 'Verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    
    try {

      const token = await getItem('token');

      await API_CALL({
        apiVersionUrl: 'barong',
        url: '/api/mobile/resend-otp',
        method: 'POST',
        body: {
          token
        }
      });
      
      setOtpCode('');
      setResendTimer(60); // 60 seconds cooldown
      showToast('OTP code resent successfully!');
    } catch (error: any) {
      showToast(error.message || 'Failed to resend OTP. Please try again.');
    }
  };

  if (showError) {
    return (
      <ErrorScreen
        title="OTP Verification Failed"
        message={errorMessage}
        buttonText="Try Again"
        buttonColor="red"
        onButtonPress={() => setShowError(false)}
      />
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <StatusBar barStyle="light-content" backgroundColor="#111827" translucent={false} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        {/* Header */}
        <View className="flex-row items-center px-6 py-4">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="p-2 -ml-2"
            activeOpacity={0.7}
          >
            <ArrowLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text className="text-white text-lg font-bold ml-4">Email Verification</Text>
        </View>

        {/* Main Content */}
        <View className="flex-1 px-6 justify-center">
          {/* Icon and Title */}
          <View className="items-center mb-8">
            <View className="w-20 h-20 bg-yellow-500/20 rounded-full items-center justify-center mb-4">
              <Text className="text-yellow-400 text-3xl">📱</Text>
            </View>
            <Text className="text-white text-2xl font-bold mb-2 text-center">
              Verify Your Email
            </Text>
            <Text className="text-gray-400 text-center text-base">
              We've sent a 6-digit verification code to
            </Text>
            <Text className="text-yellow-400 font-semibold text-base mt-1">
              {email}
            </Text>
          </View>

          {/* OTP Input */}
          <View className="mb-8">
            <Text className="text-gray-400 text-sm mb-4 font-semibold text-center">
              Enter the verification code
            </Text>
            <OTPInput
              value={otpCode}
              onChange={setOtpCode}
              autoFocus={true}
            />
          </View>

          {/* Verify Button */}
          <TouchableOpacity
            className={`rounded-xl py-4 items-center mb-6 ${isLoading ? 'bg-gray-600' : 'bg-yellow-400'}`}
            onPress={handleOtpVerification}
            activeOpacity={0.8}
            disabled={isLoading || otpCode.length !== 6}
          >
            <Text className={`font-bold text-lg ${isLoading ? 'text-gray-400' : 'text-gray-900'}`}>
              {isLoading ? 'Verifying...' : 'Verify Email'}
            </Text>
          </TouchableOpacity>

          {/* Resend OTP */}
          <View className="items-center">
            <Text className="text-gray-400 text-sm mb-2">
              Didn't receive the code?
            </Text>
            <TouchableOpacity
              className="items-center py-2"
              onPress={handleResendOtp}
              disabled={isLoading || resendTimer > 0}
            >
              <Text className={`font-semibold ${resendTimer > 0 ? 'text-gray-500' : 'text-yellow-400'}`}>
                {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend Code'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Back to Sign Up */}
          <View className="items-center mt-8">
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
              disabled={isLoading}
            >
              <Text className="text-gray-400 text-base">
                ← Back to Sign Up
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
} 
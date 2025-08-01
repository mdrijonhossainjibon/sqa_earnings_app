import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, StatusBar } from 'react-native';
import { ArrowLeft, CheckCircle, AlertCircle, Loader } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ActionSheet, { ActionSheetRef, SheetManager } from 'react-native-actions-sheet';

interface ErrorPayload {
  title: string;
  message: string;
}

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorData, setErrorData] = useState<ErrorPayload>({ title: '', message: '' });

  const handleSendReset = async () => {
    if (!email) {
      setErrorData({
        title: 'Validation Error',
        message: 'Please enter your email address'
      });
      SheetManager.show('forgotPasswordError');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorData({
        title: 'Invalid Email',
        message: 'Please enter a valid email address'
      });
      SheetManager.show('forgotPasswordError');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      
      // Simulate success (you can change this to test error)
      const isSuccess = Math.random() > 0.2; // 80% success rate for demo
      
      if (isSuccess) {
        SheetManager.show('forgotPasswordSuccess');
      } else {
        setErrorData({
          title: 'Reset Failed',
          message: 'Unable to send reset link. Please check your email and try again.'
        });
        SheetManager.show('forgotPasswordError');
      }
    }, 2000);
  };

  const ForgotPasswordLoadingSheet = () => {
    return (
      <View className="bg-gray-900 rounded-t-2xl p-6 items-center">
        <View className="w-16 h-16 bg-yellow-500/20 rounded-full items-center justify-center mb-4">
          <Loader size={32} color="#FFD600" className="animate-spin" />
        </View>
        <Text className="text-white text-lg font-bold mb-2 text-center">Sending Reset Link...</Text>
        <Text className="text-gray-400 text-center">Please wait while we process your request</Text>
      </View>
    );
  };

  const ForgotPasswordSuccessSheet = () => {
    return (
      <View className="bg-gray-900 rounded-t-2xl p-6 items-center">
        <View className="w-16 h-16 bg-green-500/20 rounded-full items-center justify-center mb-4">
          <CheckCircle size={32} color="#10B981" />
        </View>
        <Text className="text-white text-lg font-bold mb-2 text-center">Reset Link Sent!</Text>
        <Text className="text-gray-400 text-center mb-6">Check your email for password reset instructions</Text>
        
        <TouchableOpacity 
          className="bg-yellow-400 px-8 py-3 rounded-xl w-full"
          onPress={() => {
            SheetManager.hide('forgotPasswordSuccess');
            navigation.goBack();
          }}
        >
          <Text className="text-gray-900 font-bold text-center">Back to Login</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const ForgotPasswordErrorSheet = () => {
    return (
      <View className="bg-gray-900 rounded-t-2xl p-6 items-center">
        <View className="w-16 h-16 bg-red-500/20 rounded-full items-center justify-center mb-4">
          <AlertCircle size={32} color="#EF4444" />
        </View>
        <Text className="text-white text-lg font-bold mb-2 text-center">{errorData.title}</Text>
        <Text className="text-gray-400 text-center mb-6">{errorData.message}</Text>
        
        <TouchableOpacity 
          className="bg-gray-700 px-8 py-3 rounded-xl w-full"
          onPress={() => SheetManager.hide('forgotPasswordError')}
        >
          <Text className="text-white font-bold text-center">Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <StatusBar barStyle="light-content" backgroundColor="#111827" translucent={false} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView 
          className="flex-1" 
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View className="px-6">
           

            {/* Welcome Text */}
            <View className="items-center mb-8">
              <Text className="text-white text-2xl font-bold mb-2 text-center">
                Reset Your Password
              </Text>
              <Text className="text-gray-400 text-center">
                Enter your email address and we'll send you a link to reset your password
              </Text>
            </View>

            {/* Email Input */}
            <View className="mb-6">
              <Text className="text-gray-400 text-sm mb-2 font-semibold">Email Address</Text>
              <View className="bg-gray-800 rounded-xl p-4">
                <TextInput
                  className="text-white text-base"
                  placeholder="Enter your email"
                  placeholderTextColor="#6B7280"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  value={email}
                  onChangeText={setEmail}
                  editable={!isLoading}
                />
              </View>
            </View>

            {/* Send Reset Button */}
            <TouchableOpacity
              className={`rounded-xl py-4 items-center mb-6 ${isLoading ? 'bg-gray-600' : 'bg-yellow-400'}`}
              onPress={handleSendReset}
              activeOpacity={0.8}
              disabled={isLoading}
            >
              <Text className={`font-bold text-lg ${isLoading ? 'text-gray-400' : 'text-gray-900'}`}>
                {isLoading ? 'Sending...' : 'Send Reset Link'}
              </Text>
            </TouchableOpacity>

            {/* Back to Login */}
            <View className="flex-row justify-center items-center mb-6">
              <Text className="text-gray-400 text-base">Remember your password? </Text>
              <TouchableOpacity 
                onPress={() => navigation.goBack()} 
                activeOpacity={0.7} 
                disabled={isLoading}
              >
                <Text className="text-yellow-400 font-bold text-base">Sign In</Text>
              </TouchableOpacity>
            </View>

            {/* Info Section */}
            <View className="bg-gray-800 rounded-xl p-4">
              <Text className="text-gray-400 text-sm mb-2 font-semibold">Important:</Text>
              <Text className="text-gray-400 text-xs mb-1">• Check your spam folder if you don't receive the email</Text>
              <Text className="text-gray-400 text-xs mb-1">• The reset link expires in 24 hours</Text>
              <Text className="text-gray-400 text-xs">• Contact support if you need additional help</Text>
            </View>
          </View>

          {/* Spacer for bottom nav */}
          <View className="h-16" />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* ActionSheets */}
      <ActionSheet id="forgotPasswordLoading">
        <ForgotPasswordLoadingSheet />
      </ActionSheet>

      <ActionSheet id="forgotPasswordSuccess">
        <ForgotPasswordSuccessSheet />
      </ActionSheet>

      <ActionSheet id="forgotPasswordError">
        <ForgotPasswordErrorSheet />
      </ActionSheet>
    </SafeAreaView>
  );
} 
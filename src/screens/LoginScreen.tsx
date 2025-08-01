import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, StatusBar, ToastAndroid, Alert, Linking } from 'react-native';
import { ArrowLeft, Eye, EyeOff, CheckCircle, AlertCircle, Loader, ExternalLink } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { setItem } from '../asyncStorage';
import { API_CALL } from '../lib/api';
import ErrorScreen from '../components/ErrorScreen';

interface ErrorPayload {
  title: string;
  message: string;
}

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorData, setErrorData] = useState<ErrorPayload>({ title: '', message: '' });
  const [showError, setShowError] = useState(false);

  const showToast = (message: string) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      Alert.alert(message);
    }
  };

  const showErrorScreen = (title: string, message: string) => {
    setErrorData({ title, message });
    setShowError(true);
  };

  // Handle opening external signup URL
  const handleSignUpPress = async () => {
    const signupUrl = 'https://sqa-earnings.vercel.app/s/Ucasff';
    
    try {
      const supported = await Linking.canOpenURL(signupUrl);
      
      if (supported) {
        await Linking.openURL(signupUrl);
        showToast('Opening signup page...');
      } else {
        showToast('Unable to open signup page');
      }
    } catch (error) {
      console.log('Error opening signup URL:', error);
      showToast('Failed to open signup page');
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      showErrorScreen('Validation Error', 'Please enter both email and password');
      return;
    }

    setIsLoading(true);

    try {
      const { response } = await API_CALL({ 
        apiVersionUrl: 'barong', 
        url: '/api/auth/login', 
        method: 'POST', 
        body: {
          email,
          password,
        }
      });

      if (response && (response as any).token) {
        await setItem('token', (response as any).token);
        showToast('Login Successful! Welcome back!');
        await setItem('otp_required', true);
        await setItem('login_email', email);
        navigation.navigate('OTP', { email, name: email.split('@')[0] });
      }   else {
        console.log(response)
        showErrorScreen('Login Failed', (response as any)?.message?.error || 'Invalid response from server');
      }
    } catch (error: any) {
      showErrorScreen('Login Failed', error.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (showError) {
    return (
      <ErrorScreen
        title={errorData.title}
        message={errorData.message}
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
                Welcome Back
              </Text>
              <Text className="text-gray-400 text-center">
                Sign in to continue earning rewards
              </Text>
            </View>

            {/* Email Input */}
            <View className="mb-4">
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

            {/* Password Input */}
            <View className="mb-6">
              <Text className="text-gray-400 text-sm mb-2 font-semibold">Password</Text>
              <View className="bg-gray-800 rounded-xl p-4 flex-row items-center">
                <TextInput
                  className="flex-1 text-white text-base"
                  placeholder="Enter your password"
                  placeholderTextColor="#6B7280"
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  value={password}
                  onChangeText={setPassword}
                  editable={!isLoading}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} disabled={isLoading}>
                  {showPassword ? (
                    <EyeOff size={20} color="#6B7280" />
                  ) : (
                    <Eye size={20} color="#6B7280" />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* Login Button */}
            <TouchableOpacity
              className={`rounded-xl py-4 items-center mb-4 ${isLoading ? 'bg-gray-600' : 'bg-yellow-400'}`}
              onPress={handleLogin}
              activeOpacity={0.8}
              disabled={isLoading}
            >
              <Text className={`font-bold text-lg ${isLoading ? 'text-gray-400' : 'text-gray-900'}`}>
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Text>
            </TouchableOpacity>

            {/* Forgot Password */}
            <TouchableOpacity 
              onPress={() => navigation.navigate('ForgotPassword')} 
              className="items-center mb-6"
              activeOpacity={0.7}
              disabled={isLoading}
            >
              <Text className="text-yellow-400 font-semibold">Forgot Password?</Text>
            </TouchableOpacity>

            {/* Divider */}
            <View className="flex-row items-center mb-6">
              <View className="flex-1 h-px bg-gray-700" />
              <Text className="text-gray-400 px-4">or</Text>
              <View className="flex-1 h-px bg-gray-700" />
            </View>

            {/* Sign Up Link */}
            <View className="flex-row justify-center items-center mb-6">
              <Text className="text-gray-400 text-base">Don't have an account? </Text>
              <TouchableOpacity 
                onPress={handleSignUpPress} 
                activeOpacity={0.7} 
                disabled={isLoading}
                className="flex-row items-center"
              >
                <Text className="text-yellow-400 font-bold text-base">Sign Up</Text>
                <ExternalLink size={16} color="#F59E0B" style={{ marginLeft: 4 }} />
              </TouchableOpacity>
            </View>

            {/* Info Section */}
            <View className="bg-gray-800 rounded-xl p-4">
              <Text className="text-gray-400 text-sm mb-2 font-semibold">Important:</Text>
              <Text className="text-gray-400 text-xs mb-1">• Keep your login credentials secure</Text>
              <Text className="text-gray-400 text-xs mb-1">• Enable 2FA for additional security</Text>
              <Text className="text-gray-400 text-xs">• Contact support if you need help</Text>
            </View>
          </View>

          {/* Spacer for bottom nav */}
          <View className="h-16" />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
} 
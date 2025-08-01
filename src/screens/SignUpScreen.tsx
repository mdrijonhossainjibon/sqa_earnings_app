import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, StatusBar } from 'react-native';
import { ArrowLeft, Eye, EyeOff, CheckCircle, AlertCircle, Loader } from 'lucide-react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import ActionSheet, { ActionSheetRef, SheetManager } from 'react-native-actions-sheet';
import { GoogleSignin, GoogleSigninButton } from '@react-native-google-signin/google-signin';

interface ErrorPayload {
  title: string;
  message: string;
}

export default function SignUpScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errorData, setErrorData] = useState<ErrorPayload>({ title: '', message: '' });

  // Configure Google Sign-In
  useEffect(() => {
    GoogleSignin.configure({
      // Add your Google Web Client ID here
      webClientId: '892734237385-tcvsu7uiij9i0uf78nj453oua91t2c6p.apps.googleusercontent.com', // Replace with your actual client ID
      offlineAccess: true,
      hostedDomain: '',
      forceCodeForRefreshToken: true,
    });
  }, []);

  const handleSignUp = async () => {
    if (!name || !email || !password) {
      setErrorData({
        title: 'Validation Error',
        message: 'Please fill in all fields'
      });
      SheetManager.show('signUpError');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorData({
        title: 'Invalid Email',
        message: 'Please enter a valid email address'
      });
      SheetManager.show('signUpError');
      return;
    }

    // Password validation
    if (password.length < 6) {
      setErrorData({
        title: 'Weak Password',
        message: 'Password must be at least 6 characters long'
      });
      SheetManager.show('signUpError');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      
      // Simulate success (you can change this to test error)
      const isSuccess = Math.random() > 0.2; // 80% success rate for demo
      
      if (isSuccess) {
        // Navigate to OTP screen
        navigation.navigate('OTP', { email, name });
      } else {
        setErrorData({
          title: 'Sign Up Failed',
          message: 'Email already exists or network error. Please try again.'
        });
        SheetManager.show('signUpError');
      }
    }, 2000);
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsGoogleLoading(true);
      
      // Check if your device supports Google Play
      await GoogleSignin.hasPlayServices();
      
      // Get the users ID token
      const userInfo = await GoogleSignin.signIn();
      
      // Simulate API call with Google user data
      setTimeout(() => {
        setIsGoogleLoading(false);
        
        // Simulate success (you can change this to test error)
        const isSuccess = Math.random() > 0.1; // 90% success rate for demo
        
        if (isSuccess) {
          // Navigate to OTP screen with Google user data
          const user = (userInfo as any).user;
          navigation.navigate('OTP', { 
            email: user.email, 
            name: user.name || `${user.givenName} ${user.familyName}` 
          });
        } else {
          setErrorData({
            title: 'Google Sign-In Failed',
            message: 'Unable to sign in with Google. Please try again.'
          });
          SheetManager.show('signUpError');
        }
      }, 1500);
      
    } catch (error: any) {
      setIsGoogleLoading(false);
      
      if (error.code === 'SIGN_IN_CANCELLED') {
        // User cancelled the sign-in flow
        return;
      } else if (error.code === 'PLAY_SERVICES_NOT_AVAILABLE') {
        setErrorData({
          title: 'Google Play Services',
          message: 'Google Play Services is not available on this device.'
        });
      } else {
        setErrorData({
          title: 'Google Sign-In Error',
          message: error.message || 'An error occurred during Google sign-in.'
        });
      }
      SheetManager.show('signUpError');
    }
  };



  const SignUpLoadingSheet = () => {
    return (
      <View className="bg-gray-900 rounded-t-2xl p-6 items-center">
        <View className="w-16 h-16 bg-yellow-500/20 rounded-full items-center justify-center mb-4">
          <Loader size={32} color="#FFD600" className="animate-spin" />
        </View>
        <Text className="text-white text-lg font-bold mb-2 text-center">Creating Account...</Text>
        <Text className="text-gray-400 text-center">Please wait while we set up your account</Text>
      </View>
    );
  };

  const SignUpSuccessSheet = () => {
    return (
      <View className="bg-gray-900 rounded-t-2xl p-6 items-center">
        <View className="w-16 h-16 bg-green-500/20 rounded-full items-center justify-center mb-4">
          <CheckCircle size={32} color="#10B981" />
        </View>
        <Text className="text-white text-lg font-bold mb-2 text-center">Account Created!</Text>
        <Text className="text-gray-400 text-center mb-6">Welcome to our platform. You can now sign in.</Text>
        
        <TouchableOpacity 
          className="bg-yellow-400 px-8 py-3 rounded-xl w-full"
          onPress={() => {
            SheetManager.hide('signUpSuccess');
            navigation.goBack();
          }}
        >
          <Text className="text-gray-900 font-bold text-center">Sign In</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const SignUpErrorSheet = () => {
    return (
      <View className="bg-gray-900 rounded-t-2xl p-6 items-center">
        <View className="w-16 h-16 bg-red-500/20 rounded-full items-center justify-center mb-4">
          <AlertCircle size={32} color="#EF4444" />
        </View>
        <Text className="text-white text-lg font-bold mb-2 text-center">{errorData.title}</Text>
        <Text className="text-gray-400 text-center mb-6">{errorData.message}</Text>
        
        <TouchableOpacity 
          className="bg-gray-700 px-8 py-3 rounded-xl w-full"
          onPress={() => SheetManager.hide('signUpError')}
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
                Create Account
              </Text>
              <Text className="text-gray-400 text-center">
                Join us and start earning rewards today
              </Text>
            </View>

            {/* Name Input */}
            <View className="mb-4">
              <Text className="text-gray-400 text-sm mb-2 font-semibold">Full Name</Text>
              <View className="bg-gray-800 rounded-xl p-4">
                <TextInput
                  className="text-white text-base"
                  placeholder="Enter your full name"
                  placeholderTextColor="#6B7280"
                  autoCapitalize="words"
                  autoCorrect={false}
                  value={name}
                  onChangeText={setName}
                  editable={!isLoading}
                />
              </View>
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

            {/* Sign Up Button */}
            <TouchableOpacity
              className={`rounded-xl py-4 items-center mb-6 ${isLoading ? 'bg-gray-600' : 'bg-yellow-400'}`}
              onPress={handleSignUp}
              activeOpacity={0.8}
              disabled={isLoading}
            >
              <Text className={`font-bold text-lg ${isLoading ? 'text-gray-400' : 'text-gray-900'}`}>
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Text>
            </TouchableOpacity>

            {/* Divider */}
            <View className="flex-row items-center mb-6">
              <View className="flex-1 h-px bg-gray-700" />
              <Text className="text-gray-400 text-sm mx-4">OR</Text>
              <View className="flex-1 h-px bg-gray-700" />
            </View>

            {/* Google Sign-In Button */}
            <View className="mb-6">
              <GoogleSigninButton
                size={GoogleSigninButton.Size.Wide}
                color={GoogleSigninButton.Color.Dark}
                onPress={handleGoogleSignIn}
                disabled={isGoogleLoading || isLoading}
                style={{
                  width: '100%',
                  height: 48,
                  borderRadius: 12,
                }}
              />
            </View>

            {/* Sign In Link */}
            <View className="flex-row justify-center items-center mb-6">
              <Text className="text-gray-400 text-base">Already have an account? </Text>
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
              <Text className="text-gray-400 text-sm mb-2 font-semibold">By signing up, you agree to:</Text>
              <Text className="text-gray-400 text-xs mb-1">• Our Terms of Service</Text>
              <Text className="text-gray-400 text-xs mb-1">• Privacy Policy</Text>
              <Text className="text-gray-400 text-xs">• Cookie Policy</Text>
            </View>
          </View>

          {/* Spacer for bottom nav */}
          <View className="h-16" />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* ActionSheets */}
      <ActionSheet 
        id="signUpLoading"
        safeAreaInsets={insets}
        useBottomSafeAreaPadding
        drawUnderStatusBar={false}
        closeOnTouchBackdrop={false}
        closable={false} backgroundInteractionEnabled={true} isModal={false}
        gestureEnabled={false}
        onClose={() => {
          // Handle loading sheet close if needed
        }}
      >
        <SignUpLoadingSheet />
      </ActionSheet>

      <ActionSheet 
        id="signUpSuccess"
        safeAreaInsets={insets}
        useBottomSafeAreaPadding
        drawUnderStatusBar={false}
        closeOnTouchBackdrop={true}
        gestureEnabled={true}
        onClose={() => {
          // Navigate back to login screen when success sheet is closed
          navigation.goBack();
        }}
      >
        <SignUpSuccessSheet />
      </ActionSheet>

      <ActionSheet 
        id="signUpError"
        safeAreaInsets={insets}
        useBottomSafeAreaPadding
        drawUnderStatusBar={false}
        closeOnTouchBackdrop={true}
        gestureEnabled={true}
        closable={false} backgroundInteractionEnabled={true} isModal={false}
      >
        <SignUpErrorSheet />
      </ActionSheet>
    </SafeAreaView>
  );
} 
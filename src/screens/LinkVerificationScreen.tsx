import React from 'react';
import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Linking } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

export default function LinkVerificationScreen({ navigation }) {
  const handleOpenEmail = () => {
    // Attempt to open the default email app
    Linking.openURL('mailto:');
  };

  const handleResend = () => {
    // Handle resend verification link logic here
  };

  return (
    <LinearGradient colors={["#6a85f1", "#a777e3"]} style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingHorizontal: 20 }} showsVerticalScrollIndicator={false}>
          <View style={{ alignItems: 'center', marginBottom: 40 }}>
            <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#fff', marginBottom: 32, marginTop: 32, textAlign: 'center' }}>
              Verify Your Email
            </Text>
            <Text style={{ color: '#fff', fontSize: 16, textAlign: 'center', marginBottom: 24 }}>
              We have sent a verification link to your email address. Please check your inbox and click the link to verify your account.
            </Text>
          </View>
          <TouchableOpacity
            style={{ backgroundColor: '#22c55e', borderRadius: 10, paddingVertical: 16, alignItems: 'center', marginBottom: 16 }}
            onPress={handleOpenEmail}
            activeOpacity={0.8}
          >
            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 18 }}>Open Email App</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleResend} activeOpacity={0.7} style={{ alignItems: 'center', marginBottom: 24 }}>
            <Text style={{ color: '#fff', textDecorationLine: 'underline', fontSize: 16 }}>Resend Verification Email</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
} 
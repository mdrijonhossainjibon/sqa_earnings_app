import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

export default function EmailVerificationScreen({ navigation }) {
  const [code, setCode] = useState('');

  const handleVerify = () => {
    // Handle verification logic here
  };

  const handleResend = () => {
    // Handle resend code logic here
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
              Email Verification
            </Text>
            <Text style={{ color: '#fff', fontSize: 16, textAlign: 'center', marginBottom: 24 }}>
              We have sent a verification code to your email. Please enter the code below to verify your account.
            </Text>
          </View>
          <View style={{ marginBottom: 32 }}>
            <Text style={{ color: '#fff', fontWeight: '600', marginBottom: 8 }}>Verification Code</Text>
            <TextInput
              style={{ backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 8, padding: 14, color: '#fff', fontSize: 16, letterSpacing: 4 }}
              placeholder="Enter code"
              placeholderTextColor="#d1d5db"
              keyboardType="number-pad"
              value={code}
              onChangeText={setCode}
              maxLength={6}
            />
          </View>
          <TouchableOpacity
            style={{ backgroundColor: '#22c55e', borderRadius: 10, paddingVertical: 16, alignItems: 'center', marginBottom: 16 }}
            onPress={handleVerify}
            activeOpacity={0.8}
          >
            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 18 }}>Verify</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleResend} activeOpacity={0.7} style={{ alignItems: 'center', marginBottom: 24 }}>
            <Text style={{ color: '#fff', textDecorationLine: 'underline', fontSize: 16 }}>Resend Code</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
} 
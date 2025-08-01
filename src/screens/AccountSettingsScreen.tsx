import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, StatusBar, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, User, Mail, Lock, Shield, Fingerprint, Smartphone, Bell, Eye, EyeOff, Save, Trash2, Key } from 'lucide-react-native';

export default function AccountSettingsScreen({ navigation }: any) {
  const [name, setName] = useState('John Doe');
  const [email, setEmail] = useState('john.doe@example.com');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passPin, setPassPin] = useState('');
  const [showPassPin, setShowPassPin] = useState(false);
  const [fingerprintEnabled, setFingerprintEnabled] = useState(false);
  const [passPinEnabled, setPassPinEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleSave = () => {
    // Validate passwords match
    if (newPassword && newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }
    
    // Validate pass pin length
    if (passPinEnabled && passPin.length !== 4) {
      Alert.alert('Error', 'Pass PIN must be 4 digits');
      return;
    }

    Alert.alert('Success', 'Account settings updated successfully');
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => console.log('Account deleted') }
      ]
    );
  };

  const toggleFingerprint = () => {
    if (!fingerprintEnabled) {
      Alert.alert(
        'Enable Fingerprint',
        'Do you want to enable fingerprint authentication?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Enable', onPress: () => setFingerprintEnabled(true) }
        ]
      );
    } else {
      setFingerprintEnabled(false);
    }
  };

  const togglePassPin = () => {
    if (passPinEnabled) {
      Alert.alert(
        'Disable Pass PIN',
        'Are you sure you want to disable pass PIN?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Disable', onPress: () => setPassPinEnabled(false) }
        ]
      );
    } else {
      setPassPinEnabled(true);
    }
  };

  return (
    <View className="flex-1 bg-gray-900">
      <StatusBar barStyle="light-content" backgroundColor="#111827" translucent={false} />
      <SafeAreaView edges={['top']} className="bg-gray-900">
        <View className="flex-row items-center justify-between px-4 pt-2 pb-2 bg-gray-900">
          <TouchableOpacity 
            activeOpacity={0.7} 
            onPress={() => navigation.goBack()}
            className="flex-row items-center"
          >
            <ArrowLeft size={24} color="#fff" />
            <Text className="text-white ml-2 font-semibold">Back</Text>
          </TouchableOpacity>
          <Text className="text-xl font-bold text-white">Account Settings</Text>
          <View className="w-10" />
        </View>
      </SafeAreaView>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
      >
        <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
          {/* Profile Information Section */}
          <View className="mt-4">
            <Text className="text-lg font-bold text-white mb-4">Profile Information</Text>
            
            <View className="bg-gray-800 rounded-xl p-4 mb-4">
              <View className="mb-4">
                <View className="flex-row items-center mb-2">
                  <User size={20} color="#FFD600" />
                  <Text className="text-white font-semibold ml-2">Full Name</Text>
                </View>
                <TextInput
                  className="bg-gray-700 rounded-lg p-3 text-white text-base"
                  placeholder="Enter your full name"
                  placeholderTextColor="#9CA3AF"
                  value={name}
                  onChangeText={setName}
                />
              </View>

              <View className="mb-4">
                <View className="flex-row items-center mb-2">
                  <Mail size={20} color="#FFD600" />
                  <Text className="text-white font-semibold ml-2">Email Address</Text>
                </View>
                <TextInput
                  className="bg-gray-700 rounded-lg p-3 text-white text-base"
                  placeholder="Enter your email"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>
            </View>
          </View>

          {/* Security Settings Section */}
          <View className="mt-6">
            <Text className="text-lg font-bold text-white mb-4">Security Settings</Text>
            
            <View className="bg-gray-800 rounded-xl p-4 mb-4">
              {/* Current Password */}
              <View className="mb-4">
                <View className="flex-row items-center mb-2">
                  <Lock size={20} color="#FFD600" />
                  <Text className="text-white font-semibold ml-2">Current Password</Text>
                </View>
                <View className="relative">
                  <TextInput
                    className="bg-gray-700 rounded-lg p-3 text-white text-base pr-12"
                    placeholder="Enter current password"
                    placeholderTextColor="#9CA3AF"
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={setPassword}
                  />
                  <TouchableOpacity
                    className="absolute right-3 top-3"
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={20} color="#9CA3AF" /> : <Eye size={20} color="#9CA3AF" />}
                  </TouchableOpacity>
                </View>
              </View>

              {/* New Password */}
              <View className="mb-4">
                <View className="flex-row items-center mb-2">
                  <Lock size={20} color="#FFD600" />
                  <Text className="text-white font-semibold ml-2">New Password</Text>
                </View>
                <View className="relative">
                  <TextInput
                    className="bg-gray-700 rounded-lg p-3 text-white text-base pr-12"
                    placeholder="Enter new password"
                    placeholderTextColor="#9CA3AF"
                    secureTextEntry={!showNewPassword}
                    value={newPassword}
                    onChangeText={setNewPassword}
                  />
                  <TouchableOpacity
                    className="absolute right-3 top-3"
                    onPress={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? <EyeOff size={20} color="#9CA3AF" /> : <Eye size={20} color="#9CA3AF" />}
                  </TouchableOpacity>
                </View>
              </View>

              {/* Confirm New Password */}
              <View className="mb-4">
                <View className="flex-row items-center mb-2">
                  <Lock size={20} color="#FFD600" />
                  <Text className="text-white font-semibold ml-2">Confirm New Password</Text>
                </View>
                <View className="relative">
                  <TextInput
                    className="bg-gray-700 rounded-lg p-3 text-white text-base pr-12"
                    placeholder="Confirm new password"
                    placeholderTextColor="#9CA3AF"
                    secureTextEntry={!showConfirmPassword}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                  />
                  <TouchableOpacity
                    className="absolute right-3 top-3"
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff size={20} color="#9CA3AF" /> : <Eye size={20} color="#9CA3AF" />}
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>

          {/* Authentication Methods Section */}
          <View className="mt-6">
            <Text className="text-lg font-bold text-white mb-4">Authentication Methods</Text>
            
            <View className="bg-gray-800 rounded-xl p-4 mb-4">
              {/* Fingerprint Authentication */}
              <View className="flex-row items-center justify-between mb-4">
                <View className="flex-row items-center">
                  <Fingerprint size={20} color="#FFD600" />
                  <View className="ml-3">
                    <Text className="text-white font-semibold">Fingerprint Authentication</Text>
                    <Text className="text-gray-400 text-sm">Use fingerprint to unlock app</Text>
                  </View>
                </View>
                <Switch
                  value={fingerprintEnabled}
                  onValueChange={toggleFingerprint}
                  trackColor={{ false: '#374151', true: '#FFD600' }}
                  thumbColor={fingerprintEnabled ? '#000' : '#9CA3AF'}
                />
              </View>

              {/* Pass PIN */}
              <View className="flex-row items-center justify-between mb-4">
                <View className="flex-row items-center">
                  <Key size={20} color="#FFD600" />
                  <View className="ml-3">
                    <Text className="text-white font-semibold">Pass PIN</Text>
                    <Text className="text-gray-400 text-sm">4-digit PIN for app access</Text>
                  </View>
                </View>
                <Switch
                  value={passPinEnabled}
                  onValueChange={togglePassPin}
                  trackColor={{ false: '#374151', true: '#FFD600' }}
                  thumbColor={passPinEnabled ? '#000' : '#9CA3AF'}
                />
              </View>

              {/* Pass PIN Input */}
              {passPinEnabled && (
                <View className="mb-4">
                  <View className="flex-row items-center mb-2">
                    <Key size={20} color="#FFD600" />
                    <Text className="text-white font-semibold ml-2">Enter 4-Digit PIN</Text>
                  </View>
                  <View className="relative">
                    <TextInput
                      className="bg-gray-700 rounded-lg p-3 text-white text-base pr-12 text-center   tracking-widest"
                      placeholder="0000"
                      placeholderTextColor="#9CA3AF"
                      secureTextEntry={!showPassPin}
                      value={passPin}
                      onChangeText={(text) => {
                        // Only allow numbers and limit to 4 digits
                        const numericText = text.replace(/[^0-9]/g, '');
                        if (numericText.length <= 4) {
                          setPassPin(numericText);
                        }
                      }}
                      keyboardType="numeric"
                      maxLength={4}
                    />
                    <TouchableOpacity
                      className="absolute right-3 top-3"
                      onPress={() => setShowPassPin(!showPassPin)}
                    >
                      {showPassPin ? <EyeOff size={20} color="#9CA3AF" /> : <Eye size={20} color="#9CA3AF" />}
                    </TouchableOpacity>
                  </View>
                  <Text className="text-gray-400 text-xs mt-1">PIN will be used to secure app access</Text>
                </View>
              )}
            </View>
          </View>

          {/* Notifications Section */}
          <View className="mt-6">
            <Text className="text-lg font-bold text-white mb-4">Notifications</Text>
            
            <View className="bg-gray-800 rounded-xl p-4 mb-4">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <Bell size={20} color="#FFD600" />
                  <View className="ml-3">
                    <Text className="text-white font-semibold">Push Notifications</Text>
                    <Text className="text-gray-400 text-sm">Receive app notifications</Text>
                  </View>
                </View>
                <Switch
                  value={notificationsEnabled}
                  onValueChange={setNotificationsEnabled}
                  trackColor={{ false: '#374151', true: '#FFD600' }}
                  thumbColor={notificationsEnabled ? '#000' : '#9CA3AF'}
                />
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View className="mt-6 mb-8">
            <TouchableOpacity
              className="bg-yellow-500 rounded-xl p-4 items-center mb-4"
              onPress={handleSave}
              activeOpacity={0.8}
            >
              <View className="flex-row items-center">
                <Save size={20} color="#000" />
                <Text className="text-black font-bold text-lg ml-2">Save Changes</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-red-500 rounded-xl p-4 items-center"
              onPress={handleDeleteAccount}
              activeOpacity={0.8}
            >
              <View className="flex-row items-center">
                <Trash2 size={20} color="#fff" />
                <Text className="text-white font-bold text-lg ml-2">Delete Account</Text>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
} 
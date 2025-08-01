import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ToastAndroid, Platform, StatusBar } from 'react-native';
import { ArrowLeft, User, Mail, Lock, Camera, Save, Eye, EyeOff, Loader, AlertTriangle } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { API_CALL } from '../lib/api';
import { getItem } from '../asyncStorage';

// Types
interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  country?: string;
  timezone?: string;
}

interface UpdateProfileData {
  name?: string;
  email?: string;
  password?: string;
  phone?: string;
  country?: string;
  timezone?: string;
}

export default function EditProfileScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Toast function
  const showToast = (message: string) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      Alert.alert('Info', message);
    }
  };

  // Fetch current user profile
  const fetchUserProfile = async () => {
    setIsLoading(true);
    try {
      const token = await getItem<string>('token');
      if (!token) {
        setError('Authentication required');
        return;
      }

      const { response, status } = await API_CALL({
        apiVersionUrl: 'barong',
        url: '/api/mobile/user/profile',
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (status === 200 && response) {
        const profileData = response as UserProfile;
        setName(profileData.name || '');
        setEmail(profileData.email || '');
        setPhone(profileData.phone || '');
        setCountry(profileData.country || '');
        setError(null);
      } else {
        setError('Failed to load profile data');
      }
    } catch (error: any) {
      console.log('Profile fetch error:', error.message);
      setError('Failed to load profile data');
    } finally {
      setIsLoading(false);
    }
  };

  // Load profile data on mount
  useEffect(() => {
    fetchUserProfile();
  }, []);

  // Validate form
  const validateForm = (): boolean => {
    if (!name.trim()) {
      showToast('Name is required');
      return false;
    }
    if (!email.trim()) {
      showToast('Email is required');
      return false;
    }
    if (password && password.length < 6) {
      showToast('Password must be at least 6 characters');
      return false;
    }
    return true;
  };

  // Handle save changes
  const handleSaveChanges = async () => {
    if (!validateForm()) return;

    setIsSaving(true);
    try {
      const token = await getItem<string>('token');
      if (!token) {
        showToast('Authentication required');
        return;
      }

      const updateData: UpdateProfileData = {
        name: name.trim(),
        email: email.trim(),
      };

      if (password.trim()) {
        updateData.password = password.trim();
      }

      if (phone.trim()) {
        updateData.phone = phone.trim();
      }

      if (country.trim()) {
        updateData.country = country.trim();
      }

      const { response, status } = await API_CALL({
        apiVersionUrl: 'barong',
        url: '/api/mobile/user/profile',
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: updateData
      });

      if (status === 200 && response) {
        showToast('Profile updated successfully!');
        setPassword(''); // Clear password field after successful update
        navigation.goBack();
      } else {
        const errorMsg = (response as any)?.message?.error || 'Failed to update profile';
        showToast(errorMsg);
      }
    } catch (error: any) {
      console.log('Profile update error:', error.message);
      showToast('Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle image picker
  const handleImagePicker = () => {
    // TODO: Implement image picker functionality
    showToast('Image picker feature coming soon!');
  };

  // Loading state
  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-900">
        <StatusBar barStyle="light-content" backgroundColor="#111827" translucent={false} />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Loader size={48} color="#FFD600" />
          <Text style={{ color: '#fff', marginTop: 16, fontSize: 16 }}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Error state
  if (error && !name && !email) {
    return (
      <SafeAreaView className="flex-1 bg-gray-900">
        <StatusBar barStyle="light-content" backgroundColor="#111827" translucent={false} />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <AlertTriangle size={64} color="#ef4444" />
          <Text style={{ color: '#ef4444', marginTop: 16, fontSize: 18, fontWeight: 'bold', textAlign: 'center' }}>
            Failed to Load Profile
          </Text>
          <Text style={{ color: '#9ca3af', marginTop: 8, fontSize: 14, textAlign: 'center' }}>
            {error}
          </Text>
          <TouchableOpacity
            style={{ marginTop: 20, backgroundColor: '#FFD600', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 8 }}
            onPress={fetchUserProfile}
          >
            <Text style={{ color: '#000', fontWeight: 'bold' }}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <StatusBar barStyle="light-content" backgroundColor="#111827" translucent={false} />

      {/* Header */}
      <View className="flex-row items-center p-4 border-b border-gray-800">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-2">
          <ArrowLeft size={28} color="#FFD600" />
        </TouchableOpacity>
        <Text className="font-bold text-xl text-yellow-400 flex-1 text-center">Edit Profile</Text>
        <View className="w-8" />
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Avatar Section */}
        <View className="px-4 mt-6 mb-4">
          <Text className="text-gray-400 text-sm mb-2">Profile Picture</Text>
          <View className="bg-gray-800 rounded-xl p-6 items-center">
            <View className="relative mb-4">
              <View className="w-24 h-24 bg-yellow-500/20 rounded-full items-center justify-center border-4 border-yellow-500/30">
                <User size={48} color="#FFD600" />
              </View>
              <TouchableOpacity 
                className="absolute bottom-2 right-2 bg-yellow-500 p-2 rounded-full border-2 border-gray-900"
                onPress={handleImagePicker}
              >
                <Camera size={18} color="#000" />
              </TouchableOpacity>
            </View>
            <Text className="text-gray-400 text-sm text-center">
              Tap the camera icon to change your profile picture
            </Text>
          </View>
        </View>

        {/* Form Fields */}
        <View className="px-4 space-y-4">
          {/* Name Field */}
          <View>
            <Text className="text-gray-400 text-sm mb-2">Full Name</Text>
            <View className="bg-gray-800 rounded-xl p-4 flex-row items-center">
              <User size={20} color="#FFD600" className="mr-3" />
              <TextInput
                className="flex-1 text-white text-base"
                value={name}
                onChangeText={setName}
                placeholder="Enter your full name"
                placeholderTextColor="#6b7280"
                autoCapitalize="words"
              />
            </View>
          </View>

          {/* Email Field */}
          <View>
            <Text className="text-gray-400 text-sm mb-2">Email Address</Text>
            <View className="bg-gray-800 rounded-xl p-4 flex-row items-center">
              <Mail size={20} color="#FFD600" className="mr-3" />
              <TextInput
                className="flex-1 text-white text-base"
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email address"
                placeholderTextColor="#6b7280"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </View>

          {/* Phone Field */}
          <View>
            <Text className="text-gray-400 text-sm mb-2">Phone Number (Optional)</Text>
            <View className="bg-gray-800 rounded-xl p-4 flex-row items-center">
              <User size={20} color="#FFD600" className="mr-3" />
              <TextInput
                className="flex-1 text-white text-base"
                value={phone}
                onChangeText={setPhone}
                placeholder="Enter your phone number"
                placeholderTextColor="#6b7280"
                keyboardType="phone-pad"
              />
            </View>
          </View>

          {/* Country Field */}
          <View>
            <Text className="text-gray-400 text-sm mb-2">Country (Optional)</Text>
            <View className="bg-gray-800 rounded-xl p-4 flex-row items-center">
              <User size={20} color="#FFD600" className="mr-3" />
              <TextInput
                className="flex-1 text-white text-base"
                value={country}
                onChangeText={setCountry}
                placeholder="Enter your country"
                placeholderTextColor="#6b7280"
                autoCapitalize="words"
              />
            </View>
          </View>

          {/* Password Field */}
          <View>
            <Text className="text-gray-400 text-sm mb-2">New Password (Optional)</Text>
            <View className="bg-gray-800 rounded-xl p-4 flex-row items-center">
              <Lock size={20} color="#FFD600" className="mr-3" />
              <TextInput
                className="flex-1 text-white text-base"
                value={password}
                onChangeText={setPassword}
                placeholder="Enter new password"
                placeholderTextColor="#6b7280"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={20} color="#9ca3af" /> : <Eye size={20} color="#9ca3af" />}
              </TouchableOpacity>
            </View>
            {password.length > 0 && password.length < 6 && (
              <Text className="text-red-400 text-xs mt-1 ml-4">Password must be at least 6 characters</Text>
            )}
          </View>
        </View>

        {/* Save Button */}
        <View className="px-4 mt-8 mb-4">
          <TouchableOpacity 
            className={`rounded-xl py-4 items-center ${isSaving ? 'bg-gray-600' : 'bg-yellow-400'}`}
            onPress={handleSaveChanges}
            disabled={isSaving}
            activeOpacity={0.8}
          >
            {isSaving ? (
              <View className="flex-row items-center">
                <Loader size={20} color="#fff" style={{ marginRight: 8 }} />
                <Text className="text-white font-bold text-lg">Saving...</Text>
              </View>
            ) : (
              <View className="flex-row items-center">
                <Save size={20} color="#000" style={{ marginRight: 8 }} />
                <Text className="text-gray-900 font-bold text-lg">Save Changes</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Info Section */}
        <View className="px-4 mb-4">
          <View className="bg-gray-800 rounded-xl p-4">
            <Text className="text-gray-400 text-sm mb-2 font-semibold">Important:</Text>
            <Text className="text-gray-400 text-xs mb-1">• Your email address is used for account recovery</Text>
            <Text className="text-gray-400 text-xs mb-1">• Password changes require re-authentication</Text>
            <Text className="text-gray-400 text-xs">• Profile picture updates are processed within 24 hours</Text>
          </View>
        </View>

        {/* Spacer for bottom nav */}
        <View className="h-16" />
      </ScrollView>
    </SafeAreaView>
  );
} 
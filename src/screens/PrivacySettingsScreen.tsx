import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Switch, Alert, ToastAndroid, Platform, StatusBar } from 'react-native';
import { ArrowLeft, Shield, UserX, Save, Loader, AlertTriangle, Eye, EyeOff, Lock, Users, Activity, Trash2, Settings } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { API_CALL } from '../lib/api';
import { getItem, removeItem } from '../asyncStorage';

// Types
interface PrivacySettings {
  profile_public: boolean;
  allow_friend_requests: boolean;
  show_activity_status: boolean;
  allow_notifications: boolean;
  allow_location_sharing: boolean;
  allow_data_collection: boolean;
}

interface BlockedUser {
  id: string;
  name: string;
  email: string;
  blocked_at: string;
}

export default function PrivacySettingsScreen({ navigation }) {
  const [settings, setSettings] = useState<PrivacySettings>({
    profile_public: true,
    allow_friend_requests: true,
    show_activity_status: true,
    allow_notifications: true,
    allow_location_sharing: false,
    allow_data_collection: true
  });
  const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>([]);
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

  // Fetch privacy settings
  const fetchPrivacySettings = async () => {
    setIsLoading(true);
    try {
      const token = await getItem<string>('token');
      if (!token) {
        setError('Authentication required');
        return;
      }

      const { response, status } = await API_CALL({
        apiVersionUrl: 'barong',
        url: '/api/mobile/user/privacy-settings',
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (status === 200 && response) {
        const privacyData = response as PrivacySettings;
        setSettings(privacyData);
        setError(null);
      } else {
        // Use default settings if API doesn't return data
        console.log('Using default privacy settings');
      }
    } catch (error: any) {
      console.log('Privacy settings fetch error:', error.message);
      // Continue with default settings
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch blocked users
  const fetchBlockedUsers = async () => {
    try {
      const token = await getItem<string>('token');
      if (!token) return;

      const { response, status } = await API_CALL({
        apiVersionUrl: 'barong',
        url: '/api/mobile/user/blocked-users',
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (status === 200 && response) {
        setBlockedUsers(response as BlockedUser[]);
      }
    } catch (error: any) {
      console.log('Blocked users fetch error:', error.message);
    }
  };

  // Load data on mount
  useEffect(() => {
    fetchPrivacySettings();
    fetchBlockedUsers();
  }, []);

  // Handle setting change
  const handleSettingChange = (key: keyof PrivacySettings, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Save privacy settings
  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      const token = await getItem<string>('token');
      if (!token) {
        showToast('Authentication required');
        return;
      }

      const { response, status } = await API_CALL({
        apiVersionUrl: 'barong',
        url: '/api/mobile/user/privacy-settings',
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: settings
      });

      if (status === 200 && response) {
        showToast('Privacy settings updated successfully!');
      } else {
        showToast('Failed to update privacy settings');
      }
    } catch (error: any) {
      console.log('Privacy settings update error:', error.message);
      showToast('Failed to update privacy settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle delete account
  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently lost.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive', 
          onPress: async () => {
            try {
              const token = await getItem<string>('token');
              if (!token) {
                showToast('Authentication required');
                return;
              }

              const { status } = await API_CALL({
                apiVersionUrl: 'barong',
                url: '/api/mobile/user/delete-account',
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
              });

              if (status === 200) {
                // Clear local storage
                await removeItem('token');
                await removeItem('user');
                
                showToast('Account deleted successfully');
                
                // Navigate to login
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'Login' as never }],
                });
              } else {
                showToast('Failed to delete account');
              }
            } catch (error: any) {
              console.log('Delete account error:', error.message);
              showToast('Failed to delete account. Please try again.');
            }
          }
        }
      ]
    );
  };

  // Handle manage blocked users
  const handleManageBlockedUsers = () => {
    // TODO: Navigate to blocked users screen
    showToast('Blocked users management coming soon!');
  };

  // Loading state
  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-900">
        <StatusBar barStyle="light-content" backgroundColor="#111827" translucent={false} />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Loader size={48} color="#FFD600" />
          <Text style={{ color: '#fff', marginTop: 16, fontSize: 16 }}>Loading privacy settings...</Text>
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
        <Text className="font-bold text-xl text-yellow-400 flex-1 text-center">Privacy Settings</Text>
        <View className="w-8" />
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Profile Privacy */}
        <View className="px-4 mt-6 mb-4">
          <Text className="text-gray-400 text-sm mb-2">Profile Privacy</Text>
          <View className="bg-gray-800 rounded-xl p-4">
            <View className="flex-row items-center justify-between mb-4">
              <View className="flex-1 mr-4">
                <View className="flex-row items-center mb-1">
                  <Eye size={16} color="#FFD600" className="mr-2" />
                  <Text className="text-white font-semibold text-base">Show my profile publicly</Text>
                </View>
                <Text className="text-gray-400 text-xs">Allow others to view your profile information</Text>
              </View>
              <Switch
                value={settings.profile_public}
                onValueChange={(value) => handleSettingChange('profile_public', value)}
                trackColor={{ false: '#374151', true: '#FFD600' }}
                thumbColor={settings.profile_public ? '#000' : '#9ca3af'}
              />
            </View>

            <View className="flex-row items-center justify-between mb-4">
              <View className="flex-1 mr-4">
                <View className="flex-row items-center mb-1">
                  <Users size={16} color="#FFD600" className="mr-2" />
                  <Text className="text-white font-semibold text-base">Allow friend requests</Text>
                </View>
                <Text className="text-gray-400 text-xs">Let others send you friend requests</Text>
              </View>
              <Switch
                value={settings.allow_friend_requests}
                onValueChange={(value) => handleSettingChange('allow_friend_requests', value)}
                trackColor={{ false: '#374151', true: '#FFD600' }}
                thumbColor={settings.allow_friend_requests ? '#000' : '#9ca3af'}
              />
            </View>

            <View className="flex-row items-center justify-between">
              <View className="flex-1 mr-4">
                <View className="flex-row items-center mb-1">
                  <Activity size={16} color="#FFD600" className="mr-2" />
                  <Text className="text-white font-semibold text-base">Show activity status</Text>
                </View>
                <Text className="text-gray-400 text-xs">Display when you are active online</Text>
              </View>
              <Switch
                value={settings.show_activity_status}
                onValueChange={(value) => handleSettingChange('show_activity_status', value)}
                trackColor={{ false: '#374151', true: '#FFD600' }}
                thumbColor={settings.show_activity_status ? '#000' : '#9ca3af'}
              />
            </View>
          </View>
        </View>

        {/* Notifications & Data */}
        <View className="px-4 mb-4">
          <Text className="text-gray-400 text-sm mb-2">Notifications & Data</Text>
          <View className="bg-gray-800 rounded-xl p-4">
            <View className="flex-row items-center justify-between mb-4">
              <View className="flex-1 mr-4">
                <View className="flex-row items-center mb-1">
                  <Settings size={16} color="#FFD600" className="mr-2" />
                  <Text className="text-white font-semibold text-base">Push notifications</Text>
                </View>
                <Text className="text-gray-400 text-xs">Receive notifications for activities and updates</Text>
              </View>
              <Switch
                value={settings.allow_notifications}
                onValueChange={(value) => handleSettingChange('allow_notifications', value)}
                trackColor={{ false: '#374151', true: '#FFD600' }}
                thumbColor={settings.allow_notifications ? '#000' : '#9ca3af'}
              />
            </View>

            <View className="flex-row items-center justify-between mb-4">
              <View className="flex-1 mr-4">
                <View className="flex-row items-center mb-1">
                  <Lock size={16} color="#FFD600" className="mr-2" />
                  <Text className="text-white font-semibold text-base">Location sharing</Text>
                </View>
                <Text className="text-gray-400 text-xs">Allow app to access your location</Text>
              </View>
              <Switch
                value={settings.allow_location_sharing}
                onValueChange={(value) => handleSettingChange('allow_location_sharing', value)}
                trackColor={{ false: '#374151', true: '#FFD600' }}
                thumbColor={settings.allow_location_sharing ? '#000' : '#9ca3af'}
              />
            </View>

            <View className="flex-row items-center justify-between">
              <View className="flex-1 mr-4">
                <View className="flex-row items-center mb-1">
                  <Shield size={16} color="#FFD600" className="mr-2" />
                  <Text className="text-white font-semibold text-base">Data collection</Text>
                </View>
                <Text className="text-gray-400 text-xs">Allow analytics and usage data collection</Text>
              </View>
              <Switch
                value={settings.allow_data_collection}
                onValueChange={(value) => handleSettingChange('allow_data_collection', value)}
                trackColor={{ false: '#374151', true: '#FFD600' }}
                thumbColor={settings.allow_data_collection ? '#000' : '#9ca3af'}
              />
            </View>
          </View>
        </View>

        {/* Blocked Users */}
        <View className="px-4 mb-4">
          <Text className="text-gray-400 text-sm mb-2">Blocked Users</Text>
          <TouchableOpacity 
            className="bg-gray-800 rounded-xl p-4 flex-row items-center"
            onPress={handleManageBlockedUsers}
            activeOpacity={0.8}
          >
            <View className="bg-yellow-500/20 rounded-full p-2 mr-3">
              <Shield size={18} color="#FFD600" />
            </View>
            <View className="flex-1">
              <Text className="text-white font-semibold text-base">Manage Blocked Users</Text>
              <Text className="text-gray-400 text-xs mt-1">
                {blockedUsers.length} user{blockedUsers.length !== 1 ? 's' : ''} blocked
              </Text>
            </View>
            <Text className="text-gray-400 text-sm">→</Text>
          </TouchableOpacity>
        </View>

        {/* Save Button */}
        <View className="px-4 mb-4">
          <TouchableOpacity 
            className={`rounded-xl py-4 items-center ${isSaving ? 'bg-gray-600' : 'bg-yellow-400'}`}
            onPress={handleSaveSettings}
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

        {/* Danger Zone */}
        <View className="px-4 mb-4">
          <Text className="text-red-400 text-sm mb-2 font-semibold">Danger Zone</Text>
          <View className="bg-red-500/10 rounded-xl p-4 border border-red-500/20">
            <TouchableOpacity 
              className="flex-row items-center"
              onPress={handleDeleteAccount}
              activeOpacity={0.8}
            >
              <View className="bg-red-500/20 rounded-full p-2 mr-3">
                <Trash2 size={18} color="#ef4444" />
              </View>
              <View className="flex-1">
                <Text className="text-red-400 font-semibold text-base">Delete Account</Text>
                <Text className="text-red-400/70 text-xs mt-1">
                  Permanently delete your account and all associated data
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Info Section */}
        <View className="px-4 mb-4">
          <View className="bg-gray-800 rounded-xl p-4">
            <Text className="text-gray-400 text-sm mb-2 font-semibold">Privacy Information:</Text>
            <Text className="text-gray-400 text-xs mb-1">• Your privacy settings are applied immediately</Text>
            <Text className="text-gray-400 text-xs mb-1">• Blocked users cannot see your profile or contact you</Text>
            <Text className="text-gray-400 text-xs mb-1">• Data collection helps improve app performance</Text>
            <Text className="text-gray-400 text-xs">• Account deletion is permanent and cannot be undone</Text>
          </View>
        </View>

        {/* Spacer for bottom nav */}
        <View className="h-16" />
      </ScrollView>
    </SafeAreaView>
  );
} 
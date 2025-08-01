import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Animated, Alert, ToastAndroid, Platform, RefreshControl, Image } from 'react-native';
import { User, Trophy, TrendingUp, LogOut, Shield, Pencil, Loader, RefreshCw, AlertTriangle, Settings, Crown, Star, Calendar, DollarSign, ArrowLeft, ExternalLink, Copy, Eye, EyeOff } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { API_CALL } from '../lib/api';
import { getItem, removeItem } from '../asyncStorage';

// Types
interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  balance: number;
  total_earned: number;
  level: number;
  level_progress: number;
  level_target: number;
  member_since: string;
  referral_code: string;
  is_verified: boolean;
  achievements: Achievement[];
  activity_stats: ActivityStats;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlocked_at?: string;
  progress?: number;
  target?: number;
}

interface ActivityStats {
  searches_today: number;
  ads_watched: number;
  links_visited: number;
  videos_watched: number;
  surveys_completed: number;
  total_tasks: number;
  completed_tasks: number;
}

const AVATAR_INITIALS = 'UN'; // User initials fallback

export default function ProfileScreen() {
  const navigation = useNavigation<any>();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showBalance, setShowBalance] = useState(true);

  // Animated progress bar
  const progressAnim = React.useRef(new Animated.Value(0)).current;

  // Toast function
  const showToast = (message: string) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      Alert.alert('Info', message);
    }
  };

  // Fetch user profile data
  const fetchUserProfile = async () => {
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
        setUserProfile(profileData);
        setError(null);
        
        // Animate progress bar
        Animated.timing(progressAnim, {
          toValue: profileData.level_progress / 100,
          duration: 800,
          useNativeDriver: false,
        }).start();
      } else {
        setError('Failed to load profile data');
      }
    } catch (error: any) {
      console.log('Profile fetch error:', error.message);
      setError('Failed to load profile data');
    }
  };

  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);

  // Load all data
  const loadData = async () => {
    setIsLoading(true);
    await fetchUserProfile();
    setIsLoading(false);
  };

  // Pull to refresh
  const onRefresh = async () => {
    setIsRefreshing(true);
    await fetchUserProfile();
    setIsRefreshing(false);
    showToast('Profile refreshed!');
  };

  // Handle logout
  const handleLogout = async () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              const token = await getItem<string>('token');
              if (token) {
                // Call logout API
                await API_CALL({
                  apiVersionUrl: 'barong',
                  url: '/api/mobile/auth/logout',
                  method: 'POST',
                  headers: { Authorization: `Bearer ${token}` }
                });
              }
              
              // Clear local storage
              await removeItem('token');
              await removeItem('user');
              
              // Navigate to login
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' as never }],
              });
            } catch (error: any) {
              console.log('Logout error:', error.message);
              // Still clear local storage and navigate even if API fails
              await removeItem('token');
              await removeItem('user');
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' as never }],
              });
            }
          }
        }
      ]
    );
  };

  // Get user initials
  const getUserInitials = (name: string): string => {
    if (!name) return AVATAR_INITIALS;
    const names = name.split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Calculate days as member
  const getDaysAsMember = (memberSince: string): number => {
    if (!memberSince) return 0;
    const joinDate = new Date(memberSince);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - joinDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Handle copy referral code
  const handleCopyReferralCode = () => {
    // Add clipboard functionality here
    console.log('Copied referral code:', profile?.referral_code);
    showToast('Referral code copied!');
  };

  // Loading state
  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-900">
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Loader size={48} color="#FFD600" />
          <Text style={{ color: '#fff', marginTop: 16, fontSize: 16 }}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Error state
  if (error && !userProfile) {
    return (
      <SafeAreaView className="flex-1 bg-gray-900">
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
            onPress={loadData}
          >
            <Text style={{ color: '#000', fontWeight: 'bold' }}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Use fallback data if API fails
  const profile = userProfile || {
    id: '1',
    name: 'User Name',
    email: 'user@email.com',
    balance: 100,
    total_earned: 100,
    level: 1,
    level_progress: 10,
    level_target: 1000,
    member_since: new Date().toISOString(),
    referral_code: 'ABC123',
    is_verified: false,
    achievements: [
      { id: '1', title: 'First Dollar', description: 'Earned your first reward', icon: 'trophy', unlocked: true }
    ],
    activity_stats: {
      searches_today: 0,
      ads_watched: 0,
      links_visited: 0,
      videos_watched: 0,
      surveys_completed: 0,
      total_tasks: 0,
      completed_tasks: 0
    }
  };

  const daysMember = getDaysAsMember(profile.member_since);
  const progress = profile.level_progress / 100;

  // Activity data
  const activity = [
    { label: 'Searches Today', value: profile?.activity_stats?.searches_today || 0, color: '#10B981', icon: <TrendingUp size={18} color="#10B981" /> },
    { label: 'Ads Watched', value: profile?.activity_stats?.ads_watched || 0, color: '#3b82f6', icon: <TrendingUp size={18} color="#3b82f6" /> },
    { label: 'Links Visited', value: profile?.activity_stats?.links_visited || 0, color: '#8b5cf6', icon: <TrendingUp size={18} color="#8b5cf6" /> },
  ];

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      {/* Header */}
      <View className="flex-row items-center p-4 border-b border-gray-800">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-2">
          <ArrowLeft size={28} color="#FFD600" />
        </TouchableOpacity>
        <Text className="font-bold text-xl text-yellow-400 flex-1 text-center">Profile</Text>
        <TouchableOpacity onPress={onRefresh} disabled={isRefreshing} className="ml-2">
          <RefreshCw size={24} color="#FFD600" style={isRefreshing ? { transform: [{ rotate: '360deg' }] } : {}} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        className="flex-1" 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            colors={['#FFD600']}
            tintColor="#FFD600"
          />
        }
      >
        {/* Profile Header Card */}
        <View className="px-4 mt-6 mb-4">
          <View className="bg-gray-800 rounded-xl p-6">
            <View className="flex-row items-center mb-4">
              <View className="w-16 h-16 bg-yellow-500/20 rounded-full items-center justify-center mr-4">
                <Text className="text-yellow-400 font-bold text-2xl">{getUserInitials(profile.name)}</Text>
              </View>
              <View className="flex-1">
                <Text className="text-white font-bold text-lg">{profile.name}</Text>
                <Text className="text-gray-400 text-sm">{profile.email}</Text>
                <View className="flex-row items-center mt-1">
                  <Crown size={14} color="#F59E0B" />
                  <Text className="text-yellow-400 text-xs ml-1">Level {profile.level}</Text>
                  {profile.is_verified && (
                    <View className="ml-2 bg-green-500/20 px-2 py-1 rounded-full">
                      <Text className="text-green-400 text-xs font-bold">Verified</Text>
                    </View>
                  )}
                </View>
              </View>
            </View>

            {/* Balance Section */}
            <View className="bg-gray-700 rounded-xl p-4 mb-4">
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-gray-400 text-sm">Current Balance</Text>
                <TouchableOpacity onPress={() => setShowBalance(!showBalance)}>
                  {showBalance ? <Eye size={16} color="#9ca3af" /> : <EyeOff size={16} color="#9ca3af" />}
                </TouchableOpacity>
              </View>
              <Text className="text-yellow-400 font-bold text-2xl">
                {showBalance ? `$${profile.balance}` : '****'}
              </Text>
            </View>

            {/* Stats Row */}
            <View className="flex-row gap-3">
              <View className="flex-1 bg-gray-700 rounded-xl p-3 items-center">
                <DollarSign size={20} color="#10B981" />
                <Text className="text-green-400 font-bold text-lg mt-1">${profile.total_earned}</Text>
                <Text className="text-gray-400 text-xs">Total Earned</Text>
              </View>
              <View className="flex-1 bg-gray-700 rounded-xl p-3 items-center">
                <Calendar size={20} color="#6366f1" />
                <Text className="text-blue-400 font-bold text-lg mt-1">{daysMember}</Text>
                <Text className="text-gray-400 text-xs">Days Member</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Referral Code */}
        <View className="px-4 mb-4">
          <Text className="text-gray-400 text-sm mb-2">Referral Code</Text>
          <View className="bg-gray-800 rounded-xl p-4">
            <View className="flex-row items-center justify-between">
              <Text className="text-white font-mono text-lg">{profile.referral_code}</Text>
              <TouchableOpacity onPress={handleCopyReferralCode} className="ml-2">
                <Copy size={20} color="#FFD600" />
              </TouchableOpacity>
            </View>
            <Text className="text-gray-400 text-xs mt-2">Share this code with friends to earn bonuses</Text>
          </View>
        </View>

        {/* Level Progress */}
        <View className="px-4 mb-4">
          <Text className="text-gray-400 text-sm mb-2">Level Progress</Text>
          <View className="bg-gray-800 rounded-xl p-4">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-white font-bold text-base">VIP Level {profile.level}</Text>
              <Text className="text-yellow-400 font-bold text-sm">${profile.balance}/{profile.level_target}</Text>
            </View>
            <View className="h-3 bg-gray-700 rounded-lg w-full mb-2 overflow-hidden">
              <Animated.View style={{ height: 12, backgroundColor: '#FFD600', borderRadius: 8, width: progressAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }) }} />
            </View>
            <Text className="text-gray-400 text-xs">
              Earn ${(profile.level_target - profile.balance).toFixed(2)} more to reach Level {profile.level + 1}
            </Text>
          </View>
        </View>

        {/* Activity Summary */}
        <View className="px-4 mb-4">
          <Text className="text-gray-400 text-sm mb-2">Activity Summary</Text>
          <View className="bg-gray-800 rounded-xl p-4">
            <View className="flex-row justify-between gap-3">
              {activity.map((item, idx) => (
                <View key={idx} className="flex-1 items-center">
                  <View className="mb-2">{item.icon}</View>
                  <Text className="font-bold text-lg" style={{ color: item.color }}>{item.value}</Text>
                  <Text className="text-gray-400 text-xs text-center mt-1">{item.label}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Achievements */}
        <View className="px-4 mb-4">
          <Text className="text-gray-400 text-sm mb-2">Achievements</Text>
          <View className="bg-gray-800 rounded-xl p-4">
            {profile.achievements?.length > 0 ? (
              profile.achievements.map((ach, idx) => (
                <View key={idx} className="flex-row items-center mb-3 last:mb-0">
                  <View className="mr-3">
                    <Trophy size={20} color={ach.unlocked ? "#F59E0B" : "#6b7280"} />
                  </View>
                  <View className="flex-1">
                    <Text className="text-white font-semibold text-sm">{ach.title}</Text>
                    <Text className="text-gray-400 text-xs">{ach.description}</Text>
                  </View>
                  <View className={`px-2 py-1 rounded-full ${ach.unlocked ? 'bg-yellow-500/20' : 'bg-gray-700'}`}>
                    <Text className={`text-xs font-bold ${ach.unlocked ? 'text-yellow-400' : 'text-gray-400'}`}>
                      {ach.unlocked ? 'Unlocked' : 'Locked'}
                    </Text>
                  </View>
                </View>
              ))
            ) : (
              <View className="items-center py-4">
                <Trophy size={32} color="#6b7280" />
                <Text className="text-gray-400 text-sm mt-2 text-center">No achievements yet</Text>
                <Text className="text-gray-500 text-xs mt-1 text-center">Complete tasks to unlock achievements</Text>
              </View>
            )}
          </View>
        </View>

        {/* Account Settings */}
        <View className="px-4 mb-4">
          <Text className="text-gray-400 text-sm mb-2">Account Settings</Text>
          <View className="bg-gray-800 rounded-xl p-4">
            <TouchableOpacity 
              className="flex-row items-center p-3 rounded-xl bg-gray-700 mb-3" 
              activeOpacity={0.8}
              onPress={() => navigation.navigate('EditProfile')}
            >
              <View className="bg-yellow-500/20 rounded-full p-2 mr-3">
                <Pencil size={18} color="#FFD600" />
              </View>
              <Text className="text-white text-base font-medium flex-1">Edit Profile</Text>
              <ExternalLink size={16} color="#9ca3af" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              className="flex-row items-center p-3 rounded-xl bg-gray-700 mb-3" 
              activeOpacity={0.8}
              onPress={() => navigation.navigate('PrivacySettings')}
            >
              <View className="bg-yellow-500/20 rounded-full p-2 mr-3">
                <Shield size={18} color="#FFD600" />
              </View>
              <Text className="text-white text-base font-medium flex-1">Privacy Settings</Text>
              <ExternalLink size={16} color="#9ca3af" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              className="flex-row items-center p-3 rounded-xl bg-red-500/20 mt-2" 
              activeOpacity={0.8}
              onPress={handleLogout}
            >
              <View className="bg-red-500/20 rounded-full p-2 mr-3">
                <LogOut size={18} color="#ef4444" />
              </View>
              <Text className="text-red-400 font-bold text-base flex-1">Logout</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Spacer for bottom nav */}
        <View className="h-16" />
      </ScrollView>
    </SafeAreaView>
  );
}
 
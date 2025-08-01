import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StatusBar, Animated, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Shield, Eye, EyeOff, Download, Trash2, Lock, Users, Globe, Bell, Database, FileText, CheckCircle, AlertCircle, Info, ChevronRight, Download as DownloadIcon, Share2, Settings, TrendingUp, User, Clock } from 'lucide-react-native';

// Mock privacy data
const mockPrivacyData = {
  dataSharing: {
    analytics: true,
    marketing: false,
    thirdParty: false,
    personalizedAds: false
  },
  dataCollection: {
    location: true,
    deviceInfo: true,
    usageStats: true,
    crashReports: true
  },
  dataRetention: {
    accountData: 'Until account deletion',
    activityLogs: '30 days',
    analyticsData: '12 months',
    marketingData: 'Until opt-out'
  }
};

const privacyCategories = [
  {
    id: 'data-sharing',
    title: 'Data Sharing',
    description: 'Control how your data is shared',
    icon: <Share2 size={24} color="#FFD600" />,
    color: '#10B981'
  },
  {
    id: 'data-collection',
    title: 'Data Collection',
    description: 'Manage what data we collect',
    icon: <Database size={24} color="#FFD600" />,
    color: '#3B82F6'
  },
  {
    id: 'data-retention',
    title: 'Data Retention',
    description: 'How long we keep your data',
    icon: <Lock size={24} color="#FFD600" />,
    color: '#F59E0B'
  },
  {
    id: 'privacy-controls',
    title: 'Privacy Controls',
    description: 'Additional privacy settings',
    icon: <Settings size={24} color="#FFD600" />,
    color: '#8B5CF6'
  }
];

const privacyRights = [
  {
    id: 'access',
    title: 'Access Your Data',
    description: 'View all personal data we have about you',
    icon: <Eye size={20} color="#FFD600" />,
    action: 'Request Access'
  },
  {
    id: 'download',
    title: 'Download Your Data',
    description: 'Get a copy of your data in a portable format',
    icon: <DownloadIcon size={20} color="#FFD600" />,
    action: 'Download Data'
  },
  {
    id: 'delete',
    title: 'Delete Your Data',
    description: 'Permanently delete your account and data',
    icon: <Trash2 size={20} color="#FFD600" />,
    action: 'Delete Account'
  },
  {
    id: 'correction',
    title: 'Correct Your Data',
    description: 'Update or correct inaccurate information',
    icon: <CheckCircle size={20} color="#FFD600" />,
    action: 'Update Data'
  }
];

export default function PrivacyScreen({ navigation }: any) {
  const [dataSharing, setDataSharing] = useState(mockPrivacyData.dataSharing);
  const [dataCollection, setDataCollection] = useState(mockPrivacyData.dataCollection);
  const [selectedCategory, setSelectedCategory] = useState('data-sharing');
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const handlePrivacyRight = (right: any) => {
    switch (right.id) {
      case 'access':
        Alert.alert('Data Access', 'Your data access request has been submitted. You will receive an email within 30 days.');
        break;
      case 'download':
        Alert.alert('Download Data', 'Preparing your data for download. You will receive an email when it\'s ready.');
        break;
      case 'delete':
        Alert.alert(
          'Delete Account',
          'Are you sure you want to permanently delete your account? This action cannot be undone.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Delete', style: 'destructive', onPress: () => console.log('Account deleted') }
          ]
        );
        break;
      case 'correction':
        navigation.navigate('EditProfile');
        break;
    }
  };

  const toggleDataSharing = (key: string) => {
    setDataSharing(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev]
    }));
  };

  const toggleDataCollection = (key: string) => {
    setDataCollection(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev]
    }));
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
          <Text className="text-xl font-bold text-white">Privacy</Text>
          <View className="w-10" />
        </View>
      </SafeAreaView>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <Animated.View style={{ opacity: fadeAnim }}>
          {/* Header */}
          <View className="bg-gray-800 mx-4 mt-4 rounded-xl p-4">
            <View className="flex-row items-center mb-3">
              <Shield size={28} color="#FFD600" />
              <Text className="text-xl font-bold text-white ml-3">Privacy Center</Text>
            </View>
            <Text className="text-gray-400 text-sm">
              Control your privacy settings and manage your personal data
            </Text>
          </View>

          {/* Privacy Categories */}
          <View className="mx-4 mt-6">
            <Text className="text-lg font-bold text-white mb-4">Privacy Settings</Text>
            <View className="flex-row flex-wrap justify-between">
              {privacyCategories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  className={`w-[48%] bg-gray-800 rounded-xl p-4 mb-3 ${
                    selectedCategory === category.id ? 'border-2 border-yellow-500' : ''
                  }`}
                  onPress={() => setSelectedCategory(category.id)}
                >
                  <View className="items-center">
                    {category.icon}
                    <Text className="text-white font-semibold text-center mt-2">{category.title}</Text>
                    <Text className="text-gray-400 text-xs text-center mt-1">{category.description}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Data Sharing Settings */}
          {selectedCategory === 'data-sharing' && (
            <View className="mx-4 mt-6">
              <Text className="text-lg font-bold text-white mb-4">Data Sharing Preferences</Text>
              <View className="bg-gray-800 rounded-xl p-4">
                <View className="flex-row items-center justify-between mb-4">
                  <View className="flex-row items-center">
                    <Globe size={20} color="#FFD600" />
                    <View className="ml-3">
                      <Text className="text-white font-semibold">Analytics & Performance</Text>
                      <Text className="text-gray-400 text-sm">Help us improve the app</Text>
                    </View>
                  </View>
                  <Switch
                    value={dataSharing.analytics}
                    onValueChange={() => toggleDataSharing('analytics')}
                    trackColor={{ false: '#374151', true: '#FFD600' }}
                    thumbColor={dataSharing.analytics ? '#000' : '#9CA3AF'}
                  />
                </View>

                <View className="flex-row items-center justify-between mb-4">
                  <View className="flex-row items-center">
                    <Bell size={20} color="#FFD600" />
                    <View className="ml-3">
                      <Text className="text-white font-semibold">Marketing Communications</Text>
                      <Text className="text-gray-400 text-sm">Receive promotional emails</Text>
                    </View>
                  </View>
                  <Switch
                    value={dataSharing.marketing}
                    onValueChange={() => toggleDataSharing('marketing')}
                    trackColor={{ false: '#374151', true: '#FFD600' }}
                    thumbColor={dataSharing.marketing ? '#000' : '#9CA3AF'}
                  />
                </View>

                <View className="flex-row items-center justify-between mb-4">
                  <View className="flex-row items-center">
                    <Users size={20} color="#FFD600" />
                    <View className="ml-3">
                      <Text className="text-white font-semibold">Third-Party Sharing</Text>
                      <Text className="text-gray-400 text-sm">Share data with partners</Text>
                    </View>
                  </View>
                  <Switch
                    value={dataSharing.thirdParty}
                    onValueChange={() => toggleDataSharing('thirdParty')}
                    trackColor={{ false: '#374151', true: '#FFD600' }}
                    thumbColor={dataSharing.thirdParty ? '#000' : '#9CA3AF'}
                  />
                </View>

                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <Eye size={20} color="#FFD600" />
                    <View className="ml-3">
                      <Text className="text-white font-semibold">Personalized Advertising</Text>
                      <Text className="text-gray-400 text-sm">Show relevant ads</Text>
                    </View>
                  </View>
                  <Switch
                    value={dataSharing.personalizedAds}
                    onValueChange={() => toggleDataSharing('personalizedAds')}
                    trackColor={{ false: '#374151', true: '#FFD600' }}
                    thumbColor={dataSharing.personalizedAds ? '#000' : '#9CA3AF'}
                  />
                </View>
              </View>
            </View>
          )}

          {/* Data Collection Settings */}
          {selectedCategory === 'data-collection' && (
            <View className="mx-4 mt-6">
              <Text className="text-lg font-bold text-white mb-4">Data Collection Preferences</Text>
              <View className="bg-gray-800 rounded-xl p-4">
                <View className="flex-row items-center justify-between mb-4">
                  <View className="flex-row items-center">
                    <Globe size={20} color="#FFD600" />
                    <View className="ml-3">
                      <Text className="text-white font-semibold">Location Data</Text>
                      <Text className="text-gray-400 text-sm">Access your location</Text>
                    </View>
                  </View>
                  <Switch
                    value={dataCollection.location}
                    onValueChange={() => toggleDataCollection('location')}
                    trackColor={{ false: '#374151', true: '#FFD600' }}
                    thumbColor={dataCollection.location ? '#000' : '#9CA3AF'}
                  />
                </View>

                <View className="flex-row items-center justify-between mb-4">
                  <View className="flex-row items-center">
                    <Database size={20} color="#FFD600" />
                    <View className="ml-3">
                      <Text className="text-white font-semibold">Device Information</Text>
                      <Text className="text-gray-400 text-sm">Collect device details</Text>
                    </View>
                  </View>
                  <Switch
                    value={dataCollection.deviceInfo}
                    onValueChange={() => toggleDataCollection('deviceInfo')}
                    trackColor={{ false: '#374151', true: '#FFD600' }}
                    thumbColor={dataCollection.deviceInfo ? '#000' : '#9CA3AF'}
                  />
                </View>

                <View className="flex-row items-center justify-between mb-4">
                  <View className="flex-row items-center">
                    <TrendingUp size={20} color="#FFD600" />
                    <View className="ml-3">
                      <Text className="text-white font-semibold">Usage Statistics</Text>
                      <Text className="text-gray-400 text-sm">Track app usage patterns</Text>
                    </View>
                  </View>
                  <Switch
                    value={dataCollection.usageStats}
                    onValueChange={() => toggleDataCollection('usageStats')}
                    trackColor={{ false: '#374151', true: '#FFD600' }}
                    thumbColor={dataCollection.usageStats ? '#000' : '#9CA3AF'}
                  />
                </View>

                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <AlertCircle size={20} color="#FFD600" />
                    <View className="ml-3">
                      <Text className="text-white font-semibold">Crash Reports</Text>
                      <Text className="text-gray-400 text-sm">Send crash data for debugging</Text>
                    </View>
                  </View>
                  <Switch
                    value={dataCollection.crashReports}
                    onValueChange={() => toggleDataCollection('crashReports')}
                    trackColor={{ false: '#374151', true: '#FFD600' }}
                    thumbColor={dataCollection.crashReports ? '#000' : '#9CA3AF'}
                  />
                </View>
              </View>
            </View>
          )}

          {/* Data Retention Information */}
          {selectedCategory === 'data-retention' && (
            <View className="mx-4 mt-6">
              <Text className="text-lg font-bold text-white mb-4">Data Retention Periods</Text>
              <View className="bg-gray-800 rounded-xl p-4">
                <View className="mb-4">
                  <View className="flex-row items-center mb-2">
                    <User size={20} color="#FFD600" />
                    <Text className="text-white font-semibold ml-2">Account Data</Text>
                  </View>
                  <Text className="text-gray-400 text-sm ml-7">{mockPrivacyData.dataRetention.accountData}</Text>
                </View>

                <View className="mb-4">
                  <View className="flex-row items-center mb-2">
                    <Clock size={20} color="#FFD600" />
                    <Text className="text-white font-semibold ml-2">Activity Logs</Text>
                  </View>
                  <Text className="text-gray-400 text-sm ml-7">{mockPrivacyData.dataRetention.activityLogs}</Text>
                </View>

                <View className="mb-4">
                  <View className="flex-row items-center mb-2">
                    <TrendingUp size={20} color="#FFD600" />
                    <Text className="text-white font-semibold ml-2">Analytics Data</Text>
                  </View>
                  <Text className="text-gray-400 text-sm ml-7">{mockPrivacyData.dataRetention.analyticsData}</Text>
                </View>

                <View>
                  <View className="flex-row items-center mb-2">
                    <Bell size={20} color="#FFD600" />
                    <Text className="text-white font-semibold ml-2">Marketing Data</Text>
                  </View>
                  <Text className="text-gray-400 text-sm ml-7">{mockPrivacyData.dataRetention.marketingData}</Text>
                </View>
              </View>
            </View>
          )}

          {/* Privacy Rights */}
          <View className="mx-4 mt-6">
            <Text className="text-lg font-bold text-white mb-4">Your Privacy Rights</Text>
            <View className="bg-gray-800 rounded-xl p-4">
              {privacyRights.map((right) => (
                <TouchableOpacity
                  key={right.id}
                  className="flex-row items-center justify-between p-3 bg-gray-700 rounded-lg mb-3"
                  onPress={() => handlePrivacyRight(right)}
                  activeOpacity={0.8}
                >
                  <View className="flex-row items-center">
                    {right.icon}
                    <View className="ml-3">
                      <Text className="text-white font-semibold">{right.title}</Text>
                      <Text className="text-gray-400 text-sm">{right.description}</Text>
                    </View>
                  </View>
                  <ChevronRight size={20} color="#9CA3AF" />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Privacy Policy Links */}
          <View className="mx-4 mt-6 mb-6">
            <Text className="text-lg font-bold text-white mb-4">Privacy Documents</Text>
            <View className="bg-gray-800 rounded-xl p-4">
              <TouchableOpacity className="flex-row items-center p-3 bg-gray-700 rounded-lg mb-3">
                <FileText size={20} color="#FFD600" />
                <View className="ml-3 flex-1">
                  <Text className="text-white font-semibold">Privacy Policy</Text>
                  <Text className="text-gray-400 text-sm">Read our complete privacy policy</Text>
                </View>
                <ChevronRight size={20} color="#9CA3AF" />
              </TouchableOpacity>
              
              <TouchableOpacity className="flex-row items-center p-3 bg-gray-700 rounded-lg mb-3">
                <FileText size={20} color="#FFD600" />
                <View className="ml-3 flex-1">
                  <Text className="text-white font-semibold">Terms of Service</Text>
                  <Text className="text-gray-400 text-sm">Read our terms and conditions</Text>
                </View>
                <ChevronRight size={20} color="#9CA3AF" />
              </TouchableOpacity>
              
              <TouchableOpacity className="flex-row items-center p-3 bg-gray-700 rounded-lg">
                <FileText size={20} color="#FFD600" />
                <View className="ml-3 flex-1">
                  <Text className="text-white font-semibold">Cookie Policy</Text>
                  <Text className="text-gray-400 text-sm">Learn about our use of cookies</Text>
                </View>
                <ChevronRight size={20} color="#9CA3AF" />
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
} 
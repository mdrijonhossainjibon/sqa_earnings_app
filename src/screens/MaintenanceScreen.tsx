import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StatusBar, Linking, RefreshControl } from 'react-native';
import { Wrench, Clock, AlertTriangle, RefreshCw, Mail, MessageCircle, ExternalLink, Wifi, WifiOff } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ActionSheet, { SheetManager } from 'react-native-actions-sheet';

export default function MaintenanceScreen({ navigation }: any) {
  const [isLoading, setIsLoading] = useState(false);
  const [lastChecked, setLastChecked] = useState(new Date());
  const [maintenanceStatus, setMaintenanceStatus] = useState({
    isActive: true,
    estimatedEndTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
    reason: 'Scheduled system maintenance and updates',
    progress: 65,
    updates: [
      {
        id: 1,
        time: '2 hours ago',
        message: 'Maintenance started - System updates in progress',
        type: 'info'
      },
      {
        id: 2,
        time: '1 hour ago',
        message: 'Database optimization completed successfully',
        type: 'success'
      },
      {
        id: 3,
        time: '30 minutes ago',
        message: 'Security patches being applied',
        type: 'info'
      }
    ]
  });

  const handleCheckStatus = () => {
    setIsLoading(true);
    // Simulate API call to check maintenance status
    setTimeout(() => {
      setIsLoading(false);
      setLastChecked(new Date());
      // Simulate random status change
      if (Math.random() > 0.7) {
        setMaintenanceStatus(prev => ({
          ...prev,
          isActive: false
        }));
        SheetManager.show('maintenanceEnded');
      }
    }, 2000);
  };

  const handleContactSupport = () => {
    Linking.openURL('mailto:support@sqa-earnings.com?subject=Maintenance Inquiry');
  };

  const handleLiveChat = () => {
    // Navigate to support screen or open live chat
    navigation.navigate('Support');
  };

  const handleVisitWebsite = () => {
    Linking.openURL('https://sqa-earnings.com/status');
  };

  const formatTimeRemaining = () => {
    const now = new Date();
    const end = maintenanceStatus.estimatedEndTime;
    const diff = end.getTime() - now.getTime();
    
    if (diff <= 0) {
      return 'Should be completed soon';
    }
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m remaining`;
    } else {
      return `${minutes}m remaining`;
    }
  };

  const MaintenanceEndedSheet = () => {
    return (
      <View className="bg-gray-900 rounded-t-2xl p-6 items-center">
        <View className="w-16 h-16 bg-green-500/20 rounded-full items-center justify-center mb-4">
          <Wifi size={32} color="#10B981" />
        </View>
        <Text className="text-white text-lg font-bold mb-2 text-center">Maintenance Complete!</Text>
        <Text className="text-gray-400 text-center mb-6">
          The maintenance has been completed successfully. You can now use the app normally.
        </Text>
        
        <TouchableOpacity 
          className="bg-yellow-400 px-8 py-3 rounded-xl w-full"
          onPress={() => {
            SheetManager.hide('maintenanceEnded');
            // Navigate back to main app or refresh
            navigation.goBack();
          }}
        >
          <Text className="text-gray-900 font-bold text-center">Continue</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const StatusUpdateSheet = () => {
    return (
      <View className="bg-gray-900 rounded-t-2xl p-6">
        <Text className="text-white text-lg font-bold mb-4 text-center">Maintenance Updates</Text>
        
        <ScrollView className="max-h-80">
          {maintenanceStatus.updates.map((update) => (
            <View key={update.id} className="mb-4 p-4 bg-gray-800 rounded-xl">
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-gray-400 text-sm">{update.time}</Text>
                <View className={`w-2 h-2 rounded-full ${
                  update.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
                }`} />
              </View>
              <Text className="text-white">{update.message}</Text>
            </View>
          ))}
        </ScrollView>
        
        <TouchableOpacity 
          className="bg-gray-700 px-8 py-3 rounded-xl mt-4"
          onPress={() => SheetManager.hide('statusUpdates')}
        >
          <Text className="text-white font-bold text-center">Close</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <StatusBar barStyle="light-content" backgroundColor="#111827" translucent={false} />

      <ScrollView 
        className="flex-1" 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={handleCheckStatus}
            tintColor="#FFD600"
            colors={["#FFD600"]}
          />
        }
      >
        {/* Header */}
        <View className="items-center pt-8 pb-6">
          <View className="w-24 h-24 bg-orange-500/20 rounded-full items-center justify-center mb-4">
            <Wrench size={48} color="#F59E0B" />
          </View>
          <Text className="text-white text-2xl font-bold text-center mb-2">
            Under Maintenance
          </Text>
          <Text className="text-gray-400 text-center text-base px-6">
            We're currently performing scheduled maintenance to improve your experience.
          </Text>
        </View>

        {/* Status Card */}
        <View className="mx-6 mb-6">
          <View className="bg-gray-800 rounded-xl p-6">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-white font-bold text-lg">Maintenance Status</Text>
              <View className="flex-row items-center">
                <View className="w-2 h-2 bg-orange-500 rounded-full mr-2" />
                <Text className="text-orange-400 text-sm font-semibold">In Progress</Text>
              </View>
            </View>

            {/* Progress Bar */}
            <View className="mb-4">
              <View className="flex-row justify-between mb-2">
                <Text className="text-gray-400 text-sm">Progress</Text>
                <Text className="text-white text-sm font-semibold">{maintenanceStatus.progress}%</Text>
              </View>
              <View className="w-full bg-gray-700 rounded-full h-2">
                <View 
                  className="bg-orange-500 h-2 rounded-full" 
                  style={{ width: `${maintenanceStatus.progress}%` }}
                />
              </View>
            </View>

            {/* Time Remaining */}
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Clock size={20} color="#F59E0B" className="mr-2" />
                <Text className="text-gray-400 text-sm">Estimated completion</Text>
              </View>
              <Text className="text-white font-semibold">{formatTimeRemaining()}</Text>
            </View>
          </View>
        </View>

        {/* Reason */}
        <View className="mx-6 mb-6">
          <View className="bg-gray-800 rounded-xl p-6">
            <Text className="text-white font-bold text-lg mb-3">What's Happening?</Text>
            <Text className="text-gray-300 leading-6">
              {maintenanceStatus.reason}. This maintenance is necessary to ensure optimal performance and security of our platform.
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View className="mx-6 mb-6 space-y-3">
          <TouchableOpacity
            className="bg-yellow-400 rounded-xl p-4 flex-row items-center"
            onPress={handleCheckStatus}
            activeOpacity={0.8}
            disabled={isLoading}
          >
            <RefreshCw size={24} color="#1F2937" className={`mr-3 ${isLoading ? 'animate-spin' : ''}`} />
            <Text className="text-gray-900 font-bold text-lg flex-1">
              {isLoading ? 'Checking...' : 'Check Status'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-gray-800 rounded-xl p-4 flex-row items-center"
            onPress={() => SheetManager.show('statusUpdates')}
            activeOpacity={0.8}
          >
            <AlertTriangle size={24} color="#FFD600" className="mr-3" />
            <Text className="text-white font-semibold text-lg flex-1">View Updates</Text>
            <ExternalLink size={20} color="#FFD600" />
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-gray-800 rounded-xl p-4 flex-row items-center"
            onPress={handleVisitWebsite}
            activeOpacity={0.8}
          >
            <ExternalLink size={24} color="#FFD600" className="mr-3" />
            <Text className="text-white font-semibold text-lg flex-1">Visit Status Page</Text>
            <ExternalLink size={20} color="#FFD600" />
          </TouchableOpacity>
        </View>

        {/* Contact Options */}
        <View className="mx-6 mb-6">
          <Text className="text-white font-bold text-lg mb-4">Need Help?</Text>
          
          <View className="space-y-3">
            <TouchableOpacity
              className="bg-gray-800 rounded-xl p-4 flex-row items-center"
              onPress={handleContactSupport}
              activeOpacity={0.8}
            >
              <Mail size={24} color="#FFD600" className="mr-3" />
              <Text className="text-white font-semibold text-lg flex-1">Email Support</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-gray-800 rounded-xl p-4 flex-row items-center"
              onPress={handleLiveChat}
              activeOpacity={0.8}
            >
              <MessageCircle size={24} color="#FFD600" className="mr-3" />
              <Text className="text-white font-semibold text-lg flex-1">Live Chat</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Information Section */}
        <View className="mx-6 mb-6">
          <View className="bg-gray-800 rounded-xl p-6">
            <Text className="text-white font-bold text-lg mb-4">What to Expect</Text>
            
            <View className="space-y-3">
              <View className="flex-row">
                <Text className="text-yellow-400 mr-2">•</Text>
                <Text className="text-gray-300 flex-1">
                  Your account data and balance are safe and secure
                </Text>
              </View>
              <View className="flex-row">
                <Text className="text-yellow-400 mr-2">•</Text>
                <Text className="text-gray-300 flex-1">
                  You'll receive a notification when maintenance is complete
                </Text>
              </View>
              <View className="flex-row">
                <Text className="text-yellow-400 mr-2">•</Text>
                <Text className="text-gray-300 flex-1">
                  All pending transactions will be processed after maintenance
                </Text>
              </View>
              <View className="flex-row">
                <Text className="text-yellow-400 mr-2">•</Text>
                <Text className="text-gray-300 flex-1">
                  Check our status page for real-time updates
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Last Checked */}
        <View className="mx-6 mb-6">
          <View className="bg-gray-800 rounded-xl p-4">
            <Text className="text-gray-400 text-sm text-center">
              Last checked: {lastChecked.toLocaleTimeString()}
            </Text>
          </View>
        </View>

        {/* Alternative Actions */}
        <View className="mx-6 mb-6">
          <TouchableOpacity
            className="bg-gray-700 rounded-xl p-4 items-center"
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
          >
            <Text className="text-gray-300 font-semibold">Go Back</Text>
          </TouchableOpacity>
        </View>

        {/* Spacer for bottom nav */}
        <View className="h-16" />
      </ScrollView>

      {/* ActionSheets */}
      <ActionSheet id="maintenanceEnded">
        <MaintenanceEndedSheet />
      </ActionSheet>

      <ActionSheet id="statusUpdates">
        <StatusUpdateSheet />
      </ActionSheet>
    </SafeAreaView>
  );
} 
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StatusBar, Animated, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Bell, BellOff, Settings, Filter, Trash2, CheckCircle, AlertCircle, Gift, TrendingUp, Clock, Star, MessageCircle, DollarSign, Eye, EyeOff } from 'lucide-react-native';

// Mock notifications data
const mockNotifications = [
  {
    id: 1,
    type: 'success',
    title: 'Points Earned!',
    message: 'You earned 50 points for completing daily tasks',
    time: '2 minutes ago',
    isRead: false,
    icon: 'gift',
    action: 'view'
  },
  {
    id: 2,
    type: 'info',
    title: 'New Reward Available',
    message: 'Check out the new mystery box reward in the rewards section',
    time: '15 minutes ago',
    isRead: false,
    icon: 'trending',
    action: 'claim'
  },
  {
    id: 3,
    type: 'warning',
    title: 'Daily Goal Reminder',
    message: 'You\'re 3 tasks away from completing your daily goal',
    time: '1 hour ago',
    isRead: true,
    icon: 'alert',
    action: 'complete'
  },
  {
    id: 4,
    type: 'success',
    title: 'Withdrawal Successful',
    message: 'Your withdrawal of $25.00 has been processed successfully',
    time: '2 hours ago',
    isRead: true,
    icon: 'dollar',
    action: 'view'
  },
  {
    id: 5,
    type: 'info',
    title: 'Friend Invited',
    message: 'Sarah Johnson joined using your referral code',
    time: '3 hours ago',
    isRead: true,
    icon: 'message',
    action: 'view'
  },
  {
    id: 6,
    type: 'success',
    title: 'Level Up!',
    message: 'Congratulations! You\'ve reached Level 5',
    time: '5 hours ago',
    isRead: true,
    icon: 'star',
    action: 'celebrate'
  },
  {
    id: 7,
    type: 'warning',
    title: 'Session Expiring',
    message: 'Your session will expire in 10 minutes. Please refresh to continue',
    time: '1 day ago',
    isRead: true,
    icon: 'clock',
    action: 'refresh'
  },
  {
    id: 8,
    type: 'info',
    title: 'New Feature Available',
    message: 'Try our new video earning feature for extra points',
    time: '2 days ago',
    isRead: true,
    icon: 'trending',
    action: 'try'
  }
];

const getNotificationIcon = (icon: string, size: number = 20) => {
  switch (icon) {
    case 'gift':
      return <Gift size={size} color="#10B981" />;
    case 'trending':
      return <TrendingUp size={size} color="#3B82F6" />;
    case 'alert':
      return <AlertCircle size={size} color="#F59E0B" />;
    case 'dollar':
      return <DollarSign size={size} color="#10B981" />;
    case 'message':
      return <MessageCircle size={size} color="#8B5CF6" />;
    case 'star':
      return <Star size={size} color="#F59E0B" />;
    case 'clock':
      return <Clock size={size} color="#EF4444" />;
    default:
      return <Bell size={size} color="#6B7280" />;
  }
};

const getNotificationColor = (type: string) => {
  switch (type) {
    case 'success':
      return '#10B981';
    case 'warning':
      return '#F59E0B';
    case 'error':
      return '#EF4444';
    case 'info':
      return '#3B82F6';
    default:
      return '#6B7280';
  }
};

export default function NotificationsScreen({ navigation }: any) {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [filter, setFilter] = useState('all');
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const filters = [
    { key: 'all', label: 'All', count: notifications.length },
    { key: 'unread', label: 'Unread', count: notifications.filter(n => !n.isRead).length },
    { key: 'success', label: 'Success', count: notifications.filter(n => n.type === 'success').length },
    { key: 'warning', label: 'Warnings', count: notifications.filter(n => n.type === 'warning').length },
    { key: 'info', label: 'Info', count: notifications.filter(n => n.type === 'info').length }
  ];

  const filteredNotifications = notifications.filter(notification => {
    if (showUnreadOnly && notification.isRead) return false;
    if (filter !== 'all' && notification.type !== filter) return false;
    return true;
  });

  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const handleNotificationPress = (notification: any) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
    
    // Handle different notification actions
    switch (notification.action) {
      case 'claim':
        navigation.navigate('Reward');
        break;
      case 'complete':
        navigation.navigate('EarningMethods');
        break;
      case 'view':
        navigation.navigate('History');
        break;
      case 'celebrate':
        // Show celebration animation
        break;
      case 'refresh':
        // Refresh session
        break;
      case 'try':
        navigation.navigate('WatchVideos');
        break;
      default:
        break;
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
          <Text className="text-xl font-bold text-white">Notifications</Text>
          <TouchableOpacity 
            activeOpacity={0.7}
            onPress={() => {/* Navigate to notification settings */}}
          >
            <Settings size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <Animated.View style={{ opacity: fadeAnim }}>
          {/* Header Stats */}
          <View className="bg-gray-800 mx-4 mt-4 rounded-xl p-4">
            <View className="flex-row items-center justify-between mb-3">
              <View className="flex-row items-center">
                <Bell size={24} color="#FFD600" />
                <Text className="text-lg font-bold text-white ml-2">Notification Center</Text>
              </View>
              <View className="bg-yellow-500 px-3 py-1 rounded-full">
                <Text className="text-black font-bold text-sm">
                  {notifications.filter(n => !n.isRead).length} new
                </Text>
              </View>
            </View>
            
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-gray-400 text-sm">Total Notifications</Text>
                <Text className="text-white font-bold text-lg">{notifications.length}</Text>
              </View>
              <View>
                <Text className="text-gray-400 text-sm">Unread</Text>
                <Text className="text-white font-bold text-lg">{notifications.filter(n => !n.isRead).length}</Text>
              </View>
              <TouchableOpacity 
                className="bg-blue-500 px-3 py-1 rounded-lg"
                onPress={markAllAsRead}
              >
                <Text className="text-white font-semibold text-sm">Mark All Read</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Filter Section */}
          <View className="mx-4 mt-4">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-white font-semibold">Filter Notifications</Text>
              <TouchableOpacity 
                className="flex-row items-center"
                onPress={() => setShowUnreadOnly(!showUnreadOnly)}
              >
                <Filter size={16} color="#FFD600" />
                <Text className="text-yellow-500 text-sm ml-1 font-medium">
                  {showUnreadOnly ? 'Unread Only' : 'Show All'}
                </Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
              {filters.map((filterItem) => (
                <TouchableOpacity
                  key={filterItem.key}
                  className={`px-4 py-2 rounded-full mr-3 ${
                    filter === filterItem.key ? 'bg-yellow-500' : 'bg-gray-700'
                  }`}
                  onPress={() => setFilter(filterItem.key)}
                >
                  <Text
                    className={`font-medium text-sm ${
                      filter === filterItem.key ? 'text-black' : 'text-gray-300'
                    }`}
                  >
                    {filterItem.label} ({filterItem.count})
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Notifications List */}
          <View className="mx-4 mb-4">
            {filteredNotifications.length === 0 ? (
              <View className="bg-gray-800 rounded-xl p-8 items-center">
                <BellOff size={48} color="#6B7280" />
                <Text className="text-gray-400 text-lg font-semibold mt-4">No notifications</Text>
                <Text className="text-gray-500 text-sm text-center mt-2">
                  {filter === 'all' ? 'You\'re all caught up!' : 'No notifications match your filter'}
                </Text>
              </View>
            ) : (
              filteredNotifications.map((notification, index) => (
                <TouchableOpacity
                  key={notification.id}
                  className={`bg-gray-800 rounded-xl p-4 mb-3 ${
                    !notification.isRead ? 'border-l-4 border-yellow-500' : ''
                  }`}
                  onPress={() => handleNotificationPress(notification)}
                  activeOpacity={0.8}
                >
                  <View className="flex-row items-start">
                    {/* Icon */}
                    <View className="mr-3 mt-1">
                      {getNotificationIcon(notification.icon)}
                    </View>

                    {/* Content */}
                    <View className="flex-1">
                      <View className="flex-row items-center justify-between mb-1">
                        <Text className={`font-semibold text-base ${
                          !notification.isRead ? 'text-white' : 'text-gray-300'
                        }`}>
                          {notification.title}
                        </Text>
                        <View className="flex-row items-center">
                          <Text className="text-gray-500 text-xs mr-2">{notification.time}</Text>
                          {!notification.isRead && (
                            <View className="w-2 h-2 bg-yellow-500 rounded-full" />
                          )}
                        </View>
                      </View>
                      
                      <Text className="text-gray-400 text-sm mb-2" numberOfLines={2}>
                        {notification.message}
                      </Text>

                      {/* Action Button */}
                      <View className="flex-row items-center justify-between">
                        <TouchableOpacity
                          className={`px-3 py-1 rounded-lg ${
                            notification.action === 'claim' ? 'bg-green-500' :
                            notification.action === 'complete' ? 'bg-blue-500' :
                            'bg-gray-600'
                          }`}
                          onPress={() => handleNotificationPress(notification)}
                        >
                          <Text className="text-white font-medium text-xs capitalize">
                            {notification.action}
                          </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          className="p-1"
                          onPress={() => deleteNotification(notification.id)}
                        >
                          <Trash2 size={16} color="#EF4444" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </View>

          {/* Notification Settings */}
          <View className="mx-4 mb-6">
            <Text className="text-lg font-bold text-white mb-4">Notification Settings</Text>
            
            <View className="bg-gray-800 rounded-xl p-4 mb-4">
              <View className="flex-row items-center justify-between mb-4">
                <View className="flex-row items-center">
                  <Bell size={20} color="#FFD600" />
                  <View className="ml-3">
                    <Text className="text-white font-semibold">Push Notifications</Text>
                    <Text className="text-gray-400 text-sm">Receive notifications on your device</Text>
                  </View>
                </View>
                <Switch
                  value={pushEnabled}
                  onValueChange={setPushEnabled}
                  trackColor={{ false: '#374151', true: '#FFD600' }}
                  thumbColor={pushEnabled ? '#000' : '#9CA3AF'}
                />
              </View>

              <View className="flex-row items-center justify-between mb-4">
                <View className="flex-row items-center">
                  <MessageCircle size={20} color="#FFD600" />
                  <View className="ml-3">
                    <Text className="text-white font-semibold">Email Notifications</Text>
                    <Text className="text-gray-400 text-sm">Receive notifications via email</Text>
                  </View>
                </View>
                <Switch
                  value={emailEnabled}
                  onValueChange={setEmailEnabled}
                  trackColor={{ false: '#374151', true: '#FFD600' }}
                  thumbColor={emailEnabled ? '#000' : '#9CA3AF'}
                />
              </View>

              <View className="flex-row items-center justify-between mb-4">
                <View className="flex-row items-center">
                  <Bell size={20} color="#FFD600" />
                  <View className="ml-3">
                    <Text className="text-white font-semibold">Sound Alerts</Text>
                    <Text className="text-gray-400 text-sm">Play sound for notifications</Text>
                  </View>
                </View>
                <Switch
                  value={soundEnabled}
                  onValueChange={setSoundEnabled}
                  trackColor={{ false: '#374151', true: '#FFD600' }}
                  thumbColor={soundEnabled ? '#000' : '#9CA3AF'}
                />
              </View>

              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <Bell size={20} color="#FFD600" />
                  <View className="ml-3">
                    <Text className="text-white font-semibold">Vibration</Text>
                    <Text className="text-gray-400 text-sm">Vibrate for notifications</Text>
                  </View>
                </View>
                <Switch
                  value={vibrationEnabled}
                  onValueChange={setVibrationEnabled}
                  trackColor={{ false: '#374151', true: '#FFD600' }}
                  thumbColor={vibrationEnabled ? '#000' : '#9CA3AF'}
                />
              </View>
            </View>

            {/* Clear All Button */}
            <TouchableOpacity
              className="bg-red-500 rounded-xl p-4 items-center"
              onPress={clearAllNotifications}
              activeOpacity={0.8}
            >
              <View className="flex-row items-center">
                <Trash2 size={20} color="#fff" />
                <Text className="text-white font-bold text-lg ml-2">Clear All Notifications</Text>
              </View>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
} 
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StatusBar, RefreshControl, Alert, ToastAndroid, Platform } from 'react-native';
import { 
  ArrowLeft, 
  Search, 
  Link, 
  BookOpen, 
  Play, 
  Users, 
  ClipboardList, 
  Gift, 
  TrendingUp, 
  DollarSign, 
  Clock, 
  Star, 
  Zap, 
  Target, 
  Loader, 
  RefreshCw, 
  AlertTriangle,
  ExternalLink,
  Crown,
  Coins
} from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { API_CALL } from '../lib/api';
import { getItem } from '../asyncStorage';

// Types
interface EarningMethod {
  id: string;
  title: string;
  description: string;
  icon: React.ReactElement;
  reward: string;
  timeEstimate: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  isAvailable: boolean;
  isHot?: boolean;
  isNew?: boolean;
  category: 'search' | 'links' | 'reading' | 'videos' | 'surveys' | 'referrals' | 'games' | 'tasks';
  route: string;
}

interface DailyProgress {
  searches_completed: number;
  links_visited: number;
  articles_read: number;
  videos_watched: number;
  surveys_completed: number;
  total_earned_today: number;
  daily_goal: number;
}

interface QuickStats {
  total_earned: number;
  tasks_completed: number;
  current_level: number;
  level_progress: number;
}

export default function EarnScreen() {
  const navigation = useNavigation<any>();
  const [dailyProgress, setDailyProgress] = useState<DailyProgress | null>(null);
  const [quickStats, setQuickStats] = useState<QuickStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Toast function
  const showToast = (message: string) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      Alert.alert('Info', message);
    }
  };

  // Earning methods data
  const earningMethods: EarningMethod[] = [
    {
      id: 'search',
      title: 'Search & Earn',
      description: 'Search the web and earn rewards',
      icon: <Search size={24} color="#FFD600" />,
      reward: '$0.01 - $0.05',
      timeEstimate: '1-2 min',
      difficulty: 'Easy',
      isAvailable: true,
      isHot: true,
      category: 'search',
      route: 'SearchEarn'
    },
    {
      id: 'links',
      title: 'Visit Links',
      description: 'Visit sponsored links and earn',
      icon: <Link size={24} color="#FFD600" />,
      reward: '$0.02 - $0.10',
      timeEstimate: '2-3 min',
      difficulty: 'Easy',
      isAvailable: true,
      category: 'links',
      route: 'VisitLinkEarn'
    },
    {
      id: 'reading',
      title: 'Read Articles',
      description: 'Read articles and earn rewards',
      icon: <BookOpen size={24} color="#FFD600" />,
      reward: '$0.05 - $0.15',
      timeEstimate: '3-5 min',
      difficulty: 'Medium',
      isAvailable: true,
      isNew: true,
      category: 'reading',
      route: 'ReadingAndEarn'
    },
    {
      id: 'videos',
      title: 'Watch Videos',
      description: 'Watch videos and earn rewards',
      icon: <Play size={24} color="#FFD600" />,
      reward: '$0.03 - $0.08',
      timeEstimate: '2-4 min',
      difficulty: 'Easy',
      isAvailable: true,
      category: 'videos',
      route: 'WatchVideos'
    },
    {
      id: 'surveys',
      title: 'Complete Surveys',
      description: 'Take surveys and earn higher rewards',
      icon: <ClipboardList size={24} color="#FFD600" />,
      reward: '$0.10 - $0.50',
      timeEstimate: '5-15 min',
      difficulty: 'Medium',
      isAvailable: true,
      category: 'surveys',
      route: 'Surveys'
    },
    {
      id: 'referrals',
      title: 'Refer Friends',
      description: 'Invite friends and earn bonuses',
      icon: <Users size={24} color="#FFD600" />,
      reward: '$1.00 - $5.00',
      timeEstimate: '1-2 min',
      difficulty: 'Easy',
      isAvailable: true,
      isHot: true,
      category: 'referrals',
      route: 'ReferFriend'
    },
    {
      id: 'games',
      title: 'Play Games',
      description: 'Play games and earn rewards',
      icon: <Gift size={24} color="#FFD600" />,
      reward: '$0.05 - $0.20',
      timeEstimate: '5-10 min',
      difficulty: 'Medium',
      isAvailable: true,
      category: 'games',
      route: 'WordConnectGame'
    },
    {
      id: 'tasks',
      title: 'Daily Tasks',
      description: 'Complete daily tasks for bonuses',
      icon: <Target size={24} color="#FFD600" />,
      reward: '$0.25 - $1.00',
      timeEstimate: '10-20 min',
      difficulty: 'Hard',
      isAvailable: true,
      category: 'tasks',
      route: 'Task'
    }
  ];

  // Fetch daily progress and stats
  const fetchEarnData = async () => {
    setIsLoading(true);
    try {
      const token = await getItem<string>('token');
      if (!token) {
        setError('Authentication required');
        return;
      }

      // Fetch daily progress
      const { response: progressResponse, status: progressStatus } = await API_CALL({
        apiVersionUrl: 'barong',
        url: '/api/mobile/earnings/daily-progress',
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` }
      });

      // Fetch quick stats
      const { response: statsResponse, status: statsStatus } = await API_CALL({
        apiVersionUrl: 'barong',
        url: '/api/mobile/user/profile',
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (progressStatus === 200 && progressResponse) {
        setDailyProgress(progressResponse as DailyProgress);
      } else {
        // Use default progress data
        setDailyProgress({
          searches_completed: 0,
          links_visited: 0,
          articles_read: 0,
          videos_watched: 0,
          surveys_completed: 0,
          total_earned_today: 0,
          daily_goal: 5.00
        });
      }

      if (statsStatus === 200 && statsResponse) {
        const userData = statsResponse as any;
        setQuickStats({
          total_earned: userData.total_earned || 0,
          tasks_completed: userData.tasks_completed || 0,
          current_level: userData.level || 1,
          level_progress: userData.level_progress || 0
        });
      } else {
        // Use default stats
        setQuickStats({
          total_earned: 0,
          tasks_completed: 0,
          current_level: 1,
          level_progress: 0
        });
      }

      setError(null);
    } catch (error: any) {
      console.log('Earn data fetch error:', error.message);
      setError('Failed to load earning data');
    } finally {
      setIsLoading(false);
    }
  };

  // Load data on mount
  useEffect(() => {
    fetchEarnData();
  }, []);

  // Pull to refresh
  const onRefresh = async () => {
    setIsRefreshing(true);
    await fetchEarnData();
    setIsRefreshing(false);
    showToast('Earning data refreshed!');
  };

  // Handle earning method press
  const handleEarningMethodPress = (method: EarningMethod) => {
    if (!method.isAvailable) {
      showToast('This earning method is currently unavailable');
      return;
    }
    navigation.navigate(method.route as never);
  };

  // Get difficulty color
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return '#10B981';
      case 'Medium': return '#F59E0B';
      case 'Hard': return '#EF4444';
      default: return '#6B7280';
    }
  };

  // Loading state
  if (isLoading && !dailyProgress) {
    return (
      <SafeAreaView className="flex-1 bg-gray-900">
        <StatusBar barStyle="light-content" backgroundColor="#111827" translucent={false} />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Loader size={48} color="#FFD600" />
          <Text style={{ color: '#fff', marginTop: 16, fontSize: 16 }}>Loading earning opportunities...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Error state
  if (error && !dailyProgress) {
    return (
      <SafeAreaView className="flex-1 bg-gray-900">
        <StatusBar barStyle="light-content" backgroundColor="#111827" translucent={false} />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <AlertTriangle size={64} color="#ef4444" />
          <Text style={{ color: '#ef4444', marginTop: 16, fontSize: 18, fontWeight: 'bold', textAlign: 'center' }}>
            Failed to Load Earning Data
          </Text>
          <Text style={{ color: '#9ca3af', marginTop: 8, fontSize: 14, textAlign: 'center' }}>
            {error}
          </Text>
          <TouchableOpacity
            style={{ marginTop: 20, backgroundColor: '#FFD600', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 8 }}
            onPress={fetchEarnData}
          >
            <Text style={{ color: '#000', fontWeight: 'bold' }}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const progress = dailyProgress || {
    searches_completed: 0,
    links_visited: 0,
    articles_read: 0,
    videos_watched: 0,
    surveys_completed: 0,
    total_earned_today: 0,
    daily_goal: 5.00
  };

  const stats = quickStats || {
    total_earned: 0,
    tasks_completed: 0,
    current_level: 1,
    level_progress: 0
  };

  const dailyProgressPercentage = (progress.total_earned_today / progress.daily_goal) * 100;

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <StatusBar barStyle="light-content" backgroundColor="#111827" translucent={false} />

      {/* Header */}
      <View className="flex-row items-center p-4 border-b border-gray-800">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-2">
          <ArrowLeft size={28} color="#FFD600" />
        </TouchableOpacity>
        <Text className="font-bold text-xl text-yellow-400 flex-1 text-center">Earn Money</Text>
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
        {/* Quick Stats */}
        <View className="px-4 mt-6 mb-4">
          <View className="bg-gray-800 rounded-xl p-4">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-white font-bold text-lg">Today's Progress</Text>
              <View className="flex-row items-center">
                <Crown size={16} color="#F59E0B" />
                <Text className="text-yellow-400 text-sm ml-1">Level {stats.current_level}</Text>
              </View>
            </View>
            
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-gray-400 text-sm">Daily Goal</Text>
              <Text className="text-yellow-400 font-bold">${progress.daily_goal.toFixed(2)}</Text>
            </View>
            
            <View className="h-2 bg-gray-700 rounded-full mb-3 overflow-hidden">
              <View 
                className="h-2 bg-yellow-400 rounded-full" 
                style={{ width: `${Math.min(dailyProgressPercentage, 100)}%` }}
              />
            </View>
            
            <View className="flex-row items-center justify-between">
              <Text className="text-white font-bold text-lg">${progress.total_earned_today.toFixed(2)}</Text>
              <Text className="text-gray-400 text-sm">earned today</Text>
            </View>
          </View>
        </View>

        {/* Total Earnings */}
        <View className="px-4 mb-4">
          <View className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-xl p-4 border border-yellow-500/30">
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-yellow-400 text-sm font-semibold">Total Earned</Text>
                <Text className="text-white font-bold text-2xl">${stats.total_earned.toFixed(2)}</Text>
              </View>
              <View className="items-end">
                <Coins size={32} color="#FFD600" />
                <Text className="text-gray-400 text-xs mt-1">{stats.tasks_completed} tasks</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Daily Activities */}
        <View className="px-4 mb-4">
          <Text className="text-gray-400 text-sm mb-2">Today's Activities</Text>
          <View className="bg-gray-800 rounded-xl p-4">
            <View className="flex-row justify-between mb-3">
              <View className="items-center flex-1">
                <Search size={20} color="#10B981" />
                <Text className="text-white font-bold text-lg mt-1">{progress.searches_completed}</Text>
                <Text className="text-gray-400 text-xs">Searches</Text>
              </View>
              <View className="items-center flex-1">
                <Link size={20} color="#3B82F6" />
                <Text className="text-white font-bold text-lg mt-1">{progress.links_visited}</Text>
                <Text className="text-gray-400 text-xs">Links</Text>
              </View>
              <View className="items-center flex-1">
                <BookOpen size={20} color="#8B5CF6" />
                <Text className="text-white font-bold text-lg mt-1">{progress.articles_read}</Text>
                <Text className="text-gray-400 text-xs">Articles</Text>
              </View>
            </View>
            <View className="flex-row justify-between">
              <View className="items-center flex-1">
                <Play size={20} color="#F59E0B" />
                <Text className="text-white font-bold text-lg mt-1">{progress.videos_watched}</Text>
                <Text className="text-gray-400 text-xs">Videos</Text>
              </View>
              <View className="items-center flex-1">
                <ClipboardList size={20} color="#EF4444" />
                <Text className="text-white font-bold text-lg mt-1">{progress.surveys_completed}</Text>
                <Text className="text-gray-400 text-xs">Surveys</Text>
              </View>
              <View className="items-center flex-1">
                <TrendingUp size={20} color="#FFD600" />
                <Text className="text-white font-bold text-lg mt-1">{stats.level_progress}%</Text>
                <Text className="text-gray-400 text-xs">Progress</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Earning Methods */}
        <View className="px-4 mb-4">
          <Text className="text-gray-400 text-sm mb-2">Earning Methods</Text>
          <View className="space-y-3">
            {earningMethods.map((method) => (
              <TouchableOpacity
                key={method.id}
                className={`bg-gray-800 rounded-xl p-4 ${!method.isAvailable ? 'opacity-50' : ''}`}
                onPress={() => handleEarningMethodPress(method)}
                disabled={!method.isAvailable}
                activeOpacity={0.8}
              >
                <View className="flex-row items-center">
                  <View className="bg-yellow-500/20 rounded-full p-3 mr-4">
                    {method.icon}
                  </View>
                  <View className="flex-1">
                    <View className="flex-row items-center mb-1">
                      <Text className="text-white font-semibold text-base">{method.title}</Text>
                      {method.isHot && (
                        <View className="ml-2 bg-red-500/20 px-2 py-1 rounded-full">
                          <Text className="text-red-400 text-xs font-bold">HOT</Text>
                        </View>
                      )}
                      {method.isNew && (
                        <View className="ml-2 bg-green-500/20 px-2 py-1 rounded-full">
                          <Text className="text-green-400 text-xs font-bold">NEW</Text>
                        </View>
                      )}
                    </View>
                    <Text className="text-gray-400 text-sm mb-2">{method.description}</Text>
                    <View className="flex-row items-center justify-between">
                      <View className="flex-row items-center space-x-3">
                        <View className="flex-row items-center">
                          <DollarSign size={14} color="#10B981" />
                          <Text className="text-green-400 text-xs ml-1">{method.reward}</Text>
                        </View>
                        <View className="flex-row items-center">
                          <Clock size={14} color="#6B7280" />
                          <Text className="text-gray-400 text-xs ml-1">{method.timeEstimate}</Text>
                        </View>
                      </View>
                      <View className="flex-row items-center">
                        <View 
                          className="px-2 py-1 rounded-full"
                          style={{ backgroundColor: `${getDifficultyColor(method.difficulty)}20` }}
                        >
                          <Text 
                            className="text-xs font-bold"
                            style={{ color: getDifficultyColor(method.difficulty) }}
                          >
                            {method.difficulty}
                          </Text>
                        </View>
                        <ExternalLink size={16} color="#9CA3AF" className="ml-2" />
                      </View>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Tips Section */}
        <View className="px-4 mb-4">
          <View className="bg-gray-800 rounded-xl p-4">
            <Text className="text-gray-400 text-sm mb-2 font-semibold">💡 Earning Tips:</Text>
            <Text className="text-gray-400 text-xs mb-1">• Complete daily tasks for bonus rewards</Text>
            <Text className="text-gray-400 text-xs mb-1">• Refer friends to earn higher commissions</Text>
            <Text className="text-gray-400 text-xs mb-1">• Watch videos during breaks for passive income</Text>
            <Text className="text-gray-400 text-xs">• Take surveys for the highest earning potential</Text>
          </View>
        </View>

        {/* Spacer for bottom nav */}
        <View className="h-16" />
      </ScrollView>
    </SafeAreaView>
  );
} 
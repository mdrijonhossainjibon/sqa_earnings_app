import React, { useRef, useEffect, useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Animated, 
  Image, 
  Dimensions, 
  StatusBar, 
  RefreshControl,
  Alert,
  ToastAndroid,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Trophy, 
  TrendingUp, 
  UserPlus, 
  Play, 
  Search, 
  BookOpen, 
  Link2, 
  Video, 
  BadgeDollarSign, 
  UserCircle, 
  Settings, 
  Wallet, 
  Coins, 
  Gift, 
  PiggyBank, 
  Users, 
  ArrowRight, 
  Info, 
  Clock, 
  Share2, 
  Star, 
  CheckCircle, 
  PartyPopper, 
  MoreVertical, 
  QrCode,
  AlertCircle,
  Loader,
  Menu,
  LayoutGrid,
  Target,
  Zap,
  Calendar,
  Award,
  CheckSquare,
  ExternalLink
} from 'lucide-react-native';

import BalanceCard from '../components/home/BalanceCard';
import EarningsCards from '../components/home/EarningsCards';
import { API_CALL } from '../lib/api';
import { getItem } from '../asyncStorage';

// Types
interface User {
  name: string;
  totalPoints: number;
  totalEarned: number;
  level: number;
  avatar?: string;
  email?: string;
}

interface EarningsData {
  totalEarned: number;
  referralEarnings: number;
  lastEarned: string;
  todayEarnings: number;
}

interface Task {
  id: number;
  title: string;
  description: string;
  points: number;
  progress: number;
  maxProgress: number;
  category: string;
  icon: any;
  timeEstimate: string;
  isCompleted: boolean;
  isAvailable: boolean;
}

interface DailyReward {
  day: number;
  points: number;
  isClaimed: boolean;
  isToday: boolean;
}

export default function HomeScreen({ navigation }: any) {
  // State
  const [user, setUser] = useState<User>({ name: 'User', totalPoints: 0, totalEarned: 0, level: 1 });
  const [earnings, setEarnings] = useState<EarningsData>({
    totalEarned: 0,
    referralEarnings: 0,
    lastEarned: 'Never',
    todayEarnings: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Task-related state
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      title: 'Watch 5 Videos',
      description: 'Watch short videos to earn points',
      points: 50,
      progress: 3,
      maxProgress: 5,
      category: 'videos',
      icon: <Play size={20} color="#FFD600" />,
      timeEstimate: '10 min',
      isCompleted: false,
      isAvailable: true
    },
    {
      id: 2,
      title: 'Read 3 Articles',
      description: 'Read interesting articles and earn rewards',
      points: 75,
      progress: 2,
      maxProgress: 3,
      category: 'reading',
      icon: <BookOpen size={20} color="#FFD600" />,
      timeEstimate: '15 min',
      isCompleted: false,
      isAvailable: true
    },
    {
      id: 3,
      title: 'Complete 2 Surveys',
      description: 'Share your opinion and earn points',
      points: 100,
      progress: 1,
      maxProgress: 2,
      category: 'surveys',
      icon: <Search size={20} color="#FFD600" />,
      timeEstimate: '20 min',
      isCompleted: false,
      isAvailable: true
    },
    {
      id: 4,
      title: 'Visit 3 Links',
      description: 'Visit sponsored links to earn points',
      points: 30,
      progress: 0,
      maxProgress: 3,
      category: 'links',
      icon: <Link2 size={20} color="#FFD600" />,
      timeEstimate: '5 min',
      isCompleted: false,
      isAvailable: true
    },
    {
      id: 5,
      title: 'Daily Login',
      description: 'Log in today to earn bonus points',
      points: 25,
      progress: 1,
      maxProgress: 1,
      category: 'login',
      icon: <Calendar size={20} color="#FFD600" />,
      timeEstimate: '1 min',
      isCompleted: true,
      isAvailable: true
    }
  ]);

  const [dailyRewards, setDailyRewards] = useState<DailyReward[]>([
    { day: 1, points: 50, isClaimed: true, isToday: false },
    { day: 2, points: 75, isClaimed: true, isToday: false },
    { day: 3, points: 100, isClaimed: true, isToday: false },
    { day: 4, points: 125, isClaimed: false, isToday: true },
    { day: 5, points: 150, isClaimed: false, isToday: false },
    { day: 6, points: 200, isClaimed: false, isToday: false },
    { day: 7, points: 500, isClaimed: false, isToday: false }
  ]);

  // Animations
  const progressAnim = useRef(new Animated.Value(0)).current;
  const bounceAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const taskProgressAnim = useRef(new Animated.Value(0)).current;

  // Toast function
  const showToast = (message: string) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      Alert.alert('Info', message);
    }
  };

  // Fetch user data
  const fetchUserData = useCallback(async () => {
    try {
      const token = await getItem<string>('token');
      if (!token) {
        setError('No authentication token found');
        return;
      }

      const { response, status } = await API_CALL({
        apiVersionUrl: 'barong',
        url: '/api/mobile/user/profile',
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log(response)

      if (status === 200 && response) {
        setUser({
          name: (response as any).name || 'User',
          totalPoints: (response as any).total_points || 0,
          totalEarned: (response as any).total_earned || 0,
          level: (response as any).level || 1,
          avatar: (response as any).avatar,
          email: (response as any).email
        });
        setError(null);
      } else {
        setError('Failed to fetch user data');
      }
    } catch (error: any) {
      setError(error.message || 'Failed to fetch user data');
      showToast('Failed to load user data');
    }
  }, []);

  // Fetch earnings data
  const fetchEarningsData = useCallback(async () => {
    try {
      const token = await getItem<string>('token');
      if (!token) return;

      const { response, status } = await API_CALL({
        apiVersionUrl: 'barong',
        url: '/api/mobile/earnings',
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (status === 200 && response) {
        setEarnings({
          totalEarned: (response as any).total_earned || 0,
          referralEarnings: (response as any).referral_earnings || 0,
          lastEarned: (response as any).last_earned || 'Never',
          todayEarnings: (response as any).today_earnings || 0
        });
      }
    } catch (error: any) {
      console.log('Failed to fetch earnings:', error.message);
    }
  }, []);

  // Load all data
  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        fetchUserData(),
        fetchEarningsData()
      ]);
    } catch (error) {
      console.log('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [fetchUserData, fetchEarningsData]);

  // Pull to refresh
  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        fetchUserData(),
        fetchEarningsData()
      ]);
      showToast('Data refreshed!');
    } catch (error) {
      showToast('Failed to refresh data');
    } finally {
      setIsRefreshing(false);
    }
  }, [fetchUserData, fetchEarningsData]);

  // Load data on mount
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Animate progress bar
  useEffect(() => {
    const progress = (user.totalPoints % 1000) / 10; // Progress to next level
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 800,
      useNativeDriver: false,
    }).start();
  }, [user.totalPoints, progressAnim]);

  // Animate level badge
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, { toValue: 1.15, duration: 400, useNativeDriver: true }),
        Animated.timing(bounceAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
      ])
    ).start();
  }, [bounceAnim]);

  // Fade in animation
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  // Animate task progress
  useEffect(() => {
    Animated.timing(taskProgressAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [taskProgressAnim]);

  // Handle press animations
  const handlePressIn = () => {
    Animated.spring(scaleAnim, { toValue: 0.97, useNativeDriver: true }).start();
  };
  const handlePressOut = () => {
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();
  };

  // Calculate derived values
  const balance = (user.totalPoints || 0) / 100;
  const level = user.level || 1;
  const progress = (user.totalPoints % 1000) / 10;
  const totalEarnedDisplay = typeof user.totalEarned === 'number' ? (user.totalEarned / 100).toFixed(2) : '0.00';
  const referralEarningsDisplay = typeof earnings.referralEarnings === 'number' ? (earnings.referralEarnings / 100).toFixed(2) : '0.00';

  // Task calculations
  const completedTasks = tasks.filter(task => task.isCompleted).length;
  const totalTasks = tasks.length;
  const totalPoints = tasks.reduce((sum, task) => sum + task.points, 0);
  const earnedPoints = tasks.filter(task => task.isCompleted).reduce((sum, task) => sum + task.points, 0);

  // Handle task press
  const handleTaskPress = (task: Task) => {
    if (task.isCompleted) {
      showToast('Task already completed!');
      return;
    }

    if (!task.isAvailable) {
      showToast('Task not available at the moment.');
      return;
    }

    // Navigate to appropriate screen based on task category
    switch (task.category) {
      case 'videos':
        navigation.navigate('WatchVideos');
        break;
      case 'reading':
        navigation.navigate('ReadingAndEarn');
        break;
      case 'surveys':
        navigation.navigate('SearchEarn');
        break;
      case 'links':
        navigation.navigate('VisitLinkEarn');
        break;
      case 'referral':
        navigation.navigate('ReferFriend');
        break;
      default:
        showToast(`Starting ${task.title}...`);
    }
  };

  // Handle daily reward claim
  const handleDailyRewardClaim = (day: number) => {
    const reward = dailyRewards.find(r => r.day === day);
    if (reward && !reward.isClaimed && reward.isToday) {
      setDailyRewards(prev => 
        prev.map(r => r.day === day ? { ...r, isClaimed: true } : r)
      );
      showToast(`🎉 You earned ${reward.points} points!`);
    }
  };

  // Get progress percentage
  const getProgressPercentage = (progress: number, maxProgress: number) => {
    return (progress / maxProgress) * 100;
  };

  // Loading state
  if (isLoading) {
    return (
      <View className="flex-1 bg-gray-900 justify-center items-center">
        <StatusBar barStyle="light-content" backgroundColor="#111827" translucent={false} />
        <Loader size={48} color="#FFD600" />
        <Text className="text-white mt-4 text-lg">Loading your dashboard...</Text>
      </View>
    );
  }

  // Error state
  if (error) {
    return (
      <View className="flex-1 bg-gray-900 justify-center items-center px-6">
        <StatusBar barStyle="light-content" backgroundColor="#111827" translucent={false} />
        <AlertCircle size={64} color="#EF4444" />
        <Text className="text-white mt-4 text-lg text-center font-semibold">Something went wrong</Text>
        <Text className="text-gray-400 mt-2 text-center">{error}</Text>
        <TouchableOpacity 
          className="bg-yellow-400 px-6 py-3 rounded-lg mt-6"
          onPress={loadData}
          activeOpacity={0.8}
        >
          <Text className="text-gray-900 font-semibold">Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-900">
      <StatusBar barStyle="light-content" backgroundColor="#111827" translucent={false} />
      <SafeAreaView edges={['top']} className="bg-gray-900">
        <View className="flex-row items-center justify-between px-4 pt-2 pb-2 bg-gray-900">
          <TouchableOpacity 
            activeOpacity={0.7} 
            onPress={() => navigation.openDrawer && navigation.openDrawer()}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
          >
            <LayoutGrid size={26} color="#fff"/>
          </TouchableOpacity>
         
          <View className="flex-row items-center gap-3">
            <TouchableOpacity 
              activeOpacity={0.7} 
              onPress={() => navigation.navigate('QRScan')}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              className="p-2 bg-yellow-400/20 rounded-full"
            >
              <QrCode size={20} color="#FFD600" />
            </TouchableOpacity>
            <TouchableOpacity 
              activeOpacity={0.7} 
              onPress={() => navigation.navigate('Profile')}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
            >
              <Image
                source={{ 
                  uri: user.avatar || 'https://randomuser.me/api/portraits/men/32.jpg' 
                }}
                style={{ 
                  width: 32, 
                  height: 32, 
                  borderRadius: 16, 
                  borderWidth: 2, 
                  borderColor: '#FFD600' 
                }}
              />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
      
      <ScrollView 
        className="flex-1" 
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor="#FFD600"
            colors={["#FFD600"]}
          />
        }
      >
        <Animated.View style={{ opacity: fadeAnim }}>
          
          {/* Balance Card */}
          <View className="bg-gray-800 mx-2 rounded-xl mb-2 mt-8">
            <BalanceCard 
              balance={balance} 
              level={level} 
              progressAnim={progressAnim} 
              progress={progress} 
              bounceAnim={bounceAnim} 
              onWithdraw={() => navigation.navigate('Wallet')} 
            />
          </View>
          
          {/* Divider */}
          <View className="mx-4 my-4 h-0.5 bg-gray-700 rounded-full" />
          
          {/* Earnings Section Header */}
          <View className="flex-row items-center gap-2 mx-4 mb-2">
            <PiggyBank size={20} color="#FFD600" />
            <Text className="text-lg font-bold text-yellow-400">Earnings</Text>
            {earnings.todayEarnings > 0 && (
              <View className="ml-auto bg-green-500/20 px-2 py-1 rounded-full">
                <Text className="text-green-400 text-xs font-semibold">
                  +${(earnings.todayEarnings / 100).toFixed(2)} today
                </Text>
              </View>
            )}
          </View>
          
          {/* Earnings Cards */}
          <View className="bg-gray-800 mx-2 rounded-xl mb-2">
            <EarningsCards 
              user={user} 
              totalEarnedDisplay={totalEarnedDisplay} 
              referralEarnings={earnings.referralEarnings} 
              referralEarningsDisplay={referralEarningsDisplay} 
            />
          </View>

          {/* JumpTask Section */}
          <View className="mx-4 mt-6 mb-4">
            <View className="flex-row items-center justify-between mb-4">
              <View className="flex-row items-center gap-2">
                <Target size={24} color="#FFD600" />
                <Text className="text-xl font-bold text-white">Daily Tasks</Text>
              </View>
              <TouchableOpacity 
                onPress={() => navigation.navigate('Task')}
                className="bg-yellow-400/20 px-3 py-1 rounded-full"
              >
                <Text className="text-yellow-400 text-sm font-semibold">View All</Text>
              </TouchableOpacity>
            </View>

            {/* Task Progress Card */}
            <View className="bg-gray-800 rounded-xl p-4 mb-4">
              <View className="flex-row items-center justify-between mb-3">
                <View className="flex-row items-center">
                  <CheckSquare size={20} color="#FFD600" />
                  <Text className="text-white font-semibold ml-2">Progress</Text>
                </View>
                <View className="bg-yellow-500 px-3 py-1 rounded-full">
                  <Text className="text-black font-bold text-sm">{completedTasks}/{totalTasks}</Text>
                </View>
              </View>
              
              {/* Progress Bar */}
              <View className="bg-gray-700 rounded-full h-3 mb-3">
                <Animated.View 
                  className="bg-yellow-500 rounded-full h-3"
                  style={{
                    width: taskProgressAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0%', `${(completedTasks / totalTasks) * 100}%`]
                    })
                  }}
                />
              </View>
              
              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="text-gray-400 text-xs">Points Earned</Text>
                  <Text className="text-white font-bold text-lg">{earnedPoints}</Text>
                </View>
                <View>
                  <Text className="text-gray-400 text-xs">Total Available</Text>
                  <Text className="text-white font-bold text-lg">{totalPoints}</Text>
                </View>
                <View>
                  <Text className="text-gray-400 text-xs">Completion</Text>
                  <Text className="text-white font-bold text-lg">{Math.round((completedTasks / totalTasks) * 100)}%</Text>
                </View>
              </View>
            </View>

            {/* Quick Tasks */}
            <View className="space-y-3 gap-2">
              {tasks.slice(0, 3).map((task) => (
                <TouchableOpacity
                  key={task.id}
                  className="bg-gray-800 rounded-xl p-4"
                  onPress={() => handleTaskPress(task)}
                  activeOpacity={0.8}
                >
                  <View className="flex-row items-start">
                    <View className="mr-3 mt-1">
                      {task.isCompleted ? (
                        <CheckCircle size={20} color="#10B981" />
                      ) : (
                        task.icon
                      )}
                    </View>
                    
                    <View className="flex-1">
                      <View className="flex-row items-center justify-between mb-2">
                        <Text className={`font-semibold text-base ${
                          task.isCompleted ? 'text-green-500' : 'text-white'
                        }`}>
                          {task.title}
                        </Text>
                        <View className="flex-row items-center">
                          <Star size={16} color="#FFD600" />
                          <Text className="text-yellow-500 font-bold ml-1">{task.points}</Text>
                        </View>
                      </View>
                      
                      <Text className="text-gray-400 text-sm mb-2">{task.description}</Text>
                      
                      {/* Progress Bar */}
                      <View className="bg-gray-700 rounded-full h-2 mb-2">
                        <View 
                          className="bg-yellow-500 rounded-full h-2"
                          style={{ width: `${getProgressPercentage(task.progress, task.maxProgress)}%` }}
                        />
                      </View>
                      
                      <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center">
                          <Clock size={14} color="#9CA3AF" />
                          <Text className="text-gray-400 text-xs ml-1">{task.timeEstimate}</Text>
                        </View>
                        <Text className="text-gray-400 text-xs">
                          {task.progress}/{task.maxProgress}
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>

          
           
          </View>
        
        </Animated.View>
      </ScrollView>
    </View>
  );
} 
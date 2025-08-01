import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StatusBar, Animated, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, CheckCircle, Circle, Clock, Star, Gift, TrendingUp, Play, BookOpen, Search, Link2, Users, Target, Award, Calendar, RefreshCw, Zap } from 'lucide-react-native';

// Mock task data
const mockTasks = [
  {
    id: 1,
    title: 'Watch 5 Videos',
    description: 'Watch short videos to earn points',
    points: 50,
    progress: 3,
    maxProgress: 5,
    category: 'videos',
    icon: <Play size={24} color="#FFD600" />,
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
    icon: <BookOpen size={24} color="#FFD600" />,
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
    icon: <Search size={24} color="#FFD600" />,
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
    icon: <Link2 size={24} color="#FFD600" />,
    timeEstimate: '5 min',
    isCompleted: false,
    isAvailable: true
  },
  {
    id: 5,
    title: 'Invite 1 Friend',
    description: 'Invite friends and earn bonus points',
    points: 200,
    progress: 0,
    maxProgress: 1,
    category: 'referral',
    icon: <Users size={24} color="#FFD600" />,
    timeEstimate: '2 min',
    isCompleted: false,
    isAvailable: true
  },
  {
    id: 6,
    title: 'Daily Login',
    description: 'Log in today to earn bonus points',
    points: 25,
    progress: 1,
    maxProgress: 1,
    category: 'login',
    icon: <Calendar size={24} color="#FFD600" />,
    timeEstimate: '1 min',
    isCompleted: true,
    isAvailable: true
  }
];

const taskCategories = [
  {
    id: 'all',
    title: 'All Tasks',
    count: mockTasks.length,
    icon: <Target size={24} color="#FFD600" />
  },
  {
    id: 'videos',
    title: 'Videos',
    count: mockTasks.filter(task => task.category === 'videos').length,
    icon: <Play size={24} color="#FFD600" />
  },
  {
    id: 'reading',
    title: 'Reading',
    count: mockTasks.filter(task => task.category === 'reading').length,
    icon: <BookOpen size={24} color="#FFD600" />
  },
  {
    id: 'surveys',
    title: 'Surveys',
    count: mockTasks.filter(task => task.category === 'surveys').length,
    icon: <Search size={24} color="#FFD600" />
  },
  {
    id: 'links',
    title: 'Links',
    count: mockTasks.filter(task => task.category === 'links').length,
    icon: <Link2 size={24} color="#FFD600" />
  },
  {
    id: 'referral',
    title: 'Referrals',
    count: mockTasks.filter(task => task.category === 'referral').length,
    icon: <Users size={24} color="#FFD600" />
  }
];

const dailyRewards = [
  {
    day: 1,
    points: 50,
    isClaimed: true,
    isToday: false
  },
  {
    day: 2,
    points: 75,
    isClaimed: true,
    isToday: false
  },
  {
    day: 3,
    points: 100,
    isClaimed: true,
    isToday: false
  },
  {
    day: 4,
    points: 125,
    isClaimed: false,
    isToday: true
  },
  {
    day: 5,
    points: 150,
    isClaimed: false,
    isToday: false
  },
  {
    day: 6,
    points: 200,
    isClaimed: false,
    isToday: false
  },
  {
    day: 7,
    points: 500,
    isClaimed: false,
    isToday: false
  }
];

export default function TaskScreen({ navigation }: any) {
  const [tasks, setTasks] = useState(mockTasks);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [dailyRewardData, setDailyRewardData] = useState(dailyRewards);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();

    // Animate progress bars
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, []);

  const filteredTasks = tasks.filter(task => {
    return selectedCategory === 'all' || task.category === selectedCategory;
  });

  const completedTasks = tasks.filter(task => task.isCompleted).length;
  const totalTasks = tasks.length;
  const totalPoints = tasks.reduce((sum, task) => sum + task.points, 0);
  const earnedPoints = tasks.filter(task => task.isCompleted).reduce((sum, task) => sum + task.points, 0);

  const handleTaskPress = (task: any) => {
    if (task.isCompleted) {
      Alert.alert('Task Completed', 'This task has already been completed!');
      return;
    }

    if (!task.isAvailable) {
      Alert.alert('Task Unavailable', 'This task is not available at the moment.');
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
        Alert.alert('Task', `Starting ${task.title}...`);
    }
  };

  const handleDailyRewardClaim = (day: number) => {
    const reward = dailyRewardData.find(r => r.day === day);
    if (reward && !reward.isClaimed && reward.isToday) {
      setDailyRewardData(prev => 
        prev.map(r => r.day === day ? { ...r, isClaimed: true } : r)
      );
      Alert.alert('Reward Claimed!', `You earned ${reward.points} points!`);
    }
  };

  const handleRefreshTasks = () => {
    Alert.alert('Refresh Tasks', 'Tasks will refresh at midnight. Keep completing tasks to earn more points!');
  };

  const getProgressPercentage = (progress: number, maxProgress: number) => {
    return (progress / maxProgress) * 100;
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
          <Text className="text-xl font-bold text-white">Daily Tasks</Text>
          <TouchableOpacity 
            activeOpacity={0.7}
            onPress={handleRefreshTasks}
          >
            <RefreshCw size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <Animated.View style={{ opacity: fadeAnim }}>
          {/* Progress Header */}
          <View className="bg-gray-800 mx-4 mt-4 rounded-xl p-4">
            <View className="flex-row items-center justify-between mb-3">
              <View className="flex-row items-center">
                <Target size={24} color="#FFD600" />
                <Text className="text-lg font-bold text-white ml-2">Daily Progress</Text>
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
                  width: progressAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', `${(completedTasks / totalTasks) * 100}%`]
                  })
                }}
              />
            </View>
            
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-gray-400 text-sm">Points Earned</Text>
                <Text className="text-white font-bold text-lg">{earnedPoints}</Text>
              </View>
              <View>
                <Text className="text-gray-400 text-sm">Total Available</Text>
                <Text className="text-white font-bold text-lg">{totalPoints}</Text>
              </View>
              <View>
                <Text className="text-gray-400 text-sm">Completion</Text>
                <Text className="text-white font-bold text-lg">{Math.round((completedTasks / totalTasks) * 100)}%</Text>
              </View>
            </View>
          </View>

          {/* Daily Rewards */}
          <View className="mx-4 mt-6">
            <Text className="text-lg font-bold text-white mb-4">Daily Login Rewards</Text>
            <View className="bg-gray-800 rounded-xl p-4">
              <View className="flex-row justify-between mb-3">
                <Text className="text-gray-400 text-sm">Login for 7 days to earn bonus rewards!</Text>
                <Gift size={20} color="#FFD600" />
              </View>
              <View className="flex-row justify-between">
                {dailyRewardData.map((reward) => (
                  <TouchableOpacity
                    key={reward.day}
                    className={`w-10 h-10 rounded-full items-center justify-center ${
                      reward.isClaimed ? 'bg-green-500' : 
                      reward.isToday ? 'bg-yellow-500' : 'bg-gray-700'
                    }`}
                    onPress={() => handleDailyRewardClaim(reward.day)}
                    disabled={!reward.isToday || reward.isClaimed}
                  >
                    {reward.isClaimed ? (
                      <CheckCircle size={16} color="#fff" />
                    ) : (
                      <Text className={`text-xs font-bold ${
                        reward.isToday ? 'text-black' : 'text-white'
                      }`}>
                        {reward.day}
                      </Text>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
              <Text className="text-gray-400 text-xs text-center mt-2">
                Day {dailyRewardData.find(r => r.isToday)?.day || 1} of 7
              </Text>
            </View>
          </View>

          {/* Task Categories */}
          <View className="mx-4 mt-6">
            <Text className="text-lg font-bold text-white mb-4">Task Categories</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
              {taskCategories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  className={`px-4 py-3 rounded-xl mr-3 min-w-[100px] ${
                    selectedCategory === category.id ? 'bg-yellow-500' : 'bg-gray-800'
                  }`}
                  onPress={() => setSelectedCategory(category.id)}
                >
                  <View className="items-center">
                    {category.icon}
                    <Text
                      className={`font-semibold text-sm mt-1 text-center ${
                        selectedCategory === category.id ? 'text-black' : 'text-white'
                      }`}
                    >
                      {category.title}
                    </Text>
                    <Text
                      className={`text-xs mt-1 ${
                        selectedCategory === category.id ? 'text-black' : 'text-gray-400'
                      }`}
                    >
                      {category.count} tasks
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Tasks List */}
          <View className="mx-4 mb-6">
            <Text className="text-lg font-bold text-white mb-4">
              {selectedCategory === 'all' ? 'All Tasks' : taskCategories.find(c => c.id === selectedCategory)?.title}
            </Text>
            
            {filteredTasks.length === 0 ? (
              <View className="bg-gray-800 rounded-xl p-8 items-center">
                <Target size={48} color="#6B7280" />
                <Text className="text-gray-400 text-lg font-semibold mt-4">No tasks available</Text>
                <Text className="text-gray-500 text-sm text-center mt-2">
                  Try selecting a different category or check back later
                </Text>
              </View>
            ) : (
              filteredTasks.map((task) => (
                <TouchableOpacity
                  key={task.id}
                  className={`bg-gray-800 rounded-xl p-4 mb-3 ${
                    task.isCompleted ? 'border-l-4 border-green-500' : ''
                  }`}
                  onPress={() => handleTaskPress(task)}
                  activeOpacity={0.8}
                >
                  <View className="flex-row items-start">
                    <View className="mr-3 mt-1">
                      {task.isCompleted ? (
                        <CheckCircle size={24} color="#10B981" />
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
                      
                      <Text className="text-gray-400 text-sm mb-3">{task.description}</Text>
                      
                      {/* Progress Bar */}
                      <View className="bg-gray-700 rounded-full h-2 mb-2">
                        <View 
                          className="bg-yellow-500 rounded-full h-2"
                          style={{ width: `${getProgressPercentage(task.progress, task.maxProgress)}%` }}
                        />
                      </View>
                      
                      <View className="flex-row items-center justify-between">
                        <Text className="text-gray-400 text-xs">
                          {task.progress}/{task.maxProgress} completed
                        </Text>
                        <View className="flex-row items-center">
                          <Clock size={12} color="#9CA3AF" />
                          <Text className="text-gray-400 text-xs ml-1">{task.timeEstimate}</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </View>

          {/* Quick Actions */}
          <View className="mx-4 mb-6">
            <Text className="text-lg font-bold text-white mb-4">Quick Actions</Text>
            <View className="bg-gray-800 rounded-xl p-4">
              <TouchableOpacity
                className="flex-row items-center justify-between p-3 bg-gray-700 rounded-lg mb-3"
                onPress={() => navigation.navigate('EarningMethods')}
                activeOpacity={0.8}
              >
                <View className="flex-row items-center">
                  <TrendingUp size={20} color="#FFD600" />
                  <Text className="text-white font-semibold ml-3">View All Earning Methods</Text>
                </View>
                <ArrowLeft size={20} color="#9CA3AF" style={{ transform: [{ rotate: '180deg' }] }} />
              </TouchableOpacity>
              
              <TouchableOpacity
                className="flex-row items-center justify-between p-3 bg-gray-700 rounded-lg mb-3"
                onPress={() => navigation.navigate('Reward')}
                activeOpacity={0.8}
              >
                <View className="flex-row items-center">
                  <Gift size={20} color="#FFD600" />
                  <Text className="text-white font-semibold ml-3">Claim Rewards</Text>
                </View>
                <ArrowLeft size={20} color="#9CA3AF" style={{ transform: [{ rotate: '180deg' }] }} />
              </TouchableOpacity>
              
              <TouchableOpacity
                className="flex-row items-center justify-between p-3 bg-gray-700 rounded-lg"
                onPress={() => navigation.navigate('Leaderboard')}
                activeOpacity={0.8}
              >
                <View className="flex-row items-center">
                  <Award size={20} color="#FFD600" />
                  <Text className="text-white font-semibold ml-3">View Leaderboard</Text>
                </View>
                <ArrowLeft size={20} color="#9CA3AF" style={{ transform: [{ rotate: '180deg' }] }} />
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
} 
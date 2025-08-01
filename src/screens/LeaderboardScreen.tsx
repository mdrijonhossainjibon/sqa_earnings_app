import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StatusBar, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Trophy, Medal, Crown, Star, TrendingUp, ArrowLeft, Users, Award, Target } from 'lucide-react-native';

// Mock leaderboard data
const mockLeaderboardData = [
  {
    id: 1,
    name: 'Sarah Johnson',
    avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
    points: 15420,
    rank: 1,
    level: 15,
    isCurrentUser: false,
    badge: 'crown'
  },
  {
    id: 2,
    name: 'Mike Chen',
    avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
    points: 12850,
    rank: 2,
    level: 12,
    isCurrentUser: false,
    badge: 'medal'
  },
  {
    id: 3,
    name: 'Emma Davis',
    avatar: 'https://randomuser.me/api/portraits/women/3.jpg',
    points: 11200,
    rank: 3,
    level: 11,
    isCurrentUser: false,
    badge: 'medal'
  },
  {
    id: 4,
    name: 'John Doe',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    points: 8900,
    rank: 4,
    level: 8,
    isCurrentUser: true,
    badge: 'star'
  },
  {
    id: 5,
    name: 'Lisa Wang',
    avatar: 'https://randomuser.me/api/portraits/women/5.jpg',
    points: 7650,
    rank: 5,
    level: 7,
    isCurrentUser: false,
    badge: 'star'
  },
  {
    id: 6,
    name: 'Alex Rodriguez',
    avatar: 'https://randomuser.me/api/portraits/men/6.jpg',
    points: 6800,
    rank: 6,
    level: 6,
    isCurrentUser: false,
    badge: 'star'
  },
  {
    id: 7,
    name: 'Maria Garcia',
    avatar: 'https://randomuser.me/api/portraits/women/7.jpg',
    points: 5900,
    rank: 7,
    level: 5,
    isCurrentUser: false,
    badge: 'star'
  },
  {
    id: 8,
    name: 'David Kim',
    avatar: 'https://randomuser.me/api/portraits/men/8.jpg',
    points: 5200,
    rank: 8,
    level: 5,
    isCurrentUser: false,
    badge: 'star'
  },
  {
    id: 9,
    name: 'Anna Smith',
    avatar: 'https://randomuser.me/api/portraits/women/9.jpg',
    points: 4800,
    rank: 9,
    level: 4,
    isCurrentUser: false,
    badge: 'star'
  },
  {
    id: 10,
    name: 'Tom Wilson',
    avatar: 'https://randomuser.me/api/portraits/men/10.jpg',
    points: 4200,
    rank: 10,
    level: 4,
    isCurrentUser: false,
    badge: 'star'
  }
];

const getBadgeIcon = (badge: string, size: number = 20) => {
  switch (badge) {
    case 'crown':
      return <Crown size={size} color="#FFD700" />;
    case 'medal':
      return <Medal size={size} color="#C0C0C0" />;
    case 'star':
      return <Star size={size} color="#FFD600" />;
    default:
      return <Star size={size} color="#FFD600" />;
  }
};

const getRankColor = (rank: number) => {
  switch (rank) {
    case 1:
      return '#FFD700';
    case 2:
      return '#C0C0C0';
    case 3:
      return '#CD7F32';
    default:
      return '#6B7280';
  }
};

export default function LeaderboardScreen({ navigation }: any) {
  const [selectedPeriod, setSelectedPeriod] = useState('weekly');
  const [currentUserRank, setCurrentUserRank] = useState(4);
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const periods = [
    { key: 'daily', label: 'Daily' },
    { key: 'weekly', label: 'Weekly' },
    { key: 'monthly', label: 'Monthly' },
    { key: 'allTime', label: 'All Time' }
  ];

  const currentUser = mockLeaderboardData.find(user => user.isCurrentUser);

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
          <Text className="text-xl font-bold text-white">Leaderboard</Text>
          <View className="w-10" />
        </View>
      </SafeAreaView>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <Animated.View style={{ opacity: fadeAnim }}>
          {/* Header Stats */}
          <View className="bg-gray-800 mx-4 mt-4 rounded-xl p-4">
            <View className="flex-row items-center justify-between mb-4">
              <View className="flex-row items-center">
                <Trophy size={24} color="#FFD600" />
                <Text className="text-lg font-bold text-white ml-2">Your Ranking</Text>
              </View>
              <View className="bg-yellow-500 px-3 py-1 rounded-full">
                <Text className="text-black font-bold text-sm">#{currentUserRank}</Text>
              </View>
            </View>
            
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-gray-400 text-sm">Total Points</Text>
                <Text className="text-white font-bold text-lg">{currentUser?.points.toLocaleString()}</Text>
              </View>
              <View>
                <Text className="text-gray-400 text-sm">Level</Text>
                <Text className="text-white font-bold text-lg">{currentUser?.level}</Text>
              </View>
              <View>
                <Text className="text-gray-400 text-sm">Points to Next</Text>
                <Text className="text-white font-bold text-lg">1,100</Text>
              </View>
            </View>
          </View>

          {/* Period Selector */}
          <View className="mx-4 mt-4">
            <Text className="text-white font-semibold mb-3">Leaderboard Period</Text>
            <View className="flex-row bg-gray-800 rounded-xl p-1">
              {periods.map((period) => (
                <TouchableOpacity
                  key={period.key}
                  className={`flex-1 py-2 px-3 rounded-lg ${
                    selectedPeriod === period.key ? 'bg-yellow-500' : 'bg-transparent'
                  }`}
                  onPress={() => setSelectedPeriod(period.key)}
                >
                  <Text
                    className={`text-center font-medium text-sm ${
                      selectedPeriod === period.key ? 'text-black' : 'text-gray-400'
                    }`}
                  >
                    {period.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Top 3 Podium */}
          <View className="mx-4 mt-6">
            <Text className="text-white font-semibold mb-4">Top Performers</Text>
            <View className="flex-row items-end justify-center space-x-2">
              {/* 2nd Place */}
              <View className="items-center">
                <View className="bg-gray-700 rounded-t-xl p-3 mb-2 w-20 h-24 justify-center items-center">
                  <Image
                    source={{ uri: mockLeaderboardData[1].avatar }}
                    className="w-12 h-12 rounded-full mb-1"
                  />
                  <Text className="text-white text-xs font-medium text-center" numberOfLines={1}>
                    {mockLeaderboardData[1].name}
                  </Text>
                </View>
                <View className="bg-gray-600 rounded-xl p-2 w-20 items-center">
                  <Medal size={16} color="#C0C0C0" />
                  <Text className="text-white font-bold text-sm">#{mockLeaderboardData[1].rank}</Text>
                  <Text className="text-gray-300 text-xs">{mockLeaderboardData[1].points.toLocaleString()}</Text>
                </View>
              </View>

              {/* 1st Place */}
              <View className="items-center">
                <View className="bg-yellow-500 rounded-t-xl p-3 mb-2 w-24 h-32 justify-center items-center">
                  <Crown size={20} color="#000" className="mb-1" />
                  <Image
                    source={{ uri: mockLeaderboardData[0].avatar }}
                    className="w-14 h-14 rounded-full mb-1"
                  />
                  <Text className="text-black text-xs font-bold text-center" numberOfLines={1}>
                    {mockLeaderboardData[0].name}
                  </Text>
                </View>
                <View className="bg-yellow-400 rounded-xl p-2 w-24 items-center">
                  <Crown size={16} color="#000" />
                  <Text className="text-black font-bold text-sm">#{mockLeaderboardData[0].rank}</Text>
                  <Text className="text-black text-xs">{mockLeaderboardData[0].points.toLocaleString()}</Text>
                </View>
              </View>

              {/* 3rd Place */}
              <View className="items-center">
                <View className="bg-gray-700 rounded-t-xl p-3 mb-2 w-20 h-20 justify-center items-center">
                  <Image
                    source={{ uri: mockLeaderboardData[2].avatar }}
                    className="w-10 h-10 rounded-full mb-1"
                  />
                  <Text className="text-white text-xs font-medium text-center" numberOfLines={1}>
                    {mockLeaderboardData[2].name}
                  </Text>
                </View>
                <View className="bg-gray-600 rounded-xl p-2 w-20 items-center">
                  <Medal size={16} color="#CD7F32" />
                  <Text className="text-white font-bold text-sm">#{mockLeaderboardData[2].rank}</Text>
                  <Text className="text-gray-300 text-xs">{mockLeaderboardData[2].points.toLocaleString()}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Full Leaderboard List */}
          <View className="mx-4 mt-6">
            <Text className="text-white font-semibold mb-4">Full Rankings</Text>
            <View className="bg-gray-800 rounded-xl overflow-hidden">
              {mockLeaderboardData.map((user, index) => (
                <View
                  key={user.id}
                  className={`flex-row items-center p-4 ${
                    user.isCurrentUser ? 'bg-yellow-500/20 border-l-4 border-yellow-500' : ''
                  } ${index !== mockLeaderboardData.length - 1 ? 'border-b border-gray-700' : ''}`}
                >
                  {/* Rank */}
                  <View className="w-8 items-center">
                    <Text
                      className={`font-bold text-lg ${
                        user.isCurrentUser ? 'text-yellow-500' : 'text-gray-400'
                      }`}
                    >
                      #{user.rank}
                    </Text>
                  </View>

                  {/* Badge */}
                  <View className="mx-3">
                    {getBadgeIcon(user.badge)}
                  </View>

                  {/* Avatar */}
                  <Image
                    source={{ uri: user.avatar }}
                    className="w-12 h-12 rounded-full"
                  />

                  {/* User Info */}
                  <View className="flex-1 ml-3">
                    <Text
                      className={`font-semibold ${
                        user.isCurrentUser ? 'text-yellow-500' : 'text-white'
                      }`}
                    >
                      {user.name}
                    </Text>
                    <Text className="text-gray-400 text-sm">Level {user.level}</Text>
                  </View>

                  {/* Points */}
                  <View className="items-end">
                    <Text
                      className={`font-bold text-lg ${
                        user.isCurrentUser ? 'text-yellow-500' : 'text-white'
                      }`}
                    >
                      {user.points.toLocaleString()}
                    </Text>
                    <Text className="text-gray-400 text-xs">points</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Achievement Section */}
          <View className="mx-4 mt-6 mb-6">
            <Text className="text-white font-semibold mb-4">Recent Achievements</Text>
            <View className="bg-gray-800 rounded-xl p-4">
              <View className="flex-row items-center mb-3">
                <Award size={20} color="#FFD600" />
                <Text className="text-white font-medium ml-2">Top 10 Finisher</Text>
              </View>
              <View className="flex-row items-center mb-3">
                <Target size={20} color="#10B981" />
                <Text className="text-white font-medium ml-2">Daily Goal Master</Text>
              </View>
              <View className="flex-row items-center">
                <TrendingUp size={20} color="#3B82F6" />
                <Text className="text-white font-medium ml-2">Streak Champion</Text>
              </View>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
} 
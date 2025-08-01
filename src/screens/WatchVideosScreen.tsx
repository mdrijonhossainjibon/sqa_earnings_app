import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, ScrollView, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Play, Clock, Gift, Info, DollarSign, Shield, TrendingUp, Users, Star } from 'lucide-react-native';

const { width } = Dimensions.get('window');

const videos = [
  {
    id: '1',
    title: 'Top 10 Tech Gadgets 2024',
    desc: 'Discover the latest technology innovations',
    duration: '3:00',
    reward: 0.50,
    category: 'Technology',
    thumbnail: 'https://i.ytimg.com/an_webp/dna4rTxh3AQ/mqdefault_6s.webp?du=3000&sqp=CJSVu8MG&rs=AOn4CLCuKQA_AsowPIs7ZlWCjahuc98j0A',
    views: '2.5K',
    rating: 4.8,
  },
  {
    id: '2',
    title: 'Healthy Cooking Tips',
    desc: 'Learn quick and healthy meal preparation',
    duration: '4:00',
    reward: 0.65,
    category: 'Health',
    thumbnail: 'https://i.ytimg.com/an_webp/vo4TMZX_V9A/mqdefault_6s.webp?du=3000&sqp=COCGu8MG&rs=AOn4CLBzKXlJw8kfTZWcnwyS_0RmQGL2WQ',
    views: '1.8K',
    rating: 4.9,
  },
  {
    id: '3',
    title: 'Travel Destinations 2024',
    desc: 'Explore amazing places around the world',
    duration: '5:00',
    reward: 0.80,
    category: 'Travel',
    thumbnail: 'https://i.ytimg.com/an_webp/Ib2HSqWktt8/mqdefault_6s.webp?du=3000&sqp=CMnzusMG&rs=AOn4CLD1S_xS0pAmqcQwxj1JeHFn3sIiDA',
    views: '3.2K',
    rating: 4.7,
  },
  {
    id: '4',
    title: 'Financial Planning Basics',
    desc: 'Essential tips for managing your money',
    duration: '6:00',
    reward: 0.95,
    category: 'Finance',
    thumbnail: 'https://i.ytimg.com/an_webp/3pJtP22eigI/mqdefault_6s.webp?du=3000&sqp=CPz6usMG&rs=AOn4CLA15YAeEdwRzFXLRiYZnOcHEVOcTw',
    views: '1.5K',
    rating: 4.6,
  },
  {
    id: '5',
    title: 'Home Workout Routine',
    desc: 'Stay fit with easy home exercises',
    duration: '4:00',
    reward: 0.60,
    category: 'Fitness',
    thumbnail: 'https://i.ytimg.com/an_webp/reVp7SW0NW4/mqdefault_6s.webp?du=3000&sqp=CP6Qu8MG&rs=AOn4CLAF8fMrOGTrxdXe2HDltUP1iNn0RQ',
    views: '2.1K',
    rating: 4.8,
  },
  {
    id: '6',
    title: 'Gardening for Beginners',
    desc: 'Start your own garden with these tips',
    duration: '3:30',
    reward: 0.55,
    category: 'Lifestyle',
    thumbnail: 'https://i.ytimg.com/vi/KHbX6PZeHIQ/hqdefault.jpg?sqp=-oaymwFACKgBEF5IWvKriqkDMwgBFQAAiEIYAdgBAeIBCggYEAIYBjgBQAHwAQH4Af4EgALoAooCDAgAEAEYZSBVKEgwDw==&rs=AOn4CLDlPYa0K4jbhkrlfX9KbEWE7HUD9Q',
    views: '1.2K',
    rating: 4.5,
  },
];

export default function WatchVideosScreen({ navigation }: any) {
  const [watched, setWatched] = useState(0);
  const [earned, setEarned] = useState(0);

  const renderVideoCard = ({ item }: any) => (
    <View className="bg-white rounded-3xl mb-4 shadow-lg border border-gray-100 overflow-hidden">
      <View className="relative">
        <Image source={{ uri: item.thumbnail }} className="w-full h-48" />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.7)']}
          className="absolute bottom-0 left-0 right-0 h-20"
        />
        <View className="absolute top-3 right-3 bg-black bg-opacity-50 rounded-full px-2 py-1">
          <Text className="text-white text-xs font-medium">{item.duration}</Text>
        </View>
        <View className="absolute bottom-3 left-3 right-3">
          <Text className="text-white text-lg font-bold mb-1">{item.title}</Text>
          <Text className="text-white text-sm opacity-90">{item.desc}</Text>
        </View>
      </View>
      
      <View className="p-4">
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-row items-center">
            <View className="bg-red-100 rounded-full p-2 mr-2">
              <Play size={16} color="#f43f5e" />
            </View>
            <View>
              <Text className="text-xs text-gray-500">Views</Text>
              <Text className="font-semibold text-sm">{item.views}</Text>
            </View>
          </View>
          
          <View className="flex-row items-center">
            <Star size={14} color="#fbbf24" fill="#fbbf24" />
            <Text className="text-sm font-semibold ml-1">{item.rating}</Text>
          </View>
          
          <View className="bg-green-100 rounded-full px-3 py-1">
            <Text className="text-green-700 font-bold text-sm">${item.reward.toFixed(2)}</Text>
          </View>
        </View>
        
        <View className="flex-row items-center justify-between">
          <View className="bg-gray-100 rounded-full px-3 py-1">
            <Text className="text-gray-700 text-xs font-medium">{item.category}</Text>
          </View>
          
          <TouchableOpacity 
            className="bg-gradient-to-r from-red-500 to-orange-500 px-6 py-3 rounded-full shadow-lg"
            onPress={() => navigation.navigate('VideoPlayer', { video: item })}
          >
            <View className="flex-row items-center">
              <Play size={16} color="white" />
              <Text className="text-white font-bold ml-2">Watch Now</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <ScrollView className="flex-1 bg-gradient-to-b from-gray-50 to-white">
      {/* Enhanced Header Card */}
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        className="rounded-3xl mx-4 mt-6 p-6 shadow-2xl"
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
      >
        <View className="flex-row justify-between items-start mb-4">
          <View className="flex-1">
            <View className="flex-row items-center mb-2">
              <View className="bg-white bg-opacity-20 rounded-full p-2 mr-3">
                <Play size={24} color="white" />
              </View>
              <Text className="text-white text-2xl font-bold">Watch & Earn</Text>
            </View>
            <Text className="text-white text-base opacity-90 leading-5">
              Earn money by watching sponsored videos and learning new things
            </Text>
          </View>
        </View>
        
        <View className="bg-white bg-opacity-10 rounded-2xl p-4">
          <View className="flex-row justify-between items-center">
            <View className="items-center flex-1">
              <Text className="text-white text-xs opacity-80 mb-1">Total Earned</Text>
              <Text className="text-3xl font-bold text-white">${earned.toFixed(2)}</Text>
            </View>
            <View className="w-px h-12 bg-white bg-opacity-30" />
            <View className="items-center flex-1">
              <Text className="text-white text-xs opacity-80 mb-1">Videos Watched</Text>
              <Text className="text-3xl font-bold text-white">{watched}</Text>
            </View>
            <View className="w-px h-12 bg-white bg-opacity-30" />
            <View className="items-center flex-1">
              <Text className="text-white text-xs opacity-80 mb-1">Daily Limit</Text>
              <Text className="text-3xl font-bold text-white">0/15</Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      {/* Quick Stats */}
      <View className="mx-4 mt-6">
        <View className="flex-row space-x-3">
          <View className="flex-1 bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
            <View className="flex-row items-center mb-2">
              <View className="bg-blue-100 rounded-full p-2 mr-2">
                <TrendingUp size={16} color="#3b82f6" />
              </View>
              <Text className="text-xs text-gray-500">Today's Goal</Text>
            </View>
            <Text className="text-lg font-bold text-gray-800">5/15</Text>
            <Text className="text-xs text-gray-500">videos watched</Text>
          </View>
          
          <View className="flex-1 bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
            <View className="flex-row items-center mb-2">
              <View className="bg-green-100 rounded-full p-2 mr-2">
                <DollarSign size={16} color="#10b981" />
              </View>
              <Text className="text-xs text-gray-500">Today's Earnings</Text>
            </View>
            <Text className="text-lg font-bold text-gray-800">$2.45</Text>
            <Text className="text-xs text-gray-500">from videos</Text>
          </View>
        </View>
      </View>

      {/* Available Videos */}
      <View className="mx-4 mt-6">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-xl font-bold text-gray-800">Available Videos</Text>
          <View className="bg-blue-100 rounded-full px-3 py-1">
            <Text className="text-blue-700 font-semibold text-sm">{videos.length} videos</Text>
          </View>
        </View>
        
        <FlatList
          data={videos}
          keyExtractor={item => item.id}
          renderItem={renderVideoCard}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
        />
      </View>

      {/* How Video Rewards Work */}
      <View className="mx-4 mt-6 bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
        <View className="flex-row items-center mb-4">
          <View className="bg-purple-100 rounded-full p-2 mr-3">
            <Info size={20} color="#8b5cf6" />
          </View>
          <Text className="text-xl font-bold text-gray-800">How Video Rewards Work</Text>
        </View>
        
        <View className="space-y-4">
          <View className="flex-row items-center">
            <View className="bg-red-100 rounded-full p-2 mr-3">
              <Play size={16} color="#f43f5e" />
            </View>
            <View className="flex-1">
              <Text className="font-semibold text-gray-800">Watch Requirement</Text>
              <Text className="text-sm text-gray-600">Watch 75-90% of video to earn reward</Text>
            </View>
          </View>
          
          <View className="flex-row items-center">
            <View className="bg-green-100 rounded-full p-2 mr-3">
              <DollarSign size={16} color="#10b981" />
            </View>
            <View className="flex-1">
              <Text className="font-semibold text-gray-800">Instant Rewards</Text>
              <Text className="text-sm text-gray-600">Earn $0.50 - $1.25 per video</Text>
            </View>
          </View>
          
          <View className="flex-row items-center">
            <View className="bg-blue-100 rounded-full p-2 mr-3">
              <Clock size={16} color="#3b82f6" />
            </View>
            <View className="flex-1">
              <Text className="font-semibold text-gray-800">Daily Limit</Text>
              <Text className="text-sm text-gray-600">Up to 15 videos per day</Text>
            </View>
          </View>
          
          <View className="flex-row items-center">
            <View className="bg-purple-100 rounded-full p-2 mr-3">
              <Shield size={16} color="#8b5cf6" />
            </View>
            <View className="flex-1">
              <Text className="font-semibold text-gray-800">Quality Content</Text>
              <Text className="text-sm text-gray-600">All videos are reviewed and family-friendly</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Enhanced Video Stats */}
      <View className="mx-4 mt-6 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl p-6 shadow-2xl mb-8">
        <Text className="text-white text-xl font-bold mb-4 text-center">Your Video Performance</Text>
        
        <View className="flex-row justify-between mb-4">
          <View className="bg-white bg-opacity-20 rounded-2xl p-4 flex-1 items-center mr-2">
            <Play size={28} color="white" />
            <Text className="text-3xl font-bold text-white mt-2">{watched}</Text>
            <Text className="text-white text-sm opacity-90">Videos Watched</Text>
          </View>
          <View className="bg-white bg-opacity-20 rounded-2xl p-4 flex-1 items-center ml-2">
            <DollarSign size={28} color="white" />
            <Text className="text-3xl font-bold text-white mt-2">${earned.toFixed(2)}</Text>
            <Text className="text-white text-sm opacity-90">Total Earned</Text>
          </View>
        </View>
        
        <View className="bg-white bg-opacity-10 rounded-2xl p-4">
          <Text className="text-white text-center text-sm">
            Average earning per video: <Text className="font-bold">${(watched ? earned / watched : 0).toFixed(2)}</Text>
          </Text>
          <Text className="text-white text-center text-xs opacity-80 mt-1">
            Keep watching to increase your earnings!
          </Text>
        </View>
      </View>
    </ScrollView>
  );
} 
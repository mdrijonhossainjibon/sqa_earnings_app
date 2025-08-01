import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StatusBar, Animated, Alert, Image, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Search, Clock, Star, TrendingUp, CheckCircle, Circle, Users, Target, Award, Filter, Calendar, Zap, Gift, DollarSign, ShoppingBag, Heart, Car, Home, Briefcase, GraduationCap, Globe, Coffee, Plane, CreditCard, Smartphone, Gamepad2, BookOpen, Music, Camera, Trophy, Crown, Medal, ChevronRight, Check, X, Gift as GiftIcon, Coins, Wallet, ShoppingCart, Headphones, Gamepad, Book, Plane as PlaneIcon, Coffee as CoffeeIcon, ShoppingBag as ShoppingBagIcon } from 'lucide-react-native';

// Mock rewards data
const mockRewards = [
  {
    id: 1,
    title: 'Amazon Gift Card',
    description: 'Redeem for any purchase on Amazon',
    points: 1000,
    value: '$10.00',
    category: 'gift-cards',
    isAvailable: true,
    isRedeemed: false,
    image: 'https://picsum.photos/200/200?random=1',
    expiryDate: '2024-12-31',
    popular: true,
    icon: <ShoppingBag size={24} color="#FFD600" />
  },
  {
    id: 2,
    title: 'Netflix Subscription',
    description: '1 month of Netflix Premium',
    points: 2500,
    value: '$15.99',
    category: 'entertainment',
    isAvailable: true,
    isRedeemed: false,
    image: 'https://picsum.photos/200/200?random=2',
    expiryDate: '2024-12-31',
    popular: true,
    icon: <BookOpen size={24} color="#FFD600" />
  },
  {
    id: 3,
    title: 'Spotify Premium',
    description: '1 month of Spotify Premium',
    points: 2000,
    value: '$9.99',
    category: 'entertainment',
    isAvailable: true,
    isRedeemed: false,
    image: 'https://picsum.photos/200/200?random=3',
    expiryDate: '2024-12-31',
    popular: false,
    icon: <Music size={24} color="#FFD600" />
  },
  {
    id: 4,
    title: 'Uber Eats Credit',
    description: '$15 credit for food delivery',
    points: 1500,
    value: '$15.00',
    category: 'food',
    isAvailable: true,
    isRedeemed: false,
    image: 'https://picsum.photos/200/200?random=4',
    expiryDate: '2024-12-31',
    popular: true,
    icon: <Coffee size={24} color="#FFD600" />
  },
  {
    id: 5,
    title: 'Google Play Gift Card',
    description: 'Redeem for apps, games, and more',
    points: 1200,
    value: '$12.00',
    category: 'gift-cards',
    isAvailable: true,
    isRedeemed: false,
    image: 'https://picsum.photos/200/200?random=5',
    expiryDate: '2024-12-31',
    popular: false,
    icon: <Smartphone size={24} color="#FFD600" />
  },
  {
    id: 6,
    title: 'Airbnb Travel Credit',
    description: '$25 off your next booking',
    points: 3000,
    value: '$25.00',
    category: 'travel',
    isAvailable: true,
    isRedeemed: false,
    image: 'https://picsum.photos/200/200?random=6',
    expiryDate: '2024-12-31',
    popular: false,
    icon: <Plane size={24} color="#FFD600" />
  },
  {
    id: 7,
    title: 'Steam Gift Card',
    description: 'Redeem for PC games and software',
    points: 1800,
    value: '$18.00',
    category: 'gaming',
    isAvailable: true,
    isRedeemed: false,
    image: 'https://picsum.photos/200/200?random=7',
    expiryDate: '2024-12-31',
    popular: false,
    icon: <Gamepad2 size={24} color="#FFD600" />
  },
  {
    id: 8,
    title: 'Coursera Course',
    description: 'Access to any course for 1 month',
    points: 3500,
    value: '$49.00',
    category: 'education',
    isAvailable: true,
    isRedeemed: false,
    image: 'https://picsum.photos/200/200?random=8',
    expiryDate: '2024-12-31',
    popular: false,
    icon: <GraduationCap size={24} color="#FFD600" />
  },
  {
    id: 9,
    title: 'PayPal Cash',
    description: 'Direct cash transfer to PayPal',
    points: 5000,
    value: '$50.00',
    category: 'cash',
    isAvailable: true,
    isRedeemed: false,
    image: 'https://picsum.photos/200/200?random=9',
    expiryDate: '2024-12-31',
    popular: true,
    icon: <DollarSign size={24} color="#FFD600" />
  },
  {
    id: 10,
    title: 'DoorDash Credit',
    description: '$20 credit for food delivery',
    points: 2000,
    value: '$20.00',
    category: 'food',
    isAvailable: true,
    isRedeemed: false,
    image: 'https://picsum.photos/200/200?random=10',
    expiryDate: '2024-12-31',
    popular: false,
    icon: <Coffee size={24} color="#FFD600" />
  },
  {
    id: 11,
    title: 'iTunes Gift Card',
    description: 'Redeem for music, movies, and apps',
    points: 1500,
    value: '$15.00',
    category: 'gift-cards',
    isAvailable: true,
    isRedeemed: false,
    image: 'https://picsum.photos/200/200?random=11',
    expiryDate: '2024-12-31',
    popular: false,
    icon: <Smartphone size={24} color="#FFD600" />
  },
  {
    id: 12,
    title: 'Mystery Box',
    description: 'Random reward worth $5-$50',
    points: 800,
    value: '$5-$50',
    category: 'mystery',
    isAvailable: true,
    isRedeemed: false,
    image: 'https://picsum.photos/200/200?random=12',
    expiryDate: '2024-12-31',
    popular: true,
    icon: <Gift size={24} color="#FFD600" />
  }
];

const rewardCategories = [
  {
    id: 'all',
    title: 'All Rewards',
    count: mockRewards.length,
    icon: <Gift size={24} color="#FFD600" />
  },
  {
    id: 'gift-cards',
    title: 'Gift Cards',
    count: mockRewards.filter(reward => reward.category === 'gift-cards').length,
    icon: <CreditCard size={24} color="#FFD600" />
  },
  {
    id: 'entertainment',
    title: 'Entertainment',
    count: mockRewards.filter(reward => reward.category === 'entertainment').length,
    icon: <BookOpen size={24} color="#FFD600" />
  },
  {
    id: 'food',
    title: 'Food & Dining',
    count: mockRewards.filter(reward => reward.category === 'food').length,
    icon: <Coffee size={24} color="#FFD600" />
  },
  {
    id: 'travel',
    title: 'Travel',
    count: mockRewards.filter(reward => reward.category === 'travel').length,
    icon: <Plane size={24} color="#FFD600" />
  },
  {
    id: 'gaming',
    title: 'Gaming',
    count: mockRewards.filter(reward => reward.category === 'gaming').length,
    icon: <Gamepad2 size={24} color="#FFD600" />
  },
  {
    id: 'education',
    title: 'Education',
    count: mockRewards.filter(reward => reward.category === 'education').length,
    icon: <GraduationCap size={24} color="#FFD600" />
  },
  {
    id: 'cash',
    title: 'Cash',
    count: mockRewards.filter(reward => reward.category === 'cash').length,
    icon: <DollarSign size={24} color="#FFD600" />
  },
  {
    id: 'mystery',
    title: 'Mystery',
    count: mockRewards.filter(reward => reward.category === 'mystery').length,
    icon: <Gift size={24} color="#FFD600" />
  }
];

const userStats = {
  totalPoints: 8750,
  availablePoints: 8750,
  redeemedPoints: 0,
  totalRewards: 0,
  totalValue: '$0.00',
  level: 'Gold',
  nextLevel: 'Platinum',
  pointsToNextLevel: 1250
};

const recentRedemptions = [
  {
    id: 1,
    title: 'Amazon Gift Card',
    points: 1000,
    value: '$10.00',
    redeemedDate: '2024-01-20',
    status: 'delivered',
    image: 'https://picsum.photos/100/100?random=13'
  },
  {
    id: 2,
    title: 'Netflix Subscription',
    points: 2500,
    value: '$15.99',
    redeemedDate: '2024-01-15',
    status: 'processing',
    image: 'https://picsum.photos/100/100?random=14'
  }
];

export default function RewardsScreen({ navigation }: any) {
  const [rewards, setRewards] = useState(mockRewards);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showPopularOnly, setShowPopularOnly] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const filteredRewards = rewards.filter(reward => {
    const matchesCategory = selectedCategory === 'all' || reward.category === selectedCategory;
    const matchesSearch = reward.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         reward.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPopular = !showPopularOnly || reward.popular;
    return matchesCategory && matchesSearch && matchesPopular;
  });

  const handleRewardPress = (reward: any) => {
    if (!reward.isAvailable) {
      Alert.alert('Reward Unavailable', 'This reward is not available at the moment.');
      return;
    }

    if (userStats.availablePoints < reward.points) {
      Alert.alert('Insufficient Points', `You need ${reward.points} points to redeem this reward. You currently have ${userStats.availablePoints} points.`);
      return;
    }

    Alert.alert(
      'Redeem Reward',
      `Are you sure you want to redeem "${reward.title}"?\n\nPoints: ${reward.points}\nValue: ${reward.value}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Redeem', onPress: () => {
          // In a real app, you would process the redemption
          Alert.alert('Success!', 'Your reward has been redeemed and will be delivered shortly.');
          setRewards(prevRewards => 
            prevRewards.map(r => 
              r.id === reward.id ? { ...r, isRedeemed: true } : r
            )
          );
        }}
      ]
    );
  };

  const handleCategoryPress = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const formatPoints = (points: number) => {
    return points.toLocaleString();
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
          <Text className="text-xl font-bold text-white">Rewards</Text>
          <TouchableOpacity 
            activeOpacity={0.7}
            onPress={() => {/* Refresh rewards */}}
          >
            <Zap size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <Animated.View style={{ opacity: fadeAnim }}>
          {/* User Stats */}
          <View className="bg-gradient-to-r from-yellow-500 to-yellow-600 mx-4 mt-4 rounded-xl p-4">
            <View className="flex-row items-center justify-between mb-3">
              <View className="flex-row items-center">
                <Trophy size={24} color="#000" />
                <Text className="text-black font-bold text-lg ml-2">{userStats.level} Member</Text>
              </View>
              <View className="bg-black bg-opacity-20 px-3 py-1 rounded-full">
                <Text className="text-black font-bold text-sm">{userStats.nextLevel}</Text>
              </View>
            </View>
            
            <View className="flex-row items-center justify-between mb-3">
              <View>
                <Text className="text-black text-sm opacity-80">Available Points</Text>
                <Text className="text-black font-bold text-2xl">{formatPoints(userStats.availablePoints)}</Text>
              </View>
              <View>
                <Text className="text-black text-sm opacity-80">Total Value</Text>
                <Text className="text-black font-bold text-lg">{userStats.totalValue}</Text>
              </View>
            </View>
            
            <View className="bg-black bg-opacity-20 rounded-full h-2 mb-2">
              <View 
                className="bg-black rounded-full h-2" 
                style={{ width: `${((userStats.totalPoints - userStats.pointsToNextLevel) / userStats.totalPoints) * 100}%` }}
              />
            </View>
            <Text className="text-black text-xs opacity-80">
              {userStats.pointsToNextLevel} points to {userStats.nextLevel}
            </Text>
          </View>

          {/* Search Bar */}
          <View className="mx-4 mt-4">
            <View className="relative">
              <Search size={20} color="#9CA3AF" className="absolute left-3 top-3 z-10" />
              <TextInput
                className="bg-gray-800 rounded-xl pl-10 pr-4 py-3 text-white"
                placeholder="Search rewards..."
                placeholderTextColor="#9CA3AF"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
          </View>

          {/* Popular Filter */}
          <View className="mx-4 mt-4">
            <TouchableOpacity
              className={`px-4 py-2 rounded-lg ${
                showPopularOnly ? 'bg-yellow-500' : 'bg-gray-800'
              }`}
              onPress={() => setShowPopularOnly(!showPopularOnly)}
            >
              <Text
                className={`font-semibold text-sm ${
                  showPopularOnly ? 'text-black' : 'text-white'
                }`}
              >
                {showPopularOnly ? '✓ Popular Only' : 'Show Popular Only'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Categories */}
          <View className="mx-4 mt-6">
            <Text className="text-lg font-bold text-white mb-4">Categories</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
              {rewardCategories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  className={`px-4 py-3 rounded-xl mr-3 min-w-[100px] ${
                    selectedCategory === category.id ? 'bg-yellow-500' : 'bg-gray-800'
                  }`}
                  onPress={() => handleCategoryPress(category.id)}
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
                      {category.count} rewards
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Rewards List */}
          <View className="mx-4 mt-6">
            <Text className="text-lg font-bold text-white mb-4">
              {filteredRewards.length} Available Rewards
            </Text>
            
            {filteredRewards.length === 0 ? (
              <View className="bg-gray-800 rounded-xl p-8 items-center">
                <Gift size={48} color="#6B7280" />
                <Text className="text-gray-400 text-lg font-semibold mt-4">No rewards found</Text>
                <Text className="text-gray-500 text-sm text-center mt-2">
                  Try adjusting your filters or earn more points
                </Text>
              </View>
            ) : (
              <View className="grid grid-cols-2 gap-3">
                {filteredRewards.map((reward) => (
                  <TouchableOpacity
                    key={reward.id}
                    className={`bg-gray-800 rounded-xl overflow-hidden ${
                      reward.isRedeemed ? 'opacity-50' : ''
                    }`}
                    onPress={() => handleRewardPress(reward)}
                    activeOpacity={0.8}
                    disabled={reward.isRedeemed}
                  >
                    {/* Reward Image */}
                    <View className="relative">
                      <Image
                        source={{ uri: reward.image }}
                        className="w-full h-32"
                        resizeMode="cover"
                      />
                      <View className="absolute inset-0 bg-black bg-opacity-20" />
                      {reward.popular && (
                        <View className="absolute top-2 left-2 bg-red-500 px-2 py-1 rounded">
                          <Text className="text-white text-xs font-bold">POPULAR</Text>
                        </View>
                      )}
                      {reward.isRedeemed && (
                        <View className="absolute inset-0 bg-gray-700 bg-opacity-50 items-center justify-center">
                          <CheckCircle size={32} color="#10B981" />
                          <Text className="text-green-500 font-semibold mt-2">Redeemed</Text>
                        </View>
                      )}
                    </View>
                    
                    {/* Reward Info */}
                    <View className="p-3">
                      <Text className="text-white font-semibold text-sm mb-1" numberOfLines={2}>
                        {reward.title}
                      </Text>
                      <Text className="text-gray-400 text-xs mb-2" numberOfLines={2}>
                        {reward.description}
                      </Text>
                      
                      <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center">
                          <Star size={12} color="#FFD600" />
                          <Text className="text-yellow-500 font-bold text-xs ml-1">
                            {formatPoints(reward.points)}
                          </Text>
                        </View>
                        <Text className="text-green-500 font-bold text-xs">
                          {reward.value}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Recent Redemptions */}
          <View className="mx-4 mt-6 mb-6">
            <Text className="text-lg font-bold text-white mb-4">Recent Redemptions</Text>
            <View className="space-y-3">
              {recentRedemptions.map((redemption) => (
                <View key={redemption.id} className="bg-gray-800 rounded-xl p-4 flex-row items-center">
                  <Image
                    source={{ uri: redemption.image }}
                    className="w-12 h-12 rounded-lg mr-3"
                  />
                  <View className="flex-1">
                    <Text className="text-white font-semibold">{redemption.title}</Text>
                    <Text className="text-gray-400 text-sm">{redemption.redeemedDate}</Text>
                  </View>
                  <View className="items-end">
                    <Text className="text-yellow-500 font-bold">{formatPoints(redemption.points)} pts</Text>
                    <Text className="text-green-500 text-sm">{redemption.value}</Text>
                    <View className={`px-2 py-1 rounded-full mt-1 ${
                      redemption.status === 'delivered' ? 'bg-green-500' : 'bg-yellow-500'
                    }`}>
                      <Text className={`text-xs font-semibold ${
                        redemption.status === 'delivered' ? 'text-white' : 'text-black'
                      }`}>
                        {redemption.status}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Tips Section */}
          <View className="mx-4 mb-6">
            <View className="bg-gray-800 rounded-xl p-4">
              <View className="flex-row items-center mb-3">
                <Award size={24} color="#FFD600" />
                <Text className="text-white font-bold text-lg ml-3">Reward Tips</Text>
              </View>
              <View className="space-y-2">
                <Text className="text-gray-400 text-sm">• Popular rewards are in high demand</Text>
                <Text className="text-gray-400 text-sm">• Higher tier members get exclusive rewards</Text>
                <Text className="text-gray-400 text-sm">• Rewards are delivered within 24-48 hours</Text>
                <Text className="text-gray-400 text-sm">• New rewards are added weekly</Text>
              </View>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
} 
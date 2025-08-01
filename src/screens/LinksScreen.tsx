import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StatusBar, Animated, Alert, Image, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Search, Clock, Star, TrendingUp, CheckCircle, Circle, Users, Target, Award, Filter, Calendar, Zap, ExternalLink, ShoppingBag, Heart, Car, Home, Briefcase, GraduationCap, Globe, Gift, DollarSign, Smartphone, Gamepad2, BookOpen, Music, Camera, Plane, Coffee } from 'lucide-react-native';

// Mock links data
const mockLinks = [
  {
    id: 1,
    title: 'Amazon Prime Trial',
    description: 'Start your 30-day free trial and earn points instantly',
    points: 500,
    estimatedTime: '2-3 min',
    category: 'shopping',
    difficulty: 'Easy',
    isCompleted: false,
    isAvailable: true,
    requirements: 'New Amazon account',
    visits: 1250,
    icon: <ShoppingBag size={24} color="#FFD600" />,
    company: 'Amazon',
    completionRate: '98%',
    url: 'https://amazon.com/prime',
    type: 'trial'
  },
  {
    id: 2,
    title: 'Netflix Free Month',
    description: 'Get 1 month free Netflix and earn bonus points',
    points: 300,
    estimatedTime: '3-5 min',
    category: 'entertainment',
    difficulty: 'Easy',
    isCompleted: false,
    isAvailable: true,
    requirements: 'New Netflix account',
    visits: 890,
    icon: <BookOpen size={24} color="#FFD600" />,
    company: 'Netflix',
    completionRate: '95%',
    url: 'https://netflix.com/signup',
    type: 'trial'
  },
  {
    id: 3,
    title: 'Spotify Premium Trial',
    description: 'Try Spotify Premium free for 30 days',
    points: 250,
    estimatedTime: '2-4 min',
    category: 'entertainment',
    difficulty: 'Easy',
    isCompleted: true,
    isAvailable: true,
    requirements: 'New Spotify account',
    visits: 1100,
    icon: <Music size={24} color="#FFD600" />,
    company: 'Spotify',
    completionRate: '97%',
    url: 'https://spotify.com/premium',
    type: 'trial'
  },
  {
    id: 4,
    title: 'Uber Eats First Order',
    description: 'Get $20 off your first Uber Eats order',
    points: 200,
    estimatedTime: '5-8 min',
    category: 'food',
    difficulty: 'Medium',
    isCompleted: false,
    isAvailable: true,
    requirements: 'New Uber account',
    visits: 650,
    icon: <Coffee size={24} color="#FFD600" />,
    company: 'Uber Eats',
    completionRate: '92%',
    url: 'https://ubereats.com/signup',
    type: 'offer'
  },
  {
    id: 5,
    title: 'DoorDash Welcome Offer',
    description: 'Save $15 on your first DoorDash order',
    points: 175,
    estimatedTime: '4-6 min',
    category: 'food',
    difficulty: 'Medium',
    isCompleted: false,
    isAvailable: true,
    requirements: 'New DoorDash account',
    visits: 720,
    icon: <Coffee size={24} color="#FFD600" />,
    company: 'DoorDash',
    completionRate: '90%',
    url: 'https://doordash.com/welcome',
    type: 'offer'
  },
  {
    id: 6,
    title: 'Robinhood Stock Bonus',
    description: 'Get a free stock when you sign up for Robinhood',
    points: 400,
    estimatedTime: '8-12 min',
    category: 'finance',
    difficulty: 'Hard',
    isCompleted: false,
    isAvailable: true,
    requirements: '18+ with SSN',
    visits: 450,
    icon: <TrendingUp size={24} color="#FFD600" />,
    company: 'Robinhood',
    completionRate: '88%',
    url: 'https://robinhood.com/signup',
    type: 'investment'
  },
  {
    id: 7,
    title: 'Coinbase Crypto Bonus',
    description: 'Earn $10 in Bitcoin when you buy $100 in crypto',
    points: 350,
    estimatedTime: '10-15 min',
    category: 'finance',
    difficulty: 'Hard',
    isCompleted: false,
    isAvailable: false,
    requirements: '18+ with ID verification',
    visits: 380,
    icon: <DollarSign size={24} color="#FFD600" />,
    company: 'Coinbase',
    completionRate: '85%',
    url: 'https://coinbase.com/signup',
    type: 'investment'
  },
  {
    id: 8,
    title: 'Instacart First Order',
    description: 'Get $30 off your first Instacart grocery order',
    points: 225,
    estimatedTime: '6-10 min',
    category: 'shopping',
    difficulty: 'Medium',
    isCompleted: false,
    isAvailable: true,
    requirements: 'New Instacart account',
    visits: 580,
    icon: <ShoppingBag size={24} color="#FFD600" />,
    company: 'Instacart',
    completionRate: '93%',
    url: 'https://instacart.com/signup',
    type: 'offer'
  },
  {
    id: 9,
    title: 'Airbnb Travel Credit',
    description: 'Get $25 off your first Airbnb booking',
    points: 275,
    estimatedTime: '5-8 min',
    category: 'travel',
    difficulty: 'Medium',
    isCompleted: false,
    isAvailable: true,
    requirements: 'New Airbnb account',
    visits: 420,
    icon: <Plane size={24} color="#FFD600" />,
    company: 'Airbnb',
    completionRate: '91%',
    url: 'https://airbnb.com/signup',
    type: 'offer'
  },
  {
    id: 10,
    title: 'Grubhub Welcome Bonus',
    description: 'Save $12 on your first Grubhub order',
    points: 150,
    estimatedTime: '3-5 min',
    category: 'food',
    difficulty: 'Easy',
    isCompleted: false,
    isAvailable: true,
    requirements: 'New Grubhub account',
    visits: 820,
    icon: <Coffee size={24} color="#FFD600" />,
    company: 'Grubhub',
    completionRate: '94%',
    url: 'https://grubhub.com/welcome',
    type: 'offer'
  },
  {
    id: 11,
    title: 'Coursera Free Course',
    description: 'Access a free course from top universities',
    points: 100,
    estimatedTime: '2-3 min',
    category: 'education',
    difficulty: 'Easy',
    isCompleted: false,
    isAvailable: true,
    requirements: 'Email address',
    visits: 1200,
    icon: <GraduationCap size={24} color="#FFD600" />,
    company: 'Coursera',
    completionRate: '96%',
    url: 'https://coursera.org/free-course',
    type: 'education'
  },
  {
    id: 12,
    title: 'Duolingo Plus Trial',
    description: 'Try Duolingo Plus free for 14 days',
    points: 125,
    estimatedTime: '2-4 min',
    category: 'education',
    difficulty: 'Easy',
    isCompleted: false,
    isAvailable: true,
    requirements: 'New Duolingo account',
    visits: 950,
    icon: <GraduationCap size={24} color="#FFD600" />,
    company: 'Duolingo',
    completionRate: '93%',
    url: 'https://duolingo.com/plus',
    type: 'trial'
  }
];

const linkCategories = [
  {
    id: 'all',
    title: 'All Links',
    count: mockLinks.length,
    icon: <Globe size={24} color="#FFD600" />
  },
  {
    id: 'shopping',
    title: 'Shopping',
    count: mockLinks.filter(link => link.category === 'shopping').length,
    icon: <ShoppingBag size={24} color="#FFD600" />
  },
  {
    id: 'entertainment',
    title: 'Entertainment',
    count: mockLinks.filter(link => link.category === 'entertainment').length,
    icon: <BookOpen size={24} color="#FFD600" />
  },
  {
    id: 'food',
    title: 'Food & Dining',
    count: mockLinks.filter(link => link.category === 'food').length,
    icon: <Coffee size={24} color="#FFD600" />
  },
  {
    id: 'finance',
    title: 'Finance',
    count: mockLinks.filter(link => link.category === 'finance').length,
    icon: <DollarSign size={24} color="#FFD600" />
  },
  {
    id: 'travel',
    title: 'Travel',
    count: mockLinks.filter(link => link.category === 'travel').length,
    icon: <Plane size={24} color="#FFD600" />
  },
  {
    id: 'education',
    title: 'Education',
    count: mockLinks.filter(link => link.category === 'education').length,
    icon: <GraduationCap size={24} color="#FFD600" />
  }
];

const linkTypes = [
  { id: 'all', title: 'All Types', color: '#FFD600' },
  { id: 'trial', title: 'Free Trials', color: '#10B981' },
  { id: 'offer', title: 'Special Offers', color: '#F59E0B' },
  { id: 'investment', title: 'Investments', color: '#EF4444' },
  { id: 'education', title: 'Education', color: '#8B5CF6' }
];

const difficultyColors = {
  Easy: '#10B981',
  Medium: '#F59E0B',
  Hard: '#EF4444'
};

const linkStats = {
  totalCompleted: mockLinks.filter(l => l.isCompleted).length,
  totalAvailable: mockLinks.filter(l => l.isAvailable).length,
  totalPoints: mockLinks.reduce((sum, link) => sum + link.points, 0),
  earnedPoints: mockLinks.filter(l => l.isCompleted).reduce((sum, link) => sum + link.points, 0),
  averageTime: '5 min',
  completionRate: '92%'
};

export default function LinksScreen({ navigation }: any) {
  const [links, setLinks] = useState(mockLinks);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const filteredLinks = links.filter(link => {
    const matchesCategory = selectedCategory === 'all' || link.category === selectedCategory;
    const matchesType = selectedType === 'all' || link.type === selectedType;
    const matchesDifficulty = selectedDifficulty === 'all' || link.difficulty === selectedDifficulty;
    const matchesSearch = link.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         link.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesType && matchesDifficulty && matchesSearch;
  });

  const handleLinkPress = (link: any) => {
    if (link.isCompleted) {
      Alert.alert('Link Completed', 'This offer has already been completed!');
      return;
    }

    if (!link.isAvailable) {
      Alert.alert('Link Unavailable', 'This offer is not available at the moment. Please check back later.');
      return;
    }

    Alert.alert(
      'Visit Link',
      `Ready to visit "${link.title}"?\n\nPoints: ${link.points}\nEstimated time: ${link.estimatedTime}\n\nYou'll be redirected to the external website.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Visit Link', onPress: () => {
          // In a real app, you would open the URL
          Alert.alert('Opening Link', `Redirecting to ${link.company}...`);
          // Linking.openURL(link.url);
        }}
      ]
    );
  };

  const handleCategoryPress = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const handleTypePress = (typeId: string) => {
    setSelectedType(typeId);
  };

  const handleDifficultyPress = (difficulty: string) => {
    setSelectedDifficulty(difficulty);
  };

  const getDifficultyColor = (difficulty: string) => {
    return difficultyColors[difficulty as keyof typeof difficultyColors] || '#6B7280';
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
          <Text className="text-xl font-bold text-white">Links & Offers</Text>
          <TouchableOpacity 
            activeOpacity={0.7}
            onPress={() => {/* Refresh links */}}
          >
            <Zap size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <Animated.View style={{ opacity: fadeAnim }}>
          {/* Stats Header */}
          <View className="bg-gray-800 mx-4 mt-4 rounded-xl p-4">
            <View className="flex-row items-center justify-between mb-3">
              <View className="flex-row items-center">
                <Globe size={24} color="#FFD600" />
                <Text className="text-lg font-bold text-white ml-2">Link Stats</Text>
              </View>
              <View className="bg-yellow-500 px-3 py-1 rounded-full">
                <Text className="text-black font-bold text-sm">{linkStats.totalCompleted}/{linkStats.totalAvailable}</Text>
              </View>
            </View>
            
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-gray-400 text-sm">Points Earned</Text>
                <Text className="text-white font-bold text-lg">{linkStats.earnedPoints}</Text>
              </View>
              <View>
                <Text className="text-gray-400 text-sm">Total Available</Text>
                <Text className="text-white font-bold text-lg">{linkStats.totalPoints}</Text>
              </View>
              <View>
                <Text className="text-gray-400 text-sm">Avg. Time</Text>
                <Text className="text-white font-bold text-lg">{linkStats.averageTime}</Text>
              </View>
              <View>
                <Text className="text-gray-400 text-sm">Success Rate</Text>
                <Text className="text-white font-bold text-lg">{linkStats.completionRate}</Text>
              </View>
            </View>
          </View>

          {/* Search Bar */}
          <View className="mx-4 mt-4">
            <View className="relative">
              <Search size={20} color="#9CA3AF" className="absolute left-3 top-3 z-10" />
              <TextInput
                className="bg-gray-800 rounded-xl pl-10 pr-4 py-3 text-white"
                placeholder="Search links and offers..."
                placeholderTextColor="#9CA3AF"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
          </View>

          {/* Categories */}
          <View className="mx-4 mt-6">
            <Text className="text-lg font-bold text-white mb-4">Categories</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
              {linkCategories.map((category) => (
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
                      {category.count} offers
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Link Types */}
          <View className="mx-4 mt-4">
            <Text className="text-lg font-bold text-white mb-4">Offer Types</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
              {linkTypes.map((type) => (
                <TouchableOpacity
                  key={type.id}
                  className={`px-4 py-2 rounded-lg mr-3 ${
                    selectedType === type.id ? 'bg-yellow-500' : 'bg-gray-800'
                  }`}
                  onPress={() => handleTypePress(type.id)}
                >
                  <Text
                    className={`font-semibold text-sm ${
                      selectedType === type.id ? 'text-black' : 'text-white'
                    }`}
                  >
                    {type.title}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Difficulty Filter */}
          <View className="mx-4 mt-4">
            <Text className="text-lg font-bold text-white mb-4">Difficulty</Text>
            <View className="flex-row space-x-3">
              {['all', 'Easy', 'Medium', 'Hard'].map((difficulty) => (
                <TouchableOpacity
                  key={difficulty}
                  className={`px-4 py-2 rounded-lg ${
                    selectedDifficulty === difficulty ? 'bg-yellow-500' : 'bg-gray-800'
                  }`}
                  onPress={() => handleDifficultyPress(difficulty)}
                >
                  <Text
                    className={`font-semibold text-sm ${
                      selectedDifficulty === difficulty ? 'text-black' : 'text-white'
                    }`}
                  >
                    {difficulty}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Links List */}
          <View className="mx-4 mt-6 mb-6">
            <Text className="text-lg font-bold text-white mb-4">
              {filteredLinks.length} Available Offers
            </Text>
            
            {filteredLinks.length === 0 ? (
              <View className="bg-gray-800 rounded-xl p-8 items-center">
                <Globe size={48} color="#6B7280" />
                <Text className="text-gray-400 text-lg font-semibold mt-4">No offers found</Text>
                <Text className="text-gray-500 text-sm text-center mt-2">
                  Try adjusting your filters or check back later for new offers
                </Text>
              </View>
            ) : (
              filteredLinks.map((link) => (
                <TouchableOpacity
                  key={link.id}
                  className={`bg-gray-800 rounded-xl p-4 mb-4 ${
                    link.isCompleted ? 'border-l-4 border-green-500' : ''
                  } ${!link.isAvailable ? 'opacity-50' : ''}`}
                  onPress={() => handleLinkPress(link)}
                  activeOpacity={0.8}
                  disabled={!link.isAvailable}
                >
                  <View className="flex-row items-start">
                    <View className="mr-3 mt-1">
                      {link.isCompleted ? (
                        <CheckCircle size={24} color="#10B981" />
                      ) : (
                        <ExternalLink size={24} color="#FFD600" />
                      )}
                    </View>
                    
                    <View className="flex-1">
                      <View className="flex-row items-start justify-between mb-2">
                        <View className="flex-1">
                          <Text className={`font-semibold text-base ${
                            link.isCompleted ? 'text-green-500' : 'text-white'
                          }`}>
                            {link.title}
                          </Text>
                          <Text className="text-gray-400 text-sm mt-1">{link.description}</Text>
                        </View>
                        <View className="items-end">
                          <View className="flex-row items-center">
                            <Star size={16} color="#FFD600" />
                            <Text className="text-yellow-500 font-bold ml-1">{link.points}</Text>
                          </View>
                          <View className="bg-gray-700 px-2 py-1 rounded-full mt-1">
                            <Text className="text-gray-300 text-xs">{link.difficulty}</Text>
                          </View>
                        </View>
                      </View>
                      
                      <View className="flex-row items-center justify-between mb-3">
                        <View className="flex-row items-center">
                          <Clock size={14} color="#9CA3AF" />
                          <Text className="text-gray-400 text-sm ml-1">{link.estimatedTime}</Text>
                        </View>
                        <View className="flex-row items-center">
                          <Users size={14} color="#9CA3AF" />
                          <Text className="text-gray-400 text-sm ml-1">{link.completionRate}</Text>
                        </View>
                        <View className="flex-row items-center">
                          <Target size={14} color="#9CA3AF" />
                          <Text className="text-gray-400 text-sm ml-1">{link.visits} visits</Text>
                        </View>
                      </View>
                      
                      <View className="flex-row items-center justify-between">
                        <Text className="text-gray-500 text-xs">{link.company}</Text>
                        <Text className="text-gray-500 text-xs">{link.requirements}</Text>
                      </View>
                      
                      {!link.isAvailable && (
                        <View className="bg-gray-700 rounded-lg p-2 mt-2">
                          <Text className="text-gray-400 text-xs text-center">Coming Soon</Text>
                        </View>
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </View>

          {/* Tips Section */}
          <View className="mx-4 mb-6">
            <View className="bg-gray-800 rounded-xl p-4">
              <View className="flex-row items-center mb-3">
                <Award size={24} color="#FFD600" />
                <Text className="text-white font-bold text-lg ml-3">Link Tips</Text>
              </View>
              <View className="space-y-2">
                <Text className="text-gray-400 text-sm">• Complete offers honestly to receive points</Text>
                <Text className="text-gray-400 text-sm">• Some offers require credit card verification</Text>
                <Text className="text-gray-400 text-sm">• Check requirements before starting</Text>
                <Text className="text-gray-400 text-sm">• Points are awarded after offer completion</Text>
              </View>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
} 
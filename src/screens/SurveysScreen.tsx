import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StatusBar, Animated, Alert, Image, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Search, Clock, Star, TrendingUp, CheckCircle, Circle, Users, Target, Award, Filter, Calendar, Zap, BookOpen, ShoppingBag, Heart, Car, Home, Briefcase, GraduationCap } from 'lucide-react-native';

// Mock survey data
const mockSurveys = [
  {
    id: 1,
    title: 'Shopping Habits Survey',
    description: 'Share your shopping preferences and help improve retail experiences',
    points: 150,
    estimatedTime: '8-12 min',
    category: 'shopping',
    difficulty: 'Easy',
    isCompleted: false,
    isAvailable: true,
    requirements: '18+ years old',
    questions: 15,
    icon: <ShoppingBag size={24} color="#FFD600" />,
    company: 'Retail Insights',
    completionRate: '95%'
  },
  {
    id: 2,
    title: 'Health & Wellness Study',
    description: 'Help researchers understand health trends and lifestyle choices',
    points: 200,
    estimatedTime: '12-15 min',
    category: 'health',
    difficulty: 'Medium',
    isCompleted: false,
    isAvailable: true,
    requirements: 'All ages welcome',
    questions: 20,
    icon: <Heart size={24} color="#FFD600" />,
    company: 'Health Research Co.',
    completionRate: '88%'
  },
  {
    id: 3,
    title: 'Transportation Preferences',
    description: 'Share your thoughts on public transportation and commuting',
    points: 125,
    estimatedTime: '6-10 min',
    category: 'transportation',
    difficulty: 'Easy',
    isCompleted: true,
    isAvailable: true,
    requirements: 'Regular commuter',
    questions: 12,
    icon: <Car size={24} color="#FFD600" />,
    company: 'Urban Planning',
    completionRate: '92%'
  },
  {
    id: 4,
    title: 'Home Improvement Trends',
    description: 'Tell us about your home improvement projects and preferences',
    points: 175,
    estimatedTime: '10-14 min',
    category: 'home',
    difficulty: 'Medium',
    isCompleted: false,
    isAvailable: true,
    requirements: 'Homeowner or renter',
    questions: 18,
    icon: <Home size={24} color="#FFD600" />,
    company: 'Home & Garden',
    completionRate: '90%'
  },
  {
    id: 5,
    title: 'Workplace Satisfaction',
    description: 'Help improve workplace environments and employee satisfaction',
    points: 225,
    estimatedTime: '15-20 min',
    category: 'work',
    difficulty: 'Hard',
    isCompleted: false,
    isAvailable: true,
    requirements: 'Currently employed',
    questions: 25,
    icon: <Briefcase size={24} color="#FFD600" />,
    company: 'HR Solutions',
    completionRate: '85%'
  },
  {
    id: 6,
    title: 'Education Technology',
    description: 'Share your experience with online learning and educational apps',
    points: 180,
    estimatedTime: '12-16 min',
    category: 'education',
    difficulty: 'Medium',
    isCompleted: false,
    isAvailable: false,
    requirements: 'Student or educator',
    questions: 22,
    icon: <GraduationCap size={24} color="#FFD600" />,
    company: 'EduTech Research',
    completionRate: '87%'
  },
  {
    id: 7,
    title: 'Entertainment Preferences',
    description: 'Help streaming services improve their content recommendations',
    points: 100,
    estimatedTime: '5-8 min',
    category: 'entertainment',
    difficulty: 'Easy',
    isCompleted: false,
    isAvailable: true,
    requirements: 'Streaming service user',
    questions: 10,
    icon: <BookOpen size={24} color="#FFD600" />,
    company: 'Media Insights',
    completionRate: '94%'
  },
  {
    id: 8,
    title: 'Financial Planning Survey',
    description: 'Share your financial goals and investment preferences',
    points: 250,
    estimatedTime: '18-25 min',
    category: 'finance',
    difficulty: 'Hard',
    isCompleted: false,
    isAvailable: true,
    requirements: '18+ with financial experience',
    questions: 30,
    icon: <TrendingUp size={24} color="#FFD600" />,
    company: 'Financial Services',
    completionRate: '82%'
  }
];

const surveyCategories = [
  {
    id: 'all',
    title: 'All Surveys',
    count: mockSurveys.length,
    icon: <Target size={24} color="#FFD600" />
  },
  {
    id: 'shopping',
    title: 'Shopping',
    count: mockSurveys.filter(survey => survey.category === 'shopping').length,
    icon: <ShoppingBag size={24} color="#FFD600" />
  },
  {
    id: 'health',
    title: 'Health',
    count: mockSurveys.filter(survey => survey.category === 'health').length,
    icon: <Heart size={24} color="#FFD600" />
  },
  {
    id: 'transportation',
    title: 'Transport',
    count: mockSurveys.filter(survey => survey.category === 'transportation').length,
    icon: <Car size={24} color="#FFD600" />
  },
  {
    id: 'home',
    title: 'Home',
    count: mockSurveys.filter(survey => survey.category === 'home').length,
    icon: <Home size={24} color="#FFD600" />
  },
  {
    id: 'work',
    title: 'Work',
    count: mockSurveys.filter(survey => survey.category === 'work').length,
    icon: <Briefcase size={24} color="#FFD600" />
  },
  {
    id: 'education',
    title: 'Education',
    count: mockSurveys.filter(survey => survey.category === 'education').length,
    icon: <GraduationCap size={24} color="#FFD600" />
  }
];

const difficultyColors = {
  Easy: '#10B981',
  Medium: '#F59E0B',
  Hard: '#EF4444'
};

const surveyStats = {
  totalCompleted: mockSurveys.filter(s => s.isCompleted).length,
  totalAvailable: mockSurveys.filter(s => s.isAvailable).length,
  totalPoints: mockSurveys.reduce((sum, survey) => sum + survey.points, 0),
  earnedPoints: mockSurveys.filter(s => s.isCompleted).reduce((sum, survey) => sum + survey.points, 0),
  averageTime: '12 min',
  completionRate: '89%'
};

export default function SurveysScreen({ navigation }: any) {
  const [surveys, setSurveys] = useState(mockSurveys);
  const [selectedCategory, setSelectedCategory] = useState('all');
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

  const filteredSurveys = surveys.filter(survey => {
    const matchesCategory = selectedCategory === 'all' || survey.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || survey.difficulty === selectedDifficulty;
    const matchesSearch = survey.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         survey.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesDifficulty && matchesSearch;
  });

  const handleSurveyPress = (survey: any) => {
    if (survey.isCompleted) {
      Alert.alert('Survey Completed', 'This survey has already been completed!');
      return;
    }

    if (!survey.isAvailable) {
      Alert.alert('Survey Unavailable', 'This survey is not available at the moment. Please check back later.');
      return;
    }

    Alert.alert(
      'Start Survey',
      `Are you ready to start "${survey.title}"?\n\nEstimated time: ${survey.estimatedTime}\nPoints: ${survey.points}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Start', onPress: () => {
          // Navigate to survey questions screen
          Alert.alert('Survey Started', 'Opening survey questions...');
        }}
      ]
    );
  };

  const handleCategoryPress = (categoryId: string) => {
    setSelectedCategory(categoryId);
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
          <Text className="text-xl font-bold text-white">Surveys</Text>
          <TouchableOpacity 
            activeOpacity={0.7}
            onPress={() => {/* Refresh surveys */}}
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
                <Target size={24} color="#FFD600" />
                <Text className="text-lg font-bold text-white ml-2">Survey Stats</Text>
              </View>
              <View className="bg-yellow-500 px-3 py-1 rounded-full">
                <Text className="text-black font-bold text-sm">{surveyStats.totalCompleted}/{surveyStats.totalAvailable}</Text>
              </View>
            </View>
            
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-gray-400 text-sm">Points Earned</Text>
                <Text className="text-white font-bold text-lg">{surveyStats.earnedPoints}</Text>
              </View>
              <View>
                <Text className="text-gray-400 text-sm">Total Available</Text>
                <Text className="text-white font-bold text-lg">{surveyStats.totalPoints}</Text>
              </View>
              <View>
                <Text className="text-gray-400 text-sm">Avg. Time</Text>
                <Text className="text-white font-bold text-lg">{surveyStats.averageTime}</Text>
              </View>
              <View>
                <Text className="text-gray-400 text-sm">Success Rate</Text>
                <Text className="text-white font-bold text-lg">{surveyStats.completionRate}</Text>
              </View>
            </View>
          </View>

          {/* Search Bar */}
          <View className="mx-4 mt-4">
            <View className="relative">
              <Search size={20} color="#9CA3AF" className="absolute left-3 top-3 z-10" />
              <TextInput
                className="bg-gray-800 rounded-xl pl-10 pr-4 py-3 text-white"
                placeholder="Search surveys..."
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
              {surveyCategories.map((category) => (
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
                      {category.count} surveys
                    </Text>
                  </View>
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

          {/* Surveys List */}
          <View className="mx-4 mt-6 mb-6">
            <Text className="text-lg font-bold text-white mb-4">
              {filteredSurveys.length} Available Surveys
            </Text>
            
            {filteredSurveys.length === 0 ? (
              <View className="bg-gray-800 rounded-xl p-8 items-center">
                <Target size={48} color="#6B7280" />
                <Text className="text-gray-400 text-lg font-semibold mt-4">No surveys found</Text>
                <Text className="text-gray-500 text-sm text-center mt-2">
                  Try adjusting your filters or check back later for new surveys
                </Text>
              </View>
            ) : (
              filteredSurveys.map((survey) => (
                <TouchableOpacity
                  key={survey.id}
                  className={`bg-gray-800 rounded-xl p-4 mb-4 ${
                    survey.isCompleted ? 'border-l-4 border-green-500' : ''
                  } ${!survey.isAvailable ? 'opacity-50' : ''}`}
                  onPress={() => handleSurveyPress(survey)}
                  activeOpacity={0.8}
                  disabled={!survey.isAvailable}
                >
                  <View className="flex-row items-start">
                    <View className="mr-3 mt-1">
                      {survey.isCompleted ? (
                        <CheckCircle size={24} color="#10B981" />
                      ) : (
                        survey.icon
                      )}
                    </View>
                    
                    <View className="flex-1">
                      <View className="flex-row items-start justify-between mb-2">
                        <View className="flex-1">
                          <Text className={`font-semibold text-base ${
                            survey.isCompleted ? 'text-green-500' : 'text-white'
                          }`}>
                            {survey.title}
                          </Text>
                          <Text className="text-gray-400 text-sm mt-1">{survey.description}</Text>
                        </View>
                        <View className="items-end">
                          <View className="flex-row items-center">
                            <Star size={16} color="#FFD600" />
                            <Text className="text-yellow-500 font-bold ml-1">{survey.points}</Text>
                          </View>
                          <View className="bg-gray-700 px-2 py-1 rounded-full mt-1">
                            <Text className="text-gray-300 text-xs">{survey.difficulty}</Text>
                          </View>
                        </View>
                      </View>
                      
                      <View className="flex-row items-center justify-between mb-3">
                        <View className="flex-row items-center">
                          <Clock size={14} color="#9CA3AF" />
                          <Text className="text-gray-400 text-sm ml-1">{survey.estimatedTime}</Text>
                        </View>
                        <View className="flex-row items-center">
                          <Users size={14} color="#9CA3AF" />
                          <Text className="text-gray-400 text-sm ml-1">{survey.completionRate}</Text>
                        </View>
                        <View className="flex-row items-center">
                          <Target size={14} color="#9CA3AF" />
                          <Text className="text-gray-400 text-sm ml-1">{survey.questions} questions</Text>
                        </View>
                      </View>
                      
                      <View className="flex-row items-center justify-between">
                        <Text className="text-gray-500 text-xs">{survey.company}</Text>
                        <Text className="text-gray-500 text-xs">{survey.requirements}</Text>
                      </View>
                      
                      {!survey.isAvailable && (
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
                <Text className="text-white font-bold text-lg ml-3">Survey Tips</Text>
              </View>
              <View className="space-y-2">
                <Text className="text-gray-400 text-sm">• Complete surveys honestly for better rewards</Text>
                <Text className="text-gray-400 text-sm">• Longer surveys typically offer more points</Text>
                <Text className="text-gray-400 text-sm">• Check requirements before starting</Text>
                <Text className="text-gray-400 text-sm">• Surveys refresh daily at midnight</Text>
              </View>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
} 
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StatusBar, Animated, Alert, Image, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Search, Clock, Star, TrendingUp, CheckCircle, Circle, Users, Target, Award, Filter, Calendar, Zap, Play, Pause, SkipForward, Volume2, VolumeX, Maximize, Heart, ThumbsUp, MessageCircle, Share2, Eye, EyeOff, Lock, Unlock, Music, Film, Gamepad2, BookOpen, ShoppingBag, Heart as HeartIcon, Car, Home, Briefcase, GraduationCap, Globe, Coffee, Plane } from 'lucide-react-native';

// Mock video data
const mockVideos = [
  {
    id: 1,
    title: 'How to Earn Money Online in 2024',
    description: 'Learn the best strategies to earn money from home with these proven methods',
    duration: '8:45',
    points: 25,
    category: 'education',
    difficulty: 'Easy',
    isWatched: false,
    isAvailable: true,
    views: 15420,
    likes: 892,
    thumbnail: 'https://picsum.photos/300/200?random=1',
    channel: 'EarnSmart',
    uploadDate: '2024-01-15',
    watchProgress: 0,
    isLiked: false,
    isBookmarked: false,
    tags: ['money', 'online', 'tutorial']
  },
  {
    id: 2,
    title: 'Top 10 Survey Sites That Actually Pay',
    description: 'Discover the most reliable survey platforms that pay real money',
    duration: '12:30',
    points: 35,
    category: 'education',
    difficulty: 'Easy',
    isWatched: true,
    isAvailable: true,
    views: 23450,
    likes: 1245,
    thumbnail: 'https://picsum.photos/300/200?random=2',
    channel: 'SurveyPro',
    uploadDate: '2024-01-12',
    watchProgress: 100,
    isLiked: true,
    isBookmarked: false,
    tags: ['surveys', 'money', 'reviews']
  },
  {
    id: 3,
    title: 'Product Review: Best Gaming Laptops 2024',
    description: 'Comprehensive review of the top gaming laptops for this year',
    duration: '15:20',
    points: 40,
    category: 'technology',
    difficulty: 'Medium',
    isWatched: false,
    isAvailable: true,
    views: 18920,
    likes: 756,
    thumbnail: 'https://picsum.photos/300/200?random=3',
    channel: 'TechReview',
    uploadDate: '2024-01-18',
    watchProgress: 0,
    isLiked: false,
    isBookmarked: true,
    tags: ['gaming', 'laptops', 'review']
  },
  {
    id: 4,
    title: 'Quick Workout: 10-Minute Home Exercise',
    description: 'Fast and effective workout you can do anywhere, anytime',
    duration: '10:15',
    points: 20,
    category: 'health',
    difficulty: 'Easy',
    isWatched: false,
    isAvailable: true,
    views: 45670,
    likes: 2341,
    thumbnail: 'https://picsum.photos/300/200?random=4',
    channel: 'FitLife',
    uploadDate: '2024-01-20',
    watchProgress: 0,
    isLiked: false,
    isBookmarked: false,
    tags: ['workout', 'fitness', 'home']
  },
  {
    id: 5,
    title: 'Cooking Tutorial: Easy Pasta Recipes',
    description: 'Learn to make delicious pasta dishes in under 30 minutes',
    duration: '18:45',
    points: 30,
    category: 'cooking',
    difficulty: 'Medium',
    isWatched: false,
    isAvailable: true,
    views: 12340,
    likes: 567,
    thumbnail: 'https://picsum.photos/300/200?random=5',
    channel: 'ChefMaster',
    uploadDate: '2024-01-16',
    watchProgress: 0,
    isLiked: false,
    isBookmarked: false,
    tags: ['cooking', 'pasta', 'recipes']
  },
  {
    id: 6,
    title: 'Travel Guide: Budget Travel Tips',
    description: 'How to travel the world on a budget with these money-saving tips',
    duration: '22:10',
    points: 45,
    category: 'travel',
    difficulty: 'Medium',
    isWatched: false,
    isAvailable: false,
    views: 9870,
    likes: 432,
    thumbnail: 'https://picsum.photos/300/200?random=6',
    channel: 'TravelPro',
    uploadDate: '2024-01-14',
    watchProgress: 0,
    isLiked: false,
    isBookmarked: false,
    tags: ['travel', 'budget', 'tips']
  },
  {
    id: 7,
    title: 'Music: Relaxing Piano Melodies',
    description: 'Beautiful piano music to help you relax and focus while working',
    duration: '45:30',
    points: 15,
    category: 'music',
    difficulty: 'Easy',
    isWatched: false,
    isAvailable: true,
    views: 67890,
    likes: 3456,
    thumbnail: 'https://picsum.photos/300/200?random=7',
    channel: 'PianoRelax',
    uploadDate: '2024-01-19',
    watchProgress: 0,
    isLiked: false,
    isBookmarked: false,
    tags: ['music', 'piano', 'relaxing']
  },
  {
    id: 8,
    title: 'Gaming: Mobile Game Walkthrough',
    description: 'Complete walkthrough of the latest mobile game with tips and tricks',
    duration: '28:15',
    points: 35,
    category: 'gaming',
    difficulty: 'Hard',
    isWatched: false,
    isAvailable: true,
    views: 34560,
    likes: 1234,
    thumbnail: 'https://picsum.photos/300/200?random=8',
    channel: 'GameMaster',
    uploadDate: '2024-01-17',
    watchProgress: 0,
    isLiked: false,
    isBookmarked: false,
    tags: ['gaming', 'mobile', 'walkthrough']
  },
  {
    id: 9,
    title: 'Shopping Haul: Best Deals This Week',
    description: 'Latest shopping deals and discounts you don\'t want to miss',
    duration: '14:25',
    points: 25,
    category: 'shopping',
    difficulty: 'Easy',
    isWatched: false,
    isAvailable: true,
    views: 23450,
    likes: 987,
    thumbnail: 'https://picsum.photos/300/200?random=9',
    channel: 'DealHunter',
    uploadDate: '2024-01-21',
    watchProgress: 0,
    isLiked: false,
    isBookmarked: false,
    tags: ['shopping', 'deals', 'discounts']
  },
  {
    id: 10,
    title: 'Health Tips: Morning Routine for Energy',
    description: 'Start your day right with these energizing morning habits',
    duration: '11:40',
    points: 20,
    category: 'health',
    difficulty: 'Easy',
    isWatched: false,
    isAvailable: true,
    views: 34560,
    likes: 1567,
    thumbnail: 'https://picsum.photos/300/200?random=10',
    channel: 'HealthPlus',
    uploadDate: '2024-01-13',
    watchProgress: 0,
    isLiked: false,
    isBookmarked: false,
    tags: ['health', 'morning', 'energy']
  }
];

const videoCategories = [
  {
    id: 'all',
    title: 'All Videos',
    count: mockVideos.length,
    icon: <Film size={24} color="#FFD600" />
  },
  {
    id: 'education',
    title: 'Education',
    count: mockVideos.filter(video => video.category === 'education').length,
    icon: <GraduationCap size={24} color="#FFD600" />
  },
  {
    id: 'technology',
    title: 'Technology',
    count: mockVideos.filter(video => video.category === 'technology').length,
    icon: <Globe size={24} color="#FFD600" />
  },
  {
    id: 'health',
    title: 'Health & Fitness',
    count: mockVideos.filter(video => video.category === 'health').length,
    icon: <HeartIcon size={24} color="#FFD600" />
  },
  {
    id: 'cooking',
    title: 'Cooking',
    count: mockVideos.filter(video => video.category === 'cooking').length,
    icon: <Coffee size={24} color="#FFD600" />
  },
  {
    id: 'travel',
    title: 'Travel',
    count: mockVideos.filter(video => video.category === 'travel').length,
    icon: <Plane size={24} color="#FFD600" />
  },
  {
    id: 'music',
    title: 'Music',
    count: mockVideos.filter(video => video.category === 'music').length,
    icon: <Music size={24} color="#FFD600" />
  },
  {
    id: 'gaming',
    title: 'Gaming',
    count: mockVideos.filter(video => video.category === 'gaming').length,
    icon: <Gamepad2 size={24} color="#FFD600" />
  },
  {
    id: 'shopping',
    title: 'Shopping',
    count: mockVideos.filter(video => video.category === 'shopping').length,
    icon: <ShoppingBag size={24} color="#FFD600" />
  }
];

const difficultyColors = {
  Easy: '#10B981',
  Medium: '#F59E0B',
  Hard: '#EF4444'
};

const videoStats = {
  totalWatched: mockVideos.filter(v => v.isWatched).length,
  totalAvailable: mockVideos.filter(v => v.isAvailable).length,
  totalPoints: mockVideos.reduce((sum, video) => sum + video.points, 0),
  earnedPoints: mockVideos.filter(v => v.isWatched).reduce((sum, video) => sum + video.points, 0),
  averageDuration: '16 min',
  watchTime: '2h 15m'
};

export default function VideosScreen({ navigation }: any) {
  const [videos, setVideos] = useState(mockVideos);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const filteredVideos = videos.filter(video => {
    const matchesCategory = selectedCategory === 'all' || video.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || video.difficulty === selectedDifficulty;
    const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         video.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         video.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesDifficulty && matchesSearch;
  });

  const handleVideoPress = (video: any) => {
    if (!video.isAvailable) {
      Alert.alert('Video Unavailable', 'This video is not available at the moment. Please check back later.');
      return;
    }

    setCurrentVideo(video);
    setIsPlaying(true);
    
    Alert.alert(
      'Watch Video',
      `Ready to watch "${video.title}"?\n\nDuration: ${video.duration}\nPoints: ${video.points}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Watch', onPress: () => {
          // In a real app, you would open the video player
          Alert.alert('Video Started', 'Opening video player...');
          // Navigate to video player screen
        }}
      ]
    );
  };

  const handleLikePress = (videoId: number) => {
    setVideos(prevVideos => 
      prevVideos.map(video => 
        video.id === videoId 
          ? { ...video, isLiked: !video.isLiked, likes: video.isLiked ? video.likes - 1 : video.likes + 1 }
          : video
      )
    );
  };

  const handleBookmarkPress = (videoId: number) => {
    setVideos(prevVideos => 
      prevVideos.map(video => 
        video.id === videoId 
          ? { ...video, isBookmarked: !video.isBookmarked }
          : video
      )
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

  const formatViews = (views: number) => {
    if (views >= 1000000) {
      return (views / 1000000).toFixed(1) + 'M';
    } else if (views >= 1000) {
      return (views / 1000).toFixed(1) + 'K';
    }
    return views.toString();
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
          <Text className="text-xl font-bold text-white">Watch & Earn</Text>
          <TouchableOpacity 
            activeOpacity={0.7}
            onPress={() => {/* Refresh videos */}}
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
                <Play size={24} color="#FFD600" />
                <Text className="text-lg font-bold text-white ml-2">Video Stats</Text>
              </View>
              <View className="bg-yellow-500 px-3 py-1 rounded-full">
                <Text className="text-black font-bold text-sm">{videoStats.totalWatched}/{videoStats.totalAvailable}</Text>
              </View>
            </View>
            
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-gray-400 text-sm">Points Earned</Text>
                <Text className="text-white font-bold text-lg">{videoStats.earnedPoints}</Text>
              </View>
              <View>
                <Text className="text-gray-400 text-sm">Total Available</Text>
                <Text className="text-white font-bold text-lg">{videoStats.totalPoints}</Text>
              </View>
              <View>
                <Text className="text-gray-400 text-sm">Avg. Duration</Text>
                <Text className="text-white font-bold text-lg">{videoStats.averageDuration}</Text>
              </View>
              <View>
                <Text className="text-gray-400 text-sm">Watch Time</Text>
                <Text className="text-white font-bold text-lg">{videoStats.watchTime}</Text>
              </View>
            </View>
          </View>

          {/* Search Bar */}
          <View className="mx-4 mt-4">
            <View className="relative">
              <Search size={20} color="#9CA3AF" className="absolute left-3 top-3 z-10" />
              <TextInput
                className="bg-gray-800 rounded-xl pl-10 pr-4 py-3 text-white"
                placeholder="Search videos..."
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
              {videoCategories.map((category) => (
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
                      {category.count} videos
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

          {/* Videos List */}
          <View className="mx-4 mt-6 mb-6">
            <Text className="text-lg font-bold text-white mb-4">
              {filteredVideos.length} Available Videos
            </Text>
            
            {filteredVideos.length === 0 ? (
              <View className="bg-gray-800 rounded-xl p-8 items-center">
                <Play size={48} color="#6B7280" />
                <Text className="text-gray-400 text-lg font-semibold mt-4">No videos found</Text>
                <Text className="text-gray-500 text-sm text-center mt-2">
                  Try adjusting your filters or check back later for new videos
                </Text>
              </View>
            ) : (
              filteredVideos.map((video) => (
                <TouchableOpacity
                  key={video.id}
                  className={`bg-gray-800 rounded-xl mb-4 overflow-hidden ${
                    video.isWatched ? 'border-l-4 border-green-500' : ''
                  } ${!video.isAvailable ? 'opacity-50' : ''}`}
                  onPress={() => handleVideoPress(video)}
                  activeOpacity={0.8}
                  disabled={!video.isAvailable}
                >
                  {/* Thumbnail */}
                  <View className="relative">
                    <Image
                      source={{ uri: video.thumbnail }}
                      className="w-full h-48"
                      resizeMode="cover"
                    />
                    <View className="absolute inset-0 bg-black bg-opacity-30" />
                    <View className="absolute bottom-2 right-2 bg-black bg-opacity-70 px-2 py-1 rounded">
                      <Text className="text-white text-sm">{video.duration}</Text>
                    </View>
                    <View className="absolute top-2 left-2 bg-yellow-500 px-2 py-1 rounded">
                      <View className="flex-row items-center">
                        <Star size={12} color="#000" />
                        <Text className="text-black font-bold text-xs ml-1">{video.points}</Text>
                      </View>
                    </View>
                    {video.isWatched && (
                      <View className="absolute top-2 right-2 bg-green-500 px-2 py-1 rounded">
                        <CheckCircle size={16} color="#fff" />
                      </View>
                    )}
                    {!video.isAvailable && (
                      <View className="absolute inset-0 bg-gray-700 bg-opacity-50 items-center justify-center">
                        <Lock size={32} color="#fff" />
                        <Text className="text-white font-semibold mt-2">Coming Soon</Text>
                      </View>
                    )}
                  </View>
                  
                  {/* Video Info */}
                  <View className="p-4">
                    <View className="flex-row items-start justify-between mb-2">
                      <View className="flex-1">
                        <Text className={`font-semibold text-base ${
                          video.isWatched ? 'text-green-500' : 'text-white'
                        }`}>
                          {video.title}
                        </Text>
                        <Text className="text-gray-400 text-sm mt-1">{video.description}</Text>
                      </View>
                    </View>
                    
                    <View className="flex-row items-center justify-between mb-3">
                      <View className="flex-row items-center">
                        <Eye size={14} color="#9CA3AF" />
                        <Text className="text-gray-400 text-sm ml-1">{formatViews(video.views)} views</Text>
                      </View>
                      <View className="flex-row items-center">
                        <Clock size={14} color="#9CA3AF" />
                        <Text className="text-gray-400 text-sm ml-1">{video.duration}</Text>
                      </View>
                      <View className="bg-gray-700 px-2 py-1 rounded-full">
                        <Text className="text-gray-300 text-xs">{video.difficulty}</Text>
                      </View>
                    </View>
                    
                    <View className="flex-row items-center justify-between">
                      <Text className="text-gray-500 text-xs">{video.channel}</Text>
                      <Text className="text-gray-500 text-xs">{video.uploadDate}</Text>
                    </View>
                    
                    {/* Action Buttons */}
                    <View className="flex-row items-center justify-between mt-3 pt-3 border-t border-gray-700">
                      <TouchableOpacity
                        className="flex-row items-center"
                        onPress={() => handleLikePress(video.id)}
                      >
                        <Heart size={16} color={video.isLiked ? "#EF4444" : "#9CA3AF"} />
                        <Text className={`text-xs ml-1 ${video.isLiked ? 'text-red-500' : 'text-gray-400'}`}>
                          {video.likes}
                        </Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity
                        className="flex-row items-center"
                        onPress={() => handleBookmarkPress(video.id)}
                      >
                        <BookOpen size={16} color={video.isBookmarked ? "#FFD600" : "#9CA3AF"} />
                        <Text className={`text-xs ml-1 ${video.isBookmarked ? 'text-yellow-500' : 'text-gray-400'}`}>
                          Save
                        </Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity className="flex-row items-center">
                        <MessageCircle size={16} color="#9CA3AF" />
                        <Text className="text-gray-400 text-xs ml-1">Comment</Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity className="flex-row items-center">
                        <Share2 size={16} color="#9CA3AF" />
                        <Text className="text-gray-400 text-xs ml-1">Share</Text>
                      </TouchableOpacity>
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
                <Text className="text-white font-bold text-lg ml-3">Video Tips</Text>
              </View>
              <View className="space-y-2">
                <Text className="text-gray-400 text-sm">• Watch videos completely to earn full points</Text>
                <Text className="text-gray-400 text-sm">• Longer videos typically offer more points</Text>
                <Text className="text-gray-400 text-sm">• Like and share videos to help creators</Text>
                <Text className="text-gray-400 text-sm">• New videos are added daily</Text>
              </View>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
} 
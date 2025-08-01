import React, { useState, useRef, useEffect ,   } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, Dimensions, Animated, LayoutAnimation, UIManager, Platform, ScrollView, Alert } from 'react-native';
import YoutubeIframe from 'react-native-youtube-iframe';
import { ThumbsUp, ThumbsDown, Share2, Bookmark } from 'lucide-react-native';
import { useRoute } from '@react-navigation/native';
const videoData = [
  {
    id: '1',
    title: 'Sample Video 1',
    channel: 'Channel One',
    channelAvatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    thumbnail: 'https://img.youtube.com/vi/ysz5S6PUM-U/hqdefault.jpg',
    youtubeId: 'ysz5S6PUM-U',
    views: '1.2M',
    time: '2 days ago',
    description: 'This is a sample description for Video 1. #sample #video #reactnative',
  },
  {
    id: '2',
    title: 'Sample Video 2',
    channel: 'Channel Two',
    channelAvatar: 'https://randomuser.me/api/portraits/women/2.jpg',
    thumbnail: 'https://img.youtube.com/vi/ScMzIvxBSi4/hqdefault.jpg',
    youtubeId: 'ScMzIvxBSi4',
    views: '800K',
    time: '1 week ago',
    description: 'This is a sample description for Video 2. #demo #youtube',
  },
  {
    id: '3',
    title: 'Sample Video 3',
    channel: 'Channel Three',
    channelAvatar: 'https://randomuser.me/api/portraits/men/3.jpg',
    thumbnail: 'https://img.youtube.com/vi/jNQXAC9IVRw/hqdefault.jpg',
    youtubeId: 'jNQXAC9IVRw',
    views: '2.5M',
    time: '3 weeks ago',
    description: 'This is a sample description for Video 3. #fun #learning',
  },
];
 

const { width } = Dimensions.get('window');

const actions = [
  { key: 'like', label: 'Like', icon: '👍' },
  { key: 'dislike', label: 'Dislike', icon: '👎' },
  { key: 'share', label: 'Share', icon: '🔗' },
  { key: 'save', label: 'Save', icon: '💾' },
];

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const VideoPlayerScreen = () => {
  const route :any = useRoute();
  const { id } = route.params;
   
  const [selectedVideo, setSelectedVideo] = useState(videoData[0]);
  const [progress, setProgress] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [descExpanded, setDescExpanded] = useState(false);
  const [points, setPoints] = useState(0);
  const [showEarnModal, setShowEarnModal] = useState(false);
  const likeAnim = useRef(new Animated.Value(1)).current;
  const dislikeAnim = useRef(new Animated.Value(1)).current;

  // Autoplay next video and reward points
  const handleVideoEnd = () => {
    const currentIdx = videoData.findIndex(v => v.id === selectedVideo.id);
    const nextIdx = (currentIdx + 1) % videoData.length;
    setSelectedVideo(videoData[nextIdx]);
    setProgress(0);
    setPoints(prev => prev + 10); // Earn 10 points per video
    setShowEarnModal(true);
  };

  // Hide earn modal after 2 seconds
  useEffect(() => {
    if (showEarnModal) {
      const timer = setTimeout(() => setShowEarnModal(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [showEarnModal]);

  // Progress bar update
  const onProgress = (e) => {
    setProgress(e.playedSeconds / e.duration);
  };

  // Animated like/dislike
  const handleLike = () => {
    setIsLiked(!isLiked);
    setIsDisliked(false);
    Animated.sequence([
      Animated.timing(likeAnim, { toValue: 1.3, duration: 120, useNativeDriver: true }),
      Animated.timing(likeAnim, { toValue: 1, duration: 120, useNativeDriver: true }),
    ]).start();
  };
  const handleDislike = () => {
    setIsDisliked(!isDisliked);
    setIsLiked(false);
    Animated.sequence([
      Animated.timing(dislikeAnim, { toValue: 1.3, duration: 120, useNativeDriver: true }),
      Animated.timing(dislikeAnim, { toValue: 1, duration: 120, useNativeDriver: true }),
    ]).start();
  };

  // Expand/collapse description
  const toggleDesc = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setDescExpanded(!descExpanded);
  };

  const renderSuggestion = ({ item }) => (
    <TouchableOpacity
      className="flex-row mb-4"
      onPress={() => {
        setSelectedVideo(item);
        setProgress(0);
      }}
    >
      <Image
        source={{ uri: item.thumbnail }}
        className="w-32 h-20 rounded-lg bg-gray-200"
      />
      <View className="flex-1 ml-3 justify-center">
        <Text className="text-base font-semibold" numberOfLines={2}>{item.title}</Text>
        <Text className="text-xs text-gray-500 mt-1">{item.channel} • {item.views} views • {item.time}</Text>
      </View>
    </TouchableOpacity>
  );

  
  return (
    <ScrollView className="flex-1 bg-white" showsVerticalScrollIndicator={false}>
      <View>
        <YoutubeIframe
          height={width * 0.56}
          width={width}
          videoId={ id }
          play={true}
          onChangeState={state => {
            if (state === 'ended') handleVideoEnd();
          }}
          onProgress={onProgress}
        />
        {/* Play Video & Earn Banner */}
        <View className="flex-row items-center justify-between px-4 py-2 bg-yellow-100 rounded-lg mt-2 mb-2 mx-4">
          <Text className="font-bold text-yellow-700">Play Video & Earn</Text>
          <Text className="font-semibold text-yellow-700">Points: {points}</Text>
        </View>
        {/* Earned Points Modal */}
        {showEarnModal && (
          <View className="absolute top-24 left-0 right-0 items-center z-50">
            <View className="bg-green-500 px-6 py-3 rounded-lg shadow-lg">
              <Text className="text-white font-bold">🎉 You earned 10 points!</Text>
            </View>
          </View>
        )}
        {/* Progress Bar */}
        <View className="w-full h-1 bg-gray-200">
          <View style={{ width: `${progress * 100}%` }} className="h-1 bg-red-600" />
        </View>
      </View>
      <View className="px-4 pt-3">
        <Text className="text-lg font-bold" numberOfLines={2}>{selectedVideo.title}</Text>
        <Text className="text-xs text-gray-500 mt-1">{selectedVideo.views} views • {selectedVideo.time}</Text>
        {/* Expandable Description */}
        <TouchableOpacity onPress={toggleDesc} className="mt-2">
          <Text className="text-sm text-gray-700" numberOfLines={descExpanded ? undefined : 2}>
            {selectedVideo.description}
          </Text>
          <Text className="text-xs text-blue-600 mt-1">{descExpanded ? 'Show less' : 'Show more'}</Text>
        </TouchableOpacity>
        <View className="flex-row items-center justify-between mt-3">
          <View className="flex-row items-center">
            <Image source={{ uri: selectedVideo.channelAvatar }} className="w-9 h-9 rounded-full mr-3" />
            <Text className="font-semibold text-base">{selectedVideo.channel}</Text>
          </View>
          <TouchableOpacity className="bg-red-600 px-4 py-2 rounded-full">
            <Text className="text-white font-bold">SUBSCRIBE</Text>
          </TouchableOpacity>
        </View>
        {/* Action Row - Compact YouTube Style */}
        <View className="flex-row border-t top-3 border-gray-200 bg-white">
  <TouchableOpacity className="flex-1 items-center py-2">
    <ThumbsUp size={22} color="#757575" />
    <Text className="text-xs text-gray-500 mt-1">Like</Text>
  </TouchableOpacity>
  <TouchableOpacity className="flex-1 items-center py-2">
    <ThumbsDown size={22} color="#757575" />
    <Text className="text-xs text-gray-500 mt-1">Dislike</Text>
  </TouchableOpacity>
  <TouchableOpacity className="flex-1 items-center py-2">
    <Share2 size={22} color="#757575" />
    <Text className="text-xs text-gray-500 mt-1">Share</Text>
  </TouchableOpacity>
  <TouchableOpacity className="flex-1 items-center py-2">
    <Bookmark size={22} color="#757575" />
    <Text className="text-xs text-gray-500 mt-1">Save</Text>
  </TouchableOpacity>
</View>
      </View>
      <View className="h-px bg-gray-200 my-2" />
      <Text className="text-base font-bold px-4 mb-2">Suggested Videos</Text>
      <FlatList
        data={videoData.filter(v => v.id !== selectedVideo.id)}
        keyExtractor={item => item.id}
        renderItem={renderSuggestion}
        scrollEnabled={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
      />
    
     
    </ScrollView>
  );
};

export default VideoPlayerScreen; 
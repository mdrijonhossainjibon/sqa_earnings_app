import React from 'react';
import { View, Text, Image, TouchableOpacity, GestureResponderEvent } from 'react-native';
import Svg, { Path } from 'react-native-svg';

// Helper components
const UserAvatar = ({ source, online }: { source: any; online?: boolean }) => (
  <View className="relative">
    <Image source={source} className="w-10 h-10 rounded-full" />
    {online && (
      <View className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
    )}
  </View>
);

const PostAction = ({ path, text, onPress, onLongPress }: { path: string; text: string, onPress?: () => void, onLongPress?: (event: GestureResponderEvent) => void }) => (
  <TouchableOpacity 
    onPress={onPress}
    onLongPress={onLongPress}
    className="flex-row items-center justify-center flex-1 py-2 rounded-lg hover:bg-gray-100"
  >
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="gray">
      <Path d={path} stroke="gray" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
    <Text className="ml-2 text-gray-600 font-semibold">{text}</Text>
  </TouchableOpacity>
);

// Number formatting utility
const formatNumber = (num: number | undefined) => {
    if (num === undefined) return 0;
    if (num >= 1000000) return `${(num / 1000000).toFixed(1).replace(/\.0$/, '')}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1).replace(/\.0$/, '')}k`;
    return num;
};

const PostCard = ({ 
  post, 
  onLike, 
  onLongPressLike,
  onPressImage,
  onPressComment,
  onPressOptions,
}: { 
  post: any, 
  onLike: () => void, 
  onLongPressLike: (event: GestureResponderEvent) => void,
  onPressImage: () => void,
  onPressComment: () => void,
  onPressOptions: () => void,
}) => {
  return (
    <View className="bg-white my-2 shadow-md">
      <View className="p-4">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <UserAvatar source={post.avatar} online={!post.sponsored} />
            <View className="ml-3">
              <Text className="font-bold">{post.user}</Text>
              <Text className="text-xs text-gray-500">{post.time}</Text>
            </View>
          </View>
          <TouchableOpacity onPress={onPressOptions} className="p-2">
            <Svg width={24} height={24} viewBox="0 0 24 24" fill="gray">
              <Path d="M12 5c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm0 7c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm0 7c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2z" />
            </Svg>
          </TouchableOpacity>
        </View>
        <Text className="mt-3">{post.text}</Text>
      </View>
      {post.image && (
        <TouchableOpacity onPress={onPressImage}>
          <Image source={post.image} className="w-full h-64" />
        </TouchableOpacity>
      )}
      <View className="p-2 flex-row justify-between items-center">
        {post.likes ? <Text className="text-gray-500">
          {post.reaction ? post.reaction : '👍'} {formatNumber(post.likes)}
        </Text> : <View />}
        <Text className="text-gray-500">{formatNumber(post.comments?.length)} Comments</Text>
      </View>
      <View className="border-t border-gray-200 flex-row mx-2">
        <PostAction 
          path="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" 
          text={post.reaction ? post.reaction : 'Like'}
          onPress={onLike}
          onLongPress={onLongPressLike}
        />
        <PostAction 
          path="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" 
          text="Comment" 
          onPress={onPressComment}
        />
        <PostAction path="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" text="Share" />
      </View>
    </View>
  );
};

export default PostCard; 
import React, { useRef, useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Animated, Image, ActivityIndicator, StatusBar, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, BookOpen, PartyPopper, Clock, ExternalLink } from 'lucide-react-native';
import { API_CALL } from '../lib/api';
import { getItem } from '../asyncStorage';

export default function ReadingAndEarnScreen({ navigation }: any) {
  // State for reading packs
  const [readingItems, setReadingItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock user data
  const user = { name: 'fed', totalReadingPoints: 120, readingLevel: 2 };
  const readingBalance = user.totalReadingPoints || 0;
  const readingLevel = user.readingLevel || 1;

  // Animated bounce for reading badge
  const bounceAnim = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, { toValue: 1.15, duration: 400, useNativeDriver: true }),
        Animated.timing(bounceAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  // Fetch reading packs from API
  const fetchReadingPacks = async (isRefreshing = false) => {
    if (isRefreshing) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);
    try {
      const token = await getItem<string>('token');
      const { response, status } = await API_CALL({
        apiVersionUrl: 'barong',
        url: '/api/mobile/reading-packs',
        method: 'GET',
        headers: token ? { Authorization: `Bearer ${token}` } : undefined
      });
      if (status === 200 && response && Array.isArray(response.result)) {
        setReadingItems(response.result);
      } else {
        setError('Failed to load reading packs.');
      }
    } catch (err: any) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchReadingPacks();
  }, []);

  // Handle pull to refresh
  const onRefresh = () => {
    fetchReadingPacks(true);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <StatusBar barStyle="light-content" backgroundColor="#111827" translucent={false} />
      {/* Header */}
      <View className="flex-row items-center p-4 border-b border-gray-800">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-2">
          <ArrowLeft size={28} color="#FFD600" />
        </TouchableOpacity>
        <Text className="font-bold text-xl text-yellow-400 flex-1 text-center">Read & Earn</Text>
        <View className="w-8" />
      </View>
      <ScrollView 
        className="flex-1" 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#FFD600']}
            tintColor="#FFD600"
          />
        }
      >
        {/* User Points Card */}
        <View className="px-4 mt-6 mb-4">
          <View className="bg-gray-800 rounded-xl p-4 flex-row items-center border border-gray-700">
            <Animated.View style={{ transform: [{ scale: bounceAnim }] }}>
              <PartyPopper size={32} color="#a21caf" />
            </Animated.View>
            <View className="ml-4 flex-1">
              <Text className="text-white text-lg font-bold">Points: {readingBalance}</Text>
              <Text className="text-gray-400 text-xs">Level {readingLevel}</Text>
            </View>
            <BookOpen size={28} color="#FFD600" />
          </View>
        </View>
        {/* Divider */}
        <View className="mx-4 my-4 h-0.5 bg-gradient-to-r from-purple-200 to-indigo-200 rounded-full" />
        {/* Reading Packs List */}
        <Text className="mx-4 mb-2 text-lg font-semibold text-yellow-400">Reading Packs</Text>
        {loading && (
          <View className="mx-4 my-8 items-center justify-center">
            <ActivityIndicator size="large" color="#FFD600" />
            <Text className="text-yellow-400 mt-2">Loading reading packs...</Text>
          </View>
        )}
        {error && !loading && (
          <View className="mx-4 my-8 items-center justify-center">
            <Text className="text-red-500 font-semibold">{error}</Text>
          </View>
        )}
        {!loading && !error && readingItems.length === 0 && (
          <View className="mx-4 my-8 items-center justify-center">
            <Text className="text-gray-500">No reading packs available.</Text>
          </View>
        )}
        {!loading && !error && readingItems.map((item: any) => (
          <View key={item.id} className="mx-4 mb-4 bg-gray-800 rounded-xl flex-row items-center border border-gray-700 p-4">
            <Image source={{ uri: item.image }} style={{ width: 56, height: 56, borderRadius: 12, backgroundColor: '#eee' }} />
            <View className="ml-4 flex-1">
              <Text className="font-semibold text-white text-base">{item.title}</Text>
              <View className="flex-row items-center mt-1">
                <Text className="text-xs text-gray-400 mr-2">Earn {item.points} points</Text>
                <Clock size={12} color="#FFD600" />
                <Text className="text-xs text-gray-400 ml-1">{item.duration}</Text>
              </View>
            </View>
            <TouchableOpacity className="ml-2 px-4 py-2 bg-yellow-400 rounded-full" activeOpacity={0.8} onPress={() => navigation.navigate('ReadingDetail', { item })}>
              <Text className="text-gray-900 text-xs font-bold">Read</Text>
            </TouchableOpacity>
          </View>
        ))}
        {/* Info Section */}
        <View className="px-4 mb-8">
          <View className="bg-gray-800 rounded-xl p-4 border border-gray-700">
            <Text className="text-gray-400 text-sm mb-2 font-semibold">How it works:</Text>
            <Text className="text-gray-400 text-xs mb-1">• Select a reading pack and read the article</Text>
            <Text className="text-gray-400 text-xs mb-1">• Earn points for each completed reading</Text>
            <Text className="text-gray-400 text-xs mb-1">• Points help you level up and unlock rewards</Text>
            <Text className="text-gray-400 text-xs">• Check back daily for new reading packs</Text>
          </View>
        </View>
        {/* Spacer for bottom nav */}
        <View className="h-16" />
      </ScrollView>
    </SafeAreaView>
  );
} 
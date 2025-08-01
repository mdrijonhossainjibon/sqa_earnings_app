import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Keyboard, ToastAndroid, Linking } from 'react-native';
import { ArrowLeft, Search, Gift, Info, Clock } from 'lucide-react-native';

export default function SearchEarnScreen({ navigation }: any) {
  const [search, setSearch] = useState('');
  const [searchesDone, setSearchesDone] = useState(0);
  const [totalEarned, setTotalEarned] = useState(0.0);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (countdown > 0) {
      interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setIsSearching(false);
            setSearchesDone((prev) => prev + 1);
            setTotalEarned((prev) => +(prev + 0.05).toFixed(2));
            setRecentSearches((prev) => [search, ...prev.slice(0, 9)]);
            setSearch('');
            ToastAndroid.show('🎉 You earned $0.05!', ToastAndroid.SHORT);
            return 0;
          }
          // Show countdown in toast every 2 seconds
          if (prev % 2 === 0) {
            ToastAndroid.show(`⏰ ${prev} seconds remaining...`, ToastAndroid.SHORT);
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [countdown]);

  const handleSearch = async () => {
    if (!search.trim()) return;
    
    setIsSearching(true);
    setCountdown(10);
    const searchQuery = encodeURIComponent(search.trim());
    const searchUrl = `https://www.google.com/search?q=${searchQuery}`;
    
    try {
      // Open browser with search
      await Linking.openURL(searchUrl);
      ToastAndroid.show('🔍 Browser opened! Please wait 10 seconds...', ToastAndroid.SHORT);
      
    } catch (error) {
      setIsSearching(false);
      setCountdown(0);
      ToastAndroid.show('❌ Could not open browser', ToastAndroid.SHORT);
    }
  };

  return (
    <View className="flex-1 bg-gradient-to-b from-indigo-100 to-white">
      {/* Background Countdown Overlay */}
      {countdown > 0 && (
        <View className="absolute inset-0 bg-black/50 z-50 justify-center items-center">
          <View className="bg-white rounded-3xl p-8 shadow-2xl items-center">
            <Clock size={48} color="#10B981" />
            <Text className="text-6xl font-bold text-emerald-600 mt-4">{countdown}</Text>
            <Text className="text-lg text-gray-600 mt-2 text-center">
              seconds remaining
            </Text>
            <Text className="text-sm text-gray-500 mt-1 text-center">
              Please wait to earn your reward
            </Text>
          </View>
        </View>
      )}

      {/* Header */}
      <View className="flex-row items-center px-4 py-4 bg-white shadow-sm">
        <TouchableOpacity onPress={() => navigation.goBack()} className="flex-row items-center">
          <ArrowLeft size={24} color="#6366f1" />
          <Text className="ml-2 text-lg font-semibold text-indigo-700">Search & Earn</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-4 py-4">
        {/* Earnings Summary */}
        <View className="bg-white rounded-2xl p-4 mb-4 shadow-lg border border-indigo-100">
          <View className="flex-row items-center mb-2">
            <Gift size={22} color="#6366f1" />
            <Text className="ml-2 text-lg font-bold text-indigo-700">Search Earnings</Text>
          </View>
          <View className="flex-row justify-between mt-2">
            <View className="items-center">
              <Text className="text-2xl font-bold text-indigo-600">${totalEarned.toFixed(2)}</Text>
              <Text className="text-xs text-gray-500">Total Earned</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-emerald-600">{searchesDone}</Text>
              <Text className="text-xs text-gray-500">Searches Done</Text>
            </View>
          </View>
        </View>

        {/* Search Input */}
        <View className="flex-row items-center bg-white rounded-full shadow border border-indigo-100 px-4 py-2 mb-4">
          <Search size={22} color="#6366f1" />
          <TextInput
            className="flex-1 ml-2 text-base text-gray-800"
            placeholder="Type your search..."
            value={search}
            onChangeText={setSearch}
            editable={!isSearching}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          <TouchableOpacity
            className={`ml-2 px-4 py-2 rounded-full ${isSearching ? 'bg-indigo-200' : 'bg-indigo-500'}`}
            onPress={handleSearch}
            disabled={isSearching || !search.trim()}
            activeOpacity={0.8}
          >
            <Text className="text-white font-semibold">
              {isSearching ? `Wait ${countdown}s` : 'Search'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Recent Searches */}
        {recentSearches.length > 0 && (
          <View className="bg-white rounded-2xl p-4 mb-4 shadow border border-gray-100">
            <Text className="text-base font-semibold text-indigo-700 mb-2">Recent Searches</Text>
            {recentSearches.map((item, idx) => (
              <Text key={idx} className="text-sm text-gray-600 mb-1">• {item}</Text>
            ))}
          </View>
        )}

        {/* Info Section */}
        <View className="bg-white rounded-2xl p-4 mb-4 shadow border border-gray-100">
          <View className="flex-row items-center mb-2">
            <Info size={18} color="#6366f1" />
            <Text className="ml-2 text-base font-semibold text-indigo-700">How it works</Text>
          </View>
          <Text className="text-sm text-gray-600 mb-1">• Enter a unique search to earn rewards.</Text>
          <Text className="text-sm text-gray-600 mb-1">• Rewards are credited instantly after each search.</Text>
          <Text className="text-sm text-gray-600 mb-1">• Only unique searches are rewarded.</Text>
        </View>

        {/* Tips Section */}
        <View className="bg-white rounded-2xl p-4 mb-10 shadow border border-gray-100">
          <View className="flex-row items-center mb-2">
            <Clock size={16} color="#10B981" />
            <Text className="ml-2 text-base font-semibold text-emerald-700">Tips</Text>
          </View>
          <Text className="text-sm text-gray-600 mb-1">• Search regularly to maximize your earnings.</Text>
          <Text className="text-sm text-gray-600 mb-1">• Try trending topics for bonus rewards.</Text>
        </View>
      </ScrollView>
    </View>
  );
} 
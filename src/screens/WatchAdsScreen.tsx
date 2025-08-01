import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { ArrowLeft, Play, Gift, Info, Clock } from 'lucide-react-native';
import { RewardedAd, RewardedAdEventType, TestIds } from 'react-native-google-mobile-ads';

const adUnitId = __DEV__ ? TestIds.REWARDED : 'ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyyyyyy';

const rewarded = RewardedAd.createForAdRequest(adUnitId, {
  keywords: ['fashion', 'clothing'],
});

export default function WatchAdsScreen({ navigation }: any) {
  const [adsWatched, setAdsWatched] = useState(0);
  const [totalEarned, setTotalEarned] = useState(0.0);
  const [isWatching, setIsWatching] = useState(false);
 
  useEffect(() => {
    const unsubscribeLoaded = rewarded.addAdEventListener(RewardedAdEventType.LOADED, () => {
       
    });
    const unsubscribeEarned = rewarded.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      reward => {
        console.log('User earned reward of ', reward);
      },
    );

    // Start loading the rewarded ad straight away
    rewarded.load();

    // Unsubscribe from events on unmount
    return () => {
      unsubscribeLoaded();
      unsubscribeEarned();
    };
  }, []);


   /*  const unsubscribeLoaded = [
      rewarded.addAdEventListener(RewardedAdEventType.LOADED, () => rewarded.show()),
      rewarded.addAdEventListener(RewardedAdEventType.EARNED_REWARD, (reward) => {
        setAdsWatched((prev) => prev + 1);
        setTotalEarned((prev) => +(prev + 0.25).toFixed(2));
        setIsWatching(false)
        Alert.alert('Reward Earned!', `You earned ${reward?.amount} ${reward?.type}`);
      }),
     
    ]; */



  return (
    <View className="flex-1 bg-gradient-to-b from-indigo-100 to-white">
      {/* Header */}
      <View className="flex-row items-center px-4 py-4 bg-white shadow-sm">
        <TouchableOpacity onPress={() => navigation.goBack()} className="flex-row items-center">
          <ArrowLeft size={24} color="#6366f1" />
          <Text className="ml-2 text-lg font-semibold text-indigo-700">Watch Ads</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-4 py-4">
        {/* Earnings Summary */}
        <View className="bg-white rounded-2xl p-4 mb-4 shadow-lg border border-emerald-100">
          <View className="flex-row items-center mb-2">
            <Gift size={22} color="#10B981" />
            <Text className="ml-2 text-lg font-bold text-emerald-700">Ad Earnings</Text>
          </View>
          <View className="flex-row justify-between mt-2">
            <View className="items-center">
              <Text className="text-2xl font-bold text-emerald-600">${totalEarned.toFixed(2)}</Text>
              <Text className="text-xs text-gray-500">Total Earned</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-indigo-600">{adsWatched}</Text>
              <Text className="text-xs text-gray-500">Ads Watched</Text>
            </View>
          </View>
        </View>

        {/* Watch Ad Button */}
        <View className="items-center my-6">
          <TouchableOpacity
            className={`flex-row items-center justify-center bg-emerald-500 px-8 py-4 rounded-full shadow-lg ${isWatching ? 'opacity-60' : ''}`}
            activeOpacity={0.8}
            onPress={ () => rewarded.show() }
            disabled={isWatching}
          >
            <Play size={28} color="#fff" />
            <Text className="ml-3 text-white text-lg font-bold">{isWatching ? 'Loading...' : 'Watch Ad'}</Text>
          </TouchableOpacity>
          <Text className="mt-2 text-xs text-gray-400">Earn $0.10 - $0.60 per ad watched</Text>
        </View>

        {/* Info Section */}
        <View className="bg-white rounded-2xl p-4 mb-4 shadow border border-gray-100">
          <View className="flex-row items-center mb-2">
            <Info size={18} color="#6366f1" />
            <Text className="ml-2 text-base font-semibold text-indigo-700">How it works</Text>
          </View>
          <Text className="text-sm text-gray-600 mb-1">• Watch a full ad to receive your reward.</Text>
          <Text className="text-sm text-gray-600 mb-1">• Rewards are credited instantly after each ad.</Text>
          <Text className="text-sm text-gray-600 mb-1">• Some ads may offer bonus rewards.</Text>
        </View>

        {/* Tips Section */}
        <View className="bg-white rounded-2xl p-4 mb-10 shadow border border-gray-100">
          <View className="flex-row items-center mb-2">
            <Clock size={16} color="#10B981" />
            <Text className="ml-2 text-base font-semibold text-emerald-700">Tips</Text>
          </View>
          <Text className="text-sm text-gray-600 mb-1">• Watch ads during breaks for quick earnings.</Text>
          <Text className="text-sm text-gray-600 mb-1">• Check back daily for new ad opportunities.</Text>
        </View>
      </ScrollView>
    </View>
  );
} 
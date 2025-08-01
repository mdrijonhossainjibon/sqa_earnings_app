import React from 'react';
import { View, Text, Animated, TouchableOpacity } from 'react-native';
import { Coins, Trophy, Info } from 'lucide-react-native';

interface BalanceCardProps {
  balance: number;
  level: number;
  progressAnim: Animated.Value;
  progress: number;
  bounceAnim: Animated.Value;
  onWithdraw?: () => void;
}

const BalanceCard: React.FC<BalanceCardProps> = ({ balance, level, progressAnim, progress, bounceAnim, onWithdraw }) => (
  <View className="mx-4 mt-2 rounded-2xl p-0.5 bg-gray-800">
    <View className="rounded-2xl p-5">
      <View className="flex-row justify-between items-center mb-2">
        <View className="flex-row items-center gap-2">
          <Coins size={22} color="#FFD600" />
          <View>
            <Text className="text-3xl text-white font-bold drop-shadow-lg">${balance.toFixed(2)}</Text>
            <Text className="text-sm text-gray-400 font-normal">Current Balance</Text>
          </View>
        </View>
        <Animated.View style={{ transform: [{ scale: bounceAnim }] }} className="flex-row items-center bg-yellow-400/10 rounded-lg px-3 py-1">
          <Trophy size={20} color="#FFD600" />
          <Text className="text-yellow-400 font-semibold ml-1.5">Level {level}</Text>
        </Animated.View>
      </View>
      {/* Withdraw Button */}
      {onWithdraw && (
        <View className="my-2">
          <Text className="text-xs text-gray-400 mb-1">Ready to cash out?</Text>
          <View className="flex-row">
            <Text className="flex-1" />
            <Text className="flex-1" />
            <TouchableOpacity
              className="bg-yellow-400 px-4 py-2 rounded-lg items-center"
              onPress={onWithdraw}
              activeOpacity={0.8}
            >
              <Text className="text-gray-900 font-semibold">Withdraw</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      <View className="flex-row items-center gap-1 mb-1">
        <Text className="text-gray-400 text-xs">Progress to Level {level + 1}</Text>
        <Info size={14} color="#FFD600" />
      </View>
      <View className="h-2 bg-gray-700 rounded w-full my-1 overflow-hidden">
        <Animated.View className="h-2 rounded" style={{ width: progressAnim.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] }), backgroundColor: '#FFD600' }} />
      </View>
      <Text className="text-gray-400 text-xs text-right">${progress}/100</Text>
      <Text className="text-xs text-yellow-400 mt-1">Complete more to level up!</Text>
    </View>
  </View>
);

export default BalanceCard; 
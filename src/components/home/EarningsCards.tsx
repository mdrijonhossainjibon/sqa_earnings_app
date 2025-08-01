import React from 'react';
import { View, Text } from 'react-native';
import { Gift, Users, UserPlus } from 'lucide-react-native';

interface EarningsCardsProps {
  user: { totalEarned: number };
  totalEarnedDisplay: string;
  referralEarnings: number;
  referralEarningsDisplay: string;
}

const EarningsCards: React.FC<EarningsCardsProps> = ({ user, totalEarnedDisplay, referralEarnings, referralEarningsDisplay }) => (
  <View className="flex-row justify-between mx-4 mb-4 gap-3">
    <View className="flex-1 bg-gray-800 rounded-xl p-4 items-center">
      <Gift size={22} color="#FFD600" />
      <Text className="text-xs text-gray-400 mt-1 mb-0.5">Total Earned</Text>
      {user.totalEarned === 0 ? (
        <View className="items-center mt-1">
          <Text className="text-xs text-gray-500">No earnings yet!</Text>
          <Gift size={16} color="#444" />
        </View>
      ) : (
        <Text className="text-lg text-yellow-400 font-bold drop-shadow">{totalEarnedDisplay}</Text>
      )}
    </View>
    <View className="w-0.5 bg-gray-700 mx-1 rounded-full" />
    <View className="flex-1 bg-gray-800 rounded-xl p-4 items-center">
      <Users size={22} color="#FFD600" />
      <Text className="text-xs text-gray-400 mt-1 mb-0.5">Referral Earnings</Text>
      {referralEarnings === 0 ? (
        <View className="items-center mt-1">
          <Text className="text-xs text-gray-500">No referrals yet!</Text>
          <UserPlus size={16} color="#444" />
        </View>
      ) : (
        <Text className="text-lg text-yellow-400 font-bold drop-shadow">{referralEarningsDisplay}</Text>
      )}
    </View>
  </View>
);

export default EarningsCards; 
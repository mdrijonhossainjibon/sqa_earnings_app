import React from 'react';
import { View, Text } from 'react-native';
import { Info } from 'lucide-react-native';

interface RecentActivityItem {
  icon: React.ReactNode;
  label: string;
  time: string;
}

interface RecentActivityProps {
  recentActivity: RecentActivityItem[];
}

const RecentActivity: React.FC<RecentActivityProps> = ({ recentActivity }) => (
  <View className="bg-white/70 backdrop-blur-md rounded-xl mx-4 p-4 mb-10 shadow-lg border border-fuchsia-100">
    {recentActivity.length === 0 ? (
      <View className="flex-row items-center gap-2">
        <Info size={16} color="#f59e42" />
        <Text className="text-xs text-gray-400">No recent activity yet!</Text>
      </View>
    ) : recentActivity.map((item, idx) => (
      <View key={idx} className="flex-row items-center justify-between mb-2">
        <View className="flex-row items-center gap-2">{item.icon}<Text className="text-xs text-gray-700">{item.label}</Text></View>
        <Text className="text-xs text-gray-400">{item.time}</Text>
      </View>
    ))}
  </View>
);

export default RecentActivity; 
import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { UserPlus, Share2, Gift } from 'lucide-react-native';

const InviteBanner: React.FC = () => {
  // Pulse animation for the Invite button
  const pulseAnim = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.12, duration: 600, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  // Mock: number of friends invited and reward preview
  const invitedCount = 3;
  const rewardPreview = '$0.50';

  return (
    <View className="mx-4 mt-4 mb-2 rounded-2xl overflow-hidden bg-gray-800">
      <View className="flex-row items-center justify-between px-4 py-4 relative">
        {/* Left: Icon and Text */}
        <View className="flex-row items-center gap-3">
          <UserPlus size={28} color="#FFD600" />
          <View>
            <Text className="text-yellow-400 font-bold text-base">Invite Friends & Earn!</Text>
            <View className="flex-row items-center mt-1">
              <Gift size={16} color="#FFD600" />
              <Text className="text-yellow-400 ml-1 text-xs">Earn {rewardPreview} per invite</Text>
            </View>
            <Text className="text-gray-400 text-xs mt-0.5">{invitedCount} friends invited</Text>
          </View>
        </View>
        {/* Right: Animated Invite Button */}
        <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
          <TouchableOpacity className="flex-row items-center bg-yellow-400/10 px-4 py-2 rounded-full" activeOpacity={0.85} onPress={() => {}}>
            <Share2 size={18} color="#FFD600" />
            <Text className="text-yellow-400 ml-2 text-base font-semibold">Invite</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
};

export default InviteBanner; 
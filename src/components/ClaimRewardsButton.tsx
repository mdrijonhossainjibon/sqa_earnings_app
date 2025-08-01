import React, { useRef } from 'react';
import { Text, TouchableOpacity, Animated, View, StyleProp, ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Gift } from 'lucide-react-native';

interface ClaimRewardsButtonProps {
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  className?: string;
}

const ClaimRewardsButton: React.FC<ClaimRewardsButtonProps> = ({ onPress, style, className }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const handlePressIn = () => {
    Animated.spring(scaleAnim, { toValue: 0.97, useNativeDriver: true }).start();
  };
  const handlePressOut = () => {
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();
  };

  return (
    <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, style]}>
      <TouchableOpacity
        activeOpacity={0.85}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        className={`flex-row items-center justify-center bg-gradient-to-r from-emerald-400 to-fuchsia-400 py-3 rounded-xl shadow-lg ${className || ''}`}
      >
        <Gift size={22} color="#fff" />
        <Text className="text-white font-bold text-base ml-2">Claim Rewards</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default ClaimRewardsButton; 
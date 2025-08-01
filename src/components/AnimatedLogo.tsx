import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Path, Circle } from 'react-native-svg';

interface AnimatedLogoProps {
  isDarkMode: boolean;
}

const AnimatedLogo: React.FC<AnimatedLogoProps> = ({ isDarkMode }) => {
  const gradientColors = {
    start: isDarkMode ? '#22d3ee' : '#3b82f6',  // cyan-400 / blue-500
    end: isDarkMode ? '#3b82f6' : '#06b6d4',    // blue-500 / cyan-500
  };

  return (
    <View className="flex-row items-center space-x-2">
      <Svg width={32} height={32} viewBox="0 0 50 50">
        <Defs>
          <LinearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={gradientColors.start} />
            <Stop offset="100%" stopColor={gradientColors.end} />
          </LinearGradient>
        </Defs>

        {/* S shape */}
        <Path
          d="M15 20C15 15 20 15 25 15C30 15 35 15 35 20C35 30 15 25 15 35C15 40 20 40 25 40C30 40 35 40 35 35"
          stroke="url(#logoGradient)"
          strokeWidth={4}
          strokeLinecap="round"
          fill="none"
        />

        {/* Q Circle */}
        <Circle
          cx="25"
          cy="25"
          r="20"
          stroke="url(#logoGradient)"
          strokeWidth={4}
          fill="none"
        />

        {/* A shape */}
        <Path
          d="M20 35L25 15L30 35M22 28H28"
          stroke="url(#logoGradient)"
          strokeWidth={4}
          strokeLinecap="round"
          fill="none"
        />
      </Svg>

      <Text
        className={`
          text-xl font-bold
          bg-clip-text text-transparent
          ${isDarkMode ? 'text-cyan-400' : 'text-blue-500'}
        `}
      >
        SQA
      </Text>
    </View>
  );
};

export default AnimatedLogo;

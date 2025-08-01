import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import Svg, { Path, Circle, Text as SvgText } from 'react-native-svg';
import changeNavigationBarColor  ,{ hideNavigationBar  } from 'react-native-navigation-bar-color';
import {
  createStaticNavigation,
  useNavigation,
} from '@react-navigation/native';

const Icon = ({ path, color }: { path: string; color: string }) => (
  <Svg width={28} height={28} viewBox="0 0 24 24" fill="none">
    <Path d={path} stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const InviteIcon = ({ color = '#22c55e' }) => (
  <Svg width={28} height={28} viewBox="0 0 24 24" fill="none">
    <Path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    <Circle cx={9} cy={7} r={4} stroke={color} strokeWidth={2} />
    <Path d="M20 8v6M23 11h-6" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </Svg>
);

const PlayIcon = ({ color = '#facc15' }) => (
  <Svg width={28} height={28} viewBox="0 0 24 24" fill="none">
    <Circle cx={12} cy={12} r={11} stroke={color} strokeWidth={2} fill="none" />
    <Path d="M10 8l6 4-6 4V8z" fill={color} />
  </Svg>
);

const BottomNavBar = ({ style }: { style?: any }) => {
  
  setTimeout(() => {
    //changeNavigationBarColor('transparent', true);
    hideNavigationBar()
  }, 1000);

  const navigation : any = useNavigation();
 
  return (
    <View className="absolute bottom-0 left-0 right-0 h-20 bg-[#181A20] flex-row items-center justify-around border-t border-[#23272f] shadow-2xl" style={style}>
      
      {/* Home */}
      <TouchableOpacity className="items-center" onPress={() => navigation.navigate('Home')}>
        <Icon
          color="#facc15"
          path="M3 9.5L12 3l9 6.5V21a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z"
        />
        
        <Text className="text-yellow-400 text-xs mt-1">Home</Text>
      </TouchableOpacity>

      {/* Rewards */}
      <TouchableOpacity className="items-center" onPress={() => navigation.navigate('RewardsScreen')}>
        <Svg width={28} height={28} viewBox="0 0 32 32" fill="none">
          <Circle cx={16} cy={16} r={16} fill="#facc15" />
          <SvgText x={16} y={22} textAnchor="middle" fontSize={18} fill="#181A20" fontWeight="bold">🎁</SvgText>
        </Svg>
        <Text className="text-yellow-400 text-xs mt-1">Rewards</Text>
      </TouchableOpacity>

      {/* Watch Ads */}
      <TouchableOpacity className="items-center" onPress={() => navigation.navigate('WatchAdsScreen')}>
        <PlayIcon color="#facc15" />
        <Text className="text-yellow-400 text-xs mt-1">Watch Ads</Text>
      </TouchableOpacity>

      {/* Invaite */}
      <TouchableOpacity className="items-center" onPress={() => navigation.navigate('InviteScreen')}>
        <InviteIcon color="#22c55e" />
        <Text className="text-green-400 text-xs mt-1">Invaite</Text>
      </TouchableOpacity>

      {/* Wallet */}
      <TouchableOpacity className="items-center" onPress={() => navigation.navigate('Wallet')}>
        <Icon
          color="#a78bfa"
          path="M2 7a2 2 0 012-2h16a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V7zm14 4h2a1 1 0 100-2h-2a1 1 0 000 2z"
        />
        <Text className="text-purple-400 text-xs mt-1">Wallet</Text>
      </TouchableOpacity>

      {/* Profile */}
      <TouchableOpacity className="items-center">
        <Icon
          color="#94a3b8"
          path="M12 12c2.761 0 5-2.239 5-5S14.761 2 12 2 7 4.239 7 7s2.239 5 5 5zm0 2c-3.866 0-7 3.134-7 7h14c0-3.866-3.134-7-7-7z"
        />
        <Text className="text-gray-400 text-xs mt-1">Profile</Text>
      </TouchableOpacity>

    </View>
  );
};

export default BottomNavBar;

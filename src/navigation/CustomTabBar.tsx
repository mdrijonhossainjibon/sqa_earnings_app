import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { ArrowUpRight, Shuffle, Plus, Wallet, Clock } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColorScheme } from 'react-native';

const TABS = [
  {
    name: 'Home',
    label: 'Home',
    icon: ArrowUpRight,
  },
  {
    name: 'Swap',
    label: 'Swap',
    icon: Shuffle,
  },
  {
    name: 'Deposit',
    label: 'Deposit',
    icon: Plus,
  },
  {
    name: 'Wallet',
    label: 'Wallet',
    icon: Wallet,
  },
  {
    name: 'History',
    label: 'History',
    icon: Clock,
  },
];

export default function CustomTabBar({ state, descriptors, navigation }) {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  return (
    <View
      className="flex-row justify-around items-center border-t border-[#23262F] bg-[#181A20]"
      style={{ paddingBottom: insets.bottom, paddingTop: 6 }}
    >
      {TABS.map((tab, idx) => {
        const isFocused = state.index === idx;
        const Icon = tab.icon;
        return (
          <TouchableOpacity
            key={tab.name}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={descriptors[state.routes[idx].key]?.options.tabBarAccessibilityLabel}
            testID={descriptors[state.routes[idx].key]?.options.tabBarTestID}
            onPress={() => {
              const event = navigation.emit({
                type: 'tabPress',
                target: state.routes[idx].key,
                canPreventDefault: true,
              });
              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(tab.name);
              }
            }}
            className="flex-1 items-center"
            activeOpacity={0.8}
          >
            <Icon
              size={26}
              color={isFocused ? '#FFD600' : '#A3A3A3'}
            />
            <Text className={`text-xs mt-1 font-semibold ${isFocused ? 'text-[#FFD600]' : 'text-zinc-400'}`}>{tab.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
} 
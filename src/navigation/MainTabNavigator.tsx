import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import WalletScreen from '../screens/WalletScreen';
import SwapScreen from '../screens/SwapScreen';
import DepositScreen from '../screens/DepositScreen';
import HistoryScreen from '../screens/HistoryScreen';
import CustomTabBar from './CustomTabBar';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      id={undefined}
      tabBar={(props: BottomTabBarProps) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
      />
      <Tab.Screen
        name="Swap"
        component={SwapScreen}
      />
      <Tab.Screen
        name="Deposit"
        component={DepositScreen}
      />
      <Tab.Screen
        name="Wallet"
        component={WalletScreen}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
      />
    </Tab.Navigator>
  );
} 
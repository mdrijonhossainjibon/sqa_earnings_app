import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SheetProvider } from 'react-native-actions-sheet';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import SidebarMenu from '../components/SidebarMenu';

// Import screens
import SplashScreen from '../screens/SplashScreen';
import HomeScreen from '../screens/HomeScreen';
import RewardsScreen from '../screens/RewardsScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import ProfileScreen from '../screens/ProfileScreen';
import PrivacySettingsScreen from '../screens/PrivacySettingsScreen';
import AccountSettingsScreen from '../screens/AccountSettingsScreen';
import LoginScreen from '../screens/LoginScreen';
import EmailVerificationScreen from '../screens/EmailVerificationScreen';
import SignUpScreen from '../screens/SignUpScreen';
import OTPScreen from '../screens/OTPScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import LinkVerificationScreen from '../screens/LinkVerificationScreen';
 
import WatchAdsScreen from '../screens/WatchAdsScreen';
import SearchEarnScreen from '../screens/SearchEarnScreen';
import WatchVideosScreen from '../screens/WatchVideosScreen';
import VideoPlayerScreen from '../screens/VideoPlayerScreen';
import ReadingAndEarnScreen from '../screens/ReadingAndEarnScreen';
import ReadingDetailScreen from '../screens/ReadingDetailScreen';
import ReferFriendScreen from '../screens/ReferFriendScreen';
import ReferralFAQScreen from '../screens/ReferralFAQScreen';
import VisitLinkEarnScreen from '../screens/VisitLinkEarnScreen';
import BrowserScreen from '../screens/BrowserScreen';
import WithdrawScreen from '../screens/WithdrawScreen';
import MainTabNavigator from './MainTabNavigator';
import TransactionDetailScreen from '../screens/TransactionDetailScreen';
import CouponClaimScreen from '../screens/CouponClaimScreen';
import WalletScreen from '../screens/WalletScreen';
import SwapScreen from '../screens/SwapScreen';
import GFPayScreen from '../screens/GFPayScreen';
import LeaderboardScreen from '../screens/LeaderboardScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import SupportScreen from '../screens/SupportScreen';
import PrivacyScreen from '../screens/PrivacyScreen';
import AboutScreen from '../screens/AboutScreen';
import FAQScreen from '../screens/FAQScreen';
import TaskScreen from '../screens/TaskScreen';
import SurveysScreen from '../screens/SurveysScreen';
import LinksScreen from '../screens/LinksScreen';
 
import VideosScreen from '../screens/VideosScreen';
import AccountSuspendedScreen from '../screens/AccountSuspendedScreen';
import SubmitAppealScreen from '../screens/SubmitAppealScreen';
import MaintenanceScreen from '../screens/MaintenanceScreen';
import ActivitiesScreen from '../screens/ActivitiesScreen';
import QRCodeScanScreen from '../screens/QRCodeScanScreen';
import QRCodeDetailsScreen from '../screens/QRCodeDetailsScreen';
import FailedApproveScreen from '../screens/FailedApproveScreen';
import EarnScreen from '../screens/EarnScreen';
import SpinAndEarnScreen from '../screens/SpinAndEarnScreen';
import AppUpdateScreen from '../screens/AppUpdateScreen';
 

const Stack : any = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const linking = {
  prefixes: ['https://sqa-earnings.vercel.app', 'sqa://'],
  config: {
    screens: {
      Home: 'en/app/home',
      Profile: 'en/app/profile',
      ReferralFAQ : 'en/app/referral-faq'
    },
  },
};

const DrawerNavigator = () => (
  <Drawer.Navigator
    id={undefined}
    screenOptions={{
      headerShown: false,
      drawerStyle: {
        backgroundColor: '#111827',
        width: 300,
      },
    }}
    drawerContent={props => <SidebarMenu {...props as any} />}
  >
    <Drawer.Screen name="MainTabs" component={MainTabNavigator} />
    <Drawer.Screen name="Profile" component={ProfileScreen} />
    <Drawer.Screen name="Deposit" component={WalletScreen} />
    <Drawer.Screen name="Swap" component={SwapScreen} />
    <Drawer.Screen name="Wallet" component={WalletScreen} />
    <Drawer.Screen name="History" component={WithdrawScreen} />
  </Drawer.Navigator>
);

// Root Navigator
const AppNavigator = () => {
  return (
    
    <SheetProvider>
      <GestureHandlerRootView>

      
      <NavigationContainer linking={linking}>
        <Stack.Navigator screenOptions={{ headerShown:false }} initialRouteName="Splash" >
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Main" component={DrawerNavigator} />
          <Stack.Screen name="Reward" component={RewardsScreen} />
          <Stack.Screen name="Activities" component={ ActivitiesScreen } />
          <Stack.Screen name="EditProfile" component={EditProfileScreen} />
          <Stack.Screen name="SpinAndEarn" component={ SpinAndEarnScreen} />
          
          <Stack.Screen name="PrivacySettings" component={PrivacySettingsScreen} />
          <Stack.Screen name="AccountSettings" component={AccountSettingsScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
          <Stack.Screen name="OTP" component={OTPScreen} />
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
          <Stack.Screen name="EmailVerification" component={ EmailVerificationScreen } />
          <Stack.Screen name="LinkVerification" component={ LinkVerificationScreen } />
          
          <Stack.Screen name="ads" component={ WatchAdsScreen } />
          <Stack.Screen name="searches" component={ SearchEarnScreen } />
          {/* <Stack.Screen name="videos" component={ WatchVideosScreen } /> */}
          <Stack.Screen name="VideoPlayer" component={ VideoPlayerScreen } />
          <Stack.Screen name="reading" component={  ReadingAndEarnScreen } />
          <Stack.Screen name="ReadingDetail" component={ ReadingDetailScreen } />
          <Stack.Screen name="ReferFriend" component={ ReferFriendScreen } />
          <Stack.Screen name="ReferralFAQ" component={ ReferralFAQScreen } />
          <Stack.Screen name="links" component={ VisitLinkEarnScreen } />
          <Stack.Screen name="Browser" component={ BrowserScreen } />
          <Stack.Screen name="Withdraw" component={ WithdrawScreen } />
          <Stack.Screen name="TransactionDetail" component={ TransactionDetailScreen } />
          <Stack.Screen name="CouponClaim" component={ CouponClaimScreen } />
          <Stack.Screen name="Wallet" component={WalletScreen} />
          <Stack.Screen name="Swap" component={SwapScreen} />
          <Stack.Screen name="GFPay" component={GFPayScreen} />
          <Stack.Screen name="Leaderboard" component={LeaderboardScreen} />
          <Stack.Screen name="Notifications" component={NotificationsScreen} />
          <Stack.Screen name="Support" component={SupportScreen} />
          <Stack.Screen name="Privacy" component={PrivacyScreen} />
          <Stack.Screen name="About" component={AboutScreen} />
          <Stack.Screen name="FAQ" component={FAQScreen} />
          <Stack.Screen name="Task" component={TaskScreen} />
          <Stack.Screen name="Surveys" component={SurveysScreen} />
          <Stack.Screen name="Links" component={LinksScreen} />
          
          <Stack.Screen name="Videos" component={VideosScreen} />
          <Stack.Screen name="AccountSuspended" component={ AccountSuspendedScreen } />
          <Stack.Screen name="SubmitAppeal" component={ SubmitAppealScreen } />
          <Stack.Screen name="Maintenance" component={ MaintenanceScreen } />
          <Stack.Screen name="QRScan" component={QRCodeScanScreen} />
          <Stack.Screen name="QRCodeDetails" component={QRCodeDetailsScreen} />
          <Stack.Screen name="FailedApprove" component={FailedApproveScreen} />
          <Stack.Screen name="Profile" component={ ProfileScreen } />
          <Stack.Screen name="Earn" component={ EarnScreen } />
          <Stack.Screen name="AppUpdate" component={ AppUpdateScreen } />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
    </SheetProvider>
    
  );
};

export default AppNavigator; 
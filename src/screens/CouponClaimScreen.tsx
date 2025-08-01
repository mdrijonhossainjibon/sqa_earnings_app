import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, StatusBar, FlatList, Pressable, Vibration, Alert, ToastAndroid, Platform } from 'react-native';
import { ArrowLeft, Gift, Copy, CheckCircle, XCircle, Clock, Star, Zap, DollarSign, Users, Calendar, PartyPopper, Loader, RefreshCw, Crown, Coins, Lightbulb, AlertTriangle, Timer } from 'lucide-react-native';
import ActionSheet, { ActionSheetRef, SheetManager } from 'react-native-actions-sheet';
import { SafeAreaView } from 'react-native-safe-area-context';
import { API_CALL } from '../lib/api';
import { getItem } from '../asyncStorage';

// Types
interface Coupon {
  id: string;
  code: string;
  title: string;
  description: string;
  reward: string;
  rewardType: 'percentage' | 'crypto' | 'cashback' | 'points';
  minDeposit: number;
  maxReward: number;
  expiresIn: string;
  isPopular: boolean;
  icon: React.ReactElement;
  color: string;
  isAvailable: boolean;
}

interface ClaimedCoupon {
  id: string;
  code: string;
  title: string;
  reward: string;
  claimedAt: string;
  status: 'claimed' | 'pending' | 'failed';
  value: number;
  transactionId: string;
}

export default function CouponClaimScreen({ navigation }: any) {
  const [couponCode, setCouponCode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [claimedReward, setClaimedReward] = useState('');
  const [claimedCouponTitle, setClaimedCouponTitle] = useState('');
  const [transactionId, setTransactionId] = useState('');

  // API Data States
  const [availableCoupons, setAvailableCoupons] = useState<Coupon[]>([]);
  const [claimedCoupons, setClaimedCoupons] = useState<ClaimedCoupon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Toast function
  const showToast = (message: string) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      Alert.alert('Info', message);
    }
  };

  // Helper function to get icon component based on icon name
  const getIconForCoupon = (iconName: string, color: string): React.ReactElement => {
    switch (iconName.toLowerCase()) {
      case 'gift':
        return <Gift size={24} color={color} />;
      case 'crown':
        return <Crown size={24} color={color} />;
      case 'coins':
        return <Coins size={24} color={color} />;
      case 'dollar':
      case 'cashback':
        return <DollarSign size={24} color={color} />;
      case 'star':
        return <Star size={24} color={color} />;
      case 'zap':
        return <Zap size={24} color={color} />;
      default:
        return <Gift size={24} color={color} />;
    }
  };

  // Fetch available coupons from API
  const fetchAvailableCoupons = async () => {
    try {
      const token = await getItem<string>('token');
      if (!token) {
        showToast('Authentication required');
        return;
      }

      const { response, status } = await API_CALL({
        apiVersionUrl: 'barong',
        url: '/api/mobile/coupons/available',
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (status === 200 && response) {
        const coupons = (response as any).coupons || [];
        setAvailableCoupons(coupons.map((coupon: any) => ({
          id: coupon.id || coupon.code,
          code: coupon.code,
          title: coupon.title || coupon.name,
          description: coupon.description,
          reward: coupon.reward_amount || coupon.reward,
          rewardType: coupon.reward_type || 'points',
          minDeposit: coupon.min_deposit || 0,
          maxReward: coupon.max_reward || 0,
          expiresIn: coupon.expires_in || '7 days',
          isPopular: coupon.is_popular || false,
          icon: getIconForCoupon(coupon.icon || 'gift', coupon.color || '#FF6B6B'),
          color: coupon.color || '#FF6B6B',
          isAvailable: coupon.is_available !== false
        })));
      } else {
        setAvailableCoupons([]);
      }
    } catch (error: any) {
      console.log('Failed to fetch coupons:', error.message);
      setAvailableCoupons([]);
    }
  };

  // Fetch claimed coupons history from API
  const fetchClaimedCoupons = async () => {
    try {
      const token = await getItem<string>('token');
      if (!token) return;

      const { response, status } = await API_CALL({
        apiVersionUrl: 'barong',
        url: '/api/mobile/coupons/redemption-history',
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (status === 200 && response) {
        const claimed = (response as any).redemptions || [];
        setClaimedCoupons(claimed.map((redemption: any) => ({
          id: redemption.id,
          code: redemption.coupon_code,
          title: redemption.coupon_title || redemption.coupon_name,
          reward: redemption.reward_amount || redemption.reward,
          claimedAt: redemption.redeemed_at || redemption.created_at,
          status: redemption.status || 'claimed',
          value: redemption.value || 0,
          transactionId: redemption.transaction_id || redemption.id
        })));
      } else {
        setClaimedCoupons([]);
      }
    } catch (error: any) {
      console.log('Failed to fetch claimed coupons:', error.message);
      setClaimedCoupons([]);
    }
  };

  // Load all data
  const loadData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        fetchAvailableCoupons(),
        fetchClaimedCoupons()
      ]);
    } catch (error) {
      console.log('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Pull to refresh
  const onRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        fetchAvailableCoupons(),
        fetchClaimedCoupons()
      ]);
      showToast('Data refreshed!');
    } catch (error) {
      showToast('Failed to refresh data');
    } finally {
      setIsRefreshing(false);
    }
  };

  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);

  // Success celebration effect
  useEffect(() => {
    if (isSuccess) {
      // Additional celebration haptic feedback
      setTimeout(() => Vibration.vibrate([0, 50, 50, 50]), 500);
      setTimeout(() => Vibration.vibrate([0, 50, 50, 50]), 1000);
    }
  }, [isSuccess]);



  const handleClaimCoupon = async () => {
    if (!couponCode.trim()) {
      setErrorMessage('Please enter a coupon code');
      setIsError(true);
      return;
    }

    setIsProcessing(true);
    setIsError(false);

    try {
      const token = await getItem<string>('token');
      if (!token) {
        setErrorMessage('Authentication required');
        setIsError(true);
        setIsProcessing(false);
        return;
      }

      const { response, status } = await API_CALL({
        apiVersionUrl: 'barong',
        url: '/api/mobile/coupons/redeem',
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: { coupon_code: couponCode.trim() }
      });

      if (status === 200 && response) {
        // Success haptic feedback
        Vibration.vibrate([0, 100, 50, 100]);
        setIsSuccess(true);
        setClaimedReward((response as any).reward_amount || 'Success');
        setClaimedCouponTitle((response as any).coupon_title || 'Coupon');
        setTransactionId((response as any).transaction_id || Math.random().toString(36).substr(2, 9).toUpperCase());
        setCouponCode('');
        
        // Refresh data after successful claim
        await Promise.all([
          fetchAvailableCoupons(),
          fetchClaimedCoupons()
        ]);

        // Auto close after 5 seconds
        setTimeout(() => {
          SheetManager.hide('claimResult');
          setIsSuccess(false);
          setIsProcessing(false);
          setClaimedReward('');
          setClaimedCouponTitle('');
          setTransactionId('');
        }, 5000);
      } else {
        // Error haptic feedback
        Vibration.vibrate([0, 200]);
        const errorMsg = (response as any)?.message?.error || 'Invalid or expired coupon code';
        setErrorMessage(errorMsg);
        setIsError(true);
        setIsProcessing(false);
      }
    } catch (error: any) {
      setErrorMessage('Network error. Please try again.');
      setIsError(true);
      setIsProcessing(false);
    }
  };

  const handleCopyCode = (code: string) => {
    // Add clipboard functionality here
    console.log('Copied code:', code);
    showToast('Code copied to clipboard!');
  };

  const ClaimResultSheet = () => {
    const handleClose = () => {
      SheetManager.hide('claimResult');
      setIsSuccess(false);
      setIsError(false);
      setIsProcessing(false);
    };

    const handleViewHistory = () => {
      SheetManager.hide('claimResult');
      setIsSuccess(false);
      setIsError(false);
      setIsProcessing(false);
      // Scroll to claimed history section
      // You can implement this by adding a ref to the ScrollView
    };

    return (
      <View className="p-6 items-center">
        {isSuccess ? (
          <View className="w-full items-center">
            {/* Success Animation */}
            <View className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full items-center justify-center mb-4 shadow-lg relative">
              <CheckCircle size={40} color="#FFFFFF" />
              {/* Confetti effect */}
              <View className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full animate-bounce" />
              <View className="absolute -bottom-2 -left-2 w-3 h-3 bg-pink-400 rounded-full animate-bounce" />
              <View className="absolute -top-1 -left-1 w-2 h-2 bg-blue-400 rounded-full animate-bounce" />
            </View>
            
            {/* Success Title */}
            <View className="flex-row items-center mb-2">
              <PartyPopper size={24} color="#10B981" />
              <Text className="text-xl font-bold text-gray-900 ml-2">Coupon Claimed!</Text>
            </View>
            <Text className="text-gray-700 text-center mb-4">
              Your reward has been successfully added to your account balance.
            </Text>

            {/* Reward Details */}
            <View className="w-full bg-green-50 rounded-xl p-4 mb-4 border border-green-200">
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-green-800 font-semibold">Coupon Type</Text>
                <Text className="text-green-800 font-bold text-sm">{claimedCouponTitle}</Text>
              </View>
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-green-800 font-semibold">Reward Amount</Text>
                <Text className="text-green-800 font-bold text-lg">{claimedReward}</Text>
              </View>
              <View className="flex-row items-center justify-between">
                <Text className="text-green-700 text-sm">Coupon Code</Text>
                <Text className="text-green-800 font-mono text-sm">{couponCode || 'WELCOME50'}</Text>
              </View>
              <View className="flex-row items-center justify-between mt-2">
                <Text className="text-green-700 text-sm">Transaction ID</Text>
                <Text className="text-green-800 font-mono text-xs">#{transactionId}</Text>
              </View>
            </View>

            {/* Action Buttons */}
            <View className="w-full space-y-3">
              <TouchableOpacity 
                className="w-full bg-green-500 py-3 rounded-xl items-center shadow-lg" 
                onPress={handleClose}
              >
                <Text className="text-white font-bold text-lg">Continue Earning</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                className="w-full bg-gray-100 py-3 rounded-xl items-center" 
                onPress={handleViewHistory}
              >
                <Text className="text-gray-700 font-semibold">View Claim History</Text>
              </TouchableOpacity>
            </View>

            {/* Additional Info */}
            <View className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <View className="flex-row items-center justify-center">
                <Lightbulb size={16} color="#1E40AF" />
                <Text className="text-blue-800 text-xs text-center ml-1">
                  Tip: Check out our other earning methods to maximize your rewards!
                </Text>
              </View>
            </View>
          </View>
        ) : isError ? (
          <View className="w-full items-center">
            {/* Error Animation */}
            <View className="w-20 h-20 bg-gradient-to-br from-red-400 to-red-600 rounded-full items-center justify-center mb-4 shadow-lg">
              <XCircle size={40} color="#FFFFFF" />
            </View>
            
            {/* Error Title */}
            <View className="flex-row items-center mb-2">
              <AlertTriangle size={24} color="#EF4444" />
              <Text className="text-xl font-bold text-gray-900 ml-2">Claim Failed</Text>
            </View>
            <Text className="text-gray-700 text-center mb-4">
              {errorMessage}
            </Text>

            {/* Error Details */}
            <View className="w-full bg-red-50 rounded-xl p-4 mb-4 border border-red-200">
              <Text className="text-red-800 text-sm text-center mb-2">Possible reasons:</Text>
              <Text className="text-red-700 text-xs mb-1">• Coupon code is invalid or expired</Text>
              <Text className="text-red-700 text-xs mb-1">• You've already claimed this coupon</Text>
              <Text className="text-red-700 text-xs">• Network connection issue</Text>
            </View>

            {/* Action Buttons */}
            <View className="w-full space-y-3">
              <TouchableOpacity 
                className="w-full bg-red-500 py-3 rounded-xl items-center shadow-lg" 
                onPress={handleClose}
              >
                <Text className="text-white font-bold text-lg">Try Again</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                className="w-full bg-gray-100 py-3 rounded-xl items-center" 
                onPress={() => {
                  setCouponCode('');
                  handleClose();
                }}
              >
                <Text className="text-gray-700 font-semibold">Enter Different Code</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View className="w-full items-center">
            {/* Loading Animation */}
            <View className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full items-center justify-center mb-4 shadow-lg">
              <Loader size={32} color="#FFFFFF" className="animate-spin" />
            </View>
            
            {/* Loading Text */}
            <Text className="text-lg font-semibold text-gray-900 mb-2">Processing Coupon...</Text>
            <Text className="text-gray-600 text-center mb-4">
              Please wait while we validate your coupon code and process your reward.
            </Text>

            {/* Progress Steps */}
            <View className="w-full space-y-2 mb-4">
              <View className="flex-row items-center">
                <View className="w-6 h-6 bg-green-500 rounded-full items-center justify-center mr-3">
                  <Text className="text-white text-xs font-bold">✓</Text>
                </View>
                <Text className="text-gray-700 text-sm">Validating coupon code</Text>
              </View>
              <View className="flex-row items-center">
                <View className="w-6 h-6 bg-yellow-500 rounded-full items-center justify-center mr-3">
                  <View className="w-3 h-3 bg-white rounded-full animate-pulse" />
                </View>
                <Text className="text-gray-700 text-sm">Processing reward</Text>
              </View>
              <View className="flex-row items-center">
                <View className="w-6 h-6 bg-gray-300 rounded-full items-center justify-center mr-3">
                  <Text className="text-gray-500 text-xs">3</Text>
                </View>
                <Text className="text-gray-500 text-sm">Adding to account</Text>
              </View>
            </View>

            {/* Estimated Time */}
            <View className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
              <View className="flex-row items-center justify-center">
                <Timer size={16} color="#92400E" />
                <Text className="text-yellow-800 text-xs text-center ml-1">
                  This usually takes 10-30 seconds
                </Text>
              </View>
            </View>
          </View>
        )}
      </View>
    );
  };

  const CouponDetailSheet = ({ coupon }: { coupon: Coupon }) => {
    return (
      <View className="bg-gray-900 rounded-t-2xl p-4">
        <View className="items-center mb-4">
          <View className="w-16 h-16 rounded-full items-center justify-center mb-3" style={{ backgroundColor: coupon.color + '20' }}>
            {coupon.icon}
          </View>
          <Text className="text-white text-lg font-bold">{coupon.title}</Text>
          <Text className="text-gray-400 text-sm text-center mt-1">{coupon.description}</Text>
        </View>

        <View className="bg-gray-800 rounded-xl p-4 mb-4">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-gray-400 text-sm">Coupon Code</Text>
            <TouchableOpacity onPress={() => handleCopyCode(coupon.code)}>
              <Copy size={16} color="#FFD600" />
            </TouchableOpacity>
          </View>
          <Text className="text-yellow-400 font-bold text-lg">{coupon.code}</Text>
        </View>

        <View className="space-y-3 mb-4">
          <View className="flex-row items-center justify-between">
            <Text className="text-gray-400 text-sm">Reward</Text>
            <Text className="text-white font-semibold">{coupon.reward}</Text>
          </View>
          {coupon.minDeposit > 0 && (
            <View className="flex-row items-center justify-between">
              <Text className="text-gray-400 text-sm">Minimum Deposit</Text>
              <Text className="text-white font-semibold">${coupon.minDeposit}</Text>
            </View>
          )}
          {coupon.maxReward > 0 && (
            <View className="flex-row items-center justify-between">
              <Text className="text-gray-400 text-sm">Maximum Reward</Text>
              <Text className="text-white font-semibold">${coupon.maxReward}</Text>
            </View>
          )}
          <View className="flex-row items-center justify-between">
            <Text className="text-gray-400 text-sm">Expires In</Text>
            <Text className="text-red-400 font-semibold">{coupon.expiresIn}</Text>
          </View>
        </View>

        <TouchableOpacity 
          className="w-full bg-yellow-400 py-3 rounded-xl items-center mb-3"
          onPress={() => {
            setCouponCode(coupon.code);
            SheetManager.hide('couponDetail');
            SheetManager.show('claimResult');
            handleClaimCoupon();
          }}
          disabled={!coupon.isAvailable}
        >
          <Text className="text-gray-900 font-bold">
            {coupon.isAvailable ? 'Claim This Coupon' : 'Coupon Unavailable'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => SheetManager.hide('couponDetail')} 
          className="p-3 bg-gray-700 rounded-xl items-center"
        >
          <Text className="text-white font-semibold">Cancel</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // Loading state
  if (isLoading) {
    return (
      <View className="flex-1 bg-gray-900 justify-center items-center">
        <StatusBar barStyle="light-content" backgroundColor="#111827" translucent={false} />
        <Loader size={48} color="#FFD600" />
        <Text className="text-white mt-4 text-lg">Loading coupons...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <StatusBar barStyle="light-content" backgroundColor="#111827" translucent={false} />

      {/* Header */}
      <View className="flex-row items-center p-4 border-b border-gray-800">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-2">
          <ArrowLeft size={28} color="#FFD600" />
        </TouchableOpacity>
        <Text className="font-bold text-xl text-yellow-400 flex-1 text-center">Coupon Claim</Text>
        <TouchableOpacity onPress={onRefresh} className="ml-2" disabled={isRefreshing}>
          <RefreshCw size={24} color="#FFD600" className={isRefreshing ? 'animate-spin' : ''} />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1" keyboardShouldPersistTaps="handled">
        {/* Manual Coupon Input */}
        <View className="px-4 mt-6 mb-4">
          <Text className="text-gray-400 text-sm mb-2">Enter Coupon Code</Text>
          <View className="flex-row items-center bg-gray-800 rounded-xl px-3 py-2">
            <TextInput
              className="flex-1 bg-transparent text-white text-sm"
              placeholder="Enter coupon code here..."
              placeholderTextColor="#A3A3A3"
              value={couponCode}
              onChangeText={setCouponCode}
              autoCapitalize="characters"
            />
            <TouchableOpacity 
              className="ml-2 bg-yellow-400 px-4 py-2 rounded-lg"
              onPress={handleClaimCoupon}
              disabled={isProcessing}
            >
              <Text className="text-gray-900 font-bold">Claim</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Available Coupons Section */}
        <View className="px-4 mb-4">
          <View className="flex-row items-center mb-3">
            <Gift size={20} color="#FFD600" />
            <Text className="text-white font-bold text-lg ml-2">Available Coupons</Text>
            <Text className="text-gray-400 text-sm ml-auto">({availableCoupons.length})</Text>
          </View>
          
          {availableCoupons.length === 0 ? (
            <View className="bg-gray-800 rounded-xl p-8 items-center">
              <Gift size={48} color="#6B7280" />
              <Text className="text-gray-400 text-lg mt-4 text-center">No coupons available</Text>
              <Text className="text-gray-500 text-sm mt-2 text-center">Check back later for new offers!</Text>
            </View>
          ) : (
            <FlatList
              data={availableCoupons}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className="bg-gray-800 rounded-xl p-4 mb-3"
                  onPress={() => SheetManager.show('couponDetail')}
                >
                  <View className="flex-row items-center">
                    <View 
                      className="w-12 h-12 rounded-full items-center justify-center mr-3"
                      style={{ backgroundColor: item.color + '20' }}
                    >
                      {item.icon}
                    </View>
                    <View className="flex-1">
                      <View className="flex-row items-center">
                        <Text className="text-white font-semibold">{item.title}</Text>
                        {item.isPopular && (
                          <View className="ml-2 bg-yellow-400 px-2 py-1 rounded-full">
                            <Text className="text-gray-900 text-xs font-bold">POPULAR</Text>
                          </View>
                        )}
                      </View>
                      <Text className="text-gray-400 text-sm mt-1">{item.description}</Text>
                      <View className="flex-row items-center mt-2">
                        <DollarSign size={14} color="#FFD600" />
                        <Text className="text-yellow-400 font-semibold ml-1">{item.reward}</Text>
                        <Clock size={14} color="#6B7280" className="ml-3" />
                        <Text className="text-gray-400 text-xs ml-1">Expires in {item.expiresIn}</Text>
                      </View>
                    </View>
                    <TouchableOpacity 
                      className="bg-yellow-400 px-3 py-2 rounded-lg"
                      onPress={() => {
                        setCouponCode(item.code);
                        SheetManager.show('claimResult');
                        handleClaimCoupon();
                      }}
                      disabled={!item.isAvailable}
                    >
                      <Text className="text-gray-900 font-bold text-sm">
                        {item.isAvailable ? 'Claim' : 'Unavailable'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              )}
            />
          )}
        </View>

        {/* Claimed Coupons History */}
        <View className="px-4 mb-4">
          <View className="flex-row items-center mb-3">
            <CheckCircle size={20} color="#10B981" />
            <Text className="text-white font-bold text-lg ml-2">Claimed History</Text>
            <Text className="text-gray-400 text-sm ml-auto">({claimedCoupons.length})</Text>
          </View>
          
          {claimedCoupons.length === 0 ? (
            <View className="bg-gray-800 rounded-xl p-8 items-center">
              <CheckCircle size={48} color="#6B7280" />
              <Text className="text-gray-400 text-lg mt-4 text-center">No coupons claimed yet</Text>
              <Text className="text-gray-500 text-sm mt-2 text-center">Start claiming coupons to see your history!</Text>
            </View>
          ) : (
            <FlatList
              data={claimedCoupons}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <View className="bg-gray-800 rounded-xl p-4 mb-3">
                  <View className="flex-row items-center justify-between">
                    <View className="flex-1">
                      <Text className="text-white font-semibold">{item.title}</Text>
                      <Text className="text-gray-400 text-sm mt-1">Code: {item.code}</Text>
                      <View className="flex-row items-center mt-2">
                        <Star size={14} color="#FFD600" />
                        <Text className="text-yellow-400 font-semibold ml-1">{item.reward}</Text>
                        <Calendar size={14} color="#6B7280" className="ml-3" />
                        <Text className="text-gray-400 text-xs ml-1">{item.claimedAt}</Text>
                      </View>
                      <Text className="text-gray-500 text-xs mt-1">TXN: #{item.transactionId}</Text>
                    </View>
                    <View className={`px-3 py-1 rounded-full ${
                      item.status === 'claimed' ? 'bg-green-500' : 
                      item.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}>
                      <Text className="text-white text-xs font-bold uppercase">{item.status}</Text>
                    </View>
                  </View>
                </View>
              )}
            />
          )}
        </View>

        {/* Info Section */}
        <View className="px-4 mb-4">
          <View className="bg-gray-800 rounded-xl p-4">
            <Text className="text-gray-400 text-sm mb-2 font-semibold">How to use coupons:</Text>
            <Text className="text-gray-400 text-xs mb-1">• Enter the coupon code manually or tap on available coupons</Text>
            <Text className="text-gray-400 text-xs mb-1">• Some coupons require minimum deposit amounts</Text>
            <Text className="text-gray-400 text-xs mb-1">• Coupons have expiration dates - use them before they expire</Text>
            <Text className="text-gray-400 text-xs">• Each coupon can only be used once per account</Text>
          </View>
        </View>

        {/* Spacer for bottom nav */}
        <View className="h-16" />
      </ScrollView>

      {/* ActionSheets */}
      <ActionSheet id="claimResult">
        <ClaimResultSheet />
      </ActionSheet>

      <ActionSheet id="couponDetail">
        <CouponDetailSheet coupon={availableCoupons[0]} />
      </ActionSheet>
    </SafeAreaView>
  );
} 
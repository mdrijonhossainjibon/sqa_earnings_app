import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, StatusBar, FlatList, Pressable } from 'react-native';
import { ArrowLeft, ArrowUpDown, TrendingUp, Info, AlertTriangle, CheckCircle } from 'lucide-react-native';
import ActionSheet, { ActionSheetRef, SheetManager } from 'react-native-actions-sheet';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SwapScreen({ navigation }: any) {
  const [fromAsset, setFromAsset] = useState('BTC');
  const [toAsset, setToAsset] = useState('ETH');
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Mock assets
  const assets = [
    {
      id: 'BTC',
      name: 'Bitcoin',
      symbol: 'BTC',
      icon: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
      balance: 0.0234,
      price: 33737.18
    },
    {
      id: 'ETH',
      name: 'Ethereum',
      symbol: 'ETH',
      icon: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
      balance: 1.234,
      price: 1900.45
    },
    {
      id: 'BNB',
      name: 'BNB',
      symbol: 'BNB',
      icon: 'https://assets.coingecko.com/coins/images/825/large/binance-coin-logo.png',
      balance: 12.5,
      price: 365.42
    },
    {
      id: 'USDT',
      name: 'USDT',
      symbol: 'USDT',
      icon: 'https://assets.coingecko.com/coins/images/325/large/Tether.png',
      balance: 1000.0,
      price: 1.00
    }
  ];

  const fromAssetData = assets.find(asset => asset.id === fromAsset);
  const toAssetData = assets.find(asset => asset.id === toAsset);

  // Mock exchange rate
  const exchangeRate = fromAssetData && toAssetData ? toAssetData.price / fromAssetData.price : 0;
  const estimatedToAmount = fromAmount ? parseFloat(fromAmount) * exchangeRate : 0;
  const fee = 0.001; // 0.1% fee
  const feeAmount = fromAmount ? parseFloat(fromAmount) * fee : 0;
  const slippage = 0.5; // 0.5% slippage

  const AssetSelectorSheet = ({ type }: { type: 'from' | 'to' }) => {
    return (
      <View className="bg-gray-900 rounded-t-2xl p-4">
        <Text className="text-white text-lg font-bold mb-4 text-center">
          Select {type === 'from' ? 'From' : 'To'} Asset
        </Text>
        
        <FlatList
          data={assets}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Pressable
              className="flex-row items-center p-4 rounded-xl mb-3 bg-gray-800"
              onPress={() => {
                if (type === 'from') {
                  setFromAsset(item.id);
                } else {
                  setToAsset(item.id);
                }
                SheetManager.hide('assetSelector');
              }}
            >
              <Image source={{ uri: item.icon }} className="w-10 h-10 rounded-full mr-3" />
              <View className="flex-1">
                <Text className="text-white font-semibold">{item.name}</Text>
                <Text className="text-gray-400 text-sm">Balance: {item.balance} {item.symbol}</Text>
              </View>
              {(type === 'from' ? fromAsset : toAsset) === item.id && (
                <View className="w-6 h-6 bg-yellow-400 rounded-full items-center justify-center">
                  <Text className="text-gray-900 text-xs font-bold">✓</Text>
                </View>
              )}
            </Pressable>
          )}
        />
        
        <TouchableOpacity 
          onPress={() => SheetManager.hide('assetSelector')} 
          className="p-3 bg-gray-700 rounded-xl items-center"
        >
          <Text className="text-white font-semibold">Cancel</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const ConfirmSwapSheet = () => {
    const handleConfirmSwap = async () => {
      setIsProcessing(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Show success state
        setIsSuccess(true);
        
        // Auto close after 3 seconds
        setTimeout(() => {
          SheetManager.hide('confirmSwap');
          setIsSuccess(false);
          setIsProcessing(false);
          setFromAmount('');
          setToAmount('');
        }, 3000);
        
      } catch (error) {
        console.error('Swap failed:', error);
        setIsProcessing(false);
      }
    };

    const handleClose = () => {
      SheetManager.hide('confirmSwap');
      setIsSuccess(false);
      setIsProcessing(false);
    };

    return (
      <View className="p-6 items-center">
        {isSuccess ? (
          <View className="w-full items-center">
            <View className="w-16 h-16 bg-green-100 rounded-full items-center justify-center mb-4">
              <CheckCircle size={32} color="#10B981" />
            </View>
            <Text className="text-lg font-bold text-gray-900 mb-2">Swap Successful!</Text>
            <Text className="text-gray-700 text-center mb-4">
              You have successfully swapped {fromAmount} {fromAsset} for {estimatedToAmount.toFixed(6)} {toAsset}.
            </Text>
            <TouchableOpacity 
              className="w-full bg-green-500 py-3 rounded-xl items-center" 
              onPress={handleClose}
            >
              <Text className="text-white font-bold">Done</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <Text className="text-lg font-bold text-gray-900 mb-2">Confirm Swap</Text>
            <Text className="text-gray-700 text-center mb-6">
              Are you sure you want to swap {fromAmount} {fromAsset} for approximately {estimatedToAmount.toFixed(6)} {toAsset}?
            </Text>
            
            {/* Swap Details */}
            <View className="w-full bg-gray-100 rounded-xl p-4 mb-4">
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-gray-600 text-sm">Exchange Rate</Text>
                <Text className="text-gray-900 font-semibold">1 {fromAsset} = {exchangeRate.toFixed(6)} {toAsset}</Text>
              </View>
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-gray-600 text-sm">Network Fee</Text>
                <Text className="text-gray-900 font-semibold">{feeAmount.toFixed(6)} {fromAsset}</Text>
              </View>
              <View className="flex-row items-center justify-between">
                <Text className="text-gray-600 text-sm">Slippage</Text>
                <Text className="text-gray-900 font-semibold">{slippage}%</Text>
              </View>
            </View>
            
            {isProcessing ? (
              <View className="w-full items-center">
                <View className="w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mb-4" />
                <Text className="text-gray-700 text-center">Processing swap...</Text>
                <Text className="text-gray-500 text-xs text-center mt-2">Please wait, this may take a few moments</Text>
              </View>
            ) : (
              <View className="flex-row w-full justify-between">
                <TouchableOpacity 
                  className="flex-1 bg-gray-300 py-3 rounded-xl mr-2 items-center" 
                  onPress={handleClose}
                >
                  <Text className="text-gray-900 font-semibold">Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  className="flex-1 bg-yellow-400 py-3 rounded-xl ml-2 items-center" 
                  onPress={handleConfirmSwap}
                >
                  <Text className="text-gray-900 font-bold">Confirm Swap</Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        )}
      </View>
    );
  };

  const handleSwapAssets = () => {
    const temp = fromAsset;
    setFromAsset(toAsset);
    setToAsset(temp);
    setFromAmount('');
    setToAmount('');
  };

  const handleMaxAmount = () => {
    if (fromAssetData) {
      setFromAmount(fromAssetData.balance.toString());
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <StatusBar barStyle="light-content" backgroundColor="#111827" translucent={false} />

      {/* Header */}
      <View className="flex-row items-center p-4 border-b border-gray-800">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-2">
          <ArrowLeft size={28} color="#FFD600" />
        </TouchableOpacity>
        <Text className="font-bold text-xl text-yellow-400 flex-1 text-center">Swap</Text>
        <View className="w-8" />
      </View>

      <ScrollView className="flex-1" keyboardShouldPersistTaps="handled">
        {/* From Asset */}
        <View className="px-4 mt-6 mb-4">
          <Text className="text-gray-400 text-sm mb-2">From</Text>
          <View className="bg-gray-800 rounded-xl p-4">
            <View className="flex-row items-center justify-between mb-3">
              <TouchableOpacity 
                className="flex-row items-center"
                onPress={() => SheetManager.show('assetSelector')}
              >
                <Image source={{ uri: fromAssetData?.icon }} className="w-10 h-10 rounded-full mr-3" />
                <View>
                  <Text className="text-white font-semibold">{fromAssetData?.name}</Text>
                  <Text className="text-gray-400 text-sm">Balance: {fromAssetData?.balance} {fromAssetData?.symbol}</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleMaxAmount}>
                <Text className="text-yellow-400 font-semibold text-sm">MAX</Text>
              </TouchableOpacity>
            </View>
            <TextInput
              className="text-white text-2xl font-bold bg-transparent"
              placeholder="0.00"
              placeholderTextColor="#6B7280"
              value={fromAmount}
              onChangeText={setFromAmount}
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* Swap Button */}
        <View className="px-4 mb-4">
          <TouchableOpacity 
            className="w-12 h-12 bg-gray-800 rounded-full items-center justify-center mx-auto"
            onPress={handleSwapAssets}
          >
            <ArrowUpDown size={24} color="#FFD600" />
          </TouchableOpacity>
        </View>

        {/* To Asset */}
        <View className="px-4 mb-4">
          <Text className="text-gray-400 text-sm mb-2">To</Text>
          <View className="bg-gray-800 rounded-xl p-4">
            <View className="flex-row items-center justify-between mb-3">
              <TouchableOpacity 
                className="flex-row items-center"
                onPress={() => SheetManager.show('assetSelector')}
              >
                <Image source={{ uri: toAssetData?.icon }} className="w-10 h-10 rounded-full mr-3" />
                <View>
                  <Text className="text-white font-semibold">{toAssetData?.name}</Text>
                  <Text className="text-gray-400 text-sm">Balance: {toAssetData?.balance} {toAssetData?.symbol}</Text>
                </View>
              </TouchableOpacity>
            </View>
            <Text className="text-white text-2xl font-bold">
              {estimatedToAmount > 0 ? estimatedToAmount.toFixed(6) : '0.00'}
            </Text>
          </View>
        </View>

        {/* Exchange Rate */}
        {fromAmount && (
          <View className="px-4 mb-4">
            <View className="bg-gray-800 rounded-xl p-4">
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-gray-400 text-sm">Exchange Rate</Text>
                <Text className="text-white font-semibold">1 {fromAsset} = {exchangeRate.toFixed(6)} {toAsset}</Text>
              </View>
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-gray-400 text-sm">Network Fee</Text>
                <Text className="text-white font-semibold">{feeAmount.toFixed(6)} {fromAsset}</Text>
              </View>
              <View className="flex-row items-center justify-between">
                <Text className="text-gray-400 text-sm">Slippage</Text>
                <Text className="text-white font-semibold">{slippage}%</Text>
              </View>
            </View>
          </View>
        )}

        {/* Swap Button */}
        <View className="px-4 mb-4">
          <TouchableOpacity 
            className={`w-full py-4 rounded-xl items-center ${
              fromAmount && parseFloat(fromAmount) > 0 && parseFloat(fromAmount) <= (fromAssetData?.balance || 0)
                ? 'bg-yellow-400'
                : 'bg-gray-700'
            }`}
            onPress={() => {
              if (fromAmount && parseFloat(fromAmount) > 0 && parseFloat(fromAmount) <= (fromAssetData?.balance || 0)) {
                SheetManager.show('confirmSwap');
              }
            }}
            disabled={!fromAmount || parseFloat(fromAmount) <= 0 || parseFloat(fromAmount) > (fromAssetData?.balance || 0)}
          >
            <Text className={`font-bold text-lg ${
              fromAmount && parseFloat(fromAmount) > 0 && parseFloat(fromAmount) <= (fromAssetData?.balance || 0)
                ? 'text-gray-900'
                : 'text-gray-400'
            }`}>
              {!fromAmount || parseFloat(fromAmount) <= 0
                ? 'Enter amount'
                : parseFloat(fromAmount) > (fromAssetData?.balance || 0)
                ? 'Insufficient balance'
                : 'Swap'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Info Section */}
        <View className="px-4 mb-4">
          <View className="bg-gray-800 rounded-xl p-4">
            <View className="flex-row items-center mb-2">
              <Info size={16} color="#FFD600" />
              <Text className="text-gray-400 text-sm ml-2 font-semibold">Swap Information</Text>
            </View>
            <Text className="text-gray-400 text-xs mb-1">• Swaps are processed instantly</Text>
            <Text className="text-gray-400 text-xs mb-1">• Network fees apply to all swaps</Text>
            <Text className="text-gray-400 text-xs mb-1">• Slippage tolerance: {slippage}%</Text>
            <Text className="text-gray-400 text-xs">• Minimum swap amount: 0.001 {fromAsset}</Text>
          </View>
        </View>

        {/* Spacer for bottom nav */}
        <View className="h-16" />
      </ScrollView>

      {/* ActionSheets */}
      <ActionSheet id="assetSelector">
        <AssetSelectorSheet type="from" />
      </ActionSheet>

      <ActionSheet id="confirmSwap">
        <ConfirmSwapSheet />
      </ActionSheet>
    </SafeAreaView>
  );
} 
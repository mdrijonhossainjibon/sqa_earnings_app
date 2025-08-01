import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image , StatusBar, FlatList, Pressable, Button } from 'react-native';
import { ArrowLeft, ClipboardPaste, ScanQrCode } from 'lucide-react-native';
import ActionSheet, { ActionSheetRef ,  SheetManager   } from 'react-native-actions-sheet';
import { SafeAreaView } from 'react-native-safe-area-context';
 
export default function WithdrawScreen({ navigation }: any) {
   
  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const available = 0.5234;
  const fee = 0.0002;
  const min = 0.0001;

  
  const ConfirmWithdrawSheet = () => {
    const handleConfirmWithdraw = async () => {
      setIsProcessing(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Place your actual withdrawal logic here
        console.log('Withdrawal confirmed!');
        
        // Show success state
        setIsSuccess(true);
        
        // Auto close after 3 seconds
        setTimeout(() => {
          SheetManager.hide('confirmWithdraw');
          setIsSuccess(false);
          setIsProcessing(false);
        }, 3000);
        
      } catch (error) {
        console.error('Withdrawal failed:', error);
        // Handle error
        setIsProcessing(false);
      }
    };

    const handleClose = () => {
      SheetManager.hide('confirmWithdraw');
      setIsSuccess(false);
      setIsProcessing(false);
    };

    return (
      <View className="p-6 items-center">
        {isSuccess ? (
          <View className="w-full items-center">
            <View className="w-16 h-16 bg-green-100 rounded-full items-center justify-center mb-4">
              <Text className="text-green-600 text-3xl">✓</Text>
            </View>
            <Text className="text-lg font-bold text-gray-900 mb-2">Withdrawal Successful!</Text>
            <Text className="text-gray-700 text-center mb-4">
              Your withdrawal of {amount || '0.00'} {selectedNetwork.symbol} has been processed successfully.
            </Text>
            <Text className="text-gray-500 text-xs text-center mb-6">
              Transaction ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}
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
            <Text className="text-lg font-bold text-gray-900 mb-2">Confirm Withdrawal</Text>
            <Text className="text-gray-700 text-center mb-6">
              Are you sure you want to withdraw {amount || '0.00'} {selectedNetwork.symbol} to this address?
            </Text>
            
            {isProcessing ? (
              <View className="w-full items-center">
                <View className="w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mb-4" />
                <Text className="text-gray-700 text-center">Processing withdrawal...</Text>
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
                  onPress={handleConfirmWithdraw}
                >
                  <Text className="text-gray-900 font-bold">Confirm Withdraw</Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        )}
      </View>
    );
  };

  const NetworkSelectorSheet = () => {
    return (
      <View className="bg-gray-900 rounded-t-2xl p-4  ">
        <Text className="text-white text-lg font-bold mb-4 text-center">Select Network</Text>
        <FlatList
          data={networks}
          keyExtractor={(item) => `${item.symbol}-${item.network}`}
          renderItem={({ item }) => (
            <Pressable
              className="flex-row items-center p-3 rounded-xl mb-2 bg-gray-800"
              onPress={() => {
                setSelectedNetwork(item);
                SheetManager.hide('networkSelector');
              }}
            >
              <Image source={{ uri: item.icon }} className="w-8 h-8 rounded-full bg-gray-700 mr-3" />
              <View className="flex-1">
                <Text className="text-white font-semibold">{item.name}</Text>
                <View className="flex-row items-center">
                  <Text className="text-gray-400 text-xs">{item.network}</Text>
                  <Text className="text-gray-400 text-xs ml-2">•</Text>
                  <Text className="text-gray-400 text-xs ml-2">{item.symbol}</Text>
                </View>
              </View>
              {selectedNetwork.symbol === item.symbol && selectedNetwork.network === item.network && (
                <Text className="text-yellow-400 font-bold ml-2">Selected</Text>
              )}
            </Pressable>
          )}
        />
        <TouchableOpacity onPress={() => SheetManager.hide('networkSelector')} className="mt-2 p-3 bg-gray-700 rounded-xl items-center">
          <Text className="text-white font-semibold">Cancel</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const CoinSelectorSheet = () => {
    return (
      <View className="bg-gray-900 rounded-t-2xl p-4  ">
        <Text className="text-white text-lg font-bold mb-4 text-center">Select Asset</Text>
        <FlatList
          data={coins}
          keyExtractor={(item) => item.symbol}
          renderItem={({ item }) => (
            <Pressable
              className="flex-row items-center p-3 rounded-xl mb-2 bg-gray-800"
              onPress={() => {
                setSelectedCoin(item);
                SheetManager.hide('coinSelector');
              }}
            >
              <Image source={{ uri: item.icon }} className="w-8 h-8 rounded-full bg-gray-700 mr-3" />
              <View className="flex-1">
                <Text className="text-white font-semibold">{item.name}</Text>
                <Text className="text-gray-400 text-xs">{item.symbol}</Text>
              </View>
              {selectedCoin.symbol === item.symbol && (
                <Text className="text-yellow-400 font-bold ml-2">Selected</Text>
              )}
            </Pressable>
          )}
        />
        <TouchableOpacity onPress={() => SheetManager.hide('coinSelector')} className="mt-2 p-3 bg-gray-700 rounded-xl items-center">
          <Text className="text-white font-semibold">Cancel</Text>
        </TouchableOpacity>
      </View>
    );
  };


  // Add network list and state
  const networks = [
    
    {
      name: 'Ethereum',
      symbol: 'ETH',
      network: 'ERC20',
      icon: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
     
    },
    {
      name: 'BNB',
      symbol: 'BNB',
      network: 'BEP20',
      icon: 'https://assets.coingecko.com/coins/images/825/large/binance-coin-logo.png',
  
    }, 
  ];

  // Add coins list and state
  const coins = [
    {
      name: 'Bitcoin',
      symbol: 'BTC',
      icon: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
      price: '$18,000.00',
      available: 0.5234,
    },
    {
      name: 'Ethereum',
      symbol: 'ETH',
      icon: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
      price: '$2,000.00',
      available: 1.2345,
    },
    {
      name: 'BNB',
      symbol: 'BNB',
      icon: 'https://assets.coingecko.com/coins/images/825/large/binance-coin-logo.png',
      price: '$300.00',
      available: 10.5,
    },
    {
      name: 'USDT',
      symbol: 'USDT',
      icon: 'https://assets.coingecko.com/coins/images/325/large/Tether.png',
      price: '$1.00',
      available: 1000.0,
    },
    {
      name: 'USDC',
      symbol: 'USDC',
      icon: 'https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png',
      price: '$1.00',
      available: 500.0,
    },
  ];

  const [selectedNetwork, setSelectedNetwork] = useState(networks[0]);
  const [selectedCoin, setSelectedCoin] = useState(coins[0]);

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      {/* Header */}
      <StatusBar barStyle="light-content" backgroundColor="#111827" translucent={false} />

      <View className="flex-row items-center p-4 border-b border-gray-800">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-2">
          <ArrowLeft size={28} color="#FFD600" />
        </TouchableOpacity>
        <Text className="font-bold text-xl text-yellow-400 flex-1 text-center">Withdraw</Text>
        <View className="w-8" />
      </View>

      <ScrollView className="flex-1" keyboardShouldPersistTaps="handled">

        
        {/* Asset Card */}
        <View className="px-4 mt-6 mb-4">
          <TouchableOpacity onPress={() => SheetManager.show('coinSelector')}>
            <View className="bg-gray-800 rounded-xl p-4 flex-row items-center shadow">
              <Image
                source={{ uri: selectedCoin.icon }}
                className="w-10 h-10 rounded-full bg-gray-700 mr-3"
              />
              <View className="flex-1">
                <View className="flex-row items-center justify-between">
                  <Text className="text-white font-semibold">{selectedCoin.name}</Text>
                  <Text className="text-gray-400 text-xs">{selectedCoin.symbol}</Text>
                </View>
                <View className="flex-row items-center justify-between mt-1">
                  <Text className="text-yellow-400 font-bold">{selectedCoin.available}</Text>
                  <Text className="text-gray-400 text-xs">{selectedCoin.price}</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </View>
 
        {/* Network Selector */}
        <View className="px-4 mt-4 mb-4">
          <TouchableOpacity onPress={() => SheetManager.show('networkSelector')}>
            <View className="bg-gray-800 rounded-xl p-4 flex-row items-center shadow">
              <Image
                source={{ uri: selectedNetwork.icon }}
                className="w-10 h-10 rounded-full bg-gray-700 mr-3"
              />
              <View className="flex-1">
                <View className="flex-row items-center justify-between">
                  <View>
                    <Text className="text-white font-semibold">{selectedNetwork.name}</Text>
                  </View>
                  <Text className="text-gray-400 text-xs">{selectedNetwork.network}</Text>
                </View>
            
              </View>
            </View>
          </TouchableOpacity>
        </View>
        {/* Network ActionSheet */}
        <ActionSheet
          id="networkSelector"
        >
          <NetworkSelectorSheet />
        </ActionSheet>
         {/* Coin ActionSheet */}
         <ActionSheet
           id="coinSelector"
         >
           <CoinSelectorSheet />
         </ActionSheet>
         {/* Recipient Address */}
        <View className="px-4 mb-4">
          <Text className="text-gray-400 text-sm mb-1">Recipient Address</Text>
          <View className="flex-row items-center bg-gray-800 rounded-xl px-3 py-2">
            <TextInput
              className="flex-1 bg-transparent text-white text-xs"
              placeholder="Paste or scan address"
              placeholderTextColor="#A3A3A3"
              value={address}
              onChangeText={setAddress}
            />
            <TouchableOpacity className="ml-2" onPress={() => {/* paste logic */}}>
              <ClipboardPaste size={22} color="#FFD600" />
            </TouchableOpacity>
            <TouchableOpacity className="ml-2" onPress={() => {/* scan logic */}}>
              <ScanQrCode size={22} color="#FFD600" />
            </TouchableOpacity>
          </View>
        </View>
        {/* Amount Input */}
        <View className="px-4 mb-2">
          <Text className="text-gray-400 text-sm mb-1">Amount</Text>
          <View className="flex-row items-center bg-gray-800 rounded-xl px-3 py-2">
            <TextInput
              className="flex-1 bg-transparent text-white text-xs"
              placeholder="0.00"
              placeholderTextColor="#A3A3A3"
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
            />
            <TouchableOpacity className="ml-2" onPress={() => setAmount(available.toString())}>
              <Text className="text-yellow-400 font-semibold text-xs">Max</Text>
            </TouchableOpacity>
            <Text className="ml-2 text-gray-400 text-xs">BTC</Text>
          </View>
        </View>
        {/* Info */}
        <View className="px-4 mb-4 flex flex-col gap-1">
          <Text className="text-xs text-gray-400">Available: <Text className="text-yellow-400 font-semibold">{available} BTC</Text></Text>
          <Text className="text-xs text-gray-400">Network Fee: <Text className="text-yellow-400 font-semibold">{fee} BTC</Text></Text>
          <Text className="text-xs text-gray-400">Minimum Withdrawal: <Text className="text-yellow-400 font-semibold">{min} BTC</Text></Text>
        </View>
        {/* Withdraw Button */}
        <View className="px-4 mb-4">
          <TouchableOpacity className="w-full bg-yellow-400 py-3 rounded-xl shadow items-center" onPress={() => SheetManager.show('confirmWithdraw')}>
            <Text className="text-gray-900 font-bold text-lg">Withdraw</Text>
          </TouchableOpacity>
        </View>
                 {/* Confirm Withdraw ActionSheet */}
         <ActionSheet
           id="confirmWithdraw"
         >
           <ConfirmWithdrawSheet />
         </ActionSheet>
        {/* Info Text */}
        <View className="px-4 mb-4">
          <View className="bg-gray-800 rounded-xl p-3">
            <Text className="text-gray-400 text-xs mb-1">• Ensure the address is correct. Withdrawals cannot be reversed.</Text>
            <Text className="text-gray-400 text-xs mb-1">• Withdrawals may require network confirmations.</Text>
            <Text className="text-gray-400 text-xs">• Do not withdraw directly to a crowdfunding or ICO address.</Text>
          </View>
        </View>
        {/* Spacer for bottom nav */}
        <View className="h-16" />
      </ScrollView>
      {/* Bottom Navigation - use your CustomTabBar or similar */}
    </SafeAreaView>
  );
} 
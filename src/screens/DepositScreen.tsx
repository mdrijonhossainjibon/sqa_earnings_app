import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, StatusBar, FlatList, Pressable } from 'react-native';
import { ArrowLeft, Copy, ScanQrCode, CreditCard, Banknote, Smartphone, QrCode, ExternalLink } from 'lucide-react-native';
import ActionSheet, { ActionSheetRef, SheetManager } from 'react-native-actions-sheet';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DepositScreen({ navigation }: any) {
  const [selectedMethod, setSelectedMethod] = useState('crypto');
  const [selectedAsset, setSelectedAsset] = useState('BTC');

  // Mock deposit methods
  const depositMethods = [
    {
      id: 'crypto',
      title: 'Cryptocurrency',
      description: 'Deposit BTC, ETH, BNB, USDT',
      icon: <QrCode size={24} color="#FFD600" />,
      color: '#FFD600',
      bgColor: 'bg-yellow-500/10'
    },
    {
      id: 'card',
      title: 'Credit/Debit Card',
      description: 'Visa, Mastercard, American Express',
      icon: <CreditCard size={24} color="#10B981" />,
      color: '#10B981',
      bgColor: 'bg-green-500/10'
    },
    {
      id: 'bank',
      title: 'Bank Transfer',
      description: 'SEPA, SWIFT, ACH',
      icon: <Banknote size={24} color="#6366F1" />,
      color: '#6366F1',
      bgColor: 'bg-blue-500/10'
    },
    {
      id: 'mobile',
      title: 'Mobile Payment',
      description: 'Apple Pay, Google Pay',
      icon: <Smartphone size={24} color="#F59E0B" />,
      color: '#F59E0B',
      bgColor: 'bg-orange-500/10'
    }
  ];

  // Mock crypto assets
  const cryptoAssets = [
    {
      id: 'BTC',
      name: 'Bitcoin',
      symbol: 'BTC',
      icon: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
      address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
      qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
      minDeposit: 0.001,
      network: 'Bitcoin'
    },
    {
      id: 'ETH',
      name: 'Ethereum',
      symbol: 'ETH',
      icon: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
      address: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
      qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
      minDeposit: 0.01,
      network: 'Ethereum'
    },
    {
      id: 'BNB',
      name: 'BNB',
      symbol: 'BNB',
      icon: 'https://assets.coingecko.com/coins/images/825/large/binance-coin-logo.png',
      address: 'bnb1jxfh2g85q3v0tdq56fnevx6xcxtcnhtsmcu64m',
      qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=bnb1jxfh2g85q3v0tdq56fnevx6xcxtcnhtsmcu64m',
      minDeposit: 0.01,
      network: 'BNB Smart Chain'
    },
    {
      id: 'USDT',
      name: 'USDT',
      symbol: 'USDT',
      icon: 'https://assets.coingecko.com/coins/images/325/large/Tether.png',
      address: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
      qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
      minDeposit: 10,
      network: 'Ethereum (ERC20)'
    }
  ];

  const selectedAssetData = cryptoAssets.find(asset => asset.id === selectedAsset);

  const DepositMethodSheet = () => {
    return (
      <View className="bg-gray-900 rounded-t-2xl p-4">
        <Text className="text-white text-lg font-bold mb-4 text-center">Select Deposit Method</Text>
        
        <FlatList
          data={depositMethods}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Pressable
              className="flex-row items-center p-4 rounded-xl mb-3 bg-gray-800"
              onPress={() => {
                setSelectedMethod(item.id);
                SheetManager.hide('depositMethod');
              }}
            >
              <View className={`w-12 h-12 rounded-full items-center justify-center mr-3 ${item.bgColor}`}>
                {item.icon}
              </View>
              <View className="flex-1">
                <Text className="text-white font-semibold">{item.title}</Text>
                <Text className="text-gray-400 text-sm">{item.description}</Text>
              </View>
              {selectedMethod === item.id && (
                <View className="w-6 h-6 bg-yellow-400 rounded-full items-center justify-center">
                  <Text className="text-gray-900 text-xs font-bold">✓</Text>
                </View>
              )}
            </Pressable>
          )}
        />
        
        <TouchableOpacity 
          onPress={() => SheetManager.hide('depositMethod')} 
          className="p-3 bg-gray-700 rounded-xl items-center"
        >
          <Text className="text-white font-semibold">Cancel</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const AssetSelectorSheet = () => {
    return (
      <View className="bg-gray-900 rounded-t-2xl p-4">
        <Text className="text-white text-lg font-bold mb-4 text-center">Select Asset</Text>
        
        <FlatList
          data={cryptoAssets}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Pressable
              className="flex-row items-center p-4 rounded-xl mb-3 bg-gray-800"
              onPress={() => {
                setSelectedAsset(item.id);
                SheetManager.hide('assetSelector');
              }}
            >
              <Image source={{ uri: item.icon }} className="w-10 h-10 rounded-full mr-3" />
              <View className="flex-1">
                <Text className="text-white font-semibold">{item.name}</Text>
                <Text className="text-gray-400 text-sm">{item.network}</Text>
              </View>
              {selectedAsset === item.id && (
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

  const handleCopyAddress = () => {
    // Add clipboard functionality here
    console.log('Copied address:', selectedAssetData?.address);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <StatusBar barStyle="light-content" backgroundColor="#111827" translucent={false} />

      {/* Header */}
      <View className="flex-row items-center p-4 border-b border-gray-800">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-2">
          <ArrowLeft size={28} color="#FFD600" />
        </TouchableOpacity>
        <Text className="font-bold text-xl text-yellow-400 flex-1 text-center">Deposit</Text>
        <View className="w-8" />
      </View>

      <ScrollView className="flex-1" keyboardShouldPersistTaps="handled">
        {/* Deposit Method Selector */}
        <View className="px-4 mt-6 mb-4">
          <Text className="text-gray-400 text-sm mb-2">Deposit Method</Text>
          <TouchableOpacity onPress={() => SheetManager.show('depositMethod')}>
            <View className="bg-gray-800 rounded-xl p-4 flex-row items-center">
              {depositMethods.find(m => m.id === selectedMethod)?.icon}
              <View className="flex-1 ml-3">
                <Text className="text-white font-semibold">
                  {depositMethods.find(m => m.id === selectedMethod)?.title}
                </Text>
                <Text className="text-gray-400 text-sm">
                  {depositMethods.find(m => m.id === selectedMethod)?.description}
                </Text>
              </View>
              <ExternalLink size={20} color="#FFD600" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Crypto Deposit Section */}
        {selectedMethod === 'crypto' && (
          <>
            {/* Asset Selector */}
            <View className="px-4 mb-4">
              <Text className="text-gray-400 text-sm mb-2">Select Asset</Text>
              <TouchableOpacity onPress={() => SheetManager.show('assetSelector')}>
                <View className="bg-gray-800 rounded-xl p-4 flex-row items-center">
                  <Image 
                    source={{ uri: selectedAssetData?.icon }} 
                    className="w-10 h-10 rounded-full mr-3" 
                  />
                  <View className="flex-1">
                    <Text className="text-white font-semibold">{selectedAssetData?.name}</Text>
                    <Text className="text-gray-400 text-sm">{selectedAssetData?.network}</Text>
                  </View>
                  <ExternalLink size={20} color="#FFD600" />
                </View>
              </TouchableOpacity>
            </View>

            {/* QR Code and Address */}
            <View className="px-4 mb-4">
              <View className="bg-gray-800 rounded-xl p-6 items-center">
                <Text className="text-white font-bold text-lg mb-4">Deposit {selectedAssetData?.name}</Text>
                
                {/* QR Code */}
                <View className="bg-white p-4 rounded-xl mb-4">
                  <Image 
                    source={{ uri: selectedAssetData?.qrCode }} 
                    className="w-48 h-48"
                    resizeMode="contain"
                  />
                </View>

                {/* Address */}
                <View className="w-full">
                  <Text className="text-gray-400 text-sm mb-2 text-center">Deposit Address</Text>
                  <View className="flex-row items-center bg-gray-700 rounded-xl px-3 py-2">
                    <Text className="flex-1 text-white font-mono text-xs">
                      {selectedAssetData?.address}
                    </Text>
                    <TouchableOpacity onPress={handleCopyAddress} className="ml-2">
                      <Copy size={20} color="#FFD600" />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Info */}
                <View className="mt-4 p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                  <Text className="text-yellow-400 text-xs text-center">
                    ⚠️ Minimum deposit: {selectedAssetData?.minDeposit} {selectedAssetData?.symbol}
                  </Text>
                </View>
              </View>
            </View>
          </>
        )}

        {/* Other Payment Methods */}
        {selectedMethod !== 'crypto' && (
          <View className="px-4 mb-4">
            <View className="bg-gray-800 rounded-xl p-6 items-center">
              <View className="w-16 h-16 bg-yellow-500/20 rounded-full items-center justify-center mb-4">
                {depositMethods.find(m => m.id === selectedMethod)?.icon}
              </View>
              <Text className="text-white font-bold text-lg mb-2">
                {depositMethods.find(m => m.id === selectedMethod)?.title} Coming Soon
              </Text>
              <Text className="text-gray-400 text-center mb-4">
                We're working on integrating {depositMethods.find(m => m.id === selectedMethod)?.title.toLowerCase()} payments. 
                Please use cryptocurrency for now.
              </Text>
              <TouchableOpacity 
                className="bg-yellow-400 px-6 py-3 rounded-xl"
                onPress={() => setSelectedMethod('crypto')}
              >
                <Text className="text-gray-900 font-bold">Use Cryptocurrency</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Info Section */}
        <View className="px-4 mb-4">
          <View className="bg-gray-800 rounded-xl p-4">
            <Text className="text-gray-400 text-sm mb-2 font-semibold">Important Information:</Text>
            <Text className="text-gray-400 text-xs mb-1">• Only send {selectedAssetData?.symbol} to this address</Text>
            <Text className="text-gray-400 text-xs mb-1">• Deposits are credited after 3 confirmations</Text>
            <Text className="text-gray-400 text-xs mb-1">• Minimum deposit: {selectedAssetData?.minDeposit} {selectedAssetData?.symbol}</Text>
            <Text className="text-gray-400 text-xs">• Double-check the address before sending</Text>
          </View>
        </View>

        {/* Spacer for bottom nav */}
        <View className="h-16" />
      </ScrollView>

      {/* ActionSheets */}
      <ActionSheet id="depositMethod">
        <DepositMethodSheet />
      </ActionSheet>

      <ActionSheet id="assetSelector">
        <AssetSelectorSheet />
      </ActionSheet>
    </SafeAreaView>
  );
} 
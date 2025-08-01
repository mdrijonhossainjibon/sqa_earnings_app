import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, StatusBar, FlatList, Pressable, Alert, Button, ToastAndroid } from 'react-native';
import { 
  ArrowLeft, 
  CreditCard, 
  Banknote, 
  Smartphone, 
  QrCode, 
  Lock, 
  Shield, 
  CheckCircle, 
  XCircle, 
  Clock, 
  DollarSign,
  Eye,
  EyeOff,
  Copy,
  ExternalLink,
  AlertTriangle,
  Info,
  Zap
} from 'lucide-react-native';
import ActionSheet, { ActionSheetRef, SheetManager } from 'react-native-actions-sheet';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';

export default function GFPayScreen({ navigation, route }: any) {
  const [amount, setAmount] = useState('');
 
  
  const [isSuccess, setIsSuccess] = useState(true);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
 
  // Coin selection
  const [coins, setCoins] = useState<any[]>([]);
  const [selectedCoin, setSelectedCoin] = useState<any>(null);

  useEffect(() => {
    axios.get('https://api.coingecko.com/api/v3/coins/markets', {
      params: {
        vs_currency: 'usd',
        ids: 'tether,bitcoin,ethereum', // usdt, btc, eth
        order: 'market_cap_desc',
        per_page: 3,
        page: 1,
        sparkline: false,
      }
    })
    .then(res => {
      setCoins(res.data);
      setSelectedCoin(res.data[0]);
    })
    .catch(err => {
      // fallback to hardcoded if needed
      const fallback = [
        { id: 'tether', name: 'Tether', image: 'https://cryptologos.cc/logos/tether-usdt-logo.png' },
        { id: 'bitcoin', name: 'Bitcoin', image: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png' },
        { id: 'ethereum', name: 'Ethereum', image: 'https://cryptologos.cc/logos/ethereum-eth-logo.png' },
      ];
      setCoins(fallback);
      setSelectedCoin(fallback[0]);
    });
  }, []);

 
 const randomMerchant = { name: 'E-Shop', logo: 'https://randomuser.me/api/portraits/women/44.jpg' }

  const paymentDetails = route.params?.paymentDetails || {
    amount: 0,
    currency: 'USDT',
    merchant: randomMerchant.name,
    merchantLogo: randomMerchant.logo,
    orderId: `ORDER-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
  };

   
   
 

  
  // Update handlePayment to show confirmation sheet
  const handlePayment = async () => {
    SheetManager.show('ghghjgj');
  };
 

  // Add a helper to reset payment result state
  const resetPaymentState = () => {
 
    setIsSuccess(false);
    setIsError(false);
    setErrorMessage('');
  };

  const PaymentResultSheet = () => {
    
    const handleClose = () => {
      SheetManager.hide('paymentResult');
      resetPaymentState();
    };

    return (
      <View className="p-6 items-center">
        {isSuccess ? (
          <View className="w-full items-center">
            <View className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full items-center justify-center mb-4 shadow-lg">
              <CheckCircle size={40} color="#FFFFFF" />
            </View>
            
            <Text className="text-xl font-bold text-gray-900 mb-2">🎉 Payment Successful!</Text>
            <Text className="text-gray-700 text-center mb-4">
              Your payment of ${amount} has been processed successfully.
            </Text>

            <View className="w-full bg-green-50 rounded-xl p-4 mb-4 border border-green-200">
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-green-800 font-semibold">Amount Paid</Text>
                <Text className="text-green-800 font-bold text-lg">${amount}</Text>
              </View>
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-green-700 text-sm">Order ID</Text>
                <Text className="text-green-800 font-mono text-sm">{paymentDetails.orderId}</Text>
              </View>
              <View className="flex-row items-center justify-between">
                <Text className="text-green-700 text-sm">Payment Method</Text>
         
              </View>
            </View>

            <TouchableOpacity 
              className="w-full bg-green-500 py-3 rounded-xl items-center shadow-lg" 
              onPress={handleClose}
            >
              <Text className="text-white font-bold text-lg">Continue</Text>
            </TouchableOpacity>
          </View>
        ) : isError ? (
          <View className="w-full items-center">
            <View className="w-20 h-20 bg-gradient-to-br from-red-400 to-red-600 rounded-full items-center justify-center mb-4 shadow-lg">
              <XCircle size={40} color="#FFFFFF" />
            </View>
            
            <Text className="text-xl font-bold text-gray-900 mb-2">❌ Payment Failed</Text>
            <Text className="text-gray-700 text-center mb-4">
              {errorMessage}
            </Text>

            <View className="w-full space-y-3">
              <TouchableOpacity 
                className="w-full bg-red-500 py-3 rounded-xl items-center shadow-lg" 
                onPress={() => {
                  setIsError(false);
                  
                  setIsSuccess(false);
                  // Optionally, re-show confirm or payment sheet
                }}
              >
                <Text className="text-white font-bold text-lg">Try Again</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                className="w-full bg-gray-100 py-3 rounded-xl items-center" 
                onPress={handleClose}
              >
                <Text className="text-gray-700 font-semibold">Cancel Payment</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View className="w-full items-center">
            <View className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full items-center justify-center mb-4 shadow-lg">
              <View className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
            </View>
            
            <Text className="text-lg font-semibold text-gray-900 mb-2">Processing Payment...</Text>
            <Text className="text-gray-600 text-center mb-4">
              Please wait while we process your payment securely.
            </Text>

            <View className="w-full space-y-2 mb-4">
              <View className="flex-row items-center">
                <View className="w-6 h-6 bg-green-500 rounded-full items-center justify-center mr-3">
                  <Text className="text-white text-xs font-bold">✓</Text>
                </View>
                <Text className="text-gray-700 text-sm">Validating payment details</Text>
              </View>
              <View className="flex-row items-center">
                <View className="w-6 h-6 bg-yellow-500 rounded-full items-center justify-center mr-3">
                  <View className="w-3 h-3 bg-white rounded-full animate-pulse" />
                </View>
                <Text className="text-gray-700 text-sm">Processing with GFPay</Text>
              </View>
              <View className="flex-row items-center">
                <View className="w-6 h-6 bg-gray-300 rounded-full items-center justify-center mr-3">
                  <Text className="text-gray-500 text-xs">3</Text>
                </View>
                <Text className="text-gray-500 text-sm">Confirming transaction</Text>
              </View>
            </View>

            <View className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
              <Text className="text-yellow-800 text-xs text-center">
                🔒 Your payment is secured by bank-level encryption
              </Text>
            </View>
          </View>
        )}
      </View>
    );
  };

  // Add ConfirmPaySheet component
  const ConfirmPaySheet = () => {

    const handleYes = () => {
      SheetManager.hide('confirmPay');
     ToastAndroid.show('confirmPay',1000)
      SheetManager.show('confirmPay');
      
    };
    const handleCancel = () => {
      SheetManager.hide('confirmPay');
    };
    return (
      <View className="p-6 items-center">
        <Text className="text-xl font-bold text-gray-900 mb-4 text-center">Are you sure you want to pay?</Text>
        <Text className="text-gray-700 text-center mb-6">You are about to pay ${amount || '0.00'} {selectedCoin ? selectedCoin.name : ''} to {paymentDetails.merchant}.</Text>
        <View className="w-full flex-row">
          <TouchableOpacity 
            className="flex-1 bg-gray-100 py-3 rounded-xl items-center" 
            onPress={handleCancel}
          >
            <Text className="text-gray-700 font-semibold">Cancel</Text>
          </TouchableOpacity>
          <View style={{ width: 12 }} />
          <TouchableOpacity 
            className="flex-1 bg-yellow-400 py-3 rounded-xl items-center shadow-lg" 
            onPress={handleYes}
          >
            <Text className="text-gray-900 font-bold text-lg">Yes, Pay</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // Coin Selector Sheet
  const CoinSelectorSheet = () => (
    <View className="bg-gray-900 rounded-t-2xl p-4">
      <Text className="text-white text-lg font-bold mb-4 text-center">Select Coin</Text>
      {coins.map(coin => (
        <TouchableOpacity
          key={coin.id}
          className="flex-row items-center p-4 rounded-xl mb-3 bg-gray-800"
          onPress={() => {
            setSelectedCoin(coin);
            SheetManager.hide('coinSelector');
          }}
        >
          <Image source={{ uri: coin.image }} style={{ width: 24, height: 24, marginRight: 8 }} />
          <Text className="text-white font-semibold">{coin.name}</Text>
        </TouchableOpacity>
      ))}
      <TouchableOpacity
        onPress={() => SheetManager.hide('coinSelector')}
        className="p-3 bg-gray-700 rounded-xl items-center"
      >
        <Text className="text-white font-semibold">Cancel</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <StatusBar barStyle="light-content" backgroundColor="#111827" translucent={false} />

      {/* Header */}
      <View className="flex-row items-center p-4 border-b border-gray-800">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-2">
          <ArrowLeft size={28} color="#FFD600" />
        </TouchableOpacity>
        <Text className="font-bold text-xl text-yellow-400 flex-1 text-center">Pay with GFPay</Text>
        <View className="w-8" />
      </View>

      {/* Merchant Shop Details */}
      <View className="px-4 mt-4 mb-2">
        <View className="bg-gray-800 rounded-2xl flex-row items-center p-4 shadow-lg mb-2">
          {/* Merchant Logo */}r
          <Image
            source={{ uri: paymentDetails.merchantLogo }}
            style={{ width: 36, height: 36, borderRadius: 18, marginRight: 12 }}
          />
          <View>
            <Text className="text-white text-base font-bold mb-1">{paymentDetails.merchant}</Text>
            <Text className="text-gray-400 text-xs">Order ID: <Text className="font-mono">{paymentDetails.orderId}</Text></Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1" keyboardShouldPersistTaps="handled">
        {/* Select Coin */}
        <View className="px-4 mb-4">
          <Text className="text-gray-400 text-sm mb-2">Select Coin</Text>
          <TouchableOpacity
            className="bg-gray-800 rounded-xl p-4 flex-row items-center"
            onPress={() => SheetManager.show('coinSelector')}
          >
            {selectedCoin && (
              <Image source={{ uri: selectedCoin.image }} style={{ width: 24, height: 24, marginRight: 8 }} />
            )}
            <Text className="text-white font-semibold">{selectedCoin ? selectedCoin.name : ''}</Text>
          </TouchableOpacity>
        </View>

        <View className="px-4 mb-4">
          <Text className="text-gray-400 text-sm mb-2">Enter Amount</Text>
          <TextInput
            className="bg-gray-800 rounded-xl p-4 text-white font-semibold"
            placeholder="0.00"
            placeholderTextColor="#9CA3AF"
            keyboardType="decimal-pad"
            value={amount}
            onChangeText={setAmount}
          />
        </View>

        

         

        {/* Security Info */}
        <View className="px-4 mb-4">
          <View className="bg-gray-800 rounded-xl p-4">
            <View className="flex-row items-center mb-2">
              <Shield size={16} color="#10B981" />
              <Text className="text-green-400 text-sm ml-2 font-semibold">Secure Payment</Text>
            </View>
            <Text className="text-gray-400 text-xs mb-1">• Your payment is protected by bank-level SSL encryption</Text>
            <Text className="text-gray-400 text-xs mb-1">• We never store your card details</Text>
            <Text className="text-gray-400 text-xs">• All transactions are processed securely by GFPay</Text>
          </View>
        </View>

        {/* Pay Button */}
        <View className="px-4 mb-4">
          <TouchableOpacity 
            className={`w-full py-4 rounded-xl items-center ${
              amount && parseFloat(amount) > 0 ? 'bg-yellow-400' : 'bg-gray-700'
            }`}
            onPress={handlePayment}
          >
            <Text className={`font-bold text-lg ${
              amount && parseFloat(amount) > 0 ? 'text-gray-900' : 'text-gray-400'
            }`}>
              Pay ${amount || '0.00'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Spacer for bottom nav */}
        <View className="h-16" />
      </ScrollView>

      

      <ActionSheet id="paymentResult">
        <PaymentResultSheet />
      </ActionSheet>

      <ActionSheet id="ghghjgj">
        <Button title='rerfefc' /> 
      </ActionSheet>


      <ActionSheet id="coinSelector">
        <CoinSelectorSheet />
      </ActionSheet>

      {/* Confirmation ActionSheet */}
      <ActionSheet id="confirmPay">
        <ConfirmPaySheet />
      </ActionSheet>
    </SafeAreaView>
  );
} 
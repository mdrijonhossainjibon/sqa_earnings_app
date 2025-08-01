import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, StatusBar, FlatList, Pressable, RefreshControl } from 'react-native';
import { 
  ArrowLeft, 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Copy, 
  Eye, 
  EyeOff, 
  Search, 
  Filter,
  Calendar,
  DollarSign,
  Coins,
  Gift,
  Clock,
  CheckCircle,
  XCircle,
  MoreHorizontal,
  QrCode,
  CreditCard,
  Banknote,
  Smartphone
} from 'lucide-react-native';
import ActionSheet, { ActionSheetRef, SheetManager } from 'react-native-actions-sheet';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function WalletScreen({ navigation }: any) {
  const [isBalanceHidden, setIsBalanceHidden] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState('7D');
  const [selectedFilter, setSelectedFilter] = useState('All');

  // Mock wallet data
  const walletData = {
    totalBalance: 1247.89,
    totalBalanceUSD: 1247.89,
    change24h: 23.45,
    changePercent24h: 1.92,
    isPositive: true,
    totalAssets: 5,
    totalTransactions: 47
  };

  // Mock assets
  const assets = [
    {
      id: '1',
      name: 'Bitcoin',
      symbol: 'BTC',
      icon: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
      balance: 0.0234,
      balanceUSD: 789.45,
      price: 33737.18,
      change24h: 2.34,
      isPositive: true,
      percentage: 63.2
    },
    {
      id: '2',
      name: 'Ethereum',
      symbol: 'ETH',
      icon: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
      balance: 1.234,
      balanceUSD: 2345.67,
      price: 1900.45,
      change24h: -1.23,
      isPositive: false,
      percentage: 23.1
    },
    {
      id: '3',
      name: 'BNB',
      symbol: 'BNB',
      icon: 'https://assets.coingecko.com/coins/images/825/large/binance-coin-logo.png',
      balance: 12.5,
      balanceUSD: 456.78,
      price: 365.42,
      change24h: 0.87,
      isPositive: true,
      percentage: 8.9
    },
    {
      id: '4',
      name: 'USDT',
      symbol: 'USDT',
      icon: 'https://assets.coingecko.com/coins/images/325/large/Tether.png',
      balance: 1000.0,
      balanceUSD: 1000.0,
      price: 1.00,
      change24h: 0.01,
      isPositive: true,
      percentage: 4.8
    }
  ];

  // Mock transactions
  const transactions = [
    {
      id: '1',
      type: 'deposit',
      asset: 'BTC',
      amount: 0.001,
      amountUSD: 33.74,
      status: 'completed',
      timestamp: '2024-01-15T10:30:00Z',
      txHash: '0x1234...5678',
      from: '0xabcd...efgh',
      to: '0x1234...5678',
      fee: 0.0001,
      icon: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png'
    },
    {
      id: '2',
      type: 'withdrawal',
      asset: 'ETH',
      amount: 0.5,
      amountUSD: 950.23,
      status: 'completed',
      timestamp: '2024-01-14T15:45:00Z',
      txHash: '0x5678...9abc',
      from: '0x1234...5678',
      to: '0xabcd...efgh',
      fee: 0.002,
      icon: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png'
    },
    {
      id: '3',
      type: 'swap',
      asset: 'BNB',
      amount: 5.0,
      amountUSD: 1827.10,
      status: 'completed',
      timestamp: '2024-01-13T09:15:00Z',
      txHash: '0x9abc...def0',
      from: '0x1234...5678',
      to: '0x1234...5678',
      fee: 0.001,
      icon: 'https://assets.coingecko.com/coins/images/825/large/binance-coin-logo.png'
    },
    {
      id: '4',
      type: 'reward',
      asset: 'USDT',
      amount: 25.0,
      amountUSD: 25.0,
      status: 'completed',
      timestamp: '2024-01-12T14:20:00Z',
      txHash: '0xdef0...1234',
      from: 'System',
      to: '0x1234...5678',
      fee: 0,
      icon: 'https://assets.coingecko.com/coins/images/325/large/Tether.png'
    },
    {
      id: '5',
      type: 'deposit',
      asset: 'BTC',
      amount: 0.002,
      amountUSD: 67.48,
      status: 'pending',
      timestamp: '2024-01-11T11:30:00Z',
      txHash: '0x1234...5678',
      from: '0xabcd...efgh',
      to: '0x1234...5678',
      fee: 0.0001,
      icon: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png'
    }
  ];

  const timeframes = ['24H', '7D', '30D', '90D', '1Y'];
  const filters = ['All', 'Deposits', 'Withdrawals', 'Swaps', 'Rewards'];

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setRefreshing(false);
  };

  const formatBalance = (balance: number) => {
    if (isBalanceHidden) return '••••••';
    return `$${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <ArrowDownLeft size={20} color="#10B981" />;
      case 'withdrawal':
        return <ArrowUpRight size={20} color="#EF4444" />;
      case 'swap':
        return <TrendingUp size={20} color="#6366F1" />;
      case 'reward':
        return <Gift size={20} color="#F59E0B" />;
      default:
        return <MoreHorizontal size={20} color="#6B7280" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#10B981';
      case 'pending':
        return '#F59E0B';
      case 'failed':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  const QuickActionsSheet = () => {
    return (
      <View className="bg-gray-900 rounded-t-2xl p-4">
        <Text className="text-white text-lg font-bold mb-4 text-center">Quick Actions</Text>
        
        <View className="grid grid-cols-2 gap-3 mb-4">
          <TouchableOpacity 
            className="bg-gray-800 rounded-xl p-4 items-center"
            onPress={() => {
              SheetManager.hide('quickActions');
              navigation.navigate('Deposit');
            }}
          >
            <View className="w-12 h-12 bg-green-500 rounded-full items-center justify-center mb-2">
              <Plus size={24} color="#FFFFFF" />
            </View>
            <Text className="text-white font-semibold">Deposit</Text>
            <Text className="text-gray-400 text-xs">Add funds</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            className="bg-gray-800 rounded-xl p-4 items-center"
            onPress={() => {
              SheetManager.hide('quickActions');
              navigation.navigate('Withdraw');
            }}
          >
            <View className="w-12 h-12 bg-red-500 rounded-full items-center justify-center mb-2">
              <ArrowUpRight size={24} color="#FFFFFF" />
            </View>
            <Text className="text-white font-semibold">Withdraw</Text>
            <Text className="text-gray-400 text-xs">Send funds</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            className="bg-gray-800 rounded-xl p-4 items-center"
            onPress={() => {
              SheetManager.hide('quickActions');
              navigation.navigate('Swap');
            }}
          >
            <View className="w-12 h-12 bg-blue-500 rounded-full items-center justify-center mb-2">
              <TrendingUp size={24} color="#FFFFFF" />
            </View>
            <Text className="text-white font-semibold">Swap</Text>
            <Text className="text-gray-400 text-xs">Exchange</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            className="bg-gray-800 rounded-xl p-4 items-center"
            onPress={() => {
              SheetManager.hide('quickActions');
              navigation.navigate('CouponClaim');
            }}
          >
            <View className="w-12 h-12 bg-yellow-500 rounded-full items-center justify-center mb-2">
              <Gift size={24} color="#FFFFFF" />
            </View>
            <Text className="text-white font-semibold">Coupons</Text>
            <Text className="text-gray-400 text-xs">Claim rewards</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          onPress={() => SheetManager.hide('quickActions')} 
          className="p-3 bg-gray-700 rounded-xl items-center"
        >
          <Text className="text-white font-semibold">Cancel</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const TransactionDetailSheet = ({ transaction }: { transaction: any }) => {
    return (
      <View className="bg-gray-900 rounded-t-2xl p-4">
        <View className="items-center mb-4">
          <View className="w-16 h-16 rounded-full items-center justify-center mb-3 bg-gray-800">
            <Image source={{ uri: transaction.icon }} className="w-8 h-8 rounded-full" />
          </View>
          <Text className="text-white text-lg font-bold">{transaction.type.toUpperCase()}</Text>
          <Text className="text-gray-400 text-sm">{formatDate(transaction.timestamp)}</Text>
        </View>

        <View className="bg-gray-800 rounded-xl p-4 mb-4">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-gray-400 text-sm">Amount</Text>
            <Text className="text-white font-bold text-lg">
              {transaction.amount} {transaction.asset}
            </Text>
          </View>
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-gray-400 text-sm">Value (USD)</Text>
            <Text className="text-white font-semibold">${transaction.amountUSD}</Text>
          </View>
          <View className="flex-row items-center justify-between">
            <Text className="text-gray-400 text-sm">Status</Text>
            <View className="flex-row items-center">
              <View 
                className="w-2 h-2 rounded-full mr-2"
                style={{ backgroundColor: getStatusColor(transaction.status) }}
              />
              <Text className="text-white font-semibold capitalize">{transaction.status}</Text>
            </View>
          </View>
        </View>

        <View className="space-y-3 mb-4">
          <View className="flex-row items-center justify-between">
            <Text className="text-gray-400 text-sm">Transaction Hash</Text>
            <TouchableOpacity onPress={() => console.log('Copy hash')}>
              <Copy size={16} color="#FFD600" />
            </TouchableOpacity>
          </View>
          <Text className="text-yellow-400 font-mono text-xs">{transaction.txHash}</Text>
          
          <View className="flex-row items-center justify-between">
            <Text className="text-gray-400 text-sm">From</Text>
            <Text className="text-white font-mono text-xs">{transaction.from}</Text>
          </View>
          
          <View className="flex-row items-center justify-between">
            <Text className="text-gray-400 text-sm">To</Text>
            <Text className="text-white font-mono text-xs">{transaction.to}</Text>
          </View>
          
          <View className="flex-row items-center justify-between">
            <Text className="text-gray-400 text-sm">Network Fee</Text>
            <Text className="text-white font-semibold">{transaction.fee} {transaction.asset}</Text>
          </View>
        </View>

        <TouchableOpacity 
          onPress={() => SheetManager.hide('transactionDetail')} 
          className="p-3 bg-gray-700 rounded-xl items-center"
        >
          <Text className="text-white font-semibold">Close</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <StatusBar barStyle="light-content" backgroundColor="#111827" translucent={false} />

      {/* Header */}
      <View className="flex-row items-center justify-between p-4 border-b border-gray-800">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-2">
          <ArrowLeft size={28} color="#FFD600" />
        </TouchableOpacity>
        <Text className="font-bold text-xl text-yellow-400">Wallet</Text>
        <TouchableOpacity onPress={() => SheetManager.show('quickActions')}>
          <MoreHorizontal size={28} color="#FFD600" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        className="flex-1" 
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FFD600" />
        }
      >
        {/* Balance Card */}
        <View className="px-4 mt-6 mb-4">
          <View className="bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl p-6 shadow-lg">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-gray-900 font-semibold">Total Balance</Text>
              <TouchableOpacity onPress={() => setIsBalanceHidden(!isBalanceHidden)}>
                {isBalanceHidden ? <Eye size={24} color="#1F2937" /> : <EyeOff size={24} color="#1F2937" />}
              </TouchableOpacity>
            </View>
            
            <Text className="text-3xl font-bold text-gray-900 mb-2">
              {formatBalance(walletData.totalBalance)}
            </Text>
            
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                {walletData.isPositive ? (
                  <TrendingUp size={16} color="#10B981" />
                ) : (
                  <TrendingDown size={16} color="#EF4444" />
                )}
                <Text className={`ml-1 font-semibold ${walletData.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                  {walletData.isPositive ? '+' : ''}{walletData.changePercent24h}%
                </Text>
                <Text className="text-gray-700 text-sm ml-1">24h</Text>
              </View>
              <Text className="text-gray-700 text-sm">
                {walletData.totalAssets} assets
              </Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View className="px-4 mb-4">
          <View className="flex-row justify-between mb-3">
            <TouchableOpacity 
              className="flex-1 bg-gray-800 rounded-xl p-4 mr-2 items-center"
              onPress={() => navigation.navigate('Deposit')}
            >
              <View className="w-10 h-10 bg-green-500 rounded-full items-center justify-center mb-2">
                <Plus size={20} color="#FFFFFF" />
              </View>
              <Text className="text-white font-semibold text-sm">Deposit</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              className="flex-1 bg-gray-800 rounded-xl p-4 mx-1 items-center"
              onPress={() => navigation.navigate('Withdraw')}
            >
              <View className="w-10 h-10 bg-red-500 rounded-full items-center justify-center mb-2">
                <ArrowUpRight size={20} color="#FFFFFF" />
              </View>
              <Text className="text-white font-semibold text-sm">Withdraw</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              className="flex-1 bg-gray-800 rounded-xl p-4 ml-2 items-center"
              onPress={() => navigation.navigate('Swap')}
            >
              <View className="w-10 h-10 bg-blue-500 rounded-full items-center justify-center mb-2">
                <TrendingUp size={20} color="#FFFFFF" />
              </View>
              <Text className="text-white font-semibold text-sm">Swap</Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity 
            className="w-full bg-gray-800 rounded-xl p-4 items-center"
            onPress={() => navigation.navigate('GFPay', {
              paymentDetails: {
                title: 'Wallet Payment',
                description: 'Make a payment using your wallet balance',
                amount: walletData.totalBalance,
                currency: 'USD',
                merchant: 'SQA Earning',
                orderId: `PAY-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
              }
            })}
          >
            <View className="w-10 h-10 bg-yellow-500 rounded-full items-center justify-center mb-2">
              <DollarSign size={20} color="#FFFFFF" />
            </View>
            <Text className="text-white font-semibold text-sm">Pay with GFPay</Text>
          </TouchableOpacity>
        </View>

        {/* Assets Section */}
        <View className="px-4 mb-4">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-white font-bold text-lg">Assets</Text>
            <TouchableOpacity>
              <Text className="text-yellow-400 text-sm">View All</Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={assets}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <TouchableOpacity className="bg-gray-800 rounded-xl p-4 mb-3">
                <View className="flex-row items-center">
                  <Image source={{ uri: item.icon }} className="w-12 h-12 rounded-full mr-3" />
                  <View className="flex-1">
                    <View className="flex-row items-center justify-between">
                      <Text className="text-white font-semibold">{item.name}</Text>
                      <Text className="text-white font-bold">${item.balanceUSD.toFixed(2)}</Text>
                    </View>
                    <View className="flex-row items-center justify-between mt-1">
                      <Text className="text-gray-400 text-sm">{item.balance} {item.symbol}</Text>
                      <View className="flex-row items-center">
                        {item.isPositive ? (
                          <TrendingUp size={12} color="#10B981" />
                        ) : (
                          <TrendingDown size={12} color="#EF4444" />
                        )}
                        <Text className={`ml-1 text-xs ${item.isPositive ? 'text-green-400' : 'text-red-400'}`}>
                          {item.isPositive ? '+' : ''}{item.change24h}%
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>

        {/* Transactions Section */}
        <View className="px-4 mb-4">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-white font-bold text-lg">Recent Transactions</Text>
            <TouchableOpacity onPress={() => navigation.navigate('History')}>
              <Text className="text-yellow-400 text-sm">View All</Text>
            </TouchableOpacity>
          </View>

          {/* Timeframe and Filter */}
          <View className="flex-row items-center justify-between mb-3">
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-1 mr-2">
              {timeframes.map((timeframe) => (
                <TouchableOpacity
                  key={timeframe}
                  className={`px-3 py-1 rounded-full mr-2 ${
                    selectedTimeframe === timeframe ? 'bg-yellow-400' : 'bg-gray-800'
                  }`}
                  onPress={() => setSelectedTimeframe(timeframe)}
                >
                  <Text className={`text-xs font-semibold ${
                    selectedTimeframe === timeframe ? 'text-gray-900' : 'text-gray-400'
                  }`}>
                    {timeframe}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity className="bg-gray-800 p-2 rounded-lg">
              <Filter size={16} color="#FFD600" />
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={transactions}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <TouchableOpacity 
                className="bg-gray-800 rounded-xl p-4 mb-3"
                onPress={() => SheetManager.show('transactionDetail')}
              >
                <View className="flex-row items-center">
                  <View className="w-10 h-10 rounded-full items-center justify-center mr-3 bg-gray-700">
                    {getTransactionIcon(item.type)}
                  </View>
                  <View className="flex-1">
                    <View className="flex-row items-center justify-between">
                      <Text className="text-white font-semibold capitalize">{item.type}</Text>
                      <Text className={`font-bold ${item.type === 'withdrawal' ? 'text-red-400' : 'text-green-400'}`}>
                        {item.type === 'withdrawal' ? '-' : '+'}{item.amount} {item.asset}
                      </Text>
                    </View>
                    <View className="flex-row items-center justify-between mt-1">
                      <Text className="text-gray-400 text-sm">{formatDate(item.timestamp)}</Text>
                      <View className="flex-row items-center">
                        <View 
                          className="w-2 h-2 rounded-full mr-2"
                          style={{ backgroundColor: getStatusColor(item.status) }}
                        />
                        <Text className="text-gray-400 text-xs capitalize">{item.status}</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>

        {/* Spacer for bottom nav */}
        <View className="h-16" />
      </ScrollView>

      {/* ActionSheets */}
      <ActionSheet id="quickActions">
        <QuickActionsSheet />
      </ActionSheet>

      <ActionSheet id="transactionDetail">
        <TransactionDetailSheet transaction={transactions[0]} />
      </ActionSheet>
    </SafeAreaView>
  );
} 
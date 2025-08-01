import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, FlatList, TextInput, Image, StatusBar } from 'react-native';
import { ArrowLeft, Search, Filter, Download, Eye, EyeOff, ArrowUpRight, ArrowDownLeft, DollarSign, Users } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HistoryScreen({ navigation }: any) {
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showBalance, setShowBalance] = useState(true);

  const filters = ['All', 'Withdrawals', 'Deposits', 'Earnings', 'Referrals'];

  const transactions = [
    {
      id: '1',
      type: 'withdrawal',
      status: 'completed',
      amount: '0.5234',
      symbol: 'BTC',
      network: 'Bitcoin',
      date: '2024-01-15',
      time: '14:30',
      address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
      txHash: '0x1234567890abcdef',
      icon: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
      value: '$18,000.00'
    },
    {
      id: '2',
      type: 'deposit',
      status: 'completed',
      amount: '1.2345',
      symbol: 'ETH',
      network: 'ERC20',
      date: '2024-01-14',
      time: '09:15',
      address: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
      txHash: '0xabcdef1234567890',
      icon: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
      value: '$2,000.00'
    },
    {
      id: '3',
      type: 'earning',
      status: 'completed',
      amount: '50.00',
      symbol: 'USDT',
      network: 'BEP20',
      date: '2024-01-13',
      time: '16:45',
      address: 'Task Completion',
      txHash: 'TASK_001',
      icon: 'https://assets.coingecko.com/coins/images/325/large/Tether.png',
      value: '$50.00'
    },
    {
      id: '4',
      type: 'referral',
      status: 'completed',
      amount: '25.00',
      symbol: 'USDT',
      network: 'BEP20',
      date: '2024-01-12',
      time: '11:20',
      address: 'Referral Bonus',
      txHash: 'REF_001',
      icon: 'https://assets.coingecko.com/coins/images/325/large/Tether.png',
      value: '$25.00'
    },
    {
      id: '5',
      type: 'withdrawal',
      status: 'pending',
      amount: '100.00',
      symbol: 'USDT',
      network: 'TRC20',
      date: '2024-01-11',
      time: '13:10',
      address: 'TQn9Y2khDD95J42FQtQTdwVVRzp4XeHqHq',
      txHash: '0x9876543210fedcba',
      icon: 'https://assets.coingecko.com/coins/images/325/large/Tether.png',
      value: '$100.00'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-500';
      case 'pending': return 'text-yellow-500';
      case 'failed': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100';
      case 'pending': return 'bg-yellow-100';
      case 'failed': return 'bg-red-100';
      default: return 'bg-gray-100';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'withdrawal': return <ArrowUpRight size={16} color="#9CA3AF" />;
      case 'deposit': return <ArrowDownLeft size={16} color="#9CA3AF" />;
      case 'earning': return <DollarSign size={16} color="#9CA3AF" />;
      case 'referral': return <Users size={16} color="#9CA3AF" />;
      default: return null;
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesFilter = selectedFilter === 'All' || 
      transaction.type === selectedFilter.toLowerCase();
    const matchesSearch = transaction.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         transaction.network.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const renderTransaction = ({ item }: { item: any }) => (
    <TouchableOpacity 
      className="bg-gray-800 rounded-xl p-4 mb-3 mx-4"
      onPress={() => navigation.navigate('TransactionDetail', { transaction: item })}
    >
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center">
          <Image source={{ uri: item.icon }} className="w-10 h-10 rounded-full mr-3" />
          <View>
            <Text className="text-white font-semibold">{item.symbol}</Text>
            <Text className="text-gray-400 text-xs">{item.network}</Text>
          </View>
        </View>
        <View className="items-end">
          <Text className="text-white font-bold">{item.amount}</Text>
          <Text className="text-gray-400 text-xs">{item.value}</Text>
        </View>
      </View>
      
      <View className="flex-row items-center justify-between mb-2">
        <View className="flex-row items-center">
          <View className="mr-2">{getTypeIcon(item.type)}</View>
          <Text className="text-gray-400 text-xs capitalize">{item.type}</Text>
        </View>
        <View className={`px-2 py-1 rounded-full ${getStatusBg(item.status)}`}>
          <Text className={`text-xs font-semibold capitalize ${getStatusColor(item.status)}`}>
            {item.status}
          </Text>
        </View>
      </View>
      
      <View className="flex-row items-center justify-between">
        <Text className="text-gray-400 text-xs">{item.date} • {item.time}</Text>
        <Text className="text-gray-400 text-xs">#{item.txHash.slice(0, 8)}...</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <StatusBar barStyle="light-content" backgroundColor="#111827" translucent={false} />
      
      {/* Header */}
      <View className="flex-row items-center justify-between p-4 border-b border-gray-800">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-2">
          <ArrowLeft size={28} color="#FFD600" />
        </TouchableOpacity>
        <Text className="font-bold text-xl text-yellow-400 flex-1 text-center">Transaction History</Text>
     
      </View>

      {/* Search and Filter */}
      <View className="px-4 mb-4">
        <View className="flex-row items-center bg-gray-800 rounded-xl px-3 py-2 mb-3">
          <Search size={20} color="#9CA3AF" />
          <TextInput
            className="flex-1 ml-2 text-white text-sm"
            placeholder="Search transactions..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-3">
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter}
              className={`px-4 py-2 rounded-full mr-2 ${
                selectedFilter === filter ? 'bg-yellow-400' : 'bg-gray-800'
              }`}
              onPress={() => setSelectedFilter(filter)}
            >
              <Text className={`text-sm font-semibold ${
                selectedFilter === filter ? 'text-gray-900' : 'text-gray-400'
              }`}>
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Transactions List */}
      <FlatList
        data={filteredTransactions}
        renderItem={renderTransaction}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center py-20">
            <Text className="text-gray-400 text-lg mb-2">No transactions found</Text>
            <Text className="text-gray-500 text-sm text-center">
              Try adjusting your search or filter criteria
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, StatusBar, Alert, Animated } from 'react-native';
import { ArrowLeft, Copy, ExternalLink, ArrowUpRight, ArrowDownLeft, DollarSign, Users, CheckCircle, Clock, XCircle, Share2 } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'react-native-linear-gradient';

export default function TransactionDetailScreen({ navigation, route }: any) {
  const { transaction } = route.params || {};
  const [copiedField, setCopiedField] = useState('');
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(50))[0];

  // Sample transaction data if none provided
  const defaultTransaction = {
    id: '1',
    type: 'withdrawal',
    status: 'completed',
    amount: '0.5234',
    symbol: 'BTC',
    network: 'Bitcoin',
    date: '2024-01-15',
    time: '14:30',
    address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
    txHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    icon: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
    value: '$18,000.00',
    fee: '0.0001',
    confirmations: 6,
    blockHeight: 12345678,
    gasPrice: '20 Gwei',
    gasUsed: '21000'
  };

  const tx = transaction || defaultTransaction;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'withdrawal': return <ArrowUpRight size={28} color="#FFD600" />;
      case 'deposit': return <ArrowDownLeft size={28} color="#10B981" />;
      case 'earning': return <DollarSign size={28} color="#3B82F6" />;
      case 'referral': return <Users size={28} color="#8B5CF6" />;
      default: return null;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle size={22} color="#10B981" />;
      case 'pending': return <Clock size={22} color="#F59E0B" />;
      case 'failed': return <XCircle size={22} color="#EF4444" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400';
      case 'pending': return 'text-yellow-400';
      case 'failed': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500/20';
      case 'pending': return 'bg-yellow-500/20';
      case 'failed': return 'bg-red-500/20';
      default: return 'bg-gray-500/20';
    }
  };

  const getTypeGradient = (type: string): [string, string] => {
    switch (type) {
      case 'withdrawal': return ['#FFD600', '#FFA500'];
      case 'deposit': return ['#10B981', '#059669'];
      case 'earning': return ['#3B82F6', '#1D4ED8'];
      case 'referral': return ['#8B5CF6', '#7C3AED'];
      default: return ['#6B7280', '#4B5563'];
    }
  };

  const copyToClipboard = (text: string, field: string) => {
    // In a real app, you'd use Clipboard.setString(text)
    setCopiedField(field);
    setTimeout(() => setCopiedField(''), 2000);
    Alert.alert('Copied!', 'Text copied to clipboard');
  };

  const openExplorer = (hash: string, network: string) => {
    // Generate explorer URL based on network
    let explorerUrl = '';
    switch (network.toLowerCase()) {
      case 'bitcoin':
        explorerUrl = `https://blockstream.info/tx/${hash}`;
        break;
      case 'ethereum':
        explorerUrl = `https://etherscan.io/tx/${hash}`;
        break;
      case 'binance smart chain':
      case 'bsc':
        explorerUrl = `https://bscscan.com/tx/${hash}`;
        break;
      case 'polygon':
        explorerUrl = `https://polygonscan.com/tx/${hash}`;
        break;
      case 'solana':
        explorerUrl = `https://solscan.io/tx/${hash}`;
        break;
      case 'cardano':
        explorerUrl = `https://cardanoscan.io/transaction/${hash}`;
        break;
      case 'polkadot':
        explorerUrl = `https://polkascan.io/polkadot/transaction/${hash}`;
        break;
      case 'tron':
        explorerUrl = `https://tronscan.org/#/transaction/${hash}`;
        break;
      default:
        // Default to Bitcoin explorer
        explorerUrl = `https://blockstream.info/tx/${hash}`;
    }
    
    navigation.navigate('Browser', { 
      url: explorerUrl,
      title: `${network} Explorer`
    });
  };

  const DetailRow = ({ label, value, copyable = false, explorable = false, hash = '', icon = null }: any) => (
    <View className="flex-row items-center justify-between py-4 border-b border-gray-800/50">
      <View className="flex-row items-center flex-1">
        {icon && <View className="mr-3">{icon}</View>}
        <Text className="text-gray-400 text-sm font-medium">{label}</Text>
      </View>
      <View className="flex-row items-center flex-2">
        <Text className="text-white text-sm text-right flex-1 mr-3 font-mono">{value}</Text>
        {copyable && (
          <TouchableOpacity 
            onPress={() => copyToClipboard(value, label)}
            className="bg-gray-700/50 p-2 rounded-lg"
          >
            <Copy size={16} color={copiedField === label ? "#FFD600" : "#9CA3AF"} />
          </TouchableOpacity>
        )}
        {explorable && (
          <TouchableOpacity 
            onPress={() => openExplorer(hash, tx.network)}
            className="bg-blue-500/20 p-2 rounded-lg ml-2"
          >
            <ExternalLink size={16} color="#3B82F6" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <StatusBar barStyle="light-content" backgroundColor="#111827" translucent={false} />
      
      {/* Header with gradient */}
      <LinearGradient
        colors={['#1F2937', '#111827']}
        className="border-b border-gray-800/50"
      >
        <View className="flex-row items-center p-4">
          <TouchableOpacity 
            onPress={() => navigation.goBack()} 
            className="bg-gray-800/50 p-2 rounded-xl mr-3"
          >
            <ArrowLeft size={24} color="#FFD600" />
          </TouchableOpacity>
          <Text className="font-bold text-xl text-white flex-1">Transaction Details</Text>
          <TouchableOpacity className="bg-gray-800/50 p-2 rounded-xl">
            <Share2 size={24} color="#9CA3AF" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <Animated.View 
          style={{ 
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }}
        >
          {/* Transaction Overview Card */}
          <View className="mx-4 mt-6 mb-6">
            <LinearGradient
              colors={getTypeGradient(tx.type)}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="rounded-2xl p-6"
            >
              <View className="flex-row items-center justify-between mb-6">
                <View className="flex-row items-center">
                  <View className="bg-white/20 p-2 rounded-xl mr-4">
                    <Image source={{ uri: tx.icon }} className="w-10 h-10 rounded-lg" />
                  </View>
                  <View>
                    <Text className="text-white text-xl font-bold">{tx.symbol}</Text>
                    <Text className="text-white/80 text-sm">{tx.network}</Text>
                  </View>
                </View>
                <View className="bg-white/20 p-3 rounded-xl">
                  {getTypeIcon(tx.type)}
                </View>
              </View>

              <View className="flex-row items-center justify-between mb-6">
                <View>
                  <Text className="text-white/80 text-sm font-medium">Amount</Text>
                  <Text className="text-white text-3xl font-bold">{tx.amount} {tx.symbol}</Text>
                  <Text className="text-white/80 text-lg font-semibold">{tx.value}</Text>
                </View>
                <View className={`px-4 py-3 rounded-xl ${getStatusBg(tx.status)} flex-row items-center`}>
                  {getStatusIcon(tx.status)}
                  <Text className={`text-sm font-bold capitalize ml-2 ${getStatusColor(tx.status)}`}>
                    {tx.status}
                  </Text>
                </View>
              </View>

              <View className="flex-row items-center justify-between">
                <Text className="text-white/80 text-sm capitalize font-medium">{tx.type}</Text>
                <Text className="text-white/80 text-sm font-medium">{tx.date} • {tx.time}</Text>
              </View>
            </LinearGradient>
          </View>

          {/* Transaction Details */}
          <View className="mx-4 mb-6">
            <Text className="text-white text-xl font-bold mb-4">Transaction Details</Text>
            <View className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50">
              <DetailRow 
                label="Transaction Hash" 
                value={`${tx.txHash.slice(0, 16)}...${tx.txHash.slice(-16)}`} 
                copyable={true} 
                explorable={true}
                hash={tx.txHash}
              />
              <DetailRow 
                label="From Address" 
                value={`${tx.address.slice(0, 12)}...${tx.address.slice(-12)}`} 
                copyable={true}
              />
              <DetailRow 
                label="To Address" 
                value={`${tx.address.slice(0, 12)}...${tx.address.slice(-12)}`} 
                copyable={true}
              />
              <DetailRow label="Network" value={tx.network} />
              <DetailRow label="Block Height" value={tx.blockHeight?.toString() || 'N/A'} />
              <DetailRow label="Confirmations" value={tx.confirmations?.toString() || 'N/A'} />
              {tx.fee && <DetailRow label="Network Fee" value={`${tx.fee} ${tx.symbol}`} />}
              {tx.gasPrice && <DetailRow label="Gas Price" value={tx.gasPrice} />}
              {tx.gasUsed && <DetailRow label="Gas Used" value={tx.gasUsed} />}
            </View>
          </View>

          {/* Actions */}
          <View className="mx-4 mb-6">
            <Text className="text-white text-xl font-bold mb-4">Actions</Text>
            <View className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50">
              <TouchableOpacity 
                className="flex-row items-center justify-between py-4 border-b border-gray-700/50"
                onPress={() => copyToClipboard(tx.txHash, 'hash')}
              >
                <View className="flex-row items-center">
                  <View className="bg-blue-500/20 p-2 rounded-lg mr-4">
                    <Copy size={20} color="#3B82F6" />
                  </View>
                  <Text className="text-white text-base font-medium">Copy Transaction Hash</Text>
                </View>
                <View className="bg-gray-700/50 px-3 py-1 rounded-lg">
                  <Text className="text-gray-300 text-sm font-medium">Copy</Text>
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity 
                className="flex-row items-center justify-between py-4 border-b border-gray-700/50"
                onPress={() => copyToClipboard(tx.address, 'address')}
              >
                <View className="flex-row items-center">
                  <View className="bg-green-500/20 p-2 rounded-lg mr-4">
                    <Copy size={20} color="#10B981" />
                  </View>
                  <Text className="text-white text-base font-medium">Copy Address</Text>
                </View>
                <View className="bg-gray-700/50 px-3 py-1 rounded-lg">
                  <Text className="text-gray-300 text-sm font-medium">Copy</Text>
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity 
                className="flex-row items-center justify-between py-4"
                onPress={() => openExplorer(tx.txHash, tx.network)}
              >
                <View className="flex-row items-center">
                  <View className="bg-purple-500/20 p-2 rounded-lg mr-4">
                    <ExternalLink size={20} color="#8B5CF6" />
                  </View>
                  <Text className="text-white text-base font-medium">View on Explorer</Text>
                </View>
                <View className="bg-gray-700/50 px-3 py-1 rounded-lg">
                  <Text className="text-gray-300 text-sm font-medium">Open</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Spacer for bottom nav */}
          <View className="h-20" />
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
} 
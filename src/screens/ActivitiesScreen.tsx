import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StatusBar, FlatList, TextInput, Image } from 'react-native';
import { ArrowLeft, Search, Filter, Calendar, TrendingUp, TrendingDown, Clock, DollarSign, Gift, Video, Link, FileText, Star, Award } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ActionSheet, { SheetManager } from 'react-native-actions-sheet';

export default function ActivitiesScreen({ navigation }: any) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('7d');

  // Mock activity data
  const activities = [
    {
      id: 1,
      type: 'earning',
      title: 'Video Watch Reward',
      description: 'Watched 5 videos and earned points',
      amount: '+$2.50',
      points: '+125',
      timestamp: '2 hours ago',
      status: 'completed',
      icon: 'video',
      category: 'video'
    },
    {
      id: 2,
      type: 'earning',
      title: 'Survey Completion',
      description: 'Completed "Shopping Habits" survey',
      amount: '+$5.00',
      points: '+250',
      timestamp: '4 hours ago',
      status: 'completed',
      icon: 'survey',
      category: 'survey'
    },
    {
      id: 3,
      type: 'earning',
      title: 'Referral Bonus',
      description: 'Friend joined using your referral code',
      amount: '+$10.00',
      points: '+500',
      timestamp: '1 day ago',
      status: 'completed',
      icon: 'referral',
      category: 'referral'
    },
    {
      id: 4,
      type: 'withdrawal',
      title: 'Withdrawal to Bank',
      description: 'Transferred to ****1234',
      amount: '-$25.00',
      points: '-1250',
      timestamp: '2 days ago',
      status: 'completed',
      icon: 'withdrawal',
      category: 'withdrawal'
    },
    {
      id: 5,
      type: 'earning',
      title: 'Link Visit Reward',
      description: 'Visited sponsored website',
      amount: '+$1.00',
      points: '+50',
      timestamp: '3 days ago',
      status: 'completed',
      icon: 'link',
      category: 'link'
    },
    {
      id: 6,
      type: 'bonus',
      title: 'Daily Login Bonus',
      description: '7-day streak bonus',
      amount: '+$3.00',
      points: '+150',
      timestamp: '4 days ago',
      status: 'completed',
      icon: 'bonus',
      category: 'bonus'
    },
    {
      id: 7,
      type: 'earning',
      title: 'Game Reward',
      description: 'Completed Word Connect puzzle',
      amount: '+$1.50',
      points: '+75',
      timestamp: '5 days ago',
      status: 'completed',
      icon: 'game',
      category: 'game'
    },
    {
      id: 8,
      type: 'penalty',
      title: 'Account Warning',
      description: 'Violation of terms detected',
      amount: '-$5.00',
      points: '-250',
      timestamp: '1 week ago',
      status: 'completed',
      icon: 'warning',
      category: 'penalty'
    }
  ];

  const filters = [
    { id: 'all', label: 'All Activities', icon: 'list' },
    { id: 'earning', label: 'Earnings', icon: 'trending-up' },
    { id: 'withdrawal', label: 'Withdrawals', icon: 'trending-down' },
    { id: 'bonus', label: 'Bonuses', icon: 'gift' },
    { id: 'penalty', label: 'Penalties', icon: 'alert' }
  ];

  const periods = [
    { id: '1d', label: 'Today' },
    { id: '7d', label: '7 Days' },
    { id: '30d', label: '30 Days' },
    { id: '90d', label: '90 Days' },
    { id: 'all', label: 'All Time' }
  ];

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'video':
        return <Video size={20} color="#FFD600" />;
      case 'survey':
        return <FileText size={20} color="#FFD600" />;
      case 'referral':
        return <Star size={20} color="#FFD600" />;
      case 'withdrawal':
        return <TrendingDown size={20} color="#EF4444" />;
      case 'link':
        return <Link size={20} color="#FFD600" />;
      case 'bonus':
        return <Gift size={20} color="#10B981" />;
      case 'game':
        return <Award size={20} color="#FFD600" />;
      case 'warning':
        return <TrendingDown size={20} color="#EF4444" />;
      default:
        return <Clock size={20} color="#6B7280" />;
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

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         activity.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || activity.type === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const getTotalEarnings = () => {
    return activities
      .filter(a => a.type === 'earning' || a.type === 'bonus')
      .reduce((sum, activity) => sum + parseFloat(activity.amount.replace('$', '').replace('+', '')), 0);
  };

  const getTotalWithdrawals = () => {
    return activities
      .filter(a => a.type === 'withdrawal')
      .reduce((sum, activity) => sum + Math.abs(parseFloat(activity.amount.replace('$', '').replace('-', ''))), 0);
  };

  const FilterSheet = () => {
    return (
      <View className="bg-gray-900 rounded-t-2xl p-6">
        <Text className="text-white text-lg font-bold mb-4 text-center">Filter Activities</Text>
        
        <View className="mb-6">
          <Text className="text-gray-400 text-sm mb-3 font-semibold">Activity Type</Text>
          <View className="space-y-2">
            {filters.map((filter) => (
              <TouchableOpacity
                key={filter.id}
                className={`p-4 rounded-xl border-2 ${
                  selectedFilter === filter.id 
                    ? 'border-yellow-400 bg-yellow-400/10' 
                    : 'border-gray-700 bg-gray-800'
                }`}
                onPress={() => {
                  setSelectedFilter(filter.id);
                  SheetManager.hide('filter');
                }}
              >
                <Text className={`font-semibold ${
                  selectedFilter === filter.id ? 'text-yellow-400' : 'text-white'
                }`}>
                  {filter.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View className="mb-6">
          <Text className="text-gray-400 text-sm mb-3 font-semibold">Time Period</Text>
          <View className="flex-row flex-wrap gap-2">
            {periods.map((period) => (
              <TouchableOpacity
                key={period.id}
                className={`px-4 py-2 rounded-xl border-2 ${
                  selectedPeriod === period.id 
                    ? 'border-yellow-400 bg-yellow-400/10' 
                    : 'border-gray-700 bg-gray-800'
                }`}
                onPress={() => {
                  setSelectedPeriod(period.id);
                  SheetManager.hide('filter');
                }}
              >
                <Text className={`font-semibold ${
                  selectedPeriod === period.id ? 'text-yellow-400' : 'text-white'
                }`}>
                  {period.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity 
          className="bg-gray-700 px-8 py-3 rounded-xl"
          onPress={() => SheetManager.hide('filter')}
        >
          <Text className="text-white font-bold text-center">Close</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderActivityItem = ({ item }: { item: any }) => (
    <View className="bg-gray-800 rounded-xl p-4 mb-3">
      <View className="flex-row items-start justify-between">
        <View className="flex-row items-start flex-1">
          <View className="w-10 h-10 bg-gray-700 rounded-full items-center justify-center mr-3">
            {getIconComponent(item.icon)}
          </View>
          <View className="flex-1">
            <Text className="text-white font-semibold text-base mb-1">{item.title}</Text>
            <Text className="text-gray-400 text-sm mb-2">{item.description}</Text>
            <View className="flex-row items-center">
              <Clock size={14} color="#6B7280" className="mr-1" />
              <Text className="text-gray-500 text-xs">{item.timestamp}</Text>
            </View>
          </View>
        </View>
        <View className="items-end">
          <Text className={`font-bold text-lg ${
            item.amount.startsWith('+') ? 'text-green-400' : 'text-red-400'
          }`}>
            {item.amount}
          </Text>
          <Text className={`text-sm ${
            item.points.startsWith('+') ? 'text-green-400' : 'text-red-400'
          }`}>
            {item.points} pts
          </Text>
        </View>
      </View>
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
        <Text className="font-bold text-xl text-yellow-400 flex-1 text-center">Activities</Text>
        <View className="w-8" />
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Summary Cards */}
        <View className="px-4 pt-6 pb-4">
          <View className="flex-row space-x-3 mb-4">
            <View className="flex-1 bg-green-500/10 rounded-xl p-4 border border-green-500/20">
              <View className="flex-row items-center mb-2">
                <TrendingUp size={20} color="#10B981" className="mr-2" />
                <Text className="text-green-400 font-semibold">Total Earnings</Text>
              </View>
              <Text className="text-white font-bold text-lg">${getTotalEarnings().toFixed(2)}</Text>
            </View>
            <View className="flex-1 bg-red-500/10 rounded-xl p-4 border border-red-500/20">
              <View className="flex-row items-center mb-2">
                <TrendingDown size={20} color="#EF4444" className="mr-2" />
                <Text className="text-red-400 font-semibold">Withdrawals</Text>
              </View>
              <Text className="text-white font-bold text-lg">${getTotalWithdrawals().toFixed(2)}</Text>
            </View>
          </View>
        </View>

        {/* Search and Filter */}
        <View className="px-4 mb-4">
          <View className="flex-row space-x-3">
            <View className="flex-1 bg-gray-800 rounded-xl p-3 flex-row items-center">
              <Search size={20} color="#6B7280" className="mr-2" />
              <TextInput
                className="flex-1 text-white text-base"
                placeholder="Search activities..."
                placeholderTextColor="#6B7280"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
            <TouchableOpacity
              className="bg-gray-800 rounded-xl p-3"
              onPress={() => SheetManager.show('filter')}
            >
              <Filter size={20} color="#FFD600" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Active Filters */}
        {(selectedFilter !== 'all' || selectedPeriod !== '7d') && (
          <View className="px-4 mb-4">
            <View className="flex-row flex-wrap gap-2">
              {selectedFilter !== 'all' && (
                <View className="bg-yellow-400/20 rounded-full px-3 py-1 flex-row items-center">
                  <Text className="text-yellow-400 text-sm font-semibold mr-2">
                    {filters.find(f => f.id === selectedFilter)?.label}
                  </Text>
                  <TouchableOpacity onPress={() => setSelectedFilter('all')}>
                    <Text className="text-yellow-400 text-sm">×</Text>
                  </TouchableOpacity>
                </View>
              )}
              {selectedPeriod !== '7d' && (
                <View className="bg-yellow-400/20 rounded-full px-3 py-1 flex-row items-center">
                  <Text className="text-yellow-400 text-sm font-semibold mr-2">
                    {periods.find(p => p.id === selectedPeriod)?.label}
                  </Text>
                  <TouchableOpacity onPress={() => setSelectedPeriod('7d')}>
                    <Text className="text-yellow-400 text-sm">×</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Activities List */}
        <View className="px-4 mb-4">
          {filteredActivities.length > 0 ? (
            <FlatList
              data={filteredActivities}
              renderItem={renderActivityItem}
              keyExtractor={(item) => item.id.toString()}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View className="items-center py-12">
              <View className="w-16 h-16 bg-gray-800 rounded-full items-center justify-center mb-4">
                <Clock size={32} color="#6B7280" />
              </View>
              <Text className="text-white font-semibold text-lg mb-2">No Activities Found</Text>
              <Text className="text-gray-400 text-center">
                {searchQuery ? 'Try adjusting your search terms' : 'No activities match your current filters'}
              </Text>
            </View>
          )}
        </View>

        {/* Quick Actions */}
        <View className="px-4 mb-6">
          <Text className="text-white font-bold text-lg mb-4">Quick Actions</Text>
          <View className="flex-row space-x-3">
            <TouchableOpacity
              className="flex-1 bg-gray-800 rounded-xl p-4 items-center"
              onPress={() => navigation.navigate('History')}
            >
              <DollarSign size={24} color="#FFD600" className="mb-2" />
              <Text className="text-white font-semibold text-sm">Transaction History</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 bg-gray-800 rounded-xl p-4 items-center"
              onPress={() => navigation.navigate('Wallet')}
            >
              <TrendingUp size={24} color="#FFD600" className="mb-2" />
              <Text className="text-white font-semibold text-sm">Wallet</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Help Text */}
        <View className="px-4 mb-6 p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
          <Text className="text-yellow-400 text-xs text-center">
            Activities are updated in real-time. Contact support if you notice any discrepancies.
          </Text>
        </View>

        {/* Spacer for bottom nav */}
        <View className="h-16" />
      </ScrollView>

      {/* ActionSheets */}
      <ActionSheet id="filter">
        <FilterSheet />
      </ActionSheet>
    </SafeAreaView>
  );
} 
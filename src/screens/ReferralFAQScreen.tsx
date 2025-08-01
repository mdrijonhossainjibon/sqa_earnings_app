import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StatusBar, Animated, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Search, HelpCircle, ChevronDown, ChevronUp, TrendingUp, Gift, Shield, Users, DollarSign, Clock, AlertCircle, CheckCircle, Star, MessageCircle, BookOpen, Settings, Globe, UserPlus, Share2, Crown, Trophy, Target, Zap } from 'lucide-react-native';

// Referral FAQ data
const referralFAQData = [
  {
    id: 1,
    category: 'Getting Started',
    question: 'How does the referral program work?',
    answer: 'Our referral program allows you to earn rewards by inviting friends to join our platform. When someone signs up using your referral link, both you and your friend receive bonus points and exclusive rewards. The more friends you refer, the more rewards you can earn!',
    icon: 'users',
    tags: ['referral', 'program', 'friends'],
    difficulty: 'beginner'
  },
  {
    id: 2,
    category: 'Getting Started',
    question: 'How do I get my referral link?',
    answer: 'You can find your unique referral link in your profile dashboard. Simply copy the link and share it with your friends via social media, messaging apps, or any other platform. Each successful referral earns you points and unlocks new rewards.',
    icon: 'share',
    tags: ['link', 'share', 'dashboard'],
    difficulty: 'beginner'
  },
  {
    id: 3,
    category: 'Earnings & Rewards',
    question: 'How many points do I earn per referral?',
    answer: 'You earn 100 points for each successful referral. Additionally, you get 50 points for every task your referred friend completes. There\'s no limit to how many referrals you can make, so the earning potential is unlimited!',
    icon: 'dollar',
    tags: ['points', 'earnings', 'bonus'],
    difficulty: 'intermediate'
  },
  {
    id: 4,
    category: 'Earnings & Rewards',
    question: 'What rewards can I earn from referrals?',
    answer: 'Referral rewards include bonus points, exclusive badges, premium features, and even cash rewards. The more active referrals you have, the higher your reward tier becomes. Top referrers can earn up to $500 in monthly bonuses!',
    icon: 'gift',
    tags: ['rewards', 'bonuses', 'tiers'],
    difficulty: 'beginner'
  },
  {
    id: 5,
    category: 'Earnings & Rewards',
    question: 'Can I withdraw my referral earnings?',
    answer: 'Yes! You can withdraw your referral earnings once you reach the minimum withdrawal threshold. Earnings are automatically converted to your preferred payment method. Withdrawal requests are processed within 24-48 hours.',
    icon: 'dollar',
    tags: ['withdrawal', 'earnings', 'payment'],
    difficulty: 'intermediate'
  },
  {
    id: 6,
    category: 'Referral Tiers',
    question: 'What are the different referral tiers?',
    answer: 'We have 5 referral tiers: Bronze (1-10 referrals), Silver (11-25 referrals), Gold (26-50 referrals), Platinum (51-100 referrals), and Diamond (100+ referrals). Each tier offers increasing rewards and exclusive benefits.',
    icon: 'crown',
    tags: ['tiers', 'levels', 'benefits'],
    difficulty: 'intermediate'
  },
  {
    id: 7,
    category: 'Referral Tiers',
    question: 'How do I reach the top referral tier?',
    answer: 'To reach the top tier, you need to refer at least 50 active users who complete regular tasks. Focus on quality referrals who stay engaged with the platform. Building a strong referral network takes time but offers the highest rewards.',
    icon: 'trophy',
    tags: ['top-tier', 'active-users', 'engagement'],
    difficulty: 'advanced'
  },
  {
    id: 8,
    category: 'Tracking & Analytics',
    question: 'How do I track my referral earnings?',
    answer: 'You can track all your referral earnings in the dashboard. The system shows real-time statistics including total referrals, points earned, rewards unlocked, and your current tier level. Detailed analytics help you optimize your referral strategy.',
    icon: 'trending',
    tags: ['tracking', 'analytics', 'dashboard'],
    difficulty: 'beginner'
  },
  {
    id: 9,
    category: 'Sharing & Promotion',
    question: 'How do I share my referral link effectively?',
    answer: 'Share your referral link on social media platforms, messaging apps, and forums where your target audience is active. Create engaging content explaining the benefits of joining. Personal recommendations work best for higher conversion rates.',
    icon: 'share',
    tags: ['sharing', 'social-media', 'promotion'],
    difficulty: 'advanced'
  },
  {
    id: 10,
    category: 'Rules & Restrictions',
    question: 'Are there any restrictions on referrals?',
    answer: 'Referrals must be real users with valid email addresses. You cannot refer yourself or create fake accounts. Each person can only be referred once. We monitor for fraudulent activity to ensure fair play for all users.',
    icon: 'shield',
    tags: ['rules', 'restrictions', 'fraud'],
    difficulty: 'intermediate'
  },
  {
    id: 11,
    category: 'Account Management',
    question: 'What happens if my referral stops using the app?',
    answer: 'You keep all the points you earned from their initial signup and any tasks they completed. However, you won\'t earn ongoing rewards from inactive users. Focus on referring people who will stay engaged with the platform.',
    icon: 'users',
    tags: ['inactive', 'earnings', 'engagement'],
    difficulty: 'intermediate'
  },
  {
    id: 12,
    category: 'Account Management',
    question: 'What happens if my referral doesn\'t complete tasks?',
    answer: 'You still earn the initial 100 points for the referral signup. However, to maximize your earnings, encourage your referrals to complete tasks regularly. Active referrals earn you ongoing rewards and help you climb the leaderboard.',
    icon: 'target',
    tags: ['tasks', 'completion', 'bonus'],
    difficulty: 'intermediate'
  },
  {
    id: 13,
    category: 'Technical Support',
    question: 'My referral link is not working',
    answer: 'Try refreshing the app or logging out and back in. If the issue persists, contact support with your referral code. Make sure you\'re using the latest version of the app and have a stable internet connection.',
    icon: 'alert',
    tags: ['technical', 'link', 'support'],
    difficulty: 'beginner'
  },
  {
    id: 14,
    category: 'Technical Support',
    question: 'I\'m not receiving referral bonuses',
    answer: 'Referral bonuses are typically credited immediately after your friend completes their first task. If you haven\'t received your bonus, check that your friend used the correct referral code and completed a task. Contact support if issues persist.',
    icon: 'alert',
    tags: ['bonus', 'crediting', 'support'],
    difficulty: 'intermediate'
  },
  {
    id: 15,
    category: 'Best Practices',
    question: 'What are the best practices for successful referrals?',
    answer: 'Focus on quality over quantity. Explain the benefits clearly to potential referrals, follow up with them to ensure they stay active, and share your link on multiple platforms. Join our referral community for tips and strategies.',
    icon: 'star',
    tags: ['best-practices', 'quality', 'engagement'],
    difficulty: 'advanced'
  }
];

const referralCategories = [
  {
    id: 'all',
    title: 'All Questions',
    count: referralFAQData.length,
    icon: <HelpCircle size={24} color="#FFD600" />
  },
  {
    id: 'getting-started',
    title: 'Getting Started',
    count: referralFAQData.filter(faq => faq.category === 'Getting Started').length,
    icon: <UserPlus size={24} color="#FFD600" />
  },
  {
    id: 'earnings-rewards',
    title: 'Earnings & Rewards',
    count: referralFAQData.filter(faq => faq.category === 'Earnings & Rewards').length,
    icon: <DollarSign size={24} color="#FFD600" />
  },
  {
    id: 'referral-tiers',
    title: 'Referral Tiers',
    count: referralFAQData.filter(faq => faq.category === 'Referral Tiers').length,
    icon: <Crown size={24} color="#FFD600" />
  },
  {
    id: 'tracking-analytics',
    title: 'Tracking & Analytics',
    count: referralFAQData.filter(faq => faq.category === 'Tracking & Analytics').length,
    icon: <TrendingUp size={24} color="#FFD600" />
  },
  {
    id: 'sharing-promotion',
    title: 'Sharing & Promotion',
    count: referralFAQData.filter(faq => faq.category === 'Sharing & Promotion').length,
    icon: <Share2 size={24} color="#FFD600" />
  },
  {
    id: 'rules-restrictions',
    title: 'Rules & Restrictions',
    count: referralFAQData.filter(faq => faq.category === 'Rules & Restrictions').length,
    icon: <Shield size={24} color="#FFD600" />
  },
  {
    id: 'account-management',
    title: 'Account Management',
    count: referralFAQData.filter(faq => faq.category === 'Account Management').length,
    icon: <Users size={24} color="#FFD600" />
  },
  {
    id: 'technical-support',
    title: 'Technical Support',
    count: referralFAQData.filter(faq => faq.category === 'Technical Support').length,
    icon: <AlertCircle size={24} color="#FFD600" />
  },
  {
    id: 'best-practices',
    title: 'Best Practices',
    count: referralFAQData.filter(faq => faq.category === 'Best Practices').length,
    icon: <Star size={24} color="#FFD600" />
  }
];

const getCategoryIcon = (icon: string) => {
  switch (icon) {
    case 'users':
      return <Users size={20} color="#FFD600" />;
    case 'share':
      return <Share2 size={20} color="#FFD600" />;
    case 'dollar':
      return <DollarSign size={20} color="#FFD600" />;
    case 'gift':
      return <Gift size={20} color="#FFD600" />;
    case 'crown':
      return <Crown size={20} color="#FFD600" />;
    case 'trophy':
      return <Trophy size={20} color="#FFD600" />;
    case 'trending':
      return <TrendingUp size={20} color="#FFD600" />;
    case 'shield':
      return <Shield size={20} color="#FFD600" />;
    case 'target':
      return <Target size={20} color="#FFD600" />;
    case 'alert':
      return <AlertCircle size={20} color="#FFD600" />;
    case 'star':
      return <Star size={20} color="#FFD600" />;
    default:
      return <HelpCircle size={20} color="#FFD600" />;
  }
};

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'beginner':
      return '#10B981';
    case 'intermediate':
      return '#F59E0B';
    case 'advanced':
      return '#EF4444';
    default:
      return '#6B7280';
  }
};

export default function ReferralFAQScreen({ navigation }: any) {
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const filteredFAQ = referralFAQData.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || 
      faq.category.toLowerCase().replace(/\s+/g, '-') === selectedCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const toggleFAQ = (id: number) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  const handleCategoryPress = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setExpandedFAQ(null);
  };

  return (
    <View className="flex-1 bg-gray-900">
      <StatusBar barStyle="light-content" backgroundColor="#111827" translucent={false} />
      <SafeAreaView edges={['top']} className="bg-gray-900">
        <View className="flex-row items-center justify-between px-4 pt-2 pb-2 bg-gray-900">
          <TouchableOpacity 
            activeOpacity={0.7} 
            onPress={() => navigation.goBack()}
            className="flex-row items-center"
          >
            <ArrowLeft size={24} color="#fff" />
            <Text className="text-white ml-2 font-semibold">Back</Text>
          </TouchableOpacity>
          <Text className="text-xl font-bold text-white">Referral FAQ</Text>
          <TouchableOpacity 
            activeOpacity={0.7}
            onPress={() => navigation.navigate('Support')}
          >
            <MessageCircle size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <Animated.View style={{ opacity: fadeAnim }}>
          {/* Header */}
          <View className="bg-gray-800 mx-4 mt-4 rounded-xl p-4">
            <View className="flex-row items-center mb-3">
              <Users size={28} color="#FFD600" />
              <Text className="text-xl font-bold text-white ml-3">Referral Program FAQ</Text>
            </View>
            <Text className="text-gray-400 text-sm">
              Everything you need to know about earning rewards through referrals
            </Text>
          </View>

          {/* Quick Stats */}
          <View className="mx-4 mt-4">
            <View className="bg-gray-800 rounded-xl p-4">
              <Text className="text-white font-bold text-lg mb-3">Your Referral Stats</Text>
              <View className="flex-row justify-between">
                <View className="items-center">
                  <Text className="text-yellow-400 font-bold text-xl">15</Text>
                  <Text className="text-gray-400 text-xs">Total Referrals</Text>
                </View>
                <View className="items-center">
                  <Text className="text-green-400 font-bold text-xl">1,500</Text>
                  <Text className="text-gray-400 text-xs">Points Earned</Text>
                </View>
                <View className="items-center">
                  <Text className="text-blue-400 font-bold text-xl">Gold</Text>
                  <Text className="text-gray-400 text-xs">Current Tier</Text>
                </View>
                <View className="items-center">
                  <Text className="text-purple-400 font-bold text-xl">$25</Text>
                  <Text className="text-gray-400 text-xs">Monthly Bonus</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Search Bar */}
          <View className="mx-4 mt-4">
            <View className="relative">
              <Search size={20} color="#9CA3AF" className="absolute left-3 top-3 z-10" />
              <TextInput
                className="bg-gray-800 rounded-xl pl-10 pr-4 py-3 text-white"
                placeholder="Search referral questions..."
                placeholderTextColor="#9CA3AF"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
          </View>

          {/* Categories */}
          <View className="mx-4 mt-6">
            <Text className="text-lg font-bold text-white mb-4">Categories</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
              {referralCategories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  className={`px-4 py-3 rounded-xl mr-3 min-w-[120px] ${
                    selectedCategory === category.id ? 'bg-yellow-500' : 'bg-gray-800'
                  }`}
                  onPress={() => handleCategoryPress(category.id)}
                >
                  <View className="items-center">
                    {category.icon}
                    <Text
                      className={`font-semibold text-sm mt-1 text-center ${
                        selectedCategory === category.id ? 'text-black' : 'text-white'
                      }`}
                    >
                      {category.title}
                    </Text>
                    <Text
                      className={`text-xs mt-1 ${
                        selectedCategory === category.id ? 'text-black' : 'text-gray-400'
                      }`}
                    >
                      {category.count} questions
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* FAQ List */}
          <View className="mx-4 mb-6">
            <Text className="text-lg font-bold text-white mb-4">
              {selectedCategory === 'all' ? 'All Referral Questions' : referralCategories.find(c => c.id === selectedCategory)?.title}
            </Text>
            
            {filteredFAQ.length === 0 ? (
              <View className="bg-gray-800 rounded-xl p-8 items-center">
                <HelpCircle size={48} color="#6B7280" />
                <Text className="text-gray-400 text-lg font-semibold mt-4">No questions found</Text>
                <Text className="text-gray-500 text-sm text-center mt-2">
                  {searchQuery ? 'Try adjusting your search terms' : 'Try selecting a different category'}
                </Text>
              </View>
            ) : (
              <View className="bg-gray-800 rounded-xl overflow-hidden">
                {filteredFAQ.map((faq, index) => (
                  <View key={faq.id} className="border-b border-gray-700 last:border-b-0">
                    <TouchableOpacity
                      className="p-4"
                      onPress={() => toggleFAQ(faq.id)}
                      activeOpacity={0.8}
                    >
                      <View className="flex-row items-start justify-between">
                        <View className="flex-row items-start flex-1">
                          <View className="mr-3 mt-1">
                            {getCategoryIcon(faq.icon)}
                          </View>
                          <View className="flex-1">
                            <Text className="text-white font-semibold leading-5">
                              {faq.question}
                            </Text>
                            <View className="flex-row flex-wrap mt-2">
                              {faq.tags.slice(0, 2).map((tag, tagIndex) => (
                                <View key={tagIndex} className="bg-gray-700 px-2 py-1 rounded-full mr-2 mb-1">
                                  <Text className="text-gray-300 text-xs">{tag}</Text>
                                </View>
                              ))}
                              <View className="bg-gray-700 px-2 py-1 rounded-full mr-2 mb-1">
                                <Text className="text-xs" style={{ color: getDifficultyColor(faq.difficulty) }}>
                                  {faq.difficulty}
                                </Text>
                              </View>
                            </View>
                          </View>
                        </View>
                        {expandedFAQ === faq.id ? (
                          <ChevronUp size={20} color="#9CA3AF" />
                        ) : (
                          <ChevronDown size={20} color="#9CA3AF" />
                        )}
                      </View>
                    </TouchableOpacity>
                    
                    {expandedFAQ === faq.id && (
                      <View className="px-4 pb-4">
                        <Text className="text-gray-400 text-sm leading-6">
                          {faq.answer}
                        </Text>
                      </View>
                    )}
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Quick Tips */}
          <View className="mx-4 mb-6">
            <View className="bg-gray-800 rounded-xl p-4">
              <View className="flex-row items-center mb-3">
                <Zap size={24} color="#FFD600" />
                <Text className="text-white font-bold text-lg ml-3">Quick Tips for Success</Text>
              </View>
              <View className="space-y-2">
                <View className="flex-row items-center">
                  <CheckCircle size={16} color="#10B981" />
                  <Text className="text-gray-300 text-sm ml-2">Share your referral link on multiple platforms</Text>
                </View>
                <View className="flex-row items-center">
                  <CheckCircle size={16} color="#10B981" />
                  <Text className="text-gray-300 text-sm ml-2">Explain the benefits clearly to potential referrals</Text>
                </View>
                <View className="flex-row items-center">
                  <CheckCircle size={16} color="#10B981" />
                  <Text className="text-gray-300 text-sm ml-2">Follow up with your referrals to ensure they stay active</Text>
                </View>
                <View className="flex-row items-center">
                  <CheckCircle size={16} color="#10B981" />
                  <Text className="text-gray-300 text-sm ml-2">Focus on quality over quantity for better long-term earnings</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Contact Support */}
          <View className="mx-4 mb-6">
            <View className="bg-gray-800 rounded-xl p-4">
              <View className="flex-row items-center mb-3">
                <MessageCircle size={24} color="#FFD600" />
                <Text className="text-white font-bold text-lg ml-3">Still Need Help?</Text>
              </View>
              <Text className="text-gray-400 text-sm mb-4">
                Can't find the answer you're looking for? Our support team is here to help you 24/7.
              </Text>
              <TouchableOpacity
                className="bg-yellow-500 rounded-lg p-3 items-center"
                onPress={() => navigation.navigate('Support')}
                activeOpacity={0.8}
              >
                <Text className="text-black font-bold">Contact Support</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Back to Referral */}
          <View className="mx-4 mb-6">
            <TouchableOpacity
              className="bg-gray-800 rounded-xl p-4 items-center"
              onPress={() => navigation.goBack()}
              activeOpacity={0.8}
            >
              <Text className="text-yellow-400 font-semibold">← Back to Referral Program</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}
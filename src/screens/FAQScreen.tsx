import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StatusBar, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Search, HelpCircle, ChevronDown, ChevronUp, TrendingUp, Gift, Shield, Users, DollarSign, Clock, AlertCircle, CheckCircle, Star, MessageCircle, BookOpen, Settings, Globe } from 'lucide-react-native';

// Mock FAQ data
const mockFAQ = [
  {
    id: 1,
    category: 'Getting Started',
    question: 'How do I start earning points?',
    answer: 'To start earning points, simply complete daily tasks like watching videos, reading articles, taking surveys, and inviting friends. Each activity rewards you with points that can be converted to cash. You can find all earning methods in the "Earn" section of the app.',
    icon: 'trending',
    tags: ['points', 'earning', 'tasks']
  },
  {
    id: 2,
    category: 'Getting Started',
    question: 'How do I create an account?',
    answer: 'Creating an account is easy! Download the app, tap "Sign Up", and enter your email address and create a password. You\'ll receive a verification email to activate your account. Once verified, you can start earning immediately.',
    icon: 'trending',
    tags: ['account', 'signup', 'registration']
  },
  {
    id: 3,
    category: 'Getting Started',
    question: 'What is the minimum withdrawal amount?',
    answer: 'The minimum withdrawal amount is $5.00 (500 points). You can withdraw your earnings once you reach this threshold. Withdrawals are processed within 24-48 hours depending on your chosen payment method.',
    icon: 'dollar',
    tags: ['withdrawal', 'minimum', 'payment']
  },
  {
    id: 4,
    category: 'Earning & Points',
    question: 'How do I withdraw my earnings?',
    answer: 'To withdraw your earnings, go to the Wallet section, select your preferred payment method (PayPal, bank transfer, or gift cards), enter the amount you want to withdraw, and confirm. Your payment will be processed within 24-48 hours.',
    icon: 'dollar',
    tags: ['withdrawal', 'wallet', 'payment']
  },
  {
    id: 5,
    category: 'Earning & Points',
    question: 'Do points expire?',
    answer: 'No, points do not expire as long as your account remains active. However, we recommend using them regularly to maximize your earnings. Points are automatically converted to cash when you reach the minimum withdrawal amount.',
    icon: 'gift',
    tags: ['points', 'expiration', 'conversion']
  },
  {
    id: 6,
    category: 'Earning & Points',
    question: 'How much can I earn per day?',
    answer: 'Daily earnings vary based on the tasks you complete. On average, users can earn between $1-10 per day by completing all available tasks. Earnings increase with referrals and consistent daily activity.',
    icon: 'trending',
    tags: ['earnings', 'daily', 'tasks']
  },
  {
    id: 7,
    category: 'Account & Security',
    question: 'How do I reset my password?',
    answer: 'To reset your password, go to the login screen and tap "Forgot Password". Enter your email address and follow the instructions sent to your email. You\'ll receive a secure link to create a new password.',
    icon: 'shield',
    tags: ['password', 'reset', 'security']
  },
  {
    id: 8,
    category: 'Account & Security',
    question: 'Is my personal information safe?',
    answer: 'Yes, we take your privacy and security seriously. All personal information is encrypted and stored securely. We never share your data with third parties without your explicit consent. You can review our privacy policy for more details.',
    icon: 'shield',
    tags: ['privacy', 'security', 'data']
  },
  {
    id: 9,
    category: 'Account & Security',
    question: 'Can I have multiple accounts?',
    answer: 'No, we only allow one account per person. Having multiple accounts violates our terms of service and may result in account suspension. Each account must be associated with a unique email address and phone number.',
    icon: 'users',
    tags: ['accounts', 'multiple', 'policy']
  },
  {
    id: 10,
    category: 'Referrals & Rewards',
    question: 'How does the referral program work?',
    answer: 'Invite friends using your unique referral code. When they sign up and complete their first task, both you and your friend receive bonus points. You can earn up to $50 in referral bonuses per month.',
    icon: 'users',
    tags: ['referral', 'bonus', 'friends']
  },
  {
    id: 11,
    category: 'Referrals & Rewards',
    question: 'How do I claim rewards?',
    answer: 'Navigate to the Rewards section and browse available rewards. Tap on any reward to view details and claim it using your earned points. Rewards are typically delivered instantly or within 24 hours.',
    icon: 'gift',
    tags: ['rewards', 'claim', 'points']
  },
  {
    id: 12,
    category: 'Technical Issues',
    question: 'The app is not loading properly',
    answer: 'Try closing and reopening the app, or restart your device. If the problem persists, check your internet connection, clear the app cache, or reinstall the app. Contact support if issues continue.',
    icon: 'alert',
    tags: ['loading', 'technical', 'support']
  },
  {
    id: 13,
    category: 'Technical Issues',
    question: 'I\'m not receiving notifications',
    answer: 'Go to Account Settings > Notifications and ensure push notifications are enabled. Also check your device settings to make sure notifications are allowed for the app. You may need to restart the app after changing settings.',
    icon: 'alert',
    tags: ['notifications', 'settings', 'push']
  },
  {
    id: 14,
    category: 'Technical Issues',
    question: 'My points are not updating',
    answer: 'Points typically update immediately after completing tasks. If you don\'t see your points update, try refreshing the app or logging out and back in. If the issue persists, contact support with details of the completed task.',
    icon: 'alert',
    tags: ['points', 'update', 'sync']
  },
  {
    id: 15,
    category: 'Payment & Withdrawals',
    question: 'How long do withdrawals take?',
    answer: 'Withdrawal processing times vary by payment method: PayPal (24-48 hours), bank transfers (3-5 business days), and gift cards (instant to 24 hours). You\'ll receive an email confirmation when your withdrawal is processed.',
    icon: 'clock',
    tags: ['withdrawal', 'time', 'payment']
  },
  {
    id: 16,
    category: 'Payment & Withdrawals',
    question: 'What payment methods are available?',
    answer: 'We support PayPal, bank transfers, and various gift cards (Amazon, Walmart, Target, etc.). Payment method availability may vary by country. You can add or change payment methods in the Wallet section.',
    icon: 'dollar',
    tags: ['payment', 'methods', 'wallet']
  }
];

const faqCategories = [
  {
    id: 'all',
    title: 'All Questions',
    count: mockFAQ.length,
    icon: <HelpCircle size={24} color="#FFD600" />
  },
  {
    id: 'getting-started',
    title: 'Getting Started',
    count: mockFAQ.filter(faq => faq.category === 'Getting Started').length,
    icon: <TrendingUp size={24} color="#FFD600" />
  },
  {
    id: 'earning-points',
    title: 'Earning & Points',
    count: mockFAQ.filter(faq => faq.category === 'Earning & Points').length,
    icon: <Gift size={24} color="#FFD600" />
  },
  {
    id: 'account-security',
    title: 'Account & Security',
    count: mockFAQ.filter(faq => faq.category === 'Account & Security').length,
    icon: <Shield size={24} color="#FFD600" />
  },
  {
    id: 'referrals-rewards',
    title: 'Referrals & Rewards',
    count: mockFAQ.filter(faq => faq.category === 'Referrals & Rewards').length,
    icon: <Users size={24} color="#FFD600" />
  },
  {
    id: 'technical-issues',
    title: 'Technical Issues',
    count: mockFAQ.filter(faq => faq.category === 'Technical Issues').length,
    icon: <AlertCircle size={24} color="#FFD600" />
  },
  {
    id: 'payment-withdrawals',
    title: 'Payment & Withdrawals',
    count: mockFAQ.filter(faq => faq.category === 'Payment & Withdrawals').length,
    icon: <DollarSign size={24} color="#FFD600" />
  }
];

const getCategoryIcon = (icon: string) => {
  switch (icon) {
    case 'trending':
      return <TrendingUp size={20} color="#FFD600" />;
    case 'dollar':
      return <DollarSign size={20} color="#FFD600" />;
    case 'gift':
      return <Gift size={20} color="#FFD600" />;
    case 'shield':
      return <Shield size={20} color="#FFD600" />;
    case 'users':
      return <Users size={20} color="#FFD600" />;
    case 'alert':
      return <AlertCircle size={20} color="#FFD600" />;
    case 'clock':
      return <Clock size={20} color="#FFD600" />;
    default:
      return <HelpCircle size={20} color="#FFD600" />;
  }
};

export default function FAQScreen({ navigation }: any) {
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

  const filteredFAQ = mockFAQ.filter(faq => {
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
    setExpandedFAQ(null); // Close any expanded FAQ when changing category
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
          <Text className="text-xl font-bold text-white">FAQ</Text>
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
              <HelpCircle size={28} color="#FFD600" />
              <Text className="text-xl font-bold text-white ml-3">Frequently Asked Questions</Text>
            </View>
            <Text className="text-gray-400 text-sm">
              Find answers to common questions about using SQA Earning
            </Text>
          </View>

          {/* Search Bar */}
          <View className="mx-4 mt-4">
            <View className="relative">
              <Search size={20} color="#9CA3AF" className="absolute left-3 top-3 z-10" />
              <TextInput
                className="bg-gray-800 rounded-xl pl-10 pr-4 py-3 text-white"
                placeholder="Search questions..."
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
              {faqCategories.map((category) => (
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
              {selectedCategory === 'all' ? 'All Questions' : faqCategories.find(c => c.id === selectedCategory)?.title}
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
                              {faq.tags.slice(0, 3).map((tag, tagIndex) => (
                                <View key={tagIndex} className="bg-gray-700 px-2 py-1 rounded-full mr-2 mb-1">
                                  <Text className="text-gray-300 text-xs">{tag}</Text>
                                </View>
                              ))}
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
        </Animated.View>
      </ScrollView>
    </View>
  );
} 
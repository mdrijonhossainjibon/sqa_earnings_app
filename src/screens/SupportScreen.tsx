import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StatusBar, Animated, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, MessageCircle, Phone, Mail, HelpCircle, FileText, Send, ChevronDown, ChevronUp, Star, Clock, User, Search, BookOpen, Shield, DollarSign, Gift, TrendingUp } from 'lucide-react-native';

// Mock FAQ data
const mockFAQ = [
  {
    id: 1,
    category: 'Getting Started',
    question: 'How do I start earning points?',
    answer: 'To start earning points, complete daily tasks like watching videos, reading articles, taking surveys, and inviting friends. Each activity rewards you with points that can be converted to cash.',
    icon: 'trending'
  },
  {
    id: 2,
    category: 'Getting Started',
    question: 'How do I withdraw my earnings?',
    answer: 'You can withdraw your earnings once you reach the minimum withdrawal amount. Go to the Wallet section, select your preferred payment method, and follow the withdrawal process.',
    icon: 'dollar'
  },
  {
    id: 3,
    category: 'Account & Security',
    question: 'How do I reset my password?',
    answer: 'Go to the login screen and tap "Forgot Password". Enter your email address and follow the instructions sent to your email to reset your password.',
    icon: 'shield'
  },
  {
    id: 4,
    category: 'Account & Security',
    question: 'Is my personal information safe?',
    answer: 'Yes, we take your privacy seriously. All personal information is encrypted and stored securely. We never share your data with third parties without your consent.',
    icon: 'shield'
  },
  {
    id: 5,
    category: 'Rewards & Points',
    question: 'How do I claim rewards?',
    answer: 'Navigate to the Rewards section and browse available rewards. Tap on any reward to view details and claim it using your earned points.',
    icon: 'gift'
  },
  {
    id: 6,
    category: 'Rewards & Points',
    question: 'Do points expire?',
    answer: 'Points do not expire as long as your account remains active. However, we recommend using them regularly to maximize your earnings.',
    icon: 'gift'
  },
  {
    id: 7,
    category: 'Technical Issues',
    question: 'The app is not loading properly',
    answer: 'Try closing and reopening the app, or restart your device. If the problem persists, check your internet connection or contact our support team.',
    icon: 'help'
  },
  {
    id: 8,
    category: 'Technical Issues',
    question: 'I\'m not receiving notifications',
    answer: 'Go to Account Settings > Notifications and ensure push notifications are enabled. Also check your device settings to make sure notifications are allowed for the app.',
    icon: 'help'
  }
];

const supportCategories = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    description: 'Learn how to use the app',
    icon: <TrendingUp size={24} color="#FFD600" />,
    color: '#10B981'
  },
  {
    id: 'account-security',
    title: 'Account & Security',
    description: 'Account management and security',
    icon: <Shield size={24} color="#FFD600" />,
    color: '#3B82F6'
  },
  {
    id: 'rewards-points',
    title: 'Rewards & Points',
    description: 'Earning and redeeming points',
    icon: <Gift size={24} color="#FFD600" />,
    color: '#F59E0B'
  },
  {
    id: 'technical',
    title: 'Technical Issues',
    description: 'App problems and solutions',
    icon: <HelpCircle size={24} color="#FFD600" />,
    color: '#EF4444'
  }
];

const contactMethods = [
  {
    id: 'live-chat',
    title: 'Live Chat',
    description: 'Chat with our support team',
    icon: <MessageCircle size={24} color="#FFD600" />,
    responseTime: 'Usually responds in 5 minutes',
    available: true
  },
  {
    id: 'email',
    title: 'Email Support',
    description: 'Send us an email',
    icon: <Mail size={24} color="#FFD600" />,
    responseTime: 'Usually responds in 24 hours',
    available: true
  },
  {
    id: 'phone',
    title: 'Phone Support',
    description: 'Call our support line',
    icon: <Phone size={24} color="#FFD600" />,
    responseTime: 'Available 24/7',
    available: false
  }
];

export default function SupportScreen({ navigation }: any) {
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [message, setMessage] = useState('');
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const filteredFAQ = mockFAQ.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFAQ = (id: number) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  const handleContactMethod = (method: any) => {
    switch (method.id) {
      case 'live-chat':
        Alert.alert('Live Chat', 'Opening live chat...');
        break;
      case 'email':
        Alert.alert('Email Support', 'Opening email client...');
        break;
      case 'phone':
        Alert.alert('Phone Support', 'Calling support line...');
        break;
    }
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      Alert.alert('Message Sent', 'Your message has been sent to our support team. We\'ll get back to you soon!');
      setMessage('');
    }
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
          <Text className="text-xl font-bold text-white">Support</Text>
          <View className="w-10" />
        </View>
      </SafeAreaView>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <Animated.View style={{ opacity: fadeAnim }}>
          {/* Header */}
          <View className="bg-gray-800 mx-4 mt-4 rounded-xl p-4">
            <View className="flex-row items-center mb-3">
              <HelpCircle size={28} color="#FFD600" />
              <Text className="text-xl font-bold text-white ml-3">How can we help you?</Text>
            </View>
            <Text className="text-gray-400 text-sm">
              Find answers to common questions or get in touch with our support team
            </Text>
          </View>

          {/* Search Bar */}
          <View className="mx-4 mt-4">
            <View className="relative">
              <Search size={20} color="#9CA3AF" className="absolute left-3 top-3 z-10" />
              <TextInput
                className="bg-gray-800 rounded-xl pl-10 pr-4 py-3 text-white"
                placeholder="Search for help..."
                placeholderTextColor="#9CA3AF"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
          </View>

          {/* Quick Contact */}
          <View className="mx-4 mt-6">
            <Text className="text-lg font-bold text-white mb-4">Quick Contact</Text>
            <View className="bg-gray-800 rounded-xl p-4">
              {contactMethods.map((method) => (
                <TouchableOpacity
                  key={method.id}
                  className={`flex-row items-center justify-between p-3 rounded-lg mb-3 ${
                    method.available ? 'bg-gray-700' : 'bg-gray-600 opacity-50'
                  }`}
                  onPress={() => method.available && handleContactMethod(method)}
                  disabled={!method.available}
                >
                  <View className="flex-row items-center">
                    {method.icon}
                    <View className="ml-3">
                      <Text className="text-white font-semibold">{method.title}</Text>
                      <Text className="text-gray-400 text-sm">{method.description}</Text>
                      <Text className="text-gray-500 text-xs">{method.responseTime}</Text>
                    </View>
                  </View>
                  {!method.available && (
                    <Text className="text-gray-400 text-xs">Coming Soon</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Help Categories */}
          <View className="mx-4 mt-6">
            <Text className="text-lg font-bold text-white mb-4">Help Categories</Text>
            <View className="flex-row flex-wrap justify-between">
              {supportCategories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  className={`w-[48%] bg-gray-800 rounded-xl p-4 mb-3 ${
                    selectedCategory === category.id ? 'border-2 border-yellow-500' : ''
                  }`}
                  onPress={() => setSelectedCategory(selectedCategory === category.id ? 'all' : category.id)}
                >
                  <View className="items-center">
                    {category.icon}
                    <Text className="text-white font-semibold text-center mt-2">{category.title}</Text>
                    <Text className="text-gray-400 text-xs text-center mt-1">{category.description}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* FAQ Section */}
          <View className="mx-4 mt-6">
            <Text className="text-lg font-bold text-white mb-4">Frequently Asked Questions</Text>
            <View className="bg-gray-800 rounded-xl overflow-hidden">
              {filteredFAQ.length === 0 ? (
                <View className="p-6 items-center">
                  <HelpCircle size={48} color="#6B7280" />
                  <Text className="text-gray-400 text-lg font-semibold mt-4">No questions found</Text>
                  <Text className="text-gray-500 text-sm text-center mt-2">
                    Try adjusting your search or category filter
                  </Text>
                </View>
              ) : (
                filteredFAQ.map((faq) => (
                  <View key={faq.id} className="border-b border-gray-700 last:border-b-0">
                    <TouchableOpacity
                      className="p-4"
                      onPress={() => toggleFAQ(faq.id)}
                      activeOpacity={0.8}
                    >
                      <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center flex-1">
                          <HelpCircle size={20} color="#FFD600" />
                          <Text className="text-white font-semibold ml-3 flex-1">
                            {faq.question}
                          </Text>
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
                        <Text className="text-gray-400 text-sm leading-5">
                          {faq.answer}
                        </Text>
                      </View>
                    )}
                  </View>
                ))
              )}
            </View>
          </View>

          {/* Contact Form */}
          <View className="mx-4 mt-6 mb-6">
            <Text className="text-lg font-bold text-white mb-4">Send us a Message</Text>
            <View className="bg-gray-800 rounded-xl p-4">
              <TextInput
                className="bg-gray-700 rounded-lg p-3 text-white mb-4 min-h-[100]"
                placeholder="Describe your issue or question..."
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                value={message}
                onChangeText={setMessage}
              />
              
              <TouchableOpacity
                className="bg-yellow-500 rounded-lg p-3 items-center flex-row justify-center"
                onPress={handleSendMessage}
                activeOpacity={0.8}
              >
                <Send size={20} color="#000" />
                <Text className="text-black font-bold ml-2">Send Message</Text>
              </TouchableOpacity>
              
              <Text className="text-gray-400 text-xs text-center mt-3">
                We typically respond within 24 hours
              </Text>
            </View>
          </View>

          {/* Additional Resources */}
          <View className="mx-4 mb-6">
            <Text className="text-lg font-bold text-white mb-4">Additional Resources</Text>
            <View className="bg-gray-800 rounded-xl p-4">
              <TouchableOpacity className="flex-row items-center p-3 bg-gray-700 rounded-lg mb-3">
                <BookOpen size={20} color="#FFD600" />
                <View className="ml-3 flex-1">
                  <Text className="text-white font-semibold">User Guide</Text>
                  <Text className="text-gray-400 text-sm">Complete guide to using the app</Text>
                </View>
                <ChevronDown size={20} color="#9CA3AF" />
              </TouchableOpacity>
              
              <TouchableOpacity className="flex-row items-center p-3 bg-gray-700 rounded-lg mb-3">
                <FileText size={20} color="#FFD600" />
                <View className="ml-3 flex-1">
                  <Text className="text-white font-semibold">Terms of Service</Text>
                  <Text className="text-gray-400 text-sm">Read our terms and conditions</Text>
                </View>
                <ChevronDown size={20} color="#9CA3AF" />
              </TouchableOpacity>
              
              <TouchableOpacity className="flex-row items-center p-3 bg-gray-700 rounded-lg">
                <Shield size={20} color="#FFD600" />
                <View className="ml-3 flex-1">
                  <Text className="text-white font-semibold">Privacy Policy</Text>
                  <Text className="text-gray-400 text-sm">Learn about data protection</Text>
                </View>
                <ChevronDown size={20} color="#9CA3AF" />
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
} 
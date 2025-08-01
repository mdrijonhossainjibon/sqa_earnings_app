import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StatusBar, Animated, Linking, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Info, Star, Users, Heart, Globe, Mail, MessageCircle, Share2, Download, Award, TrendingUp, Gift, Shield, ChevronRight, ExternalLink, Phone, MapPin, Clock } from 'lucide-react-native';

// Mock app data
const appInfo = {
  name: 'SQA Earning',
  version: '1.0.0',
  buildNumber: '2024.1.0',
  description: 'Earn money by completing simple tasks, watching videos, and inviting friends. Join millions of users worldwide!',
  features: [
    {
      id: 1,
      title: 'Multiple Earning Methods',
      description: 'Watch videos, read articles, take surveys, and more',
      icon: <TrendingUp size={20} color="#FFD600" />
    },
    {
      id: 2,
      title: 'Instant Rewards',
      description: 'Get points immediately for completed tasks',
      icon: <Gift size={20} color="#FFD600" />
    },
    {
      id: 3,
      title: 'Secure Payments',
      description: 'Safe and reliable withdrawal methods',
      icon: <Shield size={20} color="#FFD600" />
    },
    {
      id: 4,
      title: 'Referral Program',
      description: 'Earn bonus rewards for inviting friends',
      icon: <Users size={20} color="#FFD600" />
    }
  ],
  stats: {
    users: '2.5M+',
    countries: '150+',
    totalPaid: '$50M+',
    rating: '4.8'
  }
};

const teamMembers = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'CEO & Founder',
    avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
    bio: 'Passionate about creating opportunities for people to earn online.'
  },
  {
    id: 2,
    name: 'Mike Chen',
    role: 'CTO',
    avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
    bio: 'Leading technology development and platform innovation.'
  },
  {
    id: 3,
    name: 'Emma Davis',
    role: 'Head of Operations',
    avatar: 'https://randomuser.me/api/portraits/women/3.jpg',
    bio: 'Ensuring smooth operations and user satisfaction.'
  }
];

const socialLinks = [
  {
    id: 'website',
    title: 'Website',
    url: 'https://sqa-earning.com',
    icon: <Globe size={20} color="#FFD600" />
  },
  {
    id: 'email',
    title: 'Email',
    url: 'mailto:support@sqa-earning.com',
    icon: <Mail size={20} color="#FFD600" />
  },
  {
    id: 'twitter',
    title: 'Twitter',
    url: 'https://twitter.com/sqa_earning',
    icon: <MessageCircle size={20} color="#FFD600" />
  },
  {
    id: 'facebook',
    title: 'Facebook',
    url: 'https://facebook.com/sqa-earning',
    icon: <Users size={20} color="#FFD600" />
  }
];

const achievements = [
  {
    id: 1,
    title: 'Best Earning App 2024',
    description: 'Awarded by Mobile App Awards',
    icon: <Award size={20} color="#FFD600" />
  },
  {
    id: 2,
    title: '4.8 Star Rating',
    description: 'Based on 500K+ reviews',
    icon: <Star size={20} color="#FFD600" />
  },
  {
    id: 3,
    title: '50M+ Total Payouts',
    description: 'To users worldwide',
    icon: <TrendingUp size={20} color="#FFD600" />
  }
];

export default function AboutScreen({ navigation }: any) {
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleLinkPress = async (url: string) => {
    try {
      await Linking.openURL(url);
    } catch (error) {
      Alert.alert('Error', 'Could not open the link');
    }
  };

  const handleShare = () => {
    Alert.alert('Share App', 'Sharing app with friends...');
  };

  const handleRateApp = () => {
    Alert.alert('Rate App', 'Opening app store...');
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
          <Text className="text-xl font-bold text-white">About</Text>
          <TouchableOpacity 
            activeOpacity={0.7}
            onPress={handleShare}
          >
            <Share2 size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <Animated.View style={{ opacity: fadeAnim }}>
          {/* App Header */}
          <View className="bg-gray-800 mx-4 mt-4 rounded-xl p-6">
            <View className="items-center">
              <View className="w-20 h-20 bg-yellow-500 rounded-2xl items-center justify-center mb-4">
                <TrendingUp size={40} color="#000" />
              </View>
              <Text className="text-2xl font-bold text-white mb-2">{appInfo.name}</Text>
              <Text className="text-gray-400 text-sm mb-4">Version {appInfo.version} ({appInfo.buildNumber})</Text>
              <Text className="text-gray-300 text-center leading-6 mb-4">
                {appInfo.description}
              </Text>
              
              {/* App Stats */}
              <View className="flex-row justify-around w-full mt-4">
                <View className="items-center">
                  <Text className="text-white font-bold text-lg">{appInfo.stats.users}</Text>
                  <Text className="text-gray-400 text-xs">Users</Text>
                </View>
                <View className="items-center">
                  <Text className="text-white font-bold text-lg">{appInfo.stats.countries}</Text>
                  <Text className="text-gray-400 text-xs">Countries</Text>
                </View>
                <View className="items-center">
                  <Text className="text-white font-bold text-lg">{appInfo.stats.totalPaid}</Text>
                  <Text className="text-gray-400 text-xs">Paid Out</Text>
                </View>
                <View className="items-center">
                  <Text className="text-white font-bold text-lg">{appInfo.stats.rating}</Text>
                  <Text className="text-gray-400 text-xs">Rating</Text>
                </View>
              </View>
            </View>
          </View>

          {/* App Features */}
          <View className="mx-4 mt-6">
            <Text className="text-lg font-bold text-white mb-4">Key Features</Text>
            <View className="bg-gray-800 rounded-xl p-4">
              {appInfo.features.map((feature) => (
                <View key={feature.id} className="flex-row items-center mb-4 last:mb-0">
                  <View className="mr-3">
                    {feature.icon}
                  </View>
                  <View className="flex-1">
                    <Text className="text-white font-semibold">{feature.title}</Text>
                    <Text className="text-gray-400 text-sm">{feature.description}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Achievements */}
          <View className="mx-4 mt-6">
            <Text className="text-lg font-bold text-white mb-4">Achievements</Text>
            <View className="bg-gray-800 rounded-xl p-4">
              {achievements.map((achievement) => (
                <View key={achievement.id} className="flex-row items-center mb-4 last:mb-0">
                  <View className="mr-3">
                    {achievement.icon}
                  </View>
                  <View className="flex-1">
                    <Text className="text-white font-semibold">{achievement.title}</Text>
                    <Text className="text-gray-400 text-sm">{achievement.description}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Team Section */}
          <View className="mx-4 mt-6">
            <Text className="text-lg font-bold text-white mb-4">Our Team</Text>
            <View className="bg-gray-800 rounded-xl p-4">
              {teamMembers.map((member) => (
                <View key={member.id} className="flex-row items-center mb-6 last:mb-0">
                  <Image
                    source={{ uri: member.avatar }}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <View className="flex-1">
                    <Text className="text-white font-semibold">{member.name}</Text>
                    <Text className="text-yellow-500 text-sm font-medium">{member.role}</Text>
                    <Text className="text-gray-400 text-sm mt-1">{member.bio}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Contact & Social */}
          <View className="mx-4 mt-6">
            <Text className="text-lg font-bold text-white mb-4">Connect With Us</Text>
            <View className="bg-gray-800 rounded-xl p-4">
              {socialLinks.map((link) => (
                <TouchableOpacity
                  key={link.id}
                  className="flex-row items-center justify-between p-3 bg-gray-700 rounded-lg mb-3"
                  onPress={() => handleLinkPress(link.url)}
                  activeOpacity={0.8}
                >
                  <View className="flex-row items-center">
                    {link.icon}
                    <Text className="text-white font-semibold ml-3">{link.title}</Text>
                  </View>
                  <ExternalLink size={16} color="#9CA3AF" />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Company Info */}
          <View className="mx-4 mt-6">
            <Text className="text-lg font-bold text-white mb-4">Company Information</Text>
            <View className="bg-gray-800 rounded-xl p-4">
              <View className="flex-row items-center mb-3">
                <MapPin size={20} color="#FFD600" />
                <Text className="text-white font-semibold ml-3">Headquarters</Text>
              </View>
              <Text className="text-gray-400 text-sm ml-7 mb-4">San Francisco, CA, USA</Text>
              
              <View className="flex-row items-center mb-3">
                <Clock size={20} color="#FFD600" />
                <Text className="text-white font-semibold ml-3">Founded</Text>
              </View>
              <Text className="text-gray-400 text-sm ml-7 mb-4">2020</Text>
              
              <View className="flex-row items-center mb-3">
                <Users size={20} color="#FFD600" />
                <Text className="text-white font-semibold ml-3">Team Size</Text>
              </View>
              <Text className="text-gray-400 text-sm ml-7">50+ employees worldwide</Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View className="mx-4 mt-6 mb-6">
            <TouchableOpacity
              className="bg-yellow-500 rounded-xl p-4 items-center mb-4"
              onPress={handleRateApp}
              activeOpacity={0.8}
            >
              <View className="flex-row items-center">
                <Star size={20} color="#000" />
                <Text className="text-black font-bold text-lg ml-2">Rate Our App</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-green-500 rounded-xl p-4 items-center mb-4"
              onPress={() => navigation.navigate('AppUpdate')}
              activeOpacity={0.8}
            >
              <View className="flex-row items-center">
                <Download size={20} color="#fff" />
                <Text className="text-white font-bold text-lg ml-2">Check for Updates</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-blue-500 rounded-xl p-4 items-center mb-4"
              onPress={handleShare}
              activeOpacity={0.8}
            >
              <View className="flex-row items-center">
                <Share2 size={20} color="#fff" />
                <Text className="text-white font-bold text-lg ml-2">Share App</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-gray-700 rounded-xl p-4 items-center"
              onPress={() => navigation.navigate('Support')}
              activeOpacity={0.8}
            >
              <View className="flex-row items-center">
                <MessageCircle size={20} color="#fff" />
                <Text className="text-white font-bold text-lg ml-2">Contact Support</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View className="mx-4 mb-6">
            <View className="bg-gray-800 rounded-xl p-4 items-center">
              <Text className="text-gray-400 text-sm text-center">
                Made with <Heart size={12} color="#EF4444" /> by the SQA Earning Team
              </Text>
              <Text className="text-gray-500 text-xs text-center mt-2">
                © 2024 SQA Earning. All rights reserved.
              </Text>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
} 
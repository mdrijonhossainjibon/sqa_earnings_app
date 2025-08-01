import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Clipboard, Share, ScrollView, Linking, Image, StatusBar, FlatList, Pressable } from 'react-native';
import { Users, Share2, Gift, UserPlus, Info, HelpCircle, ArrowLeft, Copy, ExternalLink, QrCode } from 'lucide-react-native';
import ActionSheet, { ActionSheetRef, SheetManager } from 'react-native-actions-sheet';
import { SafeAreaView } from 'react-native-safe-area-context';

const mockReferralCode = 'SQA12345';
 
// Mock referral methods
const referralMethods = [
  {
    id: 'share',
    title: 'Share Link',
    description: 'Share your referral link via social media',
    icon: <Share2 size={24} color="#FFD600" />,
    color: '#FFD600',
    bgColor: 'bg-yellow-500/10'
  },
  {
    id: 'qr',
    title: 'QR Code',
    description: 'Let friends scan your QR code',
    icon: <QrCode size={24} color="#10B981" />,
    color: '#10B981',
    bgColor: 'bg-green-500/10'
  },
  {
    id: 'code',
    title: 'Referral Code',
    description: 'Share your unique referral code',
    icon: <UserPlus size={24} color="#6366F1" />,
    color: '#6366F1',
    bgColor: 'bg-blue-500/10'
  },
  {
    id: 'invite',
    title: 'Direct Invite',
    description: 'Invite friends directly via email/SMS',
    icon: <Users size={24} color="#F59E0B" />,
    color: '#F59E0B',
    bgColor: 'bg-orange-500/10'
  }
];

export default function ReferFriendScreen({ navigation }: any) {
  const [copied, setCopied] = useState(false);
  const [referralList, setReferralList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMethod, setSelectedMethod] = useState('share');

  useEffect(() => {
    // Fetch 5 random users from randomuser.me
    fetch('https://randomuser.me/api/?results=5')
      .then(res => res.json())
      .then(data => {
        const users = data.results.map((user: any) => ({
          name: `${user.name.first} ${user.name.last}`,
          joined: `${Math.floor(Math.random() * 24)}h ago`,
          earned: 100,
          image: user.picture.medium,
        }));
        setReferralList(users);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleCopy = () => {
    Clipboard.setString(mockReferralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `🎉 Join me on SQA Earning and let's earn rewards together! 🎉\n\nUse my referral code: ${mockReferralCode} when you sign up and you'll get a 50 point welcome bonus. Plus, I'll earn 100 points when you join!\n\nHow to get started:\n1. Download the SQA Earning app\n2. Sign up and enter my referral code: ${mockReferralCode}\n3. Start completing tasks and earning rewards!\n\nSign up now: https://myapp.com/signup?ref=${mockReferralCode}\n\nLet's make earning fun and easy together! 🚀` ,
        url: `https://myapp.com/signup?ref=${mockReferralCode}`,
        title: 'Invite to SQA Earning',
      });
    } catch (error) {
      // handle error
    }
  };

  const ReferralMethodSheet = () => {
    return (
      <View className="bg-gray-900 rounded-t-2xl p-4">
        <Text className="text-white text-lg font-bold mb-4 text-center">Select Referral Method</Text>
        
        <FlatList
          data={referralMethods}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Pressable
              className="flex-row items-center p-4 rounded-xl mb-3 bg-gray-800"
              onPress={() => {
                setSelectedMethod(item.id);
                SheetManager.hide('referralMethod');
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
          onPress={() => SheetManager.hide('referralMethod')} 
          className="p-3 bg-gray-700 rounded-xl items-center"
        >
          <Text className="text-white font-semibold">Cancel</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <StatusBar barStyle="light-content" backgroundColor="#111827" translucent={false} />

      {/* Header */}
      <View className="flex-row items-center p-4 border-b border-gray-800">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-2">
          <ArrowLeft size={28} color="#FFD600" />
        </TouchableOpacity>
        <Text className="font-bold text-xl text-yellow-400 flex-1 text-center">Refer Friends</Text>
        <View className="w-8" />
      </View>

      <ScrollView className="flex-1" keyboardShouldPersistTaps="handled">
        {/* Referral Method Selector */}
        <View className="px-4 mt-6 mb-4">
          <Text className="text-gray-400 text-sm mb-2">Referral Method</Text>
          <TouchableOpacity onPress={() => SheetManager.show('referralMethod')}>
            <View className="bg-gray-800 rounded-xl p-4 flex-row items-center">
              {referralMethods.find(m => m.id === selectedMethod)?.icon}
              <View className="flex-1 ml-3">
                <Text className="text-white font-semibold">
                  {referralMethods.find(m => m.id === selectedMethod)?.title}
                </Text>
                <Text className="text-gray-400 text-sm">
                  {referralMethods.find(m => m.id === selectedMethod)?.description}
                </Text>
              </View>
              <ExternalLink size={20} color="#FFD600" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Referral Code Section */}
        <View className="px-4 mb-4">
          <View className="bg-gray-800 rounded-xl p-6 items-center">
            <Text className="text-white font-bold text-lg mb-4">Your Referral Code</Text>
            
            {/* QR Code */}
            <View className="bg-white p-4 rounded-xl mb-4">
              <Image 
                source={{ uri: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://myapp.com/signup?ref=${mockReferralCode}` }} 
                className="w-48 h-48"
                resizeMode="contain"
              />
            </View>

            {/* Referral Code */}
            <View className="w-full">
              <Text className="text-gray-400 text-sm mb-2 text-center">Referral Code</Text>
              <View className="flex-row items-center bg-gray-700 rounded-xl px-3 py-2">
                <Text className="flex-1 text-white font-mono text-xs">
                  {mockReferralCode}
                </Text>
                <TouchableOpacity onPress={handleCopy} className="ml-2">
                  <Copy size={20} color="#FFD600" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Action Buttons */}
            <View className="flex-row gap-3 mt-4">
              <TouchableOpacity 
                className="flex-1 bg-yellow-400 px-4 py-3 rounded-xl items-center"
                onPress={handleCopy}
              >
                <Text className="text-gray-900 font-bold">
                  {copied ? 'Copied!' : 'Copy Code'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                className="flex-1 bg-gray-700 px-4 py-3 rounded-xl items-center"
                onPress={handleShare}
              >
                <Text className="text-white font-bold">Share</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* How it Works Section */}
        <View className="px-4 mb-4">
          <View className="bg-gray-800 rounded-xl p-4">
            <Text className="text-white font-bold text-lg mb-3">How it Works</Text>
            <View className="flex-row items-center mb-3">
              <UserPlus size={18} color="#FFD600" />
              <Text className="ml-3 text-gray-300">Invite your friends using your code</Text>
            </View>
            <View className="flex-row items-center mb-3">
              <Gift size={18} color="#10B981" />
              <Text className="ml-3 text-gray-300">They sign up and get a 50 point bonus</Text>
            </View>
            <View className="flex-row items-center">
              <Users size={18} color="#F59E0B" />
              <Text className="ml-3 text-gray-300">You earn 100 points for each friend who joins</Text>
            </View>
          </View>
        </View>

        {/* Benefits Section */}
        <View className="px-4 mb-4">
          <View className="bg-gray-800 rounded-xl p-4">
            <Text className="text-white font-bold text-lg mb-3">Benefits</Text>
            <View className="flex-row items-center mb-3">
              <Gift size={20} color="#10B981" />
              <Text className="ml-3 text-green-400 font-semibold">You earn 100 points for each friend who joins!</Text>
            </View>
            <View className="flex-row items-center">
              <Gift size={20} color="#6366F1" />
              <Text className="ml-3 text-blue-400 font-semibold">Your friend gets a 50 point welcome bonus!</Text>
            </View>
          </View>
        </View>

        {/* Your Referrals List */}
        <View className="px-4 mb-4">
          <Text className="text-white font-bold text-lg mb-3">Your Referrals</Text>
          {loading ? (
            <View className="bg-gray-800 rounded-xl p-4 items-center">
              <Text className="text-gray-400">Loading...</Text>
            </View>
          ) : referralList.length === 0 ? (
            <View className="bg-gray-800 rounded-xl p-4 items-center">
              <Text className="text-gray-400">You haven't referred anyone yet.</Text>
            </View>
          ) : (
            <View className="bg-gray-800 rounded-xl p-4">
              {referralList.map((ref, idx) => (
                <View key={idx} className="flex-row items-center justify-between mb-3 last:mb-0">
                  <View className="flex-row items-center gap-2 mt-6">
                    <Image
                      source={{ uri: ref.image }}
                      className="w-10 h-10 rounded-full mr-3"
                      resizeMode="cover"
                    />
                    <View>
                      <Text className="text-white font-semibold">{ref.name}</Text>
                      <Text className="text-xs text-gray-400">{ref.joined}</Text>
                    </View>
                  </View>
                  <View className="flex-row items-center">
                    <Gift size={16} color="#10B981" />
                    <Text className="ml-1 text-green-400 font-bold">+{ref.earned} pts</Text>
                  </View>
                </View>
              ))}
              <View className="flex-row justify-end mt-3 pt-3 border-t border-gray-700">
                <Text className="text-yellow-400 font-bold">
                  Total Earned: {referralList.reduce((sum, ref) => sum + ref.earned, 0)} pts
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* FAQ/Help Link */}
        <View className="px-4 mb-4">
          <TouchableOpacity 
            className="flex-row items-center justify-center p-4 bg-gray-800 rounded-xl"
            onPress={() => Linking.openURL('https://sqa-earnings.vercel.app/app/referral-faq')}
            /* onPress={() => navigation.navigate('ReferralFAQ')} */
          >
            <HelpCircle size={18} color="#FFD600" />
            <Text className="ml-2 text-yellow-400 font-semibold">Referral FAQ / Need Help?</Text>
          </TouchableOpacity>
        </View>

        {/* Spacer for bottom nav */}
        <View className="h-16" />
      </ScrollView>

      {/* ActionSheets */}
      <ActionSheet id="referralMethod">
        <ReferralMethodSheet />
      </ActionSheet>
    </SafeAreaView>
  );
} 
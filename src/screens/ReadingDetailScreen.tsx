import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, Share, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Clock, PartyPopper, Share2, Star, BookOpen, Users } from 'lucide-react-native';
import { BannerAd, BannerAdSize, TestIds, InterstitialAd, AdEventType } from 'react-native-google-mobile-ads';

const storySections = [
  {
    text: 'Once upon a time, in a world not so different from our own, there lived a curious explorer named Aria.',
    image: 'https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=400&q=80',
    icon: <Star size={20} color="#FFD600" style={{ marginRight: 6 }} />,
  },
  {
    text: 'She dreamed of traveling beyond the stars, discovering new worlds, and learning the secrets of the universe.',
    image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80',
    icon: <BookOpen size={20} color="#FFD600" style={{ marginRight: 6 }} />,
  },
  {
    text: 'Every night, she would gaze at the sky, her mind filled with wonder and questions.',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
    icon: <Star size={20} color="#FFD600" style={{ marginRight: 6 }} />,
  },
  {
    text: 'One day, Aria built a small telescope from scraps she found in her village. Through its lens, she saw the craters of the moon, the rings of Saturn, and the swirling clouds of Jupiter.',
    image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80',
    icon: <Users size={20} color="#FFD600" style={{ marginRight: 6 }} />,
  },
  {
    text: 'Her fascination grew, and so did her determination to reach for the unknown.',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80',
    icon: <BookOpen size={20} color="#FFD600" style={{ marginRight: 6 }} />,
  },
  {
    text: 'As years passed, Aria studied, invented, and inspired others to join her quest. Together, they built a ship that could travel farther than anyone had ever gone.',
    image: 'https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=400&q=80',
    icon: <Users size={20} color="#FFD600" style={{ marginRight: 6 }} />,
  },
  {
    text: 'Their journey was filled with challenges—cosmic storms, strange signals, and moments of doubt—but Aria’s spirit never wavered.',
    image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80',
    icon: <Star size={20} color="#FFD600" style={{ marginRight: 6 }} />,
  },
  {
    text: 'Finally, after many adventures, Aria and her crew landed on a distant planet. The landscape was breathtaking: purple mountains, golden rivers, and forests that glowed at night.',
    image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80',
    icon: <BookOpen size={20} color="#FFD600" style={{ marginRight: 6 }} />,
  },
  {
    text: 'They met new friends, learned new ways of thinking, and realized that the universe was even more magical than they had imagined.',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80',
    icon: <Users size={20} color="#FFD600" style={{ marginRight: 6 }} />,
  },
  {
    text: 'Aria’s story became legend, reminding everyone that curiosity, courage, and kindness could take you to the stars—and beyond. The end.',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
    icon: <Star size={20} color="#FFD600" style={{ marginRight: 6 }} />,
  },
];

export default function ReadingDetailScreen({ route, navigation }: any) {
  const { item } = route.params;
  const [seconds, setSeconds] = useState(30);
  const [earned, setEarned] = useState(false);
  const [interstitialLoaded, setInterstitialLoaded] = useState(false);
  const interstitialRef = useRef<InterstitialAd | null>(null);
  const adShownRef = useRef(false);

  // Setup Interstitial Ad
  useEffect(() => {
    const interstitial = InterstitialAd.createForAdRequest(TestIds.INTERSTITIAL, { requestNonPersonalizedAdsOnly: true });
    interstitialRef.current = interstitial;
    const unsubscribe = interstitial.addAdEventListener(AdEventType.LOADED, () => setInterstitialLoaded(true));
    const unsubscribeClosed = interstitial.addAdEventListener(AdEventType.CLOSED, () => {
      setInterstitialLoaded(false);
      interstitial.load(); // Preload next ad
    });
    interstitial.load();
    return () => {
      unsubscribe();
      unsubscribeClosed();
    };
  }, []);

  // Show interstitial ad when timer ends
  useEffect(() => {
    if (seconds === 0 && !adShownRef.current && interstitialLoaded) {
      interstitialRef.current?.show();
      adShownRef.current = true;
    }
  }, [seconds, interstitialLoaded]);

  useEffect(() => {
    if (seconds > 0 && !earned) {
      const timer = setTimeout(() => setSeconds(seconds - 1), 1000);
      return () => clearTimeout(timer);
    } else if (seconds === 0 && !earned) {
      setEarned(true);
    }
  }, [seconds, earned]);

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this story: ${item.title}\nRead it here: https://sqa-earnings.vercel.app/story/${item.id}`,
        url: `https://sqa-earnings.vercel.app/story/${item.id}`,
        title: item.title,
      });
    } catch (error) {
      // handle error
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <StatusBar barStyle="light-content" backgroundColor="#111827" translucent={false} />
      {/* Header */}
      <View className="flex-row items-center p-4 border-b border-gray-800">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-2">
          <ArrowLeft size={28} color="#FFD600" />
        </TouchableOpacity>
        <Text className="font-bold text-xl text-yellow-400 flex-1 text-center">Reading Detail</Text>
        <View className="w-8" />
      </View>
      <ScrollView contentContainerStyle={{ padding: 0 }} showsVerticalScrollIndicator={false}>
        {/* Story Image & Title Card */}
        <View className="px-4 mt-6 mb-4">
          <View className="bg-gray-800 rounded-xl p-6 items-center border border-gray-700">
            <Image source={{ uri: item.image }} style={{ width: 120, height: 120, borderRadius: 16, marginBottom: 16, backgroundColor: '#eee' }} />
            <Text className="text-2xl font-bold text-white mb-2 text-center">{item.title}</Text>
          </View>
        </View>
        {/* Points, Timer, Share Card */}
        <View className="px-4 mb-4">
          <View className="bg-gray-800 rounded-xl p-4 flex-row items-center border border-gray-700">
            <View className="flex-1">
              <View className="flex-row items-center mb-2">
                <Text className="text-lg text-yellow-400 font-bold mr-2">Earn {item.points} points</Text>
                <Clock size={18} color="#FFD600" />
                <Text className="text-lg text-gray-300 ml-1">30s</Text>
              </View>
              {!earned ? (
                <View className="items-start">
                  <Text className="text-3xl font-bold text-yellow-400 mb-1">{seconds}s</Text>
                  <Text className="text-base text-gray-400">Keep reading to earn your reward!</Text>
                </View>
              ) : (
                <View className="items-start">
                  <PartyPopper size={36} color="#10B981" />
                  <Text className="text-xl font-bold text-emerald-400 mt-2">You earned {item.points} points!</Text>
                </View>
              )}
            </View>
            <TouchableOpacity className="ml-4 px-4 py-2 bg-yellow-400 rounded-full flex-row items-center" onPress={handleShare} activeOpacity={0.8}>
              <Share2 size={18} color="#111827" />
              <Text className="ml-2 text-gray-900 font-semibold">Share</Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* Story Content Cards */}
        {storySections.map((section, idx) => (
          <React.Fragment key={idx}>
            <View className="px-4 mb-4">
              <View className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                <View className="flex-row items-center mb-2">
                  {section.icon}
                  <Text className="text-base text-white leading-relaxed flex-1">{section.text}</Text>
                </View>
                <Image source={{ uri: section.image }} style={{ width: '100%', height: 120, borderRadius: 12, backgroundColor: '#eee' }} resizeMode="cover" />
              </View>
            </View>
            {(idx + 1) % 2 === 0 && idx !== storySections.length - 1 && (
              <View className="items-center mb-4">
                <BannerAd
                  unitId={TestIds.BANNER}
                  size={BannerAdSize.ADAPTIVE_BANNER}
                  requestOptions={{ requestNonPersonalizedAdsOnly: true }}
                />
              </View>
            )}
          </React.Fragment>
        ))}
        {/* Spacer for bottom nav */}
        <View className="h-16" />
      </ScrollView>
    </SafeAreaView>
  );
} 
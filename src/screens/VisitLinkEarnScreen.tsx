import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ToastAndroid, Platform } from 'react-native';
import { ArrowLeft, Gift, Info, Clock, Globe, BookOpen, Github } from 'lucide-react-native';
import { BannerAd, BannerAdSize, TestIds, InterstitialAd, AdEventType } from 'react-native-google-mobile-ads';

const sponsoredLinks = [
  { url: 'https://www.example.com', label: 'Example Site', icon: <Globe size={24} color="#2563EB" />, earning: 0.03 },
  { url: 'https://www.wikipedia.org', label: 'Wikipedia', icon: <BookOpen size={24} color="#2563EB" />, earning: 0.04 },
  { url: 'https://www.github.com', label: 'GitHub', icon: <Github size={24} color="#2563EB" />, earning: 0.05 },
];

export default function VisitLinkEarnScreen({ navigation }: any) {
  // Memoize initial visits for stability
  const initialLinkVisits = useMemo(() => {
    const visits: Record<string, number> = {};
    sponsoredLinks.forEach(link => { visits[link.url] = 0; });
    return visits;
  }, []);

  const [linksVisited, setLinksVisited] = useState(0);
  const [totalEarned, setTotalEarned] = useState(0.0);
  const [recentLinks, setRecentLinks] = useState<string[]>([]);
  const [isVisiting, setIsVisiting] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [currentLink, setCurrentLink] = useState<string | null>(null);
  const [linkVisits, setLinkVisits] = useState<Record<string, number>>(initialLinkVisits);

  // Interstitial Ad setup
  const interstitial = useMemo(
    () =>
      InterstitialAd.createForAdRequest(TestIds.INTERSTITIAL, {
        requestNonPersonalizedAdsOnly: true,
      }),
    []
  );
  const [interstitialLoaded, setInterstitialLoaded] = useState(false);

  useEffect(() => {
    const unsubscribeLoaded = interstitial.addAdEventListener(AdEventType.LOADED, () => {
      setInterstitialLoaded(true);
    });
    const unsubscribeClosed = interstitial.addAdEventListener(AdEventType.CLOSED, () => {
      setInterstitialLoaded(false);
      interstitial.load(); // Preload next ad
    });
    interstitial.load(); // Initial load
    return () => {
      unsubscribeLoaded();
      unsubscribeClosed();
    };
  }, [interstitial]);

  useEffect(() => {
    let interval: any;
    if (countdown > 0) {
      interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setIsVisiting(false);
            setLinksVisited((prev) => prev + 1);
            const earning = currentLink ? (sponsoredLinks.find(l => l.url === currentLink)?.earning || 0) : 0;
            setTotalEarned((prev) => +(prev + earning).toFixed(2));
            if (currentLink) {
              setLinkVisits(prev => ({ ...prev, [currentLink]: (prev[currentLink] || 0) + 1 }));
              setRecentLinks(prev => [currentLink, ...prev.filter(l => l !== currentLink)].slice(0, 10));
            }
            setCurrentLink(null);
            if (Platform.OS === 'android') {
              ToastAndroid.show(`🎉 You earned $${earning.toFixed(2)}!`, ToastAndroid.SHORT);
            }
            // Show interstitial ad if loaded
            if (interstitialLoaded) {
              interstitial.show();
            }
            return 0;
          }
          if (prev % 2 === 0 && Platform.OS === 'android') {
            ToastAndroid.show(`⏰ ${prev} seconds remaining...`, ToastAndroid.SHORT);
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [countdown, currentLink, interstitialLoaded, interstitial]);

  const handleVisit = (link: string) => {
    setIsVisiting(true);
    setCountdown(10);
    setCurrentLink(link);
    navigation.navigate('Browser', { url: link });
    if (Platform.OS === 'android') {
      ToastAndroid.show('🌐 Link opened! Please wait 10 seconds...', ToastAndroid.SHORT);
    }
  };

  // Helper to get label from URL
  const getLabel = (url: string) => sponsoredLinks.find(l => l.url === url)?.label || url;

  return (
    <View className="flex-1 bg-gradient-to-b from-indigo-100 to-white">
      {/* Countdown Overlay */}
      {countdown > 0 && (
        <View className="absolute inset-0 bg-black/50 z-50 justify-center items-center">
          <View className="bg-white rounded-3xl p-8 shadow-2xl items-center">
            <Clock size={48} color="#2563EB" />
            <Text className="text-6xl font-bold text-blue-600 mt-4">{countdown}</Text>
            <Text className="text-lg text-gray-600 mt-2 text-center">
              seconds remaining
            </Text>
            <Text className="text-sm text-gray-500 mt-1 text-center">
              Please wait to earn your reward
            </Text>
          </View>
        </View>
      )}

      {/* Header */}
      <View className="flex-row items-center px-4 py-4 bg-white shadow-sm">
        <TouchableOpacity onPress={() => navigation.goBack()} className="flex-row items-center">
          <ArrowLeft size={24} color="#2563EB" />
          <Text className="ml-2 text-lg font-semibold text-blue-700">Visit Link & Earn</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-4 py-4">
        {/* Earnings Summary */}
        <View className="bg-white rounded-2xl p-4 mb-4 shadow-lg border border-blue-100">
          <View className="flex-row items-center mb-2">
            <Gift size={22} color="#2563EB" />
            <Text className="ml-2 text-lg font-bold text-blue-700">Link Earnings</Text>
          </View>
          <View className="flex-row justify-between mt-2">
            <View className="items-center">
              <Text className="text-2xl font-bold text-blue-600">${totalEarned.toFixed(2)}</Text>
              <Text className="text-xs text-gray-500">Total Earned</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-emerald-600">{linksVisited}</Text>
              <Text className="text-xs text-gray-500">Links Visited</Text>
            </View>
          </View>
        </View>

        {/* Sponsored Links */}
        <View className="mb-4">
          <Text className="text-base font-semibold text-blue-700 mb-2">Sponsored Links</Text>
          {sponsoredLinks.map((item) => (
            <TouchableOpacity
              key={item.url}
              className={`flex-row items-center bg-white rounded-xl p-4 shadow border border-blue-100 mb-2 ${isVisiting ? 'opacity-60' : ''}`}
              activeOpacity={0.8}
              onPress={() => handleVisit(item.url)}
              disabled={isVisiting}
            >
              {item.icon}
              <Text className="ml-3 text-blue-700 text-base font-semibold flex-1">{item.label}</Text>
              <View className="flex-col items-end ml-2">
                <Text className="text-xs text-emerald-700 font-bold">Earn ${item.earning.toFixed(2)}</Text>
                <Text className="text-xs text-gray-500">Visited: {linkVisits[item.url] || 0}</Text>
              </View>
              <Text className="ml-2 text-xs text-gray-500">Visit</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* AdMob Banner under Sponsored Links */}
        <View style={{ alignItems: 'center', marginBottom: 8 }}>
          <BannerAd
            unitId={TestIds.BANNER} // This is the official AdMob test unit ID
            size={BannerAdSize.ADAPTIVE_BANNER}
            requestOptions={{
              requestNonPersonalizedAdsOnly: true,
            }}
          />
        </View>

        {/* Recent Links */}
        {recentLinks.length > 0 && (
          <View className="bg-white rounded-2xl p-4 mb-4 shadow border border-gray-100">
            <Text className="text-base font-semibold text-blue-700 mb-2">Recent Links Visited</Text>
            {recentLinks.map((url, idx) => (
              <Text key={idx} className="text-sm text-gray-600 mb-1">• {getLabel(url)}</Text>
            ))}
          </View>
        )}

        {/* Info Section */}
        <View className="bg-white rounded-2xl p-4 mb-4 shadow border border-gray-100">
          <View className="flex-row items-center mb-2">
            <Info size={18} color="#2563EB" />
            <Text className="ml-2 text-base font-semibold text-blue-700">How it works</Text>
          </View>
          <Text className="text-sm text-gray-600 mb-1">• Visit a sponsored link to earn rewards.</Text>
          <Text className="text-sm text-gray-600 mb-1">• Stay on the link for at least 10 seconds to qualify.</Text>
          <Text className="text-sm text-gray-600 mb-1">• Rewards are credited instantly after each visit.</Text>
        </View>

        {/* Tips Section */}
        <View className="bg-white rounded-2xl p-4 mb-10 shadow border border-gray-100">
          <View className="flex-row items-center mb-2">
            <Clock size={16} color="#2563EB" />
            <Text className="ml-2 text-base font-semibold text-blue-700">Tips</Text>
          </View>
          <Text className="text-sm text-gray-600 mb-1">• Visit all available links daily for maximum rewards.</Text>
          <Text className="text-sm text-gray-600 mb-1">• Check back for new sponsored links regularly.</Text>
        </View>
      </ScrollView>
    </View>
  );
} 
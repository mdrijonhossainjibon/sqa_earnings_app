import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  StatusBar, 
  Animated, 
  Dimensions, 
  Alert, 
  ToastAndroid, 
  Platform,
  Modal,
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  ArrowLeft, 
  RotateCcw, 
  Gift, 
  Coins, 
  Clock, 
  TrendingUp, 
  Trophy, 
  Star, 
  Zap, 
  Target, 
  Calendar,
  DollarSign,
  Award,
  Users,
  Activity,
  ChevronRight,
  Info,
  X,
  CheckCircle,
  AlertCircle
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

// Spin wheel segments
const wheelSegments = [
  { id: 1, value: 50, color: '#F7931A', label: '50 Points', probability: 0.3 },
  { id: 2, value: 100, color: '#FFD600', label: '100 Points', probability: 0.25 },
  { id: 3, value: 25, color: '#00D4AA', label: '25 Points', probability: 0.2 },
  { id: 4, value: 200, color: '#F7931A', label: '200 Points', probability: 0.1 },
  { id: 5, value: 75, color: '#FFD600', label: '75 Points', probability: 0.1 },
  { id: 6, value: 150, color: '#00D4AA', label: '150 Points', probability: 0.05 }
];

// Mock user data
const userStats = {
  totalSpins: 45,
  totalEarned: 3250,
  todaySpins: 3,
  maxDailySpins: 5,
  streak: 7,
  bestSpin: 200,
  level: 'Gold',
  nextLevel: 'Platinum',
  pointsToNextLevel: 750
};

// Spin history
const spinHistory = [
  { id: 1, points: 100, timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), type: 'spin' },
  { id: 2, points: 50, timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), type: 'spin' },
  { id: 3, points: 150, timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), type: 'spin' },
  { id: 4, points: 25, timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), type: 'spin' },
  { id: 5, points: 200, timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), type: 'spin' },
];

export default function SpinAndEarnScreen({ navigation }: any) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinResult, setSpinResult] = useState<number | null>(null);
  const [showResultModal, setShowResultModal] = useState(false);
  const [currentRotation, setCurrentRotation] = useState(0);
  const [userData, setUserData] = useState(userStats);
  const [history, setHistory] = useState(spinHistory);
  
  // Animations
  const spinAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Toast function
  const showToast = (message: string) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      Alert.alert('Info', message);
    }
  };

  // Initialize animations
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();

    // Glow animation for spin button
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, { toValue: 1.1, duration: 1000, useNativeDriver: true }),
        Animated.timing(glowAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  // Handle spin
  const handleSpin = () => {
    if (isSpinning) return;
    
    if (userData.todaySpins >= userData.maxDailySpins) {
      showToast('Daily spin limit reached! Come back tomorrow.');
      return;
    }

    setIsSpinning(true);
    
    // Determine result based on probability
    const random = Math.random();
    let cumulativeProbability = 0;
    let selectedSegment = wheelSegments[0];
    
    for (const segment of wheelSegments) {
      cumulativeProbability += segment.probability;
      if (random <= cumulativeProbability) {
        selectedSegment = segment;
        break;
      }
    }

    // Calculate rotation
    const segmentAngle = 360 / wheelSegments.length;
    const targetSegment = wheelSegments.findIndex(seg => seg.id === selectedSegment.id);
    const targetAngle = targetSegment * segmentAngle + segmentAngle / 2;
    const fullRotations = 5; // Number of full rotations
    const finalRotation = currentRotation + (fullRotations * 360) + (360 - targetAngle);

    // Animate spin
    Animated.timing(spinAnim, {
      toValue: finalRotation,
      duration: 3000,
      useNativeDriver: true,
    }).start(() => {
      // Update user data
      setUserData(prev => ({
        ...prev,
        totalSpins: prev.totalSpins + 1,
        todaySpins: prev.todaySpins + 1,
        totalEarned: prev.totalEarned + selectedSegment.value,
        bestSpin: Math.max(prev.bestSpin, selectedSegment.value)
      }));

      // Add to history
      const newHistoryItem = {
        id: Date.now(),
        points: selectedSegment.value,
        timestamp: new Date(),
        type: 'spin' as const
      };
      setHistory(prev => [newHistoryItem, ...prev.slice(0, 9)]);

      setSpinResult(selectedSegment.value);
      setShowResultModal(true);
      setIsSpinning(false);
      setCurrentRotation(finalRotation % 360);
      
      showToast(`🎉 You won ${selectedSegment.value} points!`);
    });
  };

  // Handle press animations
  const handlePressIn = () => {
    Animated.spring(scaleAnim, { toValue: 0.95, useNativeDriver: true }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();
  };

  // Render wheel segment
  const renderWheelSegment = (segment: any, index: number) => {
    const angle = (360 / wheelSegments.length) * index;
    const segmentAngle = 360 / wheelSegments.length;
    
    return (
      <View
        key={segment.id}
        style={{
          position: 'absolute',
          width: 0,
          height: 0,
          borderLeftWidth: 80,
          borderRightWidth: 80,
          borderBottomWidth: 120,
          borderLeftColor: 'transparent',
          borderRightColor: 'transparent',
          borderBottomColor: segment.color,
          transform: [
            { rotate: `${angle}deg` },
            { translateY: -60 }
          ],
        }}
      />
    );
  };

  // Render wheel labels
  const renderWheelLabels = () => {
    return wheelSegments.map((segment, index) => {
      const angle = (360 / wheelSegments.length) * index + (360 / wheelSegments.length) / 2;
      const radius = 70;
      const x = Math.cos((angle - 90) * Math.PI / 180) * radius;
      const y = Math.sin((angle - 90) * Math.PI / 180) * radius;
      
      return (
        <Text
          key={`label-${segment.id}`}
          style={{
            position: 'absolute',
            left: width / 2 + x - 20,
            top: height * 0.3 + y - 10,
            color: '#fff',
            fontSize: 10,
            fontWeight: 'bold',
            textAlign: 'center',
            width: 40,
            transform: [{ rotate: `${angle}deg` }]
          }}
        >
          {segment.value}
        </Text>
      );
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <StatusBar barStyle="light-content" backgroundColor="#111827" translucent={false} />
      
      {/* Header */}
      <View className="flex-row items-center p-4 border-b border-gray-800">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-3">
          <ArrowLeft size={28} color="#FFD600" />
        </TouchableOpacity>
        <View className="flex-1">
          <Text className="font-bold text-xl text-yellow-400">Spin & Earn</Text>
          <Text className="text-sm text-gray-400">Daily spins available</Text>
        </View>
        <TouchableOpacity className="p-2">
          <Info size={24} color="#FFD600" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Stats Cards */}
        <View className="p-4">
          <View className="flex-row space-x-3 mb-4">
            <View className="flex-1 bg-gray-800 rounded-xl p-4 border border-gray-700">
              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="text-gray-400 text-sm">Today's Spins</Text>
                  <Text className="text-white text-xl font-bold">
                    {userData.todaySpins}/{userData.maxDailySpins}
                  </Text>
                </View>
                <RotateCcw size={24} color="#FFD600" />
              </View>
            </View>
            
            <View className="flex-1 bg-gray-800 rounded-xl p-4 border border-gray-700">
              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="text-gray-400 text-sm">Total Earned</Text>
                  <Text className="text-white text-xl font-bold">
                    {userData.totalEarned.toLocaleString()}
                  </Text>
                </View>
                <Coins size={24} color="#00D4AA" />
              </View>
            </View>
          </View>

          <View className="flex-row space-x-3 mb-6">
            <View className="flex-1 bg-gray-800 rounded-xl p-4 border border-gray-700">
              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="text-gray-400 text-sm">Best Spin</Text>
                  <Text className="text-white text-xl font-bold">
                    {userData.bestSpin}
                  </Text>
                </View>
                <Trophy size={24} color="#F7931A" />
              </View>
            </View>
            
            <View className="flex-1 bg-gray-800 rounded-xl p-4 border border-gray-700">
              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="text-gray-400 text-sm">Streak</Text>
                  <Text className="text-white text-xl font-bold">
                    {userData.streak} days
                  </Text>
                </View>
                <Star size={24} color="#FFD600" />
              </View>
            </View>
          </View>
        </View>

        {/* Spin Wheel */}
        <View className="items-center mb-6">
          <View className="relative">
            {/* Wheel Background */}
            <View className="w-48 h-48 rounded-full bg-gray-800 border-4 border-gray-700 items-center justify-center">
              {/* Wheel Segments */}
              {wheelSegments.map((segment, index) => renderWheelSegment(segment, index))}
              
              {/* Wheel Labels */}
              {renderWheelLabels()}
              
              {/* Center */}
              <View className="absolute w-16 h-16 rounded-full bg-gray-900 border-4 border-gray-700 items-center justify-center">
                <Text className="text-white font-bold text-lg">SPIN</Text>
              </View>
            </View>
            
            {/* Pointer */}
            <View className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
              <View className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-yellow-400" />
            </View>
          </View>
          
          {/* Spin Button */}
          <TouchableOpacity
            onPress={handleSpin}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            disabled={isSpinning || userData.todaySpins >= userData.maxDailySpins}
            className={`mt-6 px-8 py-4 rounded-full ${isSpinning || userData.todaySpins >= userData.maxDailySpins ? 'bg-gray-600' : 'bg-yellow-400'}`}
            style={{
              transform: [{ scale: scaleAnim }],
              shadowColor: '#FFD600',
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.3,
              shadowRadius: 10,
              elevation: 5,
            }}
          >
            <Text className={`font-bold text-lg text-center ${isSpinning || userData.todaySpins >= userData.maxDailySpins ? 'text-gray-400' : 'text-gray-900'}`}>
              {isSpinning ? 'Spinning...' : userData.todaySpins >= userData.maxDailySpins ? 'Daily Limit Reached' : 'SPIN NOW'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Level Progress */}
        <View className="mx-4 mb-6 bg-gray-800 rounded-xl p-4 border border-gray-700">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-white font-semibold text-lg">Level Progress</Text>
            <View className="flex-row items-center">
              <Text className="text-yellow-400 font-bold mr-2">{userData.level}</Text>
              <ChevronRight size={16} color="#FFD600" />
              <Text className="text-gray-400 ml-1">{userData.nextLevel}</Text>
            </View>
          </View>
          
          <View className="bg-gray-700 rounded-full h-2 mb-2">
            <View 
              className="bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full h-2"
              style={{ width: `${((userData.totalEarned % 1000) / 1000) * 100}%` }}
            />
          </View>
          
          <Text className="text-gray-400 text-sm">
            {userData.pointsToNextLevel} points to next level
          </Text>
        </View>

        {/* Recent Spins */}
        <View className="mx-4 mb-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-white font-semibold text-lg">Recent Spins</Text>
            <TouchableOpacity>
              <Text className="text-yellow-400 text-sm">View All</Text>
            </TouchableOpacity>
          </View>
          
          {history.slice(0, 5).map((item) => (
            <View key={item.id} className="flex-row items-center justify-between bg-gray-800 rounded-xl p-4 mb-3 border border-gray-700">
              <View className="flex-row items-center">
                <View className="w-10 h-10 rounded-full bg-yellow-400/20 items-center justify-center mr-3">
                  <Gift size={20} color="#FFD600" />
                </View>
                <View>
                  <Text className="text-white font-semibold">Spin Reward</Text>
                  <Text className="text-gray-400 text-sm">
                    {item.timestamp.toLocaleTimeString()}
                  </Text>
                </View>
              </View>
              <Text className="text-yellow-400 font-bold text-lg">+{item.points}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Result Modal */}
      <Modal
        visible={showResultModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowResultModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-center items-center p-4">
          <View className="bg-gray-800 rounded-2xl p-6 w-80 border border-gray-700">
            <View className="items-center">
              <View className="w-20 h-20 rounded-full bg-yellow-400/20 items-center justify-center mb-4">
                <Gift size={32} color="#FFD600" />
              </View>
              
              <Text className="text-white text-2xl font-bold mb-2">Congratulations!</Text>
              <Text className="text-gray-400 text-center mb-6">
                You won
              </Text>
              
              <Text className="text-yellow-400 text-4xl font-bold mb-6">
                {spinResult} Points
              </Text>
              
              <TouchableOpacity
                onPress={() => setShowResultModal(false)}
                className="bg-yellow-400 px-8 py-3 rounded-full w-full"
              >
                <Text className="text-gray-900 font-bold text-center text-lg">
                  Claim Reward
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
} 
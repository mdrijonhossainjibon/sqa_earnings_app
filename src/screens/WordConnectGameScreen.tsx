import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StatusBar, Dimensions, Alert } from 'react-native';
import { ArrowLeft, Play, Pause, Target, Timer, Trophy, CheckCircle, RotateCcw } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

// Sample word connect data
const wordConnectData = {
  title: 'Word Connect',
  description: 'Connect letters to form words and earn points',
  levels: [
    {
      id: 1,
      letters: ['C', 'A', 'T', 'D', 'O', 'G', 'B', 'I', 'R', 'D'],
      words: ['CAT', 'DOG', 'BIRD', 'CAR', 'BAT'],
      foundWords: [],
      timeLimit: 60
    },
    {
      id: 2,
      letters: ['H', 'O', 'U', 'S', 'E', 'H', 'O', 'M', 'E', 'R'],
      words: ['HOUSE', 'HOME', 'HER', 'HOUR', 'SHE'],
      foundWords: [],
      timeLimit: 60
    },
    {
      id: 3,
      letters: ['F', 'L', 'O', 'W', 'E', 'R', 'G', 'A', 'R', 'D'],
      words: ['FLOWER', 'GARDEN', 'FAR', 'GOD', 'WAR'],
      foundWords: [],
      timeLimit: 60
    }
  ]
};

export default function WordConnectGameScreen({ navigation, route }: any) {
  const { game } = route.params;
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [selectedLetters, setSelectedLetters] = useState<number[]>([]);
  const [currentWord, setCurrentWord] = useState('');
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isPaused, setIsPaused] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [earnings, setEarnings] = useState(0);

  const currentLevel = wordConnectData.levels[currentLevelIndex];

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (!isPaused && timeLeft > 0 && !gameCompleted) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0 && !gameCompleted) {
      endLevel();
    }
    return () => clearTimeout(timer);
  }, [timeLeft, isPaused, gameCompleted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleLetterPress = (index: number) => {
    if (selectedLetters.includes(index)) {
      // Deselect letter
      const newSelected = selectedLetters.filter(i => i !== index);
      setSelectedLetters(newSelected);
      setCurrentWord(newSelected.map(i => currentLevel.letters[i]).join(''));
    } else {
      // Select letter
      const newSelected = [...selectedLetters, index];
      setSelectedLetters(newSelected);
      setCurrentWord(newSelected.map(i => currentLevel.letters[i]).join(''));
    }
  };

  const handleSubmitWord = () => {
    if (currentWord.length < 3) return;

    const word = currentWord.toUpperCase();
    if (currentLevel.words.includes(word) && !foundWords.includes(word)) {
      // Correct word found
      const newFoundWords = [...foundWords, word];
      setFoundWords(newFoundWords);
      setScore(score + (word.length * 5)); // 5 points per letter
      setEarnings(earnings + (word.length * 0.02)); // $0.02 per letter
      
      // Clear selection
      setSelectedLetters([]);
      setCurrentWord('');

      // Check if all words found
      if (newFoundWords.length === currentLevel.words.length) {
        setTimeout(() => {
          if (currentLevelIndex < wordConnectData.levels.length - 1) {
            nextLevel();
          } else {
            endGame();
          }
        }, 1500);
      }
    } else {
      // Wrong word or already found
      setSelectedLetters([]);
      setCurrentWord('');
    }
  };

  const nextLevel = () => {
    setCurrentLevelIndex(currentLevelIndex + 1);
    setSelectedLetters([]);
    setCurrentWord('');
    setFoundWords([]);
    setTimeLeft(60);
  };

  const endLevel = () => {
    // Move to next level or end game
    if (currentLevelIndex < wordConnectData.levels.length - 1) {
      nextLevel();
    } else {
      endGame();
    }
  };

  const endGame = () => {
    setGameCompleted(true);
    const finalEarnings = Math.max(0.10, earnings + (score * 0.01));
    setEarnings(finalEarnings);
  };

  const restartGame = () => {
    setCurrentLevelIndex(0);
    setSelectedLetters([]);
    setCurrentWord('');
    setFoundWords([]);
    setScore(0);
    setTimeLeft(60);
    setIsPaused(false);
    setGameCompleted(false);
    setEarnings(0);
  };

  const claimRewards = () => {
    Alert.alert(
      'Rewards Claimed!',
      `Congratulations! You've earned $${earnings.toFixed(2)} from Word Connect!`,
      [
        {
          text: 'OK',
          onPress: () => navigation.navigate('Home')
        }
      ]
    );
  };

  if (gameCompleted) {
    return (
      <SafeAreaView className="flex-1 bg-gray-900">
        <StatusBar barStyle="light-content" backgroundColor="#111827" translucent={false} />
        
        <View className="flex-1 justify-center items-center px-6">
          <View className="bg-gray-800 rounded-2xl p-8 border border-gray-700 w-full max-w-sm">
            <View className="items-center mb-6">
              <Trophy size={64} color="#FFD600" />
              <Text className="text-2xl font-bold text-white mt-4">Word Connect Complete!</Text>
            </View>

            <View className="space-y-4 mb-6">
              <View className="flex-row justify-between">
                <Text className="text-gray-300">Final Score:</Text>
                <Text className="text-yellow-400 font-bold">{score} points</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-gray-300">Words Found:</Text>
                <Text className="text-blue-400 font-bold">{foundWords.length}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-gray-300">Earnings:</Text>
                <Text className="text-green-400 font-bold">${earnings.toFixed(2)}</Text>
              </View>
            </View>

            <View className="space-y-3">
              <TouchableOpacity
                className="bg-yellow-400 rounded-xl py-4 items-center"
                onPress={claimRewards}
              >
                <Text className="text-gray-900 font-bold text-lg">Claim Rewards</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                className="bg-gray-700 rounded-xl py-4 items-center"
                onPress={restartGame}
              >
                <Text className="text-white font-bold text-lg">Play Again</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                className="bg-gray-600 rounded-xl py-4 items-center"
                onPress={() => navigation.navigate('Home')}
              >
                <Text className="text-white font-bold text-lg">Back to Home</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <StatusBar barStyle="light-content" backgroundColor="#111827" translucent={false} />

      {/* Header */}
      <View className="flex-row items-center justify-between p-4 border-b border-gray-800">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size={28} color="#FFD600" />
        </TouchableOpacity>
        
        <View className="flex-row items-center space-x-4">
          <View className="flex-row items-center">
            <Timer size={20} color="#FFD600" />
            <Text className="text-white font-bold ml-1">{formatTime(timeLeft)}</Text>
          </View>
          <View className="flex-row items-center">
            <Target size={20} color="#FFD600" />
            <Text className="text-white font-bold ml-1">{score}</Text>
          </View>
          <View className="flex-row items-center">
            <Trophy size={20} color="#FFD600" />
            <Text className="text-yellow-400 font-bold ml-1">${earnings.toFixed(2)}</Text>
          </View>
        </View>

        <TouchableOpacity onPress={() => setIsPaused(!isPaused)}>
          {isPaused ? <Play size={28} color="#FFD600" /> : <Pause size={28} color="#FFD600" />}
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-4 py-6">
        {/* Progress */}
        <View className="bg-gray-800 rounded-2xl p-4 mb-6 border border-gray-700">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-white font-bold">Level {currentLevelIndex + 1}</Text>
            <Text className="text-gray-300">{foundWords.length}/{currentLevel.words.length} words</Text>
          </View>
          <View className="bg-gray-700 rounded-full h-2">
            <View 
              className="bg-yellow-400 h-2 rounded-full" 
              style={{ width: `${(foundWords.length / currentLevel.words.length) * 100}%` }}
            />
          </View>
        </View>

        {/* Current Word Display */}
        <View className="bg-gray-800 rounded-2xl p-6 border border-gray-700 mb-6">
          <Text className="text-center text-gray-300 mb-2">Current Word</Text>
          <Text className="text-center text-3xl font-bold text-yellow-400 mb-4">
            {currentWord || 'Select letters'}
          </Text>
          
          {currentWord.length >= 3 && (
            <TouchableOpacity
              className="bg-yellow-400 rounded-xl py-3 items-center"
              onPress={handleSubmitWord}
            >
              <Text className="text-gray-900 font-bold text-lg">Submit Word</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Letter Grid */}
        <View className="bg-gray-800 rounded-2xl p-6 border border-gray-700 mb-6">
          <Text className="text-center text-white font-bold mb-4">Connect Letters</Text>
          <View className="flex-row flex-wrap justify-center space-x-2 space-y-2">
            {currentLevel.letters.map((letter, index) => (
              <TouchableOpacity
                key={index}
                className={`w-12 h-12 rounded-xl items-center justify-center border-2 ${
                  selectedLetters.includes(index)
                    ? 'bg-yellow-400 border-yellow-400'
                    : 'bg-gray-700 border-gray-600'
                }`}
                onPress={() => handleLetterPress(index)}
              >
                <Text className={`text-xl font-bold ${
                  selectedLetters.includes(index) ? 'text-gray-900' : 'text-white'
                }`}>
                  {letter}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Found Words */}
        <View className="bg-gray-800 rounded-2xl p-4 border border-gray-700 mb-6">
          <Text className="text-white font-bold mb-3">Found Words:</Text>
          <View className="flex-row flex-wrap">
            {foundWords.map((word, index) => (
              <View key={index} className="bg-green-500/20 border border-green-500/40 rounded-lg px-3 py-2 mr-2 mb-2">
                <Text className="text-green-400 font-semibold">{word}</Text>
              </View>
            ))}
            {foundWords.length === 0 && (
              <Text className="text-gray-400">No words found yet. Start connecting letters!</Text>
            )}
          </View>
        </View>

        {/* Game Tips */}
        <View className="bg-gray-800 rounded-2xl p-4 border border-gray-700">
          <Text className="text-lg font-bold text-white mb-2">💡 Word Connect Tips</Text>
          <Text className="text-gray-300 text-sm">• Look for common prefixes and suffixes</Text>
          <Text className="text-gray-300 text-sm">• Think of related words</Text>
          <Text className="text-gray-300 text-sm">• Longer words earn more points</Text>
          <Text className="text-gray-300 text-sm">• Use the pause button if needed</Text>
        </View>

        {/* Spacer for bottom nav */}
        <View className="h-24" />
      </ScrollView>
    </SafeAreaView>
  );
} 
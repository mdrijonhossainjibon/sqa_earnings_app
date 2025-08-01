import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ErrorScreenProps {
  title?: string;
  message?: string;
  buttonText?: string;
  onButtonPress?: () => void;
  showBackButton?: boolean;
  buttonColor?: string;
}

const ErrorScreen = ({ 
  title = 'Error',
  message = 'Something went wrong.',
  buttonText = 'Back',
  onButtonPress,
  showBackButton = true,
  buttonColor = 'red'
}: ErrorScreenProps) => {
  const navigation = useNavigation();

  const handleButtonPress = () => {
    if (onButtonPress) {
      onButtonPress();
    } else {
      navigation.goBack();
    }
  };

  const getButtonColorClass = () => {
    switch (buttonColor) {
      case 'red':
        return 'bg-red-500';
      case 'yellow':
        return 'bg-yellow-400';
      case 'blue':
        return 'bg-blue-500';
      case 'green':
        return 'bg-green-500';
      default:
        return 'bg-red-500';
    }
  };

  const getTitleColorClass = () => {
    switch (buttonColor) {
      case 'red':
        return 'text-red-400';
      case 'yellow':
        return 'text-yellow-400';
      case 'blue':
        return 'text-blue-400';
      case 'green':
        return 'text-green-400';
      default:
        return 'text-red-400';
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      {/* Header */}
      <View className="flex-row items-center p-6 border-b border-gray-800">
        {showBackButton && (
          <TouchableOpacity onPress={() => navigation.goBack()} className="mr-2">
            <ArrowLeft size={28} color="#FFD600" />
          </TouchableOpacity>
        )}
        <Text className={`font-bold text-2xl text-center flex-1 ${getTitleColorClass()}`}>
          {title}
        </Text>
        <View className="w-8" />
      </View>
      
      {/* Content */}
      <View className="flex-1 p-6 justify-center items-center">
        <Text className={`text-2xl font-bold mb-4 text-center ${getTitleColorClass()}`}>
          {message}
        </Text>
        <Text className="text-white text-lg mb-8 text-center">
          Please try again.
        </Text>
        <TouchableOpacity
          onPress={handleButtonPress}
          className={`${getButtonColorClass()} px-8 py-4 rounded-xl items-center`}
        >
          <Text className="text-white font-bold text-lg">{buttonText}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ErrorScreen; 
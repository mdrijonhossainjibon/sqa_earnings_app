import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft } from 'lucide-react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const QRCodeDetailsScreen = ({ route }) => {
  const navigation = useNavigation();
  // Expecting params: title, description, qrData, ip, os, hash, date, expre
  const { title, description, qrData, ip, os, hash, date, expre } = route.params || {};

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      {/* Header */}
      <View className="flex-row items-center p-6 border-b border-gray-800">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-2">
          <ArrowLeft size={28} color="#FFD600" />
        </TouchableOpacity>
        <Text className="font-bold text-2xl text-yellow-400 text-center flex-1">
          {title || 'QR Code Details'}
        </Text>
        <View className="w-8" />
      </View>
      <View className="flex-1 p-6">
        <Text className="text-gray-400 text-base mb-2 font-semibold">Description</Text>
        <Text className="text-white text-lg mb-6">
          {description || 'No description provided.'}
        </Text>
        <Text className="text-gray-400 text-base mb-2 font-semibold">QR Data</Text>
        <View className="bg-gray-800 rounded-xl p-4 mb-6">
          <Text className="text-yellow-400 text-center break-all">
            {qrData || 'No data.'}
          </Text>
        </View>
        <Text className="text-gray-400 text-base mb-2 font-semibold">IP Address</Text>
        <View className="bg-gray-800 rounded-xl p-4 mb-6">
          <Text className="text-yellow-400 text-center break-all">
            {ip || 'Unknown'}
          </Text>
        </View>
        <Text className="text-gray-400 text-base mb-2 font-semibold">Operating System</Text>
        <View className="bg-gray-800 rounded-xl p-4 mb-6">
          <Text className="text-yellow-400 text-center break-all">
            {os || 'Unknown'}
          </Text>
        </View>
        <Text className="text-gray-400 text-base mb-2 font-semibold">Hash</Text>
        <View className="bg-gray-800 rounded-xl p-4 mb-6">
          <Text className="text-yellow-400 text-center break-all">
            {hash || 'Unknown'}
          </Text>
        </View>
        <Text className="text-gray-400 text-base mb-2 font-semibold">Date</Text>
        <View className="bg-gray-800 rounded-xl p-4 mb-6">
          <Text className="text-yellow-400 text-center break-all">
            {date || 'Unknown'}
          </Text>
        </View>
        <Text className="text-gray-400 text-base mb-2 font-semibold">Expiry</Text>
        <View className="bg-gray-800 rounded-xl p-4 mb-6">
          <Text className="text-yellow-400 text-center break-all">
            {expre || 'Unknown'}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default QRCodeDetailsScreen; 
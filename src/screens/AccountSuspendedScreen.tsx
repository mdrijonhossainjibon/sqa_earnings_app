import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StatusBar, Linking } from 'react-native';
import { ArrowLeft, AlertTriangle, Mail, MessageCircle, FileText, LogOut, RefreshCw } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ActionSheet, { SheetManager } from 'react-native-actions-sheet';

export default function AccountSuspendedScreen({ navigation }: any) {
  const [isLoading, setIsLoading] = useState(false);

  const handleContactSupport = () => {
    // Open email app with support email
    Linking.openURL('mailto:support@sqa-earnings.com?subject=Account Suspension Appeal');
  };

  const handleLiveChat = () => {
    // Navigate to support screen or open live chat
    navigation.navigate('Support');
  };

  const handleAppeal = () => {
    // Navigate to appeal form or open appeal process
    SheetManager.show('appealForm');
  };

  const handleLogout = () => {
    // Clear user data and navigate to login
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  const handleRefresh = () => {
    setIsLoading(true);
    // Simulate checking account status
    setTimeout(() => {
      setIsLoading(false);
      // You can add logic here to check if account is still suspended
    }, 2000);
  };

  const AppealFormSheet = () => {
    const [reason, setReason] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmitAppeal = () => {
      if (!reason || !description) {
        SheetManager.show('appealError');
        return;
      }

      // Submit appeal logic here
      SheetManager.hide('appealForm');
      SheetManager.show('appealSuccess');
    };

    return (
      <View className="bg-gray-900 rounded-t-2xl p-6">
        <Text className="text-white text-lg font-bold mb-4 text-center">Submit Appeal</Text>
        
        <View className="mb-4">
          <Text className="text-gray-400 text-sm mb-2 font-semibold">Reason for Appeal</Text>
          <View className="bg-gray-800 rounded-xl p-4">
            <Text className="text-white text-base">
              {reason || 'Select a reason...'}
            </Text>
          </View>
        </View>

        <View className="mb-6">
          <Text className="text-gray-400 text-sm mb-2 font-semibold">Description</Text>
          <View className="bg-gray-800 rounded-xl p-4">
            <Text className="text-white text-base">
              {description || 'Please provide details about your appeal...'}
            </Text>
          </View>
        </View>

        <View className="flex-row space-x-3">
          <TouchableOpacity 
            className="flex-1 p-3 bg-gray-700 rounded-xl"
            onPress={() => SheetManager.hide('appealForm')}
          >
            <Text className="text-white font-semibold text-center">Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            className="flex-1 p-3 bg-yellow-400 rounded-xl"
            onPress={handleSubmitAppeal}
          >
            <Text className="text-gray-900 font-semibold text-center">Submit</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const AppealSuccessSheet = () => {
    return (
      <View className="bg-gray-900 rounded-t-2xl p-6 items-center">
        <View className="w-16 h-16 bg-green-500/20 rounded-full items-center justify-center mb-4">
          <FileText size={32} color="#10B981" />
        </View>
        <Text className="text-white text-lg font-bold mb-2 text-center">Appeal Submitted</Text>
        <Text className="text-gray-400 text-center mb-6">
          Your appeal has been submitted successfully. We'll review it within 24-48 hours.
        </Text>
        
        <TouchableOpacity 
          className="bg-yellow-400 px-8 py-3 rounded-xl w-full"
          onPress={() => SheetManager.hide('appealSuccess')}
        >
          <Text className="text-gray-900 font-bold text-center">OK</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const AppealErrorSheet = () => {
    return (
      <View className="bg-gray-900 rounded-t-2xl p-6 items-center">
        <View className="w-16 h-16 bg-red-500/20 rounded-full items-center justify-center mb-4">
          <AlertTriangle size={32} color="#EF4444" />
        </View>
        <Text className="text-white text-lg font-bold mb-2 text-center">Missing Information</Text>
        <Text className="text-gray-400 text-center mb-6">
          Please fill in all required fields before submitting your appeal.
        </Text>
        
        <TouchableOpacity 
          className="bg-gray-700 px-8 py-3 rounded-xl w-full"
          onPress={() => SheetManager.hide('appealError')}
        >
          <Text className="text-white font-bold text-center">Try Again</Text>
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
        <Text className="font-bold text-xl text-yellow-400 flex-1 text-center">Account Suspended</Text>
        <View className="w-8" />
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Main Content */}
        <View className="px-6 py-8">
          {/* Warning Icon */}
          <View className="items-center mb-6">
            <View className="w-24 h-24 bg-red-500/20 rounded-full items-center justify-center mb-4">
              <AlertTriangle size={48} color="#EF4444" />
            </View>
            <Text className="text-white text-2xl font-bold text-center mb-2">
              Account Suspended
            </Text>
            <Text className="text-gray-400 text-center text-base">
              Your account has been temporarily suspended due to a violation of our terms of service.
            </Text>
          </View>

          {/* Suspension Details */}
          <View className="bg-gray-800 rounded-xl p-6 mb-6">
            <Text className="text-white font-bold text-lg mb-4">Suspension Details</Text>
            
            <View className="space-y-3">
              <View className="flex-row items-center">
                <View className="w-2 h-2 bg-red-500 rounded-full mr-3" />
                <Text className="text-gray-300 flex-1">Reason: Violation of Terms of Service</Text>
              </View>
              <View className="flex-row items-center">
                <View className="w-2 h-2 bg-red-500 rounded-full mr-3" />
                <Text className="text-gray-300 flex-1">Suspended: {new Date().toLocaleDateString()}</Text>
              </View>
              <View className="flex-row items-center">
                <View className="w-2 h-2 bg-red-500 rounded-full mr-3" />
                <Text className="text-gray-300 flex-1">Duration: Pending Review</Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View className="space-y-4 mb-6">
            <TouchableOpacity
              className="bg-yellow-400 rounded-xl p-4 flex-row items-center"
              onPress={handleAppeal}
              activeOpacity={0.8}
            >
              <FileText size={24} color="#1F2937" className="mr-3" />
              <Text className="text-gray-900 font-bold text-lg flex-1">Submit Appeal</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-gray-800 rounded-xl p-4 flex-row items-center"
              onPress={handleContactSupport}
              activeOpacity={0.8}
            >
              <Mail size={24} color="#FFD600" className="mr-3" />
              <Text className="text-white font-semibold text-lg flex-1">Contact Support</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-gray-800 rounded-xl p-4 flex-row items-center"
              onPress={handleLiveChat}
              activeOpacity={0.8}
            >
              <MessageCircle size={24} color="#FFD600" className="mr-3" />
              <Text className="text-white font-semibold text-lg flex-1">Live Chat</Text>
            </TouchableOpacity>
          </View>

          {/* Secondary Actions */}
          <View className="flex-row space-x-3 mb-6">
            <TouchableOpacity
              className="flex-1 bg-gray-800 rounded-xl p-4 items-center"
              onPress={handleRefresh}
              activeOpacity={0.8}
              disabled={isLoading}
            >
              <RefreshCw size={20} color={isLoading ? "#6B7280" : "#FFD600"} className={isLoading ? "animate-spin" : ""} />
              <Text className={`text-sm font-semibold mt-1 ${isLoading ? 'text-gray-500' : 'text-yellow-400'}`}>
                {isLoading ? 'Checking...' : 'Check Status'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-1 bg-gray-800 rounded-xl p-4 items-center"
              onPress={handleLogout}
              activeOpacity={0.8}
            >
              <LogOut size={20} color="#EF4444" />
              <Text className="text-red-400 text-sm font-semibold mt-1">Logout</Text>
            </TouchableOpacity>
          </View>

          {/* Information Section */}
          <View className="bg-gray-800 rounded-xl p-6">
            <Text className="text-white font-bold text-lg mb-4">What You Need to Know</Text>
            
            <View className="space-y-3">
              <View className="flex-row">
                <Text className="text-yellow-400 mr-2">•</Text>
                <Text className="text-gray-300 flex-1">
                  You can submit an appeal if you believe this suspension was made in error
                </Text>
              </View>
              <View className="flex-row">
                <Text className="text-yellow-400 mr-2">•</Text>
                <Text className="text-gray-300 flex-1">
                  Appeals are typically reviewed within 24-48 hours
                </Text>
              </View>
              <View className="flex-row">
                <Text className="text-yellow-400 mr-2">•</Text>
                <Text className="text-gray-300 flex-1">
                  Contact support for immediate assistance or clarification
                </Text>
              </View>
              <View className="flex-row">
                <Text className="text-yellow-400 mr-2">•</Text>
                <Text className="text-gray-300 flex-1">
                  Your account balance and data are preserved during suspension
                </Text>
              </View>
            </View>
          </View>

          {/* Terms Reference */}
          <View className="mt-6 p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
            <Text className="text-yellow-400 text-sm text-center">
              For more information, please review our{' '}
              <Text 
                className="underline font-semibold"
                onPress={() => navigation.navigate('Privacy')}
              >
                Terms of Service
              </Text>
              {' '}and{' '}
              <Text 
                className="underline font-semibold"
                onPress={() => navigation.navigate('Privacy')}
              >
                Community Guidelines
              </Text>
            </Text>
          </View>

          {/* Spacer for bottom nav */}
          <View className="h-16" />
        </View>
      </ScrollView>

      {/* ActionSheets */}
      <ActionSheet id="appealForm">
        <AppealFormSheet />
      </ActionSheet>

      <ActionSheet id="appealSuccess">
        <AppealSuccessSheet />
      </ActionSheet>

      <ActionSheet id="appealError">
        <AppealErrorSheet />
      </ActionSheet>
    </SafeAreaView>
  );
} 
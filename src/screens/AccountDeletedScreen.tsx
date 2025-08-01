import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StatusBar, Linking, Alert, TextInput } from 'react-native';
import { Trash2, AlertTriangle, Mail, MessageCircle, ExternalLink, FileText, Clock, Shield, LogOut } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ActionSheet, { SheetManager } from 'react-native-actions-sheet';

export default function AccountDeletedScreen({ navigation }: any) {
  const [showDetails, setShowDetails] = useState(false);

  const deletionInfo = {
    date: new Date().toLocaleDateString(),
    time: new Date().toLocaleTimeString(),
    reason: 'Account deletion request by user',
    balance: '$0.00',
    dataRetention: '30 days',
    appealDeadline: '7 days'
  };

  const handleContactSupport = () => {
    Linking.openURL('mailto:support@sqa-earnings.com?subject=Account Deletion Inquiry');
  };

  const handleLiveChat = () => {
    navigation.navigate('Support');
  };

  const handleAppeal = () => {
    Alert.alert(
      'Appeal Account Deletion',
      'You can appeal the account deletion within 7 days. After this period, the deletion becomes permanent and irreversible.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Submit Appeal', 
          onPress: () => SheetManager.show('appealForm')
        }
      ]
    );
  };

  const handleVisitWebsite = () => {
    Linking.openURL('https://sqa-earnings.com/account-recovery');
  };

  const handleLogout = () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to logout? You will need to create a new account to use the app again.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: () => {
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          }
        }
      ]
    );
  };

  const AppealFormSheet = () => {
    const [reason, setReason] = useState('');
    const [description, setDescription] = useState('');
    const [email, setEmail] = useState('');

    const handleSubmitAppeal = () => {
      if (!reason || !description || !email) {
        Alert.alert('Error', 'Please fill in all required fields');
        return;
      }

      SheetManager.hide('appealForm');
      SheetManager.show('appealSubmitted');
    };

    return (
      <View className="bg-gray-900 rounded-t-2xl p-6">
        <Text className="text-white text-lg font-bold mb-4 text-center">Appeal Account Deletion</Text>
        
        <View className="mb-4">
          <Text className="text-gray-400 text-sm mb-2 font-semibold">Reason for Appeal *</Text>
          <View className="bg-gray-800 rounded-xl p-4">
            <TextInput
              className="text-white text-base"
              placeholder="Select a reason..."
              placeholderTextColor="#6B7280"
              value={reason}
              onChangeText={setReason}
            />
          </View>
        </View>

        <View className="mb-4">
          <Text className="text-gray-400 text-sm mb-2 font-semibold">Description *</Text>
          <View className="bg-gray-800 rounded-xl p-4">
            <TextInput
              className="text-white text-base"
              placeholder="Explain why your account should be restored..."
              placeholderTextColor="#6B7280"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              value={description}
              onChangeText={setDescription}
            />
          </View>
        </View>

        <View className="mb-6">
          <Text className="text-gray-400 text-sm mb-2 font-semibold">Contact Email *</Text>
          <View className="bg-gray-800 rounded-xl p-4">
            <TextInput
              className="text-white text-base"
              placeholder="Enter your email address"
              placeholderTextColor="#6B7280"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              value={email}
              onChangeText={setEmail}
            />
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

  const AppealSubmittedSheet = () => {
    return (
      <View className="bg-gray-900 rounded-t-2xl p-6 items-center">
        <View className="w-16 h-16 bg-green-500/20 rounded-full items-center justify-center mb-4">
          <FileText size={32} color="#10B981" />
        </View>
        <Text className="text-white text-lg font-bold mb-2 text-center">Appeal Submitted</Text>
        <Text className="text-gray-400 text-center mb-6">
          Your appeal has been submitted successfully. We'll review it within 24-48 hours and contact you via email.
        </Text>
        
        <TouchableOpacity 
          className="bg-yellow-400 px-8 py-3 rounded-xl w-full"
          onPress={() => SheetManager.hide('appealSubmitted')}
        >
          <Text className="text-gray-900 font-bold text-center">OK</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <StatusBar barStyle="light-content" backgroundColor="#111827" translucent={false} />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="items-center pt-8 pb-6">
          <View className="w-24 h-24 bg-red-500/20 rounded-full items-center justify-center mb-4">
            <Trash2 size={48} color="#EF4444" />
          </View>
          <Text className="text-white text-2xl font-bold text-center mb-2">
            Account Permanently Deleted
          </Text>
          <Text className="text-gray-400 text-center text-base px-6">
            Your account has been permanently deleted and cannot be recovered.
          </Text>
        </View>

        {/* Deletion Details */}
        <View className="mx-6 mb-6">
          <View className="bg-gray-800 rounded-xl p-6">
            <Text className="text-white font-bold text-lg mb-4">Deletion Details</Text>
            
            <View className="space-y-3">
              <View className="flex-row items-center justify-between">
                <Text className="text-gray-400">Deleted on:</Text>
                <Text className="text-white font-semibold">{deletionInfo.date} at {deletionInfo.time}</Text>
              </View>
              <View className="flex-row items-center justify-between">
                <Text className="text-gray-400">Reason:</Text>
                <Text className="text-white font-semibold">{deletionInfo.reason}</Text>
              </View>
              <View className="flex-row items-center justify-between">
                <Text className="text-gray-400">Final balance:</Text>
                <Text className="text-white font-semibold">{deletionInfo.balance}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* What This Means */}
        <View className="mx-6 mb-6">
          <View className="bg-gray-800 rounded-xl p-6">
            <Text className="text-white font-bold text-lg mb-4">What This Means</Text>
            
            <View className="space-y-4">
              <View className="flex-row">
                <Shield size={20} color="#EF4444" className="mr-3 mt-0.5" />
                <View className="flex-1">
                  <Text className="text-white font-semibold mb-1">Data Deletion</Text>
                  <Text className="text-gray-300 text-sm">
                    All your personal data, transaction history, and account information have been permanently removed from our systems.
                  </Text>
                </View>
              </View>

              <View className="flex-row">
                <Clock size={20} color="#EF4444" className="mr-3 mt-0.5" />
                <View className="flex-1">
                  <Text className="text-white font-semibold mb-1">No Recovery</Text>
                  <Text className="text-gray-300 text-sm">
                    This action is irreversible. Your account cannot be restored once the deletion process is complete.
                  </Text>
                </View>
              </View>

              <View className="flex-row">
                <AlertTriangle size={20} color="#EF4444" className="mr-3 mt-0.5" />
                <View className="flex-1">
                  <Text className="text-white font-semibold mb-1">Balance Forfeited</Text>
                  <Text className="text-gray-300 text-sm">
                    Any remaining balance in your account has been forfeited and cannot be recovered.
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Appeal Section */}
        <View className="mx-6 mb-6">
          <View className="bg-red-500/10 rounded-xl p-6 border border-red-500/20">
            <Text className="text-red-400 font-bold text-lg mb-3">⚠️ Important Notice</Text>
            <Text className="text-red-300 text-sm mb-4">
              You have {deletionInfo.appealDeadline} to appeal this deletion if you believe it was made in error. After this period, the deletion becomes permanent.
            </Text>
            
            <TouchableOpacity
              className="bg-red-500 rounded-xl p-3 items-center"
              onPress={handleAppeal}
              activeOpacity={0.8}
            >
              <Text className="text-white font-bold">Submit Appeal</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Action Buttons */}
        <View className="mx-6 mb-6 space-y-3">
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

          <TouchableOpacity
            className="bg-gray-800 rounded-xl p-4 flex-row items-center"
            onPress={handleVisitWebsite}
            activeOpacity={0.8}
          >
            <ExternalLink size={24} color="#FFD600" className="mr-3" />
            <Text className="text-white font-semibold text-lg flex-1">Visit Website</Text>
            <ExternalLink size={20} color="#FFD600" />
          </TouchableOpacity>
        </View>

        {/* Data Retention Info */}
        <View className="mx-6 mb-6">
          <View className="bg-gray-800 rounded-xl p-6">
            <Text className="text-white font-bold text-lg mb-4">Data Retention Policy</Text>
            
            <View className="space-y-3">
              <View className="flex-row">
                <Text className="text-yellow-400 mr-2">•</Text>
                <Text className="text-gray-300 flex-1">
                  Some data may be retained for {deletionInfo.dataRetention} for legal and regulatory purposes
                </Text>
              </View>
              <View className="flex-row">
                <Text className="text-yellow-400 mr-2">•</Text>
                <Text className="text-gray-300 flex-1">
                  This includes transaction records required for tax and compliance purposes
                </Text>
              </View>
              <View className="flex-row">
                <Text className="text-yellow-400 mr-2">•</Text>
                <Text className="text-gray-300 flex-1">
                  After this period, all data will be permanently deleted from our systems
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Next Steps */}
        <View className="mx-6 mb-6">
          <View className="bg-gray-800 rounded-xl p-6">
            <Text className="text-white font-bold text-lg mb-4">Next Steps</Text>
            
            <View className="space-y-3">
              <View className="flex-row">
                <Text className="text-yellow-400 mr-2">•</Text>
                <Text className="text-gray-300 flex-1">
                  If you want to use our services again, you'll need to create a new account
                </Text>
              </View>
              <View className="flex-row">
                <Text className="text-yellow-400 mr-2">•</Text>
                <Text className="text-gray-300 flex-1">
                  Consider appealing if you believe the deletion was made in error
                </Text>
              </View>
              <View className="flex-row">
                <Text className="text-yellow-400 mr-2">•</Text>
                <Text className="text-gray-300 flex-1">
                  Contact support if you have any questions about this process
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Alternative Actions */}
        <View className="mx-6 mb-6 space-y-3">
          <TouchableOpacity
            className="bg-gray-700 rounded-xl p-4 items-center"
            onPress={() => navigation.navigate('SignUp')}
            activeOpacity={0.8}
          >
            <Text className="text-white font-semibold">Create New Account</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-red-500/20 rounded-xl p-4 items-center border border-red-500/30"
            onPress={handleLogout}
            activeOpacity={0.8}
          >
            <View className="flex-row items-center">
              <LogOut size={20} color="#EF4444" className="mr-2" />
              <Text className="text-red-400 font-semibold">Logout</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Help Text */}
        <View className="mx-6 mb-6 p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
          <Text className="text-yellow-400 text-xs text-center">
            For questions about account deletion or data privacy, please review our{' '}
            <Text 
              className="underline font-semibold"
              onPress={() => navigation.navigate('Privacy')}
            >
              Privacy Policy
            </Text>
            {' '}and{' '}
            <Text 
              className="underline font-semibold"
              onPress={() => navigation.navigate('Privacy')}
            >
              Terms of Service
            </Text>
          </Text>
        </View>

        {/* Spacer for bottom nav */}
        <View className="h-16" />
      </ScrollView>

      {/* ActionSheets */}
      <ActionSheet id="appealForm">
        <AppealFormSheet />
      </ActionSheet>

      <ActionSheet id="appealSubmitted">
        <AppealSubmittedSheet />
      </ActionSheet>
    </SafeAreaView>
  );
} 
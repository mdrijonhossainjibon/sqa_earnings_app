import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StatusBar, TextInput, Alert, Platform } from 'react-native';
import { ArrowLeft, FileText, Upload, X, CheckCircle, AlertCircle, Loader, ChevronRight } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ActionSheet, { SheetManager } from 'react-native-actions-sheet';

export default function SubmitAppealScreen({ navigation }: any) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    reason: '',
    description: '',
    evidence: '',
    contactEmail: '',
    phoneNumber: '',
    additionalInfo: ''
  });
  const [attachments, setAttachments] = useState<string[]>([]);

  const appealReasons = [
    'Account was suspended by mistake',
    'I did not violate any terms',
    'The violation was unintentional',
    'I have corrected the issue',
    'Other (please explain)'
  ];

  const handleNextStep = () => {
    if (currentStep === 1 && !formData.reason) {
      Alert.alert('Error', 'Please select a reason for your appeal');
      return;
    }
    if (currentStep === 2 && !formData.description) {
      Alert.alert('Error', 'Please provide a description of your appeal');
      return;
    }
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmitAppeal = async () => {
    if (!formData.contactEmail) {
      Alert.alert('Error', 'Please provide your contact email');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      SheetManager.show('appealSuccess');
    }, 3000);
  };

  const handleAddAttachment = () => {
    // Simulate file picker
    const newAttachment = `evidence_${attachments.length + 1}.jpg`;
    setAttachments([...attachments, newAttachment]);
  };

  const handleRemoveAttachment = (index: number) => {
    const newAttachments = attachments.filter((_, i) => i !== index);
    setAttachments(newAttachments);
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const AppealSuccessSheet = () => {
    return (
      <View className="bg-gray-900 rounded-t-2xl p-6 items-center">
        <View className="w-16 h-16 bg-green-500/20 rounded-full items-center justify-center mb-4">
          <CheckCircle size={32} color="#10B981" />
        </View>
        <Text className="text-white text-lg font-bold mb-2 text-center">Appeal Submitted Successfully</Text>
        <Text className="text-gray-400 text-center mb-6">
          Your appeal has been submitted and will be reviewed within 24-48 hours. You'll receive an email confirmation shortly.
        </Text>
        
        <TouchableOpacity 
          className="bg-yellow-400 px-8 py-3 rounded-xl w-full"
          onPress={() => {
            SheetManager.hide('appealSuccess');
            navigation.goBack();
          }}
        >
          <Text className="text-gray-900 font-bold text-center">Done</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderStepIndicator = () => (
    <View className="flex-row items-center justify-center mb-6">
      {[1, 2, 3, 4].map((step) => (
        <React.Fragment key={step}>
          <View className={`w-8 h-8 rounded-full items-center justify-center ${
            step <= currentStep ? 'bg-yellow-400' : 'bg-gray-700'
          }`}>
            <Text className={`font-bold ${
              step <= currentStep ? 'text-gray-900' : 'text-gray-400'
            }`}>
              {step}
            </Text>
          </View>
          {step < 4 && (
            <View className={`w-12 h-1 mx-2 ${
              step < currentStep ? 'bg-yellow-400' : 'bg-gray-700'
            }`} />
          )}
        </React.Fragment>
      ))}
    </View>
  );

  const renderStep1 = () => (
    <View className="mb-6">
      <Text className="text-white font-bold text-lg mb-4">Select Appeal Reason</Text>
      <Text className="text-gray-400 text-sm mb-4">
        Please select the most appropriate reason for your appeal. This helps us process your case more efficiently.
      </Text>
      
      <View className="space-y-3">
        {appealReasons.map((reason, index) => (
          <TouchableOpacity
            key={index}
            className={`p-4 rounded-xl border-2 ${
              formData.reason === reason 
                ? 'border-yellow-400 bg-yellow-400/10' 
                : 'border-gray-700 bg-gray-800'
            }`}
            onPress={() => updateFormData('reason', reason)}
          >
            <Text className={`font-semibold ${
              formData.reason === reason ? 'text-yellow-400' : 'text-white'
            }`}>
              {reason}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View className="mb-6">
      <Text className="text-white font-bold text-lg mb-4">Describe Your Appeal</Text>
      <Text className="text-gray-400 text-sm mb-4">
        Please provide a detailed explanation of why you believe your account should be reinstated.
      </Text>
      
      <View className="mb-4">
        <Text className="text-gray-400 text-sm mb-2 font-semibold">Description *</Text>
        <View className="bg-gray-800 rounded-xl p-4">
          <TextInput
            className="text-white text-base"
            placeholder="Please explain your situation in detail..."
            placeholderTextColor="#6B7280"
            multiline
            numberOfLines={6}
            textAlignVertical="top"
            value={formData.description}
            onChangeText={(text) => updateFormData('description', text)}
          />
        </View>
      </View>

      <View className="mb-4">
        <Text className="text-gray-400 text-sm mb-2 font-semibold">Additional Information</Text>
        <View className="bg-gray-800 rounded-xl p-4">
          <TextInput
            className="text-white text-base"
            placeholder="Any additional context or information..."
            placeholderTextColor="#6B7280"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            value={formData.additionalInfo}
            onChangeText={(text) => updateFormData('additionalInfo', text)}
          />
        </View>
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View className="mb-6">
      <Text className="text-white font-bold text-lg mb-4">Add Evidence (Optional)</Text>
      <Text className="text-gray-400 text-sm mb-4">
        You can attach screenshots, documents, or other evidence that supports your appeal.
      </Text>
      
      {/* Attachments List */}
      {attachments.length > 0 && (
        <View className="mb-4">
          <Text className="text-gray-400 text-sm mb-2 font-semibold">Attached Files</Text>
          <View className="space-y-2">
            {attachments.map((file, index) => (
              <View key={index} className="flex-row items-center bg-gray-800 rounded-xl p-3">
                <FileText size={20} color="#FFD600" className="mr-3" />
                <Text className="text-white flex-1">{file}</Text>
                <TouchableOpacity onPress={() => handleRemoveAttachment(index)}>
                  <X size={20} color="#EF4444" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Add Attachment Button */}
      <TouchableOpacity
        className="border-2 border-dashed border-gray-600 rounded-xl p-6 items-center"
        onPress={handleAddAttachment}
      >
        <Upload size={32} color="#6B7280" className="mb-2" />
        <Text className="text-gray-400 font-semibold">Add Evidence</Text>
        <Text className="text-gray-500 text-sm text-center mt-1">
          Tap to upload screenshots, documents, or other files
        </Text>
      </TouchableOpacity>

      <View className="mt-4 p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
        <Text className="text-yellow-400 text-xs text-center">
          Supported formats: JPG, PNG, PDF, DOC. Max file size: 10MB per file.
        </Text>
      </View>
    </View>
  );

  const renderStep4 = () => (
    <View className="mb-6">
      <Text className="text-white font-bold text-lg mb-4">Contact Information</Text>
      <Text className="text-gray-400 text-sm mb-4">
        Please provide your contact information so we can reach you regarding your appeal.
      </Text>
      
      <View className="mb-4">
        <Text className="text-gray-400 text-sm mb-2 font-semibold">Email Address *</Text>
        <View className="bg-gray-800 rounded-xl p-4">
          <TextInput
            className="text-white text-base"
            placeholder="Enter your email address"
            placeholderTextColor="#6B7280"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            value={formData.contactEmail}
            onChangeText={(text) => updateFormData('contactEmail', text)}
          />
        </View>
      </View>

      <View className="mb-4">
        <Text className="text-gray-400 text-sm mb-2 font-semibold">Phone Number (Optional)</Text>
        <View className="bg-gray-800 rounded-xl p-4">
          <TextInput
            className="text-white text-base"
            placeholder="Enter your phone number"
            placeholderTextColor="#6B7280"
            keyboardType="phone-pad"
            value={formData.phoneNumber}
            onChangeText={(text) => updateFormData('phoneNumber', text)}
          />
        </View>
      </View>

      {/* Summary */}
      <View className="bg-gray-800 rounded-xl p-4 mb-4">
        <Text className="text-white font-bold text-lg mb-3">Appeal Summary</Text>
        <View className="space-y-2">
          <View className="flex-row">
            <Text className="text-gray-400 w-24">Reason:</Text>
            <Text className="text-white flex-1">{formData.reason}</Text>
          </View>
          <View className="flex-row">
            <Text className="text-gray-400 w-24">Files:</Text>
            <Text className="text-white flex-1">{attachments.length} attached</Text>
          </View>
          <View className="flex-row">
            <Text className="text-gray-400 w-24">Email:</Text>
            <Text className="text-white flex-1">{formData.contactEmail}</Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      case 4:
        return renderStep4();
      default:
        return null;
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
        <Text className="font-bold text-xl text-yellow-400 flex-1 text-center">Submit Appeal</Text>
        <View className="w-8" />
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-6 py-6">
          {/* Step Indicator */}
          {renderStepIndicator()}

          {/* Step Content */}
          {renderCurrentStep()}

          {/* Navigation Buttons */}
          <View className="flex-row space-x-3 mt-6">
            {currentStep > 1 && (
              <TouchableOpacity
                className="flex-1 bg-gray-700 rounded-xl p-4 items-center"
                onPress={handlePreviousStep}
                activeOpacity={0.8}
              >
                <Text className="text-white font-semibold">Previous</Text>
              </TouchableOpacity>
            )}

            {currentStep < 4 ? (
              <TouchableOpacity
                className="flex-1 bg-yellow-400 rounded-xl p-4 items-center flex-row justify-center"
                onPress={handleNextStep}
                activeOpacity={0.8}
              >
                <Text className="text-gray-900 font-semibold mr-2">Next</Text>
                <ChevronRight size={20} color="#1F2937" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                className={`flex-1 rounded-xl p-4 items-center flex-row justify-center ${
                  isLoading ? 'bg-gray-600' : 'bg-yellow-400'
                }`}
                onPress={handleSubmitAppeal}
                activeOpacity={0.8}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader size={20} color="#6B7280" className="animate-spin mr-2" />
                    <Text className="text-gray-400 font-semibold">Submitting...</Text>
                  </>
                ) : (
                  <>
                    <FileText size={20} color="#1F2937" className="mr-2" />
                    <Text className="text-gray-900 font-semibold">Submit Appeal</Text>
                  </>
                )}
              </TouchableOpacity>
            )}
          </View>

          {/* Progress Info */}
          <View className="mt-6 p-4 bg-gray-800 rounded-xl">
            <Text className="text-gray-400 text-sm text-center">
              Step {currentStep} of 4 • {Math.round((currentStep / 4) * 100)}% Complete
            </Text>
          </View>

          {/* Help Text */}
          <View className="mt-4 p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
            <Text className="text-yellow-400 text-xs text-center">
              Need help? Contact our support team for assistance with your appeal.
            </Text>
          </View>

          {/* Spacer for bottom nav */}
          <View className="h-16" />
        </View>
      </ScrollView>

      {/* ActionSheets */}
      <ActionSheet id="appealSuccess">
        <AppealSuccessSheet />
      </ActionSheet>
    </SafeAreaView>
  );
} 
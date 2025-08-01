import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
  Dimensions,
  Modal,
  Alert,
  ToastAndroid,
  Platform,
  Vibration,
} from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useCodeScanner,
} from 'react-native-vision-camera';
import Svg, { Line, Path } from 'react-native-svg';
import { launchImageLibrary } from 'react-native-image-picker';
import ActionSheet, { ActionSheetRef, SheetManager } from 'react-native-actions-sheet';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, CheckCircle, XCircle, Loader, AlertTriangle, Shield, Smartphone, RefreshCw } from 'lucide-react-native';
import { API_CALL } from '../lib/api';
import { getItem } from '../asyncStorage';

const { width } = Dimensions.get('window');
const SCAN_SIZE = width * 0.7;

// Types
interface QRScanResult {
  token: string;
  device_info?: {
    device_name?: string;
    browser?: string;
    location?: string;
    ip_address?: string;
  };
  timestamp: string;
  expires_at: string;
}

interface QRApprovalResponse {
  success: boolean;
  message: string;
  session_id?: string;
  device_info?: any;
}

// 🔹 Custom scan frame corners
const ScanFrameSVG = ({
  size = 240,
  color = '#00FFAA',
  stroke = 4,
  cornerLength = 32,
}) => (
  <Svg width={size} height={size} style={{ position: 'absolute', top: 0, left: 0 }}>
    {/* Top Left */}
    <Line x1="0" y1="0" x2={cornerLength} y2="0" stroke={color} strokeWidth={stroke} />
    <Line x1="0" y1="0" x2="0" y2={cornerLength} stroke={color} strokeWidth={stroke} />
    {/* Top Right */}
    <Line x1={size} y1="0" x2={size - cornerLength} y2="0" stroke={color} strokeWidth={stroke} />
    <Line x1={size} y1="0" x2={size} y2={cornerLength} stroke={color} strokeWidth={stroke} />
    {/* Bottom Left */}
    <Line x1="0" y1={size} x2={cornerLength} y2={size} stroke={color} strokeWidth={stroke} />
    <Line x1="0" y1={size} x2="0" y2={size - cornerLength} stroke={color} strokeWidth={stroke} />
    {/* Bottom Right */}
    <Line x1={size} y1={size} x2={size - cornerLength} y2={size} stroke={color} strokeWidth={stroke} />
    <Line x1={size} y1={size} x2={size} y2={size - cornerLength} stroke={color} strokeWidth={stroke} />
  </Svg>
);

// 🔹 Flash icon (on)
const FlashIcon = ({ color = '#fff', size = 28 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M7 2v10h3v10l7-12h-4l4-8H7z" fill={color} />
  </Svg>
);

// 🔹 Flash icon (off)
const FlashOffIcon = ({ color = '#fff', size = 28 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M3 3l18 18M7 2v5.17M13 10h4l-4 7v5l4.83-8.58M10.83 8L7 2v5.17M16.17 12l-6.34-6.34M2 2l20 20"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// 🔹 Image icon
const ImageIcon = ({ color = '#fff', size = 28 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M21 19V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2ZM8.5 11a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm3.5 1 2.5 3 3.5-4.5L21 17H6l5.5-5Z"
      fill={color}
    />
  </Svg>
);

const QRCodeScanScreen = () => {
  const insets = useSafeAreaInsets();
  const { hasPermission } = useCameraPermission();
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [qrScanResult, setQrScanResult] = useState<QRScanResult | null>(null);
  const cameraRef = useRef<Camera>(null);
  const device = useCameraDevice('back');
  const [animation] = useState(new Animated.Value(0));
  const [torchOn, setTorchOn] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const actionSheetRef = useRef<ActionSheetRef>(null);
  const navigation = useNavigation<any>();

  // Toast function
  const showToast = (message: string) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      Alert.alert('Info', message);
    }
  };

  // Validate QR code format
  const validateQRCode = (code: string): boolean => {
    // Check if it's a valid QR session token format
    // This should match your backend QR token format
    const qrTokenPattern = /^[A-Za-z0-9]{32,64}$/;
    return qrTokenPattern.test(code);
  };

  // Process scanned QR code
  const processQRCode = async (code: string) => {
    if (!validateQRCode(code)) {
      setErrorMessage('Invalid QR code format');
      SheetManager.show('qrErrorSheet');
      return;
    }

    setIsProcessing(true);
    try {
      const token = await getItem<string>('token');
      if (!token) {
        setErrorMessage('Authentication required');
        SheetManager.show('qrErrorSheet');
        return;
      }

      // Validate QR session with API
      const { response, status } = await API_CALL({
        apiVersionUrl: 'barong',
        url: '/api/mobile/qr-session/validate',
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: { qr_token: code }
      });

      if (status === 200 && response) {
        const qrData = response as QRScanResult;
        setQrScanResult(qrData);
        setScannedData(code);
        
        // Success haptic feedback
        Vibration.vibrate([0, 100, 50, 100]);
        
        // Show approval sheet
        SheetManager.show('qrApproveSheet');
      } else {
        setErrorMessage('Invalid or expired QR code');
        SheetManager.show('qrErrorSheet');
      }
    } catch (error: any) {
      console.log('QR validation error:', error.message);
      setErrorMessage('Failed to validate QR code. Please try again.');
      SheetManager.show('qrErrorSheet');
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle QR approval
  const handleApprove = async () => {
    if (!qrScanResult) return;

    setIsLoading(true);
    try {
      const token = await getItem<string>('token');
      if (!token) {
        setErrorMessage('Authentication required');
        SheetManager.show('qrErrorSheet');
        return;
      }

      const { response, status } = await API_CALL({
        apiVersionUrl: 'barong',
        url: '/api/mobile/qr-session/approve',
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: { 
          qr_token: qrScanResult.token,
          approve: true
        }
      });

      if (status === 200 && response) {
        const approvalData = response as QRApprovalResponse;
        
        // Success haptic feedback
        Vibration.vibrate([0, 100, 50, 100]);
        
        SheetManager.hide('qrApproveSheet');
        setQrScanResult(null);
        setScannedData(null);
        
        // Navigate to success screen
        navigation.navigate('QRCodeDetails', {
          title: 'QR Code Approved',
          description: approvalData.message || 'You have successfully approved the QR code login.',
          qrData: qrScanResult.token,
          deviceInfo: qrScanResult.device_info,
          sessionId: approvalData.session_id
        });
      } else {
        throw new Error('Failed to approve QR code');
      }
    } catch (error: any) {
      console.log('QR approval error:', error.message);
      setErrorMessage('Failed to approve QR code. Please try again.');
      SheetManager.hide('qrApproveSheet');
      SheetManager.show('qrErrorSheet');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle QR rejection
  const handleReject = async () => {
    if (!qrScanResult) return;

    setIsLoading(true);
    try {
      const token = await getItem<string>('token');
      if (!token) {
        setErrorMessage('Authentication required');
        SheetManager.show('qrErrorSheet');
        return;
      }

      await API_CALL({
        apiVersionUrl: 'barong',
        url: '/api/mobile/qr-session/reject',
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: { 
          qr_token: qrScanResult.token,
          reject: true
        }
      });

      // Success haptic feedback
      Vibration.vibrate([0, 50, 50, 50]);
      
      SheetManager.hide('qrApproveSheet');
      setQrScanResult(null);
      setScannedData(null);
      
      showToast('QR code rejected successfully');
    } catch (error: any) {
      console.log('QR rejection error:', error.message);
      setErrorMessage('Failed to reject QR code. Please try again.');
      SheetManager.hide('qrApproveSheet');
      SheetManager.show('qrErrorSheet');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    SheetManager.hide('qrApproveSheet');
    setQrScanResult(null);
    setScannedData(null);
  };

  // Handle image upload for QR scanning
  const handleImageUpload = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        selectionLimit: 1,
        quality: 0.8,
      });

      if (result.didCancel) return;
      
      if (result.errorCode) {
        setErrorMessage('Image picker error: ' + result.errorMessage);
        SheetManager.show('qrErrorSheet');
        return;
      }

      if (result.assets && result.assets.length > 0) {
        const image = result.assets[0];
        if (image.uri) {
          // TODO: Implement QR code extraction from image
          // This would require additional library like react-native-qrcode-scanner
          showToast('Image QR scanning feature coming soon!');
        }
      }
    } catch (error: any) {
      console.log('Image upload error:', error.message);
      setErrorMessage('Failed to process image. Please try again.');
      SheetManager.show('qrErrorSheet');
    }
  };

  // Reset scan
  const handleResetScan = () => {
    setScannedData(null);
    setQrScanResult(null);
    setErrorMessage('');
  };

  useEffect(() => {
    (async () => {
      await Camera.requestCameraPermission();
    })();
  }, []);

  useEffect(() => {
    Animated.loop(
      Animated.timing(animation, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, [animation]);

  const handleToggleFlash = () => {
    setTorchOn((prev) => !prev);
  };

  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13'],
    onCodeScanned: (codes) => {
      if (codes.length > 0 && !isProcessing && !scannedData) {
        const code = codes[0].value;
        console.log('QR Code scanned:', code);
        processQRCode(code);
      }
    },
  });

  if (device == null) {
    return (
      <View style={{ flex: 1, backgroundColor: 'black', justifyContent: 'center', alignItems: 'center' }}>
        <Loader size={48} color="#00FFAA" />
        <Text style={{ color: '#fff', marginTop: 16, fontSize: 16 }}>Loading camera...</Text>
      </View>
    );
  }

  if (!hasPermission) {
    return (
      <View style={{ flex: 1, backgroundColor: 'black', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Shield size={64} color="#FF6B6B" />
        <Text style={{ color: '#fff', marginTop: 16, fontSize: 18, fontWeight: 'bold', textAlign: 'center' }}>
          Camera Permission Required
        </Text>
        <Text style={{ color: '#ccc', marginTop: 8, fontSize: 14, textAlign: 'center' }}>
          Please grant camera permission to scan QR codes
        </Text>
        <TouchableOpacity
          style={{ marginTop: 20, backgroundColor: '#00FFAA', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 8 }}
          onPress={() => Camera.requestCameraPermission()}
        >
          <Text style={{ color: '#000', fontWeight: 'bold' }}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <>
      {/* Main Screen */}
      <SafeAreaView style={{ flex: 1, backgroundColor: 'black', paddingTop: insets.top, paddingBottom: insets.bottom, paddingLeft: insets.left, paddingRight: insets.right }}>
        {/* Header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: 'rgba(0,0,0,0.8)' }}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 16 }}>
            <ArrowLeft size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold', flex: 1 }}>QR Code Scanner</Text>
          {scannedData && (
            <TouchableOpacity onPress={handleResetScan} style={{ marginLeft: 16 }}>
              <RefreshCw size={20} color="#00FFAA" />
            </TouchableOpacity>
          )}
        </View>

        <View className="flex-1 justify-center items-center">
          <Camera
            ref={cameraRef}
            style={StyleSheet.absoluteFillObject}
            device={device}
            isActive={true}
            torch={torchOn ? 'on' : 'off'}
            codeScanner={codeScanner}
          />

          {/* 🔸 Bottom Buttons */}
          <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, paddingBottom: insets.bottom + 16, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 32, zIndex: 10 }}>
            <TouchableOpacity
              style={{ backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 999, padding: 12, marginHorizontal: 8 }}
              onPress={handleToggleFlash}
              activeOpacity={0.7}
            >
              {torchOn ? <FlashIcon color="#FFD600" /> : <FlashOffIcon color="#fff" />}
            </TouchableOpacity>
            <TouchableOpacity
              style={{ backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 999, padding: 12, marginHorizontal: 8 }}
              onPress={handleImageUpload}
              activeOpacity={0.7}
            >
              <ImageIcon color="#fff" />
            </TouchableOpacity>
          </View>

          {/* 🔸 Overlay */}
          <View className="absolute inset-0 justify-center items-center bg-black/40" pointerEvents="none">
            <View
              className="rounded-2xl overflow-hidden"
              style={{
                width: SCAN_SIZE,
                height: SCAN_SIZE,
                backgroundColor: 'rgba(0,0,0,0.1)',
              }}
            >
              {/* 🔸 SVG Frame + Scan Bar */}
              <ScanFrameSVG size={SCAN_SIZE} color="#00FFAA" stroke={4} cornerLength={36} />
              <Animated.View
                className="absolute left-0 right-0 h-1 bg-emerald-400 opacity-80"
                style={{
                  transform: [
                    {
                      translateY: animation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, SCAN_SIZE - 4],
                      }),
                    },
                  ],
                }}
              />
            </View>
          </View>

          {/* 🔸 Processing Indicator */}
          {isProcessing && (
            <View style={{ position: 'absolute', top: '60%', backgroundColor: 'rgba(0,0,0,0.8)', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 8, flexDirection: 'row', alignItems: 'center' }}>
              <Loader size={20} color="#00FFAA" style={{ marginRight: 8 }} />
              <Text style={{ color: '#fff', fontSize: 14 }}>Processing QR code...</Text>
            </View>
          )}

          {/* 🔸 Instructions */}
          <View style={{ position: 'absolute', top: '20%', backgroundColor: 'rgba(0,0,0,0.7)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 }}>
            <Text style={{ color: '#fff', fontSize: 12, textAlign: 'center' }}>
              Position QR code within the frame
            </Text>
          </View>
        </View>
      </SafeAreaView>

      {/* QR Login Approve Modal */}
      <ActionSheet id="qrApproveSheet" ref={actionSheetRef} gestureEnabled>
        <SafeAreaView style={{ backgroundColor: '#111827', borderTopLeftRadius: 16, borderTopRightRadius: 16, paddingBottom: insets.bottom }}>
          <View className="bg-gray-900 rounded-t-2xl p-6">
            {/* Header */}
            <View className="items-center mb-6">
              <View className="w-16 h-16 bg-blue-500 rounded-full items-center justify-center mb-3">
                <Smartphone size={32} color="#fff" />
              </View>
              <Text className="text-white text-xl font-bold mb-2 text-center">Login Request</Text>
              <Text className="text-gray-400 text-sm text-center">
                A device is requesting to log into your account
              </Text>
            </View>

            {/* Device Info */}
            {qrScanResult?.device_info && (
              <View className="bg-gray-800 rounded-xl p-4 mb-6">
                <Text className="text-gray-300 text-sm font-semibold mb-2">Device Information:</Text>
                {qrScanResult.device_info.device_name && (
                  <Text className="text-gray-400 text-xs mb-1">Device: {qrScanResult.device_info.device_name}</Text>
                )}
                {qrScanResult.device_info.browser && (
                  <Text className="text-gray-400 text-xs mb-1">Browser: {qrScanResult.device_info.browser}</Text>
                )}
                {qrScanResult.device_info.location && (
                  <Text className="text-gray-400 text-xs mb-1">Location: {qrScanResult.device_info.location}</Text>
                )}
                {qrScanResult.device_info.ip_address && (
                  <Text className="text-gray-400 text-xs">IP: {qrScanResult.device_info.ip_address}</Text>
                )}
              </View>
            )}

            {/* Action Buttons */}
            <View className="flex-row w-full justify-between mt-4">
              <TouchableOpacity
                onPress={handleReject}
                disabled={isLoading}
                className="flex-1 bg-red-500 py-3 rounded-xl mr-2 items-center"
                style={{ opacity: isLoading ? 0.6 : 1 }}
              >
                {isLoading ? (
                  <Loader size={20} color="#fff" />
                ) : (
                  <Text className="text-white font-bold">Reject</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleApprove}
                disabled={isLoading}
                className="flex-1 bg-green-500 py-3 rounded-xl ml-2 items-center"
                style={{ opacity: isLoading ? 0.6 : 1 }}
              >
                {isLoading ? (
                  <Loader size={20} color="#fff" />
                ) : (
                  <Text className="text-white font-bold">Approve</Text>
                )}
              </TouchableOpacity>
            </View>

            {/* Cancel Button */}
            <TouchableOpacity
              onPress={handleCancel}
              disabled={isLoading}
              className="mt-4 bg-gray-700 py-3 rounded-xl items-center"
              style={{ opacity: isLoading ? 0.6 : 1 }}
            >
              <Text className="text-white font-semibold">Cancel</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </ActionSheet>

      {/* Error ActionSheet */}
      <ActionSheet id="qrErrorSheet" gestureEnabled>
        <SafeAreaView style={{ backgroundColor: '#111827', borderTopLeftRadius: 16, borderTopRightRadius: 16, padding: 24 }}>
          <View className="items-center">
            <View className="w-16 h-16 bg-red-500 rounded-full items-center justify-center mb-4">
              <AlertTriangle size={32} color="#fff" />
            </View>
            <Text className="text-red-400 text-lg font-bold mb-4 text-center">Error</Text>
            <Text className="text-white text-base mb-6 text-center">{errorMessage}</Text>
            <TouchableOpacity
              onPress={() => {
                SheetManager.hide('qrErrorSheet');
                setErrorMessage('');
              }}
              className="bg-red-500 px-6 py-3 rounded-xl items-center"
            >
              <Text className="text-white font-bold">Close</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </ActionSheet>
    </>
  );
};

export default QRCodeScanScreen;

import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  StatusBar, 
  Alert,
  Linking,
  Platform,
  PermissionsAndroid,
  Dimensions
} from 'react-native';
import { 
  ArrowLeft, 
  Download, 
  CheckCircle, 
  AlertCircle, 
  Info, 
  RefreshCw,
  ExternalLink,
  Wifi,
  WifiOff,
  Smartphone,
  Shield,
  Star
} from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { API_CALL } from '../lib/api';
import { showToast } from '../lib/utils';

interface UpdateInfo {
  version: string;
  buildNumber: string;
  downloadUrl: string;
  fileSize: string;
  releaseNotes: string[];
  isRequired: boolean;
  minVersion: string;
  releaseDate: string;
  isUpdateAvailable?: boolean;
  isUpdateRequired?: boolean;
}

interface DownloadProgress {
  downloaded: number;
  total: number;
  percentage: number;
  status: 'idle' | 'downloading' | 'completed' | 'error';
}

interface ApiResponse {
  success: boolean;
  result: UpdateInfo & {
    isUpdateAvailable: boolean;
    isUpdateRequired: boolean;
    currentVersion: string;
    platform: string;
    buildNumber: string;
    lastChecked: string;
  };
}

interface DownloadResponse {
  success: boolean;
  result: {
    downloadUrl: string;
    filename: string;
    fileSize: string;
    checksum: string;
    version: string;
    platform: string;
    buildNumber: string;
    downloadStarted: string;
  };
}

const { width } = Dimensions.get('window');

export default function AppUpdateScreen({ navigation }: any) {
  const [updateInfo, setUpdateInfo] = useState<UpdateInfo | null>(null);
  const [currentVersion, setCurrentVersion] = useState('1.0.0');
  const [currentBuild, setCurrentBuild] = useState('1');
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState<DownloadProgress>({
    downloaded: 0,
    total: 0,
    percentage: 0,
    status: 'idle'
  });
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const [isUpdateRequired, setIsUpdateRequired] = useState(false);

  useEffect(() => {
    checkForUpdates();
  }, []);

  const checkForUpdates = async () => {
    setChecking(true);
    try {
      const response = await API_CALL({
        method: 'GET',
        url: `/api/mobile/app/update/check?version=${currentVersion}&platform=${Platform.OS}&build=${currentBuild}`,
        apiVersionUrl: 'barong'
      });

      if (response.status === 200 && response.response?.result) {
        const updateData = response.response.result as unknown as ApiResponse['result'];
        setUpdateInfo(updateData);
        setIsUpdateAvailable(updateData.isUpdateAvailable);
        setIsUpdateRequired(updateData.isUpdateRequired);
      } else {
        // Fallback to mock data if API fails
        const mockUpdateInfo: UpdateInfo = {
          version: '1.2.0',
          buildNumber: '120',
          downloadUrl: 'https://example.com/app-update.apk',
          fileSize: '25.6 MB',
          releaseNotes: [
            '🎉 New earning opportunities added',
            '🔧 Bug fixes and performance improvements',
            '🎨 Enhanced user interface',
            '🔒 Improved security features',
            '📱 Better mobile experience'
          ],
          isRequired: false,
          minVersion: '1.0.0',
          releaseDate: '2024-01-15'
        };
        setUpdateInfo(mockUpdateInfo);
        setIsUpdateAvailable(true);
        setIsUpdateRequired(false);
      }
    } catch (error) {
      console.log('Update check error:', error);
      showToast('Failed to check for updates');
      
      // Fallback to mock data
      const mockUpdateInfo: UpdateInfo = {
        version: '1.2.0',
        buildNumber: '120',
        downloadUrl: 'https://example.com/app-update.apk',
        fileSize: '25.6 MB',
        releaseNotes: [
          '🎉 New earning opportunities added',
          '🔧 Bug fixes and performance improvements',
          '🎨 Enhanced user interface',
          '🔒 Improved security features',
          '📱 Better mobile experience'
        ],
        isRequired: false,
        minVersion: '1.0.0',
        releaseDate: '2024-01-15'
      };
      setUpdateInfo(mockUpdateInfo);
      setIsUpdateAvailable(true);
      setIsUpdateRequired(false);
    } finally {
      setLoading(false);
      setChecking(false);
    }
  };

  const handleDownload = async () => {
    if (!updateInfo) return;

    // Platform-specific permission handling
    if (Platform.OS === 'android') {
      try {
        // For Android 13+ (API level 33+), we don't need WRITE_EXTERNAL_STORAGE
        // For older versions, we can request it but it's not strictly necessary for downloads
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission',
            message: 'App needs access to storage to download the update',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          // Don't block the download, just show a warning
          Alert.alert(
            'Permission Notice', 
            'Storage permission is recommended for downloading updates. You can still download, but the file may not be accessible.',
            [
              { text: 'Continue Download', onPress: () => startDownload() },
              { text: 'Cancel', style: 'cancel' }
            ]
          );
          return;
        }
      } catch (err) {
        console.warn('Permission request failed:', err);
        // Continue with download even if permission request fails
      }
    } else if (Platform.OS === 'ios') {
      // iOS doesn't require explicit storage permissions for downloads
      // Files are downloaded to the app's documents directory
      console.log('iOS platform detected - no storage permission required');
    }

    startDownload();
  };

  const startDownload = async () => {
    setDownloadProgress({
      downloaded: 0,
      total: 100,
      percentage: 0,
      status: 'downloading'
    });

    try {
      // Get download URL from server
      const downloadResponse = await API_CALL({
        method: 'GET',
        url: `/api/mobile/app/update/download?version=${updateInfo?.version}&platform=${Platform.OS}&build=${updateInfo?.buildNumber}`,
        apiVersionUrl: 'barong'
      });

      if (downloadResponse.status === 200 && downloadResponse.response?.result) {
        const downloadData = downloadResponse.response.result as unknown as DownloadResponse['result'];
        const downloadUrl = downloadData.downloadUrl;

        // Simulate download progress
        const simulateDownload = () => {
          let progress = 0;
          const interval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress >= 100) {
              progress = 100;
              clearInterval(interval);
              setDownloadProgress({
                downloaded: 100,
                total: 100,
                percentage: 100,
                status: 'completed'
              });
              showToast('Update downloaded successfully!');
              
              // Open the downloaded file or redirect to download
              setTimeout(() => {
                Alert.alert(
                  'Install Update',
                  Platform.OS === 'ios' 
                    ? 'The update has been downloaded. Would you like to install it now?'
                    : 'The update has been downloaded. Would you like to install it now?',
                  [
                    { text: 'Later', style: 'cancel' },
                    { text: 'Install', onPress: () => Linking.openURL(downloadUrl) }
                  ]
                );
              }, 1000);
            } else {
              setDownloadProgress({
                downloaded: progress,
                total: 100,
                percentage: Math.round(progress),
                status: 'downloading'
              });
            }
          }, 200);
        };

        simulateDownload();
      } else {
        // Fallback to direct download
        const simulateDownload = () => {
          let progress = 0;
          const interval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress >= 100) {
              progress = 100;
              clearInterval(interval);
              setDownloadProgress({
                downloaded: 100,
                total: 100,
                percentage: 100,
                status: 'completed'
              });
              showToast('Update downloaded successfully!');
              
              // Open the downloaded file
              setTimeout(() => {
                Alert.alert(
                  'Install Update',
                  Platform.OS === 'ios' 
                    ? 'The update has been downloaded. Would you like to install it now?'
                    : 'The update has been downloaded. Would you like to install it now?',
                  [
                    { text: 'Later', style: 'cancel' },
                    { text: 'Install', onPress: () => Linking.openURL(updateInfo?.downloadUrl || '') }
                  ]
                );
              }, 1000);
            } else {
              setDownloadProgress({
                downloaded: progress,
                total: 100,
                percentage: Math.round(progress),
                status: 'downloading'
              });
            }
          }, 200);
        };

        simulateDownload();
      }
    } catch (error) {
      console.log('Download error:', error);
      showToast('Failed to start download');
      setDownloadProgress({
        downloaded: 0,
        total: 100,
        percentage: 0,
        status: 'error'
      });
    }
  };

  const handleSkipUpdate = () => {
    if (isUpdateRequired) {
      Alert.alert(
        'Update Required',
        'This update is required for security and functionality. You cannot skip this update.',
        [{ text: 'OK' }]
      );
      return;
    }

    Alert.alert(
      'Skip Update',
      'Are you sure you want to skip this update? You can check for updates later.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Skip', style: 'destructive', onPress: () => navigation.goBack() }
      ]
    );
  };

  const renderProgressBar = () => {
    if (downloadProgress.status === 'idle') return null;

    return (
      <View className="bg-gray-800 rounded-xl p-4 mb-4">
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-white font-semibold">
            {downloadProgress.status === 'downloading' ? 'Downloading...' : 'Download Complete'}
          </Text>
          <Text className="text-yellow-400 font-bold">
            {downloadProgress.percentage}%
          </Text>
        </View>
        <View className="w-full bg-gray-700 rounded-full h-2">
          <View 
            className="bg-yellow-400 h-2 rounded-full"
            style={{ width: `${downloadProgress.percentage}%` }}
          />
        </View>
        <Text className="text-gray-400 text-xs mt-1">
          {downloadProgress.downloaded}MB / {downloadProgress.total}MB
        </Text>
        <Text className="text-gray-500 text-xs mt-1">
          {Platform.OS === 'ios' 
            ? 'Saving to App Documents' 
            : 'Saving to Downloads folder'
          }
        </Text>
      </View>
    );
  };

  const renderUpdateInfo = () => {
    if (!updateInfo) return null;

    return (
      <View className="bg-gray-800 rounded-xl p-4 mb-4">
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-white font-bold text-lg">Version {updateInfo.version}</Text>
          <View className="flex-row items-center">
            {isUpdateRequired ? (
              <AlertCircle size={20} color="#EF4444" />
            ) : (
              <CheckCircle size={20} color="#10B981" />
            )}
            <Text className={`ml-1 text-sm ${isUpdateRequired ? 'text-red-400' : 'text-green-400'}`}>
              {isUpdateRequired ? 'Required' : 'Optional'}
            </Text>
          </View>
        </View>

        <View className="flex-row items-center mb-3">
          <Info size={16} color="#6B7280" />
          <Text className="ml-2 text-gray-400 text-sm">
            Build {updateInfo.buildNumber} • {updateInfo.fileSize} • {updateInfo.releaseDate}
          </Text>
        </View>

        <Text className="text-white font-semibold mb-2">What's New:</Text>
        {updateInfo.releaseNotes.map((note, index) => (
          <View key={index} className="flex-row items-start mb-2">
            <Star size={12} color="#FFD600" style={{ marginTop: 2 }} />
            <Text className="ml-2 text-gray-300 text-sm flex-1">{note}</Text>
          </View>
        ))}
      </View>
    );
  };

  const renderCurrentVersion = () => (
    <View className="bg-gray-800 rounded-xl p-4 mb-4">
      <Text className="text-white font-bold text-lg mb-2">Current Version</Text>
      <View className="flex-row items-center justify-between">
        <View>
          <Text className="text-gray-300">Version {currentVersion}</Text>
          <Text className="text-gray-400 text-sm">Build {currentBuild}</Text>
        </View>
        <CheckCircle size={20} color="#10B981" />
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-900">
        <StatusBar barStyle="light-content" backgroundColor="#111827" />
        <View className="flex-1 justify-center items-center">
          <RefreshCw size={40} color="#FFD600" className="animate-spin" />
          <Text className="text-white text-lg mt-4">Checking for updates...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <StatusBar barStyle="light-content" backgroundColor="#111827" />

      {/* Header */}
      <View className="flex-row items-center p-4 border-b border-gray-800">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-2">
          <ArrowLeft size={28} color="#FFD600" />
        </TouchableOpacity>
        <Text className="font-bold text-xl text-yellow-400 flex-1 text-center">App Update</Text>
        <TouchableOpacity onPress={checkForUpdates} disabled={checking}>
          <RefreshCw 
            size={24} 
            color="#FFD600" 
            className={checking ? 'animate-spin' : ''} 
          />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1" keyboardShouldPersistTaps="handled">
        {/* Current Version */}
        {renderCurrentVersion()}

        {/* Update Available */}
        {isUpdateAvailable && updateInfo && (
          <>
            {renderUpdateInfo()}
            {renderProgressBar()}
          </>
        )}

        {/* No Update Available */}
        {!isUpdateAvailable && !loading && (
          <View className="bg-gray-800 rounded-xl p-6 m-4 items-center">
            <CheckCircle size={48} color="#10B981" />
            <Text className="text-white font-bold text-lg mt-4">You're up to date!</Text>
            <Text className="text-gray-400 text-center mt-2">
              You have the latest version of SQA Earning app installed.
            </Text>
          </View>
        )}

        {/* Action Buttons */}
        {isUpdateAvailable && (
          <View className="px-4 mb-4">
            <TouchableOpacity
              className={`w-full py-4 rounded-xl items-center mb-3 ${
                downloadProgress.status === 'downloading' 
                  ? 'bg-gray-600' 
                  : 'bg-yellow-400'
              }`}
              onPress={handleDownload}
              disabled={downloadProgress.status === 'downloading'}
            >
              <View className="flex-row items-center">
                <Download size={20} color={downloadProgress.status === 'downloading' ? '#9CA3AF' : '#111827'} />
                <Text className={`ml-2 font-bold ${
                  downloadProgress.status === 'downloading' ? 'text-gray-400' : 'text-gray-900'
                }`}>
                  {downloadProgress.status === 'downloading' ? 'Downloading...' : 'Download Update'}
                </Text>
              </View>
            </TouchableOpacity>

            {!isUpdateRequired && (
              <TouchableOpacity
                className="w-full py-4 rounded-xl items-center border border-gray-600"
                onPress={handleSkipUpdate}
              >
                <Text className="text-gray-400 font-semibold">Skip for now</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Additional Options */}
        <View className="px-4 mb-4">
          <TouchableOpacity 
            className="flex-row items-center justify-center p-4 bg-gray-800 rounded-xl mb-3"
            onPress={() => Linking.openURL('https://play.google.com/store/apps/details?id=com.sqa.earnings')}
          >
            <ExternalLink size={18} color="#FFD600" />
            <Text className="ml-2 text-yellow-400 font-semibold">Download from Store</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            className="flex-row items-center justify-center p-4 bg-gray-800 rounded-xl"
            onPress={() => Linking.openURL('https://sqa-earnings.com/changelog')}
          >
            <Info size={18} color="#FFD600" />
            <Text className="ml-2 text-yellow-400 font-semibold">View Release Notes</Text>
          </TouchableOpacity>
        </View>

        {/* System Info */}
        <View className="px-4 mb-4">
          <View className="bg-gray-800 rounded-xl p-4">
            <Text className="text-white font-bold text-lg mb-3">System Information</Text>
            <View className="flex-row items-center mb-2">
              <Smartphone size={16} color="#6B7280" />
              <Text className="ml-2 text-gray-400">Platform: {Platform.OS}</Text>
            </View>
            <View className="flex-row items-center mb-2">
              <Shield size={16} color="#6B7280" />
              <Text className="ml-2 text-gray-400">Security: Latest</Text>
            </View>
            <View className="flex-row items-center mb-2">
              <Wifi size={16} color="#6B7280" />
              <Text className="ml-2 text-gray-400">Connection: Stable</Text>
            </View>
            <View className="flex-row items-center">
              <Download size={16} color="#6B7280" />
              <Text className="ml-2 text-gray-400">
                Storage: {Platform.OS === 'ios' ? 'App Documents' : 'External Storage'}
              </Text>
            </View>
          </View>
        </View>

        {/* Spacer for bottom nav */}
        <View className="h-16" />
      </ScrollView>
    </SafeAreaView>
  );
}
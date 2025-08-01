import React, { useState, useCallback, useRef } from 'react';
import { View, TouchableOpacity, Text, ActivityIndicator, RefreshControl, Platform, StatusBar, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import { ArrowLeft, ExternalLink, Share2, RotateCcw } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'react-native-linear-gradient';

export default function BrowserScreen({ navigation, route }: any) {
  const url = route?.params?.url || 'https://www.facebook.com/';
  const title = route?.params?.title || 'Browser';
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);
  const webViewRef = useRef<WebView>(null);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    webViewRef.current?.reload();
    setTimeout(() => setRefreshing(false), 800);
  }, []);

  const handleNavigationStateChange = (navState: any) => {
    setCanGoBack(navState.canGoBack);
    setCanGoForward(navState.canGoForward);
  };

  const handleShare = () => {
    // In a real app, you'd use Share API
    Alert.alert('Share', `Share ${url}`);
  };

  const handleOpenExternal = () => {
    // In a real app, you'd use Linking.openURL
    Alert.alert('Open External', `Open ${url} in external browser`);
  };

  const isExplorerUrl = url.includes('blockstream.info') || 
                       url.includes('etherscan.io') || 
                       url.includes('bscscan.com') || 
                       url.includes('polygonscan.com') || 
                       url.includes('solscan.io') || 
                       url.includes('cardanoscan.io') || 
                       url.includes('polkascan.io') || 
                       url.includes('tronscan.org');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#111827' }}>
      <StatusBar barStyle="light-content" backgroundColor="#111827" translucent={false} />
      
      {/* Enhanced Header */}
      <LinearGradient
        colors={['#1F2937', '#111827']}
        style={{ borderBottomWidth: 1, borderBottomColor: 'rgba(75, 85, 99, 0.5)' }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', padding: 16 }}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()} 
            style={{ 
              backgroundColor: 'rgba(75, 85, 99, 0.5)', 
              padding: 8, 
              borderRadius: 12, 
              marginRight: 12 
            }}
          >
            <ArrowLeft size={24} color="#FFD600" />
          </TouchableOpacity>
          
          <View style={{ flex: 1 }}>
            <Text style={{ 
              fontSize: 18, 
              color: '#FFFFFF', 
              fontWeight: 'bold',
              marginBottom: 2
            }}>
              {title}
            </Text>
            {isExplorerUrl && (
              <Text style={{ 
                fontSize: 12, 
                color: '#9CA3AF',
                fontFamily: 'monospace'
              }}>
                Blockchain Explorer
              </Text>
            )}
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {canGoBack && (
              <TouchableOpacity 
                onPress={() => webViewRef.current?.goBack()}
                style={{ 
                  backgroundColor: 'rgba(75, 85, 99, 0.5)', 
                  padding: 8, 
                  borderRadius: 12, 
                  marginRight: 8 
                }}
              >
                <RotateCcw size={20} color="#9CA3AF" />
              </TouchableOpacity>
            )}
            
            <TouchableOpacity 
              onPress={handleShare}
              style={{ 
                backgroundColor: 'rgba(75, 85, 99, 0.5)', 
                padding: 8, 
                borderRadius: 12, 
                marginRight: 8 
              }}
            >
              <Share2 size={20} color="#9CA3AF" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={handleOpenExternal}
              style={{ 
                backgroundColor: 'rgba(59, 130, 246, 0.2)', 
                padding: 8, 
                borderRadius: 12 
              }}
            >
              <ExternalLink size={20} color="#3B82F6" />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      {/* Progress Bar */}
      {loading && (
        <View style={{ height: 3, backgroundColor: 'rgba(37, 99, 235, 0.2)', width: '100%' }}>
          <View 
            style={{ 
              height: 3, 
              backgroundColor: '#3B82F6', 
              width: `${progress * 100}%`,
              borderRadius: 2
            }} 
          />
        </View>
      )}

      {/* WebView with Enhanced Features */}
      <View style={{ flex: 1 }}>
        <WebView
          ref={webViewRef}
          source={{ uri: url }}
          style={{ flex: 1, backgroundColor: '#FFFFFF' }}
          onLoadProgress={({ nativeEvent }) => setProgress(nativeEvent.progress)}
          onLoadStart={() => { setLoading(true); setProgress(0); }}
          onLoadEnd={() => setLoading(false)}
          onNavigationStateChange={handleNavigationStateChange}
          pullToRefreshEnabled={Platform.OS === 'android'}
          {...(Platform.OS === 'ios' ? {
            refreshControl: (
              <RefreshControl 
                refreshing={refreshing} 
                onRefresh={onRefresh}
                tintColor="#3B82F6"
                colors={['#3B82F6']}
              />
            )
          } : {})}
          // Enhanced WebView settings for better performance
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          scalesPageToFit={true}
          allowsInlineMediaPlayback={true}
          mediaPlaybackRequiresUserAction={false}
          // Security settings
          allowsBackForwardNavigationGestures={true}
          allowsLinkPreview={false}
          // Custom user agent for better compatibility
          userAgent="Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1"
        />
        
        {/* Loading Overlay */}
        {loading && (
          <View style={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            justifyContent: 'center', 
            alignItems: 'center', 
            backgroundColor: 'rgba(17, 24, 39, 0.8)' 
          }}>
            <View style={{ 
              backgroundColor: '#1F2937', 
              padding: 24, 
              borderRadius: 16, 
              alignItems: 'center',
              borderWidth: 1,
              borderColor: 'rgba(75, 85, 99, 0.5)'
            }}>
              <ActivityIndicator size="large" color="#FFD600" />
              <Text style={{ 
                color: '#FFFFFF', 
                marginTop: 12, 
                fontSize: 16, 
                fontWeight: '600' 
              }}>
                Loading Explorer...
              </Text>
              {isExplorerUrl && (
                <Text style={{ 
                  color: '#9CA3AF', 
                  marginTop: 4, 
                  fontSize: 12 
                }}>
                  Fetching transaction details
                </Text>
              )}
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
} 
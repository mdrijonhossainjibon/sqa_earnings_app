import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, Alert, ToastAndroid, Platform } from 'react-native';
import { CheckSquare, BadgeDollarSign, UserPlus, Clock, Monitor, FileText, Mail, Grid, ChevronDown, ChevronUp, LogOut, Users, ListChecks, Search, ExternalLink, Loader, RefreshCw, Download } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { API_CALL } from '../lib/api';
import { getItem, removeItem } from '../asyncStorage';

// Types
interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  referral_code?: string;
  balance?: number;
  total_earned?: number;
  member_since?: string;
  level?: string;
  is_verified?: boolean;
}

interface MenuItem {
  label: string;
  icon: React.ReactElement;
  key: string;
  screen: string;
  badge?: number;
  isNew?: boolean;
  isPremium?: boolean;
  children?: MenuItem[];
}

const menuData: MenuItem[] = [
  {
    label: 'Task',
    icon: <CheckSquare size={20} color={'white'} />,
    key: 'task',
    screen: 'Task',
  },
  {
    label: 'Spin',
    icon: <CheckSquare size={20} color={'white'} />,
    key: 'Spin',
    screen: 'SpinAndEarn',
  },
  {
    label: 'Invite Friend',
    icon: <UserPlus size={20} color={'white'}/>,
    key: 'invite',
    screen: 'ReferFriend',
    isNew: true,
  },
  {
    label: 'History',
    icon: <Clock size={20} color={'white'}/>,
    key: 'history',
    screen: 'History',
  },
  {
    label: 'Watch Videos',
    icon: <Monitor size={20} color={'white'}/>,
    key: 'videos',
    screen: 'Videos',
  },
  {
    label: 'Read & Earn',
    icon: <FileText size={20} color={'white'}/>,
    key: 'read',
    screen: 'reading',
  },
  {
    label: 'Surveys',
    icon: <Search size={20} color={'white'}/>,
    key: 'surveys',
    screen: 'Surveys',
  },
  {
    label: 'Links & Offers',
    icon: <ExternalLink size={20} color={'white'}/>,
    key: 'links',
    screen: 'Links',
  },
  {
    label: 'Rewards',
    icon: <ListChecks size={20} color={'white'}/>,
    key: 'rewards',
    screen: 'Reward',
  },
  
 
  
  {
    label: 'Notifications',
    icon: <Mail size={20} color={'white'}/>,
    key: 'notifications',
    screen: 'Notifications',
  },
  {
    label: 'Support',
    icon: <Users size={20} color={'#60A5FA'}/>,
    key: 'support',
    screen: 'Support',
  },
  {
    label: 'Privacy',
    icon: <FileText size={20} color={'#FBBF24'}/>,
    key: 'privacy',
    screen: 'Privacy',
  },
  {
    label: 'Leaderboard',
    icon: <ListChecks size={20} color={'white'}/>,
    key: 'leaderboard',
    screen: 'Leaderboard',
  },
  {
    label: 'Coupons',
    icon: <BadgeDollarSign size={20} color={'#F59E42'}/>,
    key: 'coupons',
    screen: 'CouponClaim',
  },
  {
    label: 'FAQ',
    icon: <FileText size={20} color={'#6EE7B7'}/>,
    key: 'faq',
    screen: 'FAQ',
  },
  {
    label: 'About',
    icon: <Grid size={20} color={'#F472B6'}/>,
    key: 'about',
    screen: 'About',
  },
  {
    label: 'App Update',
    icon: <Download size={20} color={'white'}/>,
    key: 'app_update',
    screen: 'AppUpdate',
  }
];

export default function SidebarMenu() {
  const [openGroup, setOpenGroup] = useState(null);
  const [activeKey, setActiveKey] = useState('task');
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(menuData);
  const navigation = useNavigation();

  // Toast function
  const showToast = (message: string) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      Alert.alert('Info', message);
    }
  };

  // Fetch user data from API
  const fetchUserData = async () => {
    try {
      const token = await getItem<string>('token');
      if (!token) {
        showToast('Authentication required');
        return;
      }

      const { response, status } = await API_CALL({
        apiVersionUrl: 'barong',
        url: '/api/mobile/user/profile',
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (status === 200 && response) {
        const userData = response as User;
        setUser({
          id: userData.id,
          name: userData.name || 'User',
          email: userData.email,
          avatar: userData.avatar || 'https://randomuser.me/api/portraits/men/32.jpg',
          referral_code: userData.referral_code || 'ABC123',
          balance: userData.balance || 0,
          total_earned: userData.total_earned || 0,
          member_since: userData.member_since,
          level: userData.level || 'Bronze',
          is_verified: userData.is_verified || false
        });
      } else {
        // Fallback to default user data
        setUser({
          id: '1',
          name: 'User',
          email: 'user@example.com',
          avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
          referral_code: 'ABC123',
          balance: 0,
          total_earned: 0,
          level: 'Bronze',
          is_verified: false
        });
      }
    } catch (error: any) {
      console.log('Failed to fetch user data:', error.message);
      // Fallback to default user data
      setUser({
        id: '1',
        name: 'User',
        email: 'user@example.com',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
        referral_code: 'ABC123',
        balance: 0,
        total_earned: 0,
        level: 'Bronze',
        is_verified: false
      });
    }
  };

  // Fetch menu badges/notifications
  const fetchMenuBadges = async () => {
    try {
      const token = await getItem<string>('token');
      if (!token) return;

      const { response, status } = await API_CALL({
        apiVersionUrl: 'barong',
        url: '/api/mobile/notifications/badges',
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (status === 200 && response) {
        const badges = response as any;
        const updatedMenuItems = menuData.map(item => ({
          ...item,
          badge: badges[item.key] || 0
        }));
        setMenuItems(updatedMenuItems);
      }
    } catch (error: any) {
      console.log('Failed to fetch menu badges:', error.message);
    }
  };

  // Load all data
  const loadData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        fetchUserData(),
        fetchMenuBadges()
      ]);
    } catch (error) {
      console.log('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Pull to refresh
  const onRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        fetchUserData(),
        fetchMenuBadges()
      ]);
      showToast('Data refreshed!');
    } catch (error) {
      showToast('Failed to refresh data');
    } finally {
      setIsRefreshing(false);
    }
  };

  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);

  const handlePress = (item: MenuItem) => {
    if (item.children) {
      setOpenGroup(openGroup === item.key ? null : item.key);
    } else {
      setActiveKey(item.key);
      // Navigate to the corresponding screen
      if (item.screen) {
        navigation.navigate(item.screen as never);
      }
    }
  };

  const handleLogout = async () => {
    try {
      const token = await getItem<string>('token');
      if (token) {
        // Call logout API
        await API_CALL({
          apiVersionUrl: 'barong',
          url: '/api/mobile/auth/logout',
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      
      // Clear local storage
      await removeItem('token');
      await removeItem('user');
      
      // Navigate to login
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' as never }],
      });
    } catch (error: any) {
      console.log('Logout error:', error.message);
      // Still clear local storage and navigate even if API fails
      await removeItem('token');
      await removeItem('user');
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' as never }],
      });
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0B1622', justifyContent: 'center', alignItems: 'center' }}>
        <Loader size={48} color="#FFD600" />
        <Text style={{ color: '#fff', marginTop: 16, fontSize: 16 }}>Loading menu...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#0B1622', padding: 0 }}>
      {/* User Info */}
      <View style={{ alignItems: 'center', paddingVertical: 32, backgroundColor: '#181A20', borderTopRightRadius: 24, borderBottomRightRadius: 24, marginBottom: 12 }}>
        <TouchableOpacity onPress={onRefresh} disabled={isRefreshing} style={{ position: 'absolute', top: 8, right: 8 }}>
          <RefreshCw size={20} color="#FFD600" style={isRefreshing ? { transform: [{ rotate: '360deg' }] } : {}} />
        </TouchableOpacity>
        
        <Image
          source={{ uri: user?.avatar || 'https://randomuser.me/api/portraits/men/32.jpg' }}
          style={{ width: 64, height: 64, borderRadius: 32, borderWidth: 2, borderColor: '#FFD600', marginBottom: 8 }}
        />
        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 18 }}>{user?.name || 'User'}</Text>
        <Text style={{ color: '#FFD600', fontSize: 12, marginTop: 2 }}>Referral: {user?.referral_code || 'ABC123'}</Text>
        
        {/* User Stats */}
        <View style={{ flexDirection: 'row', marginTop: 8, gap: 16 }}>
          <View style={{ alignItems: 'center' }}>
            <Text style={{ color: '#10B981', fontSize: 14, fontWeight: 'bold' }}>${user?.balance?.toFixed(2) || '0.00'}</Text>
            <Text style={{ color: '#6B7280', fontSize: 10 }}>Balance</Text>
          </View>
          <View style={{ alignItems: 'center' }}>
            <Text style={{ color: '#F59E0B', fontSize: 14, fontWeight: 'bold' }}>${user?.total_earned?.toFixed(2) || '0.00'}</Text>
            <Text style={{ color: '#6B7280', fontSize: 10 }}>Total Earned</Text>
          </View>
          <View style={{ alignItems: 'center' }}>
            <Text style={{ color: '#8B5CF6', fontSize: 14, fontWeight: 'bold' }}>{user?.level || 'Bronze'}</Text>
            <Text style={{ color: '#6B7280', fontSize: 10 }}>Level</Text>
          </View>
        </View>
      </View>
      
      <ScrollView style={{ flex: 1, padding: 8 }}>
        {menuItems.map((item) => (
          <View key={item.key}>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: activeKey === item.key ? '#23262F' : '#181A20',
                borderRadius: 8,
                padding: 10,
                marginBottom: 2,
                borderWidth: activeKey === item.key ? 2 : 0,
                borderColor: activeKey === item.key ? '#FFD600' : 'transparent',
              }}
              onPress={() => handlePress(item)}
              activeOpacity={0.85}
            >
              {item.icon}
              <Text style={{
                color: activeKey === item.key ? '#fff' : '#bfc7d5',
                marginLeft: 10,
                fontWeight: 'bold',
                flex: 1,
              }}>
                {item.label}
              </Text>
              
              {/* Badge */}
              {item.badge && item.badge > 0 && (
                <View style={{
                  backgroundColor: '#EF4444',
                  borderRadius: 10,
                  minWidth: 20,
                  height: 20,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginLeft: 8,
                }}>
                  <Text style={{ color: '#fff', fontSize: 10, fontWeight: 'bold' }}>
                    {item.badge > 99 ? '99+' : item.badge}
                  </Text>
                </View>
              )}
              
              {/* New indicator */}
              {item.isNew && (
                <View style={{
                  backgroundColor: '#10B981',
                  borderRadius: 4,
                  paddingHorizontal: 6,
                  paddingVertical: 2,
                  marginLeft: 8,
                }}>
                  <Text style={{ color: '#fff', fontSize: 8, fontWeight: 'bold' }}>NEW</Text>
                </View>
              )}
              
              {/* Premium indicator */}
              {item.isPremium && (
                <View style={{
                  backgroundColor: '#F59E0B',
                  borderRadius: 4,
                  paddingHorizontal: 6,
                  paddingVertical: 2,
                  marginLeft: 8,
                }}>
                  <Text style={{ color: '#fff', fontSize: 8, fontWeight: 'bold' }}>PRO</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
      
      {/* Logout */}
      <TouchableOpacity
        style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 12, margin: 16, backgroundColor: '#23262F' }}
        onPress={handleLogout}
        activeOpacity={0.85}
      >
        <LogOut size={22} color="#F87171" />
        <Text style={{ color: '#fff', fontWeight: 'bold', marginLeft: 12 }}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
} 
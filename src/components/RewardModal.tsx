import React, { useEffect, useRef } from 'react';
import { Modal, View, Text, TouchableOpacity, Animated, Easing } from 'react-native';
import Svg, { Circle, Path, Text as SvgText, Defs, LinearGradient, Stop } from 'react-native-svg';

interface RewardModalProps {
  visible: boolean;
  reward: string;
  message: string;
  onClose: () => void;
}

const RewardModal: React.FC<RewardModalProps> = ({ visible, reward, message, onClose }) => {
  // USDT icon bounce
  const iconScale = useRef(new Animated.Value(0)).current;
  // Reward text scale
  const rewardScale = useRef(new Animated.Value(0)).current;
  // Message fade
  const messageFade = useRef(new Animated.Value(0)).current;
  // Glow pulse
  const glowAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (visible) {
      // Animate icon and reward text in
      iconScale.setValue(0);
      rewardScale.setValue(0);
      messageFade.setValue(0);
      Animated.sequence([
        Animated.spring(iconScale, { toValue: 1, useNativeDriver: true, friction: 5 }),
        Animated.spring(rewardScale, { toValue: 1, useNativeDriver: true, friction: 5 }),
        Animated.timing(messageFade, { toValue: 1, duration: 400, useNativeDriver: true }),
      ]).start();
      // Glow pulse (loops)
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, { toValue: 1.15, duration: 900, useNativeDriver: true }),
          Animated.timing(glowAnim, { toValue: 1, duration: 900, useNativeDriver: true }),
        ])
      ).start();
    } else {
      glowAnim.setValue(1);
      iconScale.setValue(0);
      rewardScale.setValue(0);
      messageFade.setValue(0);
    }
  }, [visible]);

  // Enhanced USDT SVG with gradient and border
  const UsdtIcon = () => (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Animated.View
        style={{
          position: 'absolute',
          width: 90,
          height: 90,
          borderRadius: 45,
          backgroundColor: '#26A17B',
          opacity: 0.25,
          transform: [{ scale: glowAnim }],
        }}
      />
      <Animated.View style={{ transform: [{ scale: iconScale }] }}>
        <Svg width={64} height={64} viewBox="0 0 64 64" fill="none">
          <Circle cx={32} cy={32} r={30} fill="#26A17B" stroke="#fff" strokeWidth={3} />
          <Circle cx={32} cy={32} r={30} fill="url(#usdtGradient)" fillOpacity={0.25} />
          <Path d="M20 27h24" stroke="#fff" strokeWidth={3} strokeLinecap="round" />
          <Path d="M20 37h24" stroke="#fff" strokeWidth={3} strokeLinecap="round" />
          <Path d="M32 16v32" stroke="#fff" strokeWidth={3} strokeLinecap="round" />
          <Path d="M24 32c0 4.418 3.582 8 8 8s8-3.582 8-8" stroke="#fff" strokeWidth={2} strokeLinecap="round" />
          <SvgText x={32} y={43} textAnchor="middle" fontSize={22} fill="#fff" fontWeight="bold" fontFamily="Arial">T</SvgText>
          <Defs>
            <LinearGradient id="usdtGradient" x1="0" y1="0" x2="64" y2="64">
              <Stop offset="0%" stopColor="#26A17B" stopOpacity="0.7" />
              <Stop offset="100%" stopColor="#fff" stopOpacity="0.1" />
            </LinearGradient>
          </Defs>
        </Svg>
      </Animated.View>
    </View>
  );

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ backgroundColor: '#23272f', padding: 32, borderRadius: 24, width: '80%', alignItems: 'center', overflow: 'hidden' }}>
          <UsdtIcon />
          <Animated.Text style={{ color: '#26A17B', fontSize: 32, fontWeight: 'bold', marginTop: 18, transform: [{ scale: rewardScale }] }}>{reward}</Animated.Text>
          <Animated.Text style={{ color: '#fff', fontSize: 18, marginTop: 8, textAlign: 'center', opacity: messageFade }}>{message}</Animated.Text>
          <TouchableOpacity onPress={onClose} style={{ backgroundColor: '#FCD535', borderRadius: 10, paddingVertical: 12, paddingHorizontal: 36, marginTop: 28 }}>
            <Text style={{ color: '#181A20', fontWeight: 'bold', fontSize: 18 }}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default RewardModal; 
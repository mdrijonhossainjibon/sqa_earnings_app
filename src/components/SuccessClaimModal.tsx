import React from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';

interface SuccessClaimModalProps {
  visible: boolean;
  onClose: () => void;
}

const SuccessClaimModal: React.FC<SuccessClaimModalProps> = ({ visible, onClose }) => (
  <Modal
    visible={visible}
    transparent
    animationType="fade"
    onRequestClose={onClose}
  >
    <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' }}>
      <View style={{ backgroundColor: '#23272f', padding: 28, borderRadius: 20, width: '80%', alignItems: 'center' }}>
        <Text style={{ fontSize: 48, marginBottom: 10 }}>🎉</Text>
        <Text style={{ color: '#FCD535', fontSize: 22, fontWeight: 'bold', marginBottom: 8, textAlign: 'center' }}>Claim Successful!</Text>
        <Text style={{ color: '#fff', fontSize: 16, marginBottom: 18, textAlign: 'center' }}>Your points have been converted to USDT.</Text>
        <TouchableOpacity onPress={onClose} style={{ backgroundColor: '#FCD535', borderRadius: 10, paddingVertical: 10, paddingHorizontal: 32 }}>
          <Text style={{ color: '#181A20', fontWeight: 'bold', fontSize: 16 }}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

export default SuccessClaimModal; 
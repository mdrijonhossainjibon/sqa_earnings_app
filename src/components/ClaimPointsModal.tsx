import React from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity } from 'react-native';

interface ClaimPointsModalProps {
  visible: boolean;
  points: string;
  setPoints: (val: string) => void;
  onClaim: () => void;
  onCancel: () => void;
}

const ClaimPointsModal: React.FC<ClaimPointsModalProps> = ({ visible, points, setPoints, onClaim, onCancel }) => (
  <Modal
    visible={visible}
    transparent
    animationType="slide"
    onRequestClose={onCancel}
  >
    <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' }}>
      <View style={{ backgroundColor: '#23272f', padding: 24, borderRadius: 20, width: '80%' }}>
        <Text style={{ color: '#FCD535', fontSize: 20, fontWeight: 'bold', marginBottom: 12, textAlign: 'center' }}>Claim Points to USDT</Text>
        <Text style={{ color: '#fff', marginBottom: 8 }}>Enter points to claim:</Text>
        <TextInput
          value={points}
          onChangeText={setPoints}
          placeholder="Points"
          placeholderTextColor="#888"
          keyboardType="numeric"
          style={{ backgroundColor: '#181A20', color: '#fff', borderRadius: 10, padding: 10, marginBottom: 16 }}
        />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <TouchableOpacity onPress={onCancel} style={{ backgroundColor: '#393939', borderRadius: 10, paddingVertical: 10, paddingHorizontal: 20 }}>
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClaim} style={{ backgroundColor: '#FCD535', borderRadius: 10, paddingVertical: 10, paddingHorizontal: 20, marginLeft: 10 }}>
            <Text style={{ color: '#181A20', fontWeight: 'bold' }}>Claim</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
);

export default ClaimPointsModal; 
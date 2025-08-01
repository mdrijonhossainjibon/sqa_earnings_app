import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface MysteryBoxProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
  onOpen: () => void;
  buttonText?: string;
}

const MysteryBox: React.FC<MysteryBoxProps> = ({ icon, title, desc, onOpen, buttonText = 'Open' }) => (
  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: 24, marginBottom: 12, padding: 16, borderRadius: 20, backgroundColor: '#23272f', borderWidth: 1, borderColor: '#393939', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4 }}>
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      {icon}
      <View style={{ marginLeft: 12 }}>
        <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>{title}</Text>
        <Text style={{ color: '#aaa', fontSize: 12, marginTop: 4, maxWidth: 200 }}>{desc}</Text>
      </View>
    </View>
    <TouchableOpacity onPress={onOpen} style={{ backgroundColor: '#10b981', borderRadius: 12, paddingVertical: 8, paddingHorizontal: 20, marginLeft: 12 }}>
      <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 14 }}>{buttonText}</Text>
    </TouchableOpacity>
  </View>
);

export default MysteryBox; 
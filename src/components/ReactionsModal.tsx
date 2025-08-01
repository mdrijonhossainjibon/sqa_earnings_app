import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const REACTIONS = ['👍', '❤️', '😂', '😮', '😢', '😡'];

interface ReactionsModalProps {
  isVisible: boolean;
  onSelect: (reaction: string) => void;
  onClose: () => void;
  position: { x: number; y: number };
}

const ReactionsModal = ({ isVisible, onSelect, onClose, position }: ReactionsModalProps) => {
  return (
    <Modal
      transparent={true}
      visible={isVisible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity style={styles.overlay} onPress={onClose} activeOpacity={1}>
        <View style={[styles.container, { top: position.y - 50, left: position.x - 30 }]}>
          {REACTIONS.map(reaction => (
            <TouchableOpacity key={reaction} onPress={() => onSelect(reaction)} style={styles.reaction}>
              <Text style={styles.emoji}>{reaction}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  container: {
    position: 'absolute',
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 18,
    padding: 8,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  reaction: {
    padding: 4,
  },
  emoji: {
    fontSize: 22,
  },
});

export default ReactionsModal; 
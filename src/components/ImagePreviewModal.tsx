import React from 'react';
import { Modal, View, Image, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import Svg, { Path } from 'react-native-svg';

interface ImagePreviewModalProps {
  isVisible: boolean;
  onClose: () => void;
  imageUri: string | null;
}

const ImagePreviewModal = ({ isVisible, onClose, imageUri }: ImagePreviewModalProps) => {
  if (!imageUri) return null;

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <Image source={{ uri: imageUri }} style={styles.image} resizeMode="contain" />
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Svg width={28} height={28} viewBox="0 0 24 24" fill="none">
            <Path d="M18 6L6 18M6 6l12 12" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        </TouchableOpacity>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  closeButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    padding: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});

export default ImagePreviewModal; 
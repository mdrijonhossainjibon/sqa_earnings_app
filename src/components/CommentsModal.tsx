import React, { useState } from 'react';
import { Modal, View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import Svg, { Path } from 'react-native-svg';

interface Comment {
  id: string;
  user: string;
  text: string;
  avatar: any;
}

interface CommentsModalProps {
  isVisible: boolean;
  onClose: () => void;
  comments: Comment[];
  onAddComment: (commentText: string) => void;
}

const CommentsModal = ({ isVisible, onClose, comments, onAddComment }: CommentsModalProps) => {
  const [newComment, setNewComment] = useState('');

  const handleAddComment = () => {
    if (newComment.trim()) {
      onAddComment(newComment);
      setNewComment('');
    }
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.flexEnd}
      >
        <TouchableOpacity style={styles.overlay} onPress={onClose} />
        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Comments</Text>
            <TouchableOpacity onPress={onClose}>
              <Svg width={24} height={24} viewBox="0 0 24 24"><Path d="M18 6L6 18M6 6l12 12" stroke="#333" strokeWidth={2} /></Svg>
            </TouchableOpacity>
          </View>
          <FlatList
            data={comments}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <View style={styles.commentContainer}>
                {/* Avatar can be added here */}
                <View style={styles.commentTextContainer}>
                  <Text style={styles.commentUser}>{item.user}</Text>
                  <Text>{item.text}</Text>
                </View>
              </View>
            )}
            style={styles.list}
          />
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Write a comment..."
              value={newComment}
              onChangeText={setNewComment}
            />
            <TouchableOpacity style={styles.sendButton} onPress={handleAddComment}>
              <Text style={styles.sendButtonText}>Send</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  flexEnd: { flex: 1, justifyContent: 'flex-end' },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  container: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  list: { paddingHorizontal: 16 },
  commentContainer: { flexDirection: 'row', paddingVertical: 12 },
  commentTextContainer: { marginLeft: 10 },
  commentUser: { fontWeight: 'bold', marginBottom: 2 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', padding: 12, borderTopWidth: 1, borderTopColor: '#eee' },
  input: { flex: 1, backgroundColor: '#f0f2f5', borderRadius: 20, paddingHorizontal: 15, paddingVertical: 10, marginRight: 10 },
  sendButton: { padding: 10 },
  sendButtonText: { color: '#007BFF', fontWeight: 'bold' },
});

export default CommentsModal; 
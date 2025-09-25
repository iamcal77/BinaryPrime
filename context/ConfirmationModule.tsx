// components/ConfirmationModal.tsx
import React from 'react';
import {
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface ConfirmationModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  confirmText?: string;
  cancelText?: string;
}

export default function ConfirmationModal({
  visible,
  onClose,
  onConfirm,
  title,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
}: ConfirmationModalProps) {
  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.confirmOverlay}>
        <View style={styles.confirmBox}>
          <Text style={styles.confirmText}>{title}</Text>
          <View style={styles.confirmActions}>
            <TouchableOpacity
              style={[styles.confirmButton, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={styles.cancelButtonText}>{cancelText}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.confirmButton, styles.logoutButton]}
              onPress={onConfirm}
            >
              <Text style={styles.logoutButtonText}>{confirmText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  confirmOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmBox: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 20,
    width: '80%',
    maxWidth: 300,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  confirmText: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
    color: '#333',
    lineHeight: 22,
  },
  confirmActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  confirmButton: {
    flex: 1,
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#e5e7eb',
  },
  logoutButton: {
    backgroundColor: '#ef4444',
  },
  cancelButtonText: {
    color: '#333',
    fontWeight: '500',
  },
  logoutButtonText: {
    color: 'white',
    fontWeight: '500',
  },
});
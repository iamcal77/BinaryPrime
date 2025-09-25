// components/MenuModal.tsx
import React from 'react';
import {
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface MenuItem {
  label: string;
  onPress: () => void;
  destructive?: boolean;
}

interface MenuModalProps {
  visible: boolean;
  onClose: () => void;
  items: MenuItem[];
}

export default function MenuModal({ visible, onClose, items }: MenuModalProps) {
  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <View style={styles.menu}>
          {items.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={() => {
                onClose();
                item.onPress();
              }}
            >
              <Text 
                style={[
                  styles.menuText,
                  item.destructive && styles.destructiveText
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 60,
    paddingRight: 16,
  },
  menu: {
    backgroundColor: 'white',
    borderRadius: 6,
    elevation: 4,
    paddingVertical: 8,
    minWidth: 120,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  menuItem: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  menuText: {
    fontSize: 16,
    color: '#333',
  },
  destructiveText: {
    color: '#ef4444',
    fontWeight: '500',
  },
});
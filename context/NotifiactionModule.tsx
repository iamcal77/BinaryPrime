import React from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export interface Notification {
  id: number;
  subject: string;
  message: string;
  createdAt: string;
  isRead: boolean;
}

interface NotificationModalProps {
  visible: boolean;
  onClose: () => void;
  notifications: Notification[];
  loading: boolean;
  unreadCount: number;
}

export default function NotificationModal({
  visible,
  onClose,
  notifications,
}: NotificationModalProps) {
  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.notificationBox}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Notifications</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Icon name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Notifications List */}
          {notifications.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Icon name="notifications-off" size={40} color="#ccc" />
              <Text style={styles.emptyText}>No notifications yet</Text>
              <Text style={styles.emptySubText}>
                We'll notify you when something arrives
              </Text>
            </View>
          ) : (
            <FlatList
              data={notifications}
              keyExtractor={(item) => item.id.toString()}
              showsVerticalScrollIndicator={false}
              renderItem={({ item, index }) => (
                <View
                  style={[
                    styles.notificationItem,
                    index === notifications.length - 1 && styles.lastNotificationItem,
                  ]}
                >
                  <View style={styles.notificationIcon}>
                    <Icon
                      name={item.isRead ? 'notifications-none' : 'notifications'}
                      size={20}
                      color={item.isRead ? '#999' : '#007AFF'}
                    />
                  </View>
                  <View style={styles.notificationContent}>
                    <Text
                      style={[
                        styles.notificationTitle,
                        !item.isRead && styles.unreadTitle,
                      ]}
                    >
                      {item.subject}
                    </Text>
                    <Text style={styles.notificationMessage}>{item.message}</Text>
                    <Text style={styles.notificationTime}>
                      {new Date(item.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Text>
                  </View>
                </View>
              )}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          )}
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center', // center horizontally
    paddingHorizontal: 10,
    justifyContent: 'flex-start', // 👈 Sticks it to the top

  },
  notificationBox: {
    backgroundColor: '#fff',
    borderRadius: 16,
    width: '90%',            // ✅ reduced width
    maxHeight: '70%',        // ✅ reduced height
    minHeight: '30%',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: 'hidden',
    marginTop: 30,           // ✅ adds top margin
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 12,
    fontWeight: '500',
  },
  emptySubText: {
    fontSize: 14,
    color: '#999',
    marginTop: 4,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  notificationItem: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  lastNotificationItem: {
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  notificationIcon: {
    width: 40,
    alignItems: 'flex-start',
    paddingTop: 2,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#666',
    marginBottom: 4,
  },
  unreadTitle: {
    color: '#333',
    fontWeight: '600',
  },
  notificationMessage: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: 11,
    color: '#999',
  },
  separator: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginHorizontal: 20,
  },
});

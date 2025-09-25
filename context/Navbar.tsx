// components/Navbar.tsx
import { useContext, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { AuthContext } from '../context/AuthProvider';
import { useNotifications } from '../hooks/useNotification';
import ConfirmationModal from './ConfirmationModule';
import MenuModal from './MenuModal';
import NotificationModal from './NotifiactionModule';


type NavbarProps = {
  onProfilePress?: () => void;
  onNotificationPress?: () => void;
};

export default function Navbar({ onProfilePress, onNotificationPress }: NavbarProps) {
  const [menuVisible, setMenuVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [notificationModalVisible, setNotificationModalVisible] = useState(false);
  const { logout } = useContext(AuthContext);
  const { unreadCount, loading, notifications } = useNotifications();

  const handleLogout = async () => {
    setConfirmVisible(false);
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const menuItems = [
    {
      label: 'Logout',
      onPress: () => setConfirmVisible(true),
      destructive: true,
    },
  ];

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <View style={styles.navbar}>
        <Text style={styles.title}>Binary Prime</Text>

        <View style={styles.iconsContainer}>
          {/* 🔔 Notification Icon with Badge */}
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => setNotificationModalVisible(true)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Icon name="notifications" size={24} color="#615f5fff" />
            {!loading && unreadCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {unreadCount > 99 ? '99+' : unreadCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>

          {/* ⋮ More Options */}
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => setMenuVisible(true)}
          >
            <Icon name="more-vert" size={24} color="#615f5fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Modals */}
      <NotificationModal
        visible={notificationModalVisible}
        onClose={() => setNotificationModalVisible(false)}
        notifications={notifications}
        loading={loading}
        unreadCount={unreadCount}
      />

      <MenuModal
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        items={menuItems}
      />

      <ConfirmationModal
        visible={confirmVisible}
        onClose={() => setConfirmVisible(false)}
        onConfirm={handleLogout}
        title="Are you sure you want to logout?"
        confirmText="Logout"
        cancelText="Cancel"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#e9edf4ff',
  },
  navbar: {
    height: 60,
    backgroundColor: '#e9edf4ff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#d1d5db',
  },
  title: {
    color: '#343232ff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  iconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconButton: {
    padding: 4,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#ef4444',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#e9edf4ff',
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
});
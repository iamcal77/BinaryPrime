import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Icon from 'react-native-vector-icons/MaterialIcons';
type NavbarProps = {
  onProfilePress?: () => void;
  onNotificationPress?: () => void;
};

export default function Navbar({ onProfilePress, onNotificationPress }: NavbarProps) {
  return (
    <View style={styles.navbar}>
      <Text style={styles.title}>Binary Prime</Text>
      
      <View style={styles.iconsContainer}>
        {/* Notification Icon with Badge */}
        <TouchableOpacity 
          style={styles.iconButton} 
          onPress={onNotificationPress}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Icon name="notifications" size={24} color="#343232" />
          <View style={styles.badge}>
            <Text style={styles.badgeText}>3</Text>
          </View>
        </TouchableOpacity>

        {/* Profile Icon */}
        <TouchableOpacity 
          style={styles.iconButton} 
          onPress={onProfilePress}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Icon name="person" size={24} color="#343232" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    height: 60,
    backgroundColor: "#e9edf4ff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#d1d5db",
  },
  title: { 
    color: "#343232ff", 
    fontSize: 20, 
    fontWeight: "bold" 
  },
  iconsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  iconButton: {
    position: 'relative',
    padding: 4,
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
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
});
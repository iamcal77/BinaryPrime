// app/screens/DetailScreen.tsx
import { StyleSheet, Text, View } from "react-native";

export default function DetailScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>📄 Detail Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
});

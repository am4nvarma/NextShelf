
import { View, StyleSheet } from "react-native";

export default function AuthorCardSkeleton() {
  return (
    <View style={styles.container}>
      {/* Author portrait placeholder */}
      <View style={styles.authorCover} />

      {/* Author name placeholder */}
      <View style={styles.authorTitle} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 125,
    marginRight: 14,
    alignItems: "center",
    backgroundColor: "#191919",
    borderRadius: 14,
    padding: 12,
  },

  authorCover: {
    width: 95,
    height: 110,
    borderRadius: 12,
    backgroundColor: "#292929",
  },

  authorTitle: {
    width: 85,
    height: 12,
    marginTop: 10,
    borderRadius: 5,
    backgroundColor: "#252525",
  },
});

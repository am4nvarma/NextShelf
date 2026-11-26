
import { View, StyleSheet } from "react-native";

export default function BookCardSkeleton() {
  return (
    <View style={styles.container}>
      {/* Book cover placeholder */}
      <View style={styles.cover} />

      {/* Title placeholder */}
      <View style={styles.title} />

      {/* Author placeholder */}
      <View style={styles.author} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 145,
    marginRight: 14,
  },
  cover: {
    width: 145,
    height: 210,
    borderRadius: 10,
    backgroundColor: "#252525",
  },
  title: {
    width: "85%",
    height: 12,
    marginTop: 10,
    borderRadius: 5,
    backgroundColor: "#252525",
  },
  author: {
    width: "60%",
    height: 10,
    marginTop: 7,
    borderRadius: 5,
    backgroundColor: "#202020",
  },
});


import { View, Text, StyleSheet } from "react-native";

type BookCardProps = {
  title: string;
  author: string;
  publishedYear?: number;
};

export default function BookCard({
  title,
  author,
  publishedYear,
}: BookCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.author}>{author}</Text>

      {publishedYear !== undefined && (
        <Text style={styles.year}>{publishedYear}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 280,
    padding: 16,
    marginVertical: 8,
    backgroundColor: "#191919",
    borderRadius: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  author: {
    fontSize: 14,
    color: "#AAAAAA",
    marginTop: 6,
  },
  year: {
    fontSize: 12,
    color: "#40C4AA",
    marginTop: 8,
  },
});


import { View, Text, StyleSheet } from "react-native";

type BookCardProps = {
  title: string;
  author: string;
  publishedYear?: number;
  rating?: number
};

export default function BookCard({
  title,
  author,
  publishedYear,
  rating,
}: BookCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.author}>{author}</Text>

      {publishedYear && rating !== undefined && (
        <Text style={styles.footer}>{publishedYear} | {rating} ⭐ </Text>
      )}

      {/* {rating !== undefined && (
        <Text style = {styles.rating}>{rating}</Text>
      )} */}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
  flex: 1,
  padding: 12,
  marginHorizontal: 6,
  marginVertical: 8,
  backgroundColor: "#191919",
  borderRadius: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  author: {
    fontSize: 14,
    color: "#AAAAAA",
    marginTop: 6,
  },
  footer: {
    fontSize: 12,
    color: "#40C4AA",
    marginTop: 8,
    paddingTop:2,
  },

});

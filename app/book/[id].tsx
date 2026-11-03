import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Image } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { getBookDetails, getAuthorDetails } from "../../services/bookApi";
import type { BookDetails, BookAuthor } from "../../types/book";

export default function BookDetailsScreen() {
  const { id, coverId } = useLocalSearchParams<{
    id: string;
    coverId?: string;
  }>();
  const [book, setBook] = useState<BookDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [authors, setAuthors] = useState<BookAuthor[]>([]);

  useEffect(() => {
    const loadBookDetails = async () => {
      try {
        setIsLoading(true);
        setError(false);

        const result = await getBookDetails(id);
        const authorKeys =
          result.authors?.map(
            (item: { author: { key: string } }) => item.author.key,
          ) ?? [];

        const authorResults = await Promise.all(
          authorKeys.map((key: string) => getAuthorDetails(key)),
        );

        setAuthors(authorResults);

        console.log("DETAILS API RESPONSE:", JSON.stringify(result, null, 2));
        setBook(result);
      } catch (error) {
        console.log("Failed to load book details:", error);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };

    loadBookDetails();
  }, [id]);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#40C4AA" />
      </View>
    );
  }

  if (error || !book) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Unable to load book details.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {book.covers && book.covers.length > 0 ? (
        <Image
          source={{
            uri: `https://covers.openlibrary.org/b/id/${book.covers[0]}-L.jpg`,
          }}
          style={styles.cover}
          resizeMode="contain"
        />
      ) : coverId ? (
        <Image
          source={{
            uri: `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`,
          }}
          style={styles.cover}
          resizeMode="contain"
        />
      ) : (
        <View style={styles.coverPlaceholder}>
          <Text style={styles.text}>No Cover Available</Text>
        </View>
      )}

      <Text style={styles.heading}>{book.title}</Text>
      <Text style={styles.author}>
        {authors.length > 0
          ? authors.map((author) => author.name).join(", ")
          : "Unknown author"}
      </Text>

      <Text style={styles.text}>
        {typeof book.description === "string"
          ? book.description
          : (book.description?.value ?? "No description available.")}
      </Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0b0000",
    justifyContent: "center",
    alignItems: "center",
  },
  heading: {
    color: "#40C4AA",
    fontSize: 26,
    fontWeight: "bold",
  },
  text: {
    color: "white",
    fontSize: 16,
    marginTop: 12,
  },
  cover: {
    width: 180,
    height: 260,
    marginBottom: 24,
  },
  coverPlaceholder: {
    width: 180,
    height: 260,
    backgroundColor: "#252525",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    borderRadius: 8,
  },
  author: {
    color: "#40C4AA",
    fontSize: 16,
    marginBottom: 16,
  },
});

import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  ActivityIndicator
} from "react-native";
import BookCard from "../components/BookCard";
import { Ionicons } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import { searchBooks } from "../services/bookApi";
import type { OpenLibraryBook } from "../types/book";

export default function DiscoveryScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [books, setBooks] = useState<OpenLibraryBook[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadBooks = async () => {
  try {
    setIsLoading(true);
    setError(false);

    const result = await searchBooks("atomic habits");
    setBooks(result.docs);
  } catch (error) {
    console.log("Failed to load books:", error);
    setError(true);
  } finally {
    setIsLoading(false);
  }
};

useEffect(() => {
  loadBooks();
}, []);

  const filteredBooks = books.filter((book) => {
    const query = searchQuery.toLowerCase();

    return (
      book.title.toLowerCase().includes(query) ||
      book.author_name?.some((author) =>
        author.toLowerCase().includes(query)
      )
    );
  });

  return (
    <View style={styles.container}>
      <Text style={styles.brand}>NextShelf</Text>

      <Text style={styles.heading}>Discover Books</Text>

      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#999999" />

        <TextInput
          style={styles.searchInput}
          placeholder="Search books, authors..."
          placeholderTextColor="#999999"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

{isLoading ? (
  <ActivityIndicator size="large" color="#40C4AA" />
) : error ? (
  <View style={styles.errorContainer}>
    <Text style={styles.errorText}>
      Something went wrong. Please check your internet connection.
    </Text>

    <Text style={styles.retryButton} onPress={loadBooks}>
      Try Again
    </Text>
  </View>
) : (
  <FlatList
    data={filteredBooks}
    keyExtractor={(item) => item.key}
    numColumns={2}
    columnWrapperStyle={{
      justifyContent: "space-between",
    }}
    contentContainerStyle={{
      paddingBottom: 20,
    }}
    renderItem={({ item }) => (
      <BookCard
        title={item.title}
        author={item.author_name?.join(", ") ?? "Unknown author"}
        publishedYear={item.first_publish_year}
        coverId={item.cover_i}
      />
    )}
    ListEmptyComponent={
      <Text style={styles.emptySearch}>
        No Books Found. Try another search
      </Text>
    }
  />
)}


    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "#0b0000",
    padding: 16,
    paddingTop: 20,
  },
  heading: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 20,
    marginLeft: 5,
  },
  brand: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#40C4AA",
    marginBottom: 10,
    marginLeft: 5,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#191919",
    borderRadius: 10,
    height: 52,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#292929",
    paddingHorizontal: 14,
  },
  searchInput: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 15,
    marginLeft: 1,
  },
  emptySearch: {
    color: "#AAAAAA",
    textAlign: "center",
    marginTop: 40,
    fontSize: 15,
  },
  errorContainer: {
  alignItems: "center",
  justifyContent: "center",
  marginTop: 40,
  paddingHorizontal: 20,
},
errorText: {
  color: "#AAAAAA",
  textAlign: "center",
  fontSize: 15,
  marginBottom: 15,
},
retryButton: {
  color: "#40C4AA",
  fontSize: 16,
  fontWeight: "bold",
},
});

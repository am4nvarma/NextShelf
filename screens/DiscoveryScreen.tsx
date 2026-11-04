import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  ActivityIndicator,
} from "react-native";

import BookCard from "../components/BookCard";
import { Ionicons } from "@expo/vector-icons";
import { useState, useEffect, useRef } from "react";
import { searchBooks } from "../services/bookApi";
import type { OpenLibraryBook } from "../types/book";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DiscoveryScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [books, setBooks] = useState<OpenLibraryBook[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState(false);

  const [offset, setOffset] = useState(0);
  const [totalBooks, setTotalBooks] = useState(0);

  const router = useRouter();

  // Prevent multiple pagination requests at the same time.
  const isLoadingMoreRef = useRef(false);

  // Track which search request is currently active.
  const searchVersionRef = useRef(0);

  // Keep a reference to the current pagination request.
  const paginationControllerRef = useRef<AbortController | null>(null);

  const loadBooks = async (
    query: string,
    signal?: AbortSignal,
    nextOffset: number = 0,
    requestVersion: number = searchVersionRef.current,
  ) => {
    try {
      if (nextOffset === 0) {
        setIsLoading(true);
        setError(false);
      }

      console.log("--------------------------------");
      console.log("📚 NEXTSHELF API REQUEST");
      console.log("Search query:", query);
      console.log("Requested offset:", nextOffset);
      console.log("Requested limit:", 20);
      console.log("Expected books:", 20);

      console.log("⏳ FETCH STARTED:", {
        query,
        offset: nextOffset,
        version: requestVersion,
      });
      const result = await searchBooks(query, signal, nextOffset);

      console.log("📥 API RESPONSE");
      console.log("Books actually returned:", result.docs.length);
      console.log("Total books reported by API:", result.numFound);
      console.log("Next offset will be:", nextOffset + result.docs.length);
      console.log("--------------------------------");

      // Ignore outdated or cancelled requests.
      if (signal?.aborted || requestVersion !== searchVersionRef.current) {
        return;
      }

      if (nextOffset === 0) {
        setBooks(result.docs);
      } else {
        setBooks((previousBooks) => {
          const existingKeys = new Set(previousBooks.map((book) => book.key));

          const newBooks = result.docs.filter(
            (book) => !existingKeys.has(book.key),
          );

          return [...previousBooks, ...newBooks];
        });
      }

      setTotalBooks(result.numFound);

      // Advance by the number of raw results returned by the API.
      // If the API returns no results, stop further pagination.
      setOffset(
        result.docs.length === 0
          ? result.numFound
          : nextOffset + result.docs.length,
      );
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        return;
      }

      if (requestVersion !== searchVersionRef.current) {
        return;
      }

      console.log("Failed to load books:", err);
      setError(true);
    } finally {
      if (requestVersion === searchVersionRef.current) {
        if (nextOffset === 0) {
          setIsLoading(false);
        } else {
          setIsLoadingMore(false);
          isLoadingMoreRef.current = false;
          paginationControllerRef.current = null;
        }
      }
    }
  };

  // Load the next page when the user scrolls.
  const loadMoreBooks = () => {
    if (
      isLoading ||
      isLoadingMoreRef.current ||
      books.length === 0 ||
      offset >= totalBooks
    ) {
      return;
    }

    // Lock immediately to prevent repeated requests.
    isLoadingMoreRef.current = true;
    setIsLoadingMore(true);

    const controller = new AbortController();
    paginationControllerRef.current = controller;

    console.log("🚀 PAGINATION REQUEST STARTED");
    console.log("Offset being sent:", offset);
    console.log("Displayed books:", books.length);
    console.log("Total available:", totalBooks);

    loadBooks(
      searchQuery.trim() || "atomic habits",
      controller.signal,
      offset,
      searchVersionRef.current,
    );
  };

  // Handle a new search.
  useEffect(() => {
    const controller = new AbortController();

    // Give this search a new version.
    searchVersionRef.current += 1;

    const currentVersion = searchVersionRef.current;
    const query = searchQuery.trim();

    console.log("🔎 SEARCH EFFECT STARTED:", {
      query,
      version: currentVersion,
    });

    // Cancel any ongoing pagination request.
    paginationControllerRef.current?.abort();
    paginationControllerRef.current = null;

    isLoadingMoreRef.current = false;

    // Reset pagination for the new search.
    setOffset(0);
    setTotalBooks(0);
    setBooks([]);
    setIsLoading(true);
    setIsLoadingMore(false);
    setError(false);

    const timer = setTimeout(() => {
      console.log("⏰ DEBOUNCE FINISHED:", {
        query,
        version: currentVersion,
      });
      loadBooks(query || "atomic habits", controller.signal, 0, currentVersion);
    }, 750);

    return () => {
      console.log("🧹 SEARCH EFFECT CLEANUP:", {
        query,
        version: currentVersion,
      });
      clearTimeout(timer);
      controller.abort();
      paginationControllerRef.current?.abort();
    };
  }, [searchQuery]);

  // Retry the current search if it fails.
  const handleRetry = () => {
    const controller = new AbortController();

    loadBooks(
      searchQuery.trim() || "atomic habits",
      controller.signal,
      0,
      searchVersionRef.current,
    );
  };

  return (
    <SafeAreaView style={styles.container}>
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

          <Text style={styles.retryButton} onPress={handleRetry}>
            Try Again
          </Text>
        </View>
      ) : (
        <FlatList
          data={books}
          keyExtractor={(item) => item.key}
          numColumns={2}
          // Performance optimizations
          initialNumToRender={6}
          maxToRenderPerBatch={6}
          windowSize={5}
          onEndReached={loadMoreBooks}
          onEndReachedThreshold={0.5}
          columnWrapperStyle={{
            justifyContent: "space-between",
          }}
          contentContainerStyle={{
            paddingBottom: 20,
          }}
          ListFooterComponent={
            isLoadingMore ? (
              <ActivityIndicator
                size="large"
                color="#40C4AA"
                style={{ marginVertical: 20 }}
              />
            ) : null
          }
          renderItem={({ item }) => (
            <BookCard
              title={item.title}
              author={item.author_name?.join(", ") ?? "Unknown author"}
              publishedYear={item.first_publish_year}
              coverId={item.cover_i}
              onPress={() =>
                router.push({
                  pathname: "/book/[id]",
                  params: {
                    id: item.key.replace("/works/", ""),
                    coverId: item.cover_i?.toString() ?? "",
                  },
                })
              }
            />
          )}
          ListEmptyComponent={
            <Text style={styles.emptySearch}>
              No Books Found. Try another search
            </Text>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "#0b0000",
    padding: 16,
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

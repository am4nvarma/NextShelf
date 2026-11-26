import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  FlatList,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../contexts/AuthContext";
import { useEffect, useState } from "react";
import { getUserPreferences } from "../services/preferencesApi";

import {
  getPersonalizedBooksByGenres,
  getAuthorDetails,
  getPopularBooksByGenres,
} from "../services/bookApi";
import type { OpenLibraryBook, BookAuthor } from "../types/book";
import BookCard from "../components/BookCard";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import homeHero from "../assets/images/home-hero.png";
import BookCardSkeleton from "../components/BookCardSkeleton";

function getAuthorPhotoUrl(author: BookAuthor): string | null {
  const photoId = author.photos?.[0];

  if (!photoId) return null;

  return `https://covers.openlibrary.org/a/id/${photoId}-M.jpg`;
}

export default function HomeScreen() {
  const { user } = useAuth();

  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [isLoadingPreferences, setIsLoadingPreferences] = useState(true);

  const [recommendedBooks, setRecommendedBooks] = useState<OpenLibraryBook[]>(
    [],
  );
  const [isLoadingBooks, setIsLoadingBooks] = useState(false);
  const [booksError, setBooksError] = useState(false);

  const [selectedAuthors, setSelectedAuthors] = useState<string[]>([]);
  const [favoriteAuthors, setFavoriteAuthors] = useState<BookAuthor[]>([]);
  const [isLoadingAuthors, setIsLoadingAuthors] = useState(false);

  const [moreGenreBooks, setMoreGenreBooks] = useState<OpenLibraryBook[]>([]);
  const [isLoadingMoreBooks, setIsLoadingMoreBooks] = useState(true);

  // Picked for you pagination
  const [nextRecommendedOffset, setNextRecommendedOffset] = useState(20);
  const [isFetchingMoreRecommended, setIsFetchingMoreRecommended] =
    useState(false);
  const [hasMoreRecommended, setHasMoreRecommended] = useState(true);

  // More in your genres pagination
  const [nextMoreGenreOffset, setNextMoreGenreOffset] = useState(40);
  const [isFetchingMoreGenreBooks, setIsFetchingMoreGenreBooks] =
    useState(false);
  const [hasMoreGenreBooks, setHasMoreGenreBooks] = useState(true);

  const router = useRouter();

  const username = user?.user_metadata?.username?.trim() || "Reader";

  useEffect(() => {
    let isMounted = true;

    async function loadPreferences() {
      if (!user) {
        setIsLoadingPreferences(false);
        return;
      }

      try {
        const preferences = await getUserPreferences(user.id);

        if (isMounted && preferences) {
          setSelectedGenres(preferences.selected_genres ?? []);
          setSelectedAuthors(preferences.selected_authors ?? []);
        }
      } catch (error) {
        console.error("Home preferences loading failed:", error);
      } finally {
        if (isMounted) {
          setIsLoadingPreferences(false);
        }
      }
    }

    loadPreferences();

    return () => {
      isMounted = false;
    };
  }, [user?.id]);

  useEffect(() => {
    if (isLoadingPreferences) return;

    if (selectedGenres.length === 0) {
      setRecommendedBooks([]);
      setIsLoadingBooks(false);
      return;
    }

    const controller = new AbortController();

    async function loadRecommendations() {
      try {
        setIsLoadingBooks(true);
        setBooksError(false);

        const books = await getPersonalizedBooksByGenres(
          selectedGenres,
          controller.signal,
        );

        if (!controller.signal.aborted) {
          setRecommendedBooks(books);
        }
      } catch (error) {
        if (controller.signal.aborted) return;

        console.error("Loading personalized books failed:", error);
        setBooksError(true);
      } finally {
        if (!controller.signal.aborted) {
          setIsLoadingBooks(false);
        }
      }
    }

    loadRecommendations();

    return () => {
      controller.abort();
    };
  }, [selectedGenres, isLoadingPreferences]);

  useEffect(() => {
    if (isLoadingPreferences) return;

    if (selectedGenres.length === 0) {
      setMoreGenreBooks([]);
      setIsLoadingMoreBooks(false);
      return;
    }

    const controller = new AbortController();

    async function loadMoreGenreBooks() {
      try {
        setIsLoadingMoreBooks(true);

        const excludedBookKeys = recommendedBooks.map((book) => book.key);

        const books = await getPopularBooksByGenres(
          selectedGenres,
          excludedBookKeys,
          controller.signal,
        );

        setMoreGenreBooks(books);
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error("Loading more genre books failed:", error);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoadingMoreBooks(false);
        }
      }
    }

    loadMoreGenreBooks();

    return () => {
      controller.abort();
    };
  }, [selectedGenres, recommendedBooks, isLoadingPreferences]);

  useEffect(() => {
    if (isLoadingPreferences) return;

    if (selectedAuthors.length === 0) {
      setFavoriteAuthors([]);
      setIsLoadingAuthors(false);
      return;
    }

    let isMounted = true;

    async function loadFavoriteAuthors() {
      try {
        setIsLoadingAuthors(true);

        const authors = await Promise.all(
          selectedAuthors.map((authorKey) => getAuthorDetails(authorKey)),
        );

        if (isMounted) {
          setFavoriteAuthors(authors);
        }
      } catch (error) {
        console.error("Loading favorite authors failed:", error);
      } finally {
        if (isMounted) {
          setIsLoadingAuthors(false);
        }
      }
    }

    loadFavoriteAuthors();

    return () => {
      isMounted = false;
    };
  }, [selectedAuthors, isLoadingPreferences]);

  const handleBookPress = (item: OpenLibraryBook) => {
    router.push({
      pathname: "/book/[id]",
      params: {
        id: item.key.replace("/works/", ""),
        coverId: item.cover_i?.toString() ?? "",
      },
    });
  };

  const loadMoreRecommendedBooks = async () => {
    if (
      isFetchingMoreRecommended ||
      !hasMoreRecommended ||
      isLoadingBooks ||
      selectedGenres.length === 0
    ) {
      return;
    }

    try {
      setIsFetchingMoreRecommended(true);

      const books = await getPersonalizedBooksByGenres(
        selectedGenres,
        undefined,
        nextRecommendedOffset,
      );

      setRecommendedBooks((previousBooks) => {
        const existingKeys = new Set(previousBooks.map((book) => book.key));

        const uniqueBooks = books.filter((book) => !existingKeys.has(book.key));

        return [...previousBooks, ...uniqueBooks];
      });

      setNextRecommendedOffset((previousOffset) => previousOffset + 20);

      if (books.length < 12) {
        setHasMoreRecommended(false);
      }
    } catch (error) {
      console.error("Loading more recommendations failed:", error);
    } finally {
      setIsFetchingMoreRecommended(false);
    }
  };

  const loadMoreGenreBooks = async () => {
    if (
      isFetchingMoreGenreBooks ||
      !hasMoreGenreBooks ||
      isLoadingMoreBooks ||
      selectedGenres.length === 0
    ) {
      return;
    }

    try {
      setIsFetchingMoreGenreBooks(true);

      // Exclude books already displayed in either carousel.
      const excludedBookKeys = [
        ...recommendedBooks.map((book) => book.key),
        ...moreGenreBooks.map((book) => book.key),
      ];

      const books = await getPopularBooksByGenres(
        selectedGenres,
        excludedBookKeys,
        undefined,
        nextMoreGenreOffset,
      );

      setMoreGenreBooks((previousBooks) => {
        const existingKeys = new Set([
          ...recommendedBooks.map((book) => book.key),
          ...previousBooks.map((book) => book.key),
        ]);

        const uniqueBooks = books.filter((book) => !existingKeys.has(book.key));

        return [...previousBooks, ...uniqueBooks];
      });

      setNextMoreGenreOffset((previousOffset) => previousOffset + 20);

      // Continue if this batch returned books, even if fewer than 12.
      if (books.length === 0) {
        setHasMoreGenreBooks(false);
      }
    } catch (error) {
      console.error("Loading more genre books failed:", error);
    } finally {
      setIsFetchingMoreGenreBooks(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.brand}>NextShelf</Text>
        </View>

        <View style={styles.welcomeSection}>
          <Text style={styles.greeting}>Hello, {username}! 👋</Text>

          <Text style={styles.subtitle}>
            Ready to discover your next favourite book?
          </Text>
        </View>

        <View style={styles.heroBanner}>
          <Image source={homeHero} style={styles.heroImage} contentFit="fill" />

          <View style={styles.heroOverlay}>
            <Pressable
              style={styles.heroButton}
              onPress={() => router.push("/(tabs)/explore")}
            >
              <Text style={styles.heroButtonText}>Explore Books</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Reading Taste</Text>

          {isLoadingPreferences ? (
            <Text style={styles.secondaryText}>
              Loading your preferences...
            </Text>
          ) : selectedGenres.length > 0 ? (
            <View style={styles.genreContainer}>
              {selectedGenres.map((genre) => (
                <View key={genre} style={styles.genreChip}>
                  <Text style={styles.genreText}>{genre}</Text>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.secondaryText}>
              Your reading preferences will appear here.
            </Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Picked For You</Text>

          {isLoadingBooks ? (
            <FlatList
              data={[1, 2, 3]}
              keyExtractor={(item) => item.toString()}
              horizontal
              scrollEnabled={false}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.bookCarousel}
              renderItem={() => <BookCardSkeleton />}
            />
          ) : booksError ? (
            <Text style={styles.secondaryText}>
              Unable to load recommendations. Please try again later.
            </Text>
          ) : recommendedBooks.length > 0 ? (
            <FlatList
              key="picked-for-you-carousel"
              data={recommendedBooks}
              keyExtractor={(item) => item.key}
              horizontal
              showsHorizontalScrollIndicator={false}
              nestedScrollEnabled
              onEndReached={loadMoreRecommendedBooks}
              onEndReachedThreshold={0.5}
              contentContainerStyle={styles.bookCarousel}
              renderItem={({ item }) => (
                <View style={styles.bookCardWrapper}>
                  <BookCard
                    title={item.title}
                    author={item.author_name?.join(", ") ?? "Unknown author"}
                    publishedYear={item.first_publish_year}
                    coverId={item.cover_i}
                    onPress={() => handleBookPress(item)}
                  />
                </View>
              )}
            />
          ) : (
            <Text style={styles.secondaryText}>
              No recommendations available yet.
            </Text>
          )}
        </View>

        {/* More in Your Genres */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>More in Your Genres</Text>

          {isLoadingMoreBooks ? (
            <ActivityIndicator size="small" color="#40C4AA" />
          ) : moreGenreBooks.length > 0 ? (
            <FlatList
              key="more-genre-books-carousel"
              data={moreGenreBooks}
              horizontal
              keyExtractor={(item) => item.key}
              showsHorizontalScrollIndicator={false}
              onEndReached={loadMoreGenreBooks}
              onEndReachedThreshold={0.5}
              contentContainerStyle={styles.bookCarousel}
              renderItem={({ item }) => (
                <View style={styles.bookCardWrapper}>
                  <BookCard
                    title={item.title}
                    author={item.author_name?.[0] ?? "Unknown Author"}
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
                </View>
              )}
            />
          ) : (
            <Text style={styles.secondaryText}>
              No additional books found in your selected genres.
            </Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Favourite Authors</Text>

          {isLoadingAuthors ? (
            <ActivityIndicator size="large" color="#40C4AA" />
          ) : favoriteAuthors.length > 0 ? (
            <FlatList
              data={favoriteAuthors}
              key="favourite-authors-carousel"
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingRight: 10 }}
              keyExtractor={(item) => item.key}
              renderItem={({ item }) => {
                const photoUrl = getAuthorPhotoUrl(item);

                return (
                  <View style={styles.authorCard}>
                    {photoUrl ? (
                      <Image
                        source={{ uri: photoUrl }}
                        style={styles.authorImage}
                        contentFit="cover"
                        transition={200}
                      />
                    ) : (
                      <View style={styles.authorPlaceholder}>
                        <Text style={styles.authorInitial}>
                          {item.name.charAt(0).toUpperCase()}
                        </Text>
                      </View>
                    )}

                    <Text style={styles.authorName} numberOfLines={2}>
                      {item.name}
                    </Text>
                  </View>
                );
              }}
            />
          ) : (
            <Text style={styles.secondaryText}>
              Your favourite authors will appear here.
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#080000",
  },
header: {
  paddingHorizontal: 20,
  paddingTop: 12,
},

brand: {
  fontSize: 29,
  fontWeight: "700",
  color: "#40C4AA",
  letterSpacing: 0.4,
},

welcomeSection: {
  paddingHorizontal: 20,
  marginTop: 26,
  marginBottom: 30,
},

greeting: {
  fontSize: 26,
  fontWeight: "700",
  color: "#FFFFFF",
  letterSpacing: 0.2,
},

subtitle: {
  color: "#AAAAAA",
  fontSize: 14,
  lineHeight: 21,
  marginTop: 8,
},

  section: {
    paddingHorizontal: 20,
    marginBottom: 36,
  },
  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 21,
    fontWeight: "700",
    marginBottom: 18,
    letterSpacing: 0.3
  },
  secondaryText: {
    color: "#999999",
    fontSize: 14,
    lineHeight: 21,
  },
  genreContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
genreChip: {
  backgroundColor: "#191919",
  borderWidth: 1,
  borderColor: "#285F55",
  paddingHorizontal: 15,
  paddingVertical: 9,
  borderRadius: 20,
},

genreText: {
  color: "#40C4AA",
  fontSize: 13,
  fontWeight: "600",
},

  bookCarousel: {
    paddingRight: 10,
  },

  bookCardWrapper: {
    width: 175,
    marginRight: 14,
  },

  authorCard: {
    width: 125,
    marginRight: 14,
    alignItems: "center",
    backgroundColor: "#191919",
    borderRadius: 14,
    padding: 12,
  },

  authorImage: {
    width: 95,
    height: 110,
    borderRadius: 12,
    backgroundColor: "#292929",
  },

  authorPlaceholder: {
    width: 95,
    height: 110,
    borderRadius: 12,
    backgroundColor: "#292929",
    justifyContent: "center",
    alignItems: "center",
  },

  authorInitial: {
    color: "#40C4AA",
    fontSize: 36,
    fontWeight: "bold",
  },

  authorName: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 10,
  },

  heroBanner: {
    height: 230,
    marginHorizontal: 20,
    marginBottom: 32,
    borderRadius: 18,
    overflow: "hidden",
    position: "relative",
    backgroundColor: "#191919",
  },

  heroImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },

  heroOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 20,
  },

heroButton: {
  backgroundColor: "#40C4AA",
  paddingHorizontal: 18,
  paddingVertical: 11,
  borderRadius: 10,
  alignSelf: "flex-start",
  marginBottom: 9,
},

  heroButtonText: {
    color: "#080000",
    fontSize: 15,
    fontWeight: "bold",
  },
});

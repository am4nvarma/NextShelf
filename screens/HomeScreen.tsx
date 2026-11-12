import { View, Text, StyleSheet, ScrollView, ActivityIndicator, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../contexts/AuthContext";
import { useEffect, useState } from "react";
import { getUserPreferences } from "../services/preferencesApi";

import { getPersonalizedBooksByGenres, getAuthorDetails } from "../services/bookApi";
import type { OpenLibraryBook, BookAuthor } from "../types/book";
import BookCard from "../components/BookCard";
import { Image } from "expo-image";
import { useRouter } from "expo-router";

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
        selectedAuthors.map((authorKey) =>
          getAuthorDetails(authorKey),
        ),
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
  <Text style={styles.sectionTitle}>
    Picked For You
  </Text>

  {isLoadingBooks ? (
    <ActivityIndicator size="large" color="#40C4AA" />
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
  contentContainerStyle={{
    paddingRight: 10,
  }}
  renderItem={({ item }) => (
    <View style={{ width: 175 }}>
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
    fontSize: 30,
    fontWeight: "bold",
    color: "#40C4AA",
  },
  welcomeSection: {
    paddingHorizontal: 20,
    marginTop: 28,
    marginBottom: 32,
  },
  greeting: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  subtitle: {
    color: "#AAAAAA",
    fontSize: 14,
    marginTop: 8,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
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
    borderColor: "#40C4AA",
    paddingHorizontal: 15,
    paddingVertical: 9,
    borderRadius: 20,
  },
  genreText: {
    color: "#40C4AA",
    fontSize: 13,
    fontWeight: "600",
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

});

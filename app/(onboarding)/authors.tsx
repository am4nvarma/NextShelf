import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  getPersonalizedAuthorRecommendations,
  getAuthorDetails,
} from "../../services/bookApi";
import type { AuthorRecommendation } from "../../types/book";
import { useAuth } from "../../contexts/AuthContext";
import {
  saveUserPreferences,
  getUserPreferences,
} from "../../services/preferencesApi";

export default function AuthorSelectionScreen() {
  const { genres: genresParam } = useLocalSearchParams<{
    genres?: string | string[];
  }>();

  const router = useRouter();
  const { user } = useAuth();

  // Safely recover the genres sent from the previous screen.
  const selectedGenres = useMemo(() => {
    try {
      const rawGenres = Array.isArray(genresParam)
        ? genresParam[0]
        : genresParam;

      const parsed = rawGenres ? JSON.parse(rawGenres) : [];

      return Array.isArray(parsed)
        ? parsed.filter((item): item is string => typeof item === "string")
        : [];
    } catch {
      return [];
    }
  }, [genresParam]);

  const [authors, setAuthors] = useState<AuthorRecommendation[]>([]);
  const [previouslySelectedAuthors, setPreviouslySelectedAuthors] = useState<
    AuthorRecommendation[]
  >([]);
  const [selectedAuthors, setSelectedAuthors] = useState<string[]>([]);
  const [isLoadingPreferences, setIsLoadingPreferences] = useState(true);
  const [preferencesError, setPreferencesError] = useState("");
  const [failedImages, setFailedImages] = useState<string[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadSavedAuthors() {
      if (!user) {
        setPreferencesError("Please log in to continue.");
        setIsLoadingPreferences(false);
        return;
      }

      try {
        setIsLoadingPreferences(true);
        setPreferencesError("");

        const preferences = await getUserPreferences(user.id);

        if (isMounted) {
          setSelectedAuthors(preferences?.selected_authors ?? []);
        }
      } catch (error) {
        console.error("Loading saved authors failed:", error);

        if (isMounted) {
          setPreferencesError(
            "Unable to load your saved authors. Please try again.",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoadingPreferences(false);
        }
      }
    }

    loadSavedAuthors();

    return () => {
      isMounted = false;
    };
  }, [user?.id]);

  // Fetch recommendations whenever the selected genres change.
  useEffect(() => {
    const controller = new AbortController();

    async function loadAuthors() {
      if (selectedGenres.length === 0) {
        setError("No genres were selected. Please go back and select genres.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError("");

        const recommendations = await getPersonalizedAuthorRecommendations(
          selectedGenres,
          controller.signal,
        );

        setAuthors(recommendations);
      } catch (err) {
        if (controller.signal.aborted) return;

        console.error("Author recommendation error:", err);
        setError("We couldn't load authors. Please try again.");
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    loadAuthors();

    return () => controller.abort();
  }, [selectedGenres, retryCount]);
useEffect(() => {
  let isMounted = true;

  async function loadMissingAuthors() {
    // Wait until both saved selections and recommendations have loaded.
    if (isLoadingPreferences || isLoading) return;

    const missingAuthorKeys = selectedAuthors.filter(
      (key) => !authors.some((author) => author.key === key),
    );

    if (missingAuthorKeys.length === 0) {
      setPreviouslySelectedAuthors([]);
      return;
    }

    try {
      const results = await Promise.allSettled(
        missingAuthorKeys.map((key) => getAuthorDetails(key)),
      );

      if (!isMounted) return;

     const recoveredAuthors = results
  .map((result, index): AuthorRecommendation | null => {
    if (result.status !== "fulfilled") {
      console.warn(
        "Could not recover saved author:",
        missingAuthorKeys[index],
      );
      return null;
    }

    const savedKey = missingAuthorKeys[index];
    const authorId = savedKey.replace("/authors/", "");

    return {
      key: savedKey,
      name: result.value.name,
      genres: ["Previously selected"],
      workCount: 0,
      photoUrl: `https://covers.openlibrary.org/a/olid/${authorId}-M.jpg`,
    };
  })
  .filter(
    (author): author is AuthorRecommendation => author !== null,
  );

setPreviouslySelectedAuthors(recoveredAuthors);
    } catch (error) {
      console.error("Recovering previously selected authors failed:", error);
    }
  }

  loadMissingAuthors();

  return () => {
    isMounted = false;
  };
}, [
  authors,
  selectedAuthors,
  isLoading,
  isLoadingPreferences,
]);
  

  

  

  // Select or deselect an author.
  const toggleAuthor = (authorKey: string) => {
    setSelectedAuthors((previous) =>
      previous.includes(authorKey)
        ? previous.filter((key) => key !== authorKey)
        : [...previous, authorKey],
    );
  };

  

  const handleContinue = async () => {
    if (!user) {
      setSaveError("Please log in before saving your preferences.");
      return;
    }

    try {
      setIsSaving(true);
      setSaveError("");

      await saveUserPreferences({
        userId: user.id,
        selectedGenres,
        selectedAuthors,
      });

      console.log("NEXTSHELF PREFERENCES SAVED SUCCESSFULLY");

      router.replace("/");
    } catch (error) {
      console.error("Preference saving error:", error);

      setSaveError(
        error instanceof Error
          ? error.message
          : "Unable to save your preferences. Please try again.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const renderAuthor = ({ item }: { item: AuthorRecommendation }) => {
    const isSelected = selectedAuthors.includes(item.key);
    const hasImage = item.photoUrl && !failedImages.includes(item.key);

    return (
      <Pressable
        style={[styles.authorCard, isSelected && styles.selectedCard]}
        onPress={() => toggleAuthor(item.key)}
      >
        <View style={styles.imageContainer}>
          {hasImage ? (
            <Image
              source={{ uri: item.photoUrl }}
              style={styles.authorImage}
              contentFit="cover"
              transition={200}
              onError={() =>
                setFailedImages((previous) =>
                  previous.includes(item.key)
                    ? previous
                    : [...previous, item.key],
                )
              }
            />
          ) : (
            <View style={styles.initialsContainer}>
              <Text style={styles.initials}>
                {item.name.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}

          {isSelected && (
            <View style={styles.checkBadge}>
              <Text style={styles.checkText}>✓</Text>
            </View>
          )}
        </View>

        <Text style={styles.authorName} numberOfLines={2}>
          {item.name}
        </Text>

        <Text style={styles.genreLabel} numberOfLines={2}>
          {item.genres.join(" • ")}
        </Text>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={authors}
        keyExtractor={(item) => item.key}
        renderItem={renderAuthor}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            <Text style={styles.step}>STEP 2 OF 2</Text>

            <Text style={styles.title}>Choose Your Favourite Authors</Text>

            <Text style={styles.subtitle}>
              Discover authors based on the genres you love. Select as many as
              you like.
            </Text>

            <View style={styles.counterContainer}>
              <Text style={styles.counter}>
                {selectedAuthors.length} authors selected
              </Text>
              <Text style={styles.genreCount}>
                {selectedGenres.length} genres
              </Text>
            </View>

            {previouslySelectedAuthors.length > 0 && (
              <View style={styles.previousAuthorsSection}>
                <Text style={styles.previousAuthorsTitle}>
                  Previously Selected Authors
                </Text>

                <View style={styles.previousAuthorsGrid}>
                  {previouslySelectedAuthors.map((item) => (
                    <View key={item.key}>{renderAuthor({ item })}</View>
                  ))}
                </View>

                <Text style={styles.previousAuthorsHint}>
                  Your saved authors are kept here even when they aren't in the
                  latest recommendations.
                </Text>
              </View>
            )}
          </View>
        }

        ListEmptyComponent={
          isLoading ? (
            <View style={styles.centerContainer}>
              <ActivityIndicator size="large" color="#40C4AA" />
              <Text style={styles.loadingText}>
                Discovering your authors...
              </Text>
            </View>
          ) : error ? (
            <View style={styles.centerContainer}>
              <Text style={styles.errorText}>{error}</Text>

              <Pressable
                style={styles.retryButton}
                onPress={() => setRetryCount((count) => count + 1)}
              >
                <Text style={styles.retryText}>Try Again</Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.centerContainer}>
              <Text style={styles.errorText}>
                No authors found for these genres.
              </Text>
            </View>
          )
        }
        ListFooterComponent={
          authors.length > 0 ? (
            <View>
              {saveError !== "" && (
                <Text style={styles.errorText}>{saveError}</Text>
              )}

              <Pressable
                style={[styles.continueButton, isSaving && { opacity: 0.6 }]}
                onPress={handleContinue}
                disabled={isSaving}
              >
                {isSaving ? (
                  <ActivityIndicator color="#080000" />
                ) : (
                  <Text style={styles.continueText}>Continue</Text>
                )}
              </Pressable>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#080000",
  },
  listContent: {
    paddingHorizontal: 18,
    paddingTop: 20,
    paddingBottom: 30,
  },
  step: {
    color: "#40C4AA",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 2,
    marginBottom: 12,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 27,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    color: "#999999",
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 22,
  },
  counterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },
  counter: {
    color: "#40C4AA",
    fontSize: 14,
    fontWeight: "600",
  },
  genreCount: {
    color: "#888888",
    fontSize: 13,
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 14,
  },
  authorCard: {
    width: "48%",
    backgroundColor: "#191919",
    borderRadius: 16,
    padding: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#292929",
  },
  selectedCard: {
    borderColor: "#40C4AA",
    backgroundColor: "#10231F",
  },
  imageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: "hidden",
    marginBottom: 12,
    position: "relative",
  },
  authorImage: {
    width: "100%",
    height: "100%",
  },
  initialsContainer: {
    flex: 1,
    backgroundColor: "#263D38",
    justifyContent: "center",
    alignItems: "center",
  },
  initials: {
    color: "#40C4AA",
    fontSize: 38,
    fontWeight: "bold",
  },
  checkBadge: {
    position: "absolute",
    right: 2,
    top: 2,
    backgroundColor: "#40C4AA",
    width: 25,
    height: 25,
    borderRadius: 13,
    justifyContent: "center",
    alignItems: "center",
  },
  checkText: {
    color: "#080000",
    fontSize: 16,
    fontWeight: "bold",
  },
  authorName: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 6,
  },
  genreLabel: {
    color: "#40C4AA",
    fontSize: 11,
    textAlign: "center",
    marginBottom: 4,
  },
  centerContainer: {
    paddingVertical: 65,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    color: "#AAAAAA",
    marginTop: 15,
    fontSize: 14,
  },
  errorText: {
    color: "#FFFFFF",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 18,
  },
  retryButton: {
    backgroundColor: "#40C4AA",
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 10,
  },
  retryText: {
    color: "#080000",
    fontWeight: "bold",
  },
  continueButton: {
    backgroundColor: "#40C4AA",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 20,
  },
  continueText: {
    color: "#080000",
    fontSize: 16,
    fontWeight: "bold",
  },
  previousAuthorsSection: {
  marginBottom: 25,
},

previousAuthorsTitle: {
  color: "#FFFFFF",
  fontSize: 17,
  fontWeight: "bold",
  marginBottom: 14,
},

previousAuthorsGrid: {
  flexDirection: "row",
  flexWrap: "wrap",
  justifyContent: "space-between",
  rowGap: 14,
},

previousAuthorsHint: {
  color: "#888888",
  fontSize: 12,
  marginTop: 12,
  lineHeight: 18,
},
});

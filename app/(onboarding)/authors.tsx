
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import { getPersonalizedAuthorRecommendations } from "../../services/bookApi";
import type { AuthorRecommendation } from "../../types/book";

export default function AuthorSelectionScreen() {
  const { genres: genresParam } = useLocalSearchParams<{
    genres?: string | string[];
  }>();

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
  const [selectedAuthors, setSelectedAuthors] = useState<string[]>([]);
  const [failedImages, setFailedImages] = useState<string[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

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

        const recommendations =
          await getPersonalizedAuthorRecommendations(
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

  // Select or deselect an author.
  const toggleAuthor = (authorKey: string) => {
    setSelectedAuthors((previous) =>
      previous.includes(authorKey)
        ? previous.filter((key) => key !== authorKey)
        : [...previous, authorKey],
    );
  };

  const handleContinue = () => {
    console.log("NEXTSHELF SELECTED GENRES:", selectedGenres);
    console.log("NEXTSHELF SELECTED AUTHORS:", selectedAuthors);
  };

  const renderAuthor = ({
    item,
  }: {
    item: AuthorRecommendation;
  }) => {
    const isSelected = selectedAuthors.includes(item.key);
    const hasImage = item.photoUrl && !failedImages.includes(item.key);

    return (
      <Pressable
        style={[
          styles.authorCard,
          isSelected && styles.selectedCard,
        ]}
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

            <Text style={styles.title}>
              Choose Your Favourite Authors
            </Text>

            <Text style={styles.subtitle}>
              Discover authors based on the genres you love.
              Select as many as you like.
            </Text>

            <View style={styles.counterContainer}>
              <Text style={styles.counter}>
                {selectedAuthors.length} authors selected
              </Text>
              <Text style={styles.genreCount}>
                {selectedGenres.length} genres
              </Text>
            </View>
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
            <Pressable
              style={styles.continueButton}
              onPress={handleContinue}
            >
              <Text style={styles.continueText}>Continue</Text>
            </Pressable>
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
});

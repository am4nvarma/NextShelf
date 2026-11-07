import { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router"; 

const genres = [
  { name: "Fantasy", icon: "sparkles-outline" },
  { name: "Romance", icon: "heart-outline" },
  { name: "Mystery", icon: "search-outline" },
  { name: "Thriller", icon: "eye-outline" },
  { name: "Science Fiction", icon: "planet-outline" },
  { name: "Fiction", icon: "book-outline" },
  { name: "Historical Fiction", icon: "time-outline" },
  { name: "Horror", icon: "skull-outline" },
  { name: "Adventure", icon: "compass-outline" },
  { name: "Biography", icon: "person-outline" },
  { name: "Self Help", icon: "leaf-outline" },
  { name: "Philosophy", icon: "bulb-outline" },
  { name: "Poetry", icon: "create-outline" },
  { name: "Non-Fiction", icon: "library-outline" },
  { name: "Young Adult", icon: "people-outline" },
  { name: "Crime", icon: "finger-print-outline" },
];

export default function GenreScreen() {
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  
  const router = useRouter();

  const toggleGenre = (genre: string) => {
    setSelectedGenres((previous) =>
      previous.includes(genre)
        ? previous.filter((item) => item !== genre)
        : [...previous, genre],
    );
  };

  // We will connect this to Author Selection in the next step.
  const handleContinue = () => {
    router.push({
        pathname: "/authors",
        params: {
            genres: JSON.stringify(selectedGenres)
        },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.progressContainer}>
          <View style={styles.progressActive} />
          <View style={styles.progressInactive} />
        </View>

        <Text style={styles.stepText}>What do you love{"/n"}to read?</Text>

        <Text style={styles.subtitle}>
          Choose your favourite genres and we'll create a bookshelf that feels
          like yours.
        </Text>

        <View style={styles.selectionInfo}>
          <Text style={styles.selectionTitle}>Choose your genres</Text>

          <Text style={styles.selectionCount}>
            {selectedGenres.length} selected
          </Text>
        </View>

        <View style={styles.genreGrid}>
          {genres.map((genre) => {
            const isSelected = selectedGenres.includes(genre.name);

            return (
              <Pressable
                key={genre.name}
                style={[
                  styles.genreCard,
                  isSelected && styles.genreCardSelected,
                ]}
                onPress={() => toggleGenre(genre.name)}
              >
                <Ionicons
                  name={genre.icon as React.ComponentProps<typeof Ionicons>["name"]}
                  size={23}
                  color={isSelected ? "#40C4AA" : "#AAAAAA"}
                />

                <Text
                  style={[
                    styles.genreName,
                    isSelected && styles.genreNameSelected,
                  ]}
                >
                  {genre.name}
                </Text>

                {isSelected && (
                  <View style={styles.checkIcon}>
                    <Ionicons
                      name="checkmark-circle"
                      size={17}
                      color="#40C4AA"
                    />
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.helperText}>
          You can select multiple genres. You can change your
          preferences later.
        </Text>

        <Pressable
          style={[
            styles.continueButton,
            selectedGenres.length === 0 && styles.continueDisabled,
          ]}
          onPress={handleContinue}
          disabled={selectedGenres.length === 0}
        >
          <Text style={styles.continueText}>Continue</Text>
          <Ionicons name="arrow-forward" size={20} color="#080000" />
        </Pressable>    

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#080000",
  },
  scrollContent: {
    paddingHorizontal: 22,
    paddingTop: 20,
    paddingBottom: 35,
  },
  progressContainer: {
    flexDirection: "row",
    gap: 7,
    marginBottom: 25,
  },
  progressActive: {
    height: 4,
    flex: 1,
    borderRadius: 5,
    backgroundColor: "#40C4AA",
  },
  progressInactive: {
    height: 4,
    flex: 1,
    borderRadius: 5,
    backgroundColor: "#333333",
  },
  stepText: {
    color: "#40C4AA",
    fontSize: 11,
    fontWeight: "bold",
    letterSpacing: 2,
    marginBottom: 12,
  },
  heading: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "bold",
    lineHeight: 38,
  },
  subtitle: {
    color: "#999999",
    fontSize: 14,
    lineHeight: 22,
    marginTop: 10,
    marginBottom: 28,
  },
  selectionInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  selectionTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  selectionCount: {
    color: "#40C4AA",
    fontSize: 12,
  },
  genreGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 12,
  },
  genreCard: {
    width: "48%",
    minHeight: 88,
    backgroundColor: "#191919",
    borderWidth: 1,
    borderColor: "#303030",
    borderRadius: 13,
    padding: 13,
    justifyContent: "center",
    gap: 8,
    position: "relative",
  },
  genreCardSelected: {
    backgroundColor: "#142923",
    borderColor: "#40C4AA",
  },
  genreName: {
    color: "#DDDDDD",
    fontSize: 13,
    fontWeight: "500",
  },
  genreNameSelected: {
    color: "#40C4AA",
  },
  checkIcon: {
    position: "absolute",
    top: 9,
    right: 9,
  },
  helperText: {
    color: "#777777",
    fontSize: 11,
    lineHeight: 17,
    marginTop: 18,
  },
  continueButton: {
    backgroundColor: "#40C4AA",
    height: 53,
    borderRadius: 13,
    marginTop: 24,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  continueDisabled: {
    opacity: 0.35,
  },
  continueText: {
    color: "#080000",
    fontSize: 15,
    fontWeight: "bold",
  },
});

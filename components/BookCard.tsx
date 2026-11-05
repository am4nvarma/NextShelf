import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { Image } from "expo-image";

type BookCardProps = {
  title: string;
  author: string;
  publishedYear?: number;
  rating?: number;
  coverId?: number;
  onPress: () => void;
};

function BookCard({
  title,
  author,
  publishedYear,
  rating,
  coverId,
  onPress,
}: BookCardProps) {
  const [imageLoaded, setImageLoaded] = React.useState(false);
  const [imageError, setImageError] = React.useState(false);
  React.useEffect(() => {
    setImageLoaded(false);
    setImageError(false);
  }, [coverId]);
  return (
    <Pressable style={styles.card} onPress={onPress}>
      {coverId && !imageError ? (
        <View style={styles.coverContainer}>
          {!imageLoaded && (
            <View style={styles.loadingPlaceholder}>
              <ActivityIndicator size="small" color="#40C4AA" />
            </View>
          )}

          <Image
            source={{
              uri: `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`,
            }}
            style={[styles.cover, { opacity: imageLoaded ? 1 : 0 }]}
            contentFit="fill"
            cachePolicy="memory-disk"
            transition={200}
            contentPosition={"center"}
            onLoad={() => {
              setImageLoaded(true);
            }}
            onLoadStart={() => setImageLoaded(false)}
            onError={() => {
              setImageError(true);
              setImageLoaded(false);
            }}
          />
        </View>
      ) : (
        <View style={styles.coverPlaceholder}>
          <Text style={styles.placeholderText}> No cover</Text>
        </View>
      )}

      <Text style={styles.title} numberOfLines={2}>
        {title}
      </Text>

      <Text style={styles.author}>{author}</Text>

      <View style={styles.footer}>
        {publishedYear !== undefined && (
          <Text style={styles.year}>{publishedYear}</Text>
        )}

        {rating !== undefined && <Text style={styles.rating}>★ {rating}</Text>}
      </View>
    </Pressable>
  );
}

export default React.memo(BookCard);

const styles = StyleSheet.create({
  card: {
    flex: 1,
    padding: 12,
    marginHorizontal: 6,
    marginVertical: 8,
    backgroundColor: "#191919",
    borderRadius: 12,
    minHeight: 320,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
    minHeight: 40,
  },
  author: {
    flex: 1,
    fontSize: 14,
    color: "#AAAAAA",
    marginTop: 6,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },
  year: {
    fontSize: 12,
    color: "#40C4AA",
  },
  rating: {
    fontSize: 12,
    color: "#F5C451",
  },
  cover: {
    width: "100%",
    height: 190,
    borderRadius: 10,
    marginBottom: 10,
  },
  coverPlaceholder: {
    width: "100%",
    height: 190,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: "#292929",
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderText: {
    color: "#AAAAAA",
    fontSize: 13,
  },
  coverContainer: {
    width: "100%",
    height: 190,
    marginBottom: 10,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#292929",
  },
  loadingPlaceholder: {
    ...StyleSheet.absoluteFill,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#292929",
  },
});

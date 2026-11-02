
import { View, Text, FlatList, StyleSheet, TextInput } from "react-native";
import BookCard from "../components/BookCard";

const books = [
  {
    id: "1",
    title: "Atomic Habits",
    author: "James Clear",
    publishedYear: 2018,
    rating: 4.5,
  },
  {
    id: "2",
    title: "The Alchemist",
    author: "Paulo Coelho",
    publishedYear: 1988,
    rating: 4.2,
  },
  {
    id: "3",
    title: "The Psychology of Money",
    author: "Morgan Housel",
    publishedYear: 2020,
    rating: 4.6,
  },
  {
    id: "4",
    title: "Rich Dad Poor Dad",
    author: "Robert Kiyosaki",
    publishedYear: 1997,
    rating: 4.1,
  },
];

export default function DiscoveryScreen () {
  return (
    <View style = {styles.container}>
      <Text style = {styles.brand}>NextShelf</Text>

      <Text style = {styles.heading}>Discover Books</Text>

      <FlatList 
      data = {books}
      keyExtractor = {(item) => item.id }
      numColumns={2}
      columnWrapperStyle={{
        justifyContent:"space-between"
      }}
      contentContainerStyle={{
        paddingBottom:20
      }}
      renderItem = {({ item }) => (
        <BookCard
        title={item.title}
        author={item.author}
        publishedYear={item.publishedYear}
        rating={item.rating}
        />
      )}
      />
    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    width:"100%",
    backgroundColor: "#0b0000",
    padding: 16,
    paddingTop:20,
  },
  heading: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 20,
    marginLeft:5,
  },
  brand: {
  fontSize: 32,
  fontWeight: "bold",
  color: "#40C4AA",
  marginBottom: 10,
  marginLeft:5,
},
});

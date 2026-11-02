
import { View, Text, FlatList, StyleSheet, TextInput } from "react-native";
import BookCard from "../components/BookCard";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";

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
  const [ searchQuery, setSearchQuery] = useState(""); 

  const filteredBooks = books.filter((book) => {
    const query = searchQuery.toLowerCase();

    return (
      book.title.toLowerCase().includes(query) ||
      book.author.toLocaleLowerCase().includes(query)
    )
  })
  return (
    <View style = {styles.container}>
      <Text style = {styles.brand}>NextShelf</Text>

      <Text style = {styles.heading}>Discover Books</Text>

    <View style = {styles.searchContainer}>
    <Ionicons 
    name="search-outline"
    size={20}
    color="#999999"
    />

    <TextInput
    style={styles.searchInput}
    placeholder="Search books, authors... "
    placeholderTextColor="#999999"
    value={searchQuery}
    onChangeText={setSearchQuery}
    />
    </View>

      <FlatList 
      data = {filteredBooks}
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
      ListEmptyComponent={
        <Text style = {styles.emptySearch}>
          No Books Found. Try another search
        </Text>
      }
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
searchContainer: {
  flexDirection:"row",
  alignItems:"center",
  backgroundColor: "#191919",
  borderRadius:10,
  height:52,
  marginBottom:15,
  borderWidth:1,
  borderColor: "#292929",
  paddingHorizontal: 14
  
},
searchInput: {
  flex: 1,
  color: "#FFFFFF",
  fontSize: 15,
  marginLeft: 1 ,
},
emptySearch: {
  color: "#AAAAAA",
  textAlign: "center",
  marginTop: 40,
  fontSize: 15,
}

});

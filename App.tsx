import { StatusBar } from "expo-status-bar";
import { View, Text, StyleSheet, Button } from "react-native";
import BookCard from "./components/BookCard";


export default function App () {

  return (
      <View style = {styles.container}>
      
      <Text style = {styles.title}>NextShelf</Text>

      <BookCard 
      title = "48 laws of Power"
      author="David Gogging"
      publishedYear={2002}
      />

      <BookCard
      title="Demon Slayer"
      author="Ghibili Studio"/>

      

      <StatusBar style="light"/>

    </View>
  )
}

const styles = StyleSheet.create({
  container : {
    flex:1,
    backgroundColor:'#0b0000',
    alignItems:'center',
    //justifyContent:'center',
    padding:10,
    
  },

  title : {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: 'bold'
  },

  subtitle: {
    color: '#aaaaaa',
    fontSize: 16,
    marginTop:10
  },

  bookcard : {
    padding: 20,
    marginTop:10,
    color:"red"
  }
})
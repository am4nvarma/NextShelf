import { StatusBar } from "expo-status-bar";
import { View, StyleSheet} from "react-native";
import DiscoveryScreen from "./screens/DiscoveryScreen";


export default function App () {

  return (
      <View style = {styles.container}>
      
      <DiscoveryScreen/>

      <StatusBar style="light"/>

    </View>
  )
}

const styles = StyleSheet.create({
  container : {
    flex:1,
    backgroundColor:'#0b0000',
  },
})
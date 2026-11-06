import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuth } from "../../contexts/AuthContext";

export default function LoginScreen() {
  const router = useRouter();
  const { signIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim || !password) {
      Alert.alert(
        "Missing information",
        "Please Enter Your email and password",
      );
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email.trim())) {
      Alert.alert("Invalid Email", "Enter Valid Email");
      return;
    }

    try {
      setIsLoading(true);

      const { error } = await signIn(email, password);

      if (error) {
        Alert.alert("Login Failed", error);
        return;
      }

      router.replace("/");
    } catch {
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <Text style={styles.logo}>Next</Text>
          <Text style={styles.logoAccent}>Shelf</Text>

          <Text style={styles.heading}>Welcome Back</Text>

          <Text style={styles.subtitle}>
            Sign in to Continue your reading journey.
          </Text>

          <Text style={styles.label}>Email Address</Text>

          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color="#999" />

            <TextInput
              style={styles.input}
              placeholder="Enter Your Email"
              placeholderTextColor="#777"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              textContentType="emailAddress"
              returnKeyType="next"
            />
          </View>

          <Text style={styles.label}>Password</Text>

          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color="#999" />

            <TextInput 
            style = {styles.input}
            placeholder="Enter Your PassWord"
            placeholderTextColor="#777"
            value = {password}
            onChangeText={setPassword}
            secureTextEntry = {!showPassword}
            autoCapitalize="none"
            textContentType="password"
            returnKeyType="done"
            onSubmitEditing={handleLogin}
            />

            <Pressable onPress={() => setShowPassword(!showPassword)}>
             <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={21}
                color="#999"
              />
            </Pressable>
          </View>

          <Pressable
          style = {styles.loginButton}
          onPress = {handleLogin}
          disabled = {isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#080000" />
            ) : (
              <Text style={styles.loginButtonText}>Login</Text>
            )}
          </Pressable>

          <View style = {styles.footer}>
            <Text style = {styles.footerText}>Don't have an account?{""}</Text>

            <Pressable onPress = {() => router.push ("/signup")}>
            <Text style = {styles.signupText}>Sign Up</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#080000",
  },

  scrollView: {
    flex: 1,
    backgroundColor: "#080000",
  },

  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    backgroundColor: "#080000",
  },

  content: {
    paddingHorizontal: 28,
    paddingVertical: 40,
  },

  logo: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 38,
  },

  logoAccent: {
    color: "#40C4AA",
  },

  heading: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 14,
    color: "#999",
    marginBottom: 32,
  },

  label: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 9,
    marginTop: 18,
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#191919",
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 55,
    gap: 12,
  },

  input: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 15,
  },

  loginButton: {
    backgroundColor: "#40C4AA",
    height: 55,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 32,
  },

  loginButtonText: {
    color: "#080000",
    fontSize: 16,
    fontWeight: "bold",
  },

  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 28,
  },

  footerText: {
    color: "#999",
    fontSize: 14,
  },

  signupText: {
    color: "#40C4AA",
    fontSize: 14,
    fontWeight: "bold",
  },
});

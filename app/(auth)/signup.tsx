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

export default function SignupScreen() {
  const router = useRouter();
  const { signUp } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async () => {
    if (!email.trim() || !password || !confirmPassword) {
      Alert.alert("Missing Information", "Please fill in all fields.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      Alert.alert(
        "Weak Password",
        "Your password must contain at least 6 characters.",
      );
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Password Mismatch", "Your passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await signUp(email, password);

      if (error) {
        Alert.alert("Signup Failed", error);
        return;
      }

      Alert.alert(
        "Welcome to NextShelf!",
        "Your account has been created successfully.",
      );
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
          <Text style={styles.logo}>NextShelf</Text>

          <Text style={styles.heading}>Create Account</Text>

          <Text style={styles.subtitle}>Your next great read starts here.</Text>

          <View style={styles.form}>
            <Text style={styles.label}>Email Address</Text>

            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              autoComplete="email"
              textContentType="emailAddress"
              returnKeyType="next"
              placeholderTextColor="#888888"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />

            <Text style={styles.label}>Password</Text>

            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Create a password"
                autoComplete="new-password"
                textContentType="newPassword"
                placeholderTextColor="#888888"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />

              <Pressable
                onPress={() => setShowPassword(!showPassword)}
                hitSlop={10}
              >
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={22}
                  color="#40C4AA"
                />
              </Pressable>
            </View>

            <Text style={styles.label}>Confirm Password</Text>

            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Confirm your password"
                autoComplete="new-password"
                textContentType="newPassword"
                placeholderTextColor="#888888"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
              />

              <Pressable
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                hitSlop={10}
              >
                <Ionicons
                  name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                  size={22}
                  color="#40C4AA"
                />
              </Pressable>
            </View>

            <Pressable
              style={[styles.signupButton, isLoading && styles.disabledButton]}
              onPress={handleSignup}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#080000" />
              ) : (
                <Text style={styles.signupButtonText}>Create Account</Text>
              )}
            </Pressable>

            <Pressable
              style={styles.loginCard}
              onPress={() => router.push("/login")}
              android_ripple={{ color: "#254D46" }}
            >
              <View style={styles.loginCardContent}>
                <View style={styles.loginIcon}>
                  <Ionicons name="log-in-outline" size={25} color="#40C4AA" />
                </View>

                <View style={styles.loginInfo}>
                  <Text style={styles.loginTitle}>
                    Already have an account?
                  </Text>
                  <Text style={styles.loginSubtitle}>
                    Welcome back! Log in to continue reading.
                  </Text>
                </View>

                <Ionicons name="chevron-forward" size={22} color="#40C4AA" />
              </View>
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
    color: "#40C4AA",
    fontSize: 42,
    fontWeight: "bold",
    marginBottom: 35,
  },
  heading: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    color: "#AAAAAA",
    fontSize: 16,
    marginBottom: 35,
  },
  form: {
    width: "100%",
  },
  label: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 10,
    marginTop: 18,
  },
  input: {
    backgroundColor: "#191919",
    borderWidth: 1,
    borderColor: "#333333",
    borderRadius: 12,
    height: 56,
    paddingHorizontal: 16,
    color: "#FFFFFF",
    fontSize: 16,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#191919",
    borderWidth: 1,
    borderColor: "#333333",
    borderRadius: 12,
    height: 56,
    paddingHorizontal: 16,
  },
  passwordInput: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 16,
    height: "100%",
  },
  signupButton: {
    backgroundColor: "#40C4AA",
    height: 56,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 32,
  },
  disabledButton: {
    opacity: 0.6,
  },
  signupButtonText: {
    color: "#080000",
    fontSize: 17,
    fontWeight: "bold",
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 28,
  },
  loginText: {
    color: "#AAAAAA",
    fontSize: 14,
  },
  loginLink: {
    color: "#40C4AA",
    fontSize: 14,
    fontWeight: "bold",
  },
  scrollView: {
    flex: 1,
    backgroundColor: "#080000",
  },
  loginCard: {
    marginTop: 28,
    backgroundColor: "#191919",
    borderWidth: 1,
    borderColor: "#40C4AA",
    borderRadius: 14,
    padding: 16,
  },

  loginCardContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  loginIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#203B35",
    justifyContent: "center",
    alignItems: "center",
  },

  loginInfo: {
    flex: 1,
  },

  loginTitle: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "bold",
  },

  loginSubtitle: {
    color: "#AAAAAA",
    fontSize: 12,
    marginTop: 5,
  },
});

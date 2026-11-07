import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuth } from "../../contexts/AuthContext";

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const displayName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    "NextShelf Reader";

  const username = user?.email ? `@${user.email.split("@")[0]}` : "@reader";

  const showComingSoon = (feature: string) => {
    Alert.alert(feature, "This feature will be available soon!");
  };

  const handleLogout = async () => {
    Alert.alert("Log Out", "Are you sure you want to log out of NextShelf?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log Out",
        style: "destructive",
        onPress: async () => {
          const { error } = await signOut();

          if (error) {
            Alert.alert("Logout Failed", error);
          }
        },
      },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Account deletion is not available yet. We'll add a secure deletion process later.",
    );
  };

  const renderOption = (
    icon: React.ComponentProps<typeof Ionicons>["name"],
    title: string,
    onPress: () => void,
  ) => (
    <Pressable
      style={styles.option}
      onPress={onPress}
      android_ripple={{ color: "#303030" }}
    >
      <View style={styles.optionLeft}>
        <Ionicons name={icon} size={19} color="#BBBBBB" />
        <Text style={styles.optionText}>{title}</Text>
      </View>

      <Ionicons name="chevron-forward" size={19} color="#AAAAAA" />
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.replace("/")} hitSlop={10}>
          <Ionicons name="chevron-back" size={25} color="#FFFFFF" />
        </Pressable>

        <Text style={styles.headerTitle}>Profile</Text>

        <Pressable onPress={() => showComingSoon("Settings")} hitSlop={10}>
          <Ionicons name="settings-outline" size={21} color="#FFFFFF" />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={38} color="#40C4AA" />
          </View>

          <Text style={styles.name}>{displayName}</Text>
          <Text style={styles.username}>{username}</Text>

          <View style={styles.optionsContainer}>
            {renderOption("person-outline", "My Details", () =>
              showComingSoon("My Details"),
            )}

            {renderOption("globe-outline", "App Language", () =>
              showComingSoon("App Language"),
            )}

            {renderOption("notifications-outline", "Notifications", () =>
              showComingSoon("Notifications"),
            )}

            {renderOption("shield-checkmark-outline", "Privacy Policy", () =>
              showComingSoon("Privacy Policy"),
            )}
          </View>
        </View>

        <View style={styles.accountActions}>
          <Pressable style={styles.actionButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color="#40C4AA" />
            <Text style={styles.logoutText}>Log Out</Text>
          </Pressable>

          <Pressable style={styles.actionButton} onPress={handleDeleteAccount}>
            <Ionicons name="trash-outline" size={19} color="#40C4AA" />
            <Text style={styles.deleteText}>Delete Account</Text>
          </Pressable>

          <Pressable 
          onPress = { () => router.push("/genres")}
          style={{
            backgroundColor: "#40C4AA",
            padding:16,
            borderRadius:12,
            margin: 20,
          }}
          >
            <Text style = {{ color: "080000", fontWeight:"bold" }}>
            Genre Onboarding Test
            </Text>
          </Pressable>

          
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#080000",
  },
  header: {
    height: 55,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 15,
    paddingBottom: 30,
  },
  profileCard: {
    backgroundColor: "#191919",
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingTop: 25,
    paddingBottom: 12,
    alignItems: "center",
  },
  avatar: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: "#203B35",
    borderWidth: 2,
    borderColor: "#40C4AA",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  name: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "bold",
  },
  username: {
    color: "#999999",
    fontSize: 12,
    marginTop: 4,
  },
  optionsContainer: {
    width: "100%",
    marginTop: 20,
  },
  option: {
    minHeight: 43,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 5,
  },
  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
  },
  optionText: {
    color: "#E5E5E5",
    fontSize: 14,
  },
  accountActions: {
    marginTop: 20,
    paddingHorizontal: 10,
    gap: 5,
  },
  actionButton: {
    minHeight: 43,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  logoutText: {
    color: "#40C4AA",
    fontSize: 14,
    fontWeight: "500",
  },
  deleteText: {
    color: "#DDDDDD",
    fontSize: 14,
  },
});


import "react-native-url-polyfill/auto";

import { createClient } from "@supabase/supabase-js";
import * as SecureStore from "expo-secure-store";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase environment variables. Check your .env file."
  );
}

// Secure storage adapter for Supabase authentication sessions
const ExpoSecureStoreAdapter = {
  getItem: (key: string) => {
    return SecureStore.getItemAsync(key);
  },

  setItem: (key: string, value: string) => {
    return SecureStore.setItemAsync(key, value);
  },

  removeItem: (key: string) => {
    return SecureStore.deleteItemAsync(key);
  },
};

// Create the Supabase client
export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      storage: ExpoSecureStoreAdapter,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);



export async function testSupabaseConnection(): Promise<void> {
  // Check whether the Supabase Auth server is reachable
  const response = await fetch(`${supabaseUrl}/auth/v1/settings`, {
    method: "GET",
    headers: {
      apikey: supabaseAnonKey!,
    },
  });

  if (!response.ok) {
    throw new Error(`Supabase returned HTTP ${response.status}`);
  }

  // Check whether the authentication client can access session storage
  const { error } = await supabase.auth.getSession();

  if (error) {
    throw error;
  }
}


import { supabase } from "../lib/supabase";

type SavePreferencesParams = {
  userId: string;
  selectedGenres: string[];
  selectedAuthors: string[];
};

export async function saveUserPreferences({
  userId,
  selectedGenres,
  selectedAuthors,
}: SavePreferencesParams) {
  const { error } = await supabase
    .from("user_preferences")
    .upsert(
      {
        user_id: userId,
        selected_genres: selectedGenres,
        selected_authors: selectedAuthors,
        onboarding_completed: true,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "user_id",
      },
    );

  if (error) {
    throw new Error(error.message);
  }
}

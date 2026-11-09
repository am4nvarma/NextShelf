
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

export type UserPreferences = {
  user_id : string;
  selected_genres : string[];
  selected_authors : string[];
  onboarding_completed : boolean;
}

export async function getUserPreferences(
  userId:string,
) : Promise<UserPreferences | null>{
  const {data, error} = await supabase
  .from("user_preferences")
  .select(
    "user_id, selected_genres, selected_authors, onboarding_completed", 
  )
  .eq("user_id", userId)
  .maybeSingle();

  if (error) {
    throw new Error (error.message);
  }

  return data;
}
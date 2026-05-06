import { supabase } from "../../supabase.ts";

export const getAthletes = async (req, res) => {
  const { data, error } = await supabase
    .from("athletes")
    .select("*");

  if (error) return res.json({ error: error.message });

  res.json(data);
};
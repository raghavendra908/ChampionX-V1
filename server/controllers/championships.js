import { supabase } from "../../supabase.ts";

// GET ALL
export const getChampionships = async (req, res) => {
  const { data, error } = await supabase
    .from("championships")
    .select("*");

  if (error) return res.json({ error: error.message });

  res.json(data);
};

// CREATE
export const createChampionship = async (req, res) => {
  const { title } = req.body;

  const { data, error } = await supabase
    .from("championships")
    .insert([{ title }]);

  if (error) return res.json({ error: error.message });

  res.json(data);
};
import { supabase } from "../../supabase.ts";

export const login = async (req, res) => {
  const { email, password } = req.body;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    return res.json({ error: error.message });
  }

  res.json({
    user: data.user,
    session: data.session
  });
};
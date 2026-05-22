import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ktuuwnwczgkjdtgiypvw.supabase.co";
const supabaseKey = "sb_publishable_abLOMqWVLL3pgcO74s2i_Q_YNS4j_wH";

export const supabase = createClient(supabaseUrl, supabaseKey);
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.SB_URL;
const supabaseKey = process.env.SB_API_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

const saveMessage = async ({ messageHuman, messageAI, tableName}) => {
    const { data, error } = await supabase
        .from(tableName)
        .insert([{human: messageHuman, ai: messageAI}]);
    if (error) {
        console.error("Error inserting message:", error);
    } else {
        console.log("Message inserted successfully:", data);
    }
};

export { saveMessage }


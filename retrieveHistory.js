import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.SB_URL;
const supabaseKey = process.env.SB_API_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

const retrieveHistory = async () => {
    const human_ai_messages = [];

    const { data: humanData, error: humanError } = await supabase
        .from('conversation')
        .select('human')
    if (humanError) {
        console.error("Error retrieving history:", humanError);
    } else {
        console.log("History retreived sucessfully:");
        for (let i = 0; i < humanData.length; i++) {
            human_ai_messages.push(humanData[i]);
        }
    }

    const { data: aiData, error: aiError } = await supabase
        .from('conversation')
        .select('ai')
    if (aiError) {
        console.error("Error retrieving history:", aiError);
    } else {
        console.log("History retreived sucessfully:");
        human_ai_messages.splice(1, 0, aiData[0])
        for (let i = 1; i < aiData.length; i++) {
            human_ai_messages.splice((2*i + 1), 0, aiData[i]);
        }
    }

    const conversationText = human_ai_messages.map(item => {
        return item.human ? item.human : item.ai;
    }).join('\n');
      
    return conversationText
};

export { retrieveHistory }


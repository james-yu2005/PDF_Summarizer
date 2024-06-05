import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import fs from 'fs/promises';
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { OpenAIEmbeddings } from '@langchain/openai';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const llm = async () => {
    try {
        // Read the content of scrimba.txt file
        const result = await fs.readFile('scrimba.txt', 'utf-8');

        // Split the text into chunks
        const splitter = new RecursiveCharacterTextSplitter({
            chunkSize: 500,
            chunkOverlap: 50
        });
        const output = await splitter.createDocuments([result]);

        // Retrieve environment variables
        const sbApiKey = process.env.SB_API_KEY;
        const sbUrl = process.env.SB_URL;
        const openAIApiKey = process.env.OPENAI_API_KEY;

        // Create a Supabase client
        const client = createClient(sbUrl, sbApiKey);

        // Store documents in Supabase VectorStore
        await SupabaseVectorStore.fromDocuments(
            output,
            // new OpenAIEmbeddings({ openAIApiKey }),
            {
                client,
                tableName: 'documents'
            }
        );
        
        console.log('Documents have been successfully stored.');
    } catch (err) {
        console.error('Error:', err);
    }
};

llm();

export default llm;

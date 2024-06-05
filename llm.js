import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence,RunnablePassthrough } from "@langchain/core/runnables";
import { retriever } from "./utils/retriever.js";
import { combineDocuments } from "./utils/combineDocuments.js";
import dotenv from 'dotenv';
dotenv.config();

const openAIApiKey = process.env.OPENAI_API_KEY;
//Creation of standalone question
const llm = new ChatOpenAI({ openAIApiKey });

const standaloneQuestionTemplate = "Please simplify this question into a standalone question: {question} standalone question:";
const standaloneQuestionPrompt = PromptTemplate.fromTemplate(standaloneQuestionTemplate);
const standaloneQuestionChain = RunnableSequence.from([
    standaloneQuestionPrompt,
    llm, 
    new StringOutputParser(),
]);
 
const retrieverChain = RunnableSequence.from([
    prevResult => prevResult.standalone_question,
    retriever,
    combineDocuments
])

const answerTemplate = "You are a helpful and enthusiastic support bot. Don't say the answer if you don't know it. context: {context} prompt: {prompt} answer:";
const answerPrompt = PromptTemplate.fromTemplate(answerTemplate);
const answerChain = RunnableSequence.from([
    answerPrompt,
    llm,
    new StringOutputParser(),
]);


const chain = RunnableSequence.from([
    {
        standalone_question: standaloneQuestionChain,
        original_input: new RunnablePassthrough()
    },
    {
        context: retrieverChain,
        prompt:({ original_input }) => original_input.question
    },
    answerChain
])

const response = await chain.invoke({
    question: "What is the technical requirement for learning scrimba? my laptop is dusty" 
})

console.log(response)





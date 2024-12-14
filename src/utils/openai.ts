import { OpenAI, OpenAIEmbeddings } from "@langchain/openai";

export const llm = new OpenAI({
  model: "gpt-3.5-turbo-0125",
  temperature: 0,
});

export const embedding = new OpenAIEmbeddings();

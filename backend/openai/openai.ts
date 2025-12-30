import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateQuestions = async (
  industry: string,
  topic: string,
  type: string,
  role: string,
  numQuestions: number,
  duration: number,
  difficulty: string
) => {
  //use token to control costs
  const tokensPerQuestion = 1500; //estimated tokens per question
  const maxTokens = numQuestions * tokensPerQuestion;

  const prompt = `Generate total "${numQuestions}" "${difficulty}" "${type}" questions for a ${role} role in the "${industry}" industry on the topic of "${topic}". 
  The interview is applied for a candidate applying for the role of "${role}" and total duration of the test should be ${duration} minutes. 

  **Ensure the following:**
  - The questions are well-balanced, including both open-ended and specific questions.
  - Each question is designed to evaluate a specific skill or knowledge area relevant to the role.
  - The questions should vary in "${difficulty}" interview in the "${industry}" industry, with a mix of easy, medium, and hard questions.
  - The questions are clear, concise, and engaging for the candidate.
  - Ensure the questions are directly aligned with the specified topic "${topic}", "${difficulty}" responsibilities and expertise in "${role}".
  - Avoid using yes/no questions; instead, focus on questions that require detailed responses.

  **Instructions:**
  - Always follow same format questions.
  - Provide all question without any prefix.
  - No question number or bullet points or hyphens - is required.
  - Each question should be separated by a newline.
`;

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You are expert in generating interview questions tailored to specific roles and industries, experience levels and topics. Your responses should be professional concise and well-structured. ",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    max_completion_tokens: maxTokens,
    temperature: 0.8, //higher temperature for more creative/random responses //gpt-5-mini doesn't support temperature
  });

  const content = response.choices[0].message?.content || "";

  if (!content) {
    throw new Error("Failed to generate questions");
  }

  const questions = content
    .trim()
    .split("\n")
    .filter((q) => q)
    .map((q) => ({
      question: q,
    }));

  return questions;
};

function extractScoresAndSuggestions(content: string) {
  const overallScoreMatch = content.match(/Overall Score:\s*(\d+)\/10/);
  const relevanceScoreMatch = content.match(/Relevance Score:\s*(\d+)\/10/);
  const clarityScoreMatch = content.match(/Clarity Score:\s*(\d+)\/10/);
  const completenessScoreMatch = content.match(
    /Completeness Score:\s*(\d+)\/10/
  );
  const suggestionsMatch = content.match(/Suggestions:\s*([\s\S]*)/);

  const overall = overallScoreMatch ? overallScoreMatch[1] : "0";
  const relevance = relevanceScoreMatch ? relevanceScoreMatch[1] : "0";
  const clarity = clarityScoreMatch ? clarityScoreMatch[1] : "0";
  const completeness = completenessScoreMatch ? completenessScoreMatch[1] : "0";
  const suggestions = suggestionsMatch ? suggestionsMatch[1].trim() : "";

  return {
    overallScore: parseInt(overall),
    relevance: parseInt(relevance),
    clarity: parseInt(clarity),
    completeness: parseInt(completeness),
    suggestions,
  };
}

export const evaluateAnswers = async (question: string, answer: string) => {
  const prompt = `
  Evaluate the following answer to the question based on the evaluation criteria and provide the scores for relevance, clarity, and completeness, followed by suggestions in text format.
  
  **Evaluation Criteria:**
    1. Overall Score: Provide an overall score out of 10 based on the quality of the answer.
    2. Relevance: Provide a score out of 10 based on how well or how relevant the answer addresses the question.
    3. Clarity: Provide a score out of 10 based on how clear, easy to understand and well-structured the answer is.
    4. Completeness: Provide a score out of 10 based on how comprehensive and detailed the answer covers all aspects of the question.
    5. Suggestions: Provide constructive feedback on how the answer can be improved.

  **Question:**
    ${question}

  **Answer:**
    ${answer}

  **Instructions:**
  - Always follow same format for providing scores and suggestions.
  - Provide the score only like "Overall Score: X/10, Relevance Score: X/10, Clarity: X/10, Completeness: X/10, Suggestions: ..." for the following:
    - Overall Score: X/10
    - Relevance Score: X/10
    - Clarity Score: X/10
    - Completeness Score: X/10

  - Provide text only for following only like "Suggestions: your-answer-suggestions-here"
    - Suggestions or improved answer in text.

`;
  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You are expert in evaluate interview answers with strong understanding of assessing answers to interview questions based on relevance, clarity, and completeness. Your responses should be professional concise and well-structured. ",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    max_completion_tokens: 1500,
    temperature: 0.8, //higher temperature for more creative/random responses //gpt-5-mini doesn't support temperature
  });

  const content = response.choices[0].message?.content || "";

  if (!content) {
    throw new Error("Failed to evaluate answers");
  }

  const result = extractScoresAndSuggestions(content);

  return {
    overallScore: result.overallScore,
    relevance: result.relevance,
    clarity: result.clarity,
    completeness: result.completeness,
    suggestions: result.suggestions,
  };
};

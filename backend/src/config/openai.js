const { OpenAI } = require('openai');

let openaiClient;

const getOpenAIClient = () => {
  if (openaiClient) {
    return openaiClient;
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('Missing OPENAI_API_KEY environment variable');
  }

  openaiClient = new OpenAI({ apiKey });
  return openaiClient;
};

module.exports = {
  getOpenAIClient,
};

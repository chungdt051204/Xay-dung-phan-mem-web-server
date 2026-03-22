const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function askAI(message) {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const result = await model.generateContent(message);

    const response = await result.response;

    return response.text();
  } catch (error) {
    console.log("AI ERROR:", error);
    return null;
  }
}

module.exports = { askAI };

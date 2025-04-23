import { useState } from "react";
import axios from "axios";

function ChatBot() {
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setAnswer("");

    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content:
                "You are a friendly, calm, accurate medication assistant that answers user questions with clarity and empathy.",
            },
            { role: "user", content: query },
          ],
          temperature: 0.6,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      const aiReply = response.data.choices[0].message.content.trim();
      setAnswer(aiReply);
    } catch (error) {
      setAnswer("Sorry, something went wrong. Please try again.");
      console.error("OpenAI Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-20 p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-indigo-700 text-center">
        🔍 MediMind Search
      </h1>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask something about your medication..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <button
          onClick={handleSearch}
          className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {answer && (
        <div className="bg-gray-100 p-4 rounded text-gray-800 whitespace-pre-line">
          <strong>Answer:</strong> {answer}
        </div>
      )}
    </div>
  );
}

export default ChatBot;

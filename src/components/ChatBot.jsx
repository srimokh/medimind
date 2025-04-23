import { useState } from "react";
import axios from "axios";

function ChatBot() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);

    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: `You are MediMind — a caring, supportive AI companion that combines clear guidance on medications and mental health with emotional support. Offer clarity, comfort, and insight in a calm, human tone.`,
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

      // Save both user and AI message to chat log
      setHistory((prev) => [
        ...prev,
        { sender: "user", text: query },
        { sender: "bot", text: aiReply },
      ]);
    } catch (error) {
      setHistory((prev) => [
        ...prev,
        { sender: "bot", text: "Sorry, something went wrong. Please try again." },
      ]);
      console.error("OpenAI Error:", error.response?.data || error.message);
    } finally {
      setLoading(false);
      setQuery("");
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-20 p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-indigo-700 text-center">
        🧠 MediMind
      </h1>

      {/* Input Field */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask anything about your mind, meds, or mood..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <button
          onClick={handleSearch}
          className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700"
        >
          {loading ? "..." : "Send"}
        </button>
      </div>

      {/* Clear Conversation */}
      {history.length > 0 && (
        <div className="text-center mb-6">
          <button
            onClick={() => setHistory([])}
            className="text-sm text-red-500 hover:underline"
          >
            Clear Conversation
          </button>
        </div>
      )}

      {/* Chat Log */}
      <div className="space-y-4">
        {history.map((msg, index) => (
          <div key={index} className={`text-${msg.sender === "user" ? "right" : "left"}`}>
            <div
              className={`inline-block px-4 py-2 rounded-lg text-sm max-w-xs break-words whitespace-pre-line ${
                msg.sender === "user"
                  ? "bg-indigo-100 text-indigo-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ChatBot;

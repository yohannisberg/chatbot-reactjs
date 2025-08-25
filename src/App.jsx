import { useState } from "react";
import ChatbotIcon from "./components/ChatbotIcon";
import ChatForm from "./components/ChatForm";
import ChatMessage from "./components/ChatMessage";

const App = () => {
  const [chatHistory, setChatHistory] = useState([]);

  const generateBotResponse = async (history) => {
    
    // console.log(history): 0: role: "user" text: "hello"
    // ^ Gets reformatted below

    console.log("h1: ", history);
    
    // Helper function to update chat history
    const updateHistory = (text) => {
      console.log("text: ", text);

      setChatHistory(prev => [
        ...prev.filter(msg => msg.text !== "Thinking..."), 
        {role: "model", text}
      ]);
    };

    // Format chat history for API request
    // 'parts' is needed per documentation: https://ai.google.dev/gemini-api/docs/text-generation
    history = history.map(({role, text}) => ({role, parts: [{text}]}));

    console.log("h2: ", history);

    // POST: sending data to the server, not just requesting data
    // headers: { "Content-Type": "application/json": Tells server “Hey, the body of this request is JSON, so please parse it as JSON”
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json"},
      body: JSON.stringify({contents: history})
    }

    try {
      // FIRES FIRST - fetch(...) is called right away
      // await tells JavaScript to pause here until the Promise that fetch returns is settled (fulfilled or rejected)
      // Make the API call to get the bot's response
      // Code pauses here until the server responds.
      const response = await fetch(import.meta.env.VITE_API_URL, requestOptions);
      const data = await response.json();
      console.log("get response bac: ", data);
      if(!response.ok) throw new Error(data.error.message || "Something went wrong!");

      // Clean and update chat history with bot response
      const apiResponseText = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, "$1").trim();
      updateHistory(apiResponseText);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container">
      <div className="chatbot-popup">
        {/* Chatbot Header */}
        <div className="chat-header">
          <div className="header-info">
            <ChatbotIcon />
            <h2 className="logo-text">Chatbot</h2>
          </div>
          <button className="material-symbols-outlined">keyboard_arrow_down</button>
        </div>

        {/* Chatbot Body */}
        <div className="chat-body">
          <div className="message bot-message">
            <ChatbotIcon />
            <p className="message-text">
              How can I help you?
            </p>
          </div>

          {/* Render the chat history dynamically */}
          {chatHistory.map((chat, index) => (
            <ChatMessage key={index} chat={chat} />
          )) }
        </div>

        {/* Chatbot Footer */}
        <div className="chat-footer">
          <ChatForm chatHistory={chatHistory} setChatHistory={setChatHistory} generateBotResponse={generateBotResponse}/>
        </div>

      </div>
    </div>
  )
}

export default App
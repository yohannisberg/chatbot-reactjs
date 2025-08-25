import { useRef } from "react";

const ChatForm = ({chatHistory, setChatHistory, generateBotResponse}) => {
  const inputRef = useRef();

  const handleFormSubmit = (e) => {
    e.preventDefault(); // stop page refresh
    const userMessage = inputRef.current.value.trim(); // grab input
    if(!userMessage) return; // if empty, exit
    inputRef.current.value = ''; // otherwise, clear the input

    // Update chat history with the user's message
    // But React doesn’t update chatHistory immediately — it schedules a re-render
    // So at this exact moment, the chatHistory prop that you pass to generateBotResponse is still the old one (before the new message).
    setChatHistory((history) => [...history, {role: "user", text: userMessage}]);

    // Add "Thinking"
    setTimeout(() => {
      setChatHistory((history) => [...history, {role: "model", text: "Thinking..."}]);

      // Calls up to App.jsx, gives latest history
      // * It sends chatHistory (from props) plus the new user message since setChatHistory above ^ hasn't updated chatHistory yet (React state updates asynchronously)
      // ** Because you're using chatHistory (and not setChatHistory), you're only giving this to the generateBotResponse function. The setChatHistory function above will be updating chatHistory.
      generateBotResponse([...chatHistory, {role: "user", text: userMessage}]);
      
  }, 600);

}

  return (
    <form action="#" className="chat-form" onSubmit={handleFormSubmit}>
      <input ref={inputRef} name="Message" type="text" placeholder="Message..." className="message-input" required />
      <button className="material-symbols-outlined">arrow_upward</button>
    </form>
  )
}

export default ChatForm
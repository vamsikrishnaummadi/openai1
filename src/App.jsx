import { useState , useRef, useEffect} from 'react'
import bot from './assets/programming-code-signs.png'
import user from "./assets/user-2-svgrepo-com.svg"
import sendicon from "./assets/send-svgrepo-com.svg"
import logo from "./assets/Free_Sample_By_Wix (1).jpg"
import {ThreeDots} from "react-loader-spinner"
import './App.css'

function App() {
  
const [uservalue, setUservalue] = useState("");
const [messages, setMessages] = useState([]);
const [loading, isLoading]  = useState(false);
const textareaRef = useRef(null);
console.log(messages);

  const generateUniqueId = () => {
    const timestamp = Date.now();
    const randomNumber = Math.random();
    const hexadecimalstring = randomNumber.toString(16); 

    return `id-${timestamp}-${hexadecimalstring}`
  }

  function TypingAnimation({isAi}) {
    const [isVisible, setIsVisible] = useState(true);
  
    useEffect(() => {
      const timer = setInterval(() => setIsVisible(prev => !prev), 500);
      return () => clearInterval(timer);
    }, []);
  
    return isVisible ? (
      <div className={isAi ? "wrapper ai" : "wrapper"}>
        <div className="chat">
          <div className="profile">
            <img className={isAi ? "ye" : "re"} src={isAi ? bot : user} alt={isAi ? "bot" : "user"} />
          </div>
          <div className="mesage" style={{ minHeight: "40px" }}>
            <ThreeDots height="40" width="40" radius="9" color="#ffffff" ariaLabel="three-dots-loading" wrapperClassName="va" visible={true} />
          </div>
        </div>
      </div>
    ) : null;
  }

  const chatStripe = (isAi , value, uniqueId) => {
    
    return (
       <div className={isAi ? "wrapper ai" : "wrapper"}>
        <div className="chat">
          <div className='profile'>
            <img className={isAi ? "ye" : "re"} src={isAi ? bot : user} alt={isAi ? 'bot' : 'user'} />
          </div>
           <div className='mesage' id={uniqueId}><span className='te'>{value}</span></div> 
        </div>
       </div> 
  
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const uniqueId = generateUniqueId();
    const userValue = textareaRef.current.value;
    
    const userMessage = chatStripe(false, userValue, uniqueId);
    setMessages(prevMessages => [...prevMessages, userMessage]);
    textareaRef.current.value = "";
     
     isLoading(true);

    const response = await fetch("http://localhost:5001", {
      method: "POST",
      headers: {
        "Content-Type" : "application/json"
      },
      body: JSON.stringify({
        prompt: userValue
      })
    })

    
      const  data = await response.json()
      isLoading(false);
      
   const botMessage = chatStripe(true, data.bot, uniqueId);

   setMessages(prevMessages => [...prevMessages, botMessage]);
    
  }

  return (
    <div  className="app">
      <nav><img src={logo} alt="logo" className='logo'/><span className='caption'>Powered By Openai - text-davinci-003</span></nav>
      <div className='chat_container'>
               {messages.map((message, index) => (
                 <div key={index}>{message}</div>
               ))}
              {loading && <TypingAnimation isAi={true} />}
      </div>
      <form onSubmit={handleSubmit}>
        <textarea ref={textareaRef} name="prompt" onChange={(e) => setUservalue(e.target.value)}rows={1} cols={1} placeholder="ask vkcodex....." />
        <button type='submit'><img src={sendicon} alt="send icon" className='icon'/></button>
      </form>
    </div>

  )
}

export default App
const sendChatBtn=document.querySelector(".text-box span");
const chatInput=document.querySelector(".text-box input");
const chatBox=document.querySelector(".chatbox");


const RATE_LIMIT_DELAY = 2000;
let userMessage;
const API_KEY=""; // Api key is Removed for security reasons
const inputInitHeight = chatInput.scrollHeight;
const createChatLi=(message, className)=>{
    chatLi= document.createElement("main")
    chatLi.classList.add("chat",className);
    let chatContent= className==="outgoing" ? `<div class="flex w-full mt-2 space-x-3 max-w-[15rem] ml-auto justify-end  bg-blue-600 text-white p-3 rounded-l-lg rounded-br-lg">
    <p class="text-sm">${message}</p>
   
</div>
<span id="time-stamp" class="text-xs text-gray-500 leading-none flex w-full mt-2 space-x-3 max-w-[10rem] ml-auto justify-end">2 min ago</span>
` : `<main class="chat incoming  flex w-full mt-2 space-x-3 max-w-xs">
    <div class=" chatbox flex-shrink-0 h-10 w-10 rounded-full "><img src="/Assets/bot.png" alt="" srcset=""></div>
    <div>
        <li class=" bg-gray-300 p-3 rounded-r-lg rounded-bl-lg list-none">
            <p class="text-sm">${message}</p>
        </li>
        <span id="time-stamp"  class="text-xs text-gray-500 leading-none">2 min ago</span>
    </div>
</main>`
    chatLi.innerHTML=chatContent;
    return chatLi;
}
let lastRequestTime = 0;                                                                                                                                            
const generateResponse=(chatElement)=>{
    

    const now = Date.now();
    const timeSinceLastRequest = now - lastRequestTime;
  
    if (timeSinceLastRequest < RATE_LIMIT_DELAY) {
      // Delay the request if needed
      setTimeout(() => {
        generateResponse(chatElement);
      }, RATE_LIMIT_DELAY - timeSinceLastRequest);
      return;
    }
  
    lastRequestTime = now;
    const API_URL="";
    const messageElement = chatElement.querySelector("p");
    
    const requestOptions={
        method: "POST",
        headers:{
            "Content-Type" : "application/json",
            "Authorization" : `Bearer ${API_KEY}`
        },
        body:JSON.stringify({
            
                model: "gpt-3.5-turbo",
            messages: [{role: "user", content: userMessage}],
              
              
        })
    }
   fetch(API_URL, requestOptions)
  .then(res => {
    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }
    return res.json();
  })
  .then(data => {
    messageElement.textContent = data.choices[0].message.content.trim();
  })
  .catch(error => {
    console.error('Fetch error:', error);
    // Handle the error gracefully, show an error message, etc.
  })
  .finally(() => chatBox.scrollTo(0, chatBox.scrollHeight));

}

const handleChat =()=>{
    userMessage=chatInput.value.trim();
    if(!userMessage) return;
    chatBox.appendChild(createChatLi(userMessage, "outgoing"));
    chatInput.value = "";
    chatInput.style.height = `${inputInitHeight}px`;

    setTimeout(()=>{
        const incomingChatLi = createChatLi("Thinking...", "incoming");
        chatBox.appendChild(incomingChatLi);
        chatBox.scrollTo(0, chatBox.scrollHeight);
        generateResponse(incomingChatLi);
    },2000)
}

sendChatBtn.addEventListener("click",handleChat);

chatInput.addEventListener("keydown", enterEvent) ;
const enterEvent=(event)=> {
    if (event.key === "Enter") {
        
      handleChat();
    }
  };
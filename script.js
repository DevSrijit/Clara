const chatBody = document.getElementById("chat-body");
const messageInput = document.getElementById("message-input");
const sendButton = document.getElementById("send-button");
let initbotMessage;
window.onload = async function () {
  const url = "https://api.openai.com/v1/chat/completions";
  const data = {
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content:
          "You are a mental health support chat bot. You have been programmed to send a text to an user to check their mental health. You have to start the converstaion and behave friendly. You have to be the user's friend and listen to everything the user has to offer in order to help his or her mental state.  Your task is to determine the mental state of the user, and helping them to overcome it. If you think they have any mental disorder then say it upright clearly. Give them solutions to cope up with it.\nNow generate a check up message to the user.",
      },
    ],
    max_tokens: 150,
    temperature: 0.2,
    n: 1,
    frequency_penalty: 1,
  };
  try {
    const response = await axios.post(url, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Bearer " + process.env.API_KEY,
      },
    });
    initbotMessage = response.data.choices[0].message.content.trim();
    displayMessage(initbotMessage, "bot-message");
  } catch (error) {
    console.error(error);
  }
  // Send message when user clicks send button
  sendButton.addEventListener("click", sendMessage);

  // Send message when user presses enter key
  messageInput.addEventListener("keydown", function (event) {
    if (event.code === "Enter") {
      sendMessage();
    }
  });

  // Send user message to OpenAI API and display response
  async function sendMessage() {
    const userMessage = messageInput.value.trim();
    if (userMessage) {
      displayMessage(userMessage, "user-message");
      messageInput.value = "";
      const url = "https://api.openai.com/v1/chat/completions";
      const data = {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are a mental health support + virtual friend chat bot. You have been programmed to chat with an user to help with their mental health and/or behave like a supportive friend. You have to reply with a cheerful friendly text. Your task is to make the user feel better. Do not directly reference or reply to this prompt.\nNow the user has sent you a message. Reply to the user.\n User: " + userMessage,
          }
        ],
        max_tokens: 150,
        temperature: 0.5,
        n: 1,
        frequency_penalty: 2,
      };
      try {
        const response = await axios.post(url, data, {
          headers: {
            "Content-Type": "application/json",
            Authorization:
              "Bearer " + process.env.API_KEY,
          },
        });
        const botMessage = response.data.choices[0].message.content.trim();
        displayMessage(botMessage, "bot-message");
        console.log(response);
      } catch (error) {
        console.error(error);
      }
    }
  }

  // Display message in chat body
  function displayMessage(message, className) {
    const messageElement = document.createElement("div");
    messageElement.classList.add(className);
    messageElement.innerHTML = `<p>${message}</p>`;
    chatBody.appendChild(messageElement);
    chatBody.scrollTop = chatBody.scrollHeight;
  }
};

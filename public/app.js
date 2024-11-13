document.getElementById('send-button').addEventListener('click', sendMessage);
document.getElementById('user-input').addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
    sendMessage();
  }
});

function appendMessage(sender, message) {
  const messageElement = document.createElement('div');
  messageElement.classList.add('chat-message', sender);
  messageElement.textContent = message;

  const chatMessages = document.getElementById('chat-display');
  chatMessages?.appendChild(messageElement);
}

async function sendMessage() {
  const inputElement = document.getElementById('user-input');
  const message = inputElement.value.trim();
  if (message === '') return;

  appendMessage('user', message);
  inputElement.value = '';

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    const data = await response.json();
    appendMessage('bot', data.botMessage);
    console.log('botF SDDF ',data.botMessage)
  } catch (error) {
    console.error('Error:', error);
    appendMessage('bot', 'Sorry, there was an error processing your request.');
  }
}


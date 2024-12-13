import { html, render } from 'https://unpkg.com/lit-html@3.2.1/lit-html.js'

let messages = [
    { role: 'assistant', content: 'Wat wèlste wete euver de towkoms vaan us universiteit?' }
  ];
  
  const chatTemplate = () => html`

    <div id="header" class="col-12">
    <h1>Maastricht University Vision-o-mat 2025</h1>
    <img src="logo.png" alt="UM vision-o-mat" class="img-fluid">
    <h3>Voor medewerkers die willen weten waar de universiteit in 2025 naartoe gaat.</h3>
    <h6>Deze pagina bevat (anonieme) Fragen en OpenAI weiter. Voor OpenAI ziet het er zo uit, als alle fragmenten van de spiegel verschijnen.
De pagina zelf heeft geen gegevens opgeleverd, maar geen enkel IP-adres</h6>
  </div>
  <div id="chat-container" class="col-12">
    ${messages.map((msg) => html`
      <div class="message ${msg.role}">
        <div class="message-role">${msg.role === 'user' ? 'You' : 'UM Vision-o-mat'}:</div>
        <div class="message-content">${msg.content}</div>
      </div>
    `)}
    </div>
  <div id="input-container" class="col-12">
    <input id="user-input" type="text" class="form-control" placeholder="Type your message...">
    <button id="send-button" class="btn btn-success" @click=${sendMessage}>Send</button>
  </div>
  `;

function renderChat() {
  render(chatTemplate(), document.getElementById('app'));
  const chatContainer = document.getElementById('chat-container');
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

async function sendMessage() {
  const input = document.getElementById('user-input');
  const message = input.value.trim();
  
  if (message) {
    messages.push({ role: 'user', content: message });
    renderChat();
    input.value = '';

    try {
      const response = await fetch('/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      messages.push({ role: 'assistant', content: data.reply });
      renderChat();
    } catch (error) {
      console.error('Error:', error);
      messages.push({ role: 'assistant', content: 'Sorry, an error occurred. Please try again.' });
      renderChat();
    }
  }
}

renderChat();

document.addEventListener('keypress', function(e) {
  if (e.key === 'Enter') {
    sendMessage();
  }
});

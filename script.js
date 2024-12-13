const activateBtn = document.getElementById('activate-btn');
const output = document.getElementById('output');

activateBtn.addEventListener('click', () => {
  startRecognition();
});

function startRecognition() {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = 'ru-RU';
  recognition.start();

  recognition.onresult = function (event) {
    const transcript = event.results[0][0].transcript.toLowerCase();
    output.innerHTML += `<p><strong>Вы:</strong> ${transcript}</p>`;
    processCommand(transcript);
  };

  recognition.onerror = function (event) {
    output.innerHTML += `<p><strong>Ошибка:</strong> ${event.error}</p>`;
  };
}

function processCommand(command) {
  if (command.includes('википедия')) {
    const query = command.replace('википедия', '').trim();
    searchWikipedia(query);
  } else if (command.includes('время')) {
    const time = new Date().toLocaleTimeString('ru-RU');
    respond(`Сейчас ${time}`);
  } else if (command.includes('погода')) {
    respond('К сожалению, погоду я пока не могу узнать.');
  } else {
    respond('Команда не распознана. Попробуйте еще раз.');
  }
}

function searchWikipedia(query) {
  fetch(`https://ru.wikipedia.org/w/api.php?action=opensearch&format=json&origin=*&search=${query}`)
    .then(response => response.json())
    .then(data => {
      const results = data[1];
      const links = data[3];

      if (results.length > 0) {
        respond(`Вот, что я нашел: ${results[0]} - <a href="${links[0]}" target="_blank">Читать подробнее</a>`);
      } else {
        respond('Ничего не найдено.');
      }
    })
    .catch(error => {
      respond(`Ошибка при поиске: ${error.message}`);
    });
}

function respond(message) {
  output.innerHTML += `<p><strong>Джарвис:</strong> ${message}</p>`;
  const utterance = new SpeechSynthesisUtterance(message);
  utterance.lang = 'ru-RU';
  window.speechSynthesis.speak(utterance);
}

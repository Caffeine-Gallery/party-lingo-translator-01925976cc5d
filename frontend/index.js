import { backend } from 'declarations/backend';

const inputText = document.getElementById('inputText');
const targetLanguage = document.getElementById('targetLanguage');
const translateBtn = document.getElementById('translateBtn');
const outputText = document.getElementById('outputText');
const speakBtn = document.getElementById('speakBtn');
const historyList = document.getElementById('historyList');

translateBtn.addEventListener('click', translateText);
speakBtn.addEventListener('click', speakTranslation);

async function translateText() {
    const text = inputText.value;
    const lang = targetLanguage.value;
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${lang}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        const translation = data.responseData.translatedText;
        outputText.textContent = translation;

        // Add translation to history
        await backend.addTranslation(text, translation, lang);
        updateHistory();
    } catch (error) {
        console.error('Translation error:', error);
        outputText.textContent = 'Translation failed. Please try again.';
    }
}

function speakTranslation() {
    const text = outputText.textContent;
    const lang = targetLanguage.value;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    speechSynthesis.speak(utterance);
}

async function updateHistory() {
    const history = await backend.getTranslationHistory();
    historyList.innerHTML = '';
    history.forEach(entry => {
        const li = document.createElement('li');
        li.textContent = `${entry.original} → ${entry.translated} (${entry.targetLanguage})`;
        historyList.appendChild(li);
    });
}

// Initial history load
updateHistory();

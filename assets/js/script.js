const questions = [
    { question: "What is the capital of Rwanda?", answers: ["Kigali", "Butare", "Gisenyi", "Ruhengeri"], correct: 0 },
    { question: "Which lake is located in Rwanda?", answers: ["Lake Victoria", "Lake Kivu", "Lake Tanganyika", "Lake Malawi"], correct: 1 },
    { question: "What is the official language of Rwanda?", answers: ["Swahili", "French", "Kinyarwanda", "English"], correct: 2 },
    { question: "What is Rwanda's currency?", answers: ["Rwandan Franc", "Rwandan Dollar", "Rwandan Pound", "Rwandan Shilling"], correct: 0 },
    { question: "Which mountain range is in Rwanda?", answers: ["Virunga Mountains", "Atlas Mountains", "Drakensberg Mountains", "Rocky Mountains"], correct: 0 },
    { question: "What is Rwanda's population approximately?", answers: ["12 million", "20 million", "5 million", "15 million"], correct: 0 },
    { question: "When is Rwanda's Independence Day?", answers: ["July 1", "August 15", "June 12", "May 1"], correct: 0 }
];

let currentQuestion = 0;
let score = 0;

function startQuiz() {
    document.getElementById('login').style.display = 'none';
    document.getElementById('quiz').style.display = 'block';
    showQuestion();
}

function showQuestion() {
    const questionContainer = document.getElementById('question-container');
    questionContainer.innerHTML = `
        <h3>${questions[currentQuestion].question}</h3>
        ${questions[currentQuestion].answers.map((answer, index) => `
            <button onclick="checkAnswer(${index})">${answer}</button>
        `).join('')}
    `;
}

function checkAnswer(selected) {
    const progressBar = document.getElementById('progress-bar');
    const progress = document.createElement('div');
    if (selected === questions[currentQuestion].correct) {
        score++;
        progress.classList.add('correct');
    } else {
        progress.classList.add('incorrect');
    }
    progressBar.appendChild(progress);
    progress.style.width = `${(currentQuestion + 1) / questions.length * 100}%`;
    nextQuestion();
}

function nextQuestion() {
    currentQuestion++;
    if (currentQuestion < questions.length) {
        showQuestion();
    } else {
        showResults();
    }
}

function showResults() {
    const questionContainer = document.getElementById('question-container');
    questionContainer.innerHTML = `<h3>You scored ${score} out of ${questions.length}</h3>`;
}

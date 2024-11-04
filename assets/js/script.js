const questions = [
  { question: "What is the capital of Rwanda?", answers: ["Kigali", "Nairobi", "Dar es Salaam", "Kampala"], correct: 0 },
  { question: "Which language is widely spoken in Rwanda?", answers: ["Swahili", "Kinyarwanda", "Amharic", "Zulu"], correct: 1 },
  { question: "When did Rwanda gain independence?", answers: ["1962", "1975", "1980", "1990"], correct: 0 },
  { question: "What is Rwanda known as?", answers: ["Land of Lakes", "Land of a Thousand Hills", "Land of Rivers", "Land of Gold"], correct: 1 },
  { question: "What is the currency of Rwanda?", answers: ["Shilling", "Rwandan Franc", "Dollar", "Pound"], correct: 1 },
  { question: "What is Rwanda's primary economic activity?", answers: ["Mining", "Agriculture", "Manufacturing", "Tourism"], correct: 1 },
  { question: "Which famous mountain gorillas can be found in Rwanda?", answers: ["Silverback gorillas", "Western gorillas", "Golden gorillas", "Bamboo gorillas"], correct: 0 },
  { question: "What is the official name of Rwanda?", answers: ["Kingdom of Rwanda", "People's Republic of Rwanda", "Republic of Rwanda", "United States of Rwanda"], correct: 2 },
  { question: "Which national park is famous for gorilla trekking?", answers: ["Volcanoes National Park", "Serengeti National Park", "Kruger National Park", "Amboseli National Park"], correct: 0 },
  { question: "What color is NOT in the Rwandan flag?", answers: ["Blue", "Red", "Yellow", "Green"], correct: 1 }
];

let shuffledQuestions;
let currentQuestionIndex = 0;
let score = 0;
let streak = 0;
let hintUsed = false;
let username = "";
let results = [];

function shuffleQuestions() {
  return questions
    .map(question => ({ ...question, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(question => {
      delete question.sort;
      return question;
    });
}

function startQuiz() {
  const nameInput = document.getElementById("username").value;
  if (nameInput.trim() === "") {
    alert("Please enter your name.");
    return;
  }
  username = nameInput;
  shuffledQuestions = shuffleQuestions();
  document.getElementById("login").classList.add("hidden");
  document.getElementById("quiz").classList.remove("hidden");
  loadQuestion();
}

function loadQuestion() {
  clearTimeout(timer);
  document.getElementById("timer").innerText = "15";
  document.getElementById("hint").disabled = hintUsed;
  
  const questionElement = document.getElementById("question");
  const answersElement = document.getElementById("answers");
  const questionNumberElement = document.getElementById("question-number");
  const progressElement = document.getElementById("progress");

  questionNumberElement.innerText = currentQuestionIndex + 1;
  const currentQuestion = shuffledQuestions[currentQuestionIndex];
  questionElement.innerText = currentQuestion.question;
  answersElement.innerHTML = "";

  currentQuestion.answers.forEach((answer, index) => {
    const button = document.createElement("button");
    button.innerText = answer;
    button.onclick = () => selectAnswer(index);
    answersElement.appendChild(button);
  });

  progressElement.style.width = ((currentQuestionIndex + 1) / shuffledQuestions.length) * 100 + "%";
}

function selectAnswer(index) {
  clearInterval(timer);
  const currentQuestion = shuffledQuestions[currentQuestionIndex];
  const isCorrect = index === currentQuestion.correct;
  
  results.push({
    question: currentQuestion.question,
    selectedAnswer: currentQuestion.answers[index],
    correctAnswer: currentQuestion.answers[currentQuestion.correct],
    isCorrect: isCorrect
  });

  if (isCorrect) {
    score++;
    streak++;
  } else {
    streak = 0;
  }

  showFeedback(isCorrect);
  document.getElementById("next").classList.remove("hidden"); // Show Next button
}

function showFeedback(isCorrect) {
  const feedbackElement = document.getElementById("feedback");
  if (isCorrect) {
    feedbackElement.innerText = `Correct! Great job, ${username}!`;
    feedbackElement.style.color = "green";
  } else {
    const correctAnswer = shuffledQuestions[currentQuestionIndex].answers[shuffledQuestions[currentQuestionIndex].correct];
    feedbackElement.innerText = `Incorrect. The correct answer was: ${correctAnswer}.`;
    feedbackElement.style.color = "red";
  }
}

function nextQuestion() {
  currentQuestionIndex++;
  if (currentQuestionIndex < shuffledQuestions.length) {
    document.getElementById("feedback").innerText = ""; // Clear feedback
    document.getElementById("next").classList.add("hidden"); // Hide Next button
    loadQuestion();
  } else {
    showResults();
  }
}

function useHint() {
  if (!hintUsed) {
    hintUsed = true;
    alert(`Hint: The correct answer starts with "${shuffledQuestions[currentQuestionIndex].answers[shuffledQuestions[currentQuestionIndex].correct][0]}"`);
    document.getElementById("hint").disabled = true;
  }
}

function showResults() {
  document.getElementById("quiz").classList.add("hidden");
  document.getElementById("result").classList.remove("hidden");
  document.getElementById("score").innerText = `${username}, you scored ${score} out of ${shuffledQuestions.length}!`;
  
  const resultsElement = document.getElementById("comparison");
  resultsElement.innerHTML = "<h3>Your Answers Compared to Correct Answers:</h3>";
  
  results.forEach((result, index) => {
    const resultItem = document.createElement("div");
    resultItem.classList.add("result-item");
    resultItem.innerHTML = `
      <p><strong>Question ${index + 1}:</strong> ${result.question}</p>
      <p>Your Answer: <span style="color: ${result.isCorrect ? 'green' : 'red'}">${result.selectedAnswer}</span></p>
      <p>Correct Answer: ${result.correctAnswer}</p>
    `;
    resultsElement.appendChild(resultItem);
  });
}

function restartQuiz() {
  currentQuestionIndex = 0;
  score = 0;
  streak = 0;
  hintUsed = false;
  results = [];
  document.getElementById("result").classList.add("hidden");
  document.getElementById("login").classList.remove("hidden");
}

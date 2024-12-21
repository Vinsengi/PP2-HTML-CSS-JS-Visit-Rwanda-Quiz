const coll = document.querySelector(".collapsible");
coll.addEventListener("click", function () {
  this.classList.toggle("active");
  const content = this.nextElementSibling;
  if (content.style.display === "block") {
    content.style.display = "none";
    this.innerText = "Show Quiz Instructions";
  } else {
    content.style.display = "block";
    this.innerText = "Hide Quiz Instructions";
  }
});

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
  { question: "What color is NOT in the Rwandan flag?", answers: ["Blue", "Red", "Yellow", "Green"], correct: 1 },
  { question: "Who is the current president of Rwanda?", answers: ["Paul Kagame", "Pasteur Bizimungu", "Louise Mushikiwabo", "Juvenal Habyarimana", "Grégoire Kayibanda", "Dominique Mbonyumutwa", "Théodore Sindikubwabo"], correct: 0 }
];

let shuffledQuestions;
let currentQuestionIndex = 0;
let score = 0;
let streak = 0;
let hintUsed = false;
let username = "";
let results = [];
let timer;
let selectedChoiceRecorded = false;

function shuffleQuestions() {
  return questions
    .map(question => ({
      ...question,
      sort: Math.random()
    }))
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
  hintUsed = false; // Reset hint usage for each question
  document.getElementById("timer").innerText = "20"; // Reset timer display
  document.getElementById("hint").disabled = hintUsed;
  document.getElementById("hint").classList.remove("hidden");
  document.getElementById("next").classList.add("hidden");
  document.getElementById("next").disabled = true; // Disable the next button initially
  
  const questionElement = document.getElementById("question");
  const answersElement = document.getElementById("answers");
  const questionNumberElement = document.getElementById("question-number");
  const progressElement = document.getElementById("progress");

  questionNumberElement.innerText = currentQuestionIndex + 1;
  const currentQuestion = shuffledQuestions[currentQuestionIndex];
  questionElement.innerText = currentQuestion.question;
  answersElement.innerHTML = "";

  // Create radio buttons for answers
  currentQuestion.answers.forEach((answer, index) => {
    const label = document.createElement("label");
    const input = document.createElement("input");
    input.type = "radio";
    input.name = "answer";
    input.value = index;
    label.appendChild(input);
    label.appendChild(document.createTextNode(answer));
    answersElement.appendChild(label);
    answersElement.appendChild(document.createElement("br"));
  });

  progressElement.style.width = ((currentQuestionIndex + 1) / shuffledQuestions.length) * 100 + "%";

  startTimer(); // Start the timer for this question
  selectedChoiceRecorded = false; // Reset choice tracking
}

function startTimer() {
  let timeLeft = 20;
  document.getElementById("timer").innerText = timeLeft;

  clearInterval(timer);
  timer = setInterval(() => {
    timeLeft--;
    document.getElementById("timer").innerText = timeLeft;

    if (timeLeft <= 0) {
      clearInterval(timer);
      alert("Time's up! Moving to the next question.");
      nextQuestion(); // Automatically go to next question when time's up
    }
  }, 1000);
}

function selectAnswer(index) {
  if (selectedChoiceRecorded) return; // Prevent multiple selections

  const currentQuestion = shuffledQuestions[currentQuestionIndex];
  const isCorrect = index === currentQuestion.correct;

  results.push({
    question: currentQuestion.question,
    selectedChoice: currentQuestion.answers[index],
    correctAnswer: currentQuestion.answers[currentQuestion.correct],
    isCorrect
  });

  if (isCorrect) {
    score++;
  }

  // Provide feedback for the selected answer
  showFeedback(isCorrect);

  selectedChoiceRecorded = true; // Mark the choice as recorded
  clearInterval(timer); // Stop the timer when an answer is selected

  // Enable next button after answering
  document.getElementById("next").disabled = false;
  document.getElementById("next").classList.remove("hidden");
  document.getElementById("hint").classList.add("hidden"); // Hide hint after answer
}

function showFeedback(isCorrect) {
  const feedbackElement = document.getElementById("feedback");
  const scoreElement = document.getElementById("score-display");

  feedbackElement.innerText = isCorrect ? `Correct! Great job, ${username}!` : "Incorrect. Try again or move to the next question!";
  feedbackElement.style.color = isCorrect ? "green" : "red";

  scoreElement.innerText = `Your Score: ${score}`;
}

function nextQuestion() {
  currentQuestionIndex++;
  if (currentQuestionIndex < shuffledQuestions.length) {
    document.getElementById("feedback").innerText = ""; // Clear feedback
    document.getElementById("next").classList.add("hidden"); // Hide next button again
    document.getElementById("hint").classList.remove("hidden"); // Show hint for the next question
    document.getElementById("next").disabled = true; // Disable next button
    loadQuestion();
  } else {
    showResults();
  }
}

function checkAnswer() {
  const currentQuestion = shuffledQuestions[currentQuestionIndex];
  const selectedRadio = document.querySelector("input[name='answer']:checked");

  if (!selectedRadio) {
    alert("Please select an answer before checking.");
    return;
  }

  const selectedIndex = parseInt(selectedRadio.value);
  const isCorrect = selectedIndex === currentQuestion.correct;

  showFeedback(isCorrect);

  // Lock the question once an answer is selected
  document.querySelectorAll("input[name='answer']").forEach(radio => {
    radio.disabled = true;
  });
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

  // Calculate the percentage score
  const percentage = (score / shuffledQuestions.length) * 100;

  let feedback = "";
  if (percentage >= 80) {
    feedback = "Excellent! You did an amazing job!";
  } else if (percentage >= 50) {
    feedback = "Good Job! Keep practicing to improve.";
  } else {
    feedback = "Needs Improvement. Try again!";
  }

  const resultsElement = document.getElementById("comparison");
  resultsElement.innerHTML = `<h3>Your Choices Compared to Correct Answers:</h3><p>${feedback}</p>`;

  results.forEach((result, index) => {
    const resultItem = document.createElement("div");
    resultItem.classList.add("result-item");
    resultItem.innerHTML = `
      <p><strong>Question ${index + 1}:</strong> ${result.question}</p>
      <p>Your Choice: <span style="color: ${result.isCorrect ? 'green' : 'red'}">${result.selectedChoice}</span></p>
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
  shuffledQuestions = shuffleQuestions();
  document.getElementById("result").classList.add("hidden");
  document.getElementById("feedback").innerText = "";
  document.getElementById("login").classList.remove("hidden");
  document.getElementById("quiz").classList.add("hidden");
}

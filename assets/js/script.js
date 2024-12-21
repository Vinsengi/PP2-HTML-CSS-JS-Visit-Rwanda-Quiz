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

const questions = [{
    question: "What is the capital of Rwanda?",
    answers: ["Kigali", "Nairobi", "Dar es Salaam", "Kampala"],
    correct: 0
  },
  {
    question: "Which language is widely spoken in Rwanda?",
    answers: ["Swahili", "Kinyarwanda", "Amharic", "Zulu"],
    correct: 1
  },
  {
    question: "When did Rwanda gain independence?",
    answers: ["1962", "1975", "1980", "1990"],
    correct: 0
  },
  {
    question: "What is Rwanda known as?",
    answers: ["Land of Lakes", "Land of a Thousand Hills", "Land of Rivers", "Land of Gold"],
    correct: 1
  },
  {
    question: "What is the currency of Rwanda?",
    answers: ["Shilling", "Rwandan Franc", "Dollar", "Pound"],
    correct: 1
  },
  {
    question: "What is Rwanda's primary economic activity?",
    answers: ["Mining", "Agriculture", "Manufacturing", "Tourism"],
    correct: 1
  },
  {
    question: "Which famous mountain gorillas can be found in Rwanda?",
    answers: ["Silverback gorillas", "Western gorillas", "Golden gorillas", "Bamboo gorillas"],
    correct: 0
  },
  {
    question: "What is the official name of Rwanda?",
    answers: ["Kingdom of Rwanda", "People's Republic of Rwanda", "Republic of Rwanda", "United States of Rwanda"],
    correct: 2
  },
  {
    question: "Which national park is famous for gorilla trekking?",
    answers: ["Volcanoes National Park", "Serengeti National Park", "Kruger National Park", "Amboseli National Park"],
    correct: 0
  },
  {
    question: "What color is NOT in the Rwandan flag?",
    answers: ["Blue", "Red", "Yellow", "Green"],
    correct: 1
  },
  {
    question: "Who is the current president of Rwanda?",
    answers: ["Paul Kagame", "Pasteur Bizimungu", "Louise Mushikiwabo", "Juvenal Habyarimana", "Grégoire Kayibanda", "Dominique Mbonyumutwa", "Théodore Sindikubwabo"],
    correct: 0
  }
];

let shuffledQuestions;
let currentQuestionIndex = 0;
let score = 0;
let streak = 0;
let hintUsed = false;
let username = "";
let results = [];
let selectedChoiceRecorded = false; // Track if  choice has been recorded
let timer; // Timer variable
let selectedChoiceIndex = -1; // Variable to track the last selected choice


function shuffleQuestions() {
  return questions
    .map(question => ({
      ...question,
      sort: Math.random() // Randomly assigns a number to each question
    }))
    .sort((a, b) => a.sort - b.sort) // Sort questions based on the random number
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
  shuffledQuestions = shuffleQuestions(); // Shuffle questions before starting the quiz

  // Hide login screen and show quiz
  document.getElementById("login").classList.add("hidden");
  document.getElementById("quiz").classList.remove("hidden");

  // Load the first question
  loadQuestion();
}


function loadQuestion() {
  //selectedChoice = false; // Reset for each new question

  // Reset answer selection and feedback
  document.querySelectorAll("input[name='answer']").forEach(radio => {
    radio.disabled = false; // Enable radio buttons
    radio.checked = false; // Reset checked state
  });

  // Reset feedback and timer for each new question
  document.getElementById("feedback").innerText = "";
  document.getElementById("timer").innerText = "15"; // Reset timer display
  selectedChoiceRecorded = false; // Reset choice tracking for the new questio

  const questionElement = document.getElementById("question");
  const answersElement = document.getElementById("answers");
  const questionNumberElement = document.getElementById("question-number");
  const progressElement = document.getElementById("progress");

  questionNumberElement.innerText = currentQuestionIndex + 1;
  const currentQuestion = shuffledQuestions[currentQuestionIndex];
  questionElement.innerText = currentQuestion.question;
  answersElement.innerHTML = "";

  // Create answer buttons
  // currentQuestion.answers.forEach((answer, index) => {
  //   const button = document.createElement("button");
  //   button.innerText = answer;
  //   button.onclick = () => selectAnswer(index);
  //   answersElement.appendChild(button);
  // });

  // Create radio buttons for answers
  currentQuestion.answers.forEach((answer, index) => {
    const label = document.createElement("label");
    const input = document.createElement("input");
    input.type = "radio";
    input.name = "answer";
    input.value = index;

    // Listen for change events to track the last selection
    input.onchange = function () {
      selectedChoiceIndex = index; // Track the last selected answer
      enableNextButton(); // Enable the "Next" button when an answer is selected
    };

    label.appendChild(input);
    label.appendChild(document.createTextNode(answer));
    answersElement.appendChild(label);
    answersElement.appendChild(document.createElement("br"));
  });

  progressElement.style.width = ((currentQuestionIndex + 1) / shuffledQuestions.length) * 100 + "%";

  startTimer(); // Start the timer for this question
  selectedChoiceRecorded = false; // Reset choice tracking
  // hintUsed = false; //to rest hint for every question
  // document.getElementById("timer").innerText = "15"; // Reset timer display
  // document.getElementById("hint").disabled = hintUsed;
  // document.getElementById("hint").classList.remove("hidden");
  document.getElementById("next").classList.add("hidden"); // Hide "Next" button initially
  document.getElementById("next").disabled = true; // Disable "Next" button initially
}


// Function to enable the "Next" button once an answer is selected
function enableNextButton() {
  if (selectedChoiceIndex !== -1) { // If an answer is selected
    document.getElementById("next").disabled = false; // Enable "Next"
    document.getElementById("next").classList.remove("hidden"); // Show "Next" button
  }
}

function startTimer() {
  let timeLeft = 15; // Set timer for 15 seconds
  document.getElementById("timer").innerText = timeLeft; // Display initial time

  // Clear any existing timer before starting a new one
  clearInterval(timer);
  timer = setInterval(() => {
    timeLeft--;
    document.getElementById("timer").innerText = timeLeft; // Update timer display

    if (timeLeft <= 0) {
      clearInterval(timer);
      alert("Time's up! Moving to the next question.");
      nextQuestion(); // Automatically go to next question when time's up
    }
  }, 1000); // Update every second
}


function selectAnswer(index) {
  if (selectedChoiceRecorded) return;

  // Ensure only the last selected answer is recorded
  const currentQuestion = shuffledQuestions[currentQuestionIndex];
  const isCorrect = index === currentQuestion.correct;

  // document.getElementById("next").disabled = false;
  // Record the first answer selection only if it hasn’t been recorded yet
  //  if (!selectedChoiceRecorded) {
  //     ChoiceRecorded = true;

  results.push({
    question: currentQuestion.question,
    selectedChoice: currentQuestion.answers[index],
    correctAnswer: currentQuestion.answers[currentQuestion.correct],
    isCorrect
  });

  if (isCorrect) {
    score++;
  }


  // Provide feedback for each answer attempt
  // showFeedback(index === currentQuestion.correct);

  showFeedback(isCorrect);
  selectedChoiceRecorded = true; // Mark the choice as recorded
  clearInterval(timer); // Stop the timer when an answer is selected

  // Disable radio buttons after selection
  document.querySelectorAll("input[name='answer']").forEach(radio => {
    radio.disabled = true;
  });

  enableNextButton(); // Ensure "Next" button is enabled after answering
  // Enable next button after answering
  // document.getElementById("next").classList.remove("hidden");
  // document.getElementById("next").disabled = false; // enable next button
  // document.getElementById("hint").classList.add("hidden");
}


function nextQuestion() {
  currentQuestionIndex++;
  if (currentQuestionIndex < shuffledQuestions.length) {
    loadQuestion();
    document.getElementById("next").classList.add("hidden"); // Hide Next button initially
      // document.getElementById("feedback").innerText = ""; // Clear feedback
      // document.getElementById("hint").classList.remove("hidden");
      // document.getElementById("next").disabled = false;
      // loadQuestion();
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

  // Record the selected answer only if the user clicks "Check Answer"
  const selectedIndex = parseInt(selectedRadio.value);
  const isCorrect = selectedIndex === currentQuestion.correct;

  showFeedback(isCorrect);

  // Lock the questions 
  document.querySelectorAll("input[name='answer']").forEach(radio => {
    radio.disabled = true;
  });

  // Prompt the user to click the next question button 
  document.getElementById("next").classList.remove("hidden");
  document.getElementById("feedback").innerText += " Please click the 'Next Question' button to continue.";
}


function showFeedback(isCorrect) {
  const feedbackElement = document.getElementById("feedback");
  if (isCorrect) {
    feedbackElement.innerText = `Correct! Great job, ${username}!`;
    feedbackElement.style.color = "green";
  } else {
    feedbackElement.innerText = "Incorrect. Try again to see the right question or move to the next question!";
    feedbackElement.style.color = "red";
  }
}


function useHint() {
  if (!hintUsed) {
    hintUsed = true;
    alert(`Hint: The correct answer starts with "${shuffledQuestions[currentQuestionIndex].answers[shuffledQuestions[currentQuestionIndex].correct][0]}"`);
    document.getElementById("hint").disabled = true; // Disable hint button after use
  }
}

function showResults() {
  document.getElementById("quiz").classList.add("hidden");
  document.getElementById("result").classList.remove("hidden");

  // Display score
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

  // Display the feedback based on score
  document.getElementById("feedback").innerText = feedback;

  // Populate comparison between answers and correct answers
  const resultsElement = document.getElementById("comparison");
  resultsElement.innerHTML = "<h3>Your Choices Compared to Correct Answers:</h3>";

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
  //location.reload();
  currentQuestionIndex = 0;
  score = 0;
  streak = 0;
  hintUsed = false;
  results = [];
  shuffledQuestions = shuffleQuestions(); //Reload questions
  document.getElementById("result").classList.add("hidden");
  document.getElementById("feedback").innerText = "";
  document.getElementById("login").classList.add("hidden");
  document.getElementById("quiz").classList.remove("hidden");
  loadQuestion();

}
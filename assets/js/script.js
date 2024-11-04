const questions = [
    {
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
    }
  ];
  
  let currentQuestionIndex = 0;
  let score = 0;
  let username = "";
  
  function startQuiz() {
    const nameInput = document.getElementById("username").value;
    if (nameInput.trim() === "") {
      alert("Please enter your name.");
      return;
    }
    username = nameInput;
    document.getElementById("login").classList.add("hidden");
    document.getElementById("quiz").classList.remove("hidden");
    loadQuestion();
  }
  
  function loadQuestion() {
    const questionElement = document.getElementById("question");
    const answersElement = document.getElementById("answers");
    const questionNumberElement = document.getElementById("question-number");
    const progressElement = document.getElementById("progress");
  
    questionNumberElement.innerText = currentQuestionIndex + 1;
    questionElement.innerText = questions[currentQuestionIndex].question;
    answersElement.innerHTML = "";
  
    questions[currentQuestionIndex].answers.forEach((answer, index) => {
      const button = document.createElement("button");
      button.innerText = answer;
      button.onclick = () => selectAnswer(index);
      answersElement.appendChild(button);
    });
  
    progressElement.style.width = ((currentQuestionIndex + 1) / questions.length) * 100 + "%";
  }
  
  function selectAnswer(index) {
    if (index === questions[currentQuestionIndex].correct) {
      score++;
    }
    document.querySelectorAll("#answers button").forEach(btn => (btn.disabled = true));
  }
  
  function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
      loadQuestion();
    } else {
      showResults();
    }
  }
  
  function showResults() {
    document.getElementById("quiz").classList.add("hidden");
    document.getElementById("result").classList.remove("hidden");
    document.getElementById("score").innerText = `${username}, you scored ${score} out of ${questions.length}!`;
  }
  
  function restartQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    document.getElementById("result").classList.add("hidden");
    document.getElementById("login").classList.remove("hidden");
  }
  
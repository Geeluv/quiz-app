let questions = [];
async function generateQuiz() {
    const response = await fetch('https://the-trivia-api.com/v2/questions');
    const responseToJson = await response.json();

    questions = responseToJson.map(question => {
        let answersArray = [
            { text: question.incorrectAnswers[0], correct: false },
            { text: question.incorrectAnswers[1], correct: false },
            { text: question.incorrectAnswers[2], correct: false },
            { text: question.correctAnswer, correct: true }
        ];
        answersArray.sort((a, b) => 0.5 - Math.random())
        return {
            category: question.category,
            difficulty: question.difficulty,
            question: question.question.text,
            answers: answersArray
        }
    })
}

const questionElement = document.querySelector("#question");
const answerButton = document.querySelector("#answer-buttons");
const nextButton = document.querySelector("#next-btn");
const difficulty = document.querySelector(".difficulty");
const category = document.querySelector(".category");

let currentQuestionIndex = 0;
let score = 0;

async function startQuiz() {
    await generateQuiz();
    difficulty.style.backgroundColor = ""
    currentQuestionIndex = 0;
    score = 0;
    nextButton.innerHTML = "Next";
    showQuestion();
}

function showQuestion() {
    resetState();
    let currentQuestion = questions[currentQuestionIndex];
    let questionNo = currentQuestionIndex + 1;
    questionElement.innerHTML = questionNo + ". " + currentQuestion.question;

    difficulty.innerHTML = `${currentQuestion.difficulty}`;
    category.innerHTML = `${currentQuestion.category}`;

    let difficultyState;
    if (currentQuestionIndex > 0) {
        difficultyState = questions[currentQuestionIndex - 1].difficulty
    }

    currentQuestion.answers.forEach(answer => {
        const button = document.createElement("button");
        button.innerHTML = answer.text;
        button.classList.add("btn");
        answerButton.appendChild(button);
        if (answer.correct) {
            button.dataset.correct = answer.correct;
        }
        button.addEventListener("click", selectAnswer);
    });

    difficulty.classList.remove(difficultyState);
    switch (currentQuestion.difficulty) {
        case "hard":
            difficulty.classList.add("hard");
            break;
        case "medium":
            difficulty.classList.add("medium");
            break;
        case "easy":
            difficulty.classList.add("easy");
        default:
            difficulty.classList.add("no-class");
    }
}

function resetState() {
    nextButton.style.display = "none";
    while (answerButton.firstChild) {
        answerButton.removeChild(answerButton.firstChild);
    }
}

function selectAnswer(e) {
    const selectedBtn = e.target;
    const isCorrect = selectedBtn.dataset.correct === "true";
    if (isCorrect) {
        selectedBtn.classList.add("correct");
        score++;
    } else {
        selectedBtn.classList.add("incorrect");
    }
    Array.from(answerButton.children).forEach(button => {
        if (button.dataset.correct === "true") {
            button.classList.add("correct");
        }
        button.disabled = true;
    });
    nextButton.style.display = "block";
}

function showScore() {
    resetState();
    questionElement.innerHTML = `You scored ${score} out of ${questions.length}!`;
    nextButton.innerHTML = "Start Again";
    nextButton.style.display = "block"
    difficulty.innerHTML = `✅`;
    category.innerHTML = `🚦`;
    difficulty.style.backgroundColor = "#fff"
}

function handleNextButton() {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        showScore();
    }
}

nextButton.addEventListener("click", () => {
    if (currentQuestionIndex < questions.length) {
        handleNextButton();
    } else {
        startQuiz();
    }
});

startQuiz();
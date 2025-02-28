/* import { auth, provider, signInWithPopup } from "./scripts/firebase.js"; */

localStorage.clear();
let currentQuestionIndex = 0;
let questionsData = {}; // This will store your quiz data from the JSON file

// Fetch the questions data
const urlParams = new URLSearchParams(window.location.search);
const quizNumber = urlParams.get("quiz") || "1"; // Default to quiz 1
const quizIndex = parseInt(quizNumber) - 1; // Convert to 0-based index

// Function to jump to a specific question
function jumpToQuestion(index) {
  currentQuestionIndex = index; // Set the index directly
  loadQuestion(currentQuestionIndex); // Load the specific question
}

fetch("../data/questions.json")
  .then((response) => response.json())
  .then((data) => {
    if (data.quizzes[quizIndex]) {
      questionsData = data.quizzes[quizIndex].questions;
      // jumpToQuestion(39);
      loadQuestion(currentQuestionIndex);
    } else {
      console.error("Quiz not found. Loading default quiz 1.");
      questionsData = data.quizzes[0].questions;
      loadQuestion(currentQuestionIndex);
    }
  })
  .catch((error) => console.error("Error loading questions.json:", error));

function loadQuestion(index) {
  const question = questionsData[index];
  document.getElementById("question").innerText = question.question;

  const answersForm = document.getElementById("answers-form");
  answersForm.innerHTML = "";

  question.answers.forEach((answer) => {
    const label = document.createElement("label");
    label.classList.add("radio-label");

    const input = document.createElement("input");
    input.type = "radio";
    input.name = "answer";
    input.value = answer.id;

    const span = document.createElement("span");
    span.classList.add("answer-label");
    span.id = answer.id;
    span.innerText = answer.text;

    label.appendChild(input);
    label.appendChild(span);
    answersForm.appendChild(label);
    answersForm.appendChild(document.createElement("br"));

    const savedAnswer = localStorage.getItem(`question-${index}`);
    if (savedAnswer) {
      input.disabled = true;
      if (input.value === question.correct_answer) {
        if (!span.innerText.includes("✅ juist!")) {
          span.innerText += " ✅ juist!";
        }
        label.style.border = "1.5px solid #0BAC16";
        label.style.backgroundColor = "#F9FFF9";
        span.style.color = "green";
      }
      if (
        input.value === savedAnswer &&
        savedAnswer !== question.correct_answer
      ) {
        if (!span.innerText.includes("❌ fout!")) {
          span.innerText += " ❌ fout!";
        }
        span.style.color = "red";
        label.style.border = "1.5px solid #F51F47";
        label.style.backgroundColor = "#FFF9F9";
      }
    }
    input.onclick = () => checkAnswer(input, question.correct_answer);
  });

  const backButton = document.getElementById("back-button");
  backButton.disabled = index === 0 ? true : false; // Explicitly enable when needed

  // Change "Next" button to "Finish" on the last question
  const nextButton = document.getElementById("next-button");
  if (index === questionsData.length - 1) {
    nextButton.innerText = "Voltooien";
    nextButton.onclick = showScorePopup;
  } else {
    nextButton.innerText = "Volgende";
    nextButton.onclick = () => navigate(1);
  }
}

function checkAnswer(selectedInput, correctAnswer) {
  const selectedValue = selectedInput.value;
  localStorage.setItem(`question-${currentQuestionIndex}`, selectedValue);
  document.querySelectorAll('input[name="answer"]').forEach((input) => {
    input.disabled = true;
  });

  const answerLabel = selectedInput.nextElementSibling;
  if (selectedValue === correctAnswer) {
    answerLabel.innerText += " ✅ juist!";
    answerLabel.style.color = "green";
    selectedInput.parentElement.style.border = "1.5px solid #0BAC16";
    selectedInput.parentElement.style.backgroundColor = "#F9FFF9";
  } else {
    answerLabel.style.color = "red";
    answerLabel.innerText += " ❌ fout!";
    selectedInput.parentElement.style.border = "1.5px solid #F51F47";
    selectedInput.parentElement.style.backgroundColor = "#FFF9F9";
    const correctInput = document.querySelector(
      `input[value="${correctAnswer}"]`
    );
    if (correctInput) {
      const correctLabel = correctInput.nextElementSibling;
      correctLabel.innerText += " ✅ juist!";
      correctLabel.style.color = "green";
      correctInput.parentElement.style.border = "1.5px solid #0BAC16";
      correctInput.parentElement.style.backgroundColor = "#F9FFF9";
    }
  }
}

window.navigate = function (direction) {
  if (direction === 1 && currentQuestionIndex < questionsData.length - 1) {
    currentQuestionIndex++;
  } else if (direction === -1 && currentQuestionIndex > 0) {
    currentQuestionIndex--;
  }

  loadQuestion(currentQuestionIndex);

  // Explicitly enable/disable the back button
  document.getElementById("back-button").disabled = currentQuestionIndex === 0;
};

function showScorePopup() {
  let correctAnswers = 0;
  const totalQuestions = questionsData.length;

  for (let i = 0; i < totalQuestions; i++) {
    const savedAnswer = localStorage.getItem(`question-${i}`);
    if (savedAnswer === questionsData[i].correct_answer) {
      correctAnswers++;
    }
  }

  const scorePercentage = Math.ceil((correctAnswers / totalQuestions) * 100);

  document.getElementById("score").innerText = `${scorePercentage}%`;

  document.getElementById("score").className =
    scorePercentage >= 60 ? "green" : scorePercentage >= 40 ? "orange" : "red";

  document.getElementById("score-message").innerText =
    scorePercentage >= 60
      ? "Geweldig! Je bent geslaagd voor het examen"
      : "Bijna! Blijf oefenen";

  // Show the popup
  document.getElementById("popup-overlay").style.display = "flex";

  document.getElementById("huis").onclick = () => {
    window.location.href = "https://hirad-hub.github.io/knm/";
  };

  document.getElementById("volgende").onclick = () => {
    const currentQuizNumber = parseInt(quizNumber);
    if (currentQuizNumber < 26) {
      window.location.href = `https://hirad-hub.github.io/knm/pages/quiz.html?quiz=${
        currentQuizNumber + 1
      }`;
    } else {
      alert("This is the last exam.");
    }
  };
}

function closePopup() {
  document.getElementById("popup-overlay").style.display = "none";
}

/* Google sign in */

// Get the login button by its class name

// Add click event listener to the button
import { auth, provider, signInWithPopup } from "../scripts/firebase.js";

const loginBtn = document.querySelector(".sign-in-button");

loginBtn.addEventListener("click", async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    console.log("User:", result.user);

    // Update login button text
    loginBtn.textContent = result.user.displayName || result.user.email;

    // Store user info in localStorage
    localStorage.setItem(
      "user",
      JSON.stringify({
        displayName: result.user.displayName,
        email: result.user.email,
        photoURL: result.user.photoURL,
      })
    );
  } catch (error) {
    console.error("Login failed", error);
  }
});

// Check if user is already logged in on page load
document.addEventListener("DOMContentLoaded", function () {
  const savedUser = localStorage.getItem("user");
  if (savedUser) {
    const user = JSON.parse(savedUser);
    const loginBtn = document.querySelector(".sign-in-button");
    loginBtn.textContent = user.displayName || user.email;
  }
});

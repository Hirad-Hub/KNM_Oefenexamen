localStorage.clear();
let currentQuestionIndex = 0;
let questionsData = {}; // This will store your quiz data from the JSON file

// Fetch the questions data
// Get the quiz number from the URL (e.g., ?quiz=1 or ?quiz=2)
const urlParams = new URLSearchParams(window.location.search);
const quizNumber = urlParams.get("quiz") || "1"; // Default to quiz 1
const quizIndex = parseInt(quizNumber) - 1; // Convert to 0-based index

// Fetch the questions data
fetch("data/questions.json")
  .then((response) => response.json())
  .then((data) => {
    if (data.quizzes[quizIndex]) {
      questionsData = data.quizzes[quizIndex].questions;
      loadQuestion(currentQuestionIndex);
    } else {
      console.error("Quiz not found. Loading default quiz 1.");
      questionsData = data.quizzes[0].questions; // Fallback to quiz 1
      loadQuestion(currentQuestionIndex);
    }
  })
  .catch((error) => console.error("Error loading questions.json:", error));

// Rest of your existing JavaScript code (loadQuestion, checkAnswer, navigate) remains unchanged

// Function to load a question and its answers
function loadQuestion(index) {
  const question = questionsData[index];

  document.getElementById("question").innerText = question.question;

  // Clear all previous radio inputs and labels first
  const answersForm = document.getElementById("answers-form");
  answersForm.innerHTML = ""; // Clear the form completely

  // Create and display the correct number of answer options
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

    // Check if an answer has already been saved
    const savedAnswer = localStorage.getItem(`question-${index}`);
    if (savedAnswer) {
      // If the answer is already saved, disable all options and check the selected one
      input.disabled = true; // Lock all options for this question

      // Apply the green style to the correct answer regardless of the selected answer's correctness
      if (input.value === question.correct_answer) {
        if (!span.innerText.includes("✅ juist!")) {
          // Check if "juist!" is already added
          span.innerText += " ✅ juist!";
        }
        label.style.border = "1.5px solid #0BAC16"; // Add green border
        label.style.backgroundColor = "#F9FFF9"; // Light green background
        span.style.color = "green";
      }

      // If the saved answer is the correct one, mark it as correct
      if (input.value === savedAnswer) {
        if (savedAnswer === question.correct_answer) {
          if (!span.innerText.includes("✅ juist!")) {
            // Check if "juist!" is already added
            span.innerText += " ✅ juist!";
          }
        } else {
          if (!span.innerText.includes("❌ fout!")) {
            // Check if "fout!" is already added
            span.innerText += " ❌ fout!";
          }
          span.style.color = "red";
          label.style.border = "1.5px solid #F51F47"; // Add red border
          label.style.backgroundColor = "#FFF9F9"; // Light pink background
        }
      }
    }

    input.onclick = () => {
      checkAnswer(input, question.correct_answer);
    };
  });

  // Hide feedback message if exists
  const feedback = document.getElementById("feedback");
  if (feedback) {
    feedback.remove();
  }

  // Load saved answer from localStorage
  const savedAnswer = localStorage.getItem(`question-${index}`);

  // Disable Back button if on the first question
  document.getElementById("back-button").disabled = index === 0;
}

// Check the selected answer instantly
function checkAnswer(selectedInput, correctAnswer) {
  const selectedValue = selectedInput.value;

  // Save the selected answer to localStorage
  localStorage.setItem(`question-${currentQuestionIndex}`, selectedValue);

  // Disable all inputs after selection
  document.querySelectorAll('input[name="answer"]').forEach((input) => {
    input.disabled = true;
  });

  // Apply color for correct/incorrect answer
  const answerLabel = selectedInput.nextElementSibling;
  if (selectedValue === correctAnswer) {
    answerLabel.innerText += " ✅ juist!";
    answerLabel.style.color = "green";
    selectedInput.parentElement.style.border = "1.5px solid #0BAC16"; // Green border
    selectedInput.parentElement.style.backgroundColor = "#F9FFF9"; // Light green background
  } else {
    answerLabel.style.color = "red";
    answerLabel.innerText += " ❌ fout!";
    selectedInput.parentElement.style.border = "1.5px solid #F51F47"; // Red border
    selectedInput.parentElement.style.backgroundColor = "#FFF9F9"; // Light pink background

    // Highlight the correct answer
    const correctInput = document.querySelector(
      `input[value="${correctAnswer}"]`
    );
    if (correctInput) {
      const correctLabel = correctInput.nextElementSibling;
      correctLabel.innerText += " ✅ juist!";
      correctLabel.style.color = "green";
      correctInput.parentElement.style.border = "1.5px solid #0BAC16"; // Green border
      correctInput.parentElement.style.backgroundColor = "#F9FFF9"; // Light green background
    }
  }

  // Show the "Next" button after answering
  document.getElementById("next-button").style.display = "inline";
}

// Navigate to the next question
function navigate(direction) {
  if (direction === 1 && currentQuestionIndex < questionsData.length - 1) {
    currentQuestionIndex++; // Move to next question
  } else if (direction === -1 && currentQuestionIndex > 0) {
    currentQuestionIndex--; // Move to previous question
  }

  loadQuestion(currentQuestionIndex);
}

// REMOVE THE CHECK ANSWER BUTTON
document.getElementById("check-button").remove();

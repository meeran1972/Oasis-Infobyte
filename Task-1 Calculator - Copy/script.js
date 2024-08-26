// Selecting elements
const numberButtons = document.querySelectorAll(".button.l");
const operatorButtons = document.querySelectorAll(".button.c");
const inputBox = document.querySelector(".calculator-screen");

// Initialize calculation variable
let calculation = "";

// Function to evaluate mathematical expression
function evaluateExpression(expression) {
  try {
    // Replace specific symbols with JavaScript-compatible symbols
    expression = expression.replace(/√/g, 'Math.sqrt'); // Square root
    expression = expression.replace(/\^/g, '**'); // Exponentiation
    expression = expression.replace(/÷/g, '/'); // Division
    expression = expression.replace(/×/g, '*'); // Multiplication

    // Calculate the result using eval
    const result = eval(expression);
    if (isNaN(result) || !isFinite(result)) {
      throw new Error('Invalid Calculation');
    }
    return result;
  } catch (error) {
    console.error('Error in calculation:', error);
    return 'Error';
  }
}

// Handle button click events
function handler(event) {
  const buttonText = event.target.textContent;

  if (buttonText.match(/[0-9.]/)) {
    calculation += buttonText;
    inputBox.value = calculation;
  }

  if (buttonText.match(/[+\-*/÷√^]/)) {
    // Prevent multiple consecutive operators
    if (calculation.length === 0 || /[\+\-*/÷√^]$/.test(calculation)) {
      return;
    }
    calculation += buttonText;
    inputBox.value = calculation;
  }

  if (buttonText === 'AC') {
    calculation = "";
    inputBox.value = "";
  }

  if (buttonText === 'C') {
    calculation = calculation.slice(0, -1);
    inputBox.value = calculation;
  }

  if (buttonText === '=') {
    const result = evaluateExpression(calculation);
    inputBox.value = result;
    calculation = result.toString();
  }

  if (buttonText === '+/-') {
    if (calculation) {
      if (calculation.startsWith('-')) {
        calculation = calculation.slice(1);
      } else {
        calculation = '-' + calculation;
      }
      inputBox.value = calculation;
    }
  }

  if (buttonText === '%') {
    if (calculation) {
      calculation = (parseFloat(calculation) / 100).toString();
      inputBox.value = calculation;
    }
  }
}

// Add event listeners to buttons
numberButtons.forEach(button => button.addEventListener('click', handler));
operatorButtons.forEach(button => button.addEventListener('click', handler));

// Handle keyboard input
document.addEventListener('keydown', (event) => {
  const key = event.key;

  if (key.match(/[0-9.]/)) {
    calculation += key;
    inputBox.value = calculation;
  }

  if (key.match(/[+\-*/]/)) {
    if (calculation.length === 0 || /[\+\-*/]$/.test(calculation)) {
      return;
    }
    calculation += key;
    inputBox.value = calculation;
  }

  if (key === 'Enter') {
    const result = evaluateExpression(calculation);
    inputBox.value = result;
    calculation = result.toString();
  }

  if (key === 'Backspace') {
    calculation = calculation.slice(0, -1);
    inputBox.value = calculation;
  }

  if (key === 'Escape') {
    calculation = "";
    inputBox.value = "";
  }
});

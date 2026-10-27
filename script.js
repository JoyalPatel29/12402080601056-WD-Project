// --- DOM Elements ---
    const textInput = document.getElementById('textInput');
    const limitSelect = document.getElementById('limitSelect');
    const charCountDisplay = document.getElementById('charCountDisplay');
    const remainingCountDisplay = document.getElementById('remainingCountDisplay');
    const progressBar = document.getElementById('progressBar');
    const limitLabels = document.getElementById('limitLabels');
    const emptyStateHint = document.getElementById('emptyStateHint');

    // Statistic Display Elements
    const statCharacters = document.getElementById('statCharacters');
    const statWords = document.getElementById('statWords');
    const statUppercase = document.getElementById('statUppercase');
    const statLowercase = document.getElementById('statLowercase');
    const statNumbers = document.getElementById('statNumbers');
    const statSymbols = document.getElementById('statSymbols');

    // Action Buttons & Toast
    const clearBtn = document.getElementById('clearBtn');
    const copyBtn = document.getElementById('copyBtn');
    const toastNotice = document.getElementById('toastNotice');

    /**
     * Core function: Analyzes text and updates DOM in real time.
     */
    function analyzeText() {
      const text = textInput.value;
      const limit = parseInt(limitSelect.value, 10);

      // 1. Total Characters
      const totalChars = text.length;

      // 2. Words (Handles multiple spaces, new lines, and empty input cleanly)
      const trimmedText = text.trim();
      const words = trimmedText === '' ? 0 : trimmedText.split(/\s+/).length;

      // 3. Uppercase Letters (A-Z)
      const uppercaseMatches = text.match(/[A-Z]/g);
      const uppercaseCount = uppercaseMatches ? uppercaseMatches.length : 0;

      // 4. Lowercase Letters (a-z)
      const lowercaseMatches = text.match(/[a-z]/g);
      const lowercaseCount = lowercaseMatches ? lowercaseMatches.length : 0;

      // 5. Numbers (0-9)
      const numberMatches = text.match(/[0-9]/g);
      const numbersCount = numberMatches ? numberMatches.length : 0;

      // 6. Special Symbols (Not letters, digits, or spaces)
      const symbolMatches = text.match(/[^a-zA-Z0-9\s]/g);
      const symbolsCount = symbolMatches ? symbolMatches.length : 0;

      // --- Update Statistics UI ---
      statCharacters.textContent = totalChars.toLocaleString();
      statWords.textContent = words.toLocaleString();
      statUppercase.textContent = uppercaseCount.toLocaleString();
      statLowercase.textContent = lowercaseCount.toLocaleString();
      statNumbers.textContent = numbersCount.toLocaleString();
      statSymbols.textContent = symbolsCount.toLocaleString();

      // --- Empty State Hint Message ---
      if (totalChars === 0) {
        emptyStateHint.textContent = 'Enter text above to see detailed breakdown';
      } else {
        emptyStateHint.textContent = 'Live updates active';
      }

      // --- Update Character Limit & Progress Bar ---
      updateLimitUI(totalChars, limit);
    }

    /**
     * Updates the limit indicator, remaining count, and progress bar.
     */
    function updateLimitUI(currentCount, limit) {
      const remaining = limit - currentCount;
      charCountDisplay.textContent = `${currentCount} / ${limit} characters`;

      // Percentage for progress bar (capped at 100% width)
      const percentage = Math.min((currentCount / limit) * 100, 100);
      progressBar.style.width = `${percentage}%`;

      if (remaining < 0) {
        // Exceeded state: Turn red and show warning message
        const overLimit = Math.abs(remaining);
        remainingCountDisplay.textContent = `Limit exceeded by ${overLimit} character${overLimit > 1 ? 's' : ''}!`;
        
        limitLabels.classList.add('exceeded');
        progressBar.classList.add('exceeded');
      } else {
        // Normal state
        remainingCountDisplay.textContent = `${remaining} character${remaining === 1 ? '' : 's'} remaining`;
        
        limitLabels.classList.remove('exceeded');
        progressBar.classList.remove('exceeded');
      }
    }

    // --- Event Listeners ---

    // Real-time calculation on typing, deleting, or pasting
    textInput.addEventListener('input', analyzeText);

    // Recalculate limits when dropdown option changes
    limitSelect.addEventListener('change', analyzeText);

    // Clear Text button: resets input and triggers live update
    clearBtn.addEventListener('click', () => {
      textInput.value = '';
      textInput.focus();
      analyzeText();
    });

    // Copy Text button: copies current content to clipboard
    copyBtn.addEventListener('click', async () => {
      if (!textInput.value) {
        alert('There is no text to copy!');
        return;
      }

      try {
        await navigator.clipboard.writeText(textInput.value);
        // Display toast feedback message
        toastNotice.style.display = 'inline';
        setTimeout(() => {
          toastNotice.style.display = 'none';
        }, 2500);
      } catch (err) {
        // Fallback for older browsers
        textInput.select();
        document.execCommand('copy');
        toastNotice.style.display = 'inline';
        setTimeout(() => {
          toastNotice.style.display = 'none';
        }, 2500);
      }
    });

    // Initial run on page load
    analyzeText();

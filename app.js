(function () {
  /* ── Tip Calculator ── */
  var billInput = document.getElementById('bill-amount');
  var numPeopleInput = document.getElementById('num-people');
  var tipAmountEl = document.getElementById('tip-amount');
  var newTotalEl = document.getElementById('new-total');
  var perPersonEl = document.getElementById('per-person');
  var tipButtons = document.querySelectorAll('.tip-btn');
  var clearBtn = document.getElementById('clear-btn');

  var activeTipPercent = null;

  function setActiveButton(clickedBtn) {
    tipButtons.forEach(function (btn) {
      btn.classList.remove('active');
    });
    if (clickedBtn) {
      clickedBtn.classList.add('active');
    }
  }

  function clearTipResults() {
    tipAmountEl.textContent = '\u2014';
    tipAmountEl.classList.remove('calculated');
    newTotalEl.textContent = '\u2014';
    newTotalEl.classList.remove('calculated');
    perPersonEl.textContent = '\u2014';
    perPersonEl.classList.remove('calculated');
  }

  function clearPerPerson() {
    perPersonEl.textContent = '\u2014';
    perPersonEl.classList.remove('calculated');
  }

  function showTipResults(tipAmount, newTotal) {
    tipAmountEl.textContent = '$' + tipAmount.toFixed(2);
    tipAmountEl.classList.add('calculated');
    newTotalEl.textContent = '$' + newTotal.toFixed(2);
    newTotalEl.classList.add('calculated');

    // Per-person calculation
    var rawPeople = numPeopleInput.value;
    if (rawPeople === '' || rawPeople === null) {
      clearPerPerson();
      return;
    }
    var people = parseFloat(rawPeople);
    if (
      isNaN(people) ||
      !isFinite(people) ||
      !Number.isInteger(people) ||
      people < 1
    ) {
      clearPerPerson();
      return;
    }
    var perPerson = newTotal / people;
    perPersonEl.textContent = '$' + perPerson.toFixed(2);
    perPersonEl.classList.add('calculated');
  }

  function calculate(tipPercent) {
    var rawValue = billInput.value;

    if (rawValue === '' || rawValue === null) {
      clearTipResults();
      return;
    }

    var bill = parseFloat(rawValue);

    if (isNaN(bill) || !isFinite(bill) || bill <= 0) {
      clearTipResults();
      return;
    }

    var tipAmount = bill * (tipPercent / 100);
    var newTotal = bill + tipAmount;
    showTipResults(tipAmount, newTotal);
  }

  tipButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var percent = parseInt(btn.getAttribute('data-tip'), 10);
      activeTipPercent = percent;
      setActiveButton(btn);
      calculate(percent);
    });
  });

  billInput.addEventListener('input', function () {
    if (activeTipPercent !== null) {
      calculate(activeTipPercent);
    }
  });

  numPeopleInput.addEventListener('input', function () {
    if (activeTipPercent !== null) {
      calculate(activeTipPercent);
    }
  });

  clearBtn.addEventListener('click', function () {
    billInput.value = '';
    numPeopleInput.value = '1';
    activeTipPercent = null;
    setActiveButton(null);
    clearTipResults();
  });

  /* ── Mode Toggle ── */
  var tipPanel = document.getElementById('tip-panel');
  var calcPanel = document.getElementById('calc-panel');
  var tabTip = document.getElementById('tab-tip');
  var tabCalc = document.getElementById('tab-calc');
  var appTitle = document.getElementById('app-title');

  tabTip.addEventListener('click', function () {
    tabTip.classList.add('active');
    tabCalc.classList.remove('active');
    tipPanel.classList.remove('hidden');
    calcPanel.classList.add('hidden');
    appTitle.textContent = 'Tip Calculator';
  });

  tabCalc.addEventListener('click', function () {
    tabCalc.classList.add('active');
    tabTip.classList.remove('active');
    calcPanel.classList.remove('hidden');
    tipPanel.classList.add('hidden');
    appTitle.textContent = 'Calculator';
  });

  /* ── Basic Calculator ── */
  var calcDisplay = document.getElementById('calc-display');

  var calcState = {
    displayValue: '0',
    firstOperand: null,
    operator: null,
    waitingForSecond: false,
    justEvaluated: false
  };

  function updateCalcDisplay() {
    calcDisplay.textContent = calcState.displayValue;
  }

  function calcReset() {
    calcState.displayValue = '0';
    calcState.firstOperand = null;
    calcState.operator = null;
    calcState.waitingForSecond = false;
    calcState.justEvaluated = false;
    // Remove active-op highlight from all operator buttons
    document.querySelectorAll('.calc-op-main').forEach(function (b) {
      b.classList.remove('active-op');
    });
    updateCalcDisplay();
  }

  function handleDigit(digit) {
    if (calcState.waitingForSecond) {
      calcState.displayValue = digit;
      calcState.waitingForSecond = false;
    } else {
      if (calcState.justEvaluated) {
        calcState.displayValue = digit;
        calcState.justEvaluated = false;
      } else {
        calcState.displayValue =
          calcState.displayValue === '0' ? digit : calcState.displayValue + digit;
      }
    }
    updateCalcDisplay();
  }

  function handleDecimal() {
    if (calcState.waitingForSecond) {
      calcState.displayValue = '0.';
      calcState.waitingForSecond = false;
      updateCalcDisplay();
      return;
    }
    if (calcState.justEvaluated) {
      calcState.displayValue = '0.';
      calcState.justEvaluated = false;
      updateCalcDisplay();
      return;
    }
    if (calcState.displayValue.indexOf('.') === -1) {
      calcState.displayValue += '.';
    }
    updateCalcDisplay();
  }

  function performCalculation(first, op, second) {
    switch (op) {
      case '+': return first + second;
      case '−': return first - second;
      case '×': return first * second;
      case '÷':
        if (second === 0) return 'Error';
        return first / second;
      default: return second;
    }
  }

  function formatResult(value) {
    if (value === 'Error') return 'Error';
    // Avoid floating point display issues
    var str = parseFloat(value.toFixed(10)).toString();
    return str;
  }

  function handleOperator(op) {
    if (op === 'negate') {
      if (calcState.displayValue !== 'Error') {
        var val = parseFloat(calcState.displayValue);
        if (!isNaN(val)) {
          calcState.displayValue = (val * -1).toString();
          updateCalcDisplay();
        }
      }
      return;
    }
    if (op === 'percent') {
      if (calcState.displayValue !== 'Error') {
        var pval = parseFloat(calcState.displayValue);
        if (!isNaN(pval)) {
          calcState.displayValue = (pval / 100).toString();
          updateCalcDisplay();
        }
      }
      return;
    }

    var currentValue = parseFloat(calcState.displayValue);

    // If there's already a pending operation and we're not waiting for second operand, evaluate first
    if (calcState.operator !== null && !calcState.waitingForSecond && !calcState.justEvaluated) {
      var result = performCalculation(calcState.firstOperand, calcState.operator, currentValue);
      if (result === 'Error') {
        calcState.displayValue = 'Error';
        calcState.firstOperand = null;
        calcState.operator = null;
        calcState.waitingForSecond = false;
        calcState.justEvaluated = false;
        document.querySelectorAll('.calc-op-main').forEach(function (b) {
          b.classList.remove('active-op');
        });
        updateCalcDisplay();
        return;
      }
      calcState.displayValue = formatResult(result);
      calcState.firstOperand = result;
      updateCalcDisplay();
    } else {
      calcState.firstOperand = isNaN(currentValue) ? 0 : currentValue;
    }

    calcState.operator = op;
    calcState.waitingForSecond = true;
    calcState.justEvaluated = false;

    // Highlight active operator button
    document.querySelectorAll('.calc-op-main').forEach(function (b) {
      b.classList.remove('active-op');
    });
    document.querySelectorAll('.calc-op-main').forEach(function (b) {
      if (b.getAttribute('data-op') === op) {
        b.classList.add('active-op');
      }
    });
  }

  function handleEquals() {
    if (calcState.operator === null || calcState.waitingForSecond) {
      calcState.justEvaluated = true;
      return;
    }
    var secondValue = parseFloat(calcState.displayValue);
    if (isNaN(secondValue)) {
      calcState.justEvaluated = true;
      return;
    }
    var result = performCalculation(calcState.firstOperand, calcState.operator, secondValue);
    if (result === 'Error') {
      calcState.displayValue = 'Error';
    } else {
      calcState.displayValue = formatResult(result);
    }
    calcState.firstOperand = null;
    calcState.operator = null;
    calcState.waitingForSecond = false;
    calcState.justEvaluated = true;
    document.querySelectorAll('.calc-op-main').forEach(function (b) {
      b.classList.remove('active-op');
    });
    updateCalcDisplay();
  }

  // Wire up calculator buttons
  document.querySelectorAll('.calc-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var action = btn.getAttribute('data-action');
      if (action === 'ac') {
        calcReset();
      } else if (action === 'digit') {
        if (calcState.displayValue === 'Error') return;
        handleDigit(btn.getAttribute('data-digit'));
      } else if (action === 'decimal') {
        if (calcState.displayValue === 'Error') return;
        handleDecimal();
      } else if (action === 'op') {
        if (calcState.displayValue === 'Error' &&
            btn.getAttribute('data-op') !== 'negate' &&
            btn.getAttribute('data-op') !== 'percent') return;
        handleOperator(btn.getAttribute('data-op'));
      } else if (action === 'equals') {
        if (calcState.displayValue === 'Error') return;
        handleEquals();
      }
    });
  });

  /* ── Init ── */
  clearTipResults();
  updateCalcDisplay();
})();

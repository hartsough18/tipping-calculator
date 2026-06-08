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

  tabTip.addEventListener('click', function () {
    tabTip.classList.add('active');
    tabCalc.classList.remove('active');
    tipPanel.classList.remove('hidden');
    calcPanel.classList.add('hidden');
  });

  tabCalc.addEventListener('click', function () {
    tabCalc.classList.add('active');
    tabTip.classList.remove('active');
    calcPanel.classList.remove('hidden');
    tipPanel.classList.add('hidden');
  });

  /* ── Basic Calculator ── */
  var calcDisplay = document.getElementById('calc-display');
  var calcHistoryPanel = document.getElementById('calc-history-panel');
  var calcHistoryList = document.getElementById('calc-history-list');
  var calcHistoryBtn = document.getElementById('calc-history-btn');

  // History: stores up to 5 most recent completed calculations
  // Each entry: { expression: string, result: string }
  var calcHistory = [];
  var historyVisible = false;

  var calcState = {
    displayValue: '0',
    firstOperand: null,
    operator: null,
    waitingForSecond: false,
    justEvaluated: false,
    // Track expression for history
    expressionFirst: null,
    expressionOp: null
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
    calcState.expressionFirst = null;
    calcState.expressionOp = null;
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

  function addToHistory(expression, result) {
    calcHistory.unshift({ expression: expression, result: result });
    if (calcHistory.length > 5) {
      calcHistory = calcHistory.slice(0, 5);
    }
    if (historyVisible) {
      renderHistory();
    }
  }

  function renderHistory() {
    calcHistoryList.innerHTML = '';
    if (calcHistory.length === 0) {
      var emptyLi = document.createElement('li');
      emptyLi.className = 'calc-history-empty';
      emptyLi.textContent = 'No calculations yet';
      calcHistoryList.appendChild(emptyLi);
      return;
    }
    calcHistory.forEach(function (entry) {
      var li = document.createElement('li');
      var exprSpan = document.createElement('span');
      exprSpan.className = 'calc-history-expr';
      exprSpan.textContent = entry.expression;
      var resultSpan = document.createElement('span');
      resultSpan.className = 'calc-history-result';
      resultSpan.textContent = '= ' + entry.result;
      li.appendChild(exprSpan);
      li.appendChild(resultSpan);
      calcHistoryList.appendChild(li);
    });
  }

  function toggleHistory() {
    historyVisible = !historyVisible;
    if (historyVisible) {
      renderHistory();
      calcHistoryPanel.classList.remove('hidden');
      calcHistoryBtn.classList.add('history-open');
    } else {
      calcHistoryPanel.classList.add('hidden');
      calcHistoryBtn.classList.remove('history-open');
    }
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
        calcState.expressionFirst = null;
        calcState.expressionOp = null;
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

    calcState.expressionFirst = calcState.displayValue;
    calcState.expressionOp = op;
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
    var secondStr = calcState.displayValue;
    var result = performCalculation(calcState.firstOperand, calcState.operator, secondValue);
    var resultStr;
    if (result === 'Error') {
      resultStr = 'Error';
      calcState.displayValue = 'Error';
    } else {
      resultStr = formatResult(result);
      calcState.displayValue = resultStr;
    }

    // Build expression string for history
    var exprFirst = calcState.expressionFirst !== null ? calcState.expressionFirst : String(calcState.firstOperand);
    var exprOp = calcState.expressionOp !== null ? calcState.expressionOp : calcState.operator;
    var expression = exprFirst + ' ' + exprOp + ' ' + secondStr;
    addToHistory(expression, resultStr);

    calcState.firstOperand = null;
    calcState.operator = null;
    calcState.waitingForSecond = false;
    calcState.justEvaluated = true;
    calcState.expressionFirst = null;
    calcState.expressionOp = null;
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
      } else if (action === 'history') {
        toggleHistory();
      }
    });
  });

  /* ── Init ── */
  clearTipResults();
  updateCalcDisplay();
})();

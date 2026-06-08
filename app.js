(function () {
  /* ── DOM refs ── */
  var billInput = document.getElementById('bill-amount');
  var tipAmountEl = document.getElementById('tip-amount');
  var newTotalEl = document.getElementById('new-total');
  var tipButtons = document.querySelectorAll('.tip-btn');
  var historyBtn = document.getElementById('history-btn');
  var backBtn = document.getElementById('back-btn');
  var calcView = document.getElementById('calc-view');
  var historyView = document.getElementById('history-view');
  var historyList = document.getElementById('history-list');
  var historyEmpty = document.getElementById('history-empty');

  /* ── State ── */
  var activeTipPercent = null;
  var calculationHistory = []; // max 5, newest first

  /* ── Tip Calculator ── */
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
  }

  function showTipResults(tipAmount, newTotal) {
    tipAmountEl.textContent = '$' + tipAmount.toFixed(2);
    tipAmountEl.classList.add('calculated');
    newTotalEl.textContent = '$' + newTotal.toFixed(2);
    newTotalEl.classList.add('calculated');
  }

  function saveToHistory(bill, tipPercent, tipAmount, newTotal) {
    calculationHistory.unshift({
      bill: bill,
      tipPercent: tipPercent,
      tipAmount: tipAmount,
      newTotal: newTotal
    });
    if (calculationHistory.length > 5) {
      calculationHistory = calculationHistory.slice(0, 5);
    }
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
    saveToHistory(bill, tipPercent, tipAmount, newTotal);
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

  /* ── History View ── */
  function renderHistory() {
    // Remove all existing entries (but keep the empty message element)
    var entries = historyList.querySelectorAll('.history-entry');
    entries.forEach(function (el) {
      el.parentNode.removeChild(el);
    });

    if (calculationHistory.length === 0) {
      historyEmpty.classList.remove('hidden');
      return;
    }

    historyEmpty.classList.add('hidden');

    calculationHistory.forEach(function (entry) {
      var div = document.createElement('div');
      div.className = 'history-entry';

      div.innerHTML =
        '<div class="history-entry-row">' +
          '<span class="history-entry-label">Bill</span>' +
          '<span class="history-entry-value">$' + entry.bill.toFixed(2) + '</span>' +
        '</div>' +
        '<div class="history-entry-row">' +
          '<span class="history-entry-label">Tip</span>' +
          '<span class="history-entry-value">' + entry.tipPercent + '%</span>' +
        '</div>' +
        '<div class="history-entry-row">' +
          '<span class="history-entry-label">Tip Amount</span>' +
          '<span class="history-entry-value accent">$' + entry.tipAmount.toFixed(2) + '</span>' +
        '</div>' +
        '<div class="history-entry-row">' +
          '<span class="history-entry-label">New Total</span>' +
          '<span class="history-entry-value accent">$' + entry.newTotal.toFixed(2) + '</span>' +
        '</div>';

      historyList.appendChild(div);
    });
  }

  historyBtn.addEventListener('click', function () {
    renderHistory();
    calcView.classList.add('hidden');
    historyView.classList.remove('hidden');
  });

  backBtn.addEventListener('click', function () {
    historyView.classList.add('hidden');
    calcView.classList.remove('hidden');
  });

  /* ── Init ── */
  clearTipResults();
})();

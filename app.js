(function () {
  /* ── DOM refs ── */
  var billInput = document.getElementById('bill-amount');
  var tipAmountEl = document.getElementById('tip-amount');
  var newTotalEl = document.getElementById('new-total');
  var tipButtons = document.querySelectorAll('.tip-btn');

  /* ── State ── */
  var activeTipPercent = null;

  /* ── Helpers ── */
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

  function calculate(tipPercent) {
    var rawValue = billInput.value;

    if (rawValue === '' || rawValue === null) {
      clearTipResults();
      return;
    }

    var bill = parseFloat(rawValue);

    if (isNaN(bill) || !isFinite(bill) || bill < 0) {
      clearTipResults();
      return;
    }

    /* bill === 0 is valid: tip = $0.00, total = $0.00 */
    var tipAmount = bill * (tipPercent / 100);
    var newTotal = bill + tipAmount;
    showTipResults(tipAmount, newTotal);
  }

  /* ── Event wiring ── */
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

  /* ── Init ── */
  clearTipResults();
})();

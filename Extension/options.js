// Saves options to chrome.storage
function save_options() {
    var chartType = document.getElementById('chartType').value;
    var doTranslate = document.getElementById('translate').checked;
    chrome.storage.sync.set({
      chart: chartType,
      translate: doTranslate
    }, function() {
      // Update status to let user know options were saved.
      var status = document.getElementById('status');
      status.textContent = 'Options saved.';
      setTimeout(function() {
        status.textContent = '';
      }, 750);
    });
  }
  
  // Restores select box and checkbox state using the preferences
  // stored in chrome.storage.
  function restore_options() {
    // Use default value color = 'red' and likesColor = true.
    chrome.storage.sync.get({
      chart: 'doughnut',
      translate: false
    }, function(items) {
      document.getElementById('chartType').value = items.chart;
      document.getElementById('translate').checked = items.translate;
    });
  }
  document.addEventListener('DOMContentLoaded', restore_options);
  document.getElementById('save').addEventListener('click',
      save_options);
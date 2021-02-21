chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      console.log(sender.tab ?
                  "from a content script:" + sender.tab.url :
                  "from the extension");
      if (request.greeting == "processingDone")
      {window.location.href="popup.html"; sendResponse({farewell: "goodbye"});}
      else if (request.greeting=="serverDown")
      {window.close();
        sendResponse({farewell: "goodbye"})}
    }
  );
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      console.log(sender.tab ?
                  "from a content script:" + sender.tab.url :
                  "from the extension");
      if (request.greeting == "processingDone"){
          console.log(sender.tab.id);
            chrome.browserAction.setBadgeText({tabId:sender.tab.id, text: 'Done'});
            chrome.browserAction.setBadgeBackgroundColor({color: '#4688F1'}); 
            sendResponse({farewell: "goodbye"});
        }
    

        else if (request.greeting=="ytNav"){
            chrome.browserAction.setBadgeText({tabId:sender.tab.id, text: ''});
            chrome.browserAction.setBadgeBackgroundColor({color: '#4688F1'});
            sendResponse({farewell: "goodbye"});

        }

        else if (request.greeting=="serverDown"){
            chrome.browserAction.setBadgeText({tabId:sender.tab.id, text: 'Down'});
            chrome.browserAction.setBadgeBackgroundColor({color: '#4688F1'});
            sendResponse({farewell: "goodbye"});
        }

    }
  );
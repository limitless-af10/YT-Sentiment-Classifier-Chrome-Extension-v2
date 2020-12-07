chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {type: "getCount"}, function(info) {
        if(typeof info == "undefined") {
            // That's kind of bad
            console.log("no");
            if(chrome.runtime.lastError) {
                console.log();
            }
        } else if(info==null)
        {
            alert("other no");
        } else{
            document.getElementById('text').textContent = info;
        }
    });
});
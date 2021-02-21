var angry=0;
var joy=0;
var sad=0;
var fear=0;
var neutral=0;

//send message to content script to activate mechanism for server request
chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {type: "promptServer"}, function(info) {
        if(typeof info == "undefined") {
            // That's kind of bad
            console.log("undefined response received");
            if(chrome.runtime.lastError) {
                console.log("runtime error");
            }
        } else if(info==null){
            console.log("Null received from content script");
            window.location.href="defPopup copy.html";
            chrome.browserAction.setBadgeText({tabId:tabs[0].id, text: 'Proc'});
            chrome.browserAction.setBadgeBackgroundColor({color: '#4688F1'});
        }
          else if(info=="NotYoutubeVid"){
            window.location.href="redirect.html";
        }

        else if(info=="nothing"){
            console.log('nah');
        }

         else{
            //update popup.html to display server response as communicated by content script
            var data = JSON.parse(info);
            document.getElementById('text').textContent = data.msg;
            
            if(data.msg!="No Comments Found"){
            angry=data.anger;
            joy=data.joy;
            sad=data.sadness;
            fear=data.fear;
            neutral=data.neutral;
            chrome.storage.sync.get(['chart'], function(result) {

                var ctx = document.getElementById("chart").getContext('2d');
                var myChart = new Chart(ctx, {
                type: result.chart,
                data: {
                    labels: [ 'Anger', 'Joy', 'Sadness', 'Fear', 'Neutral' ],
                        datasets: [{
                            label:'Data',
                        backgroundColor: [
                            "#34AFFB",
                            "#d56328",
                            "#ff1b2d",
                            "#0078d7",
                            "#97F024"
                        ],
                        data: [ angry, joy, sad, fear, neutral ],
    
                        borderWidth:0,
                    }]
                },
    
                options: {
    
                    legend: {
                        labels: {
                            // This more specific font property overrides the global property
                            fontColor: '#F3F8ED',
                            fontFamily: "'Nunito', 'sans-serif'"
                        }
                    }
                }
            });
       
            });}
        }
    });
});

//message listener to lookout for communication from content script
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      console.log(sender.tab ?
                  "from a content script:" + sender.tab.url :
                  "from the extension");
      //content script received the server response and sent it
      if (request.greeting == "serverResponseReceived")
      {
        //update popup.html to display recent server response
        
        var data = JSON.parse(info);
        document.getElementById('text').textContent = data.msg;
            
        if(data.msg!="No Comments Found"){
        angry=data.anger;
        joy=data.joy;
        sad=data.sadness;
        fear=data.fear;
        neutral=data.neutral;

        chrome.storage.sync.get(['chart'], function(result) 
        {

            var ctx = document.getElementById("chart").getContext('2d');
            var myChart = new Chart(ctx, 
            {
                type: result.chart,
                data: {
                    labels: [ 'Anger', 'Joy', 'Sadness', 'Fear', 'Neutral' ],
                    datasets: [{
                        label:'Data',
                        backgroundColor:[
                                            "#34AFFB",
                                            "#d56328",
                                            "#ff1b2d",
                                            "#0078d7",
                                            "#97F024"
                                        ],
                        data: [ angry, joy, sad, fear, neutral ],

                        borderWidth:0,
                    }]
            },

                options: 
                {

                    legend: 
                    {
                        labels: 
                        {
                            // This more specific font property overrides the global property
                            fontColor: '#F3F8ED',
                            fontFamily: "'Nunito', 'sans-serif'"
                        }
                    }
                }
            });
   
        });}

        sendResponse({farewell: "goodbye"});
        
      }

      else if(request.greeting == "serverPrompted")
      {
        
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {

            window.location.href="defPopup copy.html";
            chrome.browserAction.setBadgeText({tabId:tabs[0].id, text: 'Proc'});
            chrome.browserAction.setBadgeBackgroundColor({color: '#4688F1'});

            sendResponse({farewell: "goodbye"});

        });
         
      }
        
    });
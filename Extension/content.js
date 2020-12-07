var lastClick = 0;
const delay = 200;
var serverResponse = null;

function run(){
    // your youtube extention logic
    console.log(Date.now()-lastClick);

    if(Date.now() - lastClick <= delay)
        return;
    
    var info = window.location.href;
    console.log(window.location.href);
    
    if (!info.includes("watch"))
        {return;}

    lastClick=Date.now();
    //////////////////
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost:5000/get_data/');
    xhr.onload = function() {
        console.log(xhr.response);
        serverResponse = xhr.response;
     };

     xhr.send(info);
    /////////////////
}
    
window.onload = run;
window.addEventListener('yt-navigate-finish', run, true);

chrome.runtime.onMessage.addListener(
    function(message, sender, sendResponse) {
        switch(message.type) {
            case "getCount":
                var tabURL = window.location.href;
                if (!tabURL.includes("https://www.youtube.com/watch"))
                    {   console.error("Not a youtube video: ", message);
                        sendResponse("Must be on a youtube video page");
                    }
                sendResponse(serverResponse);
                break;
            default:
                console.error("Unrecognised message: ", message);
        }
    }
);


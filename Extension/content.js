var lastClick = 0; //used to save the date of last time client made a request to the server
const delay = 200; //the minimum constant threshold that must be maintained inbetween two consecutive server requests
var serverResponseData = null; //the global variable used to store useful server response that is displayed to client
translate=false;

chrome.storage.sync.get(['translate'], function(result) {
    translate=result.translate;
    console.log(translate);
  });

if(translate==true)
timeoutLimit=25000;
else
timeoutLimit=10000;  

function run(request, sender, sendResponse){
  
    /*checking if the time between previously completed and current potential 
    server request is more than mimimum specified delay
    if false the functions returns without making request to server*/
    //console.log(Date.now()-lastClick); //print time difference between two check points 
    if(Date.now() - lastClick <= delay)
        return;
    

    var info = window.location.href; //storing the url of current window
    //console.log(window.location.href); //print the url of current window
    
    if (!info.includes("watch")) return; // return if the url is not of a youtube "video"

    lastClick=Date.now(); //updating lastClick to store the new date of last successfull server request
    
    //////////////////////////////////////////////////////////////////////////////////////////////////////
    //setup and make request to server and wait for response
    const xhr = new XMLHttpRequest();
    xhr.ontimeout = function () {
        console.error('there was a problem communicating with the server');
           
        chrome.runtime.sendMessage({greeting: "serverDown", data: serverResponseData}, function(response) {
            
          });

    };

    xhr.onerror = function () {
        console.error('there was a problem communicating with the server');
           
        chrome.runtime.sendMessage({greeting: "serverDown", data: serverResponseData}, function(response) {
            
          });

    };


    xhr.open('POST', 'http://localhost:5000/get_data/');

    chrome.runtime.sendMessage({greeting: "serverPrompted", data: serverResponseData}, function(response) {
        
      });

    xhr.onload = function() {
        serverResponseData=xhr.response; //store server response
        
        chrome.runtime.sendMessage({greeting: "processingDone", data: serverResponseData}, function(response) {
            //console.log(response.farewell);
          });

          


        //send message "responseReceived" for popup.js to inform server reponse completion along with useful server response data
        chrome.runtime.sendMessage({greeting: "serverResponseReceived", data: serverResponseData}, function(response) {
            //console.log(response.farewell);
          });
  
        sendResponse("nothing");

     };

    xhr.timeout=timeoutLimit

    infoAndSettings={"info":info,"translate":translate};


    xhr.send(JSON.stringify(infoAndSettings));
    
    //////////////////////////////////////////////////////////////////////////////////////////////////////
}

//window.onload = run;

/*in case of navigation on youtube, the content script does not refresh so we set serverResponseData to null
as the newly navigated page will be of a different video and we cannot use the previously acquired response*/
window.addEventListener('yt-navigate-finish', ()=>{serverResponseData=null; console.log("{Navigation} response data reset");chrome.runtime.sendMessage({greeting: "ytNav"},function(response){});}, true);

//message listener for when popup.html is accessed on the client side
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        switch(request.type) {
            case "promptServer":
                //received prompt server request from popup
                //check for invalid youtube page (other than a video page)
                var tabURL = window.location.href;
                if (!tabURL.includes("https://www.youtube.com/watch"))
                    {   console.error("Not a youtube video: ");
                        sendResponse("NotYoutubeVid");
                    }
                //call run function if serverResponseData is null, indicating a required server request    
                if(serverResponseData==null) {run(request, sender, sendResponse); return true;}
                //return previously stored server Response (will be null if the above conditional statement was true)
                else{sendResponse(serverResponseData);}
                break;
            default:
                //received unkown message request
                console.error("Unrecognised message: ");
                sendResponse({farewell: "goodbye"});
        }
    }
);

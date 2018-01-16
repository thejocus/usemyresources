
class App {
    constructor(message: any, sender: any) {
        console.log("Running.");
    }
    
}

chrome.runtime.onMessage.addListener(function(message:any, sender:any){
    let app = new App(message, sender);
});
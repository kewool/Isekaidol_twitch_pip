const { ipcRenderer } = require("electron");

let getStream;
let on = false;
let login = false;

if(login) ipcRenderer.send("getOnePickStream");

getStream = setInterval(()=>{
    if(login) ipcRenderer.send("getOnePickStream");
}, 30000);

ipcRenderer.on("login", ()=>{
    login = true;
});

ipcRenderer.on("getOnePickStream_reply", () => {
    on = true;
    clearInterval(getStream);
});

ipcRenderer.on("PIPClose", () => {
    clearInterval(getStream);
    getStream = setInterval(()=>{
        ipcRenderer.send("isStreamOff");
    },30000);
    ipcRenderer.send("debug", 2);
});
ipcRenderer.on("isStreamOff_reply", () => {
    on = false;
    clearInterval(getStream);
    getStream = setInterval(()=>{
        if(login) ipcRenderer.send("getOnePickStream");
    }, 30000);
    ipcRenderer.send("debug", 3);
});
ipcRenderer.on("selectOtherStream", () => {
    if(on) {
        clearInterval(getStream);
        getStream = setInterval(()=>{
            ipcRenderer.send("isStreamOff");
        }, 30000);
    }
    ipcRenderer.send("debug", 4);
});
const express = require('express'); //Line 1
const app = express(); //Line 2
const port = process.env.PORT || 5000; //Line 3
const googleTTS = require ('google-tts-api'); // ES6 or TypeScript
var FileSaver = require('file-saver');
const GoogleTts = require("google-tts.js") 

const directory = "C:/Users/jerem/ReactTest/finalapp/IVR_GUI_New/src/"


app.get('/', (req, res) => {
    res.send('Welcome to CORS server 😁');
});
app.get('/cors', (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.send({ "msg": "This has CORS enabled 🎈" });
    });
app.listen(8080, () => {
    console.log('listening on port 8080');
});


app.get('/fetchtext', (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    var prompt = req.query.prompt;
    var fileName = directory +req.query.fileName;

    console.log(prompt, fileName);

    /**
     * This is the google call tts call. 
     * I haven't looked at what saveFile actually returns beyond the file.
     */

    GoogleTts.saveFile(prompt, "EN", fileName).then((vars)=> 
    {
        console.log(vars);
    });

    

});

const express = require('express'); //Line 1
const app = express(); //Line 2
const port = process.env.PORT || 5000; //Line 3
const googleTTS = require ('google-tts-api'); // ES6 or TypeScript
var FileSaver = require('file-saver');
const GoogleTts = require("google-tts.js") 


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

    // console.log(res);
    // //res.send('This has CORS enabled 🎈');
     const url = googleTTS.getAudioUrl('Hello World', {
         lang: 'en',
        slow: false,
         host: 'https://translate.google.com',
       });
    console.log(url); // https://translate.google.com/translate_tts?...
    
    //fetch(url, {mode: 'cors'});

    FileSaver.saveAs(url, "./src/blahblah.mp3");

    GoogleTts.saveFile("abc", "id", "C:/Users/jerem/ReactTest/finalapp/IVR_GUI_New/src/audio.mp3").then(console.log);

    

});
// create a GET route
// app.get('/express_backend', (req, res) => { //Line 9
//   res.send({ express: 'YOUR EXPRESS BACKEND IS CONNECTED TO REACT' }); //Line 10
// }); //Line 11
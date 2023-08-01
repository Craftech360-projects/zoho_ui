const express = require("express");
const axios = require('axios');
const app = express();
const cors = require("cors");
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const PORT = 4000;
const path = require("path");
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json({ extended: true, limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use("/public", express.static(path.join(__dirname, "public")));
server.listen(PORT, () => {
  console.log(`server started on ${PORT} `);
});

app.use(cors());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});



app.get("/", (req, res) => {
  res.render("home.ejs");
});
app.get("/btn", (req, res) => {
  res.render("audio.ejs");
});

var environment = {
  supabase: {
    url: 'https://jypkclsiqvkatajjvltb.supabase.co',
    key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp5cGtjbHNpcXZrYXRhamp2bHRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTAwMTQ1OTcsImV4cCI6MjAwNTU5MDU5N30.hGY8ddFue0f2gnHy-Pd8C_1dN9pyGPCZXhJ52sODrNE',
    brainId: '549b3460-9a9f-4e93-979e-87b10c598efb',
    chatId: 'f739953e-ef55-4979-aebc-40aad84b027a',
    model: 'gpt-3.5-turbo-0613',
    temperature: 0,
    max_tokens: 150,
  },
  url: {
    questionUrl: `http://localhost:5050/chat/f739953e-ef55-4979-aebc-40aad84b027a/question?brain_id=`,
  },
  elevenLabs: {
    modelId: '21m00Tcm4TlvDq8ikWAM',
    url: 'https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM?optimize_streaming_latency=0',
    apiKey: '3c292dd7e16bbc3f07e8c1743fff55e5',
  },
}




io.on("connection", (socket) => {
  console.log("Connected!");
  socket.on("sendNum", (e) => {
    io.emit("getNum", e);
  });

  socket.on("playVoice", (e) => {
    console.log("sending chat bot output");
    io.emit("playAudio", e);
  });


  // get question and fetch it from python api and get answer
  socket.on("getAnswer", async (data) => {
    getAnswerApi(data)
    //textTovoice(question);
  });

});




const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
const voice = require("elevenlabs-node");
const fs = require("fs");
const labApiKey = '3c292dd7e16bbc3f07e8c1743fff55e5';
const voiceID = "21m00Tcm4TlvDq8ikWAM";


function textTovoice(question) {
  console.log("new Audio speak");
  console.log(question);

  voice.textToSpeechStream(labApiKey, voiceID, question, 0.2, 0.7)
    .then((res) => {
      console.log(res);
      var fileName = ''
      var num = Date.now()
      fileName = `./public/newAudio/${num}.mp3`
      const writeStream = fs.createWriteStream(fileName);
      res.pipe(writeStream);
      writeStream.on('finish', () => {
        console.log('Speech generated successfully.');
        io.emit('play', num)
        return
      })
    })
    .catch((error) => {
      console.log(error.message);
      // console.error('Error during textToSpeechStream:', error);
      // if (error.response) {
      //   console.error("API Error Response:", error.response.data);
      // } else if (error.request) {
      //   console.error("No API Response:", error.request);
      // } else {
      //   console.error("Error:", error.message);
      // }
    });
}

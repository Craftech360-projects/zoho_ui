const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const PORT =4000;
const path = require("path");
app.use("/public", express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("home.ejs");
});
app.get("/btn", (req, res) => {
  res.render("audio.ejs");
});

io.on("connection", (socket) => {
  console.log("Connected!");
  socket.on("sendNum", (e) => {
    io.emit("getNum", e);
  });
});

server.listen(4000, () => {
  console.log(`server started on ${PORT}`);
});
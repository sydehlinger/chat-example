var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

http.listen(2000, function(){
  console.log('listening on *:2000');
});

io.on('connection', function(socket){
    console.log('a user connected');
    socket.on('disconnect', function(){
      console.log('user disconnected')
  });
  socket.on('chat message', function(msg){
    var time = Date();
    console.log('User: ' + msg);
    io.emit('chat message', "User " + "[" + time + "]" + " : " + msg);
  });
  socket.on('username', function(msg){
    console.log('Username changed to ' + msg);
    io.emit('username changed', + msg);
  });
});
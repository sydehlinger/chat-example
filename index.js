var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var nicknames = [];

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

http.listen(2000, function(){
  console.log('listening on *:2000');
});

io.on('connection', function(socket){
    console.log('A user has connected');
    io.emit('chat message', socket.nickname + "has connected.");
    
//Update username function    
    function updateNicknames(){
      io.emit('usernames', nicknames);
    }
    
//Enter a username
    socket.on('new user', function(data, callback){
      if (nicknames.indexOf(data) != -1){
        callback(false);
      } else{
        callback(true);
        socket.nickname = data;
        nicknames.push(socket.nickname);
        console.log(socket.nickname + ' has joined');
        updateNicknames();
      }
    });
    
//Change username    
    socket.on('change username', function(data, callback){
      if (nicknames.indexOf(data) != -1){
        callback(false);
      } else{
        callback(true);
        nicknames.splice(nicknames.indexOf(socket.nickname), 1);
        socket.nickname = data;
        nicknames.push(socket.nickname);
        updateNicknames();
      }
    });
    
//Messages
    socket.on('chat message', function(msg){
      console.log(socket.nickname + ": " + msg);
      io.emit('chat message', socket.nickname + ": " + msg);
    });

//Timestamp
    function 
    
//Disconnect
    socket.on('disconnect', function(){
      if(!socket.nickname) return;
      nicknames.splice(nicknames.indexOf(socket.nickname), 1);
      console.log(socket.nickname + " has disconnected")
      updateNicknames();
    });
});
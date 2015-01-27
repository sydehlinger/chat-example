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
        io.emit('chat message', socket.nickname + " has connected.");
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
      io.emit('chat message', timestamp() + " " + socket.nickname + ": " + msg);
    });

//Timestamp
    function timestamp(){
      var date = new Date();
      var hour = date.getHours();
      var minute = date.getMinutes();
      var second = date.getSeconds();

      if (minute < 30){
        minute = "0" + minute;
      }
      if (second < 30){
        second = "0" + second;
      }

      return "[" + hour + ":" + minute + ":" + second + "]";
    }

//Disconnect
    socket.on('disconnect', function(){
      if(!socket.nickname) return;
      nicknames.splice(nicknames.indexOf(socket.nickname), 1);
      console.log(socket.nickname + " has disconnected");
      updateNicknames();
    });
});

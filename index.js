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
    console.log('a user connected');

    socket.on('new user', function(data, callback){
      if (nicknames.indexOf(data) != -1){
        callback(false);
      } else{
        callback(true);
        socket.nickname = data;
        nicknames.push(socket.nickname);
        updateNicknames();
      }
    });

    function updateNicknames(){
      io.emit('usernames', nicknames);
    }

    socket.on('chat message', function(msg){
      var time = Date();
      console.log('User: ' + msg);
      io.emit('chat message', socket.nickname + ": " + msg);
    });

    socket.on('disconnect', function(){
      if(!socket.nickname) return;
      nicknames.splice(nicknames.indexOf(socket.nickname), 1);
      updateNicknames();
      console.log('user disconnected')
    });

});

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var restaurants = [];

app.get('/', function(req, res){
  res.sendfile('index.html');
});

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function() {
    restaurants = [];
    console.log('user disconnected');
  });
  socket.on('add restaurant to server', function(msg) {
    restaurants.push(msg);
    io.emit('add restaurant to client', restaurants);
    console.log(restaurants);
    console.log('message: ' + msg);
  });
  var index_to_send = 0;

  socket.on('get restaurants', function() {
    io.emit('restaurants to client', restaurants);
  });

  socket.on('run button pressed', function() {
    var time_to_run = Math.floor(Math.random() * 100) + 50;
    var num_restaurants = restaurants.length;
    var time_between_runs = 100;
    console.log("will run " + time_to_run + " times");
    while (time_to_run-- > 0){
        time_between_runs *= 1.1;
        console.log("waiting " + time_between_runs + " ms");
        setTimeout(function(){
            io.emit('number sent to client', index_to_send++ % num_restaurants);
        }, time_between_runs);
    }
  })
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

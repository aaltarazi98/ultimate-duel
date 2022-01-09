const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const path = require('path')
const { Server } = require("socket.io");
// const socket = require('./src/socketConfig');
const io = new Server(server, {
  cors:{
      origin:"*"
  }
});
const port = process.env.PORT || 4000


app.use(express.static(path.join(__dirname, 'build')));

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const actions = ["fire", "charge", "shield", "blast"] //Array of actions, makes pulling them easier due to li values being integers only on the front end
const rooms = new Map() // A map to contain all active rooms

io.on('connection', (socket) => {
  console.log('connected to frontend');
  socket.emit("connection")
  socket.on('joinRoom', async (name, room, type) =>{

    //   Add a room if it doesn't exist
      if (!rooms.has(room)){
          const arr = []
          rooms.set(room, arr)
      }
      console.log(name + ' sent request to join ' + room)
      let start = false

    //   Determine number of connected players, respond accordingly
      const temp = await io.in(room).fetchSockets()
      const playerCount = temp.length

      players = rooms.get(room)

      if (playerCount === 0){
          console.log('First player request accepted')
          socket.join(room)
          socket.emit('joined', name, room)
          players.push({
              id: socket.id,
              name: name,
              room: room,
              hp: 3,
              charge: 1,
              action:''
          })
      }else if (playerCount > 1){
          console.log(`${name}'s request to join room ${room} rejected, it is full!`)
          socket.emit('roomFull')
          return
      }else{
          console.log('Second player request accepted')
          socket.join(room)
          socket.emit('joined', name,room)
          players.push({
            id: socket.id,
            name: name,
            room: room,
            hp: 3,
            charge: 1,
            action:''
          })
          start = true
      }

      rooms.set(room, players)

    //   Start a game when 2 players are connected by fetching to each player themselves as first payload and their opponent as second payload
      if (start){

          console.log('2 players in room, start game!')
          io.sockets.to(players[0].id).emit('startGame', players[0], players[1])
          io.sockets.to(players[1].id).emit('startGame', players[1], players[0])
      }

    //   Respond to receiving an action from front end, we need both players actions for this to proceed further
      socket.on('action', async (tempPlayer, actionId)=>{

          const players = rooms.get(room).map(element =>{
            if (element.id === tempPlayer.id){
                element.action = actionId
            }
            return element
        })

          console.log(tempPlayer.name +" used " + actions[actionId])

        //   Respond to receiving both players' actions
          if (players[0].action !== '' && players[1].action !== ''){
              console.log("both actions received, processing")

              for (let i = 0 , j ; i < players.length ; i++){
                  (i == 0) ? j = 1 : j = 0
                  if (players[i].action == 0){
                        if (players[j].action !== 2) players[j].hp = players[j].hp - 1
                        players[i].charge = players[i].charge - 1
                  }else if(players[i].action === 1){
                        players[i].charge = players[i].charge + 1
                  }else if(players[i].action === 2){
                  }else if(players[i].action === 3){
                      players[j].hp = 0
                      players[i].charge = 0
                  }
              }

              console.log('game logic finished, emitting new data')

              io.sockets.to(players[0].id).emit('roundFinish', players[0], players[1])
              io.sockets.to(players[1].id).emit('roundFinish', players[1], players[0])

              players[0].action =''
              players[1].action =''
              
              rooms.set(room, players)

              if (players[0].hp == 0 && players[1].hp ==0){
                  setTimeout(()=>{
                    io.sockets.to(players[0].id).emit('draw', players[0], players[1])
                    io.sockets.to(players[1].id).emit('draw', players[1], players[0])
                    io.socketsLeave(room)
                    rooms.delete(room)
                  }, 2000)
              }else if(players[0].hp == 0){
                  setTimeout(()=>{
                    io.sockets.to(players[0].id).emit('loss', players[0], players[1])
                    io.sockets.to(players[1].id).emit('win', players[1], players[0])
                    io.socketsLeave(room)
                    rooms.delete(room)
                  }, 2000)
                  
              }else if(players[1].hp == 0){
                  setTimeout(()=>{
                    io.sockets.to(players[0].id).emit('win', players[0], players[1])
                    io.sockets.to(players[1].id).emit('loss', players[1], players[0])
                    io.socketsLeave(room)
                    rooms.delete(room)
                  },2000)}
                
          }
      })

    //   Respond to a player leaving the room while waiting
      socket.once('leaveRoom', ()=>{
          io.socketsLeave(room);
          socket.removeAllListeners('action')
          console.log(name +' has left room ' + room)
          socket.emit('left')
          rooms.delete(room)
      })

      socket.on('rematch' , ()=>{
        socket.removeAllListeners('action')
        socket.removeAllListeners('leaveRoom')
        socket.emit('rematch')
      })

    //   Respond to player disconnecting abruptly
      socket.on('disconnect', async ()=>{
        const connections = await io.in(room).fetchSockets()
        if (connections) io.sockets.to(room).emit('enemyLeft')
        console.log(name + ' has left room ' + room)
        rooms.delete(room)
    })
  })
  socket.on('disconnect', ()=>{
      console.log('user disconnected')
  })
});


server.listen(port, () => {
  console.log('listening on *:4000');
});

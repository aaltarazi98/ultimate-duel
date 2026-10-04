import express from "express";
import http from "http";
import path from "path";
import { Server, Socket } from "socket.io";
import { Actions, Player } from "./types";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const port = process.env.PORT || 4000;

// app.use(express.static(path.join(__dirname, "build")));

// app.get("*", function (req, res) {
//   const indexPath = path.join(__dirname, "build", "index.html");
//   res.sendFile(indexPath, (err) => {
//     if (err) {
//       res.status(500).send("Error loading index.html");
//     }
//   });
// });

const rooms = new Map<string, Player[]>();

io.on("connection", (socket: Socket) => {
  console.log("connected to frontend");
  socket.emit("connection");

  socket.on("joinRoom", async (name: string, room: string, type: string) => {
    if (!rooms.has(room)) {
      rooms.set(room, []);
    }
    console.log(name + " sent request to join " + room);
    let start = false;

    const temp = await io.in(room).fetchSockets();
    const playerCount = temp.length;

    let players = rooms.get(room) || [];

    if (playerCount === 0) {
      console.log("First player request accepted");
      socket.join(room);
      socket.emit("joined", name, room);
      players.push({
        id: socket.id,
        name: name,
        room: room,
        hp: 3,
        charge: 1,
        action: Actions.Fire,
      });
    } else if (playerCount > 1) {
      console.log(
        `${name}'s request to join room ${room} rejected, it is full!`
      );
      socket.emit("roomFull");
      return;
    } else {
      console.log("Second player request accepted");
      socket.join(room);
      socket.emit("joined", name, room);
      players.push({
        id: socket.id,
        name: name,
        room: room,
        hp: 3,
        charge: 1,
        action: null,
      });
      start = true;
    }

    rooms.set(room, players);

    if (start) {
      console.log("2 players in room, start game!");
      io.sockets.to(players[0].id).emit("startGame", players[0], players[1]);
      io.sockets.to(players[1].id).emit("startGame", players[1], players[0]);
    }

    socket.on("action", async (tempPlayer: Player, action: Actions) => {
      const players =
        rooms.get(room)?.map((element) => {
          if (element.id === tempPlayer.id) {
            element.action = action;
          }
          return element;
        }) || [];

      console.log(tempPlayer.name + " used " + action);

      if (players[0].action !== null && players[1].action !== null) {
        console.log("both actions received, processing");

        for (let i = 0; i < players.length; i++) {
          const j = i === 0 ? 1 : 0;
          const action = players[i].action;

          if (action === Actions.Fire) {
            if (players[j].action !== Actions.Shield)
              players[j].hp = players[j].hp - 1;
            players[i].charge = players[i].charge - 1;
          } else if (action === Actions.Charge) {
            players[i].charge = players[i].charge + 1;
          } else if (action === Actions.Shield) {
            // Block action
          } else if (action === Actions.Blast) {
            players[j].hp = 0;
            players[i].charge = 0;
          }
        }

        console.log("game logic finished, emitting new data");

        io.sockets
          .to(players[0].id)
          .emit("roundFinish", players[0], players[1]);
        io.sockets
          .to(players[1].id)
          .emit("roundFinish", players[1], players[0]);

        players[0].action = null;
        players[1].action = null;

        rooms.set(room, players);

        if (players[0].hp === 0 && players[1].hp === 0) {
          setTimeout(() => {
            io.sockets.to(players[0].id).emit("draw", players[0], players[1]);
            io.sockets.to(players[1].id).emit("draw", players[1], players[0]);
            io.socketsLeave(room);
            rooms.delete(room);
          }, 2000);
        } else if (players[0].hp === 0) {
          setTimeout(() => {
            io.sockets.to(players[0].id).emit("loss", players[0], players[1]);
            io.sockets.to(players[1].id).emit("win", players[1], players[0]);
            io.socketsLeave(room);
            rooms.delete(room);
          }, 2000);
        } else if (players[1].hp === 0) {
          setTimeout(() => {
            io.sockets.to(players[0].id).emit("win", players[0], players[1]);
            io.sockets.to(players[1].id).emit("loss", players[1], players[0]);
            io.socketsLeave(room);
            rooms.delete(room);
          }, 2000);
        }
      }
    });

    socket.once("leaveRoom", () => {
      io.socketsLeave(room);
      socket.removeAllListeners("action");
      console.log(name + " has left room " + room);
      socket.emit("left");
      rooms.delete(room);
    });

    socket.on("rematch", () => {
      socket.removeAllListeners("action");
      socket.removeAllListeners("leaveRoom");
      socket.emit("rematch");
    });

    socket.on("disconnect", async () => {
      const connections = await io.in(room).fetchSockets();
      if (connections) io.sockets.to(room).emit("enemyLeft");
      console.log(name + " has left room " + room);
      rooms.delete(room);
    });
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(port, () => {
  console.log("listening on *:4000");
});

require('dotenv').config()

const express = require('express')
const app = express()
const server = require('http').Server(app)
const axios = require('axios')
const io = require('socket.io')(server, {
  cors: {
    origin: ["https://socket-learn.vercel.app", "http://localhost:3001"],
    methods: ["GET", "POST"]
  }
})
const cors = require('cors')
const bp = require('body-parser')
const generateIntervalObject = require('./utils')

const corsOptions = {
  origin: [
    'http://localhost:3000', 
    'http://localhost:3001',
    'http://192.168.0.3:3000', 
    'https://socket-learn.vercel.app'
  ]
}

app.use(cors(corsOptions))
app.use(bp.json())
app.use(bp.urlencoded({ extended: true }))

const port = process.env.PORT
const minRoomSize = parseInt(process.env.MIN_ROOM_SIZE)
const updateInterval = parseInt(process.env.UPDATE_INTERVAL)
const maxRank = parseInt(process.env.MAX_RANK)
const rankInterval = parseInt(process.env.RANK_INTERVAL)
const gameServer = process.env.GAME_SERVER_URI

const rankChecks = generateIntervalObject(maxRank, rankInterval)

let users = []
let socketIds = {}
let rooms = {}
let queue = []

io.on('connection', (socket) => {

  console.log("New user connected!")

  socket.on('new-user', (newUser) => {
    const userNames = users.map(singleUser => singleUser.nickname)    
    
    if (!userNames.includes(newUser.nickname)) {
      socket.username = newUser.nickname
      users.push(newUser)
      socket.emit('user-created', newUser)
      setTimeout(() => io.emit('update-active-users', users.length), 100)
    } else {
      socket.emit('user-not-added', JSON.stringify({description: 'User already exist', name: 'UserAlreadyExists'}))
    }
  })

  socket.on('check-in', (user) => {
    socketIds[user] = socket.id
  })

  socket.on('request-greet', (userId) => {
    console.log(
      "queue: ", queue)
  })

  socket.on('check-users', () => {
    console.log(
      "\n\nqueue: ", queue)
  })

  socket.on('accept-match', (userId) => {
    const roomId = findRoomId(userId) 
    const userIndex = findUserIndexInRoom(userId, roomId)

    socket.join(roomId)
    const currentRoom = rooms[roomId]

    currentRoom[userIndex].hasAccepted = true

    // If all the clients accept the request, send them to the room
    if (!currentRoom.map(userInRoom => userInRoom.hasAccepted).includes(false)) {
      createNewGame(currentRoom)
      .then((res) => {
        console.log("New game created")
        io.in(roomId).emit('match-accepted', currentRoom)
        delete rooms[roomId]

        io.socketsLeave(roomId);
      })
      .catch(() => {
        console.log("Error creating the game")
        const _ = undefined
        errorMatchActions(roomId, _, currentRoom, 'GameServerError')
      })
    }
  })

  socket.on('reject-match', (user) => {
    const roomId = findRoomId(user.id)
    const currentRoom = rooms[roomId]
    // This function alerts to matched clients that one client has declined
    errorMatchActions(roomId, user, currentRoom, 'MatchRejected')
    // And then just remove the user who has declined from the queue
    socket.emit('removed-from-queue', 'MatchRejected')
  })

  socket.on('disconnect', () => {
    removeUserFromUsers(socket.username)
    removeUserFromQueue(socket.username)
    console.log("bye", socket.username)
  })
})

setInterval(() => {
  rankChecks.forEach(singleRange => {
    checkIfMatch(singleRange.min, singleRange.max)    
  })
}, updateInterval)

const checkIfMatch = (min, max) => {
  const matchedUsers = queue.filter(singleUser => (
    (singleUser.rank >= min && singleUser.rank <= max)
  )).slice(0, minRoomSize)

  if (matchedUsers.length >= minRoomSize) {
    const newRoomId = Math.random().toString(16).substr(2, 15)
    rooms[newRoomId] = []
    console.log("NEW ROOM ID", newRoomId)
    matchedUsers.forEach((singleUser) => {
      sendUniqueResponse(socketIds[singleUser.id], 'matched')
      const newUserToRoom = {
        ...singleUser, hasAccepted: false
      }
      rooms[newRoomId].push(newUserToRoom)
      queue = queue.filter(queueUser => queueUser.id !== singleUser.id)
    })
  }
}

app.post('/get-in-queue', (req, res) => {
  const arrivedUser = req.body.userId
  const newRank = parseInt(req.body.newRank)
  
  if (arrivedUser) {
    const userToQueue = users.filter(singleUser => singleUser.id === arrivedUser)[0]
    queue.push({...userToQueue, rank: newRank})
    res.send(`User ${arrivedUser} added to queue`)
  } else {
    return res.status(400).json({description: 'Bad request. need ?user param', name: 'BadRequest'})
  }
})

app.get('/', (req, res) => {
  res.send('I am alive')
})

server.listen(port, () => {
  console.log("Listening at *: " + port)
})


const addNewUser = (newUser) => {
  users.push(newUser)
}

const sendUniqueResponse = (id, emitId, message) => {
  io.sockets.to(id).emit(emitId, message)
}

const joinUniqueClient = (id, roomName) => {
  io.sockets.to(id).join(roomName)
}

const findRoomId = (userId) => {
  const roomsValues = Object.values(rooms)
  const singleLevelValues = roomsValues.map(singleRoomValue => (
    singleRoomValue.map(singleObjectInsideRoom => singleObjectInsideRoom.id)
  ))
  const roomIndex = singleLevelValues.findIndex(roomMembers => roomMembers.includes(userId))
  const roomId = Object.keys(rooms)[roomIndex]
  return roomId
}

const findUserIndexInRoom = (userId, roomId) => {
  const userIndex = rooms[roomId].findIndex(userInRoom => (
    userInRoom.id === userId
  ))

  return userIndex
}

const removeUserFromUsers = (userName) => {
  users = users.filter(singleUser => singleUser.nickname !== userName)
}

const removeUserFromQueue = (userName) => {
  queue = queue.filter(singleUser => singleUser.nickname !== userName)
}

const errorMatchActions = (roomId, user, currentRoom, rejectionType) => {
  // We emit one player rejects to all who are in the provisional room (joined or not)
  const actionsHashMap = {
    'MatchRejected': () => {
      Object.values(currentRoom).forEach(singleUser => {
        if (singleUser.id !== user.id) {
          io.to(socketIds[singleUser.id]).emit('match-canceled', rejectionType)

          // Place back the users who didn't declined the match
          queue.push(singleUser)
        }
      })
    },

    'GameServerError': () => {
      Object.values(currentRoom).forEach(singleAffectedUser => {
        io.to(socketIds[singleAffectedUser.id]).emit('match-canceled', rejectionType)
      })
    }
  }
  
  actionsHashMap[rejectionType]()
  // Then we can delete the provisional room and delete the user who declined the match from the queue
  delete rooms[roomId]
}

const createNewGame = async (users) => {
  return await axios.post(`${gameServer}/start-new-game`, {
    users: users,
  })
}

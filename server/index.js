require('dotenv').config()

const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const cors = require('cors')
const bp = require('body-parser')
const generateIntervalObject = require('./utils')

const corsOptions = {
  origin: ['http://localhost:3001', 'http://192.168.0.3:3001']
}

app.use(cors(corsOptions))
app.use(bp.json())
app.use(bp.urlencoded({ extended: true }))

const port = process.env.PORT
const minRoomSize = parseInt(process.env.MIN_ROOM_SIZE)
const updateInterval = parseInt(process.env.UPDATE_INTERVAL)
const maxRank = parseInt(process.env.MAX_RANK)
const rankInterval = parseInt(process.env.RANK_INTERVAL)

const rankChecks = generateIntervalObject(maxRank, rankInterval)

let users = []
let socketIds = {}
let rooms = {}
let queue = []

io.on('connection', (socket) => {
  socket.on('new-user', (newUser) => {
    const userNames = users.map(singleUser => singleUser.name)
    
    if (!userNames.includes(newUser.name)) {
      addNewUser({...newUser})
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
    console.log(queue)
  })

  socket.on('accept-match', (userId) => {
    const roomId = findRoomId(userId) 
    const userIndex = findUserIndexInRoom(userId, roomId)

    socket.join(roomId)
    const currentRoom = rooms[roomId]

    currentRoom[userIndex].hasAccepted = true

    // If all the clients accept the request, send them to the room
    if (!currentRoom.map(userInRoom => userInRoom.hasAccepted).includes(false)) {
      io.to(roomId).emit('match-accepted', currentRoom)
    }
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
  ))

  if (matchedUsers.length === minRoomSize) {
    const newRoomName = Math.random().toString(16).substr(2, 15)
    rooms[newRoomName] = []

    matchedUsers.forEach((singleUser) => {
      sendUniqueResponse(socketIds[singleUser.id], 'matched')
      const newUserToRoom = {
        ...singleUser, hasAccepted: false
      }
      rooms[newRoomName].push(newUserToRoom)
      queue = queue.filter(queueUser => queueUser.id !== singleUser.id)
    })
  }
}

app.get('/get-in-queue', (req, res) => {
  if (req.query.user) {
    const userInQueue = users.filter(singleUser => singleUser.id === req.query.user)[0]
    queue.push(userInQueue)
    res.send(`User ${req.query.user} added to queue`)
  } else {
    return res.status(400).json({description: 'Bad request. need ?user param', name: 'BadRequest'})
  }
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


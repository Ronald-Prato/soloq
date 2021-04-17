import './App.css'

import { useEffect, useRef, useState } from 'react'

import io from 'socket.io-client'

const uri = 'http://localhost:8000'

const socket = io(uri!)

function App() {
  const [localRooms, setLocalRooms] = useState([])
  const roomNameRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    socket.on('new-room-created', data => {
      setLocalRooms(data)
    })
  }, [])

  const handleNewRoom = () => {
    if (roomNameRef.current !== null) {
      socket.emit('new-room', roomNameRef.current.value)
    }
  }

  return (
    <div className="App">
      <input placeholder="create new room" ref={roomNameRef} />
      <br />

      <button onClick={handleNewRoom}> New Room </button>
      {/* <button onClick={() => console.log(localRooms)}> Rooms </button> */}

      <ul>
        {Object.keys(localRooms).map(singleRoom => (
          <li key={singleRoom}>{singleRoom}</li>
        ))}
      </ul>
    </div>
  )
}

export default App

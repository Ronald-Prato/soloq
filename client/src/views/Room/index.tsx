import { BASE_URL } from '../../constants'
import Context from '../../globalState'
import { MainWrapper } from './styles'
import io from 'socket.io-client'
import { useContext } from 'react'

//const socket = io(BASE_URL)

export const Room = () => {
  const { state } = useContext(Context)

  return (
    <MainWrapper>
      <div className="users-in-room-map">
        {state.roomUsers.length &&
          state.roomUsers.map(singleRoomUser => (
            <p key={singleRoomUser.id} className="single-room-user">
              {' '}
              {singleRoomUser.name}{' '}
            </p>
          ))}
      </div>
    </MainWrapper>
  )
}

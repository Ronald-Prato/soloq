import { useContext, useEffect, useState } from 'react'

import { BASE_URL } from '../../constants'
import { Button } from 'antd'
import Context from '../../globalState'
import { MainWrapper } from './styles'
import { NewMatchModal } from './NewMatchModal'
import { User } from '../../globalState/models'
import axios from 'axios'
import io from 'socket.io-client'
import rankingIcon from '../../assets/icons/ranking.svg'
import { useHistory } from 'react-router-dom'

const socket = io(BASE_URL)

export const SoloQ = () => {
  const { state, setRoomUsers } = useContext(Context)
  const history = useHistory()
  const [usersAmount, setUsersAmount] = useState(0)
  const [gettingIntoQueue, setGettingIntoQueue] = useState(false)
  const [isInQueue, setIsInQueue] = useState(false)
  const [showModal, setShowModal] = useState(false)

  const {
    user: { name, rank },
  } = state

  useEffect(() => {
    socket.emit('check-in', state.user.id)

    socket.on('matched', () => {
      setShowModal(true)
    })

    socket.on('update-active-users', usersAmount => {
      setUsersAmount(parseInt(usersAmount))
    })

    socket.on('greet-room', message => {
      console.log(message)
    })

    socket.on('match-accepted', users => {
      const newUsers: User[] = users.map((singleUser: User) => ({
        id: singleUser.id,
        name: singleUser.name,
        rank: singleUser.rank,
      }))
      setRoomUsers(newUsers)
      console.log(newUsers)
      history.push('/room')
    })
  }, [])

  const handleEnterQueue = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/get-in-queue?user=${state.user.id}`
      )
      setGettingIntoQueue(false)
      setIsInQueue(true)
      socket.emit('check-if-match')
      console.log(response)
    } catch (err) {
      setGettingIntoQueue(false)
      console.log('Error: ', err)
    }
  }

  const handleExitTheQueue = () => {
    socket.emit('request-greet', state.user.id)
  }

  const handleAcceptMatch = () => {
    socket.emit('accept-match', state.user.id)
  }

  const handleRejectMatch = () => {
    socket.emit('request-greet', state.user.id)
  }

  return (
    <MainWrapper>
      <h2 className="active-users-amount"> Active users: {usersAmount} </h2>
      <div className="avatar-section">
        <p className="avatar-name"> {name} </p>

        <div className="ranking">
          <img alt="ranking" className="ranking-icon" src={rankingIcon} />
          <p className="ranking-number"> {rank} </p>
        </div>
      </div>

      {!gettingIntoQueue && !isInQueue ? (
        <Button type="primary" onClick={handleEnterQueue}>
          {' '}
          Enter in Queue{' '}
        </Button>
      ) : !gettingIntoQueue && isInQueue ? (
        <section className="in-queue-section">
          <Button onClick={handleExitTheQueue} danger>
            Exit the queue
          </Button>
        </section>
      ) : (
        <p> Entering... </p>
      )}

      {showModal && (
        <NewMatchModal
          onAccept={handleAcceptMatch}
          onReject={handleRejectMatch}
        />
      )}
    </MainWrapper>
  )
}

import { Button, Input } from 'antd'
import { useContext, useState } from 'react'

import { BASE_URL } from '../../constants'
import Context from '../../globalState'
import { MainWrapper } from './styles'
import { User } from '../../globalState/models'
import { alertError } from './utils'
import io from 'socket.io-client'
import { useHistory } from 'react-router-dom'

const socket = io(BASE_URL)

export const Register = () => {
  const [userName, setUserName] = useState('')
  const history = useHistory()
  const { setNewUser } = useContext(Context)

  const handleEnterIntoApp = async () => {
    if (!userName.trim().length) {
      alert("Can't leave empty user name field")
      return
    }

    const newId = Math.random().toString(16).substr(2, 15)
    const rank = Math.floor(Math.random() * 50)
    const newUser: User = {
      id: newId,
      name: userName,
      rank: rank,
    }

    socket.emit('new-user', newUser)

    socket.on('user-created', createdUser => {
      setNewUser(createdUser)
      history.replace('/soloq')
    })

    socket.on('user-not-added', (data: any) => {
      const parsed = JSON.parse(data)
      console.log(parsed)
      alertError(parsed.name)
    })
    // try {
    //   const response = await axios.post(`${BASE_URL}/create-user`, newUser)
    //   setNewUser(newUser)

    //   console.log(response)

    //   history.push('/soloq')
    // } catch (err) {
    //   console.log(err.response.data)
    //   alertError(err.response.data.name)
    // }
  }

  return (
    <MainWrapper>
      <div className="main-content">
        <Input
          placeholder="Enter your user name"
          onChange={event => setUserName(event.target.value)}
        />

        <Button type="primary" onClick={handleEnterIntoApp}>
          {' '}
          Login{' '}
        </Button>
      </div>
    </MainWrapper>
  )
}

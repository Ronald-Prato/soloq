import { IContext, IGlobalState, StoreState, User } from './models'
import { createContext, useState } from 'react'

import { produce } from 'immer'

const Context = createContext<IContext>({} as IContext)

const initialState: StoreState = {
  user: {
    id: '',
    name: '',
    rank: 0,
  },
  roomUsers: [],
}

export const GlobalState = ({ children }: IGlobalState) => {
  const [state, setState] = useState<StoreState>(initialState)

  const setNewUser = (newUser: User) => {
    setState(
      produce(state, stateDraft => {
        stateDraft.user.id = newUser.id
        stateDraft.user.name = newUser.name
        stateDraft.user.rank = newUser.rank
      })
    )
  }

  const setRoomUsers = (users: User[]) => {
    setState(
      produce(state, stateDraft => {
        stateDraft.roomUsers = users
      })
    )
  }

  return (
    <Context.Provider value={{ state, setNewUser, setRoomUsers }}>
      {children}
    </Context.Provider>
  )
}

export default Context

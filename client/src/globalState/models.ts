import React from 'react'

export interface User {
  id: string
  name: string
  rank: number
}

export interface IContext {
  state: StoreState
  setNewUser: (newUser: User) => void
  setRoomUsers: (users: User[]) => void
}

export interface IGlobalState {
  children: React.ReactChild
}

export interface StoreState {
  user: User
  roomUsers: User[]
}

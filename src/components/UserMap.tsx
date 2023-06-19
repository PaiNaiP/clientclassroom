import React from 'react'
import UserCard from './UserCard'

export const UserMap = (userList:any) => {
  return (
    userList.userList.map((user:any)=>(
      <UserCard userList={user} author={userList.author} onRemoveUser={userList.onRemoveUser} role={userList.role}/>
    ))
  )
}

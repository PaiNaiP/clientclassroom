import React from 'react'
import { FreeUsersGroupCard } from './FreeUsersGroupCard'

export const FreeUsersGroupMap = (users:any) => {
  return (
    users.users.map((user:any)=>(
        <FreeUsersGroupCard users={user.user} group={users.group} onRemoveUser={users.onRemoveUser} cross={users.cross}/>
    ))
  )
}

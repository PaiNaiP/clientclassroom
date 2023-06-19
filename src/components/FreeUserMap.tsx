import React from 'react'
import { FreeUsersGroupCard } from './FreeUsersGroupCard'

export const FreeUserMap = (users:any) => {
    return (
        users.users.map((user:any)=>(
            <FreeUsersGroupCard users={user} group={users.group} onRemoveUser={users.onRemoveUser} cross={users.cross}/>
        ))
    )
}

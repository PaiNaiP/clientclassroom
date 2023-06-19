import React from 'react'
import { GroupsCard } from './GroupsCard'

export const GroupsMap = (groups:any) => {
  return (
    groups.groups.map((group:any)=>(
        <GroupsCard groups={group}/>
    ))
  )
}

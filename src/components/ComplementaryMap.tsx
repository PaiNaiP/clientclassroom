import React from 'react'
import { ComplementaryCard } from './ComplementaryCard'

export const ComplementaryMap = (complementary:any) => {
  return (
    complementary.complementary.map((comp:any)=>(
        <ComplementaryCard key={comp.id} complementary={comp} task={complementary.task}/>
    ))
  )
}

import React from 'react'
import MarksStatisticCard from './MarksStatisticCard'

export const MarksStatisticMap = (complementary:any) => {
  return (
    complementary.complementary.map((comp:any)=>(
        <MarksStatisticCard complementary ={comp} key={comp.id}/>
    ))
  )
}

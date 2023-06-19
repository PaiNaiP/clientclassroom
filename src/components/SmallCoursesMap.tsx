import React from 'react'
import { SmallCourseCard } from './SmallCourseCard'

export const SmallCoursesMap = (courses:any) => {
  return (
    courses.courses.map((course:any)=>(
        <SmallCourseCard courses={course}/>
    ))
  )
}

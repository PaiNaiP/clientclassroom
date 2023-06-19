import React from 'react'
import { CourseCard } from './CourseCard'

export const CourseMap = (courses:any) => {
  return (
    courses.courses.map((course:any)=>(
        <CourseCard courses={course}/>
    ))
  )
}

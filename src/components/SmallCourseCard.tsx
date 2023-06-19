import React from 'react'

export const SmallCourseCard = (courses:any) => {
  return (
    <a href={`/c/${courses.courses.id}`} style={{textDecoration:'none'}}>
      <div className="course-card-small">
          <div className="course-card-small__body">
              <div className="course-card-small__body__avatar"
              style={{background:courses.courses.decor}}>
                  <p style={{color:'white'}}>{courses.courses.title[0].toUpperCase()}</p>
              </div>
              <div className="course-card-small__body__info">
                  <h1>{courses.courses.title}</h1>
                  <p style={{textAlign:'left', marginLeft:'15px'}}>{courses.courses.chapter}</p>
              </div>
          </div>
      </div>
    </a>
  )
}

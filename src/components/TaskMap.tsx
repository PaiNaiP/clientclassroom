import React from 'react'
import TaskCard from './TaskCard'

export const TaskMap = (task:any) => {
  return (
    <>
    {task.task.lenght!==0&&(
      <>
        { task.task.map((tsk:any)=>(
            <TaskCard task={tsk} role={task.role} />
        ))}
      </>
    )}
    </>
  )
}

import React from 'react'
import FilesCard from './FilesCard'

export const FilesMap = (files:any) => {
  return (
    files.files.map((file:any)=>(
        <FilesCard key={file[0].id} files={file} id={files.id} onUpdate={files.onUpdate}/>
    ))
  )
}

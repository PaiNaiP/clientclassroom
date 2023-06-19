import React from 'react'
import { ThemeCard } from './ThemeCard'

export const ThemeMap = (theme:any) => {
  return (
    theme.theme.map((th:any)=>(
        <ThemeCard th={th} role={theme.role}/>
    ))
  )
}

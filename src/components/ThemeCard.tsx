import React, { useContext, useState } from 'react'
import { BsThreeDotsVertical } from 'react-icons/bs'
import { TaskMap } from './TaskMap'
import ModalTheme from './ModalTheme'
import { Context } from '..'

export const ThemeCard = (theme:any) => {
    const {store} = useContext(Context)
    const [openModalTheme, setOpenModalTheme] = useState(false)

    const handleCloseThemeModal = () => {
        setOpenModalTheme(false);
    }

    const handleDeleteTheme = () =>{
        store.deleteTheme(theme.th.id).then((data)=>{
            if(data)
                window.location.reload()
        })
    }
  return (
    <div className="th-card">
        <div className="theme-card" style={{color:theme.th.class.decor, 
        borderBottom:`2px solid ${theme.th.class.decor}`}}>
            <div className="theme-card__body">
                <h1>{theme.th.title}</h1>
                {theme.role&&(
                    <>
                    {theme.role.name==="teacher"&&(
                        <div className="dropdown">
                                <button className='dropdown__button__normal'>
                                    <BsThreeDotsVertical style={{color:theme.th.class.decor, marginTop:'2.3rem'}}/>
                                </button>
                                <div className="dropdown__content">
                                <div className="dropdownline" onClick={()=>setOpenModalTheme(true)}>Изменить</div>
                                <div className="dropdownline" onClick={handleDeleteTheme}>Удалить</div>
                            </div>
                            {openModalTheme&&(
                                <ModalTheme show={openModalTheme} onClose={handleCloseThemeModal} theme={theme.th} course=''/>
                            )}
                        </div> 
                    )}
                    </>
                )}    
            </div>
        </div>
        {theme.th.task.lenght!==0&&(
            <div className="body-task-theme">
                <TaskMap task={theme.th.task}/>
            </div>
        )}
    </div>
  )
}

import { observer } from 'mobx-react-lite'
import React, {useContext, useState} from 'react'
import { BsFileEarmarkTextFill, BsThreeDotsVertical } from 'react-icons/bs'
import ModalCreateTask from './ModalCreateTask';
import { Context } from '..';
import ModalAddToTheme from './ModalAddToTheme';
import { useNavigate } from 'react-router-dom';

const TaskCard = (task:any) => {
  const {store} = useContext(Context)
  const currentDate = new Date();
  const myDate = new Date(task.task.date);
  const [openModalTask, setOpenModalTask] = useState(false)
  const [openModalTheme, setOpenModalTheme] = useState(false)
  const navigation = useNavigate()
  function formatTime(date: Date) {
    const hours = date.getHours().toString().padStart(2, '0'); 
    const minutes = date.getMinutes().toString().padStart(2, '0'); 
    return `${hours}:${minutes}`;
  }

  function formatDate(date: Date) {
    const options: Intl.DateTimeFormatOptions = { 
      day: 'numeric', 
      month: 'short' 
    };
    return date.toLocaleDateString('ru-RU', options);
  }

  let displayText: string;

  if (
    myDate.getDate() === currentDate.getDate() &&
    myDate.getMonth() === currentDate.getMonth() &&
    myDate.getFullYear() === currentDate.getFullYear()
  ) {
    displayText = formatTime(myDate);
  } else {
    displayText = formatDate(myDate);
  }

  const handleCloseModalTask = () => {
    setOpenModalTask(false);
  }

  const handleCloseModalTheme = () => {
    setOpenModalTheme(false);
  }

  const handleDeleteTask=()=>{
    store.deleteTask(task.task.id).then(()=>{
        window.location.reload()
    })
  }

  const handleDeleteFromTheme=()=>{
    store.deleteFromTheme(task.task.id).then((data)=>{
      if(data)
        window.location.reload()
    })
  }

  return (
    <div className="task-card" style={{border:`1px solid ${task.task.class.decor}`}}>
        <div className="task-card__body">
          <div className="task-card__body__circle" style={{background:task.task.class.decor}}>
            <BsFileEarmarkTextFill className="task-card__body__circle__file"/>
          </div>
          <div className="task-card__body__info" onClick={()=>navigation(`/t/${task.task.id}`)}>
            <h1>Пользователь {task.task.member.user.surname} {task.task.member.user.name} {task.task.member.user.lastname} добавил задание: {task.task.title}</h1>
            <p>{displayText}</p>
          </div>
          {task.role&&(
            <>
            {task.role.name==="teacher"&&(
              <div className="dropdown" style={{marginTop:'5px'}}>
                <button className='dropdown__button__normal'>
                  <BsThreeDotsVertical style={{color:task.task.class.decor, marginTop:'18px'}}/>
                </button>
                  <div className="dropdown__content">
                  <div className="dropdownline" onClick={()=>setOpenModalTask(true)}>Изменить</div>
                  {!task.task.theme_id&&(
                    <div className="dropdownline" onClick={()=>setOpenModalTheme(true)}>Добавить тему</div>
                  )}
                  {task.task.theme_id&&(
                    <div className="dropdownline" onClick={handleDeleteFromTheme}>Удалить тему</div>
                  )}
                  <div className="dropdownline" onClick={handleDeleteTask}>Удалить</div>
                </div>
                {openModalTask&&(
                  <ModalCreateTask show={openModalTask} onClose={handleCloseModalTask} task={task.task} course_id={task.task.class.id}/>
                )}
                {openModalTheme&&(
                  <ModalAddToTheme show={openModalTheme} onClose={handleCloseModalTheme} course={task.task.class.id} task={task.task}/>
                )}
              </div>  
              )}
            </>
          )}
        </div>
    </div>
  )
}
export default observer(TaskCard)
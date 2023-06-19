import { observer } from 'mobx-react-lite'
import React, { useContext, useEffect, useState } from 'react'
import { PropagateLoader } from 'react-spinners'
import { Context } from '..'
import { useParams } from 'react-router-dom'
import Select from 'react-select'
import ModalTheme from './ModalTheme'
import { ThemeMap } from './ThemeMap'
import { TaskMap } from './TaskMap'

const ClassroomTask = () => {
  const {store} = useContext(Context)
  const [loading, setLoading] = useState<boolean>(true)
  const [course, setCourse] = useState<any>()
  const id = useParams()
  const [task, setTask] = useState<any>()
  const [role, setRole] = useState<any>()
  const [allTask, setAllTask] = useState<any>()
  const [options, setOptions] = useState<any>()
  const [selected, setSelected] = useState<any>()
  const [allTheme, setAllTheme] = useState<any>()
  useEffect(() => {
    if(id.id)
      store.getCourseOne(id.id, store.user.id).then((data)=>{
        if(id.id)
        store.viewAllTheme(id.id).then((themeData)=>{
          if(id.id)
            store.allTaskWithoutTheme(id.id).then((allTaskData)=>{
              if(id.id)
              store.allTaskWithTheme(id.id).then((taskData)=>{
                if(themeData){
                  const options: { value: string; label: string }[] = [
                    { value: '--', label: 'Все темы' },
                    ...themeData.data.map(item => ({
                      value: item.id,
                      label: item.title
                    }))
                  ];
                  setSelected(options[0])
                  setOptions(options)
                }
                setTask(taskData?.data)
                setAllTheme(taskData?.data)
                setCourse(data?.data.member[0].class)
                setRole(data?.data.member[0].role)
                setAllTask(allTaskData?.data)
                setLoading(false)
              })
            })
        })
      })
  }, [id.id, store])

  const handleChange = (option: any) => {
    setSelected(option);
    if(option.value==="--"){
      setTask(allTheme)       
    }else if(option.value!=="--"){
      const selectedData = allTheme.filter((item: { id: any }) => item.id === option.value);
      setTask(selectedData)       
    }
  };

  const [openModalTheme, setOpenModalTheme] = useState(false)
  const handleCloseThemeModal = () => {
      setOpenModalTheme(false);
  }
  if(loading){
    return(
        <div style={{width:'100%', paddingTop:'10rem', paddingBottom:'20rem'}}>
            <div style={{display:'flex', width:'100%'}}>
                <div style={{margin:'0 auto', marginTop:'5rem', textAlign:'center'}}>
                    <PropagateLoader color="#335DFF" style={{marginLeft:'-15px'}}/>
                </div>
            </div>
        </div>
    )
}
  return (
    <div className="classroom-task">
      <div className="classroom-task__body">
        <div className="classroom-task__body__button-cont">
          {role.name==='teacher'&&(
            <div className="button">
              <button style={{background:course.decor}} onClick={()=>setOpenModalTheme(true)}>Добавить тему</button>
            </div>
          )}
          {openModalTheme&&(
            <ModalTheme show={openModalTheme} onClose={handleCloseThemeModal} theme='' course={id.id}/>
          )}
          <Select
            options={options}
            className='select'
            defaultValue={options[0]}
            value={selected}
            onChange={handleChange}/>
        </div>
        {selected.value==='--'&&(
          <div className="classroom-task__body__task-body-no-theme">
            <TaskMap task={allTask} role={role}/>
          </div>
        )}
        <div className="classroom-task__body__theme-body">
          <ThemeMap theme={task} role={role}/>
        </div>
      </div>
    </div>
  )
}

export default observer(ClassroomTask)
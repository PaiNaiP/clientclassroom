import { observer } from 'mobx-react-lite'
import React, { useContext, useEffect, useState } from 'react'
import { Context } from '..'
import { useNavigate, useParams } from 'react-router-dom'
import { PropagateLoader } from 'react-spinners'
import { ComplementaryMap } from './ComplementaryMap'
import { IoMail } from 'react-icons/io5'

const TaskStudentWork = () => {
    const navigation = useNavigate()
    const {store} = useContext(Context)
    const id = useParams()
    const [loading, setLoading] = useState<boolean>(true)
    const [complementary, setComplementary] = useState<any>()
    const [decor, setDecor] = useState<any>()
    const [task, setTask] = useState<any>()
    useEffect(() => {
        if(id.id)
        store.getAllComplementary(id.id).then((data)=>{
            if(id.id)
            store.viewTaskOne(id.id, store.user.id).then((tasks)=>{
                setComplementary(data?.data)
                setDecor(tasks?.data.class.decor)
                setTask(tasks?.data.class.task[0])
                setLoading(false)
            })
        })
    }, [id.id, store])
    
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
    <div className="task-work">
        <div className="task-work__body">
            <IoMail style={{fontSize:'26px', color:decor}} onClick={()=>navigation(`/m/${task.id}`)}/>
            <table rules='rows'>
                <tr>
                    <th style={{width:'80%'}}>Учащиеся</th>
                    <th>Статус работы</th>
                </tr>
                <ComplementaryMap complementary={complementary} task={task}/>
            </table>
        </div>
    </div>
  )
}
export default observer(TaskStudentWork)
import { observer } from 'mobx-react-lite'
import React, {useContext, useEffect, useState} from 'react'
import { Context } from '..'
import { useParams } from 'react-router-dom'
import { PropagateLoader } from 'react-spinners'
import {HiOutlineUserAdd} from 'react-icons/hi'
import { UserMap } from './UserMap'
import AddUserToClass from './AddUserToClass'
import AddGroupToClass from './AddGroupToClass'

const ClassroomUsers = () => {
    const {store} = useContext(Context)
    const id = useParams()
    const [course, setCourse] = useState<any>()
    const [role, setRole] = useState<any>()
    const [teacher, setTeacher] = useState<any>()
    const [student, setStudent] = useState<any>()
    const [loading, setLoading] = useState<boolean>(true)
    const [openModalUsersTeacher, setOpenModalUsersTeacher] = useState(false)
    const [openModalUsersStudent, setOpenModalUsersStudent] = useState(false)
    const [openModalGroup, setOpenModalGroup] = useState(false)
    useEffect(() => {
        if(id.id)
        store.getCourseOne(id.id, store.user.id).then((data)=>{
            if(id.id)
                store.viewTeacher(id.id).then((teacherData)=>{
                    if(id.id)
                        store.viewStudent(id.id).then((studentData)=>{
                            setTeacher(teacherData?.data)
                            setStudent(studentData?.data)
                            setCourse(data?.data.member[0].class)
                            setRole(data?.data.member[0].role)
                            setLoading(false)
                        })
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

    const handleCloseModalClassTeacher = () => {
        setOpenModalUsersTeacher(false);
    }

    const handleCloseModalClassStudent = () => {
        setOpenModalUsersStudent(false);
    }

    const handleAddGroupToClassroom = () => {
        setOpenModalGroup(false);
    }

    const handleRemoveStudent = () => {    
        if(id.id)
        store.viewStudent(id.id).then((studentData)=>{
            setStudent(studentData?.data)
        })
    };

    const handleRemoveTeacher = () => {    
        if(id.id)
        store.viewTeacher(id.id).then((teacherData)=>{
            setTeacher(teacherData?.data)
        })
    };
  return (
    <div className="classroom-users">
        <div className="classroom-users__teacher-body">
            <div className="classroom-users__teacher-body__header"
            style={{color:course.decor, borderBottom:`2px solid ${course.decor}`}}>
                <h1 style={{width:'98%'}}>Преподаватели</h1>
                {role.name==="teacher"&&(
                    <HiOutlineUserAdd 
                    style={{fontSize:'24px', marginTop:'35px'}}
                    onClick={()=>setOpenModalUsersTeacher(true)}/>
                )}
            </div>
            {teacher&&(
                <UserMap userList={teacher} author={course} onRemoveUser={handleRemoveTeacher}role={role} />
            )}
            {openModalUsersTeacher&&(
                <AddUserToClass show={openModalUsersTeacher} onClose={handleCloseModalClassTeacher} id={id.id} role='teacher'/>
            )}
        </div>
        <div className="classroom-users__teacher-body">
            <div className="classroom-users__teacher-body__header"
            style={{color:course.decor, borderBottom:`2px solid ${course.decor}`}}>
                <h1 style={{width:'100%'}}>Учащиеся</h1>
                {role.name==="teacher"&&(
                <div className="dropdown">
                        <button className='dropdown__button__normal' style={{marginLeft:'10px'}}>
                            <HiOutlineUserAdd style={{fontSize:'24px', 
                            marginTop:'35px', 
                            color:course.decor,
                            paddingLeft:'10px'}}/>                            
                        </button>
                        <div className="dropdown__content">
                        <div className="dropdownline" onClick={()=>setOpenModalUsersStudent(true)}>Добавить учащегося</div>
                        <div className="dropdownline" onClick={()=>setOpenModalGroup(true)}>Добавить группу</div>
                    </div>
                    {openModalUsersStudent&&(
                        <AddUserToClass show={openModalUsersStudent} onClose={handleCloseModalClassStudent} id={id.id} role='student'/>
                    )}
                    {openModalGroup&&(
                        <AddGroupToClass show={openModalGroup} onClose={handleAddGroupToClassroom}/>
                    )}
                </div> 
                )}
            </div>
            {student&&(
                <UserMap userList={student} author={course} onRemoveUser={handleRemoveStudent} role={role}/>
            )}
        </div>
    </div>
  )
}
export default observer(ClassroomUsers)